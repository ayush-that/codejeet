import { auth } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { parseNotesPostBody } from "@/utils/notesUtils";
import { applyLegacyNote, getLegacyNotes } from "@/lib/sync/legacy-adapters";

// Reads Clerk identity + the D1 binding at request time — must be dynamic.
export const dynamic = "force-dynamic";

// GET -> { notes: { [slug]: text }, updatedAt: { [slug]: ISO } }.
// Signed-out returns empty maps (200, not a redirect) so the client can call it unconditionally.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ notes: {}, updatedAt: {} });

  return Response.json(await getLegacyNotes(getCloudflareContext().env, userId));
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
  await applyLegacyNote(getCloudflareContext().env, userId, slug, note);

  return Response.json({ ok: true });
}
