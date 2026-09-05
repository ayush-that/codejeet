/// <reference types="@cloudflare/vitest-plugin/types" />

import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { createSyncHandler } from "../../lib/sync/http";
import { createWebSocketSyncHandler } from "../../lib/sync/websocket";
import { accountRouteName } from "../../lib/sync/account-route";
import {
  MessageType,
  MAX_FRAME_BYTES,
  decodeDetailedAcknowledgement,
  decodeBatchFrame,
  decodeFrame,
  decodeUnsignedLeb128,
  decodeRejectionFrame,
  encodeFrame,
  encodeHello,
  encodeMutationRecord,
  encodeMutationBatchEnvelope,
} from "../../lib/sync/codec";
const accountId = "workers-http-account";
const origin = "https://example.test";

function actor(seed: number): Uint8Array {
  const value = new Uint8Array(16);
  value.fill(seed);
  return value;
}

function httpHello(actorId: Uint8Array, revocationHandleHash: Uint8Array): Uint8Array {
  return encodeHello({
    actorId,
    revocationHandleHash,
    lastServerRevision: BigInt(0),
    causalSummary: [],
    bootstrapId: crypto.getRandomValues(new Uint8Array(16)),
    pendingBatchCount: 0,
  });
}

function liveMutation(record: Uint8Array): Uint8Array {
  return encodeMutationBatchEnvelope({
    requestId: crypto.getRandomValues(new Uint8Array(16)),
    bootstrapId: new Uint8Array(16),
    batchIndex: 0,
    batchCount: 1,
    changes: [record],
  });
}

function request(body: Uint8Array): Request {
  return new Request(`${origin}/api/sync`, {
    method: "POST",
    body: body.slice().buffer as ArrayBuffer,
    headers: { Origin: origin, "Content-Type": "application/octet-stream" },
  });
}

function frames(bytes: Uint8Array): ReturnType<typeof decodeFrame>[] {
  const result: ReturnType<typeof decodeFrame>[] = [];
  let offset = 0;
  while (offset < bytes.length) {
    const length = decodeUnsignedLeb128(bytes, offset + 6);
    const end = length.offset + Number(length.value) + 4;
    result.push(decodeFrame(bytes.slice(offset, end)));
    offset = end;
  }
  return result;
}

type SocketResponse = Response & { webSocket?: WebSocket };

const socketQueues = new WeakMap<WebSocket, Uint8Array[]>();
const socketWaiters = new WeakMap<WebSocket, ((bytes: Uint8Array) => void)[]>();
const socketListeners = new WeakSet<WebSocket>();

function nextSocketMessage(socket: WebSocket): Promise<Uint8Array> {
  const queued = socketQueues.get(socket) ?? [];
  socketQueues.set(socket, queued);
  if (!socketListeners.has(socket)) {
    socketListeners.add(socket);
    socket.addEventListener("message", (event) => {
      const value: unknown = event.data;
      const deliver = (bytes: Uint8Array) => {
        const waiters = socketWaiters.get(socket) ?? [];
        const waiter = waiters.shift();
        if (waiter) waiter(bytes);
        else queued.push(bytes);
        socketWaiters.set(socket, waiters);
      };
      if (value instanceof ArrayBuffer) deliver(new Uint8Array(value));
      else if (value instanceof Uint8Array) deliver(value.slice());
      else if (value instanceof Blob)
        void value.arrayBuffer().then((bytes) => deliver(new Uint8Array(bytes)));
    });
  }
  if (queued.length > 0) return Promise.resolve(queued.shift() as Uint8Array);
  return new Promise((resolve) => {
    const waiters = socketWaiters.get(socket) ?? [];
    waiters.push(resolve);
    socketWaiters.set(socket, waiters);
  });
}

function nextSocketClose(socket: WebSocket): Promise<CloseEvent> {
  return new Promise((resolve) =>
    socket.addEventListener("close", (event) => resolve(event), { once: true })
  );
}

async function openSocket(
  handler: ReturnType<typeof createWebSocketSyncHandler>
): Promise<WebSocket> {
  const response = (await handler(
    new Request(`${origin}/api/sync`, {
      method: "GET",
      headers: { Origin: origin, Upgrade: "websocket" },
    }),
    env as unknown as CloudflareEnv
  )) as SocketResponse;
  expect(response.status).toBe(101);
  const socket = response.webSocket;
  expect(socket).toBeDefined();
  socket?.accept();
  return socket as WebSocket;
}

async function startBootstrap(
  socket: WebSocket,
  actorId: Uint8Array,
  revocationHandleHash: Uint8Array
): Promise<Uint8Array> {
  socket.send(
    encodeFrame(
      MessageType.HELLO,
      encodeHello({
        actorId,
        revocationHandleHash,
        lastServerRevision: BigInt(0),
        causalSummary: [],
        bootstrapId: crypto.getRandomValues(new Uint8Array(16)),
        pendingBatchCount: 0,
      })
    )
  );
  while (true) {
    const frame = decodeFrame(await nextSocketMessage(socket));
    if (frame.type === MessageType.SNAPSHOT_CONFIRM) return frame.payload;
  }
}

async function finishBootstrap(
  socket: WebSocket,
  nonce: Uint8Array,
  expectedChanges = 0
): Promise<void> {
  socket.send(encodeFrame(MessageType.SNAPSHOT_CONFIRM, nonce));
  const acknowledgement = decodeDetailedAcknowledgement(await nextSocketMessage(socket));
  expect(acknowledgement.outcomes).toHaveLength(0);
  void expectedChanges;
}

function authenticatedWebSocketHandler(
  account: string,
  expiresAt = Math.floor(Date.now() / 1000) + 300
) {
  return createWebSocketSyncHandler({
    authenticate: async () => ({ accountId: account, expiresAt }),
  });
}

describe("HTTP synchronization Workers runtime", () => {
  it("rejects unauthenticated requests before opening the account Durable Object", async () => {
    const handler = createSyncHandler({ authenticate: async () => null });
    const response = await handler(
      request(encodeFrame(MessageType.HELLO, new Uint8Array())),
      env as unknown as CloudflareEnv
    );
    expect(response.status).toBe(401);
    expect(decodeRejectionFrame(new Uint8Array(await response.arrayBuffer())).code).toBe(5);
  });

  it("authenticates, routes, persists, and acknowledges a mutation in Workers", async () => {
    const actorId = actor(44);
    const hash = new Uint8Array(32).fill(3);
    const handler = createSyncHandler({ authenticate: async () => accountId });
    const hello = httpHello(actorId, hash);
    const snapshot = await handler(
      request(encodeFrame(MessageType.HELLO, hello)),
      env as unknown as CloudflareEnv
    );
    expect(snapshot.status).toBe(200);
    await snapshot.arrayBuffer();
    const response = await handler(
      request(
        liveMutation(
          encodeMutationRecord({
            kind: "add",
            slug: "01-matrix",
            actorId,
            counter: BigInt(0),
          })
        )
      ),
      env as unknown as CloudflareEnv
    );
    const acknowledgement = decodeDetailedAcknowledgement(
      new Uint8Array(await response.arrayBuffer())
    );
    expect(acknowledgement.serverRevision).toBe(BigInt(1));
    expect(acknowledgement.outcomes).toHaveLength(1);
    expect(acknowledgement.outcomes[0]?.status).toBe("accepted");
  });

  it("keeps concurrent bootstrap sessions in the account Durable Object", async () => {
    const concurrentAccount = "workers-http-concurrent";
    const actorId = actor(45);
    const hash = new Uint8Array(32).fill(4);
    const first = createSyncHandler({ authenticate: async () => concurrentAccount });
    const second = createSyncHandler({ authenticate: async () => concurrentAccount });
    const firstHello = httpHello(actorId, hash);
    const secondHello = httpHello(actorId, hash);
    const firstSnapshot = await first(
      request(encodeFrame(MessageType.HELLO, firstHello)),
      env as unknown as CloudflareEnv
    );
    const secondSnapshot = await second(
      request(encodeFrame(MessageType.HELLO, secondHello)),
      env as unknown as CloudflareEnv
    );
    await firstSnapshot.arrayBuffer();
    const secondFrames = frames(new Uint8Array(await secondSnapshot.arrayBuffer()));
    const mutation = liveMutation(
      encodeMutationRecord({
        kind: "add",
        slug: "01-matrix",
        actorId,
        counter: BigInt(0),
      })
    );
    await first(request(mutation), env as unknown as CloudflareEnv);
    const confirmed = await second(
      request(
        encodeFrame(MessageType.SNAPSHOT_CONFIRM, secondFrames.at(-1)?.payload ?? new Uint8Array())
      ),
      env as unknown as CloudflareEnv
    );
    expect((await confirmed.arrayBuffer()).byteLength).toBeGreaterThan(20);
  });

  it("restarts an older snapshot when concurrent first-install actors change the account", async () => {
    const freshAccount = "workers-http-concurrent-install";
    const firstActor = actor(46);
    const secondActor = actor(47);
    const first = createSyncHandler({ authenticate: async () => freshAccount });
    const second = createSyncHandler({ authenticate: async () => freshAccount });
    const firstSnapshot = await first(
      request(
        encodeFrame(
          MessageType.HELLO,
          encodeHello({
            actorId: firstActor,
            revocationHandleHash: new Uint8Array(32).fill(5),
            lastServerRevision: BigInt(0),
            causalSummary: [],
            bootstrapId: actor(248),
            pendingBatchCount: 0,
          })
        )
      ),
      env as unknown as CloudflareEnv
    );
    const secondSnapshot = await second(
      request(
        encodeFrame(
          MessageType.HELLO,
          encodeHello({
            actorId: secondActor,
            revocationHandleHash: new Uint8Array(32).fill(6),
            lastServerRevision: BigInt(0),
            causalSummary: [],
            bootstrapId: actor(249),
            pendingBatchCount: 0,
          })
        )
      ),
      env as unknown as CloudflareEnv
    );
    const firstFrames = frames(new Uint8Array(await firstSnapshot.arrayBuffer()));
    const secondFrames = frames(new Uint8Array(await secondSnapshot.arrayBuffer()));
    expect(firstFrames.at(-1)?.type).toBe(MessageType.REJECTION);
    expect(secondFrames.at(-1)?.type).toBe(MessageType.SNAPSHOT_CONFIRM);
  });

  it("authenticates the WebSocket upgrade and rejects a mismatched DO route", async () => {
    const account = "workers-ws-auth";
    const unauthenticated = createWebSocketSyncHandler({ authenticate: async () => null });
    const rejected = await unauthenticated(
      new Request(`${origin}/api/sync`, {
        method: "GET",
        headers: { Origin: origin, Upgrade: "websocket" },
      }),
      env as unknown as CloudflareEnv
    );
    expect(rejected.status).toBe(401);

    const route = await accountRouteName("workers-test-secret", "workers-ws-other");
    const mismatch = await env.ACCOUNT_DATA.getByName(route).fetch(
      new Request(`${origin}/api/sync`, {
        method: "GET",
        headers: {
          Upgrade: "websocket",
          "x-cjet-account-id": account,
          "x-cjet-route": route,
          "x-cjet-session-expiry": String(Math.floor(Date.now() / 1000) + 300),
        },
      })
    );
    expect(mismatch.status).toBe(403);
  });

  it("bootstraps two live subscribers and broadcasts only persisted revisions", async () => {
    const account = `workers-ws-live-${crypto.randomUUID()}`;
    const route = await accountRouteName("workers-test-secret", account);
    const stub = env.ACCOUNT_DATA.getByName(route);
    await stub.registerActor(account, actor(51), new Uint8Array(32).fill(51));
    await stub.registerActor(account, actor(52), new Uint8Array(32).fill(52));
    const handler = authenticatedWebSocketHandler(account);
    const first = await openSocket(handler);
    const second = await openSocket(handler);
    const firstNonce = await startBootstrap(first, actor(51), new Uint8Array(32).fill(51));
    const secondNonce = await startBootstrap(second, actor(52), new Uint8Array(32).fill(52));
    await finishBootstrap(first, firstNonce);
    await finishBootstrap(second, secondNonce);

    const firstMessages = [nextSocketMessage(first), nextSocketMessage(first)];
    const secondMessage = nextSocketMessage(second);
    first.send(
      encodeMutationBatchEnvelope({
        requestId: crypto.getRandomValues(new Uint8Array(16)),
        bootstrapId: new Uint8Array(16),
        batchIndex: 0,
        batchCount: 1,
        changes: [
          encodeMutationRecord({
            kind: "add",
            slug: "01-matrix",
            actorId: actor(51),
            counter: BigInt(0),
          }),
        ],
      })
    );
    const [firstA, firstB, secondDelta] = await Promise.all([
      firstMessages[0],
      firstMessages[1],
      secondMessage,
    ]);
    expect([decodeFrame(firstA).type, decodeFrame(firstB).type].sort()).toEqual(
      [MessageType.ACKNOWLEDGEMENT, MessageType.DELTA_BATCH].sort()
    );
    expect(decodeFrame(secondDelta).type).toBe(MessageType.DELTA_BATCH);
    expect(decodeBatchFrame(secondDelta).changes).toHaveLength(1);
    const persisted = await env.DB.prepare(
      "SELECT server_revision FROM sync_accounts WHERE account_id = ?"
    )
      .bind(account)
      .first<{ server_revision: string }>();
    expect(persisted?.server_revision).toBe("1");
    first.close();
    second.close();
  });

  it("buffers a bootstrap mutation and returns it after generation confirmation", async () => {
    const account = "workers-ws-buffer";
    const route = await accountRouteName("workers-test-secret", account);
    const stub = env.ACCOUNT_DATA.getByName(route);
    await stub.registerActor(account, actor(53), new Uint8Array(32).fill(53));
    const socket = await openSocket(authenticatedWebSocketHandler(account));
    const nonce = await startBootstrap(socket, actor(53), new Uint8Array(32).fill(53));
    const acknowledgement = nextSocketMessage(socket);
    socket.send(
      encodeMutationBatchEnvelope({
        requestId: crypto.getRandomValues(new Uint8Array(16)),
        bootstrapId: new Uint8Array(16),
        batchIndex: 0,
        batchCount: 1,
        changes: [
          encodeMutationRecord({
            kind: "add",
            slug: "01-matrix",
            actorId: actor(53),
            counter: BigInt(0),
          }),
        ],
      })
    );
    expect(decodeDetailedAcknowledgement(await acknowledgement).outcomes).toHaveLength(1);
    await finishBootstrap(socket, nonce, 1);
    expect(decodeFrame(await nextSocketMessage(socket)).type).toBe(MessageType.DELTA_BATCH);
    socket.close();
  });

  it("accepts and deduplicates an out-of-order aggregate Progress delta", async () => {
    const account = `workers-ws-delta-${crypto.randomUUID()}`;
    const route = await accountRouteName("workers-test-secret", account);
    const stub = env.ACCOUNT_DATA.getByName(route);
    const actorId = actor(54);
    await stub.registerActor(account, actorId, new Uint8Array(32).fill(54));
    const socket = await openSocket(authenticatedWebSocketHandler(account));
    const nonce = await startBootstrap(socket, actorId, new Uint8Array(32).fill(54));
    await finishBootstrap(socket, nonce);
    const record = encodeMutationRecord({
      kind: "progress-delta",
      causalSummary: [{ actorId, counter: BigInt(5) }],
      adds: [{ slug: "01-matrix", actorId, counter: BigInt(0) }],
      removed: [],
    });
    socket.send(
      encodeMutationBatchEnvelope({
        requestId: crypto.getRandomValues(new Uint8Array(16)),
        bootstrapId: new Uint8Array(16),
        batchIndex: 0,
        batchCount: 1,
        changes: [record],
      })
    );
    const firstReplies = await Promise.all([nextSocketMessage(socket), nextSocketMessage(socket)]);
    const firstAck = firstReplies.find(
      (bytes) => decodeFrame(bytes).type === MessageType.ACKNOWLEDGEMENT
    );
    expect(firstAck).toBeDefined();
    expect(decodeDetailedAcknowledgement(firstAck as Uint8Array).outcomes).toHaveLength(1);
    socket.send(
      encodeMutationBatchEnvelope({
        requestId: crypto.getRandomValues(new Uint8Array(16)),
        bootstrapId: new Uint8Array(16),
        batchIndex: 0,
        batchCount: 1,
        changes: [record],
      })
    );
    expect(decodeDetailedAcknowledgement(await nextSocketMessage(socket)).outcomes).toHaveLength(1);
    socket.close();
  });

  it("closes malformed frames and expired sessions without a UI payload", async () => {
    const account = "workers-ws-close";
    const socket = await openSocket(authenticatedWebSocketHandler(account));
    const closed = nextSocketClose(socket);
    try {
      socket.send(new Uint8Array(MAX_FRAME_BYTES + 1));
    } catch {
      socket.close();
    }
    expect((await closed).code).toBe(4002);

    const expiryAccount = "workers-ws-expiry";
    const expirySocket = await openSocket(
      authenticatedWebSocketHandler(expiryAccount, Math.floor(Date.now() / 1000) + 1)
    );
    const expiryClosed = nextSocketClose(expirySocket);
    await new Promise((resolve) => setTimeout(resolve, 1_200));
    expect((await expiryClosed).code).toBe(4001);
  });
});
