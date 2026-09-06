import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { Pool } from "pg";
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
  it(
    "verifies PostgreSQL TEXT timestamps without changing their representation",
    {
      skip: !process.env.MIGRATION_TEST_DATABASE_URL,
    },
    async () => {
      const pool = new Pool({ connectionString: process.env.MIGRATION_TEST_DATABASE_URL });
      const schema = `migration_test_${process.pid}_${Date.now()}`;
      await mkdir(".migration", { recursive: true });
      const directory = await mkdtemp(".migration/verification-test-");
      try {
        await pool.query(`CREATE SCHEMA ${schema}`);
        const url = new URL(process.env.MIGRATION_TEST_DATABASE_URL!);
        url.searchParams.set("options", `-c search_path=${schema}`);
        const client = new Pool({ connectionString: url.toString() });
        try {
          await client.query(await readFile("migrations/postgres/0000_user_data.sql", "utf8"));
        } finally {
          await client.end();
        }
        const progress = [
          {
            results: [
              {
                user_id: "migration-test",
                slug: "fixture",
                solved_at: "2026-09-01T05:30:00+05:30",
              },
            ],
          },
        ];
        const notes = [
          {
            results: [
              {
                user_id: "migration-test",
                slug: "fixture",
                note: "fixture",
                updated_at: "2026-09-01T00:00:00Z",
              },
            ],
          },
        ];
        await writeFile(`${directory}/progress.json`, JSON.stringify(progress));
        await writeFile(`${directory}/notes.json`, JSON.stringify(notes));
        for (const command of ["import", "verify"]) {
          const output = execFileSync(
            process.execPath,
            [
              "--import",
              "tsx",
              "scripts/migrate-user-data.ts",
              command,
              `${directory}/progress.json`,
              `${directory}/notes.json`,
            ],
            {
              encoding: "utf8",
              env: { ...process.env, DATABASE_URL: url.toString() },
              stdio: ["ignore", "pipe", "pipe"],
            }
          );
          assert.match(output, /progress: source=1 target=1 checksum=match/);
          assert.match(output, /notes: source=1 target=1 checksum=match/);
        }
      } finally {
        await pool.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
        await pool.end();
        await rm(directory, { recursive: true, force: true });
      }
    }
  );

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
