import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createLoroSyncHandler } from "../lib/sync/loro-http";

const ORIGIN = "https://codejeet.com";

function environment() {
  const updates: { revision: number; update: Uint8Array }[] = [];
  const stub = {
    async appendLoroUpdate(_accountId: string, update: Uint8Array) {
      const revision = updates.length + 1;
      updates.push({ revision, update: update.slice() });
      return revision;
    },
    async loroUpdates(_accountId: string, after: number) {
      return {
        revision: updates.length,
        updates: updates
          .filter((entry) => entry.revision > after)
          .map((entry) => ({ ...entry, update: entry.update.slice() })),
      };
    },
  };
  return {
    SYNC_HMAC_SECRET: "test-secret",
    SYNC_ORIGIN: ORIGIN,
    ACCOUNT_DATA: { getByName: () => stub },
  } as unknown as CloudflareEnv;
}

function request(path: string, init: RequestInit = {}): Request {
  return new Request(`${ORIGIN}${path}`, {
    ...init,
    headers: { Origin: ORIGIN, ...(init.headers ?? {}) },
  });
}

describe("Loro HTTP synchronization", () => {
  it("stores opaque updates for the authenticated account and returns revisions after a cursor", async () => {
    const handler = createLoroSyncHandler({ authenticate: async () => "account-a" });
    const env = environment();
    const first = await handler(
      request("/api/loro-sync", {
        method: "POST",
        body: Uint8Array.of(1, 2, 3),
        headers: { "Content-Type": "application/octet-stream" },
      }),
      env
    );
    assert.equal(first.status, 201);
    assert.deepEqual(await first.json(), { revision: 1 });

    const second = await handler(
      request("/api/loro-sync", {
        method: "POST",
        body: Uint8Array.of(4, 5),
        headers: { "Content-Type": "application/octet-stream" },
      }),
      env
    );
    assert.deepEqual(await second.json(), { revision: 2 });

    const read = await handler(
      request("/api/loro-sync?after=1", { method: "POST", headers: { "X-Loro-Pull": "1" } }),
      env
    );
    assert.equal(read.status, 200);
    assert.deepEqual(await read.json(), {
      revision: 2,
      updates: [{ revision: 2, update: "BAU=" }],
    });
  });

  it("rejects cross-origin, unauthenticated, malformed, and oversized writes", async () => {
    const env = environment();
    const handler = createLoroSyncHandler({ authenticate: async () => null });
    const unauthenticated = await handler(request("/api/loro-sync"), env);
    assert.equal(unauthenticated.status, 401);

    const authenticated = createLoroSyncHandler({ authenticate: async () => "account-a" });
    const foreign = await authenticated(
      new Request(`${ORIGIN}/api/loro-sync`, { headers: { Origin: "https://evil.example" } }),
      env
    );
    assert.equal(foreign.status, 403);
    const malformed = await authenticated(
      request("/api/loro-sync", { method: "POST", body: Uint8Array.of(1) }),
      env
    );
    assert.equal(malformed.status, 415);
    const oversized = await authenticated(
      request("/api/loro-sync", {
        method: "POST",
        body: new Uint8Array(512 * 1024 + 1),
        headers: { "Content-Type": "application/octet-stream" },
      }),
      env
    );
    assert.equal(oversized.status, 413);
  });
});
