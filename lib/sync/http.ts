import {
  Crc32cAccumulator,
  CodecError,
  MAX_FRAME_BYTES,
  MessageType,
  RejectionCode,
  decodeFrame,
  decodeMutationBatchEnvelope,
  decodeStrictHello,
  decodeMutationRecord,
  encodeDetailedAcknowledgement,
  encodeFrame,
  encodeMutationRecord,
  encodeRevisionedDeltaBatchFrame,
  encodeRejectionFrame,
  encodeSnapshotBeginFrame,
  encodeSnapshotChunkFrame,
  encodeSnapshotEndFrame,
  encodeSnapshotRecord,
  type MutationRecord,
  type SnapshotRecord,
} from "./codec";
import type {
  AccountMutation,
  BatchResult,
  BootstrapStartResult,
  BootstrapSessionResult,
  CanonicalAccountData,
} from "./account-data";
import { accountRouteName } from "./account-route";
import { isAccountDeleted } from "./account-deletion";
import {
  failureForRejection,
  recordTransportDiagnostic,
  rejectionForFailure,
  transportFailure,
} from "./transport-diagnostics";

const HMAC = "HMAC";
const HMAC_HASH = "SHA-256";
const UTF8 = new TextEncoder();
const NONCE_TTL_SECONDS = 300;
const NONCE_RANDOM_BYTES = 16;
const NONCE_REVISION_BYTES = 8;
const NONCE_SESSION_BYTES = 16;
const NONCE_MAC_BYTES = 32;

type SyncEnvironment = CloudflareEnv & {
  SYNC_HMAC_SECRET: string;
  SYNC_ORIGIN: string;
};

type AccountDataClient = {
  beginBootstrap(
    sessionId: string,
    expiresAt: number,
    actorId: Uint8Array | ArrayBuffer,
    revocationHandleHash: Uint8Array | ArrayBuffer,
    lastServerRevision: bigint,
    causalSummary: readonly { actorId: Uint8Array | ArrayBuffer; counter: bigint }[],
    pendingBatchCount?: number
  ): Promise<BootstrapStartResult>;
  bootstrapStatus(sessionId: string): Promise<{
    revision: bigint;
    latestRevision: bigint;
    overflowed: boolean;
    expectedBatchCount: number;
    receivedBatchCount: number;
  }>;
  abortBootstrap(sessionId: string): Promise<void>;
  bootstrapSnapshot(sessionId: string): Promise<CanonicalAccountData>;
  applyBootstrapBatch(
    sessionId: string,
    batchIndex: number,
    batchCount: number,
    mutations: readonly AccountMutation[]
  ): Promise<BatchResult>;
  confirmBootstrap(sessionId: string, revision: bigint): Promise<BootstrapSessionResult>;
  applyMutations(mutations: readonly AccountMutation[]): Promise<BatchResult>;
};

type BootstrapSession = {
  id: string;
  revision: bigint;
  nonce: Uint8Array;
};

type Authenticator = (
  request: Request,
  env: SyncEnvironment,
  origin: string
) => Promise<string | null>;

export type SyncHandlerOptions = {
  authenticate?: Authenticator;
  now?: () => number;
  randomBytes?: (size: number) => Uint8Array;
};

const responseHeaders = {
  "content-type": "application/octet-stream",
  "cache-control": "no-store",
};

function rejection(code: RejectionCode, status = 400): Response {
  void recordTransportDiagnostic({
    eventCode: "request_rejected",
    failureCode: failureForRejection(code),
    protocolVersion: 1,
  });
  return new Response(responseBytes(encodeRejectionFrame({ code, itemIndex: null })), {
    status,
    headers: responseHeaders,
  });
}

function responseBytes(value: Uint8Array): ArrayBuffer {
  return value.slice().buffer as ArrayBuffer;
}

function copyBytes(value: Uint8Array | ArrayBuffer): Uint8Array {
  return value instanceof ArrayBuffer ? new Uint8Array(value).slice() : Uint8Array.from(value);
}

function actorKey(value: Uint8Array | ArrayBuffer): string {
  return Array.from(copyBytes(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function actorFromKey(key: string): Uint8Array {
  if (!/^[0-9a-f]{32}$/.test(key))
    throw new CodecError("invalid Progress Actor ID", "INVALID_VALUE");
  return Uint8Array.from(key.match(/../g) ?? [], (part) => Number.parseInt(part, 16));
}

function base64Url(value: Uint8Array): string {
  let text = "";
  for (const byte of value) text += String.fromCharCode(byte);
  return btoa(text).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function equalBytes(left: Uint8Array, right: Uint8Array): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

async function hmac(secret: string, value: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    UTF8.encode(secret),
    { name: HMAC, hash: HMAC_HASH },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign(HMAC, key, responseBytes(value)));
}

async function authenticateWithClerk(
  request: Request,
  env: SyncEnvironment,
  origin: string
): Promise<string | null> {
  if (!env.CLERK_SECRET_KEY || !env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  try {
    const { createClerkClient } = await import("@clerk/nextjs/server");
    const client = createClerkClient({
      secretKey: env.CLERK_SECRET_KEY,
      publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    });
    const state = await client.authenticateRequest(request, {
      acceptsToken: "session_token",
      authorizedParties: [origin],
    });
    if (!state.isAuthenticated) return null;
    const auth = state.toAuth();
    return auth?.isAuthenticated ? auth.userId : null;
  } catch {
    return null;
  }
}

async function readBoundedBody(request: Request): Promise<Uint8Array> {
  const contentLength = request.headers.get("content-length");
  if (
    contentLength !== null &&
    (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_FRAME_BYTES)
  ) {
    throw new CodecError("request body exceeds the frame limit", "OVERSIZED");
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const item = await reader.read();
    if (item.done) break;
    total += item.value.byteLength;
    if (total > MAX_FRAME_BYTES) {
      await reader.cancel();
      throw new CodecError("request body exceeds the frame limit", "OVERSIZED");
    }
    parts.push(item.value);
  }
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

function accountClient(
  env: SyncEnvironment,
  accountId: string,
  routeName: string
): AccountDataClient {
  const stub = env.ACCOUNT_DATA.getByName(routeName);
  return {
    beginBootstrap: (
      sessionId,
      expiresAt,
      actorId,
      revocationHandleHash,
      lastServerRevision,
      causalSummary,
      pendingBatchCount
    ) =>
      stub.beginBootstrap(
        accountId,
        sessionId,
        expiresAt,
        actorId,
        revocationHandleHash,
        lastServerRevision,
        causalSummary,
        pendingBatchCount
      ),
    bootstrapStatus: (sessionId) => stub.bootstrapStatus(accountId, sessionId),
    abortBootstrap: (sessionId) => stub.abortBootstrap(accountId, sessionId),
    bootstrapSnapshot: (sessionId) => stub.bootstrapSnapshot(accountId, sessionId),
    applyBootstrapBatch: (sessionId, batchIndex, batchCount, mutations) =>
      stub.applyBootstrapBatch(accountId, sessionId, batchIndex, batchCount, mutations),
    confirmBootstrap: (sessionId, revision) =>
      stub.confirmBootstrap(accountId, sessionId, revision),
    applyMutations: (mutations) => stub.applyMutations(accountId, mutations),
  };
}

export function asAccountMutation(record: MutationRecord): AccountMutation {
  if (record.kind === "progress-delta") {
    return {
      type: "progress",
      mutation: {
        kind: "delta",
        state: {
          adds: record.adds.map((add) => ({
            slug: add.slug,
            dot: { actorId: copyBytes(add.actorId), counter: add.counter },
          })),
          causalSummary: new Map(
            record.causalSummary.map((entry) => [actorKey(entry.actorId), entry.counter])
          ),
          removed: new Map(
            record.removed.map((entry) => [
              entry.slug,
              new Map(entry.summary.map((item) => [actorKey(item.actorId), item.counter])),
            ])
          ),
        },
      },
    };
  }
  if (record.kind === "add" || record.kind === "remove") {
    return {
      type: "progress",
      mutation: {
        kind: record.kind,
        slug: record.slug,
        actorId: record.actorId,
        counter: record.counter,
      },
    };
  }
  if (record.kind !== "note") {
    throw new CodecError("unknown mutation record", "INVALID_TYPE");
  }
  return {
    type: "note",
    mutation: {
      slug: record.slug,
      actorId: record.actorId,
      localRevision: record.localRevision,
      operation:
        record.operation.kind === "delete"
          ? { kind: "delete" }
          : { kind: "value", bytes: copyBytes(record.operation.bytes) },
    },
  };
}

export function asMutationRecord(mutation: AccountMutation): MutationRecord {
  if (mutation.type === "progress") {
    if (mutation.mutation.kind === "delta") {
      return {
        kind: "progress-delta",
        adds: mutation.mutation.state.adds.map((add) => ({
          slug: add.slug,
          actorId: copyBytes(add.dot.actorId),
          counter: add.dot.counter,
        })),
        causalSummary: Array.from(mutation.mutation.state.causalSummary.entries()).map(
          ([actorId, counter]) => ({ actorId: actorFromKey(actorId), counter })
        ),
        removed: Array.from(mutation.mutation.state.removed.entries()).map(([slug, summary]) => ({
          slug,
          summary: Array.from(summary.entries()).map(([actorId, counter]) => ({
            actorId: actorFromKey(actorId),
            counter,
          })),
        })),
      };
    }
    return {
      kind: mutation.mutation.kind,
      slug: mutation.mutation.slug,
      actorId: copyBytes(mutation.mutation.actorId),
      counter: mutation.mutation.counter,
    };
  }
  return {
    kind: "note",
    slug: mutation.mutation.slug,
    actorId: copyBytes(mutation.mutation.actorId),
    localRevision: mutation.mutation.localRevision,
    operation:
      mutation.mutation.operation.kind === "delete"
        ? { kind: "delete" }
        : { kind: "value", bytes: copyBytes(mutation.mutation.operation.bytes) },
  };
}

function detailedMutationAcknowledgement(
  requestId: Uint8Array | ArrayBuffer,
  result: BatchResult,
  submitted: readonly AccountMutation[]
): Uint8Array {
  const outcomes = result.results.map((entry, index) => {
    let mutation = submitted[index];
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
  return encodeDetailedAcknowledgement({
    requestId,
    serverRevision: result.serverRevision,
    outcomes,
  });
}

export function snapshotRecords(data: CanonicalAccountData): Iterable<Uint8Array> {
  function* records(): Iterable<Uint8Array> {
    for (const key of Array.from(data.actors.keys()).sort()) {
      const actor = data.actors.get(key);
      if (!actor) continue;
      const record: SnapshotRecord = {
        kind: "actor",
        actorId: actor.actorId,
        revocationHandleHash: actor.revocationHandleHash,
        isLegacy: actor.isLegacy,
      };
      yield encodeSnapshotRecord(record);
    }
    for (const key of Array.from(data.progress.causalSummary.keys()).sort()) {
      const counter = data.progress.causalSummary.get(key);
      if (counter === undefined) continue;
      const actorId = Uint8Array.from(key.match(/../g) ?? [], (part) => parseInt(part, 16));
      yield encodeSnapshotRecord({ kind: "causal", actorId, counter });
    }
    for (const prefix of Array.from(data.shards.keys()).sort()) {
      const shard = data.shards.get(prefix);
      if (!shard) continue;
      yield encodeSnapshotRecord({
        kind: "shard",
        prefix,
        depth: shard.depth,
        encoded: shard.encoded,
      });
    }
    for (const slug of Array.from(data.notes.notes.keys()).sort()) {
      const note = data.notes.notes.get(slug);
      if (!note) continue;
      yield encodeSnapshotRecord({
        kind: "note",
        slug,
        actorId: note.actorId,
        localRevision: note.localRevision,
        serverRevision: note.serverRevision,
        operation: note.operation,
      });
    }
  }
  return records();
}

export function snapshotCounts(data: CanonicalAccountData): {
  recordCount: number;
  totalLength: bigint;
} {
  let recordCount = 0;
  let totalLength = BigInt(0);
  for (const record of snapshotRecords(data)) {
    recordCount++;
    totalLength += BigInt(record.length);
  }
  return { recordCount, totalLength };
}

export async function snapshotNonce(
  secret: string,
  accountId: string,
  revision: bigint,
  sessionId: Uint8Array,
  now: () => number,
  randomBytes: (size: number) => Uint8Array
): Promise<Uint8Array> {
  if (sessionId.length !== NONCE_SESSION_BYTES)
    throw new CodecError("invalid bootstrap session ID", "INVALID_VALUE");
  const expiry = BigInt(Math.floor(now() / 1000) + NONCE_TTL_SECONDS);
  const body = new Uint8Array(8 + NONCE_REVISION_BYTES + NONCE_SESSION_BYTES + NONCE_RANDOM_BYTES);
  new DataView(body.buffer).setBigUint64(0, expiry, false);
  new DataView(body.buffer).setBigUint64(8, revision, false);
  body.set(sessionId, 16);
  body.set(randomBytes(NONCE_RANDOM_BYTES), 16 + NONCE_SESSION_BYTES);
  const mac = await hmac(
    secret,
    concat(
      UTF8.encode("snapshot\0"),
      UTF8.encode(accountId),
      UTF8.encode("\0"),
      body,
      UTF8.encode("\0"),
      UTF8.encode(revision.toString())
    )
  );
  return concat(body, mac);
}

export async function validSnapshotNonce(
  secret: string,
  accountId: string,
  nonce: Uint8Array,
  now: () => number
): Promise<{ revision: bigint; sessionId: Uint8Array } | null> {
  const bodyLength = 8 + NONCE_REVISION_BYTES + NONCE_SESSION_BYTES + NONCE_RANDOM_BYTES;
  if (nonce.length !== bodyLength + NONCE_MAC_BYTES) return null;
  const body = nonce.slice(0, bodyLength);
  const expiry = new DataView(body.buffer, body.byteOffset, body.byteLength).getBigUint64(0, false);
  if (expiry <= BigInt(Math.floor(now() / 1000))) return null;
  const revision = new DataView(body.buffer, body.byteOffset, body.byteLength).getBigUint64(
    8,
    false
  );
  const expected = await hmac(
    secret,
    concat(
      UTF8.encode("snapshot\0"),
      UTF8.encode(accountId),
      UTF8.encode("\0"),
      body,
      UTF8.encode("\0"),
      UTF8.encode(revision.toString())
    )
  );
  if (!equalBytes(expected, nonce.slice(body.length))) return null;
  return { revision, sessionId: body.slice(16, 16 + NONCE_SESSION_BYTES) };
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

async function snapshotResponse(
  client: AccountDataClient,
  initial: CanonicalAccountData,
  session: BootstrapSession,
  prefix: readonly Uint8Array[] = []
): Promise<Response> {
  const { recordCount, totalLength } = snapshotCounts(initial);
  const records = snapshotRecords(initial)[Symbol.iterator]();
  let index = 0;
  const checksum = new Crc32cAccumulator();
  let phase: "prefix" | "begin" | "records" | "finish" | "done" =
    prefix.length > 0 ? "prefix" : "begin";
  let prefixIndex = 0;
  let finished = false;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (phase === "prefix") {
          controller.enqueue(prefix[prefixIndex++]);
          if (prefixIndex === prefix.length) phase = "begin";
          return;
        }
        if (phase === "begin") {
          phase = "records";
          controller.enqueue(
            encodeSnapshotBeginFrame({
              revision: initial.serverRevision,
              actorCount: initial.actors.size,
              progressShardCount: initial.shards.size,
              problemNoteCount: initial.notes.notes.size,
              chunkCount: recordCount,
              totalLength,
            })
          );
          return;
        }
        if (phase === "records") {
          const next = records.next();
          if (!next.done) {
            checksum.update(next.value);
            controller.enqueue(encodeSnapshotChunkFrame({ index, records: [next.value] }));
            index++;
            return;
          }
          phase = "finish";
        }
        if (phase === "finish" && !finished) {
          finished = true;
          const status = await client.bootstrapStatus(session.id);
          controller.enqueue(encodeSnapshotEndFrame(checksum.digest()));
          if (status.overflowed) {
            controller.enqueue(
              encodeRejectionFrame({ code: RejectionCode.TRANSIENT_FAILURE, itemIndex: null })
            );
          } else {
            controller.enqueue(encodeFrame(MessageType.SNAPSHOT_CONFIRM, session.nonce));
          }
          phase = "done";
          return;
        }
        controller.close();
      } catch {
        controller.error(new Error("snapshot stream failed"));
      }
    },
  });
  return new Response(stream, { headers: responseHeaders });
}

export function createSyncHandler(options: SyncHandlerOptions = {}) {
  const authenticate = options.authenticate ?? authenticateWithClerk;
  const now = options.now ?? (() => Date.now());
  const randomBytes =
    options.randomBytes ?? ((size: number) => crypto.getRandomValues(new Uint8Array(size)));
  return async function handleSync(request: Request, env: SyncEnvironment): Promise<Response> {
    if (!env.SYNC_HMAC_SECRET) return rejection(RejectionCode.TRANSIENT_FAILURE, 503);
    if (request.method !== "POST") return rejection(RejectionCode.INVALID_FRAME, 405);
    const origin = request.headers.get("origin");
    if (!origin || origin !== env.SYNC_ORIGIN)
      return rejection(RejectionCode.AUTHENTICATION_REQUIRED, 403);
    let accountId: string | null;
    try {
      accountId = await authenticate(request, env, origin);
    } catch {
      await recordTransportDiagnostic({
        eventCode: "request_rejected",
        failureCode: "authentication_invalid",
        protocolVersion: 1,
      });
      return rejection(RejectionCode.AUTHENTICATION_REQUIRED, 401);
    }
    if (!accountId) return rejection(RejectionCode.AUTHENTICATION_REQUIRED, 401);
    if (
      request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !==
      "application/octet-stream"
    ) {
      return rejection(RejectionCode.INVALID_FRAME, 415);
    }
    let body: Uint8Array;
    try {
      body = await readBoundedBody(request);
    } catch (error) {
      return error instanceof CodecError && error.code === "OVERSIZED"
        ? rejection(RejectionCode.TOO_LARGE, 413)
        : rejection(RejectionCode.INVALID_FRAME);
    }
    let frame;
    try {
      frame = decodeFrame(body);
    } catch (error) {
      return error instanceof CodecError && error.code === "OVERSIZED"
        ? rejection(RejectionCode.TOO_LARGE, 413)
        : rejection(RejectionCode.INVALID_FRAME);
    }
    let routeName: string;
    try {
      routeName = await accountRouteName(env.SYNC_HMAC_SECRET, accountId);
      if (env.DB && (await isAccountDeleted({ DB: env.DB }, routeName))) {
        return rejection(RejectionCode.ACCOUNT_DELETED, 410);
      }
    } catch (error) {
      const failure = transportFailure(error);
      await recordTransportDiagnostic({
        eventCode: "request_rejected",
        failureCode: failure.code,
        protocolVersion: 1,
        messageType: frame.type,
        byteCount: body.length,
        accountId,
      });
      const code = rejectionForFailure(failure.code);
      return rejection(code, code === RejectionCode.ACCOUNT_DELETED ? 410 : 503);
    }
    const client = accountClient(env, accountId, routeName);
    try {
      if (frame.type === MessageType.HELLO) {
        const hello = decodeStrictHello(frame.payload);
        if (!hello.bootstrapId || hello.pendingBatchCount === undefined) {
          return rejection(RejectionCode.INVALID_RECORD);
        }
        const sessionId = copyBytes(hello.bootstrapId);
        const expiresAt = Math.floor(now() / 1000) + NONCE_TTL_SECONDS;
        const started = await client.beginBootstrap(
          base64Url(sessionId),
          expiresAt,
          hello.actorId,
          hello.revocationHandleHash,
          hello.lastServerRevision,
          hello.causalSummary,
          hello.pendingBatchCount
        );
        if (started.status === "rejected") {
          return rejection(RejectionCode.INVALID_RECORD);
        }
        const initial = started.snapshot;
        const nonce = await snapshotNonce(
          env.SYNC_HMAC_SECRET,
          accountId,
          started.revision,
          sessionId,
          now,
          randomBytes
        );
        const session: BootstrapSession = {
          id: base64Url(sessionId),
          revision: started.revision,
          nonce,
        };
        if ((hello.pendingBatchCount ?? 0) > 0) {
          return new Response(
            responseBytes(
              encodeDetailedAcknowledgement({
                requestId: sessionId,
                serverRevision: started.revision,
                outcomes: [],
              })
            ),
            { headers: responseHeaders }
          );
        }
        return snapshotResponse(client, initial, session);
      }
      if (frame.type === MessageType.MUTATION_BATCH) {
        const envelope = decodeMutationBatchEnvelope(encodeFrame(frame.type, frame.payload));
        const records = envelope.changes.map((record) =>
          asAccountMutation(decodeMutationRecord(record))
        );
        const isLive = equalBytes(copyBytes(envelope.bootstrapId), new Uint8Array(16));
        if (
          (isLive && (envelope.batchIndex !== 0 || envelope.batchCount !== 1)) ||
          (!isLive && envelope.batchCount === 0)
        ) {
          return rejection(RejectionCode.INVALID_RECORD);
        }
        const result: BatchResult = isLive
          ? await client.applyMutations(records)
          : await client.applyBootstrapBatch(
              base64Url(copyBytes(envelope.bootstrapId)),
              envelope.batchIndex,
              envelope.batchCount,
              records
            );
        const ack = detailedMutationAcknowledgement(envelope.requestId, result, records);
        if (isLive) return new Response(responseBytes(ack), { headers: responseHeaders });
        const sessionId = base64Url(copyBytes(envelope.bootstrapId));
        const status = await client.bootstrapStatus(sessionId);
        if (status.receivedBatchCount < status.expectedBatchCount)
          return new Response(responseBytes(ack), { headers: responseHeaders });
        const initial = await client.bootstrapSnapshot(sessionId);
        const nonce = await snapshotNonce(
          env.SYNC_HMAC_SECRET,
          accountId,
          status.revision,
          copyBytes(envelope.bootstrapId),
          now,
          randomBytes
        );
        return snapshotResponse(
          client,
          initial,
          { id: sessionId, revision: status.revision, nonce },
          [ack]
        );
      }
      if (frame.type === MessageType.SNAPSHOT_CONFIRM) {
        const nonce = frame.payload;
        const verified = await validSnapshotNonce(env.SYNC_HMAC_SECRET, accountId, nonce, now);
        if (!verified) {
          return rejection(RejectionCode.TRANSIENT_FAILURE);
        }
        const result = await client.confirmBootstrap(
          base64Url(verified.sessionId),
          verified.revision
        );
        if (result.status === "restart") {
          return rejection(RejectionCode.TRANSIENT_FAILURE);
        }
        const buffered = result.mutations
          .slice()
          .sort((left, right) =>
            left.revision < right.revision ? -1 : left.revision > right.revision ? 1 : 0
          )
          .map((entry) =>
            encodeRevisionedDeltaBatchFrame([
              {
                serverRevision: entry.revision,
                record: encodeMutationRecord(asMutationRecord(entry.mutation)),
              },
            ])
          );
        return new Response(
          responseBytes(
            concat(
              encodeDetailedAcknowledgement({
                requestId: new Uint8Array(NONCE_SESSION_BYTES),
                serverRevision: result.serverRevision,
                outcomes: [],
              }),
              ...buffered
            )
          ),
          { headers: responseHeaders }
        );
      }
      return rejection(RejectionCode.INVALID_FRAME);
    } catch (error) {
      const failure = transportFailure(error);
      await recordTransportDiagnostic({
        eventCode: "request_rejected",
        failureCode: failure.code,
        protocolVersion: 1,
        messageType: frame.type,
        byteCount: body.length,
        accountId,
      });
      const code = rejectionForFailure(failure.code);
      return rejection(
        code,
        code === RejectionCode.ACCOUNT_DELETED
          ? 410
          : failure.policy.disposition === "permanent"
            ? 400
            : 503
      );
    }
  };
}
