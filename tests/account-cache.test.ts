import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createIndexedDbAccountCache,
  type AccountCacheOptions,
} from "../lib/learning-data/account-cache";
import {
  acceptProblemNoteMutation,
  addProgress,
  createProblemNoteMutation,
  emptyProgressState,
  emptyProblemNoteState,
  removeProgress,
} from "../lib/sync/domain";
import { type ProblemRegistry } from "../lib/problem-registry";

const registry: ProblemRegistry = {
  version: 1,
  problems: [
    { slug: "alpha", active: true },
    { slug: "beta", active: true },
  ],
};

let databaseNumber = 0;
function databaseName() {
  databaseNumber += 1;
  return `codejeet-account-cache-test-${databaseNumber}`;
}

async function deleteDatabase(name: string): Promise<void> {
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  });
}

async function readPending(name: string, accountId: string): Promise<Record<string, unknown>> {
  const opening = indexedDB.open(name, 3);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(opening.error);
  });
  const transaction = db.transaction("pendingOverlay", "readonly");
  const pending = await new Promise<Record<string, unknown>>((resolve, reject) => {
    const request = transaction.objectStore("pendingOverlay").get(accountId);
    request.onsuccess = () => resolve(request.result as Record<string, unknown>);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return pending;
}

function options(name: string, extra: Partial<AccountCacheOptions> = {}): AccountCacheOptions {
  return {
    databaseName: name,
    registry,
    randomBytes: () => Uint8Array.from({ length: 16 }, (_, index) => index + 1),
    ...extra,
  };
}

function legacyStorage(initial: Record<string, string>): {
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
} {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => void values.delete(key),
    setItem: (key, value) => void values.set(key, value),
  };
}

describe("IndexedDB Account Cache", () => {
  it("enumerates retained Revocation Handles after sign-out and erases only revoked caches", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      await cache.activate("account-b");
      cache.deactivate();
      const retained = await cache.listRevocationHandles();
      assert.deepEqual(
        retained.map(({ accountId, revocationHandle }) => [accountId, revocationHandle.length]),
        [
          ["account-a", 32],
          ["account-b", 32],
        ]
      );
      assert.equal(await cache.eraseAccount("account-a"), true);
      assert.deepEqual(
        (await cache.listRevocationHandles()).map(({ accountId }) => accountId),
        ["account-b"]
      );
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("commits offline mark/unmark in one durable cache and reopens the same Progress", async () => {
    const name = databaseName();
    try {
      const first = createIndexedDbAccountCache(options(name));
      assert.deepEqual((await first.activate("account-a")).snapshot.progress, {});
      const canonical = addProgress(
        emptyProgressState(),
        registry,
        new Uint8Array(16).fill(9),
        BigInt(0),
        "alpha"
      );
      assert.deepEqual((await first.replaceCanonical("server-1", canonical)).progress, {
        alpha: true,
      });
      assert.deepEqual((await first.commit("alpha", false)).snapshot.progress, {});
      assert.deepEqual((await first.commit("beta", true)).snapshot.progress, { beta: true });
      first.close();

      const reopened = createIndexedDbAccountCache(options(name));
      assert.deepEqual((await reopened.activate("account-a")).snapshot.progress, { beta: true });
      const inspectionRequest = indexedDB.open(name, 3);
      const inspectionDb = await new Promise<IDBDatabase>((resolve, reject) => {
        inspectionRequest.onsuccess = () => resolve(inspectionRequest.result);
        inspectionRequest.onerror = () => reject(inspectionRequest.error);
      });
      const inspection = inspectionDb.transaction("accountMeta", "readonly");
      const metadata = await new Promise<{ actorId: number[]; nextActorCounter: string }>(
        (resolve, reject) => {
          const request = inspection.objectStore("accountMeta").get("account-a");
          request.onsuccess = () =>
            resolve(request.result as { actorId: number[]; nextActorCounter: string });
          request.onerror = () => reject(request.error);
        }
      );
      assert.equal(metadata.actorId.length, 16);
      assert.equal(metadata.nextActorCounter, "2");
      inspectionDb.close();
      reopened.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("does not consume an Actor counter or change rendered Progress when its transaction aborts", async () => {
    const name = databaseName();
    try {
      const failing = createIndexedDbAccountCache(
        options(name, { beforeCommit: (transaction) => transaction.abort() })
      );
      await failing.activate("account-a");
      const failed = await failing.commit("alpha", true);
      assert.equal(failed.ok, false);
      assert.deepEqual(failed.snapshot.progress, {});
      failing.close();

      const recovered = createIndexedDbAccountCache(options(name));
      await recovered.activate("account-a");
      const committed = await recovered.commit("alpha", true);
      assert.equal(committed.ok, true);
      assert.deepEqual(committed.snapshot.progress, { alpha: true });
      recovered.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("rejects an incomplete active generation and accepts only validated generation switches", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      const dbRequest = indexedDB.open(name, 3);
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        dbRequest.onsuccess = () => resolve(dbRequest.result);
        dbRequest.onerror = () => reject(dbRequest.error);
      });
      const readTx = db.transaction("canonicalGenerations", "readonly");
      const generation = await new Promise<Record<string, unknown>>((resolve, reject) => {
        const request = readTx.objectStore("canonicalGenerations").get(["account-a", "0"]);
        request.onsuccess = () => resolve(request.result as Record<string, unknown>);
        request.onerror = () => reject(request.error);
      });
      const writeTx = db.transaction("canonicalGenerations", "readwrite");
      writeTx.objectStore("canonicalGenerations").put({ ...generation, complete: false });
      await new Promise<void>((resolve, reject) => {
        writeTx.oncomplete = () => resolve();
        writeTx.onerror = () => reject(writeTx.error);
      });
      db.close();

      assert.deepEqual((await cache.reload()).progress, {});
      assert.equal((await cache.commit("alpha", true)).ok, false);
      cache.close();

      const repairRequest = indexedDB.open(name, 3);
      const repairDb = await new Promise<IDBDatabase>((resolve, reject) => {
        repairRequest.onsuccess = () => resolve(repairRequest.result);
        repairRequest.onerror = () => reject(repairRequest.error);
      });
      const repairTx = repairDb.transaction("canonicalGenerations", "readwrite");
      repairTx.objectStore("canonicalGenerations").put({ ...generation, complete: true });
      await new Promise<void>((resolve, reject) => {
        repairTx.oncomplete = () => resolve();
        repairTx.onerror = () => reject(repairTx.error);
      });
      repairDb.close();

      const valid = createIndexedDbAccountCache(options(name));
      await valid.activate("account-a");
      const canonical = addProgress(
        emptyProgressState(),
        registry,
        new Uint8Array(16).fill(9),
        BigInt(0),
        "beta"
      );
      assert.deepEqual((await valid.replaceCanonical("1", canonical)).progress, { beta: true });
      valid.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("rebases accepted pending dots and vectors while preserving newer local mutations", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      const localActor = Uint8Array.from({ length: 16 }, (_, index) => index + 1);
      const canonicalAdd = addProgress(
        emptyProgressState(),
        registry,
        localActor,
        BigInt(0),
        "alpha"
      );
      await cache.commit("alpha", true);
      await cache.replaceCanonical("server-1", canonicalAdd);
      const afterAcceptedAdd = (await readPending(name, "account-a")).progress as {
        adds: unknown[];
        removed: unknown[];
      };
      assert.deepEqual(afterAcceptedAdd.adds, []);
      assert.deepEqual(afterAcceptedAdd.removed, []);

      const canonicalRemoval = removeProgress(
        canonicalAdd,
        registry,
        localActor,
        BigInt(1),
        "alpha"
      );
      await cache.commit("alpha", false);
      await cache.commit("beta", true);
      await cache.replaceCanonical("server-2", canonicalRemoval);
      const afterRebase = (await readPending(name, "account-a")).progress as {
        adds: Array<{ slug: string; counter: string }>;
        removed: unknown[];
      };
      assert.deepEqual(afterRebase.removed, []);
      assert.deepEqual(
        afterRebase.adds.map(({ slug }) => slug),
        ["beta"]
      );
      assert.deepEqual(cache.read().progress, { beta: true });

      await cache.commit("alpha", true);
      await cache.replaceCanonical("server-3", canonicalRemoval);
      assert.deepEqual(cache.read().progress, { alpha: true, beta: true });

      await cache.commit("alpha", false);
      await cache.replaceCanonical("server-4", canonicalRemoval);
      const newerRemoval = (await readPending(name, "account-a")).progress as {
        adds: Array<{ slug: string }>;
        removed: Array<[string, unknown]>;
      };
      assert.deepEqual(cache.read().progress, { beta: true });
      assert.deepEqual(
        newerRemoval.adds.map(({ slug }) => slug),
        ["beta"]
      );
      assert.equal(
        newerRemoval.removed.some(([slug]) => slug === "alpha"),
        true
      );
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("rejects a stale or corrupt Pending Overlay without switching generations", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      const opening = indexedDB.open(name, 3);
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        opening.onsuccess = () => resolve(opening.result);
        opening.onerror = () => reject(opening.error);
      });
      const readTransaction = db.transaction("pendingOverlay", "readonly");
      const pending = await new Promise<Record<string, unknown>>((resolve, reject) => {
        const request = readTransaction.objectStore("pendingOverlay").get("account-a");
        request.onsuccess = () => resolve(request.result as Record<string, unknown>);
        request.onerror = () => reject(request.error);
      });
      const writeTransaction = db.transaction("pendingOverlay", "readwrite");
      writeTransaction.objectStore("pendingOverlay").put({ ...pending, generationId: "stale" });
      await new Promise<void>((resolve, reject) => {
        writeTransaction.oncomplete = () => resolve();
        writeTransaction.onerror = () => reject(writeTransaction.error);
      });
      db.close();

      const canonical = addProgress(
        emptyProgressState(),
        registry,
        new Uint8Array(16).fill(9),
        BigInt(0),
        "beta"
      );
      assert.deepEqual((await cache.replaceCanonical("1", canonical)).progress, {});
      assert.deepEqual((await cache.reload()).progress, {});

      const corruptOpening = indexedDB.open(name, 3);
      const corruptDb = await new Promise<IDBDatabase>((resolve, reject) => {
        corruptOpening.onsuccess = () => resolve(corruptOpening.result);
        corruptOpening.onerror = () => reject(corruptOpening.error);
      });
      const corruptTransaction = corruptDb.transaction("pendingOverlay", "readwrite");
      corruptTransaction.objectStore("pendingOverlay").put({
        ...pending,
        generationId: "0",
        progress: null,
      });
      await new Promise<void>((resolve, reject) => {
        corruptTransaction.oncomplete = () => resolve();
        corruptTransaction.onerror = () => reject(corruptTransaction.error);
      });
      corruptDb.close();
      assert.deepEqual((await cache.replaceCanonical("2", canonical)).progress, {});
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("keeps the prior account active when a target fails validation and lets the latest activation win", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      await cache.commit("alpha", true);
      await cache.activate("account-b");
      await cache.activate("account-a");

      const opening = indexedDB.open(name, 3);
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        opening.onsuccess = () => resolve(opening.result);
        opening.onerror = () => reject(opening.error);
      });
      const transaction = db.transaction("pendingOverlay", "readwrite");
      const pendingRequest = transaction.objectStore("pendingOverlay").get("account-b");
      const pending = await new Promise<Record<string, unknown>>((resolve, reject) => {
        pendingRequest.onsuccess = () => resolve(pendingRequest.result as Record<string, unknown>);
        pendingRequest.onerror = () => reject(pendingRequest.error);
      });
      transaction.objectStore("pendingOverlay").put({ ...pending, generationId: "stale" });
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
      db.close();

      const failed = await cache.activate("account-b");
      assert.equal(failed.ok, false);
      assert.deepEqual(cache.read().progress, { alpha: true });
      cache.close();

      const concurrent = createIndexedDbAccountCache(options(`${name}-concurrent`));
      const first = concurrent.activate("account-a");
      const second = concurrent.activate("account-b");
      const [firstResult, secondResult] = await Promise.all([first, second]);
      assert.equal(firstResult.ok, false);
      assert.equal(firstResult.reason, "stale");
      assert.equal(secondResult.ok, true);
      assert.deepEqual(concurrent.read().progress, {});
      concurrent.close();
    } finally {
      await deleteDatabase(name);
      await deleteDatabase(`${name}-concurrent`);
    }
  });

  it("uses broadcasts only as invalidation hints and rereads IndexedDB after reordered delivery", async () => {
    const name = databaseName();
    const messages: unknown[] = [];
    const channels: Array<{
      onmessage: ((event: MessageEvent<unknown>) => void) | null;
      postMessage: (value: unknown) => void;
      close: () => void;
    }> = [];
    const channelFactory = () => {
      const channel = {
        onmessage: null as ((event: MessageEvent<unknown>) => void) | null,
        postMessage: (value: unknown) => messages.push(value),
        close: () => {},
      };
      channels.push(channel);
      return channel;
    };
    try {
      const first = createIndexedDbAccountCache(options(name, { channelFactory }));
      const second = createIndexedDbAccountCache(options(name, { channelFactory }));
      await first.activate("account-a");
      await second.activate("account-a");
      await first.commit("alpha", true);
      await first.commit("beta", true);
      assert.deepEqual(second.read().progress, {});
      assert.deepEqual(messages, [
        { accountId: "account-a", affectedKeys: ["alpha"], localCommitSequence: "1" },
        { accountId: "account-a", affectedKeys: ["beta"], localCommitSequence: "2" },
      ]);
      channels[1].onmessage?.({ data: messages[1] } as MessageEvent<unknown>);
      channels[1].onmessage?.({ data: messages[0] } as MessageEvent<unknown>);
      await new Promise((resolve) => setTimeout(resolve, 25));
      assert.deepEqual(second.read().progress, { alpha: true, beta: true });
      first.close();
      second.close();
      await new Promise((resolve) => setTimeout(resolve, 10));
    } finally {
      await deleteDatabase(name);
    }
  });

  it("orders opaque canonical generations by server revision and retires the old generation", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      const first = await cache.replaceCanonical(
        "opaque-new",
        addProgress(emptyProgressState(), registry, new Uint8Array(16).fill(9), BigInt(0), "alpha"),
        undefined,
        BigInt(10)
      );
      assert.deepEqual(first.progress, { alpha: true });
      const late = await cache.replaceCanonical(
        "opaque-old",
        emptyProgressState(),
        undefined,
        BigInt(9)
      );
      assert.deepEqual(late.progress, { alpha: true });

      const opening = indexedDB.open(name, 3);
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        opening.onsuccess = () => resolve(opening.result);
        opening.onerror = () => reject(opening.error);
      });
      const transaction = db.transaction("canonicalGenerations", "readonly");
      const retired = await new Promise<unknown>((resolve, reject) => {
        const request = transaction.objectStore("canonicalGenerations").get(["account-a", "0"]);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      assert.equal(retired, undefined);
      db.close();
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("stores exact Problem Note values and explicit deletes durably without network work", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      const text = "  exact\nvalue  ";
      assert.equal((await cache.saveNote("alpha", text)).ok, true);
      assert.equal(cache.read().notes.alpha, text);
      await cache.replaceCanonical("progress-only", emptyProgressState());
      assert.equal(cache.read().notes.alpha, text);
      assert.equal((await cache.clearNote("alpha")).ok, true);
      assert.equal(cache.read().notes.alpha, "");
      cache.close();

      const reopened = createIndexedDbAccountCache(options(name));
      await reopened.activate("account-a");
      assert.equal(reopened.read().notes.alpha, "");
      reopened.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("represents an empty note Save as an explicit delete mutation", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      assert.equal((await cache.saveNote("alpha", "")).ok, true);
      const state = await cache.exportSyncState();
      assert.equal(
        state?.pending.some(
          (mutation) => mutation.kind === "note" && mutation.operation.kind === "delete"
        ),
        true
      );
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("exports one aggregate Progress delta and preserves newer edits during canonical ACKs", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      assert.equal((await cache.commit("alpha", true)).ok, true);
      const first = await cache.exportSyncState();
      assert.equal(
        first?.pending.filter((mutation) => mutation.kind === "progress-delta").length,
        1
      );
      assert.equal(
        first?.pending.filter((mutation) => mutation.kind === "add" || mutation.kind === "remove")
          .length,
        0
      );
      const progressDelta = first?.pending.find((mutation) => mutation.kind === "progress-delta");
      assert.ok(progressDelta && progressDelta.kind === "progress-delta");

      await cache.commit("beta", true);
      await cache.applyCanonicalMutation({
        kind: "progress",
        state: {
          adds: progressDelta.adds.map((add) => ({
            slug: add.slug,
            dot: { actorId: Uint8Array.from(add.actorId as Uint8Array), counter: add.counter },
          })),
          causalSummary: new Map(
            progressDelta.causalSummary.map((entry) => [
              Array.from(entry.actorId as Uint8Array, (byte) =>
                byte.toString(16).padStart(2, "0")
              ).join(""),
              entry.counter,
            ])
          ),
          removed: new Map(),
        },
        serverRevision: BigInt(1),
      });
      assert.deepEqual(cache.read().progress, { alpha: true, beta: true });
      await cache.acknowledgeProgress({
        adds: progressDelta.adds.map((add) => ({
          slug: add.slug,
          dot: { actorId: Uint8Array.from(add.actorId as Uint8Array), counter: add.counter },
        })),
        causalSummary: new Map(
          progressDelta.causalSummary.map((entry) => [
            Array.from(entry.actorId as Uint8Array, (byte) =>
              byte.toString(16).padStart(2, "0")
            ).join(""),
            entry.counter,
          ])
        ),
        removed: new Map(),
      });
      const remaining = await cache.exportSyncState();
      const hasBeta = remaining?.pending.some(
        (mutation) =>
          mutation.kind === "progress-delta" && mutation.adds.some((add) => add.slug === "beta")
      );
      assert.equal(hasBeta, true);
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("keeps a newer pending value over an older acknowledgement and prunes matching revisions", async () => {
    const name = databaseName();
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      await cache.saveNote("alpha", "first");
      await cache.saveNote("alpha", "second");
      const actor = Uint8Array.from({ length: 16 }, (_, index) => index + 1);
      const acknowledged = acceptProblemNoteMutation(
        emptyProblemNoteState(),
        registry,
        createProblemNoteMutation(registry, actor, BigInt(0), "alpha", "first"),
        BigInt(1)
      ).state;
      await cache.replaceCanonical("note-1", emptyProgressState(), acknowledged);
      assert.equal(cache.read().notes.alpha, "second");
      const pending = (await readPending(name, "account-a")).notes as Record<
        string,
        { localRevision: string }
      >;
      assert.equal(pending.alpha.localRevision, "1");

      await cache.replaceCanonical(
        "note-2",
        emptyProgressState(),
        acceptProblemNoteMutation(
          emptyProblemNoteState(),
          registry,
          createProblemNoteMutation(registry, actor, BigInt(1), "alpha", "second"),
          BigInt(2)
        ).state
      );
      assert.equal(cache.read().notes.alpha, "second");
      const settledPending = (await readPending(name, "account-a")).notes as
        | Record<string, unknown>
        | undefined;
      assert.equal(settledPending?.alpha, undefined);
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("rolls back a note save and enforces both note size limits", async () => {
    const name = databaseName();
    try {
      const failing = createIndexedDbAccountCache(
        options(name, { beforeCommit: (transaction) => transaction.abort() })
      );
      await failing.activate("account-a");
      const failed = await failing.saveNote("alpha", "draft");
      assert.equal(failed.ok, false);
      assert.equal(failing.read().notes.alpha, undefined);
      failing.close();

      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      assert.equal((await cache.saveNote("alpha", "a".repeat(2_000))).ok, true);
      assert.equal((await cache.saveNote("beta", "b".repeat(2_001))).ok, false);
      assert.equal(cache.read().notes.beta, undefined);
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("imports only valid legacy values, is idempotent, and keeps metadata out of Account Data", async () => {
    const name = databaseName();
    const storage = legacyStorage({
      "leetcode-checked-items": JSON.stringify({ alpha: true, beta: false, unknown: true }),
      "leetcode-problem-notes": JSON.stringify({ alpha: "  exact\nlegacy  ", beta: "" }),
      "leetcode-problem-notes-meta": JSON.stringify({ alpha: "history" }),
      "leetcode-problem-notes-deleted": JSON.stringify({ beta: "tombstone" }),
    });
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      const imported = await cache.importLegacy(storage);
      assert.equal(imported.ok, true);
      if (imported.ok) {
        assert.equal(imported.imported, true);
        assert.deepEqual(imported.snapshot.progress, { alpha: true });
        assert.equal(imported.snapshot.notes.alpha, "  exact\nlegacy  ");
      }
      assert.equal(storage.getItem("leetcode-checked-items"), null);
      assert.equal(storage.getItem("leetcode-problem-notes"), null);
      assert.equal(storage.getItem("leetcode-problem-notes-meta"), null);
      assert.equal(storage.getItem("leetcode-problem-notes-deleted"), null);
      const repeated = await cache.importLegacy(storage);
      assert.equal(repeated.ok, true);
      if (repeated.ok) assert.equal(repeated.imported, false);
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("does not delete a legacy key changed during import cleanup", async () => {
    const name = databaseName();
    const storage = legacyStorage({
      "leetcode-checked-items": JSON.stringify({ alpha: true }),
      "leetcode-problem-notes": JSON.stringify({ beta: "legacy" }),
    });
    let changed = false;
    try {
      const cache = createIndexedDbAccountCache(
        options(name, {
          beforeCommit: () => {
            if (!changed) {
              changed = true;
              storage.setItem("leetcode-problem-notes", JSON.stringify({ beta: "new" }));
            }
          },
        })
      );
      await cache.activate("account-a");
      assert.equal((await cache.importLegacy(storage)).ok, true);
      assert.equal(storage.getItem("leetcode-checked-items"), null);
      assert.equal(storage.getItem("leetcode-problem-notes"), JSON.stringify({ beta: "new" }));
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("never lets imported notes replace canonical or pending Account Notes", async () => {
    const name = databaseName();
    const storage = legacyStorage({
      "leetcode-problem-notes": JSON.stringify({
        alpha: "legacy-pending",
        beta: "legacy-canonical",
      }),
    });
    try {
      const cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      await cache.saveNote("alpha", "local");
      const canonical = acceptProblemNoteMutation(
        emptyProblemNoteState(),
        registry,
        createProblemNoteMutation(
          registry,
          new Uint8Array(16).fill(9),
          BigInt(0),
          "beta",
          "canonical"
        ),
        BigInt(1)
      ).state;
      await cache.replaceCanonical("canonical", emptyProgressState(), canonical, BigInt(1));
      const imported = await cache.importLegacy(storage);
      assert.equal(imported.ok, true);
      if (imported.ok) assert.equal(imported.imported, false);
      assert.equal(cache.read().notes.alpha, "local");
      assert.equal(cache.read().notes.beta, "canonical");
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("abandons a captured import when the active account changes", async () => {
    const name = databaseName();
    let cache: ReturnType<typeof createIndexedDbAccountCache>;
    const storage = legacyStorage({
      "leetcode-checked-items": JSON.stringify({ alpha: true }),
    });
    const originalGetItem = storage.getItem;
    let switched = false;
    storage.getItem = (key) => {
      if (!switched) {
        switched = true;
        void cache.activate("account-b");
      }
      return originalGetItem(key);
    };
    try {
      cache = createIndexedDbAccountCache(options(name));
      await cache.activate("account-a");
      const result = await cache.importLegacy(storage);
      assert.equal(result.ok, false);
      if (!result.ok) assert.equal(result.reason, "stale");
      cache.close();
    } finally {
      await deleteDatabase(name);
    }
  });

  it("retries an interrupted legacy import without duplicating mutations", async () => {
    const name = databaseName();
    const storage = legacyStorage({
      "leetcode-checked-items": JSON.stringify({ alpha: true }),
      "leetcode-problem-notes": JSON.stringify({ beta: "legacy" }),
    });
    try {
      const failing = createIndexedDbAccountCache(
        options(name, { beforeCommit: (transaction) => transaction.abort() })
      );
      await failing.activate("account-a");
      assert.equal((await failing.importLegacy(storage)).ok, false);
      failing.close();

      const recovered = createIndexedDbAccountCache(options(name));
      await recovered.activate("account-a");
      const imported = await recovered.importLegacy(storage);
      assert.equal(imported.ok, true);
      assert.deepEqual(recovered.read().progress, { alpha: true });
      assert.equal(recovered.read().notes.beta, "legacy");
      assert.equal((await recovered.importLegacy(storage)).ok, true);
      recovered.close();
    } finally {
      await deleteDatabase(name);
    }
  });
});
