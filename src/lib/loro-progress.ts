import { committedProblemRegistry } from "../../lib/problem-registry";
import {
  createLoroAccountDocument,
  exportLoroAccountSnapshot,
  loadLoroAccountSnapshot,
  readLoroAccountDocument,
  setLoroProgress,
} from "../../lib/sync/loro-account";
import type { LoroRemoteReplica } from "./loro-remote";

const LEGACY_PROGRESS_KEY = "leetcode-checked-items";
const LORO_PROGRESS_KEY = "codejeet-loro-guest-progress-v1";

type Listener = (progress: Record<string, boolean>) => void;

function encode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decode(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function readLegacy(): Record<string, boolean> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(LEGACY_PROGRESS_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([slug, completed]) => typeof slug === "string" && completed === true
      )
    );
  } catch {
    return {};
  }
}

class LoroGuestProgress {
  private doc: ReturnType<typeof createLoroAccountDocument> | undefined;
  private pendingFrom:
    | ReturnType<ReturnType<typeof createLoroAccountDocument>["oplogVersion"]>
    | undefined;
  private readonly listeners = new Set<Listener>();

  private getDocument() {
    if (this.doc) return this.doc;
    try {
      const encoded = localStorage.getItem(LORO_PROGRESS_KEY);
      if (encoded) this.doc = loadLoroAccountSnapshot(decode(encoded));
    } catch {
      localStorage.removeItem(LORO_PROGRESS_KEY);
    }
    if (!this.doc) {
      this.doc = createLoroAccountDocument();
      for (const [slug, completed] of Object.entries(readLegacy())) {
        if (completed) {
          try {
            setLoroProgress(this.doc, committedProblemRegistry, slug, true);
          } catch {
            // Discard stale legacy slugs outside the committed registry.
          }
        }
      }
      this.persist();
    }
    return this.doc;
  }

  private snapshot(): Record<string, boolean> {
    return readLoroAccountDocument(this.getDocument(), committedProblemRegistry).progress;
  }

  private persist(): void {
    try {
      localStorage.setItem(
        LORO_PROGRESS_KEY,
        encode(exportLoroAccountSnapshot(this.getDocument()))
      );
    } catch {
      // Storage quotas and private modes do not invalidate the in-memory document.
    }
  }

  read(): Record<string, boolean> {
    return this.snapshot();
  }

  set(slug: string, completed: boolean): Record<string, boolean> {
    const doc = this.getDocument();
    this.pendingFrom ??= doc.oplogVersion();
    setLoroProgress(doc, committedProblemRegistry, slug, completed);
    this.persist();
    const progress = this.snapshot();
    for (const listener of this.listeners) listener(progress);
    return progress;
  }

  async sync(remote: LoroRemoteReplica): Promise<Record<string, boolean>> {
    const doc = this.getDocument();
    if (this.pendingFrom) {
      await remote.push(doc, this.pendingFrom);
      this.pendingFrom = undefined;
    }
    await remote.pull(doc);
    this.persist();
    const progress = this.snapshot();
    for (const listener of this.listeners) listener(progress);
    return progress;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const loroGuestProgress = new LoroGuestProgress();
