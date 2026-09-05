import { LoroDoc } from "loro-crdt";
import {
  importAndValidateLoroAccountUpdate,
  loadLoroAccountSnapshot,
  validateLoroAccountDocument,
} from "../sync/loro-account";
import { committedProblemRegistry } from "../problem-registry";
import { readLoroSyncStore, writeLoroSyncStore } from "./loro-sync-store";
import type { SyncClientContext } from "./sync-client";

type PullResponse = {
  revision: number;
  snapshot: { revision: number; snapshot: string } | null;
  updates: Array<{ revision: number; update: string }>;
};

function fromBase64(value: string): Uint8Array | null {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    return null;
  }
  try {
    return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function pullResponse(value: unknown): PullResponse | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Partial<PullResponse>;
  const revision = candidate.revision;
  if (typeof revision !== "number" || !Number.isSafeInteger(revision) || revision < 0) return null;
  if (candidate.snapshot !== null && candidate.snapshot !== undefined) {
    if (
      typeof candidate.snapshot !== "object" ||
      !Number.isSafeInteger(candidate.snapshot.revision) ||
      candidate.snapshot.revision < 0 ||
      typeof candidate.snapshot.snapshot !== "string"
    ) {
      return null;
    }
  }
  if (!Array.isArray(candidate.updates)) return null;
  for (const update of candidate.updates) {
    if (
      !update ||
      typeof update !== "object" ||
      !Number.isSafeInteger(update.revision) ||
      update.revision < 0 ||
      typeof update.update !== "string"
    ) {
      return null;
    }
  }
  return candidate as PullResponse;
}

export class LoroPullClient {
  private stopped = true;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private generation = 0;

  stop(): void {
    this.generation += 1;
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  start(context: SyncClientContext): void {
    this.stop();
    this.stopped = false;
    const generation = this.generation;
    const poll = async () => {
      if (this.stopped || generation !== this.generation) return;
      try {
        await this.pull(context, generation);
      } finally {
        if (!this.stopped && generation === this.generation) this.timer = setTimeout(poll, 15_000);
      }
    };
    void poll();
  }

  private async pull(context: SyncClientContext, generation: number): Promise<void> {
    const retained = await readLoroSyncStore(context.accountId);
    let revision = retained?.revision ?? BigInt(0);
    let document = retained ? loadLoroAccountSnapshot(retained.snapshot) : new LoroDoc();
    const response = await fetch(`/api/loro-sync?after=${revision.toString()}`, {
      headers: { Authorization: `Bearer ${context.token}` },
      cache: "no-store",
    });
    if (!response.ok) return;
    const payload = pullResponse(await response.json());
    if (!payload || this.stopped || generation !== this.generation) return;
    if (payload.snapshot) {
      const snapshot = fromBase64(payload.snapshot.snapshot);
      if (!snapshot) return;
      document = loadLoroAccountSnapshot(snapshot);
      revision = BigInt(payload.snapshot.revision);
    }
    for (const entry of payload.updates) {
      if (entry.revision <= Number(revision)) continue;
      const update = fromBase64(entry.update);
      if (!update) return;
      importAndValidateLoroAccountUpdate(document, update, committedProblemRegistry);
      revision = BigInt(entry.revision);
    }
    validateLoroAccountDocument(document, committedProblemRegistry);
    if (this.stopped || generation !== this.generation) return;
    await writeLoroSyncStore({
      accountId: context.accountId,
      revision: BigInt(payload.revision) > revision ? BigInt(payload.revision) : revision,
      snapshot: document.export({ mode: "snapshot" }),
      updatedAt: Date.now(),
    });
  }
}
