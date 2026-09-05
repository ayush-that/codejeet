import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MessageType,
  RejectionCode,
  crc32c,
  decodeHelloFrame,
  decodeMutationBatchEnvelope,
  encodeDetailedAcknowledgement,
  encodeRejectionFrame,
  encodeMutationRecord,
  encodeRevisionedDeltaBatchFrame,
  encodeProgressShard,
  encodeProblemNoteText,
  encodeSnapshotRecord,
  encodeFrame,
  encodeSnapshotBeginFrame,
  encodeSnapshotEndFrame,
} from "../lib/sync/codec";
import {
  HttpRecoverySyncClient,
  WebSocketSyncClient,
  checkRetainedAccountRevocations,
  compactPendingBatches,
} from "../lib/learning-data/sync-client";
import { SyncFrameParser, parseSyncFrames } from "../lib/learning-data/sync-parser";
import type {
  AccountCacheProgress,
  AccountCacheSyncState,
} from "../lib/learning-data/account-cache";
import { createIndexedDbAccountCache } from "../lib/learning-data/account-cache";

const actor = Uint8Array.from({ length: 16 }, (_, index) => index + 1);
const handle = Uint8Array.from({ length: 32 }, (_, index) => index + 3);

type FakeSocket = {
  binaryType: string;
  onopen: (() => void) | null;
  onmessage: ((event: { data: ArrayBuffer | Uint8Array | Blob }) => void) | null;
  onerror: (() => void) | null;
  onclose: (() => void) | null;
  sent: ArrayBuffer[];
  closed: number;
  send: (data: ArrayBuffer) => void;
  close: () => void;
};

function fakeSocket(): FakeSocket {
  const socket = {
    binaryType: "",
    onopen: null,
    onmessage: null,
    onerror: null,
    onclose: null,
    sent: [] as ArrayBuffer[],
    closed: 0,
    send(data: ArrayBuffer) {
      socket.sent.push(data);
    },
    close() {
      socket.closed += 1;
    },
  } satisfies FakeSocket;
  return socket;
}

function flush(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

function split(input: Uint8Array, width: number): Uint8Array[] {
  const chunks: Uint8Array[] = [];
  for (let index = 0; index < input.length; index += width)
    chunks.push(input.slice(index, index + width));
  return chunks;
}

describe("HTTP sync client framing", () => {
  it("wipes only caches confirmed deleted on signed-out next contact", async () => {
    const retained = [
      { accountId: "account-a", revocationHandle: handle },
      { accountId: "account-b", revocationHandle: handle.slice().map((value) => value + 1) },
    ];
    const erased: string[] = [];
    const requests: Uint8Array[] = [];
    const cache = {
      listRevocationHandles: async () => retained,
      eraseAccount: async (accountId: string) => {
        erased.push(accountId);
        return true;
      },
    } as unknown as AccountCacheProgress;
    const result = await checkRetainedAccountRevocations(cache, async (_input, init) => {
      requests.push(new Uint8Array(init?.body as ArrayBuffer));
      return new Response(JSON.stringify({ deleted: requests.length === 1 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
    assert.deepEqual(result, { kind: "erased", erasedAccountIds: ["account-a"] });
    assert.deepEqual(erased, ["account-a"]);
    assert.equal(requests[0].byteLength, 32);
    assert.equal(requests[1].byteLength, 32);
  });

  it("preserves retained caches on a transient or malformed revocation response", async () => {
    const cache = {
      listRevocationHandles: async () => [{ accountId: "account-a", revocationHandle: handle }],
      eraseAccount: async () => {
        throw new Error("must not erase");
      },
    } as unknown as AccountCacheProgress;
    assert.deepEqual(
      await checkRetainedAccountRevocations(cache, async () => new Response(null, { status: 503 })),
      { kind: "unavailable", erasedAccountIds: [] }
    );
    assert.deepEqual(
      await checkRetainedAccountRevocations(
        cache,
        async () =>
          new Response(JSON.stringify({ deleted: true, extra: "unexpected" }), { status: 200 })
      ),
      { kind: "unavailable", erasedAccountIds: [] }
    );
  });

  it("emits complete frames across every boundary and rejects truncation", () => {
    const first = encodeFrame(MessageType.HELLO, Uint8Array.of(1, 2, 3));
    const second = encodeFrame(MessageType.ACKNOWLEDGEMENT, Uint8Array.of(4));
    const frames = parseSyncFrames(split(new Uint8Array([...first, ...second]), 1));
    assert.equal(frames.length, 2);
    assert.equal(frames[0].type, MessageType.HELLO);
    assert.equal(frames[1].type, MessageType.ACKNOWLEDGEMENT);
    const parser = new SyncFrameParser(() => {});
    parser.push(first.slice(0, -1));
    assert.throws(() => parser.finish(), /truncated/);
  });

  it("keeps mutation batches at the protocol limit", () => {
    const state = {
      accountId: "account-a",
      actorId: actor,
      revocationHandle: handle,
      lastServerRevision: BigInt(0),
      causalSummary: new Map(),
      pending: Array.from({ length: 101 }, (_, counter) => ({
        kind: "add" as const,
        slug: "alpha",
        actorId: actor,
        counter: BigInt(counter),
      })),
    } satisfies AccountCacheSyncState;
    const batches = compactPendingBatches(state);
    assert.equal(batches.length, 2);
  });

  it("hashes the Revocation Handle and sends bearer HTTP recovery batches", async () => {
    const state: AccountCacheSyncState = {
      accountId: "account-a",
      actorId: actor,
      revocationHandle: handle,
      lastServerRevision: BigInt(0),
      causalSummary: new Map(),
      pending: [{ kind: "add", slug: "alpha", actorId: actor, counter: BigInt(0) }],
    };
    const requests: RequestInit[] = [];
    const snapshotResponse = new Uint8Array([
      ...encodeSnapshotBeginFrame({
        revision: BigInt(1),
        actorCount: 0,
        progressShardCount: 0,
        problemNoteCount: 0,
        chunkCount: 0,
        totalLength: BigInt(0),
      }),
      ...encodeSnapshotEndFrame(0),
      ...encodeFrame(MessageType.SNAPSHOT_CONFIRM, Uint8Array.of(9)),
    ]);
    const fakeCache = {
      exportSyncState: async () => state,
      beginSnapshotStage: async () => true,
      writeSnapshotChunk: async () => true,
      finishSnapshotStage: async () => ({ progress: {}, notes: {}, localCommitSequence: "0" }),
      applyCanonicalMutation: async () => ({
        progress: {},
        notes: {},
        localCommitSequence: "0",
      }),
      acknowledgeProgress: async () => ({
        progress: {},
        notes: {},
        localCommitSequence: "0",
      }),
    } as unknown as AccountCacheProgress;
    const transport = async (_input: RequestInfo | URL, init?: RequestInit) => {
      requests.push(init ?? {});
      let body: Uint8Array<ArrayBufferLike> = snapshotResponse;
      if (requests.length === 3) {
        body = encodeDetailedAcknowledgement({
          requestId: new Uint8Array(16),
          serverRevision: BigInt(1),
          outcomes: [],
        });
      } else if (requests.length > 1) {
        const envelope = decodeMutationBatchEnvelope(init?.body as Uint8Array);
        body = encodeDetailedAcknowledgement({
          requestId: envelope.requestId,
          serverRevision: BigInt(1),
          outcomes: envelope.changes.map((record) => ({
            status: "accepted" as const,
            serverRevision: BigInt(1),
            record,
          })),
        });
      }
      return new Response(body as unknown as BodyInit, {
        status: 200,
        headers: { "Content-Type": "application/octet-stream" },
      });
    };
    const client = new HttpRecoverySyncClient(fakeCache, transport);
    assert.deepEqual(
      await client.run({ accountId: "account-a", epoch: 4, token: "session-token" }),
      {
        kind: "complete",
      }
    );
    assert.equal(requests.length, 4);
    assert.equal(
      (requests[0].headers as Record<string, string>).Authorization,
      "Bearer session-token"
    );
    const hello = decodeHelloFrame(requests[0].body as Uint8Array);
    assert.notDeepEqual(hello.revocationHandleHash, handle);
    assert.equal(hello.pendingBatchCount, 1);
    assert.equal(decodeMutationBatchEnvelope(requests[1].body as Uint8Array).batchIndex, 0);
    assert.equal(
      (requests[2].headers as Record<string, string>).Authorization,
      "Bearer session-token"
    );
  });

  it("applies detailed mixed outcomes and revisioned catch-up before pruning exact pending state", async () => {
    const progressDelta = {
      kind: "progress-delta" as const,
      adds: [{ slug: "alpha", actorId: actor, counter: BigInt(0) }],
      causalSummary: [{ actorId: actor, counter: BigInt(0) }],
      removed: [],
    };
    let pending: (typeof progressDelta)[] = [progressDelta];
    const applied: bigint[] = [];
    let acknowledgements = 0;
    const cache = {
      exportSyncState: async () => ({
        accountId: "account-a",
        actorId: actor,
        revocationHandle: handle,
        lastServerRevision: BigInt(0),
        causalSummary: new Map(),
        pending,
      }),
      beginSnapshotStage: async () => true,
      writeSnapshotChunk: async () => true,
      finishSnapshotStage: async () => ({ progress: {}, notes: {}, localCommitSequence: "0" }),
      applyCanonicalMutation: async (mutation: { serverRevision: bigint }) => {
        applied.push(mutation.serverRevision);
        return { progress: {}, notes: {}, localCommitSequence: "0" };
      },
      acknowledgeProgress: async () => {
        acknowledgements += 1;
        pending = [];
        return { progress: {}, notes: {}, localCommitSequence: "0" };
      },
    } as unknown as AccountCacheProgress;
    const snapshot = new Uint8Array([
      ...encodeSnapshotBeginFrame({
        revision: BigInt(0),
        actorCount: 0,
        progressShardCount: 0,
        problemNoteCount: 0,
        chunkCount: 0,
        totalLength: BigInt(0),
      }),
      ...encodeSnapshotEndFrame(0),
      ...encodeFrame(MessageType.SNAPSHOT_CONFIRM, Uint8Array.of(9)),
    ]);
    let requests = 0;
    const transport = async (_input: RequestInfo | URL, init?: RequestInit) => {
      requests += 1;
      if (requests === 1) return new Response(snapshot as unknown as BodyInit, { status: 200 });
      if (requests === 2) {
        const envelope = decodeMutationBatchEnvelope(init?.body as Uint8Array);
        return new Response(
          encodeDetailedAcknowledgement({
            requestId: envelope.requestId,
            serverRevision: BigInt(1),
            outcomes: [
              {
                status: "accepted",
                serverRevision: BigInt(1),
                record: encodeMutationRecord(progressDelta),
              },
            ],
          }) as unknown as BodyInit,
          { status: 200 }
        );
      }
      return new Response(
        encodeRevisionedDeltaBatchFrame([
          { serverRevision: BigInt(2), record: encodeMutationRecord(progressDelta) },
        ]) as unknown as BodyInit,
        { status: 200 }
      );
    };
    const client = new HttpRecoverySyncClient(cache, transport);
    assert.deepEqual(await client.run({ accountId: "account-a", epoch: 1, token: "token" }), {
      kind: "complete",
    });
    assert.deepEqual(applied, [BigInt(1), BigInt(2)]);
    assert.equal(acknowledgements, 1);
    assert.equal(requests, 3);
  });

  it("keeps recovery silent for transient HTTP failures and stops on auth failure", async () => {
    const state: AccountCacheSyncState = {
      accountId: "account-a",
      actorId: actor,
      revocationHandle: handle,
      lastServerRevision: BigInt(0),
      causalSummary: new Map(),
      pending: [],
    };
    const cache = { exportSyncState: async () => state } as unknown as AccountCacheProgress;
    const transient = new HttpRecoverySyncClient(
      cache,
      async () => new Response(null, { status: 503 })
    );
    assert.deepEqual(await transient.run({ accountId: "account-a", epoch: 1, token: "token" }), {
      kind: "retry",
      retryDelayMs: 250,
    });
    const unauthorized = new HttpRecoverySyncClient(
      cache,
      async () => new Response(null, { status: 401 })
    );
    assert.deepEqual(await unauthorized.run({ accountId: "account-a", epoch: 1, token: "token" }), {
      kind: "permanent",
    });
  });

  it("stages a streamed canonical record and leaves the active generation on checksum failure", async () => {
    const databaseName = `sync-stage-${Date.now()}-${Math.random()}`;
    const cache = createIndexedDbAccountCache({
      databaseName,
      registry: { version: 1, problems: [{ slug: "alpha", active: true }] },
      randomBytes: () => actor,
      randomHandleBytes: () => handle,
    });
    try {
      await cache.activate("account-a");
      const encoded = encodeSnapshotRecord({
        kind: "shard",
        prefix: "a",
        depth: 4,
        encoded: encodeProgressShard({
          adds: [{ slug: "alpha", actorId: actor, counter: BigInt(0) }],
          removed: [],
        }),
      });
      const encodedNote = encodeSnapshotRecord({
        kind: "note",
        slug: "alpha",
        actorId: actor,
        localRevision: BigInt(0),
        serverRevision: BigInt(1),
        operation: { kind: "value", bytes: encodeProblemNoteText("memo") },
      });
      const records = [encoded, encodedNote];
      assert.equal(await cache.beginSnapshotStage("server-generation", BigInt(1)), true);
      assert.equal(await cache.writeSnapshotChunk("server-generation", 0, records), true);
      assert.equal(
        await cache.finishSnapshotStage("server-generation", {
          actorCount: 0,
          progressShardCount: 1,
          problemNoteCount: 1,
          chunkCount: 2,
          totalLength: BigInt(encoded.length + encodedNote.length),
          checksum: crc32c(records) ^ 1,
        }),
        null
      );
      assert.deepEqual(cache.read().progress, {});
      assert.equal(await cache.beginSnapshotStage("server-generation-2", BigInt(1)), true);
      assert.equal(await cache.writeSnapshotChunk("server-generation-2", 0, records), true);
      assert.deepEqual(
        (
          await cache.finishSnapshotStage("server-generation-2", {
            actorCount: 0,
            progressShardCount: 1,
            problemNoteCount: 1,
            chunkCount: 2,
            totalLength: BigInt(encoded.length + encodedNote.length),
            checksum: crc32c(records),
          })
        )?.progress,
        { alpha: true }
      );
      assert.equal(cache.read().notes.alpha, "memo");
    } finally {
      cache.close();
      await new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase(databaseName);
        request.onsuccess = request.onerror = request.onblocked = () => resolve();
      });
    }
  });
});

describe("WebSocket sync failure policy", () => {
  function cacheForSocket(overrides: Partial<AccountCacheProgress> = {}) {
    const state: AccountCacheSyncState = {
      accountId: "account-a",
      actorId: actor,
      revocationHandle: handle,
      lastServerRevision: BigInt(0),
      causalSummary: new Map(),
      pending: [],
    };
    return {
      exportSyncState: async () => state,
      eraseAccount: async () => true,
      ...overrides,
    } as unknown as AccountCacheProgress;
  }

  function startClient(
    cache: AccountCacheProgress,
    sockets: FakeSocket[],
    recovery: Partial<HttpRecoverySyncClient> = {}
  ) {
    const client = new WebSocketSyncClient(
      cache,
      {
        run: async () => ({ kind: "retry" as const, retryDelayMs: 250 }),
        stop: () => {},
        ...recovery,
      } as unknown as HttpRecoverySyncClient,
      () => {
        const socket = fakeSocket();
        sockets.push(socket);
        return socket;
      },
      "ws://sync.test/api/sync"
    );
    client.start({ accountId: "account-a", epoch: 1, token: "token" });
    sockets[0]?.onopen?.();
    return client;
  }

  it("closes malformed frames without rejecting the message chain or dropping pending data", async () => {
    const sockets: FakeSocket[] = [];
    const cache = cacheForSocket();
    const client = startClient(cache, sockets);
    await flush();
    sockets[0]?.onmessage?.({ data: Uint8Array.of(0xff) });
    await flush();
    assert.equal(sockets[0]?.closed, 1);
    assert.deepEqual((await cache.exportSyncState())?.pending, []);
    client.stop();
  });

  it("erases Account Data only after the server confirms deletion", async () => {
    const sockets: FakeSocket[] = [];
    let erased = 0;
    const client = startClient(
      cacheForSocket({ eraseAccount: async () => (erased += 1) > 0 }),
      sockets
    );
    await flush();
    sockets[0]?.onmessage?.({
      data: encodeRejectionFrame({ code: RejectionCode.ACCOUNT_DELETED, itemIndex: null }),
    });
    await flush();
    assert.equal(erased, 1);
    client.stop();
  });

  it("restarts a bootstrap after an overflow while keeping the connection retry capped", async () => {
    const sockets: FakeSocket[] = [];
    const client = startClient(cacheForSocket(), sockets);
    await flush();
    sockets[0]?.onmessage?.({
      data: encodeSnapshotBeginFrame({
        revision: BigInt(0),
        actorCount: 0,
        progressShardCount: 0,
        problemNoteCount: 0,
        chunkCount: 0,
        totalLength: BigInt(0),
      }),
    });
    await flush();
    sockets[0]?.onmessage?.({ data: encodeSnapshotEndFrame(0) });
    await flush();
    sockets[0]?.onmessage?.({
      data: encodeRejectionFrame({ code: RejectionCode.TRANSIENT_FAILURE, itemIndex: null }),
    });
    await new Promise((resolve) => setTimeout(resolve, 275));
    assert.equal(sockets.length, 2);
    client.stop();
  });
});

import "fake-indexeddb/auto";
