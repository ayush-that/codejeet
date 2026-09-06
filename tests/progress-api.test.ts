import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  handleProgressGet,
  handleProgressPost,
  type ProgressApiDependencies,
} from "../lib/progress-api";

function dependencies(overrides: Partial<ProgressApiDependencies> = {}): ProgressApiDependencies {
  return {
    getUserId: async () => "user_123",
    listProgress: async () => ({ "two-sum": "2026-06-01T10:00:00.000Z" }),
    setProgress: async () => {},
    now: () => "2026-06-02T10:00:00.000Z",
    readOnly: false,
    ...overrides,
  };
}

describe("progress API", () => {
  it("returns an empty map to signed-out readers", async () => {
    const response = await handleProgressGet(dependencies({ getUserId: async () => null }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { progress: {} });
  });

  it("returns authenticated progress", async () => {
    const response = await handleProgressGet(dependencies());
    assert.deepEqual(await response.json(), {
      progress: { "two-sum": "2026-06-01T10:00:00.000Z" },
    });
  });

  it("rejects signed-out mutations", async () => {
    const request = new Request("https://codejeet.com/api/progress", {
      method: "POST",
      body: JSON.stringify({ slug: "two-sum", completed: true }),
    });
    const response = await handleProgressPost(
      request,
      dependencies({ getUserId: async () => null })
    );
    assert.equal(response.status, 401);
  });

  it("rejects invalid JSON and invalid slugs", async () => {
    const invalidJson = await handleProgressPost(
      new Request("https://codejeet.com/api/progress", { method: "POST", body: "{" }),
      dependencies()
    );
    assert.equal(invalidJson.status, 400);
    assert.equal(await invalidJson.text(), "Invalid JSON");

    const invalidSlug = await handleProgressPost(
      new Request("https://codejeet.com/api/progress", {
        method: "POST",
        body: JSON.stringify({ slug: "", completed: true }),
      }),
      dependencies()
    );
    assert.equal(invalidSlug.status, 400);
    assert.equal(await invalidSlug.text(), "Invalid slug");
  });

  it("writes progress with the server timestamp", async () => {
    const writes: unknown[][] = [];
    const response = await handleProgressPost(
      new Request("https://codejeet.com/api/progress", {
        method: "POST",
        body: JSON.stringify({ slug: "two-sum", completed: true }),
      }),
      dependencies({
        setProgress: async (...args) => {
          writes.push(args);
        },
      })
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.deepEqual(writes, [["user_123", "two-sum", true, "2026-06-02T10:00:00.000Z"]]);
  });

  it("keeps reads available while mutations are frozen", async () => {
    const deps = dependencies({ readOnly: true });
    const getResponse = await handleProgressGet(deps);
    const postResponse = await handleProgressPost(
      new Request("https://codejeet.com/api/progress", {
        method: "POST",
        body: JSON.stringify({ slug: "two-sum", completed: true }),
      }),
      deps
    );

    assert.equal(getResponse.status, 200);
    assert.equal(postResponse.status, 503);
    assert.equal(postResponse.headers.get("retry-after"), "60");
  });
});
