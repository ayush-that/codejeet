import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ProblemRegistry } from "../lib/problem-registry";
import {
  LoroAccountError,
  createLoroAccountDocument,
  exportLoroAccountSnapshot,
  exportLoroAccountUpdate,
  importLoroAccountUpdate,
  loadLoroAccountSnapshot,
  readLoroAccountDocument,
  setLoroNote,
  setLoroProgress,
} from "../lib/sync/loro-account";

const registry: ProblemRegistry = {
  version: 1,
  problems: [
    { slug: "alpha", active: true },
    { slug: "beta", active: true },
  ],
};

describe("Loro account document", () => {
  it("round-trips account data through its native snapshot", () => {
    const source = createLoroAccountDocument();
    setLoroProgress(source, registry, "alpha", true);
    setLoroNote(source, registry, "beta", "private note");

    const restored = loadLoroAccountSnapshot(exportLoroAccountSnapshot(source));
    assert.deepEqual(readLoroAccountDocument(restored, registry), {
      progress: { alpha: true },
      notes: { beta: "private note" },
    });
  });

  it("merges independent binary updates from offline peers", () => {
    const source = createLoroAccountDocument();
    setLoroProgress(source, registry, "alpha", true);
    const baseline = exportLoroAccountSnapshot(source);
    const left = loadLoroAccountSnapshot(baseline);
    const right = loadLoroAccountSnapshot(baseline);

    setLoroProgress(left, registry, "beta", true);
    setLoroNote(right, registry, "alpha", "edited while offline");
    importLoroAccountUpdate(left, exportLoroAccountUpdate(right));
    importLoroAccountUpdate(right, exportLoroAccountUpdate(left));

    const expected = {
      progress: { alpha: true, beta: true },
      notes: { alpha: "edited while offline" },
    };
    assert.deepEqual(readLoroAccountDocument(left, registry), expected);
    assert.deepEqual(readLoroAccountDocument(right, registry), expected);
  });

  it("uses mergeable text for note replacement and supports note deletion", () => {
    const doc = createLoroAccountDocument();
    setLoroNote(doc, registry, "alpha", "before");
    setLoroNote(doc, registry, "alpha", "after");
    assert.equal(readLoroAccountDocument(doc, registry).notes.alpha, "after");

    setLoroNote(doc, registry, "alpha", "");
    assert.deepEqual(readLoroAccountDocument(doc, registry).notes, {});
  });

  it("rejects unknown slugs and malformed replication payloads", () => {
    const doc = createLoroAccountDocument();
    assert.throws(() => setLoroProgress(doc, registry, "unknown", true), LoroAccountError);
    assert.throws(() => importLoroAccountUpdate(doc, new Uint8Array()), LoroAccountError);
  });
});
