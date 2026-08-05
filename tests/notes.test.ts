import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_NOTE_BODY_RAW,
  MAX_NOTE_LENGTH,
  MAX_SLUG_LENGTH,
  NOTES_LOCAL_KEY,
  clearLocalNote,
  clearNoteFromMap,
  getLocalNote,
  getNoteFromMap,
  isValidSlug,
  mergeNotesMaps,
  mergeNotesMapsRespectingLocal,
  normalizeNote,
  parseNotesPostBody,
  setLocalNote,
  setNoteInMap,
  type NotesMap,
} from "../utils/notesUtils";

/** Minimal localStorage so get/set/clear local helpers run on the real path in Node. */
function installMemoryLocalStorage() {
  const store = new Map<string, string>();
  const memory = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
  // notesUtils gates on typeof window
  (globalThis as { window?: unknown }).window = globalThis;
  (globalThis as { localStorage?: typeof memory }).localStorage = memory;
  return store;
}

describe("isValidSlug", () => {
  it("accepts non-empty slugs within length bound", () => {
    assert.equal(isValidSlug("two-sum"), true);
    assert.equal(isValidSlug("a".repeat(MAX_SLUG_LENGTH)), true);
  });

  it("rejects empty, oversized, and non-string slugs", () => {
    assert.equal(isValidSlug(""), false);
    assert.equal(isValidSlug("a".repeat(MAX_SLUG_LENGTH + 1)), false);
    assert.equal(isValidSlug(null), false);
    assert.equal(isValidSlug(undefined), false);
    assert.equal(isValidSlug(42), false);
  });
});

describe("normalizeNote", () => {
  it("trims and collapses whitespace-only to empty", () => {
    assert.equal(normalizeNote("  hello  "), "hello");
    assert.equal(normalizeNote("   \n\t  "), "");
  });

  it("caps length at MAX_NOTE_LENGTH", () => {
    const long = "x".repeat(MAX_NOTE_LENGTH + 50);
    assert.equal(normalizeNote(long).length, MAX_NOTE_LENGTH);
  });
});

describe("notes map helpers", () => {
  it("writes a note for slug A and reads it back", () => {
    let map: NotesMap = {};
    map = setNoteInMap(map, "two-sum", "hash map O(n)");
    assert.equal(getNoteFromMap(map, "two-sum"), "hash map O(n)");
  });

  it("keeps slug B independent of slug A", () => {
    let map: NotesMap = {};
    map = setNoteInMap(map, "two-sum", "note A");
    map = setNoteInMap(map, "add-two-numbers", "note B");
    assert.equal(getNoteFromMap(map, "two-sum"), "note A");
    assert.equal(getNoteFromMap(map, "add-two-numbers"), "note B");
  });

  it("update replaces content for the same slug", () => {
    let map: NotesMap = {};
    map = setNoteInMap(map, "two-sum", "first draft");
    map = setNoteInMap(map, "two-sum", "revised before interview");
    assert.equal(getNoteFromMap(map, "two-sum"), "revised before interview");
  });

  it("clear removes the entry; re-read is empty/absent", () => {
    let map: NotesMap = {};
    map = setNoteInMap(map, "two-sum", "scratch");
    map = clearNoteFromMap(map, "two-sum");
    assert.equal(getNoteFromMap(map, "two-sum"), "");
    assert.equal(Object.hasOwn(map, "two-sum"), false);
  });

  it("setting empty or whitespace does not leave fake content", () => {
    let map: NotesMap = {};
    map = setNoteInMap(map, "two-sum", "temp");
    map = setNoteInMap(map, "two-sum", "   ");
    assert.equal(Object.hasOwn(map, "two-sum"), false);
    assert.equal(getNoteFromMap(map, "two-sum"), "");
  });

  it("ignores invalid slugs on set/get", () => {
    let map: NotesMap = {};
    map = setNoteInMap(map, "", "should not land");
    assert.deepEqual(map, {});
    assert.equal(getNoteFromMap(map, ""), "");
  });
});

describe("mergeNotesMaps", () => {
  it("remote overwrites shared keys; local-only keys remain", () => {
    const local: NotesMap = { a: "local-a", b: "local-b" };
    const remote: NotesMap = { b: "remote-b", c: "remote-c" };
    assert.deepEqual(mergeNotesMaps(local, remote), {
      a: "local-a",
      b: "remote-b",
      c: "remote-c",
    });
  });
});

describe("mergeNotesMapsRespectingLocal", () => {
  it("keeps local for protected slugs even when remote has a different value", () => {
    const local: NotesMap = { "two-sum": "just-saved", other: "local-other" };
    const remote: NotesMap = { "two-sum": "stale-remote", other: "remote-other", c: "remote-c" };
    const merged = mergeNotesMapsRespectingLocal(local, remote, ["two-sum"]);
    assert.equal(merged["two-sum"], "just-saved");
    assert.equal(merged.other, "remote-other");
    assert.equal(merged.c, "remote-c");
  });

  it("lets a local clear win over remote for a protected slug", () => {
    const local: NotesMap = { keep: "yes" };
    const remote: NotesMap = { "two-sum": "still-on-server", keep: "yes" };
    const merged = mergeNotesMapsRespectingLocal(local, remote, ["two-sum"]);
    assert.equal(Object.hasOwn(merged, "two-sum"), false);
    assert.equal(merged.keep, "yes");
  });

  it("behaves like mergeNotesMaps when nothing is protected", () => {
    const local: NotesMap = { a: "local-a" };
    const remote: NotesMap = { a: "remote-a", b: "remote-b" };
    assert.deepEqual(mergeNotesMapsRespectingLocal(local, remote, []), {
      a: "remote-a",
      b: "remote-b",
    });
  });
});

describe("localStorage notes helpers (shipped path)", () => {
  it("persists, updates, and clears by slug through setLocalNote", () => {
    const store = installMemoryLocalStorage();
    store.clear();

    setLocalNote("two-sum", "hash map O(n)");
    assert.equal(getLocalNote("two-sum"), "hash map O(n)");
    assert.equal(getLocalNote("add-two-numbers"), "");

    setLocalNote("add-two-numbers", "linked list reverse");
    assert.equal(getLocalNote("two-sum"), "hash map O(n)");
    assert.equal(getLocalNote("add-two-numbers"), "linked list reverse");

    setLocalNote("two-sum", "updated tip");
    assert.equal(getLocalNote("two-sum"), "updated tip");

    clearLocalNote("two-sum");
    assert.equal(getLocalNote("two-sum"), "");
    // Cleared key must not linger in the stored JSON map.
    const raw = store.get(NOTES_LOCAL_KEY);
    assert.ok(raw);
    const parsed = JSON.parse(raw!) as NotesMap;
    assert.equal(Object.hasOwn(parsed, "two-sum"), false);
    assert.equal(parsed["add-two-numbers"], "linked list reverse");
  });
});

describe("parseNotesPostBody (shipped API validation)", () => {
  it("accepts a normal upsert body and normalizes the note", () => {
    const result = parseNotesPostBody({ slug: "two-sum", note: "  hash map  " });
    assert.deepEqual(result, { ok: true, slug: "two-sum", note: "hash map" });
  });

  it("accepts empty note for delete", () => {
    const result = parseNotesPostBody({ slug: "two-sum", note: "   " });
    assert.deepEqual(result, { ok: true, slug: "two-sum", note: "" });
  });

  it("rejects empty and oversized slugs", () => {
    assert.equal(parseNotesPostBody({ slug: "", note: "x" }).ok, false);
    assert.equal(
      parseNotesPostBody({ slug: "a".repeat(MAX_SLUG_LENGTH + 1), note: "x" }).ok,
      false
    );
  });

  it("rejects missing or non-string note", () => {
    assert.equal(parseNotesPostBody({ slug: "two-sum" }).ok, false);
    assert.equal(parseNotesPostBody({ slug: "two-sum", note: 1 }).ok, false);
  });

  it("rejects absurdly long note payloads", () => {
    const result = parseNotesPostBody({
      slug: "two-sum",
      note: "x".repeat(MAX_NOTE_BODY_RAW + 1),
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, "Note too long");
  });
});
