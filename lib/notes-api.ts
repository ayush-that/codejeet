import { parseNotesPostBody } from "@/utils/notesUtils";

export interface NotesApiDependencies {
  getUserId(): Promise<string | null>;
  listNotes(userId: string): Promise<{
    notes: Record<string, string>;
    updatedAt: Record<string, string>;
  }>;
  setNote(userId: string, slug: string, note: string, now: string): Promise<void>;
  now(): string;
  readOnly: boolean;
}

export async function handleNotesGet(dependencies: NotesApiDependencies): Promise<Response> {
  const userId = await dependencies.getUserId();
  if (!userId) return Response.json({ notes: {}, updatedAt: {} });

  return Response.json(await dependencies.listNotes(userId));
}

export async function handleNotesPost(
  request: Request,
  dependencies: NotesApiDependencies
): Promise<Response> {
  const userId = await dependencies.getUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  if (dependencies.readOnly) {
    return new Response("User data is temporarily read-only", {
      status: 503,
      headers: { "Retry-After": "60" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = parseNotesPostBody(body);
  if (!parsed.ok) return new Response(parsed.error, { status: parsed.status });

  await dependencies.setNote(userId, parsed.slug, parsed.note, dependencies.now());
  return Response.json({ ok: true });
}
