import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checksumRows,
  importUserData,
  normalizeD1Export,
  verifyUserData,
  type MigrationClient,
} from "../scripts/migrate-user-data";

const progressExport = [
  {
    results: [
      { user_id: "user_2", slug: "l'été", solved_at: "2026-09-01T00:00:00.000Z" },
      { user_id: "user_1", slug: "two-sum", solved_at: "2026-08-01T00:00:00.000Z" },
    ],
  },
];
const notesExport = [
  {
    results: [
      {
        user_id: "user_1",
        slug: "two-sum",
        note: "O(n) ✅",
        updated_at: "2026-08-02T00:00:00.000Z",
      },
    ],
  },
];

class FakeClient implements MigrationClient {
  statements: Array<{ text: string; values?: readonly unknown[] }> = [];
  failOnInsert = false;

  async query(text: string, values?: readonly unknown[]) {
    this.statements.push({ text, values });
    if (this.failOnInsert && /^INSERT/.test(text)) throw new Error("insert failed");
    return { rows: [] };
  }
}

describe("D1 user data migration", () => {
  it("normalizes Wrangler JSON without losing Unicode or apostrophes", () => {
    const data = normalizeD1Export(progressExport, notesExport);
    assert.equal(data.progress[1]?.slug, "l'été");
    assert.equal(data.notes[0]?.note, "O(n) ✅");
  });

  it("produces the same checksum regardless of row order", () => {
    const rows = normalizeD1Export(progressExport, notesExport).progress;
    assert.equal(checksumRows(rows), checksumRows([...rows].reverse()));
  });

  it("imports inside one transaction with conflict-safe writes", async () => {
    const client = new FakeClient();
    const data = normalizeD1Export(progressExport, notesExport);
    await importUserData(client, data);
    assert.equal(client.statements[0]?.text, "BEGIN");
    assert.match(client.statements[1]?.text ?? "", /ON CONFLICT \(user_id, slug\) DO UPDATE/);
    assert.match(client.statements.at(-2)?.text ?? "", /ON CONFLICT \(user_id, slug\) DO UPDATE/);
    assert.equal(client.statements.at(-1)?.text, "COMMIT");
  });

  it("rolls back the whole import on failure", async () => {
    const client = new FakeClient();
    client.failOnInsert = true;
    await assert.rejects(importUserData(client, normalizeD1Export(progressExport, notesExport)));
    assert.equal(client.statements.at(-1)?.text, "ROLLBACK");
  });

  it("detects count and checksum mismatches", () => {
    const source = normalizeD1Export(progressExport, notesExport);
    assert.equal(verifyUserData(source, source).ok, true);
    assert.equal(
      verifyUserData(source, { progress: source.progress.slice(1), notes: [] }).ok,
      false
    );
  });

  it("accepts empty Wrangler result sets", () => {
    assert.deepEqual(normalizeD1Export([{ results: [] }], [{ results: [] }]), {
      progress: [],
      notes: [],
    });
  });
});
