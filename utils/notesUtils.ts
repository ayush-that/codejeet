// Personal notes per problem, keyed by question slug (same identity as progress).
// Signed-out users store notes in localStorage; signed-in users also sync via /api/notes.

export const NOTES_LOCAL_KEY = "leetcode-problem-notes";
export const NOTES_META_KEY = "leetcode-problem-notes-meta";
// slug -> ISO deletedAt for signed-out clears that must still win over cloud
export const NOTES_TOMBSTONES_KEY = "leetcode-problem-notes-deleted";
export const MAX_NOTE_LENGTH = 2000;
export const MAX_SLUG_LENGTH = 256;

// slug -> note text
export type NotesMap = Record<string, string>;
// slug -> ISO updatedAt (LWW)
export type NotesMeta = Record<string, string>;

export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === "string" && slug.length > 0 && slug.length <= MAX_SLUG_LENGTH;
}

export function parseNoteTimestamp(value: unknown): number {
  if (typeof value !== "string" || !value) return 0;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
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

export type NotesReconciliation = {
  merged: NotesMap;
  mergedMeta: NotesMeta;
  mergedTombstones: NotesMeta;
  // empty string = delete
  toUpload: NotesMap;
};

// LWW by updatedAt. Protected slugs always keep local (including clear).
// Tombstones keep signed-out deletes until cloud is cleared or a newer remote wins.
// Equal/unknown timestamps prefer remote so multi-device cloud stays stable.
export function reconcileNotes(
  local: NotesMap,
  localMeta: NotesMeta,
  localTombstones: NotesMeta,
  remote: NotesMap,
  remoteMeta: NotesMeta,
  protectedSlugs: Iterable<string>
): NotesReconciliation {
  const protectedSet = new Set<string>();
  for (const slug of protectedSlugs) {
    if (isValidSlug(slug)) protectedSet.add(slug);
  }

  const merged: NotesMap = {};
  const mergedMeta: NotesMeta = {};
  const mergedTombstones: NotesMeta = {};
  const toUpload: NotesMap = {};
  const slugs = new Set([
    ...Object.keys(local),
    ...Object.keys(remote),
    ...Object.keys(localTombstones),
    ...protectedSet,
  ]);

  for (const slug of slugs) {
    if (!isValidSlug(slug)) continue;
    const hasLocal = Object.hasOwn(local, slug);
    const hasRemote = Object.hasOwn(remote, slug);
    const localNote = hasLocal ? local[slug] : "";
    const remoteNote = hasRemote ? remote[slug] : "";
    const localTs = parseNoteTimestamp(localMeta[slug]);
    const remoteTs = parseNoteTimestamp(remoteMeta[slug]);
    const tombTs = parseNoteTimestamp(localTombstones[slug]);
    const hasTomb = tombTs > 0;

    if (protectedSet.has(slug)) {
      if (hasLocal) {
        merged[slug] = localNote;
        mergedMeta[slug] = localMeta[slug] || new Date().toISOString();
      } else if (hasTomb) {
        mergedTombstones[slug] = localTombstones[slug];
      }
      toUpload[slug] = hasLocal ? localNote : "";
      continue;
    }

    // Signed-out clear that must still beat older cloud content.
    if (hasTomb && !hasLocal) {
      if (!hasRemote) {
        // Cloud already gone; drop the tombstone.
        continue;
      }
      if (tombTs > remoteTs) {
        toUpload[slug] = "";
        mergedTombstones[slug] = localTombstones[slug];
        continue;
      }
      merged[slug] = remoteNote;
      if (remoteMeta[slug]) mergedMeta[slug] = remoteMeta[slug];
      continue;
    }

    if (hasLocal && !hasRemote) {
      merged[slug] = localNote;
      mergedMeta[slug] = localMeta[slug] || new Date().toISOString();
      toUpload[slug] = localNote;
      continue;
    }

    if (!hasLocal && hasRemote) {
      merged[slug] = remoteNote;
      if (remoteMeta[slug]) mergedMeta[slug] = remoteMeta[slug];
      continue;
    }

    // Pre-meta local edits have ts 0; if content differs, treat as newer so upgrade
    // does not silently drop signed-out work that predates NOTES_META_KEY.
    let effectiveLocalTs = localTs;
    if (localTs === 0 && localNote !== remoteNote) {
      effectiveLocalTs = remoteTs + 1;
    }
    if (effectiveLocalTs > remoteTs) {
      merged[slug] = localNote;
      mergedMeta[slug] = localMeta[slug] || new Date().toISOString();
      if (localNote !== remoteNote) toUpload[slug] = localNote;
    } else {
      merged[slug] = remoteNote;
      if (remoteMeta[slug]) mergedMeta[slug] = remoteMeta[slug];
    }
  }

  return { merged, mergedMeta, mergedTombstones, toUpload };
}

function readStringMap(key: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      localStorage.removeItem(key);
      return {};
    }
    const map: Record<string, string> = {};
    for (const [k, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim()) {
        map[k] = value;
      }
    }
    return map;
  } catch {
    localStorage.removeItem(key);
    return {};
  }
}

export function getLocalNotes(): NotesMap {
  const raw = readStringMap(NOTES_LOCAL_KEY);
  const map: NotesMap = {};
  for (const [key, value] of Object.entries(raw)) {
    const note = normalizeNote(value);
    if (note) map[key] = note;
  }
  return map;
}

export function getLocalNotesMeta(): NotesMeta {
  const raw = readStringMap(NOTES_META_KEY);
  const map: NotesMeta = {};
  for (const [key, value] of Object.entries(raw)) {
    if (isValidSlug(key) && parseNoteTimestamp(value) > 0) {
      map[key] = value;
    }
  }
  return map;
}

export function getLocalNoteTombstones(): NotesMeta {
  const raw = readStringMap(NOTES_TOMBSTONES_KEY);
  const map: NotesMeta = {};
  for (const [key, value] of Object.entries(raw)) {
    if (isValidSlug(key) && parseNoteTimestamp(value) > 0) {
      map[key] = value;
    }
  }
  return map;
}

export function saveLocalNotes(notes: NotesMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTES_LOCAL_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("saveLocalNotes failed:", error);
  }
}

export function saveLocalNotesMeta(meta: NotesMeta): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTES_META_KEY, JSON.stringify(meta));
  } catch (error) {
    console.error("saveLocalNotesMeta failed:", error);
  }
}

export function saveLocalNoteTombstones(tombstones: NotesMeta): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTES_TOMBSTONES_KEY, JSON.stringify(tombstones));
  } catch (error) {
    console.error("saveLocalNoteTombstones failed:", error);
  }
}

export function getLocalNote(slug: string): string {
  return getNoteFromMap(getLocalNotes(), slug);
}

export function setLocalNote(slug: string, text: string): NotesMap {
  const next = setNoteInMap(getLocalNotes(), slug, text);
  saveLocalNotes(next);
  const meta = { ...getLocalNotesMeta() };
  const tombstones = { ...getLocalNoteTombstones() };
  if (Object.hasOwn(next, slug)) {
    meta[slug] = new Date().toISOString();
    delete tombstones[slug];
  } else {
    delete meta[slug];
    // Deletion marker so a remount before sign-in still wins over older cloud.
    if (isValidSlug(slug)) {
      tombstones[slug] = new Date().toISOString();
    }
  }
  saveLocalNotesMeta(meta);
  saveLocalNoteTombstones(tombstones);
  return next;
}

export function clearLocalNote(slug: string): NotesMap {
  return setLocalNote(slug, "");
}

export type FetchNotesResult =
  | { ok: true; notes: NotesMap; updatedAt: NotesMeta }
  | { ok: false };

export async function fetchUserNotes(): Promise<FetchNotesResult> {
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data.notes;
    if (typeof raw !== "object" || raw === null) {
      return { ok: true, notes: {}, updatedAt: {} };
    }
    const map: NotesMap = {};
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string" && value.trim()) {
        map[key] = normalizeNote(value);
      }
    }
    const updatedAt: NotesMeta = {};
    const rawMeta = data.updatedAt;
    if (typeof rawMeta === "object" && rawMeta !== null && !Array.isArray(rawMeta)) {
      for (const [key, value] of Object.entries(rawMeta)) {
        if (isValidSlug(key) && typeof value === "string" && parseNoteTimestamp(value) > 0) {
          updatedAt[key] = value;
        }
      }
    }
    return { ok: true, notes: map, updatedAt };
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
