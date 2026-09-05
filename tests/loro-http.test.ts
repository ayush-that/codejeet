import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createLoroSyncHandler } from "../lib/sync/loro-http";

const ORIGIN = "https://codejeet.com";
const SECRET = "test-sync-secret";

type LoroUpdateRow = { revision: number; update: Uint8Array };

function createEnvironment(updates: readonly { revision: number; update: Uint8Array }[] = []): {
  env: CloudflareEnv;
  requests: string[];
} {
  const requests: string[] = [];
  const stub = {
    updates,
    loroUpdates: async () => ({
      revision: 12,
      snapshot: { revision: 8, snapshot: Uint8Array.of(8, 9) },
      updates: updates,
    }),
    appendLoroUpdate: async (_accountId: string, update: Uint8Array) => {
      requests.push(`append:${Buffer.from(update).toString("base64")}`);
      return 13;
    },
  };
  const env = {
    SYNC_HMAC_SECRET: SECRET,
    SYNC_ORIGIN: ORIGIN,
    ACCOUNT_DATA: {
      getByName() {
        return stub;
      },
    },
  } as unknown as CloudflareEnv;
  return { env, requests };
}

function request(
  route: string,
  options: { method: string; body?: Uint8Array; contentType?: string } = { method: "GET" }
): Request {
  return new Request(route, {
    method: options.method,
    body: options.body?.slice().buffer as ArrayBuffer | undefined,
    headers: {
      Origin: ORIGIN,
      ...(options.contentType ? { "Content-Type": options.contentType } : {}),
    },
  });
}

describe("/api/loro-sync HTTP transport", () => {
  it("requires correct origin and authenticated session", async () => {
    const handler = createLoroSyncHandler({ authenticate: async () => "user-1" });
    const { env } = createEnvironment();
    const wrongOrigin = await handler(request(`${ORIGIN}/api/loro-sync`, { method: "GET" }), {
      ...env,
      SYNC_ORIGIN: "https://evil.example",
    });
    assert.equal(wrongOrigin.status, 403);
    const unauthorized = await createLoroSyncHandler({ authenticate: async () => null })(
      request(`${ORIGIN}/api/loro-sync`, { method: "GET" }),
      env
    );
    assert.equal(unauthorized.status, 401);
  });

  it("lists updates from the durable-object log", async () => {
    const updates: LoroUpdateRow[] = [
      { revision: 1, update: Uint8Array.of(1, 2, 3) },
      { revision: 2, update: Uint8Array.of(4, 5, 6, 7) },
    ];
    const { env } = createEnvironment(updates);
    const handler = createLoroSyncHandler({ authenticate: async () => "user-1" });
    const response = await handler(
      request(`${ORIGIN}/api/loro-sync?after=1`, { method: "GET" }),
      env
    );
    assert.equal(response.status, 200);
    const parsed = await response.json();
    const expectedUpdates = updates.map((entry) => ({
      revision: entry.revision,
      update: Buffer.from(entry.update).toString("base64"),
    }));
    assert.equal(parsed.revision, 12);
    assert.deepEqual(parsed.snapshot, {
      revision: 8,
      snapshot: Buffer.from(Uint8Array.of(8, 9)).toString("base64"),
    });
    assert.deepEqual(parsed.updates, expectedUpdates);
    assert.ok(Array.isArray(parsed.updates));
    assert.equal(parsed.updates[0].revision, 1);
  });

  it("rejects oversized or non-octet-stream updates", async () => {
    const { env } = createEnvironment();
    const handler = createLoroSyncHandler({ authenticate: async () => "user-1" });
    const oversized = new Uint8Array(1024 * 1024);
    const oversizedResponse = await handler(
      request(`${ORIGIN}/api/loro-sync`, {
        method: "POST",
        body: oversized,
        contentType: "application/octet-stream",
      }),
      env
    );
    assert.equal(oversizedResponse.status, 413);

    const nonOctet = await handler(
      request(`${ORIGIN}/api/loro-sync`, {
        method: "POST",
        body: Uint8Array.of(1, 2, 3),
        contentType: "text/plain",
      }),
      env
    );
    assert.equal(nonOctet.status, 415);
  });
});
