import { auth } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { parseNotesPostBody } from "@/utils/notesUtils";

// Reads Clerk identity + the D1 binding at request time — must be dynamic.
export const dynamic = "force-dynamic";

function db() {
  return getCloudflareContext().env.DB;
}

// GET -> { notes: { [slug]: text }, updatedAt: { [slug]: ISO } }.
// Signed-out returns empty maps (200, not a redirect) so the client can call it unconditionally.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ notes: {}, updatedAt: {} });

  const { results } = await db()
    .prepare("SELECT slug, note, updated_at FROM notes WHERE user_id = ?")
    .bind(userId)
    .all<{ slug: string; note: string; updated_at: string }>();

  const notes: Record<string, string> = {};
  const updatedAt: Record<string, string> = {};
  for (const row of results ?? []) {
    if (row.note?.trim()) {
      notes[row.slug] = row.note;
      if (row.updated_at) updatedAt[row.slug] = row.updated_at;
    }
  }
  return Response.json({ notes, updatedAt });
}

// POST { slug, note }. Non-empty note -> upsert. Empty/whitespace -> delete.
// user_id always comes from the server session, never the request body.
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = parseNotesPostBody(body);
  if (!parsed.ok) {
    return new Response(parsed.error, { status: parsed.status });
  }

  const { slug, note } = parsed;
  const d = db();

  if (!note) {
    await d.prepare("DELETE FROM notes WHERE user_id = ? AND slug = ?").bind(userId, slug).run();
  } else {
    await d
      .prepare(
        `INSERT INTO notes (user_id, slug, note, updated_at) VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, slug) DO UPDATE SET note = excluded.note, updated_at = excluded.updated_at`
      )
      .bind(userId, slug, note, new Date().toISOString())
      .run();
  }

  return Response.json({ ok: true });
}
