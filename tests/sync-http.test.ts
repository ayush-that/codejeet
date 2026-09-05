import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  Crc32cAccumulator,
  MessageType,
  RejectionCode,
  decodeDetailedAcknowledgement,
  decodeFrame,
  decodeRejectionFrame,
  decodeSnapshotBeginFrame,
  decodeSnapshotChunkFrame,
  decodeSnapshotEndFrame,
  decodeUnsignedLeb128,
  encodeFrame,
  encodeHello,
  encodeMutationBatchEnvelope,
  encodeMutationRecord,
  type MutationRecord,
} from "../lib/sync/codec";
import { createSyncHandler } from "../lib/sync/http";
import { PersistenceError } from "../lib/sync/account-data";
import { accountRouteName } from "../lib/sync/account-route";
import { emptyProblemNoteState, emptyProgressState, type ActorId } from "../lib/sync/domain";
import type { CanonicalAccountData } from "../lib/sync/account-data";

const ORIGIN = "https://codejeet.com";
const SECRET = "test-sync-secret";

function actor(seed: number): ActorId {
  const value = new Uint8Array(16);
  value.fill(seed);
  return value;
}

function hello(): Uint8Array {
  return encodeHello({
    actorId: actor(1),
    revocationHandleHash: new Uint8Array(32),
    lastServerRevision: BigInt(0),
    causalSummary: [],
    bootstrapId: actor(250),
    pendingBatchCount: 0,
  });
}

function liveMutation(record: MutationRecord): Uint8Array {
  return encodeMutationBatchEnvelope({
    requestId: actor(251),
    bootstrapId: new Uint8Array(16),
    batchIndex: 0,
    batchCount: 1,
    changes: [encodeMutationRecord(record)],
  });
}

function canonical(serverRevision = BigInt(0)): CanonicalAccountData {
  const actorId = actor(1);
  return {
    serverRevision,
    actors: new Map([
      [
        Array.from(actorId, (byte) => byte.toString(16).padStart(2, "0")).join(""),
        { actorId, revocationHandleHash: new Uint8Array(32), isLegacy: false },
      ],
    ]),
    progress: emptyProgressState(),
    notes: emptyProblemNoteState(),
    shards: new Map(),
    directory: new Map(),
  };
}

function environment(
  getCanonical: () => Promise<CanonicalAccountData>,
  applyMutations: (mutations: readonly unknown[]) => Promise<unknown>,
  routeNames: string[]
): CloudflareEnv {
  const sessions = new Map<
    string,
    {
      revision: bigint;
      snapshot: CanonicalAccountData;
      mutations: { revision: bigint; mutation: unknown }[];
      overflowed: boolean;
    }
  >();
  const stub = {
    getCanonical,
    beginBootstrap: async (
      sessionId: string,
      _expiresAt: number,
      _actorId: Uint8Array | ArrayBuffer,
      _revocationHandleHash: Uint8Array | ArrayBuffer
    ) => {
      const snapshot = await getCanonical();
      sessions.set(sessionId, {
        revision: snapshot.serverRevision,
        snapshot,
        mutations: [],
        overflowed: false,
      });
      return { revision: snapshot.serverRevision, snapshot };
    },
    bootstrapStatus: async (sessionId: string) => {
      const session = sessions.get(sessionId);
      if (!session) throw new Error("missing session");
      const current = await getCanonical();
      return {
        revision: session.revision,
        latestRevision: current.serverRevision,
        overflowed:
          session.overflowed ||
          (current.serverRevision !== session.revision && session.mutations.length === 0),
      };
    },
    abortBootstrap: async (sessionId: string) => {
      sessions.delete(sessionId);
    },
    confirmBootstrap: async (sessionId: string, _revision: bigint) => {
      const session = sessions.get(sessionId);
      if (!session) return { status: "restart" as const };
      sessions.delete(sessionId);
      const current = await getCanonical();
      if (
        session.overflowed ||
        (current.serverRevision !== session.revision && session.mutations.length === 0)
      ) {
        return { status: "restart" as const };
      }
      return {
        status: "ready" as const,
        serverRevision: current.serverRevision,
        mutations: session.mutations,
      };
    },
    applyMutations: (_accountId: string, mutations: readonly unknown[]) =>
      applyMutations(mutations).then((result) => {
        const value = result as {
          serverRevision: bigint;
          results?: { accepted: boolean; serverRevision: bigint }[];
        };
        for (const session of sessions.values()) {
          value.results?.forEach((item, index) => {
            if (item.accepted) {
              if (session.mutations.length >= 100) session.overflowed = true;
              else
                session.mutations.push({
                  revision: item.serverRevision,
                  mutation: mutations[index],
                });
            }
          });
        }
        return result;
      }),
  };
  return {
    SYNC_HMAC_SECRET: SECRET,
    SYNC_ORIGIN: ORIGIN,
    ACCOUNT_DATA: {
      getByName(name: string) {
        routeNames.push(name);
        return stub;
      },
    },
  } as unknown as CloudflareEnv;
}

function request(body: Uint8Array, headers: Record<string, string> = {}): Request {
  return new Request(`${ORIGIN}/api/sync`, {
    method: "POST",
    body: body.slice().buffer as ArrayBuffer,
    headers: {
      Origin: ORIGIN,
      "Content-Type": "application/octet-stream",
      ...headers,
    },
  });
}

async function responseBytes(response: Response): Promise<Uint8Array> {
  return new Uint8Array(await response.arrayBuffer());
}

function frames(bytes: Uint8Array): ReturnType<typeof decodeFrame>[] {
  const result: ReturnType<typeof decodeFrame>[] = [];
  let offset = 0;
  while (offset < bytes.length) {
    assert.equal(bytes[offset], 0x43);
    const length = decodeUnsignedLeb128(bytes, offset + 6);
    const end = length.offset + Number(length.value) + 4;
    result.push(decodeFrame(bytes.slice(offset, end)));
    offset = end;
  }
  assert.equal(offset, bytes.length);
  return result;
}

function rejectionCode(response: Response, bytes: Uint8Array): RejectionCode {
  assert.equal(response.headers.get("content-type"), "application/octet-stream");
  return decodeRejectionFrame(bytes).code;
}

describe("authenticated binary HTTP synchronization", () => {
  it("routes only the verified identity and rejects wrong origin or authentication", async () => {
    const routeNames: string[] = [];
    const handler = createSyncHandler({ authenticate: async () => "user_verified" });
    const env = environment(
      async () => canonical(),
      async () => ({ serverRevision: BigInt(0), acceptedCount: 0 }),
      routeNames
    );

    const wrongOrigin = await handler(
      new Request(`${ORIGIN}/api/sync`, {
        method: "POST",
        body: encodeFrame(MessageType.HELLO, new Uint8Array()).buffer as ArrayBuffer,
        headers: { Origin: "https://evil.example", "Content-Type": "application/octet-stream" },
      }),
      env
    );
    assert.equal(wrongOrigin.status, 403);
    assert.equal(routeNames.length, 0);

    const unauthenticated = await createSyncHandler({ authenticate: async () => null })(
      request(encodeFrame(MessageType.HELLO, hello())),
      env
    );
    assert.equal(unauthenticated.status, 401);
    assert.equal(routeNames.length, 0);

    const expected = await accountRouteName(SECRET, "user_verified");
    const valid = await handler(request(encodeFrame(MessageType.HELLO, hello())), env);
    assert.equal(valid.status, 200);
    assert.deepEqual(routeNames, [expected]);
  });

  it("rejects malformed and oversized frames before reaching Account Data", async () => {
    const routeNames: string[] = [];
    let applied = 0;
    const handler = createSyncHandler({ authenticate: async () => "user_verified" });
    const env = environment(
      async () => canonical(),
      async () => {
        applied++;
        return { serverRevision: BigInt(1), acceptedCount: 1 };
      },
      routeNames
    );
    const malformed = await handler(request(Uint8Array.of(1, 2, 3)), env);
    assert.equal(
      rejectionCode(malformed, await responseBytes(malformed)),
      RejectionCode.INVALID_FRAME
    );
    assert.equal(routeNames.length, 0);
    const oversized = await handler(request(new Uint8Array(64 * 1024 + 1)), env);
    assert.equal(rejectionCode(oversized, await responseBytes(oversized)), RejectionCode.TOO_LARGE);
    assert.equal(applied, 0);
  });

  it("maps permanent and transient failures while keeping diagnostics redacted", async () => {
    const logs: string[] = [];
    const originalWarn = console.warn;
    console.warn = ((value: unknown) => logs.push(String(value))) as typeof console.warn;
    try {
      const permanent = createSyncHandler({ authenticate: async () => "user_verified" });
      const permanentEnv = environment(
        async () => canonical(),
        async () => {
          throw new PersistenceError("unknown Problem Registry slug: private-note-text");
        },
        []
      );
      const permanentResponse = await permanent(
        request(
          liveMutation({
            kind: "note",
            slug: "01-matrix",
            actorId: actor(1),
            localRevision: BigInt(0),
            operation: { kind: "delete" },
          })
        ),
        permanentEnv
      );
      assert.equal(permanentResponse.status, 400);

      const transient = createSyncHandler({ authenticate: async () => "user_verified" });
      const transientEnv = environment(
        async () => canonical(),
        async () => {
          throw new Error("database frame private-note-text clerk-token revocation-handle");
        },
        []
      );
      const transientResponse = await transient(
        request(
          liveMutation({
            kind: "note",
            slug: "01-matrix",
            actorId: actor(1),
            localRevision: BigInt(1),
            operation: { kind: "delete" },
          })
        ),
        transientEnv
      );
      assert.equal(transientResponse.status, 503);
      const redacted = logs.join("\n");
      assert.doesNotMatch(redacted, /private-note-text|clerk-token|revocation-handle/);
      assert.match(redacted, /unknown_slug/);
      assert.match(redacted, /d1_transaction_failed/);
    } finally {
      console.warn = originalWarn;
    }
  });

  it("persists a canonical mutation through the trusted wrapper and acknowledges it", async () => {
    const routeNames: string[] = [];
    let received: readonly unknown[] = [];
    const handler = createSyncHandler({ authenticate: async () => "user_verified" });
    const env = environment(
      async () => canonical(),
      async (mutations) => {
        received = mutations;
        return {
          serverRevision: BigInt(1),
          acceptedCount: mutations.length,
          results: mutations.map(() => ({
            accepted: true,
            serverRevision: BigInt(1),
          })),
          current: canonical(BigInt(1)),
        };
      },
      routeNames
    );
    const record: MutationRecord = {
      kind: "add",
      slug: "01-matrix",
      actorId: actor(1),
      counter: BigInt(0),
    };
    const response = await handler(request(liveMutation(record)), env);
    assert.equal(response.status, 200);
    const acknowledgement = decodeDetailedAcknowledgement(await responseBytes(response));
    assert.equal(acknowledgement.serverRevision, BigInt(1));
    assert.equal(acknowledgement.outcomes.length, 1);
    assert.equal(acknowledgement.outcomes[0]?.status, "accepted");
    assert.equal(received.length, 1);
    assert.equal(routeNames.length, 1);
  });

  it("rejects noncanonical live batch metadata before applying mutations", async () => {
    let applied = 0;
    const handler = createSyncHandler({ authenticate: async () => "user_verified" });
    const env = environment(
      async () => canonical(),
      async () => {
        applied++;
        throw new Error("must not apply");
      },
      []
    );
    const record: MutationRecord = {
      kind: "add",
      slug: "01-matrix",
      actorId: actor(1),
      counter: BigInt(0),
    };
    const invalid = encodeMutationBatchEnvelope({
      requestId: actor(251),
      bootstrapId: new Uint8Array(16),
      batchIndex: 1,
      batchCount: 2,
      changes: [encodeMutationRecord(record)],
    });
    const response = await handler(request(invalid), env);
    assert.equal(response.status, 400);
    assert.equal(
      rejectionCode(response, await responseBytes(response)),
      RejectionCode.INVALID_RECORD
    );
    assert.equal(applied, 0);
  });

  it("streams deterministic snapshot records, checksum, and an expiring confirmation nonce", async () => {
    const routeNames: string[] = [];
    const handler = createSyncHandler({
      authenticate: async () => "user_verified",
      now: () => 1_000_000,
      randomBytes: (size) => new Uint8Array(size).fill(7),
    });
    const env = environment(
      async () => canonical(BigInt(7)),
      async () => ({ serverRevision: BigInt(7), acceptedCount: 0 }),
      routeNames
    );
    const response = await handler(request(encodeFrame(MessageType.HELLO, hello())), env);
    const output = frames(await responseBytes(response));
    assert.equal(output[0].type, MessageType.SNAPSHOT_BEGIN);
    const begin = decodeSnapshotBeginFrame(encodeFrame(output[0].type, output[0].payload));
    assert.equal(begin.revision, BigInt(7));
    assert.equal(begin.actorCount, 1);
    assert.equal(begin.chunkCount, 1);
    const chunk = decodeSnapshotChunkFrame(encodeFrame(output[1].type, output[1].payload));
    assert.equal(chunk.index, 0);
    const checksum = new Crc32cAccumulator().update(chunk.records[0]).digest();
    assert.equal(decodeSnapshotEndFrame(encodeFrame(output[2].type, output[2].payload)), checksum);
    assert.equal(output[3].type, MessageType.SNAPSHOT_CONFIRM);
    assert.equal(output[3].payload.length, 80);

    const confirmed = await handler(
      request(encodeFrame(MessageType.SNAPSHOT_CONFIRM, output[3].payload)),
      env
    );
    assert.deepEqual(decodeDetailedAcknowledgement(await responseBytes(confirmed)), {
      requestId: actor(0),
      serverRevision: BigInt(7),
      outcomes: [],
    });
  });

  it("accepts an offline causal vector ahead of the captured server revision", async () => {
    const handler = createSyncHandler({ authenticate: async () => "user_verified" });
    const offlineHello = encodeHello({
      actorId: actor(1),
      revocationHandleHash: new Uint8Array(32),
      lastServerRevision: BigInt(0),
      causalSummary: [{ actorId: actor(1), counter: BigInt(9) }],
      bootstrapId: actor(250),
      pendingBatchCount: 0,
    });
    const env = environment(
      async () => canonical(BigInt(0)),
      async () => ({ serverRevision: BigInt(0), acceptedCount: 0 }),
      []
    );
    const response = await handler(request(encodeFrame(MessageType.HELLO, offlineHello)), env);
    assert.equal(response.status, 200);
    await response.arrayBuffer();
  });

  it("returns a restart outcome when the captured snapshot revision changes", async () => {
    const routeNames: string[] = [];
    let reads = 0;
    const handler = createSyncHandler({ authenticate: async () => "user_verified" });
    const env = environment(
      async () => {
        reads++;
        return canonical(reads === 1 ? BigInt(1) : BigInt(2));
      },
      async () => ({ serverRevision: BigInt(2), acceptedCount: 0 }),
      routeNames
    );
    const output = frames(
      await responseBytes(await handler(request(encodeFrame(MessageType.HELLO, hello())), env))
    );
    assert.equal(output.at(-1)?.type, MessageType.REJECTION);
    assert.equal(
      decodeRejectionFrame(
        encodeFrame(MessageType.REJECTION, output.at(-1)?.payload ?? new Uint8Array())
      ).code,
      RejectionCode.TRANSIENT_FAILURE
    );
  });

  it("buffers post-revision mutations and returns them after confirmation", async () => {
    const routeNames: string[] = [];
    let current = canonical(BigInt(0));
    const record: MutationRecord = {
      kind: "add",
      slug: "01-matrix",
      actorId: actor(1),
      counter: BigInt(0),
    };
    const handler = createSyncHandler({ authenticate: async () => "user_verified" });
    const env = environment(
      async () => current,
      async (mutations) => {
        current = canonical(BigInt(1));
        return {
          serverRevision: BigInt(1),
          acceptedCount: mutations.length,
          results: mutations.map(() => ({ accepted: true, serverRevision: BigInt(1) })),
        };
      },
      routeNames
    );
    const snapshot = await handler(request(encodeFrame(MessageType.HELLO, hello())), env);
    await handler(request(liveMutation(record)), env);
    const snapshotFrames = frames(await responseBytes(snapshot));
    assert.equal(snapshotFrames.at(-1)?.type, MessageType.SNAPSHOT_CONFIRM);
    const confirmed = await handler(
      request(
        encodeFrame(
          MessageType.SNAPSHOT_CONFIRM,
          snapshotFrames.at(-1)?.payload ?? new Uint8Array()
        )
      ),
      env
    );
    const confirmationFrames = frames(await responseBytes(confirmed));
    assert.equal(confirmationFrames[0].type, MessageType.ACKNOWLEDGEMENT);
    assert.equal(
      decodeDetailedAcknowledgement(
        encodeFrame(confirmationFrames[0].type, confirmationFrames[0].payload)
      ).outcomes.length,
      0
    );
    assert.equal(confirmationFrames[1].type, MessageType.DELTA_BATCH);
  });

  it("restarts when the bounded catch-up buffer overflows", async () => {
    const routeNames: string[] = [];
    let revision = BigInt(0);
    const handler = createSyncHandler({ authenticate: async () => "user_verified" });
    const env = environment(
      async () => canonical(revision),
      async (mutations) => {
        revision += BigInt(1);
        return {
          serverRevision: revision,
          acceptedCount: mutations.length,
          results: mutations.map(() => ({ accepted: true, serverRevision: revision })),
        };
      },
      routeNames
    );
    const snapshot = await handler(request(encodeFrame(MessageType.HELLO, hello())), env);
    for (let counter = 0; counter < 101; counter++) {
      await handler(
        request(
          liveMutation({
            kind: "add",
            slug: "01-matrix",
            actorId: actor(1),
            counter: BigInt(counter),
          })
        ),
        env
      );
    }
    const output = frames(await responseBytes(snapshot));
    assert.equal(output.at(-1)?.type, MessageType.REJECTION);
    assert.equal(
      decodeRejectionFrame(
        encodeFrame(MessageType.REJECTION, output.at(-1)?.payload ?? new Uint8Array())
      ).code,
      RejectionCode.TRANSIENT_FAILURE
    );
  });
});
