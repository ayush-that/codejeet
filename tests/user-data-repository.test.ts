import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  listNotes,
  listProgress,
  setNote,
  setProgress,
  type UserDataQueryClient,
} from "../lib/user-data-repository";

interface RecordedQuery {
  text: string;
  values: readonly unknown[];
}

class RecordingClient implements UserDataQueryClient {
  readonly queries: RecordedQuery[] = [];

  constructor(private readonly rows: Record<string, unknown>[] = []) {}

  async query<Row extends Record<string, unknown>>(text: string, values: readonly unknown[] = []) {
    this.queries.push({ text, values });
    return { rows: this.rows as Row[] };
  }
}

describe("user data repository", () => {
  it("returns progress keyed by slug", async () => {
    const client = new RecordingClient([
      { slug: "two-sum", solved_at: "2026-06-01T10:00:00.000Z" },
      { slug: "three-sum", solved_at: "2026-06-02T10:00:00.000Z" },
    ]);

    assert.deepEqual(await listProgress(client, "user_123"), {
      "two-sum": "2026-06-01T10:00:00.000Z",
      "three-sum": "2026-06-02T10:00:00.000Z",
    });
    assert.deepEqual(client.queries[0]?.values, ["user_123"]);
  });

  it("preserves the first solve timestamp", async () => {
    const client = new RecordingClient();

    await setProgress(client, "user_123", "two-sum", true, "2026-06-01T10:00:00.000Z");

    assert.match(client.queries[0]?.text ?? "", /ON CONFLICT\s*\(user_id, slug\)\s*DO NOTHING/i);
    assert.deepEqual(client.queries[0]?.values, [
      "user_123",
      "two-sum",
      "2026-06-01T10:00:00.000Z",
    ]);
  });

  it("deletes progress only for the authenticated user and slug", async () => {
    const client = new RecordingClient();

    await setProgress(client, "user_123", "two-sum", false, "unused");

    assert.match(client.queries[0]?.text ?? "", /^DELETE FROM progress/i);
    assert.deepEqual(client.queries[0]?.values, ["user_123", "two-sum"]);
  });

  it("returns note text and update timestamps keyed by slug", async () => {
    const client = new RecordingClient([
      {
        slug: "two-sum",
        note: "Use a map",
        updated_at: "2026-06-03T10:00:00.000Z",
      },
    ]);

    assert.deepEqual(await listNotes(client, "user_123"), {
      notes: { "two-sum": "Use a map" },
      updatedAt: { "two-sum": "2026-06-03T10:00:00.000Z" },
    });
    assert.deepEqual(client.queries[0]?.values, ["user_123"]);
  });

  it("upserts a note and its timestamp", async () => {
    const client = new RecordingClient();

    await setNote(client, "user_123", "two-sum", "Use a map", "2026-06-03T10:00:00.000Z");

    assert.match(client.queries[0]?.text ?? "", /ON CONFLICT\s*\(user_id, slug\)\s*DO UPDATE/i);
    assert.deepEqual(client.queries[0]?.values, [
      "user_123",
      "two-sum",
      "Use a map",
      "2026-06-03T10:00:00.000Z",
    ]);
  });

  it("deletes an empty note only for the authenticated user and slug", async () => {
    const client = new RecordingClient();

    await setNote(client, "user_123", "two-sum", "", "unused");

    assert.match(client.queries[0]?.text ?? "", /^DELETE FROM notes/i);
    assert.deepEqual(client.queries[0]?.values, ["user_123", "two-sum"]);
  });
});
