import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LoroAccountError,
  createLoroAccountDocument,
  exportLoroAccountSnapshot,
  exportLoroAccountUpdate,
  hydrateFromCanonical,
  importLoroAccountUpdate,
  loadLoroAccountSnapshot,
  readLoroAccountDocument,
  setLoroNote,
  setLoroProgress,
} from "../lib/sync/loro-account";
import type { ProblemRegistry } from "../lib/problem-registry";
import type { LoroAccountSnapshot } from "../lib/sync/loro-account";
import { MAX_NOTE_LENGTH } from "../utils/notesUtils";

const registry: ProblemRegistry = {
  version: 1,
  problems: [
    { slug: "two-sum", active: true },
    { slug: "valid-parentheses", active: true },
  ],
};

describe("loro account document helpers", () => {
  it("writes solved progress and explicit empty note deletes", () => {
    const doc = createLoroAccountDocument();
    setLoroProgress(doc, registry, "two-sum", true);
    setLoroProgress(doc, registry, "valid-parentheses", false);
    setLoroNote(doc, registry, "two-sum", "answer");
    setLoroNote(doc, registry, "valid-parentheses", "");
    assert.deepEqual(readLoroAccountDocument(doc, registry), {
      progress: { "two-sum": true },
      notes: { "two-sum": "answer" },
    });
  });

  it("rejects unknown slugs and oversized note text", () => {
    const doc = createLoroAccountDocument();
    assert.throws(() => setLoroProgress(doc, registry, "unknown", true));
    assert.throws(() => setLoroNote(doc, registry, "two-sum", "x".repeat(MAX_NOTE_LENGTH + 1)));
    assert.throws(() => importLoroAccountUpdate(createLoroAccountDocument(), new Uint8Array()), {
      name: LoroAccountError.name,
    });
    const invalidRemote = createLoroAccountDocument();
    invalidRemote.getMap("progress").set("unknown", true);
    assert.throws(() => readLoroAccountDocument(invalidRemote, registry), {
      name: LoroAccountError.name,
    });
    const invalidNote = createLoroAccountDocument();
    invalidNote.getMap("notes").set("two-sum", "not-a-text-container");
    assert.throws(() => readLoroAccountDocument(invalidNote, registry), {
      name: LoroAccountError.name,
    });
  });

  it("round-trips updates and snapshots", () => {
    const doc = createLoroAccountDocument();
    setLoroProgress(doc, registry, "two-sum", true);
    setLoroNote(doc, registry, "two-sum", "solved once");
    const update = exportLoroAccountUpdate(doc);
    const remote = createLoroAccountDocument();
    importLoroAccountUpdate(remote, update);

    const snapshot = exportLoroAccountSnapshot(remote);
    const loaded = loadLoroAccountSnapshot(snapshot);
    const snapshotRead = readLoroAccountDocument(loaded, registry);
    assert.deepEqual(snapshotRead, readLoroAccountDocument(doc, registry));
  });

  it("hydrates canonical structures and exposes the snapshot type", () => {
    const canonical: LoroAccountSnapshot = {
      progress: { "two-sum": true, "valid-parentheses": false },
      notes: { "two-sum": "draft", "valid-parentheses": "" },
    };
    const doc = createLoroAccountDocument();
    hydrateFromCanonical(
      doc,
      registry,
      Object.keys(canonical.progress).filter((slug) => canonical.progress[slug]),
      new Map(Object.entries(canonical.notes))
    );
    const restored = readLoroAccountDocument(doc, registry);
    assert.deepEqual(restored, {
      progress: { "two-sum": true },
      notes: { "two-sum": "draft" },
    });
  });
});
