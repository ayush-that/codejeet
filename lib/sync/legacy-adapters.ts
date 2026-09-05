import type { AccountData } from "./account-do";
import { accountRouteName } from "./account-route";
import { problemNoteText, progressSolvedSlugs } from "./domain";

type LegacyEnvironment = {
  DB: D1Database;
  ACCOUNT_DATA: DurableObjectNamespace<AccountData>;
  SYNC_HMAC_SECRET: string;
};

type ProgressMirrorRow = { slug: string; solved_at: string };
type NoteMirrorRow = { slug: string; updated_at: string };

async function account(
  env: LegacyEnvironment,
  accountId: string
): Promise<TypedDurableObjectStub<AccountData>> {
  return env.ACCOUNT_DATA.getByName(await accountRouteName(env.SYNC_HMAC_SECRET, accountId));
}

async function progressMirror(
  env: LegacyEnvironment,
  accountId: string
): Promise<Map<string, string>> {
  const rows = await env.DB.prepare("SELECT slug, solved_at FROM progress WHERE user_id = ?")
    .bind(accountId)
    .all<ProgressMirrorRow>();
  return new Map(rows.results.map((row) => [row.slug, row.solved_at]));
}

async function noteMirror(env: LegacyEnvironment, accountId: string): Promise<Map<string, string>> {
  const rows = await env.DB.prepare("SELECT slug, updated_at FROM notes WHERE user_id = ?")
    .bind(accountId)
    .all<NoteMirrorRow>();
  return new Map(rows.results.map((row) => [row.slug, row.updated_at]));
}

export async function getLegacyProgress(
  env: LegacyEnvironment,
  accountId: string
): Promise<{ progress: Record<string, string> }> {
  const canonical = await (await account(env, accountId)).getCanonical(accountId);
  const timestamps = await progressMirror(env, accountId);
  const progress: Record<string, string> = {};
  for (const slug of progressSolvedSlugs(canonical.progress)) {
    progress[slug] = timestamps.get(slug) ?? new Date(0).toISOString();
  }
  return { progress };
}

export async function applyLegacyProgress(
  env: LegacyEnvironment,
  accountId: string,
  slug: string,
  completed: boolean
): Promise<void> {
  await (await account(env, accountId)).applyLegacyProgress(accountId, slug, completed);
}

export async function getLegacyNotes(
  env: LegacyEnvironment,
  accountId: string
): Promise<{ notes: Record<string, string>; updatedAt: Record<string, string> }> {
  const canonical = await (await account(env, accountId)).getCanonical(accountId);
  const timestamps = await noteMirror(env, accountId);
  const notes: Record<string, string> = {};
  const updatedAt: Record<string, string> = {};
  for (const [slug, record] of canonical.notes.notes) {
    const text = problemNoteText(record);
    if (!text) continue;
    notes[slug] = text;
    const timestamp = timestamps.get(slug);
    if (timestamp) updatedAt[slug] = timestamp;
  }
  return { notes, updatedAt };
}

export async function applyLegacyNote(
  env: LegacyEnvironment,
  accountId: string,
  slug: string,
  text: string
): Promise<void> {
  await (await account(env, accountId)).applyLegacyNote(accountId, slug, text);
}
