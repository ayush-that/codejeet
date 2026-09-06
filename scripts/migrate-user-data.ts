import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

export type ProgressRow = { user_id: string; slug: string; solved_at: string };
export type NoteRow = { user_id: string; slug: string; note: string; updated_at: string };
export type UserDataExport = { progress: ProgressRow[]; notes: NoteRow[] };
export interface MigrationClient {
  query(text: string, values?: readonly unknown[]): Promise<{ rows: unknown[] }>;
}

function wranglerRows(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("Wrangler export must be an array");
  return value.flatMap((result) => {
    if (
      !result ||
      typeof result !== "object" ||
      !Array.isArray((result as { results?: unknown }).results)
    )
      throw new Error("Wrangler export is missing a results array");
    return (result as { results: unknown[] }).results;
  });
}

function requiredString(row: unknown, field: string): string {
  if (!row || typeof row !== "object") throw new Error("Export row must be an object");
  const value = (row as Record<string, unknown>)[field];
  if (typeof value !== "string" || value.length === 0) throw new Error(`Invalid ${field}`);
  return value;
}

function validTimestamp(value: string, field: string): string {
  if (Number.isNaN(Date.parse(value))) throw new Error(`Invalid ${field}`);
  return value;
}

export function normalizeD1Export(progressJson: unknown, notesJson: unknown): UserDataExport {
  const progress = wranglerRows(progressJson)
    .map((row) => ({
      user_id: requiredString(row, "user_id"),
      slug: requiredString(row, "slug"),
      solved_at: validTimestamp(requiredString(row, "solved_at"), "solved_at"),
    }))
    .sort((a, b) => `${a.user_id}\0${a.slug}`.localeCompare(`${b.user_id}\0${b.slug}`));
  const notes = wranglerRows(notesJson)
    .map((row) => ({
      user_id: requiredString(row, "user_id"),
      slug: requiredString(row, "slug"),
      note: requiredString(row, "note"),
      updated_at: validTimestamp(requiredString(row, "updated_at"), "updated_at"),
    }))
    .sort((a, b) => `${a.user_id}\0${a.slug}`.localeCompare(`${b.user_id}\0${b.slug}`));
  return { progress, notes };
}

export function checksumRows(rows: Array<Record<string, string>>): string {
  const canonical = rows
    .map((row) => Object.fromEntries(Object.entries(row).sort(([a], [b]) => a.localeCompare(b))))
    .map((row) => JSON.stringify(row))
    .sort()
    .join("\n");
  return createHash("sha256").update(canonical).digest("hex");
}

export async function importUserData(client: MigrationClient, data: UserDataExport): Promise<void> {
  await client.query("BEGIN");
  try {
    for (const row of data.progress)
      await client.query(
        "INSERT INTO progress (user_id, slug, solved_at) VALUES ($1, $2, $3) ON CONFLICT (user_id, slug) DO UPDATE SET solved_at = EXCLUDED.solved_at",
        [row.user_id, row.slug, row.solved_at]
      );
    for (const row of data.notes)
      await client.query(
        "INSERT INTO notes (user_id, slug, note, updated_at) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, slug) DO UPDATE SET note = EXCLUDED.note, updated_at = EXCLUDED.updated_at",
        [row.user_id, row.slug, row.note, row.updated_at]
      );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

export function verifyUserData(source: UserDataExport, target: UserDataExport) {
  const tables = (["progress", "notes"] as const).map((table) => ({
    table,
    sourceCount: source[table].length,
    targetCount: target[table].length,
    sourceChecksum: checksumRows(source[table]),
    targetChecksum: checksumRows(target[table]),
  }));
  return {
    ok: tables.every(
      (table) =>
        table.sourceCount === table.targetCount && table.sourceChecksum === table.targetChecksum
    ),
    tables,
  };
}

function migrationPath(input: string): string {
  const root = path.resolve(".migration");
  const resolved = path.resolve(input);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`))
    throw new Error("Migration files must be beneath .migration");
  return resolved;
}

async function readSource(progressPath: string, notesPath: string): Promise<UserDataExport> {
  const [progress, notes] = await Promise.all([
    readFile(migrationPath(progressPath), "utf8").then(JSON.parse),
    readFile(migrationPath(notesPath), "utf8").then(JSON.parse),
  ]);
  return normalizeD1Export(progress, notes);
}

async function readTarget(client: MigrationClient): Promise<UserDataExport> {
  const [progress, notes] = await Promise.all([
    client.query("SELECT user_id, slug, solved_at FROM progress ORDER BY user_id, slug"),
    client.query("SELECT user_id, slug, note, updated_at FROM notes ORDER BY user_id, slug"),
  ]);
  return normalizeD1Export([{ results: progress.rows }], [{ results: notes.rows }]);
}

async function main(): Promise<void> {
  const [command, progressPath = ".migration/progress.json", notesPath = ".migration/notes.json"] =
    process.argv.slice(2);
  if (command !== "import" && command !== "verify")
    throw new Error("Usage: migrate-user-data.ts <import|verify> [progress.json] [notes.json]");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const source = await readSource(progressPath, notesPath);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    if (command === "import") await importUserData(client, source);
    const result = verifyUserData(source, await readTarget(client));
    for (const table of result.tables)
      console.log(
        `${table.table}: source=${table.sourceCount} target=${table.targetCount} checksum=${table.sourceChecksum === table.targetChecksum ? "match" : "mismatch"}`
      );
    if (!result.ok) process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
