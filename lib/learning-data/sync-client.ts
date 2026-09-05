import {
  Crc32cAccumulator,
  CodecError,
  MAX_BATCH_CHANGES,
  MessageType,
  RejectionCode,
  decodeFrame,
  decodeRejectionFrame,
  decodeMutationRecord,
  decodeDetailedAcknowledgement,
  decodeRevisionedDeltaBatchFrame,
  decodeSnapshotRecord,
  decodeSnapshotBeginFrame,
  decodeSnapshotChunkFrame,
  decodeSnapshotEndFrame,
  encodeBatchFrame,
  encodeMutationBatchEnvelope,
  encodeHelloFrame,
  encodeMutationRecord,
  encodeRawMessageFrame,
  type Frame,
  type MutationRecord,
} from "../sync/codec";
import {
  classifyFailure,
  mayClearAccountData,
  retryDelayMs,
  type SyncFailure,
} from "../sync/failure-policy";
import {
  type AccountCacheProgress,
  type AccountCacheSyncState,
  type SnapshotStageCounts,
} from "./account-cache";
import { SyncFrameParser } from "./sync-parser";

export type SyncTransport = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type SyncClientContext = {
  accountId: string;
  epoch: number;
  token: string;
};

export type SyncClientResult =
  | { kind: "complete" }
  | { kind: "aborted" }
  | { kind: "retry"; retryDelayMs: number }
  | { kind: "permanent" }
  | { kind: "deleted" };

export type RevocationProbeResult = {
  kind: "unchanged" | "erased" | "unavailable";
  erasedAccountIds: string[];
};

/**
 * Check retained Account Cache handles without requiring an authenticated
 * session. The endpoint receives only the raw fixed-size handle. We validate
 * every response before erasing any cache so an outage or malformed response
 * cannot cause partial local deletion.
 */
export async function checkRetainedAccountRevocations(
  cache: AccountCacheProgress,
  transport: SyncTransport = fetch,
  endpoint = "/api/revocation"
): Promise<RevocationProbeResult> {
  const retained = await cache.listRevocationHandles();
  if (!retained.length) return { kind: "unchanged", erasedAccountIds: [] };
  const statuses: boolean[] = [];
  for (const { revocationHandle } of retained) {
    if (revocationHandle.byteLength !== 32) {
      return { kind: "unavailable", erasedAccountIds: [] };
    }
    let response: Response;
    try {
      response = await transport(endpoint, {
        method: "POST",
        body: revocationHandle.slice() as unknown as BodyInit,
        headers: { "Content-Type": "application/octet-stream" },
      });
      if (!response.ok) return { kind: "unavailable", erasedAccountIds: [] };
      const body: unknown = await response.json();
      if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body) ||
        Object.keys(body).length !== 1 ||
        typeof (body as { deleted?: unknown }).deleted !== "boolean"
      ) {
        return { kind: "unavailable", erasedAccountIds: [] };
      }
      statuses.push((body as { deleted: boolean }).deleted);
    } catch {
      return { kind: "unavailable", erasedAccountIds: [] };
    }
  }
  const erasedAccountIds = retained
    .filter((_, index) => statuses[index])
    .map(({ accountId }) => accountId);
  if (!erasedAccountIds.length) return { kind: "unchanged", erasedAccountIds: [] };
  for (const accountId of erasedAccountIds) {
    if (!(await cache.eraseAccount(accountId))) {
      return { kind: "unavailable", erasedAccountIds: [] };
    }
  }
  return { kind: "erased", erasedAccountIds };
}

class SyncPolicyError extends Error {
  constructor(readonly failure: SyncFailure) {
    super(failure.code);
  }
}

function failureForRejection(code: RejectionCode, bootstrap = false): SyncFailure {
  switch (code) {
    case RejectionCode.INVALID_FRAME:
      return classifyFailure("malformed_frame");
    case RejectionCode.INVALID_BATCH:
      return classifyFailure("batch_too_large");
    case RejectionCode.INVALID_RECORD:
      return classifyFailure("rejected_item");
    case RejectionCode.UNSUPPORTED_PROTOCOL:
      return classifyFailure("unsupported_protocol");
    case RejectionCode.AUTHENTICATION_REQUIRED:
      return classifyFailure("authentication_required");
    case RejectionCode.TOO_LARGE:
      return classifyFailure("frame_too_large");
    case RejectionCode.ACCOUNT_DELETED:
      return classifyFailure("account_deleted");
    case RejectionCode.TRANSIENT_FAILURE:
      return classifyFailure(bootstrap ? "bootstrap_overflow" : "transport_disconnected");
  }
}

function failureForCodec(error: CodecError): SyncFailure {
  switch (error.code) {
    case "OVERSIZED":
      return classifyFailure("frame_too_large");
    case "TRUNCATED":
      return classifyFailure("truncated_frame");
    case "CHECKSUM_MISMATCH":
      return classifyFailure("checksum_invalid");
    case "UNSUPPORTED_VERSION":
      return classifyFailure("unsupported_protocol");
    default:
      return classifyFailure("malformed_frame");
  }
}

function failureForError(error: unknown): SyncFailure {
  if (error instanceof SyncPolicyError) return error.failure;
  if (error instanceof CodecError) return failureForCodec(error);
  if (error instanceof Error && error.message.includes("sync response has no body"))
    return classifyFailure("malformed_frame");
  if (error instanceof Error && error.message.includes("snapshot"))
    return classifyFailure("stream_invalid");
  return classifyFailure("transport_disconnected");
}

function resultForFailure(failure: SyncFailure, attempt = 0): SyncClientResult {
  if (mayClearAccountData(failure)) return { kind: "deleted" };
  const delay = retryDelayMs(failure, attempt);
  return delay === null ? { kind: "permanent" } : { kind: "retry", retryDelayMs: delay };
}

function concatRecords(records: readonly Uint8Array[]): Uint8Array[] {
  const batches: Uint8Array[] = [];
  let current: Uint8Array[] = [];
  for (const record of records) {
    const next = [...current, record];
    try {
      encodeBatchFrame(MessageType.MUTATION_BATCH, next);
      current = next;
    } catch {
      if (!current.length) throw new Error("mutation record cannot fit in a CJET batch");
      batches.push(encodeBatchFrame(MessageType.MUTATION_BATCH, current));
      current = [record];
    }
    if (current.length === MAX_BATCH_CHANGES) {
      batches.push(encodeBatchFrame(MessageType.MUTATION_BATCH, current));
      current = [];
    }
  }
  if (current.length) batches.push(encodeBatchFrame(MessageType.MUTATION_BATCH, current));
  return batches;
}

export function compactPendingBatches(state: AccountCacheSyncState): Uint8Array[] {
  return concatRecords(state.pending.map(encodeMutationRecord));
}

function compactPendingBatchRecords(state: AccountCacheSyncState): MutationRecord[][] {
  const batches: MutationRecord[][] = [];
  let records: MutationRecord[] = [];
  for (const record of state.pending) {
    const candidate = [...records, record];
    try {
      encodeBatchFrame(MessageType.MUTATION_BATCH, candidate.map(encodeMutationRecord));
      records = candidate;
    } catch {
      if (!records.length) throw new Error("mutation record cannot fit in a CJET batch");
      batches.push(records);
      records = [record];
    }
    if (records.length === MAX_BATCH_CHANGES) {
      batches.push(records);
      records = [];
    }
  }
  if (records.length) batches.push(records);
  return batches;
}

function randomId(): Uint8Array {
  const result = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) return globalThis.crypto.getRandomValues(result);
  throw new Error("secure sync request ID generation is unavailable");
}

function progressRecordToState(record: Extract<MutationRecord, { kind: "progress-delta" }>) {
  return {
    adds: record.adds.map((add) => ({
      slug: add.slug,
      dot: { actorId: copyBytes(add.actorId), counter: add.counter },
    })),
    causalSummary: new Map(
      record.causalSummary.map((entry) => [
        Array.from(copyBytes(entry.actorId), (byte) => byte.toString(16).padStart(2, "0")).join(""),
        entry.counter,
      ])
    ),
    removed: new Map(
      record.removed.map((entry) => [
        entry.slug,
        new Map(
          entry.summary.map((item) => [
            Array.from(copyBytes(item.actorId), (byte) => byte.toString(16).padStart(2, "0")).join(
              ""
            ),
            item.counter,
          ])
        ),
      ])
    ),
  };
}

function decodeMutationRecordOrNote(input: Uint8Array): MutationRecord {
  try {
    return decodeMutationRecord(input);
  } catch (mutationError) {
    const snapshot = decodeSnapshotRecord(input);
    if (snapshot.kind !== "note") throw mutationError;
    return {
      kind: "note",
      slug: snapshot.slug,
      actorId: copyBytes(snapshot.actorId),
      localRevision: snapshot.localRevision,
      operation:
        snapshot.operation.kind === "delete"
          ? { kind: "delete" }
          : { kind: "value", bytes: copyBytes(snapshot.operation.bytes) },
    };
  }
}

async function applyCanonicalRecord(
  cache: AccountCacheProgress,
  record: MutationRecord,
  serverRevision: bigint
): Promise<void> {
  if (record.kind === "progress-delta") {
    await cache.applyCanonicalMutation({
      kind: "progress",
      state: progressRecordToState(record),
      serverRevision,
    });
  } else if (record.kind === "note") {
    await cache.applyCanonicalMutation({
      kind: "note",
      mutation: {
        slug: record.slug,
        actorId: copyBytes(record.actorId),
        localRevision: record.localRevision,
        operation:
          record.operation.kind === "delete"
            ? { kind: "delete" }
            : { kind: "value", bytes: copyBytes(record.operation.bytes) },
      },
      serverRevision,
    });
  }
}

async function sha256Bytes(value: Uint8Array): Promise<Uint8Array> {
  if (!globalThis.crypto?.subtle) throw new Error("SHA-256 is unavailable");
  return new Uint8Array(
    await globalThis.crypto.subtle.digest("SHA-256", new Uint8Array(value).buffer)
  );
}

type SnapshotSession = {
  accountId: string;
  generationId: string;
  counts: SnapshotStageCounts;
  nextChunk: number;
  seen: number;
  totalLength: bigint;
  checksum: Crc32cAccumulator;
  nonce: Uint8Array | null;
  installed: boolean;
  began: boolean;
  ended: boolean;
};

export class HttpRecoverySyncClient {
  private controller: AbortController | null = null;
  private stopped = true;

  constructor(
    private readonly cache: AccountCacheProgress,
    private readonly transport: SyncTransport = fetch,
    private readonly endpoint = "/api/sync"
  ) {}

  stop(): void {
    this.runVersion += 1;
    this.stopped = true;
    this.controller?.abort();
    this.controller = null;
  }

  async run(context: SyncClientContext): Promise<SyncClientResult> {
    this.stop();
    this.stopped = false;
    const runVersion = this.runVersion;
    this.pendingFrame = Promise.resolve();
    const controller = new AbortController();
    this.controller = controller;
    try {
      const state = await this.cache.exportSyncState();
      if (!state || this.stopped) return { kind: "aborted" };
      if (state.accountId !== context.accountId) return { kind: "aborted" };
      const pendingBatches = compactPendingBatchRecords(state);
      const bootstrapId = randomId();
      const revocationHandleHash = await sha256Bytes(state.revocationHandle);
      const hello = encodeHelloFrame({
        actorId: state.actorId,
        revocationHandleHash,
        lastServerRevision: state.lastServerRevision,
        causalSummary: Array.from(state.causalSummary, ([actorId, counter]) => ({
          actorId: Uint8Array.from(actorId.match(/../g) ?? [], (part) => Number.parseInt(part, 16)),
          counter,
        })),
        bootstrapId,
        pendingBatchCount: pendingBatches.length,
      });
      const snapshot: SnapshotSession = {
        accountId: context.accountId,
        generationId: `${context.accountId}:${context.epoch}:${Date.now()}:${Math.random()}`,
        counts: {
          actorCount: 0,
          progressShardCount: 0,
          problemNoteCount: 0,
          chunkCount: 0,
          totalLength: BigInt(0),
          checksum: 0,
        },
        nextChunk: 0,
        seen: 0,
        totalLength: BigInt(0),
        checksum: new Crc32cAccumulator(),
        nonce: null,
        installed: false,
        began: false,
        ended: false,
      };
      const response = await this.post(hello, context.token, controller.signal);
      await this.consumeSimpleResponse(response.response, [], context, runVersion, snapshot);
      for (const [batchIndex, records] of pendingBatches.entries()) {
        if (!this.isLive(context, runVersion)) return { kind: "aborted" };
        const batch = encodeMutationBatchEnvelope({
          requestId: randomId(),
          bootstrapId,
          batchIndex,
          batchCount: pendingBatches.length,
          changes: records.map(encodeMutationRecord),
        });
        const sent = await this.post(batch, context.token, controller.signal);
        await this.consumeSimpleResponse(sent.response, records, context, runVersion, snapshot);
      }
      if (this.stopped) return { kind: "aborted" };
      if (!snapshot.began || !snapshot.ended || !snapshot.installed || !snapshot.nonce) {
        return { kind: "permanent" };
      }
      if (snapshot.nonce && snapshot.installed) {
        const confirmation = encodeRawMessageFrame(MessageType.SNAPSHOT_CONFIRM, snapshot.nonce);
        const confirmed = await this.post(confirmation, context.token, controller.signal);
        await this.consumeSimpleResponse(
          confirmed.response,
          [],
          context,
          runVersion,
          undefined,
          true
        );
      }
      // Pending mutations are deliberately sent only after a valid canonical
      // generation is installed. A failed request leaves the overlay intact.
      const currentState = (await this.cache.exportSyncState()) ?? state;
      if (currentState.accountId !== context.accountId) return { kind: "aborted" };
      const liveBatches = compactPendingBatchRecords(currentState);
      const emptyBootstrapId = new Uint8Array(16);
      for (const records of liveBatches) {
        const sent = await this.post(
          encodeMutationBatchEnvelope({
            requestId: randomId(),
            bootstrapId: emptyBootstrapId,
            batchIndex: 0,
            batchCount: 1,
            changes: records.map(encodeMutationRecord),
          }),
          context.token,
          controller.signal
        );
        await this.consumeSimpleResponse(sent.response, records, context, runVersion);
      }
      this.retryAttempt = 0;
      return { kind: "complete" };
    } catch (error) {
      if (this.stopped || (error instanceof DOMException && error.name === "AbortError")) {
        return { kind: "aborted" };
      }
      const failure = failureForError(error);
      const result = resultForFailure(failure, this.retryAttempt++);
      if (result.kind === "deleted") await this.cache.eraseAccount(context.accountId);
      return result;
    } finally {
      if (this.controller === controller) this.controller = null;
    }
  }

  private pendingFrame: Promise<void> = Promise.resolve();

  private runVersion = 0;
  private retryAttempt = 0;

  private consumeFrame(
    frame: Frame,
    snapshot: SnapshotSession,
    context: SyncClientContext,
    runVersion: number
  ): Promise<void> {
    this.pendingFrame = this.pendingFrame.then(async () => {
      if (!this.isLive(context, runVersion)) throw new Error("stale sync epoch");
      if (frame.type === MessageType.SNAPSHOT_BEGIN) {
        if (snapshot.began || snapshot.ended) throw new Error("unexpected snapshot begin");
        const begin = decodeSnapshotBeginFrame(encodeFrameFrom(frame));
        snapshot.counts = { ...begin, checksum: 0 };
        snapshot.nextChunk = 0;
        snapshot.began = true;
        if (!this.isLive(context, runVersion)) throw new Error("stale sync epoch");
        if (!(await this.cache.beginSnapshotStage(snapshot.generationId, begin.revision))) {
          throw new Error("snapshot stage rejected");
        }
      } else if (frame.type === MessageType.SNAPSHOT_CHUNK) {
        if (!snapshot.began || snapshot.ended) throw new Error("unexpected snapshot chunk");
        const chunk = decodeSnapshotChunkFrame(encodeFrameFrom(frame));
        if (chunk.index !== snapshot.nextChunk) throw new Error("snapshot chunk out of order");
        if (!this.isLive(context, runVersion)) throw new Error("stale sync epoch");
        if (
          !(await this.cache.writeSnapshotChunk(snapshot.generationId, chunk.index, chunk.records))
        ) {
          throw new Error("snapshot chunk rejected");
        }
        for (const record of chunk.records) {
          snapshot.seen += 1;
          snapshot.totalLength += BigInt(record.length);
          snapshot.checksum.update(record);
        }
        snapshot.nextChunk += 1;
      } else if (frame.type === MessageType.SNAPSHOT_END) {
        if (!snapshot.began || snapshot.ended) throw new Error("unexpected snapshot end");
        const checksum = decodeSnapshotEndFrame(encodeFrameFrom(frame));
        if (
          snapshot.totalLength !== snapshot.counts.totalLength ||
          snapshot.checksum.digest() !== checksum ||
          snapshot.seen !== snapshot.counts.chunkCount
        ) {
          throw new Error("snapshot checksum or length mismatch");
        }
        snapshot.counts.checksum = checksum;
        snapshot.counts.receivedChunkCount = snapshot.nextChunk;
        if (!this.isLive(context, runVersion)) throw new Error("stale sync epoch");
        snapshot.installed =
          (await this.cache.finishSnapshotStage(snapshot.generationId, snapshot.counts)) !== null;
        if (!snapshot.installed) throw new Error("snapshot installation failed");
        snapshot.ended = true;
      } else if (frame.type === MessageType.SNAPSHOT_CONFIRM) {
        if (!snapshot.ended || snapshot.nonce) throw new Error("unexpected snapshot confirmation");
        snapshot.nonce = frame.payload.slice();
      } else if (frame.type === MessageType.REJECTION) {
        const rejection = decodeRejectionFrame(encodeFrameFrom(frame));
        throw new SyncPolicyError(failureForRejection(rejection.code, true));
      }
      if (!this.isLive(context, runVersion) || context.accountId !== snapshot.accountId)
        throw new Error("stale sync epoch");
    });
    return this.pendingFrame;
  }

  private async consumeSimpleResponse(
    response: Response,
    submitted: readonly import("../sync/codec").MutationRecord[] = [],
    context?: SyncClientContext,
    runVersion?: number,
    snapshot?: SnapshotSession,
    bootstrap = snapshot !== undefined
  ): Promise<void> {
    if (!response.body) throw new Error("sync response has no body");
    let detailedAcknowledgement: ReturnType<typeof decodeDetailedAcknowledgement> | undefined;
    const deltas: Array<{ record: MutationRecord; serverRevision: bigint }> = [];
    const parser = new SyncFrameParser((frame) => {
      if (
        frame.type === MessageType.SNAPSHOT_BEGIN ||
        frame.type === MessageType.SNAPSHOT_CHUNK ||
        frame.type === MessageType.SNAPSHOT_END ||
        frame.type === MessageType.SNAPSHOT_CONFIRM
      ) {
        if (!snapshot) throw new Error("unexpected snapshot response frame");
        void this.consumeFrame(
          frame,
          snapshot,
          context ?? { accountId: "", epoch: 0, token: "" },
          runVersion ?? -1
        );
      } else if (frame.type === MessageType.ACKNOWLEDGEMENT) {
        detailedAcknowledgement = decodeDetailedAcknowledgement(encodeFrameFrom(frame));
      } else if (frame.type === MessageType.DELTA_BATCH) {
        for (const change of decodeRevisionedDeltaBatchFrame(encodeFrameFrom(frame)).changes)
          deltas.push({
            record: decodeMutationRecord(change.record),
            serverRevision: change.serverRevision,
          });
      } else if (frame.type === MessageType.REJECTION) {
        const rejection = decodeRejectionFrame(encodeFrameFrom(frame));
        throw new SyncPolicyError(failureForRejection(rejection.code, bootstrap));
      } else {
        throw new Error("unexpected sync response frame");
      }
    });
    const reader = response.body.getReader();
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      parser.push(chunk.value);
    }
    parser.finish();
    await this.pendingFrame;
    if (context && runVersion !== undefined && !this.isLive(context, runVersion))
      throw new Error("stale sync epoch");
    if (detailedAcknowledgement) {
      const detailed = detailedAcknowledgement;
      if (submitted.length !== detailed.outcomes.length)
        throw new Error("acknowledgement does not match submitted batch");
      for (const [index, outcome] of detailed.outcomes.entries()) {
        if (context && runVersion !== undefined && !this.isLive(context, runVersion))
          throw new Error("stale sync epoch");
        const submittedRecord = submitted[index];
        const canonicalRecord = decodeMutationRecordOrNote(copyBytes(outcome.record));
        if (canonicalRecord.kind === "progress-delta") {
          const state = progressRecordToState(canonicalRecord);
          await this.cache.applyCanonicalMutation({
            kind: "progress",
            state,
            serverRevision: outcome.serverRevision,
          });
          if (outcome.status === "accepted" && submittedRecord?.kind === "progress-delta")
            await this.cache.acknowledgeProgress(progressRecordToState(submittedRecord));
        } else if (canonicalRecord.kind === "note") {
          const note = {
            slug: canonicalRecord.slug,
            actorId: copyBytes(canonicalRecord.actorId),
            localRevision: canonicalRecord.localRevision,
            operation:
              canonicalRecord.operation.kind === "delete"
                ? { kind: "delete" as const }
                : { kind: "value" as const, bytes: copyBytes(canonicalRecord.operation.bytes) },
          };
          if (outcome.status === "accepted" && submittedRecord?.kind === "note") {
            await this.cache.acknowledgeNote({
              slug: submittedRecord.slug,
              actorId: copyBytes(submittedRecord.actorId),
              localRevision: submittedRecord.localRevision,
              accepted: true,
              serverRevision: outcome.serverRevision,
              canonical: { mutation: note, serverRevision: outcome.serverRevision },
            });
          } else {
            await this.cache.applyCanonicalMutation({
              kind: "note",
              mutation: note,
              serverRevision: outcome.serverRevision,
            });
          }
        }
      }
    }
    if (deltas.length > 0) {
      for (const delta of deltas) {
        if (context && runVersion !== undefined && !this.isLive(context, runVersion))
          throw new Error("stale sync epoch");
        if (delta.record.kind === "progress-delta") {
          await this.cache.applyCanonicalMutation({
            kind: "progress",
            state: progressRecordToState(delta.record),
            serverRevision: delta.serverRevision,
          });
        } else if (delta.record.kind === "note") {
          await this.cache.applyCanonicalMutation({
            kind: "note",
            mutation: {
              slug: delta.record.slug,
              actorId: copyBytes(delta.record.actorId),
              localRevision: delta.record.localRevision,
              operation:
                delta.record.operation.kind === "delete"
                  ? { kind: "delete" }
                  : { kind: "value", bytes: copyBytes(delta.record.operation.bytes) },
            },
            serverRevision: delta.serverRevision,
          });
        }
      }
    }
  }

  private isLive(context: SyncClientContext, runVersion: number): boolean {
    return !this.stopped && this.runVersion === runVersion && context.accountId.length > 0;
  }

  private async post(
    body: Uint8Array,
    token: string,
    signal: AbortSignal
  ): Promise<{ response: Response }> {
    const response = await this.transport(this.endpoint, {
      method: "POST",
      body: body as unknown as BodyInit,
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/octet-stream",
      },
    });
    if (response.ok) return { response };
    let failure: SyncFailure;
    if (response.status === 410) failure = classifyFailure("account_deleted");
    else if (response.status === 401) failure = classifyFailure("authentication_required");
    else if (response.status === 403) failure = classifyFailure("authentication_invalid");
    else if (response.status === 408) failure = classifyFailure("transport_timeout");
    else if (response.status === 413) failure = classifyFailure("frame_too_large");
    else if (response.status === 429 || response.status >= 500)
      failure = classifyFailure("transport_disconnected");
    else failure = classifyFailure("malformed_frame");
    throw new SyncPolicyError(failure);
  }
}

type SyncSocket = {
  binaryType: string;
  onopen: (() => void) | null;
  onmessage: ((event: { data: ArrayBuffer | Uint8Array | Blob }) => void) | null;
  onerror: (() => void) | null;
  onclose: (() => void) | null;
  send: (data: ArrayBuffer) => void;
  close: () => void;
};

export type SyncSocketFactory = (url: string) => SyncSocket;

function defaultSocketFactory(url: string): SyncSocket {
  if (typeof WebSocket === "undefined") throw new Error("WebSocket is unavailable");
  return new WebSocket(url) as unknown as SyncSocket;
}

function bytesKey(value: Uint8Array): string {
  return Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function applyDetailedAck(
  cache: AccountCacheProgress,
  detailed: ReturnType<typeof decodeDetailedAcknowledgement>,
  submitted: readonly MutationRecord[]
): Promise<void> {
  if (submitted.length !== detailed.outcomes.length)
    throw new Error("acknowledgement does not match submitted batch");
  for (const [index, outcome] of detailed.outcomes.entries()) {
    const submittedRecord = submitted[index];
    const canonical = decodeMutationRecordOrNote(copyBytes(outcome.record));
    if (canonical.kind === "progress-delta") {
      await cache.applyCanonicalMutation({
        kind: "progress",
        state: progressRecordToState(canonical),
        serverRevision: outcome.serverRevision,
      });
      if (outcome.status === "accepted" && submittedRecord?.kind === "progress-delta")
        await cache.acknowledgeProgress(progressRecordToState(submittedRecord));
    } else if (canonical.kind === "note") {
      const canonicalMutation = {
        slug: canonical.slug,
        actorId: copyBytes(canonical.actorId),
        localRevision: canonical.localRevision,
        operation:
          canonical.operation.kind === "delete"
            ? { kind: "delete" as const }
            : { kind: "value" as const, bytes: copyBytes(canonical.operation.bytes) },
      };
      if (outcome.status === "accepted" && submittedRecord?.kind === "note") {
        await cache.acknowledgeNote({
          slug: submittedRecord.slug,
          actorId: copyBytes(submittedRecord.actorId),
          localRevision: submittedRecord.localRevision,
          accepted: true,
          serverRevision: outcome.serverRevision,
          canonical: { mutation: canonicalMutation, serverRevision: outcome.serverRevision },
        });
      } else {
        await cache.applyCanonicalMutation({
          kind: "note",
          mutation: canonicalMutation,
          serverRevision: outcome.serverRevision,
        });
      }
    }
  }
}

/** Realtime transport. It keeps retrying a capped WebSocket while HTTP recovers silently. */
export class WebSocketSyncClient {
  private socket: SyncSocket | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = true;
  private generation = 0;
  private failures = 0;
  private context: SyncClientContext | null = null;
  private submitted = new Map<string, MutationRecord[]>();
  private snapshot: SnapshotSession | null = null;
  private messageChain = Promise.resolve();
  private recoveryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly cache: AccountCacheProgress,
    private readonly recovery: HttpRecoverySyncClient,
    private readonly socketFactory: SyncSocketFactory = defaultSocketFactory,
    private readonly url = typeof location === "undefined"
      ? "ws://localhost/api/sync"
      : location.origin.replace(/^http/, "ws") + "/api/sync"
  ) {}

  start(context: SyncClientContext): void {
    this.stop();
    this.stopped = false;
    this.context = context;
    this.connect(++this.generation);
  }

  stop(): void {
    this.stopped = true;
    this.generation += 1;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = null;
    if (this.recoveryTimer) clearTimeout(this.recoveryTimer);
    this.recoveryTimer = null;
    this.socket?.close();
    this.socket = null;
    this.submitted.clear();
    this.snapshot = null;
    this.recovery.stop();
  }

  private connect(generation: number): void {
    if (this.stopped || generation !== this.generation || !this.context) return;
    let socket: SyncSocket;
    try {
      socket = this.socketFactory(this.url);
    } catch {
      this.failed(generation);
      return;
    }
    socket.binaryType = "arraybuffer";
    this.socket = socket;
    socket.onopen = () => {
      this.failures = 0;
      if (this.recoveryTimer) clearTimeout(this.recoveryTimer);
      this.recoveryTimer = null;
      this.recovery.stop();
      void this.sendBootstrap(generation).catch((error: unknown) => {
        this.handleSocketError(error, generation);
      });
    };
    socket.onmessage = (event) => {
      this.messageChain = this.messageChain
        .then(async () => {
          if (!this.live(generation)) return;
          const data =
            event.data instanceof Blob
              ? new Uint8Array(await event.data.arrayBuffer())
              : copyBytes(event.data);
          await this.consumeFrame(data, generation);
        })
        .catch((error: unknown) => {
          this.handleSocketError(error, generation);
        });
    };
    socket.onerror = () => {
      if (this.socket === socket) this.failed(generation);
    };
    socket.onclose = () => {
      if (this.socket === socket) this.failed(generation);
    };
  }

  private async sendBootstrap(generation: number): Promise<void> {
    if (!this.live(generation) || !this.context) return;
    const state = await this.cache.exportSyncState();
    if (!state || state.accountId !== this.context.accountId || !this.live(generation)) return;
    const batches = compactPendingBatchRecords(state);
    const bootstrapId = randomId();
    const hello = encodeHelloFrame({
      actorId: state.actorId,
      revocationHandleHash: await sha256Bytes(state.revocationHandle),
      lastServerRevision: state.lastServerRevision,
      causalSummary: Array.from(state.causalSummary, ([actorId, counter]) => ({
        actorId: Uint8Array.from(actorId.match(/../g) ?? [], (part) => Number.parseInt(part, 16)),
        counter,
      })),
      bootstrapId,
      pendingBatchCount: batches.length,
    });
    this.send(hello, generation);
    for (const [batchIndex, records] of batches.entries()) {
      const requestId = randomId();
      this.submitted.set(bytesKey(requestId), records);
      this.send(
        encodeMutationBatchEnvelope({
          requestId,
          bootstrapId,
          batchIndex,
          batchCount: batches.length,
          changes: records.map(encodeMutationRecord),
        }),
        generation
      );
    }
  }

  private send(frame: Uint8Array, generation: number): void {
    if (!this.live(generation) || !this.socket) return;
    this.socket.send(frame.slice().buffer as ArrayBuffer);
  }

  private async consumeFrame(frame: Uint8Array, generation: number): Promise<void> {
    const context = this.context;
    if (!context || !this.live(generation)) return;
    const decoded = decodeFrame(frame);
    if (decoded.type === MessageType.SNAPSHOT_BEGIN) {
      const begin = decodeSnapshotBeginFrame(frame);
      const generationId = `ws-${begin.revision.toString(10)}-${generation}`;
      if (!this.live(generation)) return;
      if (!(await this.cache.beginSnapshotStage(generationId, begin.revision)))
        throw new Error("snapshot stage rejected");
      this.snapshot = {
        accountId: context.accountId,
        generationId,
        counts: { ...begin, checksum: 0 },
        nextChunk: 0,
        seen: 0,
        totalLength: BigInt(0),
        checksum: new Crc32cAccumulator(),
        nonce: null,
        installed: false,
        began: true,
        ended: false,
      };
      return;
    }
    const snapshot = this.snapshot;
    if (decoded.type === MessageType.SNAPSHOT_CHUNK) {
      if (!snapshot || snapshot.ended) throw new Error("unexpected snapshot chunk");
      const chunk = decodeSnapshotChunkFrame(frame);
      if (chunk.index !== snapshot.nextChunk) throw new Error("snapshot chunk out of order");
      if (!this.live(generation)) return;
      if (!(await this.cache.writeSnapshotChunk(snapshot.generationId, chunk.index, chunk.records)))
        throw new Error("snapshot stage rejected");
      for (const record of chunk.records) {
        snapshot.seen++;
        snapshot.totalLength += BigInt(record.length);
        snapshot.checksum.update(record);
      }
      snapshot.nextChunk++;
      return;
    }
    if (decoded.type === MessageType.SNAPSHOT_END) {
      if (!snapshot || snapshot.ended) throw new Error("unexpected snapshot end");
      const checksum = decodeSnapshotEndFrame(frame);
      if (
        snapshot.totalLength !== snapshot.counts.totalLength ||
        snapshot.checksum.digest() !== checksum ||
        snapshot.seen !== snapshot.counts.chunkCount
      )
        throw new Error("snapshot checksum or length mismatch");
      if (!this.live(generation)) return;
      snapshot.counts.checksum = checksum;
      snapshot.counts.receivedChunkCount = snapshot.nextChunk;
      snapshot.installed =
        (await this.cache.finishSnapshotStage(snapshot.generationId, snapshot.counts)) !== null;
      if (!snapshot.installed) throw new Error("snapshot installation failed");
      snapshot.ended = true;
      return;
    }
    if (decoded.type === MessageType.SNAPSHOT_CONFIRM) {
      if (!snapshot?.ended || snapshot.nonce) throw new Error("unexpected snapshot confirmation");
      snapshot.nonce = decoded.payload.slice();
      this.send(encodeRawMessageFrame(MessageType.SNAPSHOT_CONFIRM, snapshot.nonce), generation);
      return;
    }
    if (decoded.type === MessageType.ACKNOWLEDGEMENT) {
      const detailed = decodeDetailedAcknowledgement(frame);
      if (!this.live(generation)) return;
      const requestId = bytesKey(copyBytes(detailed.requestId));
      const submitted = this.submitted.get(requestId) ?? [];
      await applyDetailedAck(this.cache, detailed, submitted);
      this.submitted.delete(requestId);
      return;
    }
    if (decoded.type === MessageType.DELTA_BATCH) {
      for (const change of decodeRevisionedDeltaBatchFrame(frame).changes) {
        if (!this.live(generation)) return;
        await applyCanonicalRecord(
          this.cache,
          decodeMutationRecord(copyBytes(change.record)),
          change.serverRevision
        );
      }
      return;
    }
    if (decoded.type === MessageType.REJECTION) {
      const rejection = decodeRejectionFrame(frame);
      throw new SyncPolicyError(failureForRejection(rejection.code, this.snapshot?.nonce === null));
    }
    throw new Error("unexpected WebSocket sync frame");
  }

  private live(generation: number): boolean {
    return !this.stopped && generation === this.generation && this.context !== null;
  }

  private handleSocketError(error: unknown, generation: number): void {
    if (!this.live(generation)) return;
    const failure = failureForError(error);
    const result = resultForFailure(failure, this.failures);
    if (result.kind === "deleted") {
      const accountId = this.context?.accountId;
      if (accountId) void this.cache.eraseAccount(accountId);
      this.stop();
      return;
    }
    if (result.kind === "retry") this.failed(generation, failure);
    else {
      const socket = this.socket;
      this.socket = null;
      socket?.close();
    }
  }

  private failed(generation: number, failure = classifyFailure("transport_disconnected")): void {
    if (!this.live(generation)) return;
    const socket = this.socket;
    this.socket = null;
    socket?.close();
    this.failures += 1;
    if (this.failures >= 3) this.startRecovery(generation);
    const delay = retryDelayMs(failure, Math.min(this.failures - 1, 10));
    if (delay === null) return;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      this.connect(generation);
    }, delay);
  }

  private startRecovery(generation: number): void {
    if (this.recoveryTimer || !this.context || !this.live(generation)) return;
    const context = this.context;
    void this.recovery.run(context).then((result) => {
      if (!this.live(generation)) return;
      if (result.kind === "retry") {
        this.recoveryTimer = setTimeout(() => {
          this.recoveryTimer = null;
          this.startRecovery(generation);
        }, result.retryDelayMs);
      } else if (result.kind === "deleted") {
        this.stop();
      }
    });
  }
}

/** One worker per browser tab. The worker owns no durable credential state. */
export class SyncWorkerController {
  private worker: Worker | null = null;

  start(context: SyncClientContext): void {
    this.stop();
    if (typeof Worker === "undefined") return;
    this.worker = new Worker(new URL("./sync-worker.ts", import.meta.url), { type: "module" });
    this.worker.postMessage({ kind: "start", ...context });
  }

  stop(): void {
    this.worker?.postMessage({ kind: "stop" });
    this.worker?.terminate();
    this.worker = null;
  }
}

function encodeFrameFrom(frame: Frame): Uint8Array {
  return encodeRawMessageFrame(frame.type, frame.payload);
}

function copyBytes(value: Uint8Array | ArrayBuffer): Uint8Array {
  return value instanceof Uint8Array ? value.slice() : new Uint8Array(value).slice();
}
