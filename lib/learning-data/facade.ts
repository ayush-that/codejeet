import { fetchUserProgress, updateQuestionProgress, type ProgressMap } from "@/utils/progressUtils";
import {
  createIndexedDbAccountCache,
  type AccountCacheProgress,
} from "@/lib/learning-data/account-cache";
import {
  checkRetainedAccountRevocations,
  type RevocationProbeResult,
} from "@/lib/learning-data/sync-client";
import {
  MAX_NOTE_LENGTH,
  clearLocalNote,
  fetchUserNotes,
  getLocalNote,
  getLocalNotes,
  getLocalNotesMeta,
  getLocalNoteTombstones,
  reconcileNotes,
  saveLocalNotes,
  saveLocalNotesMeta,
  saveLocalNoteTombstones,
  setLocalNote,
  updateUserNote,
  type FetchNotesResult,
  type NotesMap,
  type NotesMeta,
  type NotesReconciliation,
} from "@/utils/notesUtils";

const PROGRESS_LOCAL_KEY = "leetcode-checked-items";

export type LocalProgress = Record<string, boolean>;

type ProgressActivationResult =
  | { ok: true; accountId: string; progress: LocalProgress }
  | {
      ok: false;
      accountId: string | null;
      progress: LocalProgress;
      reason: "unavailable" | "invalid" | "stale";
    };

type LearningDataView = { kind: "public"; accountId: null } | { kind: "active"; accountId: string };

type ProgressAdapters = {
  readLocal: () => LocalProgress;
  writeLocal: (progress: LocalProgress) => void;
  fetchRemote: () => Promise<ProgressMap>;
  updateRemote: (slug: string, completed: boolean) => Promise<boolean>;
};

type NotesAdapters = {
  getLocal: typeof getLocalNote;
  getAllLocal: typeof getLocalNotes;
  getMeta: typeof getLocalNotesMeta;
  getTombstones: typeof getLocalNoteTombstones;
  saveAll: typeof saveLocalNotes;
  saveMeta: typeof saveLocalNotesMeta;
  saveTombstones: typeof saveLocalNoteTombstones;
  setLocal: typeof setLocalNote;
  clearLocal: typeof clearLocalNote;
  fetchRemote: typeof fetchUserNotes;
  updateRemote: typeof updateUserNote;
  reconcile: typeof reconcileNotes;
};

interface LearningDataDependencies {
  progress?: Partial<ProgressAdapters>;
  notes?: Partial<NotesAdapters>;
  accountCache?: AccountCacheProgress;
}

interface NoteSyncOptions {
  slug: string;
  getProtectedSlugs: () => Iterable<string>;
  hasDirtyDraft: () => boolean;
  setCurrentNote: (text: string) => void;
  onComplete: () => void;
}

export interface LearningDataFacade {
  lifecycle: {
    activate: (accountId: string) => Promise<ProgressActivationResult>;
    deactivate: () => void;
    view: () => LearningDataView;
    subscribe: (listener: (view: LearningDataView) => void) => () => void;
    checkRevocations: () => Promise<RevocationProbeResult>;
  };
  progress: {
    readLocal: () => LocalProgress;
    update: (slug: string, completed: boolean, syncRemote: boolean) => LocalProgress;
    activate: (accountId: string) => Promise<ProgressActivationResult>;
    deactivate: () => void;
    getActiveAccountId: () => string | null;
    commit: (slug: string, completed: boolean) => Promise<LocalProgress>;
    subscribe: (listener: (progress: LocalProgress) => void) => () => void;
    syncSignedIn: (
      local: LocalProgress,
      getCurrent?: () => LocalProgress,
      signal?: AbortSignal
    ) => Promise<LocalProgress>;
  };
  notes: {
    maxLength: number;
    readNote: typeof getLocalNote;
    readDraft: (slug: string) => string;
    setDraft: (slug: string, text: string) => void;
    subscribe: (listener: (notes: Record<string, string>) => void) => () => void;
    save: (slug: string, text: string, syncRemote: boolean) => Promise<boolean>;
    clear: (slug: string, previous: string, syncRemote: boolean) => Promise<boolean>;
    startSignedInSync: (options: NoteSyncOptions) => () => void;
    clearDrafts: () => void;
  };
}

function writeLocalProgress(progress: LocalProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_LOCAL_KEY, JSON.stringify(progress));
}

function createProgressFacade(
  dependencies: Partial<ProgressAdapters>,
  accountCache: AccountCacheProgress = createIndexedDbAccountCache(),
  onAccountActivated: (accountId: string) => void = () => {},
  onAccountDeactivated: () => void = () => {}
): LearningDataFacade["progress"] {
  const write = dependencies.writeLocal ?? writeLocalProgress;
  const fetch = dependencies.fetchRemote ?? fetchUserProgress;
  const updateRemote = dependencies.updateRemote ?? updateQuestionProgress;
  // Strict Mode can re-enter the effect before the first sync settles. Keep one
  // run, while the latest consumer owns the merged result and cancellation state.
  type ActiveSync = {
    getCurrent: () => LocalProgress;
    signal?: AbortSignal;
    promise: Promise<LocalProgress>;
  };
  let generation = 0;
  let activeSync: ActiveSync | null = null;
  let accountCacheActive = false;
  let activeAccountId: string | null = null;
  let publicProgress: LocalProgress = {};
  let publicStorage: unknown;

  const publicRead = () => {
    const storage = typeof window === "undefined" ? undefined : window.localStorage;
    if (storage !== publicStorage) {
      publicStorage = storage;
      publicProgress = {};
    }
    return { ...publicProgress };
  };

  return {
    readLocal: () => (accountCacheActive ? accountCache.read().progress : publicRead()),
    update: (slug, completed, syncRemote) => {
      if (accountCacheActive) throw new Error("Use progress.commit for an active Account Cache");
      const next = {
        ...publicRead(),
        [slug]: completed,
      };
      publicProgress = next;
      if (dependencies.writeLocal) write(next);
      if (syncRemote) void updateRemote(slug, completed);
      return next;
    },
    activate: async (accountId) => {
      const result = await accountCache.activate(accountId);
      if (result.ok) {
        accountCacheActive = true;
        activeAccountId = accountId;
        onAccountActivated(accountId);
        if (typeof window !== "undefined") {
          try {
            void accountCache.importLegacy(window.localStorage);
          } catch {
            // A restricted storage context remains usable without migration.
          }
        }
        return { ok: true, accountId, progress: { ...result.snapshot.progress } };
      }
      return {
        ok: false,
        accountId: result.accountId,
        progress: { ...result.snapshot.progress },
        reason: result.reason,
      };
    },
    deactivate: () => {
      accountCacheActive = false;
      activeAccountId = null;
      activeSync = null;
      publicProgress = {};
      publicStorage = undefined;
      accountCache.deactivate();
      onAccountDeactivated();
    },
    getActiveAccountId: () => (accountCacheActive ? activeAccountId : null),
    commit: async (slug, completed) => {
      if (!accountCacheActive) {
        const next = { ...publicRead(), [slug]: completed };
        publicProgress = next;
        if (dependencies.writeLocal) write(next);
        void updateRemote(slug, completed);
        return next;
      }
      const result = await accountCache.commit(slug, completed);
      return result.snapshot.progress;
    },
    subscribe: (listener) => accountCache.subscribe((next) => listener(next.progress)),
    syncSignedIn: (local, getCurrent = () => local, signal) => {
      if (accountCacheActive) return Promise.resolve(accountCache.read().progress);
      const requestGeneration = ++generation;
      if (activeSync) {
        activeSync.getCurrent = getCurrent;
        activeSync.signal = signal;
        return activeSync.promise.then((next) =>
          signal?.aborted || requestGeneration !== generation ? getCurrent() : next
        );
      }

      const state = {} as ActiveSync;
      state.getCurrent = getCurrent;
      state.signal = signal;
      state.promise = (async () => {
        const trueSlugs = Object.keys(local).filter((slug) => local[slug]);
        if (trueSlugs.length) {
          await Promise.all(trueSlugs.map((slug) => updateRemote(slug, true)));
        }
        if (state.signal?.aborted) return state.getCurrent();

        const remote = await fetch();
        if (state.signal?.aborted) return state.getCurrent();

        const next = { ...state.getCurrent() };
        for (const slug of Object.keys(remote)) next[slug] = true;
        if (state.signal?.aborted) return state.getCurrent();
        publicProgress = next;
        if (dependencies.writeLocal) write(next);
        return next;
      })().finally(() => {
        if (activeSync === state) activeSync = null;
      });
      activeSync = state;
      return state.promise.then((next) =>
        signal?.aborted || requestGeneration !== generation ? getCurrent() : next
      );
    },
  };
}

function createNotesFacade(
  dependencies: Partial<NotesAdapters>,
  accountCache: AccountCacheProgress,
  isAccountCacheActive: () => boolean,
  getActiveAccountId: () => string | null
): LearningDataFacade["notes"] {
  const saveAll = dependencies.saveAll ?? saveLocalNotes;
  const saveMeta = dependencies.saveMeta ?? saveLocalNotesMeta;
  const saveTombstones = dependencies.saveTombstones ?? saveLocalNoteTombstones;
  const setLocal = dependencies.setLocal ?? setLocalNote;
  const clearLocal = dependencies.clearLocal ?? clearLocalNote;
  const fetch = dependencies.fetchRemote ?? fetchUserNotes;
  const updateRemote = dependencies.updateRemote ?? updateUserNote;
  const reconcile = dependencies.reconcile ?? reconcileNotes;
  const drafts = new Map<string, Map<string, string>>();
  const publicNotes = new Map<string, string>();
  const publicMeta: NotesMeta = {};
  const publicTombstones: NotesMeta = {};
  let publicStorage: unknown;

  const resetPublicNotesIfStorageChanged = () => {
    const storage = typeof window === "undefined" ? undefined : window.localStorage;
    if (storage !== publicStorage) {
      publicStorage = storage;
      publicNotes.clear();
      Object.keys(publicMeta).forEach((slug) => delete publicMeta[slug]);
      Object.keys(publicTombstones).forEach((slug) => delete publicTombstones[slug]);
    }
  };

  const persistMerged = (settled: NotesReconciliation, options: NoteSyncOptions): void => {
    publicNotes.clear();
    for (const [slug, text] of Object.entries(settled.merged)) publicNotes.set(slug, text);
    Object.keys(publicMeta).forEach((slug) => delete publicMeta[slug]);
    Object.assign(publicMeta, settled.mergedMeta);
    Object.keys(publicTombstones).forEach((slug) => delete publicTombstones[slug]);
    Object.assign(publicTombstones, settled.mergedTombstones);
    saveAll(settled.merged);
    saveMeta(settled.mergedMeta);
    saveTombstones(settled.mergedTombstones);
    if (!options.hasDirtyDraft()) options.setCurrentNote(settled.merged[options.slug] ?? "");
  };

  const startSignedInSync = (options: NoteSyncOptions): (() => void) => {
    if (isAccountCacheActive()) return () => {};
    let cancelled = false;
    let synced = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let slowRetries = 0;
    const maxAttempts = 3;
    const maxSlowRetries = 5;

    const scheduleRetry = (nextAttempt: number) => {
      if (cancelled || synced) return;
      if (nextAttempt > maxAttempts) {
        if (slowRetries >= maxSlowRetries) return;
        slowRetries += 1;
        retryTimer = setTimeout(() => {
          if (!cancelled && !synced) void runSync(1);
        }, 30_000);
        return;
      }
      retryTimer = setTimeout(
        () => {
          if (!cancelled && !synced) void runSync(nextAttempt);
        },
        1000 * (nextAttempt - 1)
      );
    };

    let resultNotes: NotesMap = {};
    let resultUpdatedAt: NotesMeta = {};

    const snapshotLocal = () =>
      reconcile(
        Object.fromEntries(publicNotes),
        publicMeta,
        publicTombstones,
        resultNotes,
        resultUpdatedAt,
        options.getProtectedSlugs()
      );

    const runSync = async (attempt: number): Promise<void> => {
      if (synced || cancelled) return;

      const result: FetchNotesResult = await fetch();
      if (cancelled) return;
      if (!result.ok) {
        scheduleRetry(attempt + 1);
        return;
      }
      resultNotes = result.notes;
      resultUpdatedAt = result.updatedAt;

      const uploaded = new Map<string, string>();
      const maxRounds = 5;
      let roundFailed = false;

      for (let round = 0; round < maxRounds; round++) {
        if (cancelled) return;
        const rec = snapshotLocal();
        const pending = Object.entries(rec.toUpload).filter(
          ([slug, note]) => uploaded.get(slug) !== note
        );

        if (pending.length === 0) {
          persistMerged(rec, options);
          synced = true;
          options.onComplete();
          return;
        }

        const results = await Promise.all(
          pending.map(async ([slug, note]) => {
            const ok = await updateRemote(slug, note);
            return { slug, note, ok };
          })
        );
        if (cancelled) return;

        for (const item of results) {
          if (item.ok) uploaded.set(item.slug, item.note);
          else roundFailed = true;
        }
        persistMerged(snapshotLocal(), options);
      }

      persistMerged(snapshotLocal(), options);
      if (
        roundFailed ||
        Object.entries(snapshotLocal().toUpload).some(([slug, note]) => uploaded.get(slug) !== note)
      ) {
        scheduleRetry(attempt + 1);
        return;
      }
      synced = true;
      options.onComplete();
    };

    void runSync(1);
    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  };

  return {
    maxLength: MAX_NOTE_LENGTH,
    readNote: (slug) => {
      if (isAccountCacheActive()) return accountCache.read().notes[slug] ?? "";
      resetPublicNotesIfStorageChanged();
      return publicNotes.get(slug) ?? "";
    },
    readDraft: (slug) => {
      const accountId = getActiveAccountId();
      return accountId
        ? (drafts.get(accountId)?.get(slug) ?? accountCache.read().notes[slug] ?? "")
        : (resetPublicNotesIfStorageChanged(), publicNotes.get(slug) ?? "");
    },
    setDraft: (slug, text) => {
      const accountId = getActiveAccountId();
      if (!accountId) return;
      const accountDrafts = drafts.get(accountId) ?? new Map<string, string>();
      accountDrafts.set(slug, text);
      drafts.set(accountId, accountDrafts);
    },
    subscribe: (listener) => accountCache.subscribe((next) => listener(next.notes)),
    save: async (slug, text, syncRemote) => {
      if (isAccountCacheActive()) {
        // Empty Save is the explicit delete mutation; preserve all non-empty
        // Unicode text exactly as typed.
        return (
          await (text.length === 0
            ? accountCache.clearNote(slug)
            : accountCache.saveNote(slug, text))
        ).ok;
      }
      resetPublicNotesIfStorageChanged();
      publicNotes.set(slug, text);
      publicMeta[slug] = new Date().toISOString();
      delete publicTombstones[slug];
      setLocal(slug, text);
      return !syncRemote || (await updateRemote(slug, text));
    },
    clear: async (slug, previous, syncRemote) => {
      if (isAccountCacheActive()) return (await accountCache.clearNote(slug)).ok;
      resetPublicNotesIfStorageChanged();
      publicNotes.delete(slug);
      delete publicMeta[slug];
      publicTombstones[slug] = new Date().toISOString();
      clearLocal(slug);
      if (!syncRemote) return true;
      try {
        const ok = await updateRemote(slug, "");
        if (!ok) {
          publicNotes.set(slug, previous);
          setLocal(slug, previous);
        }
        return ok;
      } catch {
        publicNotes.set(slug, previous);
        setLocal(slug, previous);
        return false;
      }
    },
    startSignedInSync,
    clearDrafts: () => {
      drafts.clear();
      publicNotes.clear();
      Object.keys(publicMeta).forEach((slug) => delete publicMeta[slug]);
      Object.keys(publicTombstones).forEach((slug) => delete publicTombstones[slug]);
    },
  };
}

function createLearningDataFacade(dependencies: LearningDataDependencies = {}): LearningDataFacade {
  let activeAccountId: string | null = null;
  let view: LearningDataView = { kind: "public", accountId: null };
  const viewListeners = new Set<(view: LearningDataView) => void>();
  const publishView = (next: LearningDataView) => {
    view = next;
    for (const listener of viewListeners) listener(view);
  };
  const accountCache = dependencies.accountCache ?? createIndexedDbAccountCache();
  const progress = createProgressFacade(
    dependencies.progress ?? {},
    accountCache,
    (accountId) => {
      activeAccountId = accountId;
      publishView({ kind: "active", accountId });
    },
    () => {
      activeAccountId = null;
      publishView({ kind: "public", accountId: null });
    }
  );
  const deactivate = () => {
    progress.deactivate();
    activeAccountId = null;
    publishView({ kind: "public", accountId: null });
    notes.clearDrafts();
  };
  const notes = createNotesFacade(
    dependencies.notes ?? {},
    accountCache,
    () => activeAccountId !== null,
    () => activeAccountId
  );
  const checkRevocations = async (): Promise<RevocationProbeResult> => {
    const result = await checkRetainedAccountRevocations(accountCache);
    if (result.erasedAccountIds.includes(activeAccountId ?? "")) deactivate();
    return result;
  };
  return {
    lifecycle: {
      activate: progress.activate,
      deactivate,
      view: () => view,
      subscribe: (listener) => {
        viewListeners.add(listener);
        return () => viewListeners.delete(listener);
      },
      checkRevocations,
    },
    progress,
    notes,
  };
}

export const learningData = createLearningDataFacade();
