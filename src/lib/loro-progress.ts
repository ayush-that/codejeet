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
const LORO_PROGRESS_PREFIX = "codejeet-loro-progress-v1";

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
  private accountId: string | undefined;
  private doc: ReturnType<typeof createLoroAccountDocument> | undefined;
  private pendingFrom:
    | ReturnType<ReturnType<typeof createLoroAccountDocument>["oplogVersion"]>
    | undefined;
  private pendingSnapshot = false;
  private readonly listeners = new Set<Listener>();

  private get storageKey(): string {
    return `${LORO_PROGRESS_PREFIX}:${this.accountId ? `account:${encodeURIComponent(this.accountId)}` : "guest"}`;
  }

  private get pendingKey(): string {
    return `${this.storageKey}:pending`;
  }

  selectAccount(accountId: string | undefined): void {
    if (this.accountId === accountId) return;
    this.accountId = accountId;
    this.doc = undefined;
    this.pendingFrom = undefined;
    this.pendingSnapshot = false;
  }

  private getDocument() {
    if (this.doc) return this.doc;
    try {
      const encoded = localStorage.getItem(this.storageKey);
      if (encoded) {
        this.doc = loadLoroAccountSnapshot(decode(encoded));
        this.pendingSnapshot = localStorage.getItem(this.pendingKey) === "1";
      }
    } catch {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.pendingKey);
    }
    if (!this.doc) {
      this.doc = createLoroAccountDocument();
      if (!this.accountId) {
        for (const [slug, completed] of Object.entries(readLegacy())) {
          if (completed) {
            try {
              setLoroProgress(this.doc, committedProblemRegistry, slug, true);
              this.pendingSnapshot = true;
            } catch {
              // Discard stale legacy slugs outside the committed registry.
            }
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
      localStorage.setItem(this.storageKey, encode(exportLoroAccountSnapshot(this.getDocument())));
      if (this.pendingSnapshot) localStorage.setItem(this.pendingKey, "1");
      else localStorage.removeItem(this.pendingKey);
    } catch {
      // Storage quotas and private modes do not invalidate the in-memory document.
    }
  }

  read(): Record<string, boolean> {
    return this.snapshot();
  }

  set(slug: string, completed: boolean): Record<string, boolean> {
    const doc = this.getDocument();
    if (!this.pendingSnapshot) this.pendingFrom ??= doc.oplogVersion();
    this.pendingSnapshot = true;
    setLoroProgress(doc, committedProblemRegistry, slug, completed);
    this.persist();
    const progress = this.snapshot();
    for (const listener of this.listeners) listener(progress);
    return progress;
  }

  async sync(remote: LoroRemoteReplica): Promise<Record<string, boolean>> {
    const doc = this.getDocument();
    if (this.pendingSnapshot) {
      await remote.push(doc, this.pendingFrom);
      this.pendingFrom = undefined;
      this.pendingSnapshot = false;
      this.persist();
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
