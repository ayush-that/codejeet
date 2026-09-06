import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleNotesGet, handleNotesPost, type NotesApiDependencies } from "../lib/notes-api";

function dependencies(overrides: Partial<NotesApiDependencies> = {}): NotesApiDependencies {
  return {
    getUserId: async () => "user_123",
    listNotes: async () => ({
      notes: { "two-sum": "Use a map" },
      updatedAt: { "two-sum": "2026-06-03T10:00:00.000Z" },
    }),
    setNote: async () => {},
    now: () => "2026-06-04T10:00:00.000Z",
    readOnly: false,
    ...overrides,
  };
}

describe("notes API", () => {
  it("returns empty maps to signed-out readers", async () => {
    const response = await handleNotesGet(dependencies({ getUserId: async () => null }));
    assert.deepEqual(await response.json(), { notes: {}, updatedAt: {} });
  });

  it("returns authenticated notes", async () => {
    const response = await handleNotesGet(dependencies());
    assert.deepEqual(await response.json(), {
      notes: { "two-sum": "Use a map" },
      updatedAt: { "two-sum": "2026-06-03T10:00:00.000Z" },
    });
  });

  it("rejects signed-out mutations", async () => {
    const response = await handleNotesPost(
      new Request("https://codejeet.com/api/notes", {
        method: "POST",
        body: JSON.stringify({ slug: "two-sum", note: "Use a map" }),
      }),
      dependencies({ getUserId: async () => null })
    );
    assert.equal(response.status, 401);
  });

  it("rejects invalid JSON and invalid note payloads", async () => {
    const invalidJson = await handleNotesPost(
      new Request("https://codejeet.com/api/notes", { method: "POST", body: "{" }),
      dependencies()
    );
    assert.equal(invalidJson.status, 400);
    assert.equal(await invalidJson.text(), "Invalid JSON");

    const invalidBody = await handleNotesPost(
      new Request("https://codejeet.com/api/notes", {
        method: "POST",
        body: JSON.stringify({ slug: "", note: "Use a map" }),
      }),
      dependencies()
    );
    assert.equal(invalidBody.status, 400);
    assert.equal(await invalidBody.text(), "Invalid slug");
  });

  it("writes normalized notes with the server timestamp", async () => {
    const writes: unknown[][] = [];
    const response = await handleNotesPost(
      new Request("https://codejeet.com/api/notes", {
        method: "POST",
        body: JSON.stringify({ slug: "two-sum", note: "  Use a map  " }),
      }),
      dependencies({
        setNote: async (...args) => {
          writes.push(args);
        },
      })
    );

    assert.deepEqual(await response.json(), { ok: true });
    assert.deepEqual(writes, [["user_123", "two-sum", "Use a map", "2026-06-04T10:00:00.000Z"]]);
  });

  it("keeps reads available while mutations are frozen", async () => {
    const deps = dependencies({ readOnly: true });
    const getResponse = await handleNotesGet(deps);
    const postResponse = await handleNotesPost(
      new Request("https://codejeet.com/api/notes", {
        method: "POST",
        body: JSON.stringify({ slug: "two-sum", note: "Use a map" }),
      }),
      deps
    );

    assert.equal(getResponse.status, 200);
    assert.equal(postResponse.status, 503);
    assert.equal(postResponse.headers.get("retry-after"), "60");
  });
});
