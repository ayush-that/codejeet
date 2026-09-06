import { auth } from "@clerk/nextjs/server";
import { getDatabasePool } from "@/lib/database";
import { handleNotesGet, handleNotesPost } from "@/lib/notes-api";
import { listNotes, setNote } from "@/lib/user-data-repository";

// Reads Clerk identity + the D1 binding at request time — must be dynamic.
export const dynamic = "force-dynamic";

function dependencies() {
  const pool = getDatabasePool();
  return {
    getUserId: async () => (await auth()).userId,
    listNotes: (userId: string) => listNotes(pool, userId),
    setNote: (userId: string, slug: string, note: string, now: string) =>
      setNote(pool, userId, slug, note, now),
    now: () => new Date().toISOString(),
    readOnly: process.env.USER_DATA_READ_ONLY === "1",
  };
}

// GET -> { notes: { [slug]: text }, updatedAt: { [slug]: ISO } }.
// Signed-out returns empty maps (200, not a redirect) so the client can call it unconditionally.
export async function GET() {
  return handleNotesGet(dependencies());
}

// POST { slug, note }. Non-empty note -> upsert. Empty/whitespace -> delete.
// user_id always comes from the server session, never the request body.
export async function POST(req: Request) {
  return handleNotesPost(req, dependencies());
}
