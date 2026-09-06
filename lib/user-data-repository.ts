export interface UserDataQueryClient {
  query<Row extends Record<string, unknown>>(
    text: string,
    values?: readonly unknown[]
  ): Promise<{ rows: Row[] }>;
}

interface ProgressRow extends Record<string, unknown> {
  slug: string;
  solved_at: string;
}

interface NoteRow extends Record<string, unknown> {
  slug: string;
  note: string;
  updated_at: string;
}

export async function listProgress(
  client: UserDataQueryClient,
  userId: string
): Promise<Record<string, string>> {
  const { rows } = await client.query<ProgressRow>(
    "SELECT slug, solved_at FROM progress WHERE user_id = $1",
    [userId]
  );

  return Object.fromEntries(rows.map((row) => [row.slug, row.solved_at]));
}

export async function setProgress(
  client: UserDataQueryClient,
  userId: string,
  slug: string,
  completed: boolean,
  now: string
): Promise<void> {
  if (completed) {
    await client.query(
      `INSERT INTO progress (user_id, slug, solved_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, slug) DO NOTHING`,
      [userId, slug, now]
    );
    return;
  }

  await client.query("DELETE FROM progress WHERE user_id = $1 AND slug = $2", [userId, slug]);
}

export async function listNotes(
  client: UserDataQueryClient,
  userId: string
): Promise<{ notes: Record<string, string>; updatedAt: Record<string, string> }> {
  const { rows } = await client.query<NoteRow>(
    "SELECT slug, note, updated_at FROM notes WHERE user_id = $1",
    [userId]
  );
  const notes: Record<string, string> = {};
  const updatedAt: Record<string, string> = {};

  for (const row of rows) {
    if (!row.note.trim()) continue;
    notes[row.slug] = row.note;
    if (row.updated_at) updatedAt[row.slug] = row.updated_at;
  }

  return { notes, updatedAt };
}

export async function setNote(
  client: UserDataQueryClient,
  userId: string,
  slug: string,
  note: string,
  now: string
): Promise<void> {
  if (!note) {
    await client.query("DELETE FROM notes WHERE user_id = $1 AND slug = $2", [userId, slug]);
    return;
  }

  await client.query(
    `INSERT INTO notes (user_id, slug, note, updated_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, slug)
     DO UPDATE SET note = EXCLUDED.note, updated_at = EXCLUDED.updated_at`,
    [userId, slug, note, now]
  );
}
