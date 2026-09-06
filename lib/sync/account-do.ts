import { DurableObject } from "cloudflare:workers";
import {
  Crc32cAccumulator,
  MAX_FRAME_BYTES,
  MessageType,
  RejectionCode,
  decodeFrame,
  decodeStrictHello,
  decodeMutationBatchEnvelope,
  decodeMutationRecord,
  encodeDetailedAcknowledgement,
  encodeFrame,
  encodeMutationRecord,
  encodeRevisionedDeltaBatchFrame,
  encodeRejectionFrame,
  encodeSnapshotBeginFrame,
  encodeSnapshotChunkFrame,
  encodeSnapshotEndFrame,
} from "./codec";
import {
  AccountDataCoordinator,
  type AccountMutation,
  type CanonicalAccountData,
  type BootstrapStartResult,
  type BootstrapSessionResult,
  type BootstrapSessionStatus,
} from "./account-data";
import { progressSolvedSlugs, problemNoteText, type ActorId } from "./domain";
import { accountRouteName, assertAccountRouteName } from "./account-route";
import { isAccountDeleted } from "./account-deletion";
import { committedProblemRegistry } from "../problem-registry";
import {
  asAccountMutation,
  asMutationRecord,
  snapshotCounts,
  snapshotNonce,
  snapshotRecords,
  validSnapshotNonce,
} from "./http";
import type { LoroDoc } from "loro-crdt";
import {
  recordTransportDiagnostic,
  rejectionForFailure,
  transportFailure,
} from "./transport-diagnostics";

type AccountEnvironment = { DB: D1Database; SYNC_HMAC_SECRET?: string };

type SocketAttachment = {
  accountId: string;
  actorId: string | null;
  bootstrapId: string | null;
  expiresAt: number;
  phase: "awaiting_hello" | "awaiting_upload" | "awaiting_confirm" | "live";
  revision: string;
  clientBootstrapId: string | null;
  pendingBatchCount: number;
  receivedBatchCount: number;
  hello?: {
    actorId: number[];
    revocationHandleHash: number[];
    lastServerRevision: string;
    causalSummary: { actorId: number[]; counter: string }[];
  };
};

type LoroUpdateRow = { revision: number; update: Uint8Array };

type LoroSnapshotRow = {
  revision: number;
  snapshot: Uint8Array;
};

type LoroUpdatesResult = {
  revision: number;
  snapshot: LoroSnapshotRow | null;
  updates: LoroUpdateRow[];
};

const SOCKET_EXPIRY_CODE = 4001;
const SOCKET_PROTOCOL_CODE = 4002;
const SOCKET_AUTH_CODE = 4003;
const SOCKET_CAP_CODE = 4008;
const MAX_ACCOUNT_SOCKETS = 16;
const MAX_ACTOR_SOCKETS = 8;
const MAX_LORO_UPDATE_BYTES = 512 * 1024;
const MAX_LORO_ACCOUNT_BYTES = 16 * 1024 * 1024;
const LORO_MIGRATION_PENDING_REVISIONS = 0;
const LORO_COMPACTION_UPDATE_BYTES = 1024 * 1024;
const LORO_COMPACTION_UPDATE_COUNT = 128;

function toBytes(value: unknown, label: string): Uint8Array {
  if (value instanceof Uint8Array) return value.slice();
  if (value instanceof ArrayBuffer) return new Uint8Array(value).slice();
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength).slice();
  }
  if (Object.prototype.toString.call(value) === "[object ArrayBuffer]") {
    return new Uint8Array(value as ArrayBuffer).slice();
  }
  throw new Error(`${label} must be binary`);
}

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`invalid ${label}`);
}

function zeroId(): Uint8Array {
  return new Uint8Array(16);
}

function equalId(left: Uint8Array | ArrayBuffer, right: Uint8Array | ArrayBuffer): boolean {
  const a = left instanceof ArrayBuffer ? new Uint8Array(left) : left;
  const b = right instanceof ArrayBuffer ? new Uint8Array(right) : right;
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

function actorKey(value: Uint8Array | ArrayBuffer): string {
  const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function base64Url(value: Uint8Array | ArrayBuffer): string {
  let text = "";
  const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function socketBytes(message: string | ArrayBuffer): Uint8Array | null {
  if (typeof message === "string") return null;
  return message instanceof ArrayBuffer ? new Uint8Array(message) : null;
}

export class AccountData extends DurableObject<AccountEnvironment> {
  private readonly coordinator: AccountDataCoordinator;
  private readonly loroMigrations = new Map<string, Promise<void>>();

  constructor(ctx: DurableObjectState, env: AccountEnvironment) {
    super(ctx, env);
    this.coordinator = new AccountDataCoordinator(
      env,
      (event) => this.broadcast(event),
      undefined,
      async (accountId) => {
        if (!env.SYNC_HMAC_SECRET) return false;
        return isAccountDeleted(
          { DB: env.DB },
          await accountRouteName(env.SYNC_HMAC_SECRET, accountId)
        );
      }
    );
  }

  private routeName(): string | null {
    const name = (this.ctx.id as DurableObjectState["id"] & { name?: string }).name;
    if (name === undefined) return null;
    return assertAccountRouteName(name);
  }

  private loro() {
    return import("./loro-account");
  }

  private async verifyAccountRoute(accountId: string): Promise<void> {
    const name = this.routeName();
    if (!name) return;
    if (!this.env.SYNC_HMAC_SECRET) throw new Error("sync route secret is unavailable");
    if ((await accountRouteName(this.env.SYNC_HMAC_SECRET, accountId)) !== name) {
      throw new Error("Durable Object account route mismatch");
    }
  }

  private async prepareRpc(accountId: string, allowDeleted = false): Promise<void> {
    await this.verifyAccountRoute(accountId);
    if (!allowDeleted && (await this.deleted(accountId))) {
      throw new Error("Account has been deleted");
    }
  }

  private async deleted(accountId: string): Promise<boolean> {
    if (!this.env.SYNC_HMAC_SECRET) return false;
    return isAccountDeleted(
      { DB: this.env.DB },
      await accountRouteName(this.env.SYNC_HMAC_SECRET, accountId)
    );
  }

  private async loroMigrationComplete(accountId: string): Promise<boolean> {
    const row = await this.env.DB.prepare(
      "SELECT completed_revision FROM sync_loro_migrations WHERE account_id = ?"
    )
      .bind(accountId)
      .first<{ completed_revision: unknown }>();
    return row !== null;
  }

  private async ensureLoroMigration(accountId: string): Promise<void> {
    const existing = this.loroMigrations.get(accountId);
    if (existing) return existing;
    const migration = this.performLoroMigration(accountId);
    this.loroMigrations.set(accountId, migration);
    try {
      await migration;
    } finally {
      this.loroMigrations.delete(accountId);
    }
  }

  private async performLoroMigration(accountId: string): Promise<void> {
    if (await this.loroMigrationComplete(accountId)) return;
    const canonical = await this.coordinator.getCanonical(accountId);
    const notes: Map<string, string> = new Map();
    for (const [slug, record] of canonical.notes.notes) {
      const text = problemNoteText(record);
      if (text) notes.set(slug, text);
    }

    const { createLoroAccountDocument, hydrateFromCanonical } = await this.loro();
    const doc = createLoroAccountDocument();
    hydrateFromCanonical(
      doc,
      committedProblemRegistry,
      progressSolvedSlugs(canonical.progress),
      notes
    );
    const snapshotBytes = doc.export({ mode: "snapshot" });
    if (snapshotBytes.byteLength > MAX_LORO_ACCOUNT_BYTES)
      throw new Error("Loro account snapshot exceeds size limit");
    const now = Math.floor(Date.now() / 1000);
    const rows: D1PreparedStatement[] = [
      this.env.DB.prepare(
        "INSERT INTO sync_loro_snapshots (account_id, revision, snapshot, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(account_id) DO UPDATE SET revision = excluded.revision, snapshot = excluded.snapshot, updated_at = excluded.updated_at"
      ).bind(accountId, LORO_MIGRATION_PENDING_REVISIONS, snapshotBytes, now),
      this.env.DB.prepare("DELETE FROM sync_loro_updates WHERE account_id = ?").bind(accountId),
      this.env.DB.prepare(
        "INSERT INTO sync_loro_migrations (account_id, completed_revision) VALUES (?, ?) ON CONFLICT(account_id) DO UPDATE SET completed_revision = excluded.completed_revision"
      ).bind(accountId, LORO_MIGRATION_PENDING_REVISIONS),
    ];
    await this.env.DB.batch(rows);
  }

  private async currentLoroState(accountId: string): Promise<LoroSnapshotRow> {
    await this.ensureLoroMigration(accountId);
    const [snapshotRow, updateRow] = await Promise.all([
      this.env.DB.prepare("SELECT revision, snapshot FROM sync_loro_snapshots WHERE account_id = ?")
        .bind(accountId)
        .first<LoroSnapshotRow & { revision: unknown; snapshot: unknown }>(),
      this.env.DB.prepare(
        "SELECT revision FROM sync_loro_updates WHERE account_id = ? ORDER BY revision DESC LIMIT 1"
      )
        .bind(accountId)
        .first<{ revision: unknown }>(),
    ]);
    if (!snapshotRow) throw new Error("Loro snapshot is unavailable");
    const snapshotRevision = Number(snapshotRow.revision);
    assertNonNegativeInteger(snapshotRevision, "loro snapshot revision");
    const updateRevision =
      updateRow && updateRow.revision != null ? Number(updateRow.revision) : snapshotRevision;
    assertNonNegativeInteger(updateRevision, "loro update revision");
    const revision = updateRevision > snapshotRevision ? updateRevision : snapshotRevision;
    return { revision, snapshot: toBytes(snapshotRow.snapshot, "loro snapshot") };
  }

  private async loadLoroDocument(accountId: string): Promise<{
    state: LoroSnapshotRow;
    document: LoroDoc;
  }> {
    const {
      importAndValidateLoroAccountUpdate,
      loadLoroAccountSnapshot,
      validateLoroAccountDocument,
    } = await this.loro();
    const state = await this.currentLoroState(accountId);
    const document = loadLoroAccountSnapshot(state.snapshot);
    const updates = await this.env.DB.prepare(
      "SELECT update_data FROM sync_loro_updates WHERE account_id = ? ORDER BY revision"
    )
      .bind(accountId)
      .all<{ update_data: unknown }>();
    for (const row of updates.results ?? []) {
      importAndValidateLoroAccountUpdate(
        document,
        toBytes(row.update_data, "loro update data"),
        committedProblemRegistry
      );
    }
    validateLoroAccountDocument(document, committedProblemRegistry);
    return { state, document };
  }

  private async compactLoroUpdates(
    accountId: string,
    revision: number,
    document: LoroDoc,
    totalBytes: number,
    updateCount: number
  ): Promise<void> {
    if (totalBytes < LORO_COMPACTION_UPDATE_BYTES && updateCount < LORO_COMPACTION_UPDATE_COUNT) {
      return;
    }
    const snapshot = document.export({ mode: "snapshot" });
    if (!snapshot.byteLength || snapshot.byteLength > MAX_LORO_ACCOUNT_BYTES) {
      throw new Error("Loro account snapshot exceeds size limit");
    }
    const now = Math.floor(Date.now() / 1000);
    await this.env.DB.batch([
      this.env.DB.prepare(
        "UPDATE sync_loro_snapshots SET revision = ?, snapshot = ?, updated_at = ? WHERE account_id = ?"
      ).bind(revision, snapshot, now, accountId),
      this.env.DB.prepare("DELETE FROM sync_loro_updates WHERE account_id = ?").bind(accountId),
    ]);
  }

  private async ensureLoroFromCanonical(accountId: string): Promise<void> {
    const canonical = await this.coordinator.getCanonical(accountId);
    const notes = new Map<string, string>();
    for (const [slug, note] of canonical.notes.notes) {
      const text = problemNoteText(note);
      if (text) notes.set(slug, text);
    }
    const { hydrateFromCanonical, validateLoroAccountDocument } = await this.loro();
    const { document } = await this.loadLoroDocument(accountId);
    const before = document.oplogVersion();
    hydrateFromCanonical(
      document,
      committedProblemRegistry,
      progressSolvedSlugs(canonical.progress),
      notes
    );
    validateLoroAccountDocument(document, committedProblemRegistry);
    const update = document.export({ mode: "update", from: before });
    if (update.byteLength) await this.appendLoroUpdate(accountId, update);
  }

  private attachment(socket: WebSocket): SocketAttachment | null {
    const value = socket.deserializeAttachment();
    if (!value || typeof value !== "object") return null;
    return value as SocketAttachment;
  }

  private send(socket: WebSocket, bytes: Uint8Array): boolean {
    try {
      socket.send(bytes.slice().buffer);
      return true;
    } catch {
      return false;
    }
  }

  private close(socket: WebSocket, code: number): void {
    try {
      socket.close(code, "");
    } catch {
      // The socket may already be closed.
    }
  }

  private async scheduleSocketExpiry(): Promise<void> {
    let earliest: number | undefined;
    for (const socket of this.ctx.getWebSockets()) {
      const attachment = this.attachment(socket);
      if (!attachment) continue;
      earliest =
        earliest === undefined ? attachment.expiresAt : Math.min(earliest, attachment.expiresAt);
    }
    if (earliest === undefined) await this.ctx.storage.deleteAlarm();
    else await this.ctx.storage.setAlarm(earliest * 1000);
  }

  private broadcast(event: {
    kind: "actor" | "mutation";
    changes?: readonly { revision: bigint; mutation: AccountMutation }[];
  }): void {
    const changes = event.changes ?? [];
    for (const socket of this.ctx.getWebSockets()) {
      const attachment = this.attachment(socket);
      if (!attachment || attachment.phase !== "live") continue;
      if (event.kind === "actor") {
        this.send(
          socket,
          encodeRejectionFrame({ code: RejectionCode.TRANSIENT_FAILURE, itemIndex: null })
        );
        this.close(socket, SOCKET_PROTOCOL_CODE);
        continue;
      }
      for (const change of changes) {
        if (
          !this.send(
            socket,
            encodeRevisionedDeltaBatchFrame([
              {
                serverRevision: change.revision,
                record: encodeMutationRecord(asMutationRecord(change.mutation)),
              },
            ])
          )
        ) {
          this.close(socket, SOCKET_PROTOCOL_CODE);
          break;
        }
      }
    }
  }

  private async handleHello(
    socket: WebSocket,
    attachment: SocketAttachment,
    frame: Uint8Array
  ): Promise<void> {
    const hello = decodeStrictHello(frame);
    const actorId = actorKey(hello.actorId);
    const existingActorSockets = this.ctx.getWebSockets().filter((candidate) => {
      if (candidate === socket) return false;
      return this.attachment(candidate)?.actorId === actorId;
    }).length;
    if (existingActorSockets >= MAX_ACTOR_SOCKETS) {
      this.close(socket, SOCKET_CAP_CODE);
      return;
    }
    const bootstrapBytes = crypto.getRandomValues(new Uint8Array(16));
    const bootstrapId = base64Url(bootstrapBytes);
    const started = await this.coordinator.beginBootstrap(
      attachment.accountId,
      bootstrapId,
      attachment.expiresAt,
      hello.actorId,
      hello.revocationHandleHash,
      hello.lastServerRevision,
      hello.causalSummary,
      hello.pendingBatchCount
    );
    if (started.status === "rejected") {
      this.send(
        socket,
        encodeRejectionFrame({ code: RejectionCode.INVALID_RECORD, itemIndex: null })
      );
      this.close(socket, SOCKET_PROTOCOL_CODE);
      return;
    }
    attachment.actorId = actorId;
    attachment.bootstrapId = bootstrapId;
    attachment.clientBootstrapId = hello.bootstrapId
      ? base64Url(new Uint8Array(hello.bootstrapId))
      : null;
    attachment.pendingBatchCount = hello.pendingBatchCount ?? 0;
    attachment.receivedBatchCount = 0;
    attachment.hello = {
      actorId: Array.from(new Uint8Array(hello.actorId)),
      revocationHandleHash: Array.from(new Uint8Array(hello.revocationHandleHash)),
      lastServerRevision: hello.lastServerRevision.toString(10),
      causalSummary: hello.causalSummary.map((entry) => ({
        actorId: Array.from(new Uint8Array(entry.actorId)),
        counter: entry.counter.toString(10),
      })),
    };
    attachment.phase = attachment.pendingBatchCount > 0 ? "awaiting_upload" : "awaiting_confirm";
    attachment.revision = started.revision.toString(10);
    socket.serializeAttachment(attachment);
    if (attachment.pendingBatchCount > 0) return;
    await this.streamSnapshot(socket, attachment, started.snapshot, bootstrapBytes, bootstrapId);
  }

  private async streamSnapshot(
    socket: WebSocket,
    attachment: SocketAttachment,
    snapshot: CanonicalAccountData,
    bootstrapBytes: Uint8Array,
    bootstrapId: string
  ): Promise<void> {
    const nonce = await snapshotNonce(
      this.env.SYNC_HMAC_SECRET ?? "",
      attachment.accountId,
      BigInt(attachment.revision),
      bootstrapBytes,
      () => Date.now(),
      (size) => crypto.getRandomValues(new Uint8Array(size))
    );
    const { recordCount, totalLength } = snapshotCounts(snapshot);
    if (
      !this.send(
        socket,
        encodeSnapshotBeginFrame({
          revision: BigInt(attachment.revision),
          actorCount: snapshot.actors.size,
          progressShardCount: snapshot.shards.size,
          problemNoteCount: snapshot.notes.notes.size,
          chunkCount: recordCount,
          totalLength,
        })
      )
    )
      return;
    let index = 0;
    const checksum = new Crc32cAccumulator();
    for (const record of snapshotRecords(snapshot)) {
      checksum.update(record);
      if (!this.send(socket, encodeSnapshotChunkFrame({ index, records: [record] }))) return;
      index++;
    }
    const status = await this.coordinator.bootstrapStatus(attachment.accountId, bootstrapId);
    if (!this.send(socket, encodeSnapshotEndFrame(checksum.digest()))) return;
    if (status.overflowed) {
      this.send(
        socket,
        encodeRejectionFrame({ code: RejectionCode.TRANSIENT_FAILURE, itemIndex: null })
      );
      this.close(socket, SOCKET_PROTOCOL_CODE);
      return;
    }
    this.send(socket, encodeFrame(MessageType.SNAPSHOT_CONFIRM, nonce));
  }

  private sendMutationAcknowledgement(
    socket: WebSocket,
    requestId: Uint8Array | ArrayBuffer,
    records: readonly AccountMutation[],
    result: Awaited<ReturnType<AccountDataCoordinator["applyMutations"]>>
  ): void {
    const outcomes = result.results.map((entry, index) => {
      let mutation = records[index];
      if (!entry.accepted && mutation.type === "note" && entry.current) {
        const current = entry.current.notes.notes.get(mutation.mutation.slug);
        if (current) {
          mutation = {
            type: "note",
            mutation: {
              slug: current.slug,
              actorId: current.actorId,
              localRevision: current.localRevision,
              operation:
                current.operation.kind === "delete"
                  ? { kind: "delete" }
                  : { kind: "value", bytes: current.operation.bytes },
            },
          };
        }
      }
      return {
        status: entry.accepted ? ("accepted" as const) : ("stale" as const),
        serverRevision: entry.serverRevision,
        record: encodeMutationRecord(asMutationRecord(mutation)),
      };
    });
    this.send(
      socket,
      encodeDetailedAcknowledgement({
        requestId,
        serverRevision: result.serverRevision,
        outcomes,
      })
    );
  }

  private async handleMessage(socket: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const attachment = this.attachment(socket);
    if (!attachment) {
      await recordTransportDiagnostic({
        eventCode: "connection_closed",
        failureCode: "authentication_invalid",
        protocolVersion: 1,
      });
      this.close(socket, SOCKET_AUTH_CODE);
      return;
    }
    if (Math.floor(Date.now() / 1000) >= attachment.expiresAt) {
      await recordTransportDiagnostic({
        eventCode: "connection_closed",
        failureCode: "authentication_expired",
        protocolVersion: 1,
        accountId: attachment.accountId,
      });
      this.close(socket, SOCKET_EXPIRY_CODE);
      return;
    }
    let deleted: boolean;
    try {
      deleted = await this.deleted(attachment.accountId);
    } catch (error) {
      const failure = transportFailure(error);
      await recordTransportDiagnostic({
        eventCode: "connection_closed",
        failureCode: failure.code,
        protocolVersion: 1,
        accountId: attachment.accountId,
      });
      this.close(socket, SOCKET_PROTOCOL_CODE);
      return;
    }
    if (deleted) {
      await recordTransportDiagnostic({
        eventCode: "connection_closed",
        failureCode: "account_deleted",
        protocolVersion: 1,
        accountId: attachment.accountId,
      });
      this.send(
        socket,
        encodeRejectionFrame({ code: RejectionCode.ACCOUNT_DELETED, itemIndex: null })
      );
      this.close(socket, SOCKET_PROTOCOL_CODE);
      return;
    }
    const bytes = socketBytes(message);
    if (!bytes || bytes.length > MAX_FRAME_BYTES) {
      await recordTransportDiagnostic({
        eventCode: "connection_closed",
        failureCode: bytes ? "frame_too_large" : "malformed_frame",
        protocolVersion: 1,
        byteCount: bytes?.length,
        accountId: attachment.accountId,
      });
      this.close(socket, SOCKET_PROTOCOL_CODE);
      return;
    }
    let frame;
    try {
      frame = decodeFrame(bytes);
    } catch (error) {
      const failure = transportFailure(error);
      await recordTransportDiagnostic({
        eventCode: "connection_closed",
        failureCode: failure.code,
        protocolVersion: 1,
        byteCount: bytes.length,
        accountId: attachment.accountId,
      });
      this.close(socket, SOCKET_PROTOCOL_CODE);
      return;
    }
    try {
      if (attachment.phase === "awaiting_hello") {
        if (frame.type !== MessageType.HELLO) {
          this.close(socket, SOCKET_PROTOCOL_CODE);
          return;
        }
        await this.handleHello(socket, attachment, frame.payload);
        return;
      }
      if (attachment.phase === "awaiting_upload" && frame.type === MessageType.MUTATION_BATCH) {
        if (!attachment.clientBootstrapId || !attachment.bootstrapId || !attachment.hello) {
          this.close(socket, SOCKET_PROTOCOL_CODE);
          return;
        }
        const envelope = decodeMutationBatchEnvelope(encodeFrame(frame.type, frame.payload));
        if (
          base64Url(new Uint8Array(envelope.bootstrapId)) !== attachment.clientBootstrapId ||
          envelope.batchCount !== attachment.pendingBatchCount ||
          envelope.batchIndex !== attachment.receivedBatchCount
        ) {
          this.close(socket, SOCKET_PROTOCOL_CODE);
          return;
        }
        const records = envelope.changes.map((record) =>
          asAccountMutation(decodeMutationRecord(record))
        );
        const result = await this.coordinator.applyBootstrapBatch(
          attachment.accountId,
          attachment.bootstrapId,
          envelope.batchIndex,
          envelope.batchCount,
          records
        );
        this.sendMutationAcknowledgement(socket, envelope.requestId, records, result);
        const status = await this.coordinator.bootstrapStatus(
          attachment.accountId,
          attachment.bootstrapId
        );
        attachment.receivedBatchCount = status.receivedBatchCount;
        socket.serializeAttachment(attachment);
        if (status.receivedBatchCount !== status.expectedBatchCount) return;

        await this.coordinator.abortBootstrap(attachment.accountId, attachment.bootstrapId);
        const stored = attachment.hello;
        const bootstrapBytes = crypto.getRandomValues(new Uint8Array(16));
        const bootstrapId = base64Url(bootstrapBytes);
        const started = await this.coordinator.beginBootstrap(
          attachment.accountId,
          bootstrapId,
          attachment.expiresAt,
          Uint8Array.from(stored.actorId),
          Uint8Array.from(stored.revocationHandleHash),
          BigInt(stored.lastServerRevision),
          stored.causalSummary.map((entry) => ({
            actorId: Uint8Array.from(entry.actorId),
            counter: BigInt(entry.counter),
          }))
        );
        if (started.status === "rejected") {
          this.send(
            socket,
            encodeRejectionFrame({ code: RejectionCode.INVALID_RECORD, itemIndex: null })
          );
          this.close(socket, SOCKET_PROTOCOL_CODE);
          return;
        }
        attachment.bootstrapId = bootstrapId;
        attachment.phase = "awaiting_confirm";
        attachment.revision = started.revision.toString(10);
        socket.serializeAttachment(attachment);
        await this.streamSnapshot(
          socket,
          attachment,
          started.snapshot,
          bootstrapBytes,
          bootstrapId
        );
        return;
      }
      if (
        frame.type === MessageType.HELLO ||
        frame.type === MessageType.SNAPSHOT_BEGIN ||
        frame.type === MessageType.SNAPSHOT_CHUNK ||
        frame.type === MessageType.SNAPSHOT_END
      ) {
        this.close(socket, SOCKET_PROTOCOL_CODE);
        return;
      }
      if (frame.type === MessageType.SNAPSHOT_CONFIRM) {
        if (attachment.phase !== "awaiting_confirm" || !attachment.bootstrapId) {
          this.close(socket, SOCKET_PROTOCOL_CODE);
          return;
        }
        const verified = await validSnapshotNonce(
          this.env.SYNC_HMAC_SECRET ?? "",
          attachment.accountId,
          frame.payload,
          () => Date.now()
        );
        if (
          !verified ||
          verified.revision !== BigInt(attachment.revision) ||
          base64Url(verified.sessionId) !== attachment.bootstrapId
        ) {
          this.send(
            socket,
            encodeRejectionFrame({ code: RejectionCode.TRANSIENT_FAILURE, itemIndex: null })
          );
          this.close(socket, SOCKET_PROTOCOL_CODE);
          return;
        }
        const result = await this.coordinator.confirmBootstrap(
          attachment.accountId,
          attachment.bootstrapId,
          verified.revision
        );
        if (result.status === "restart") {
          this.send(
            socket,
            encodeRejectionFrame({ code: RejectionCode.TRANSIENT_FAILURE, itemIndex: null })
          );
          this.close(socket, SOCKET_PROTOCOL_CODE);
          return;
        }
        attachment.phase = "live";
        attachment.revision = result.serverRevision.toString(10);
        attachment.bootstrapId = null;
        socket.serializeAttachment(attachment);
        this.send(
          socket,
          encodeDetailedAcknowledgement({
            requestId: attachment.clientBootstrapId
              ? Uint8Array.from(
                  atob(attachment.clientBootstrapId.replaceAll("-", "+").replaceAll("_", "/")),
                  (char) => char.charCodeAt(0)
                )
              : zeroId(),
            serverRevision: result.serverRevision,
            outcomes: [],
          })
        );
        for (const change of result.mutations.sort((left, right) =>
          left.revision < right.revision ? -1 : left.revision > right.revision ? 1 : 0
        )) {
          this.send(
            socket,
            encodeRevisionedDeltaBatchFrame([
              {
                serverRevision: change.revision,
                record: encodeMutationRecord(asMutationRecord(change.mutation)),
              },
            ])
          );
        }
        return;
      }
      if (frame.type === MessageType.MUTATION_BATCH) {
        const envelope = decodeMutationBatchEnvelope(encodeFrame(frame.type, frame.payload));
        if (
          !equalId(envelope.bootstrapId, zeroId()) ||
          envelope.batchIndex !== 0 ||
          envelope.batchCount !== 1
        ) {
          this.close(socket, SOCKET_PROTOCOL_CODE);
          return;
        }
        const records = envelope.changes.map((record) =>
          asAccountMutation(decodeMutationRecord(record))
        );
        const result = await this.coordinator.applyMutations(attachment.accountId, records);
        this.sendMutationAcknowledgement(socket, envelope.requestId, records, result);
        return;
      }
      this.close(socket, SOCKET_PROTOCOL_CODE);
    } catch (error) {
      const failure = transportFailure(error);
      await recordTransportDiagnostic({
        eventCode: "request_rejected",
        failureCode: failure.code,
        protocolVersion: 1,
        messageType: frame.type,
        byteCount: bytes.length,
        accountId: attachment.accountId,
      });
      const code = rejectionForFailure(failure.code);
      this.send(socket, encodeRejectionFrame({ code, itemIndex: null }));
      this.close(socket, SOCKET_PROTOCOL_CODE);
    }
  }

  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET" || request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return new Response(null, { status: 426 });
    }
    const accountId = request.headers.get("x-cjet-account-id");
    const route = request.headers.get("x-cjet-route");
    const expiry = Number(request.headers.get("x-cjet-session-expiry"));
    if (
      !accountId ||
      !route ||
      !Number.isSafeInteger(expiry) ||
      expiry <= Math.floor(Date.now() / 1000)
    ) {
      return new Response(null, { status: 403 });
    }
    try {
      await this.verifyAccountRoute(accountId);
      if (await this.deleted(accountId)) {
        return new Response(
          encodeRejectionFrame({ code: RejectionCode.ACCOUNT_DELETED, itemIndex: null })
            .buffer as ArrayBuffer,
          { status: 410, headers: { "content-type": "application/octet-stream" } }
        );
      }
      if (
        !this.env.SYNC_HMAC_SECRET ||
        route !== (await accountRouteName(this.env.SYNC_HMAC_SECRET, accountId))
      ) {
        return new Response(null, { status: 403 });
      }
    } catch (error) {
      const failure = transportFailure(error);
      await recordTransportDiagnostic({
        eventCode: "request_rejected",
        failureCode: failure.code,
        protocolVersion: 1,
        accountId,
      });
      return new Response(null, { status: 403 });
    }
    const sockets = this.ctx.getWebSockets();
    if (sockets.length >= MAX_ACCOUNT_SOCKETS) return new Response(null, { status: 429 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({
      accountId,
      actorId: null,
      bootstrapId: null,
      expiresAt: expiry,
      phase: "awaiting_hello",
      revision: "0",
      clientBootstrapId: null,
      pendingBatchCount: 0,
      receivedBatchCount: 0,
    } satisfies SocketAttachment);
    await this.scheduleSocketExpiry();
    return new Response(null, { status: 101, webSocket: client } as ResponseInit & {
      webSocket: WebSocket;
    });
  }

  async webSocketMessage(socket: WebSocket, message: string | ArrayBuffer): Promise<void> {
    await this.handleMessage(socket, message);
  }

  async webSocketClose(): Promise<void> {
    await this.scheduleSocketExpiry();
  }

  async webSocketError(): Promise<void> {
    await this.scheduleSocketExpiry();
  }

  async alarm(): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    for (const socket of this.ctx.getWebSockets()) {
      const attachment = this.attachment(socket);
      if (attachment && attachment.expiresAt <= now) this.close(socket, SOCKET_EXPIRY_CODE);
    }
    await this.scheduleSocketExpiry();
  }

  async registerActor(
    accountId: string,
    actorId: ActorId | ArrayBuffer,
    revocationHandleHash: Uint8Array | ArrayBuffer
  ) {
    await this.prepareRpc(accountId);
    return this.coordinator.registerActor(accountId, actorId, revocationHandleHash);
  }

  async registerLegacyActor(accountId: string, revocationHandleHash: Uint8Array | ArrayBuffer) {
    await this.prepareRpc(accountId);
    return this.coordinator.registerLegacyActor(accountId, revocationHandleHash);
  }

  async getCanonical(accountId: string) {
    await this.prepareRpc(accountId);
    return this.coordinator.getCanonical(accountId);
  }

  async beginBootstrap(
    accountId: string,
    sessionId: string,
    expiresAt: number,
    actorId: ActorId | ArrayBuffer,
    revocationHandleHash: Uint8Array | ArrayBuffer,
    lastServerRevision = BigInt(0),
    causalSummary: readonly { actorId: ActorId | ArrayBuffer; counter: bigint }[] = [],
    pendingBatchCount = 0
  ): Promise<BootstrapStartResult> {
    await this.prepareRpc(accountId);
    return this.coordinator.beginBootstrap(
      accountId,
      sessionId,
      expiresAt,
      actorId,
      revocationHandleHash,
      lastServerRevision,
      causalSummary,
      pendingBatchCount
    );
  }

  bootstrapSnapshot(accountId: string, sessionId: string): Promise<CanonicalAccountData> {
    return this.prepareRpc(accountId).then(() =>
      this.coordinator.bootstrapSnapshot(accountId, sessionId)
    );
  }

  applyBootstrapBatch(
    accountId: string,
    sessionId: string,
    batchIndex: number,
    batchCount: number,
    mutations: readonly AccountMutation[]
  ) {
    return this.prepareRpc(accountId).then(() =>
      this.coordinator.applyBootstrapBatch(accountId, sessionId, batchIndex, batchCount, mutations)
    );
  }

  bootstrapStatus(accountId: string, sessionId: string): Promise<BootstrapSessionStatus> {
    return this.prepareRpc(accountId).then(() =>
      this.coordinator.bootstrapStatus(accountId, sessionId)
    );
  }

  async abortBootstrap(accountId: string, sessionId: string): Promise<void> {
    await this.prepareRpc(accountId);
    return this.coordinator.abortBootstrap(accountId, sessionId);
  }

  async confirmBootstrap(
    accountId: string,
    sessionId: string,
    revision: bigint
  ): Promise<BootstrapSessionResult> {
    await this.prepareRpc(accountId);
    return this.coordinator.confirmBootstrap(accountId, sessionId, revision);
  }

  async applyMutations(accountId: string, mutations: readonly AccountMutation[]) {
    await this.prepareRpc(accountId);
    const result = await this.coordinator.applyMutations(accountId, mutations);
    if (result.acceptedCount > 0 && (await this.loroMigrationComplete(accountId))) {
      await this.ensureLoroFromCanonical(accountId);
    }
    return result;
  }

  async loroUpdates(accountId: string, afterRevision = 0): Promise<LoroUpdatesResult> {
    await this.prepareRpc(accountId);
    assertNonNegativeInteger(afterRevision, "loro pull revision");
    await this.ensureLoroMigration(accountId);
    const state = await this.currentLoroState(accountId);
    const result = await this.env.DB.prepare(
      "SELECT revision, update_data, byte_length FROM sync_loro_updates WHERE account_id = ? AND revision > ? ORDER BY revision"
    )
      .bind(accountId, afterRevision)
      .all<{ revision: unknown; update_data: unknown; byte_length: unknown }>();
    const rows = result.results ?? [];
    const snapshotRevision = Number(
      (
        await this.env.DB.prepare("SELECT revision FROM sync_loro_snapshots WHERE account_id = ?")
          .bind(accountId)
          .first<{ revision: unknown }>()
      )?.revision
    );
    return {
      revision: state.revision,
      snapshot:
        afterRevision < snapshotRevision
          ? { revision: snapshotRevision, snapshot: state.snapshot }
          : null,
      updates: rows.map((row) => ({
        revision: Number(row.revision),
        update: toBytes(row.update_data, "loro update data"),
      })),
    };
  }

  async appendLoroUpdate(accountId: string, update: Uint8Array | ArrayBuffer): Promise<number> {
    await this.prepareRpc(accountId);
    await this.ensureLoroMigration(accountId);
    const bytes = update instanceof ArrayBuffer ? new Uint8Array(update) : update.slice();
    if (!bytes.byteLength || bytes.byteLength > MAX_LORO_UPDATE_BYTES) {
      throw new Error("Loro update has invalid size");
    }
    const { importAndValidateLoroAccountUpdate } = await this.loro();
    const { state, document } = await this.loadLoroDocument(accountId);
    importAndValidateLoroAccountUpdate(document, bytes, committedProblemRegistry);
    const { readLoroAccountDocument } = await this.loro();
    const desired = readLoroAccountDocument(document, committedProblemRegistry);
    const nextRevision = state.revision + 1;
    assertNonNegativeInteger(nextRevision, "loro revision");
    const now = Math.floor(Date.now() / 1000);
    await this.coordinator.applyLegacyState(accountId, desired.progress, desired.notes, [
      this.env.DB.prepare(
        "INSERT INTO sync_loro_updates (account_id, revision, update_data, byte_length, created_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(accountId, nextRevision, bytes, bytes.byteLength, now),
    ]);
    const totals = await this.env.DB.prepare(
      "SELECT COALESCE(SUM(byte_length), 0) AS total_bytes, COUNT(*) AS update_count FROM sync_loro_updates WHERE account_id = ?"
    )
      .bind(accountId)
      .first<{ total_bytes: unknown; update_count: unknown }>();
    await this.compactLoroUpdates(
      accountId,
      nextRevision,
      document,
      Number(totals?.total_bytes ?? 0),
      Number(totals?.update_count ?? 0)
    );
    return nextRevision;
  }

  async deleteAccount(accountId: string, accountRouteKey: string) {
    await this.prepareRpc(accountId, true);
    const route = this.routeName();
    if (!route || route !== assertAccountRouteName(accountRouteKey)) {
      throw new Error("Durable Object account route mismatch");
    }
    const result = await this.coordinator.deleteAccount(accountId, route);
    await this.env.DB.batch([
      this.env.DB.prepare("DELETE FROM sync_loro_updates WHERE account_id = ?").bind(accountId),
      this.env.DB.prepare("DELETE FROM sync_loro_snapshots WHERE account_id = ?").bind(accountId),
      this.env.DB.prepare("DELETE FROM sync_loro_migrations WHERE account_id = ?").bind(accountId),
    ]);
    for (const socket of this.ctx.getWebSockets()) this.close(socket, SOCKET_PROTOCOL_CODE);
    await this.scheduleSocketExpiry();
    return result;
  }

  async applyLegacyProgress(accountId: string, slug: string, completed: boolean) {
    await this.prepareRpc(accountId);
    const result = await this.coordinator.applyLegacyProgress(accountId, slug, completed);
    if (result.acceptedCount > 0 && (await this.loroMigrationComplete(accountId))) {
      await this.ensureLoroFromCanonical(accountId);
    }
    return result;
  }

  async applyLegacyNote(accountId: string, slug: string, text: string) {
    await this.prepareRpc(accountId);
    const result = await this.coordinator.applyLegacyNote(accountId, slug, text);
    if (result.acceptedCount > 0 && (await this.loroMigrationComplete(accountId))) {
      await this.ensureLoroFromCanonical(accountId);
    }
    return result;
  }
}
