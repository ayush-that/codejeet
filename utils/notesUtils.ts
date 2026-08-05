// Personal notes per problem, keyed by question slug (same identity as progress).
// Signed-out users store notes in localStorage; signed-in users also sync via /api/notes.

export const NOTES_LOCAL_KEY = "leetcode-problem-notes";
export const MAX_NOTE_LENGTH = 2000;
export const MAX_SLUG_LENGTH = 256;

// slug -> note text
export type NotesMap = Record<string, string>;

export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === "string" && slug.length > 0 && slug.length <= MAX_SLUG_LENGTH;
}

// Hard ceiling for raw POST body length before normalize (allows small overshoot).
export const MAX_NOTE_BODY_RAW = MAX_NOTE_LENGTH + 100;

export type NotesPostBody =
  | { ok: true; slug: string; note: string }
  | { ok: false; status: number; error: string };

export function parseNotesPostBody(body: unknown): NotesPostBody {
  if (typeof body !== "object" || body === null) {
    return { ok: false, status: 400, error: "Invalid JSON" };
  }
  const { slug, note } = body as { slug?: unknown; note?: unknown };
  if (!isValidSlug(slug)) {
    return { ok: false, status: 400, error: "Invalid slug" };
  }
  if (typeof note !== "string") {
    return { ok: false, status: 400, error: "Invalid note" };
  }
  if (note.length > MAX_NOTE_BODY_RAW) {
    return { ok: false, status: 400, error: "Note too long" };
  }
  return { ok: true, slug, note: normalizeNote(note) };
}

export function normalizeNote(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.length > MAX_NOTE_LENGTH ? trimmed.slice(0, MAX_NOTE_LENGTH) : trimmed;
}

export function getNoteFromMap(map: NotesMap, slug: string): string {
  if (!isValidSlug(slug)) return "";
  const value = map[slug];
  return typeof value === "string" ? value : "";
}

export function setNoteInMap(map: NotesMap, slug: string, text: string): NotesMap {
  if (!isValidSlug(slug)) return map;
  const next = { ...map };
  const normalized = normalizeNote(text);
  if (!normalized) {
    delete next[slug];
  } else {
    next[slug] = normalized;
  }
  return next;
}

export function clearNoteFromMap(map: NotesMap, slug: string): NotesMap {
  return setNoteInMap(map, slug, "");
}

export function mergeNotesMaps(local: NotesMap, remote: NotesMap): NotesMap {
  return { ...local, ...remote };
}

// Local keys missing from remote — safe to upload on sign-in without clobbering cloud.
export function localOnlyNotes(local: NotesMap, remote: NotesMap): NotesMap {
  const out: NotesMap = {};
  for (const [slug, note] of Object.entries(local)) {
    if (!Object.hasOwn(remote, slug)) out[slug] = note;
  }
  return out;
}

// Remote overwrites local, except protected slugs (edits/clears made while fetch was in flight).
// Absent protected key means clear wins and the remote value is dropped.
export function mergeNotesMapsRespectingLocal(
  local: NotesMap,
  remote: NotesMap,
  protectedSlugs: Iterable<string>
): NotesMap {
  const merged = mergeNotesMaps(local, remote);
  for (const slug of protectedSlugs) {
    if (!isValidSlug(slug)) continue;
    if (Object.hasOwn(local, slug)) {
      merged[slug] = local[slug];
    } else {
      delete merged[slug];
    }
  }
  return merged;
}

export function getLocalNotes(): NotesMap {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(NOTES_LOCAL_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      localStorage.removeItem(NOTES_LOCAL_KEY);
      return {};
    }
    const map: NotesMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim()) {
        map[key] = normalizeNote(value);
      }
    }
    return map;
  } catch {
    localStorage.removeItem(NOTES_LOCAL_KEY);
    return {};
  }
}

export function saveLocalNotes(notes: NotesMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTES_LOCAL_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("saveLocalNotes failed:", error);
  }
}

export function getLocalNote(slug: string): string {
  return getNoteFromMap(getLocalNotes(), slug);
}

export function setLocalNote(slug: string, text: string): NotesMap {
  const next = setNoteInMap(getLocalNotes(), slug, text);
  saveLocalNotes(next);
  return next;
}

export function clearLocalNote(slug: string): NotesMap {
  return setLocalNote(slug, "");
}

export type FetchNotesResult = { ok: true; notes: NotesMap } | { ok: false };

export async function fetchUserNotes(): Promise<FetchNotesResult> {
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data.notes;
    if (typeof raw !== "object" || raw === null) return { ok: true, notes: {} };
    const map: NotesMap = {};
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string" && value.trim()) {
        map[key] = normalizeNote(value);
      }
    }
    return { ok: true, notes: map };
  } catch (error) {
    console.error("fetchUserNotes failed:", error);
    return { ok: false };
  }
}

export async function updateUserNote(slug: string, note: string | null): Promise<boolean> {
  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, note: note ?? "" }),
    });
    return res.ok;
  } catch (error) {
    console.error("updateUserNote failed:", error);
    return false;
  }
}
