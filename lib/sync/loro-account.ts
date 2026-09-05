import { LoroDoc, LoroText } from "loro-crdt";
import {
  isRegisteredProblemSlug,
  validateProblemRegistry,
  type ProblemRegistry,
} from "../problem-registry";

const PROGRESS_ROOT = "progress";
const NOTES_ROOT = "notes";

export type LoroAccountSnapshot = {
  progress: Record<string, boolean>;
  notes: Record<string, string>;
};

export class LoroAccountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoroAccountError";
  }
}

function assertSlug(registry: ProblemRegistry, slug: string): void {
  validateProblemRegistry(registry);
  if (!isRegisteredProblemSlug(registry, slug)) {
    throw new LoroAccountError(`unknown Problem Registry slug: ${slug}`);
  }
}

function assertText(text: string): void {
  if (typeof text !== "string") throw new LoroAccountError("Problem Note text must be a string");
}

function maps(doc: LoroDoc) {
  return { progress: doc.getMap(PROGRESS_ROOT), notes: doc.getMap(NOTES_ROOT) };
}

/**
 * The only persisted account format is a Loro document. Its binary updates can
 * be replicated directly between IndexedDB, the Durable Object, and browsers.
 */
export function createLoroAccountDocument(): LoroDoc {
  return new LoroDoc();
}

export function setLoroProgress(
  doc: LoroDoc,
  registry: ProblemRegistry,
  slug: string,
  completed: boolean
): void {
  assertSlug(registry, slug);
  if (typeof completed !== "boolean") {
    throw new LoroAccountError("Progress completion must be a boolean");
  }
  const { progress } = maps(doc);
  if (completed) progress.set(slug, true);
  else progress.delete(slug);
}

export function setLoroNote(
  doc: LoroDoc,
  registry: ProblemRegistry,
  slug: string,
  text: string
): void {
  assertSlug(registry, slug);
  assertText(text);
  const { notes } = maps(doc);
  if (text.length === 0) {
    notes.delete(slug);
    return;
  }
  notes.ensureMergeableText(slug).update(text);
}

export function readLoroAccountDocument(
  doc: LoroDoc,
  registry: ProblemRegistry
): LoroAccountSnapshot {
  validateProblemRegistry(registry);
  const { progress, notes } = maps(doc);
  const result: LoroAccountSnapshot = { progress: {}, notes: {} };

  for (const slug of progress.keys()) {
    if (typeof slug === "string" && isRegisteredProblemSlug(registry, slug)) {
      if (progress.get(slug) === true) result.progress[slug] = true;
    }
  }

  for (const slug of notes.keys()) {
    if (typeof slug !== "string" || !isRegisteredProblemSlug(registry, slug)) continue;
    const value = notes.get(slug);
    if (value instanceof LoroText) {
      const text = value.toString();
      if (text.length > 0) result.notes[slug] = text;
    }
  }
  return result;
}

export function exportLoroAccountUpdate(doc: LoroDoc): Uint8Array {
  return doc.export({ mode: "update" });
}

export function exportLoroAccountSnapshot(doc: LoroDoc): Uint8Array {
  return doc.export({ mode: "snapshot" });
}

export function importLoroAccountUpdate(doc: LoroDoc, update: Uint8Array): void {
  if (!(update instanceof Uint8Array) || update.length === 0) {
    throw new LoroAccountError("Loro account update must be non-empty binary data");
  }
  const result = doc.import(update);
  if (!result.success) throw new LoroAccountError("Loro account update could not be imported");
}

export function loadLoroAccountSnapshot(snapshot: Uint8Array): LoroDoc {
  if (!(snapshot instanceof Uint8Array) || snapshot.length === 0) {
    throw new LoroAccountError("Loro account snapshot must be non-empty binary data");
  }
  return LoroDoc.fromSnapshot(snapshot);
}
