import {
  ACTOR_ID_BYTES,
  addProgress,
  createProblemNoteMutation,
  emptyProgressState,
  applyProblemNoteMutation,
  emptyProblemNoteState,
  joinProgress,
  problemNoteText,
  progressSolvedSlugs,
  removeProgress,
  validateProblemNoteState,
  type ProblemNoteMutation,
  type ProblemNoteState,
  type ProgressState,
} from "../sync/domain";
import {
  Crc32cAccumulator,
  decodeProgressShard,
  decodeSnapshotRecord,
  encodeMutationRecord,
  encodeProblemNoteText,
  type MutationRecord,
} from "../sync/codec";
import {
  committedProblemRegistry,
  isRegisteredProblemSlug,
  type ProblemRegistry,
} from "../problem-registry";

const DATABASE_NAME = "codejeet-account-cache";
// The staged-record store is an additive schema upgrade over the v2 Account
// Cache. Existing generations and overlays remain untouched.
const DATABASE_VERSION = 3;
const META_STORE = "accountMeta";
const GENERATION_STORE = "canonicalGenerations";
const PENDING_STORE = "pendingOverlay";
const MATERIALIZED_STORE = "materializedProgress";
const STAGED_SNAPSHOT_STORE = "stagedSnapshotRecords";
const MAX_SNAPSHOT_STAGE_AGE_MS = 5 * 60 * 1000;
const MAX_UINT64 = BigInt("18446744073709551615");
const LEGACY_IMPORT_VERSION = "codejeet-legacy-import-v1";
const LEGACY_KEYS = [
  "leetcode-checked-items",
  "leetcode-problem-notes",
  "leetcode-problem-notes-meta",
  "leetcode-problem-notes-deleted",
] as const;

type SerializedProgress = {
  adds: Array<{ slug: string; actorId: number[]; counter: string }>;
  causalSummary: Array<[string, string]>;
  removed: Array<[string, Array<[string, string]>]>;
};

type SerializedNoteRecord = {
  slug: string;
  actorId: number[];
  localRevision: string;
  serverRevision: string;
  operation: { kind: "delete" } | { kind: "value"; bytes: number[] };
};

type SerializedNoteState = {
  serverRevision: string;
  notes: SerializedNoteRecord[];
  highestLocalRevisions: Array<[string, Array<[string, string]>]>;
};

type SerializedPendingNote = {
  slug: string;
  actorId: number[];
  localRevision: string;
  operation: { kind: "delete" } | { kind: "value"; bytes: number[] };
};

type AccountMeta = {
  accountId: string;
  activeGenerationId: string;
  actorId: number[];
  nextActorCounter: string;
  localCommitSequence: string;
  revocationHandle?: number[];
  legacyImport?: LegacyImportMarker;
};

type LegacyImportMarker = {
  version: 1;
  status: "pending" | "complete";
  digest: string;
  fingerprints: Record<string, string>;
  mutationIdentity: string;
  progressSlugs: string[];
  notes: Record<string, string>;
};

type LegacyStorage = Pick<Storage, "getItem" | "removeItem">;

type CanonicalGeneration = {
  accountId: string;
  generationId: string;
  /** Server revision is the ordering key. Generation IDs are opaque. */
  serverRevision?: string;
  complete: boolean;
  progress: SerializedProgress;
  notes?: SerializedNoteState;
};

type PendingOverlay = {
  accountId: string;
  generationId: string;
  progress: SerializedProgress;
  notes?: Record<string, SerializedPendingNote>;
};

type MaterializedProgress = {
  accountId: string;
  progress: Record<string, boolean>;
  notes?: Record<string, string>;
  localCommitSequence: string;
};

type MessageChannelLike = {
  onmessage: ((event: MessageEvent<unknown>) => void) | null;
  postMessage: (message: unknown) => void;
  close: () => void;
};

type AccountCacheSnapshot = {
  progress: Record<string, boolean>;
  notes: Record<string, string>;
  localCommitSequence: string;
};

type AccountCacheActivationResult =
  | { ok: true; accountId: string; snapshot: AccountCacheSnapshot }
  | {
      ok: false;
      accountId: string | null;
      snapshot: AccountCacheSnapshot;
      reason: "unavailable" | "invalid" | "stale";
    };

type AccountCacheCommitResult =
  | { ok: true; snapshot: AccountCacheSnapshot }
  | { ok: false; snapshot: AccountCacheSnapshot; reason: "unavailable" | "aborted" };

type AccountCacheImportResult =
  | { ok: true; imported: boolean; snapshot: AccountCacheSnapshot }
  | { ok: false; snapshot: AccountCacheSnapshot; reason: "unavailable" | "aborted" | "stale" };

export type AccountCacheSyncState = {
  accountId: string;
  actorId: Uint8Array;
  revocationHandle: Uint8Array;
  lastServerRevision: bigint;
  causalSummary: ReadonlyMap<string, bigint>;
  pending: readonly MutationRecord[];
};

type AccountCacheCanonicalMutation =
  | { kind: "progress"; state: ProgressState; serverRevision: bigint }
  | {
      kind: "note";
      mutation: ProblemNoteMutation;
      serverRevision: bigint;
    };

type AccountCacheNoteAcknowledgement = {
  slug: string;
  actorId: Uint8Array;
  localRevision: bigint;
  accepted: boolean;
  serverRevision: bigint;
  canonical?: {
    mutation: ProblemNoteMutation;
    serverRevision: bigint;
  };
};

export type SnapshotStageCounts = {
  actorCount: number;
  progressShardCount: number;
  problemNoteCount: number;
  chunkCount: number;
  totalLength: bigint;
  checksum: number;
  receivedChunkCount?: number;
};

export interface AccountCacheProgress {
  activate: (accountId: string) => Promise<AccountCacheActivationResult>;
  deactivate: () => void;
  eraseAccount: (accountId?: string) => Promise<boolean>;
  listRevocationHandles: () => Promise<Array<{ accountId: string; revocationHandle: Uint8Array }>>;
  read: () => AccountCacheSnapshot;
  commit: (slug: string, completed: boolean) => Promise<AccountCacheCommitResult>;
  saveNote: (slug: string, text: string) => Promise<AccountCacheCommitResult>;
  clearNote: (slug: string) => Promise<AccountCacheCommitResult>;
  importLegacy: (storage: LegacyStorage) => Promise<AccountCacheImportResult>;
  replaceCanonical: (
    generationId: string,
    canonical: ProgressState,
    notes?: ProblemNoteState,
    serverRevision?: bigint
  ) => Promise<AccountCacheSnapshot>;
  exportSyncState: () => Promise<AccountCacheSyncState | null>;
  applyCanonicalMutation: (
    mutation: AccountCacheCanonicalMutation
  ) => Promise<AccountCacheSnapshot>;
  acknowledgeProgress: (delta: ProgressState) => Promise<AccountCacheSnapshot>;
  acknowledgeNote: (
    acknowledgement: AccountCacheNoteAcknowledgement
  ) => Promise<AccountCacheSnapshot>;
  beginSnapshotStage: (generationId: string, serverRevision: bigint) => Promise<boolean>;
  writeSnapshotRecord: (
    generationId: string,
    index: number,
    encoded: Uint8Array
  ) => Promise<boolean>;
  writeSnapshotChunk: (
    generationId: string,
    chunkIndex: number,
    encodedRecords: readonly Uint8Array[]
  ) => Promise<boolean>;
  finishSnapshotStage: (
    generationId: string,
    counts: SnapshotStageCounts
  ) => Promise<AccountCacheSnapshot | null>;
  reload: () => Promise<AccountCacheSnapshot>;
  subscribe: (listener: (snapshot: AccountCacheSnapshot) => void) => () => void;
  close: () => void;
}

/** Environment injection is deliberately kept below the Learning Data facade. */
export type AccountCacheOptions = {
  databaseName?: string;
  indexedDB?: IDBFactory;
  channelFactory?: (name: string) => MessageChannelLike;
  randomBytes?: () => Uint8Array;
  randomHandleBytes?: () => Uint8Array;
  registry?: ProblemRegistry;
  /** @internal test-only transaction fault hook. */
  beforeCommit?: (transaction: IDBTransaction) => void;
};

class CacheUnavailable extends Error {}

function request<T>(value: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    value.onsuccess = () => resolve(value.result);
    value.onerror = () => reject(value.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("IndexedDB transaction failed"));
  });
}

function deleteAccountRecords(store: IDBObjectStore, accountId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cursorRequest = store.openCursor();
    cursorRequest.onerror = () => reject(cursorRequest.error ?? new Error("cursor failed"));
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        resolve();
        return;
      }
      const key = cursor.key;
      const owner = Array.isArray(key) ? key[0] : key;
      if (owner === accountId) cursor.delete();
      cursor.continue();
    };
  });
}

function concatBytes(parts: readonly Uint8Array[]): Uint8Array {
  const result = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

function lengthDelimited(...parts: readonly Uint8Array[]): Uint8Array {
  return concatBytes(
    parts.flatMap((part) => {
      const length = new Uint8Array(4);
      new DataView(length.buffer).setUint32(0, part.length);
      return [length, part];
    })
  );
}

async function sha256(value: Uint8Array): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new CacheUnavailable("SHA-256 is unavailable");
  const digest = await subtle.digest("SHA-256", value as unknown as BufferSource);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

type LegacyCapture = {
  values: Record<(typeof LEGACY_KEYS)[number], string | null>;
  fingerprints: Record<string, string>;
  digest: string;
};

async function captureLegacy(storage: LegacyStorage): Promise<LegacyCapture> {
  const values = Object.fromEntries(
    LEGACY_KEYS.map((key) => [key, storage.getItem(key)])
  ) as LegacyCapture["values"];
  const version = new TextEncoder().encode(LEGACY_IMPORT_VERSION);
  const fingerprints: Record<string, string> = {};
  const frames: Uint8Array[] = [];
  for (const key of LEGACY_KEYS) {
    const keyBytes = new TextEncoder().encode(key);
    const value = values[key];
    const frame = lengthDelimited(
      version,
      keyBytes,
      new Uint8Array([value === null ? 0 : 1]),
      new TextEncoder().encode(value ?? "")
    );
    fingerprints[key] = await sha256(frame);
    frames.push(frame);
  }
  return { values, fingerprints, digest: await sha256(concatBytes(frames)) };
}

async function removeLegacyMatches(
  storage: LegacyStorage,
  fingerprints: Record<string, string>
): Promise<void> {
  const version = new TextEncoder().encode(LEGACY_IMPORT_VERSION);
  for (const key of LEGACY_KEYS) {
    const value = storage.getItem(key);
    if (value === null) continue;
    const frame = lengthDelimited(
      version,
      new TextEncoder().encode(key),
      new Uint8Array([1]),
      new TextEncoder().encode(value)
    );
    if (fingerprints[key] === (await sha256(frame))) storage.removeItem(key);
  }
}

function parseLegacyProgress(raw: string | null, registry: ProblemRegistry): string[] {
  if (raw === null) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    return Object.entries(value)
      .filter(([slug, completed]) => completed === true && isRegisteredProblemSlug(registry, slug))
      .map(([slug]) => slug)
      .sort();
  } catch {
    return [];
  }
}

function parseLegacyNotes(raw: string | null, registry: ProblemRegistry): Record<string, string> {
  if (raw === null) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value)
        .filter(([slug, text]) => {
          if (!isRegisteredProblemSlug(registry, slug) || typeof text !== "string" || text === "") {
            return false;
          }
          try {
            encodeProblemNoteText(text);
            return true;
          } catch {
            return false;
          }
        })
        .sort(([left], [right]) => left.localeCompare(right))
    );
  } catch {
    return {};
  }
}

function isLegacyImportMarker(value: unknown): value is LegacyImportMarker {
  if (!value || typeof value !== "object") return false;
  const marker = value as Partial<LegacyImportMarker>;
  return (
    marker.version === 1 &&
    (marker.status === "pending" || marker.status === "complete") &&
    typeof marker.digest === "string" &&
    typeof marker.mutationIdentity === "string" &&
    Array.isArray(marker.progressSlugs) &&
    marker.progressSlugs.every((slug) => typeof slug === "string") &&
    !!marker.notes &&
    typeof marker.notes === "object" &&
    Object.values(marker.notes).every((text) => typeof text === "string") &&
    !!marker.fingerprints &&
    typeof marker.fingerprints === "object" &&
    LEGACY_KEYS.every((key) => typeof marker.fingerprints?.[key] === "string")
  );
}

function cloneSnapshot(snapshot: AccountCacheSnapshot): AccountCacheSnapshot {
  return {
    progress: { ...snapshot.progress },
    notes: { ...snapshot.notes },
    localCommitSequence: snapshot.localCommitSequence,
  };
}

function assertAccountId(value: unknown, accountId: string): void {
  if (
    !value ||
    typeof value !== "object" ||
    !("accountId" in value) ||
    typeof value.accountId !== "string" ||
    value.accountId !== accountId
  ) {
    throw new CacheUnavailable("Account Cache record belongs to another account");
  }
}

function serializeProgress(state: ProgressState): SerializedProgress {
  return {
    adds: state.adds.map(({ slug, dot }) => ({
      slug,
      actorId: Array.from(dot.actorId),
      counter: dot.counter.toString(),
    })),
    causalSummary: Array.from(state.causalSummary.entries()).map(([actor, counter]) => [
      actor,
      counter.toString(),
    ]),
    removed: Array.from(state.removed.entries()).map(([slug, summary]) => [
      slug,
      Array.from(summary.entries()).map(([actor, counter]) => [actor, counter.toString()]),
    ]),
  };
}

function deserializeProgress(value: SerializedProgress): ProgressState {
  if (
    !value ||
    !Array.isArray(value.adds) ||
    !Array.isArray(value.causalSummary) ||
    !Array.isArray(value.removed)
  ) {
    throw new CacheUnavailable("invalid Progress state");
  }
  try {
    return {
      adds: value.adds.map((add) => ({
        slug: add.slug,
        dot: { actorId: Uint8Array.from(add.actorId), counter: BigInt(add.counter) },
      })),
      causalSummary: new Map(
        value.causalSummary.map(([actor, counter]) => [actor, BigInt(counter)])
      ),
      removed: new Map(
        value.removed.map(([slug, summary]) => [
          slug,
          new Map(summary.map(([actor, counter]) => [actor, BigInt(counter)])),
        ])
      ),
    };
  } catch {
    throw new CacheUnavailable("invalid serialized Progress state");
  }
}

function serializeOperation(
  operation: ProblemNoteMutation["operation"]
): SerializedPendingNote["operation"] {
  return operation.kind === "delete"
    ? { kind: "delete" }
    : { kind: "value", bytes: Array.from(operation.bytes) };
}

function deserializeOperation(
  operation: SerializedPendingNote["operation"]
): ProblemNoteMutation["operation"] {
  if (operation?.kind === "delete") return { kind: "delete" };
  if (operation?.kind === "value" && Array.isArray(operation.bytes)) {
    return { kind: "value", bytes: Uint8Array.from(operation.bytes) };
  }
  throw new CacheUnavailable("invalid Problem Note operation");
}

function serializeNotes(state: ProblemNoteState): SerializedNoteState {
  return {
    serverRevision: state.serverRevision.toString(),
    notes: Array.from(state.notes.values()).map((record) => ({
      slug: record.slug,
      actorId: Array.from(record.actorId),
      localRevision: record.localRevision.toString(),
      serverRevision: record.serverRevision.toString(),
      operation: serializeOperation(record.operation),
    })),
    highestLocalRevisions: Array.from(state.highestLocalRevisions.entries()).map(
      ([slug, summary]) => [
        slug,
        Array.from(summary.entries()).map(([actor, counter]) => [actor, counter.toString()]),
      ]
    ),
  };
}

function deserializeNotes(value: SerializedNoteState | undefined): ProblemNoteState {
  if (!value) return emptyProblemNoteState();
  try {
    return {
      serverRevision: BigInt(value.serverRevision),
      notes: new Map(
        value.notes.map((record) => [
          record.slug,
          {
            slug: record.slug,
            actorId: Uint8Array.from(record.actorId),
            localRevision: BigInt(record.localRevision),
            serverRevision: BigInt(record.serverRevision),
            operation: deserializeOperation(record.operation),
          },
        ])
      ),
      highestLocalRevisions: new Map(
        value.highestLocalRevisions.map(([slug, summary]) => [
          slug,
          new Map(summary.map(([actor, counter]) => [actor, BigInt(counter)])),
        ])
      ),
    };
  } catch {
    throw new CacheUnavailable("invalid serialized Problem Note state");
  }
}

function serializePendingNotes(
  notes: Record<string, SerializedPendingNote>
): Record<string, SerializedPendingNote> {
  return Object.fromEntries(
    Object.entries(notes).map(([slug, note]) => [
      slug,
      { ...note, operation: { ...note.operation } },
    ])
  );
}

function pendingNoteRecord(note: SerializedPendingNote): ProblemNoteMutation {
  return {
    slug: note.slug,
    actorId: Uint8Array.from(note.actorId),
    localRevision: BigInt(note.localRevision),
    operation: deserializeOperation(note.operation),
  };
}

function serializePendingNote(mutation: ProblemNoteMutation): SerializedPendingNote {
  return {
    slug: mutation.slug,
    actorId: Array.from(mutation.actorId as Uint8Array),
    localRevision: mutation.localRevision.toString(),
    operation: serializeOperation(mutation.operation),
  };
}

function materializeNotes(
  canonical: ProblemNoteState,
  pending: Record<string, SerializedPendingNote>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [slug, record] of canonical.notes) result[slug] = problemNoteText(record);
  for (const [slug, pendingNote] of Object.entries(pending)) {
    const mutation = pendingNoteRecord(pendingNote);
    result[slug] = problemNoteText({
      slug,
      actorId: mutation.actorId as Uint8Array,
      localRevision: mutation.localRevision,
      serverRevision: BigInt(0),
      operation: mutation.operation,
    });
  }
  return result;
}

function rebasePendingNotes(
  canonical: ProblemNoteState,
  pending: Record<string, SerializedPendingNote>
): Record<string, SerializedPendingNote> {
  return Object.fromEntries(
    Object.entries(pending).filter(([slug, note]) => {
      const actor = Array.from(note.actorId, (byte) => byte.toString(16).padStart(2, "0")).join("");
      const accepted = canonical.highestLocalRevisions.get(slug)?.get(actor);
      return accepted === undefined || BigInt(note.localRevision) > accepted;
    })
  );
}

function validatePendingNotes(
  pending: Record<string, SerializedPendingNote>,
  registry: ProblemRegistry
): Record<string, SerializedPendingNote> {
  for (const [slug, note] of Object.entries(pending)) {
    if (slug !== note.slug) throw new CacheUnavailable("Problem Note key mismatch");
    const mutation = pendingNoteRecord(note);
    const text =
      mutation.operation.kind === "delete"
        ? null
        : problemNoteText({
            slug,
            actorId: mutation.actorId as Uint8Array,
            localRevision: mutation.localRevision,
            serverRevision: BigInt(0),
            operation: mutation.operation,
          });
    createProblemNoteMutation(registry, mutation.actorId, mutation.localRevision, slug, text);
  }
  return pending;
}

function randomActor(randomBytes: () => Uint8Array): Uint8Array {
  const actor = randomBytes();
  if (actor.length !== ACTOR_ID_BYTES) throw new CacheUnavailable("invalid Actor metadata");
  return actor.slice();
}

function defaultRandomBytes(): Uint8Array {
  const result = new Uint8Array(ACTOR_ID_BYTES);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(result);
    return result;
  }
  throw new CacheUnavailable("secure random Actor metadata is unavailable");
}

function defaultRandomHandleBytes(): Uint8Array {
  const result = new Uint8Array(32);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(result);
    return result;
  }
  throw new CacheUnavailable("secure random Revocation Handle is unavailable");
}

function defaultChannelFactory(name: string): MessageChannelLike | undefined {
  if (typeof BroadcastChannel === "undefined") return undefined;
  return new BroadcastChannel(name);
}

function validateCanonical(state: ProgressState, registry: ProblemRegistry): ProgressState {
  return joinProgress(emptyProgressState(), state, registry);
}

function materialize(canonical: ProgressState, pending: ProgressState, registry: ProblemRegistry) {
  return Object.fromEntries(
    progressSolvedSlugs(joinProgress(canonical, pending, registry)).map((slug) => [slug, true])
  );
}

function withoutCanonicalAdds(state: ProgressState, canonical: ProgressState): ProgressState {
  const canonicalDots = new Set(
    canonical.adds.map(
      ({ dot }) => `${Array.from(dot.actorId).join(",")}:${dot.counter.toString()}`
    )
  );
  return {
    ...state,
    adds: state.adds.filter(
      ({ dot }) =>
        !canonicalDots.has(`${Array.from(dot.actorId).join(",")}:${dot.counter.toString()}`)
    ),
  };
}

function subtractCanonicalOverlay(state: ProgressState, canonical: ProgressState): ProgressState {
  const canonicalDots = new Set(
    canonical.adds.map(
      ({ dot }) => `${Array.from(dot.actorId).join(",")}:${dot.counter.toString()}`
    )
  );
  const adds = state.adds.filter(({ slug, dot }) => {
    const key = `${Array.from(dot.actorId).join(",")}:${dot.counter.toString()}`;
    const removedCounter = canonical.removed.get(slug)?.get(
      Array.from(dot.actorId)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    );
    return (
      !canonicalDots.has(key) && (removedCounter === undefined || removedCounter < dot.counter)
    );
  });
  const removed = new Map<string, Map<string, bigint>>();
  for (const [slug, summary] of state.removed) {
    const canonicalSummary = canonical.removed.get(slug);
    const remaining = new Map(
      Array.from(summary.entries()).filter(
        ([actor, counter]) =>
          canonicalSummary?.get(actor) === undefined ||
          counter > (canonicalSummary.get(actor) as bigint)
      )
    );
    if (remaining.size) removed.set(slug, remaining);
  }
  const causalSummary = new Map(
    Array.from(state.causalSummary.entries()).filter(
      ([actor, counter]) =>
        canonical.causalSummary.get(actor) === undefined ||
        counter > (canonical.causalSummary.get(actor) as bigint)
    )
  );
  return { adds, causalSummary, removed };
}

function reconcileActorCounter(
  meta: AccountMeta,
  canonical: ProgressState,
  pending: ProgressState,
  registry: ProblemRegistry
): string {
  const actor = Uint8Array.from(meta.actorId);
  if (actor.length !== ACTOR_ID_BYTES) throw new CacheUnavailable("invalid Actor metadata");
  const joined = joinProgress(canonical, pending, registry);
  const key = Array.from(actor, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const observed = joined.causalSummary.get(key);
  if (observed === MAX_UINT64) throw new CacheUnavailable("Actor counter exhausted");
  const expected = observed === undefined ? BigInt(0) : observed + BigInt(1);
  const stored = BigInt(meta.nextActorCounter);
  if (stored > expected) throw new CacheUnavailable("Actor counter is ahead of causal state");
  return expected.toString();
}

function actorFromKey(key: string): Uint8Array {
  if (!/^[0-9a-f]{32}$/.test(key)) throw new CacheUnavailable("invalid Actor metadata");
  return Uint8Array.from(key.match(/../g) ?? [], (part) => Number.parseInt(part, 16));
}

function asUint8Array(value: Uint8Array | ArrayBuffer): Uint8Array {
  return value instanceof Uint8Array ? value : new Uint8Array(value);
}

function pendingMutationRecords(
  progress: ProgressState,
  notes: Record<string, SerializedPendingNote>
) {
  const records: MutationRecord[] = [];
  if (progress.adds.length || progress.causalSummary.size || progress.removed.size) {
    records.push({
      kind: "progress-delta",
      adds: progress.adds.map(({ slug, dot }) => ({
        slug,
        actorId: dot.actorId,
        counter: dot.counter,
      })),
      causalSummary: Array.from(progress.causalSummary.entries()).map(([actor, counter]) => ({
        actorId: actorFromKey(actor),
        counter,
      })),
      removed: Array.from(progress.removed.entries()).map(([slug, summary]) => ({
        slug,
        summary: Array.from(summary.entries()).map(([actor, counter]) => ({
          actorId: actorFromKey(actor),
          counter,
        })),
      })),
    });
  }
  for (const note of Object.values(notes)) {
    const mutation = pendingNoteRecord(note);
    records.push({
      kind: "note",
      slug: mutation.slug,
      actorId: mutation.actorId,
      localRevision: mutation.localRevision,
      operation: mutation.operation,
    });
  }
  return records.sort((left, right) => {
    const leftBytes = encodeMutationRecord(left);
    const rightBytes = encodeMutationRecord(right);
    const length = Math.min(leftBytes.length, rightBytes.length);
    for (let index = 0; index < length; index++) {
      if (leftBytes[index] !== rightBytes[index]) return leftBytes[index] - rightBytes[index];
    }
    return leftBytes.length - rightBytes.length;
  });
}

export function createIndexedDbAccountCache(
  options: AccountCacheOptions = {}
): AccountCacheProgress {
  const registry = options.registry ?? committedProblemRegistry;
  const databaseName = options.databaseName ?? DATABASE_NAME;
  const idb = options.indexedDB ?? (typeof indexedDB === "undefined" ? undefined : indexedDB);
  const randomBytes = options.randomBytes ?? defaultRandomBytes;
  const randomHandleBytes = options.randomHandleBytes ?? defaultRandomHandleBytes;
  const channelFactory = options.channelFactory ?? defaultChannelFactory;
  const listeners = new Set<(snapshot: AccountCacheSnapshot) => void>();
  let database: IDBDatabase | null = null;
  let channel: MessageChannelLike | undefined;
  let accountId: string | null = null;
  let snapshot: AccountCacheSnapshot = { progress: {}, notes: {}, localCommitSequence: "0" };
  let closed = false;
  let activationVersion = 0;

  const unavailable = () => cloneSnapshot(snapshot);

  const open = (): Promise<IDBDatabase> => {
    if (!idb) return Promise.reject(new CacheUnavailable("IndexedDB is unavailable"));
    return new Promise((resolve, reject) => {
      const opening = idb.open(databaseName, DATABASE_VERSION);
      opening.onupgradeneeded = () => {
        const db = opening.result;
        if (!db.objectStoreNames.contains(META_STORE))
          db.createObjectStore(META_STORE, { keyPath: "accountId" });
        if (!db.objectStoreNames.contains(GENERATION_STORE)) {
          db.createObjectStore(GENERATION_STORE, { keyPath: ["accountId", "generationId"] });
        }
        if (!db.objectStoreNames.contains(PENDING_STORE))
          db.createObjectStore(PENDING_STORE, { keyPath: "accountId" });
        if (!db.objectStoreNames.contains(MATERIALIZED_STORE)) {
          db.createObjectStore(MATERIALIZED_STORE, { keyPath: "accountId" });
        }
        if (!db.objectStoreNames.contains(STAGED_SNAPSHOT_STORE)) {
          db.createObjectStore(STAGED_SNAPSHOT_STORE, {
            keyPath: ["accountId", "generationId", "index"],
          });
        }
      };
      opening.onsuccess = () => resolve(opening.result);
      opening.onerror = () =>
        reject(opening.error ?? new CacheUnavailable("IndexedDB open failed"));
      opening.onblocked = () => reject(new CacheUnavailable("IndexedDB open blocked"));
    });
  };

  const notify = () => {
    const next = cloneSnapshot(snapshot);
    for (const listener of listeners) listener(next);
  };

  const readFromDatabase = async (
    targetAccountId: string,
    targetDatabase: IDBDatabase
  ): Promise<AccountCacheSnapshot> => {
    const tx = targetDatabase.transaction(
      [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
      "readonly"
    );
    const metaRequest = tx.objectStore(META_STORE).get(targetAccountId);
    const meta = (await request(metaRequest)) as AccountMeta | undefined;
    if (!meta) throw new CacheUnavailable("missing Account metadata");
    assertAccountId(meta, targetAccountId);
    const generation = (await request(
      tx.objectStore(GENERATION_STORE).get([targetAccountId, meta.activeGenerationId])
    )) as CanonicalGeneration | undefined;
    if (generation) assertAccountId(generation, targetAccountId);
    const pending = (await request(tx.objectStore(PENDING_STORE).get(targetAccountId))) as
      | PendingOverlay
      | undefined;
    if (pending) assertAccountId(pending, targetAccountId);
    const materialized = (await request(tx.objectStore(MATERIALIZED_STORE).get(targetAccountId))) as
      | MaterializedProgress
      | undefined;
    if (materialized) assertAccountId(materialized, targetAccountId);
    if (
      !generation?.complete ||
      !pending ||
      pending.generationId !== generation.generationId ||
      !materialized
    ) {
      throw new CacheUnavailable("incomplete active Account Cache generation");
    }
    const generationServerRevision = BigInt(generation.serverRevision ?? "0");
    if (generationServerRevision < BigInt(0) || generationServerRevision > MAX_UINT64) {
      throw new CacheUnavailable("invalid canonical server revision");
    }
    const canonical = validateCanonical(deserializeProgress(generation.progress), registry);
    const overlay = validateCanonical(deserializeProgress(pending.progress), registry);
    const canonicalNotes = validateProblemNoteState(deserializeNotes(generation.notes), registry);
    if (canonicalNotes.serverRevision > generationServerRevision) {
      throw new CacheUnavailable("Problem Note revision exceeds canonical generation");
    }
    const pendingNotes = validatePendingNotes(pending.notes ?? {}, registry);
    const expected = materialize(canonical, overlay, registry);
    const expectedNotes = materializeNotes(canonicalNotes, pendingNotes);
    if (
      JSON.stringify(expected) !== JSON.stringify(materialized.progress) ||
      JSON.stringify(expectedNotes) !== JSON.stringify(materialized.notes ?? {})
    ) {
      throw new CacheUnavailable("materialized Progress does not match Account Cache state");
    }
    return {
      progress: expected,
      notes: expectedNotes,
      localCommitSequence: materialized.localCommitSequence,
    };
  };

  const reload = async (): Promise<AccountCacheSnapshot> => {
    if (closed || !database || !accountId) return unavailable();
    try {
      snapshot = await readFromDatabase(accountId, database);
      notify();
    } catch {
      snapshot = { progress: {}, notes: {}, localCommitSequence: "0" };
    }
    return cloneSnapshot(snapshot);
  };

  const ensureAccount = async (
    targetDatabase: IDBDatabase,
    targetAccountId: string
  ): Promise<void> => {
    const tx = targetDatabase.transaction(
      [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
      "readwrite"
    );
    const existing = (await request(tx.objectStore(META_STORE).get(targetAccountId))) as
      | AccountMeta
      | undefined;
    if (existing) {
      assertAccountId(existing, targetAccountId);
      if (!Array.isArray(existing.revocationHandle) || existing.revocationHandle.length !== 32) {
        tx.objectStore(META_STORE).put({
          ...existing,
          revocationHandle: Array.from(randomHandleBytes()),
        } satisfies AccountMeta);
      }
    }
    if (!existing) {
      const generation: CanonicalGeneration = {
        accountId: targetAccountId,
        generationId: "0",
        serverRevision: "0",
        complete: true,
        progress: serializeProgress(emptyProgressState()),
        notes: serializeNotes(emptyProblemNoteState()),
      };
      const pending: PendingOverlay = {
        accountId: targetAccountId,
        generationId: generation.generationId,
        progress: serializeProgress(emptyProgressState()),
        notes: {},
      };
      const meta: AccountMeta = {
        accountId: targetAccountId,
        activeGenerationId: generation.generationId,
        actorId: Array.from(randomActor(randomBytes)),
        revocationHandle: Array.from(randomHandleBytes()),
        nextActorCounter: "0",
        localCommitSequence: "0",
      };
      tx.objectStore(META_STORE).put(meta);
      tx.objectStore(GENERATION_STORE).put(generation);
      tx.objectStore(PENDING_STORE).put(pending);
      tx.objectStore(MATERIALIZED_STORE).put({
        accountId: targetAccountId,
        progress: {},
        notes: {},
        localCommitSequence: "0",
      } satisfies MaterializedProgress);
    }
    await transactionDone(tx);
  };

  const activate = async (nextAccountId: string): Promise<AccountCacheActivationResult> => {
    const requestVersion = ++activationVersion;
    if (closed || !nextAccountId)
      return { ok: false, accountId, snapshot: unavailable(), reason: "unavailable" };
    try {
      const targetDatabase = database ?? (await open());
      if (!database) database = targetDatabase;
      else if (database !== targetDatabase) targetDatabase.close();
      await ensureAccount(database, nextAccountId);
      const targetSnapshot = await readFromDatabase(nextAccountId, database);
      if (requestVersion !== activationVersion || closed) {
        return { ok: false, accountId, snapshot: unavailable(), reason: "stale" };
      }
      const previousChannel = channel;
      accountId = nextAccountId;
      snapshot = targetSnapshot;
      channel = channelFactory(nextAccountId);
      if (channel) {
        channel.onmessage = (event) => {
          const message = event.data as { accountId?: unknown; erased?: unknown };
          if (message?.accountId !== accountId) return;
          if (message.erased === true) {
            activationVersion += 1;
            accountId = null;
            snapshot = { progress: {}, notes: {}, localCommitSequence: "0" };
            channel?.close();
            channel = undefined;
            notify();
            return;
          }
          void reload();
        };
      }
      previousChannel?.close();
      notify();
      return { ok: true, accountId: nextAccountId, snapshot: cloneSnapshot(snapshot) };
    } catch {
      if (requestVersion !== activationVersion || closed) {
        return { ok: false, accountId, snapshot: unavailable(), reason: "stale" };
      }
      return { ok: false, accountId, snapshot: unavailable(), reason: "invalid" };
    }
  };

  const commit = async (slug: string, completed: boolean): Promise<AccountCacheCommitResult> => {
    const requestVersion = activationVersion;
    const previous = cloneSnapshot(snapshot);
    if (closed || !database || !accountId)
      return { ok: false, snapshot: previous, reason: "unavailable" };
    try {
      const tx = database.transaction(
        [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
        "readwrite"
      );
      const metaRequest = tx.objectStore(META_STORE).get(accountId);
      const meta = (await request(metaRequest)) as AccountMeta | undefined;
      if (!meta) throw new CacheUnavailable("missing Account metadata");
      assertAccountId(meta, accountId);
      const generation = (await request(
        tx.objectStore(GENERATION_STORE).get([accountId, meta.activeGenerationId])
      )) as CanonicalGeneration | undefined;
      if (generation) assertAccountId(generation, accountId);
      const pending = (await request(tx.objectStore(PENDING_STORE).get(accountId))) as
        | PendingOverlay
        | undefined;
      if (pending) assertAccountId(pending, accountId);
      const materialized = (await request(tx.objectStore(MATERIALIZED_STORE).get(accountId))) as
        | MaterializedProgress
        | undefined;
      if (materialized) assertAccountId(materialized, accountId);
      if (
        !generation?.complete ||
        !pending ||
        pending.generationId !== generation.generationId ||
        !materialized
      ) {
        throw new CacheUnavailable("incomplete active Account Cache generation");
      }
      const canonical = validateCanonical(deserializeProgress(generation.progress), registry);
      const overlay = validateCanonical(deserializeProgress(pending.progress), registry);
      const canonicalNotes = validateProblemNoteState(deserializeNotes(generation.notes), registry);
      const pendingNotes = validatePendingNotes(pending.notes ?? {}, registry);
      const expectedNotes = materializeNotes(canonicalNotes, pendingNotes);
      if (JSON.stringify(expectedNotes) !== JSON.stringify(materialized.notes ?? {})) {
        throw new CacheUnavailable("materialized Problem Notes do not match Account Cache state");
      }
      const counter = BigInt(meta.nextActorCounter);
      const actor = Uint8Array.from(meta.actorId);
      const expectedCounter = BigInt(reconcileActorCounter(meta, canonical, overlay, registry));
      if (counter > expectedCounter)
        throw new CacheUnavailable("Actor counter is ahead of causal state");
      const nextCounter = expectedCounter;
      const visible = joinProgress(canonical, overlay, registry);
      const nextVisible = completed
        ? addProgress(visible, registry, actor, nextCounter, slug)
        : removeProgress(visible, registry, actor, nextCounter, slug);
      const nextOverlay = withoutCanonicalAdds(nextVisible, canonical);
      const nextSequence = BigInt(meta.localCommitSequence) + BigInt(1);
      if (nextSequence > MAX_UINT64) throw new CacheUnavailable("commit sequence exhausted");
      tx.objectStore(PENDING_STORE).put({
        ...pending,
        progress: serializeProgress(nextOverlay),
      } satisfies PendingOverlay);
      tx.objectStore(MATERIALIZED_STORE).put({
        ...materialized,
        accountId,
        progress: materialize(canonical, nextOverlay, registry),
        notes: expectedNotes,
        localCommitSequence: nextSequence.toString(),
      } satisfies MaterializedProgress);
      tx.objectStore(META_STORE).put({
        ...meta,
        nextActorCounter: (nextCounter === MAX_UINT64
          ? MAX_UINT64
          : nextCounter + BigInt(1)
        ).toString(),
        localCommitSequence: nextSequence.toString(),
      } satisfies AccountMeta);
      options.beforeCommit?.(tx);
      await transactionDone(tx);
      if (requestVersion !== activationVersion || accountId === null)
        return { ok: false, snapshot: cloneSnapshot(snapshot), reason: "unavailable" };
      snapshot = await readFromDatabase(accountId, database);
      notify();
      channel?.postMessage({
        accountId,
        affectedKeys: [slug],
        localCommitSequence: snapshot.localCommitSequence,
      });
      return { ok: true, snapshot: cloneSnapshot(snapshot) };
    } catch (error) {
      return {
        ok: false,
        snapshot: previous,
        reason: error instanceof CacheUnavailable ? "unavailable" : "aborted",
      };
    }
  };

  const commitNote = async (
    slug: string,
    text: string | null
  ): Promise<AccountCacheCommitResult> => {
    const requestVersion = activationVersion;
    const targetAccountId = accountId;
    const previous = cloneSnapshot(snapshot);
    if (closed || !database || !targetAccountId)
      return { ok: false, snapshot: previous, reason: "unavailable" };
    try {
      const tx = database.transaction(
        [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
        "readwrite"
      );
      const meta = (await request(tx.objectStore(META_STORE).get(targetAccountId))) as
        | AccountMeta
        | undefined;
      if (!meta) throw new CacheUnavailable("missing Account metadata");
      assertAccountId(meta, targetAccountId);
      const generation = (await request(
        tx.objectStore(GENERATION_STORE).get([targetAccountId, meta.activeGenerationId])
      )) as CanonicalGeneration | undefined;
      if (generation) assertAccountId(generation, targetAccountId);
      const pending = (await request(tx.objectStore(PENDING_STORE).get(targetAccountId))) as
        | PendingOverlay
        | undefined;
      if (pending) assertAccountId(pending, targetAccountId);
      const materialized = (await request(
        tx.objectStore(MATERIALIZED_STORE).get(targetAccountId)
      )) as MaterializedProgress | undefined;
      if (materialized) assertAccountId(materialized, targetAccountId);
      if (
        !generation?.complete ||
        !pending ||
        pending.generationId !== generation.generationId ||
        !materialized
      ) {
        throw new CacheUnavailable("incomplete active Account Cache generation");
      }
      const canonicalNotes = validateProblemNoteState(deserializeNotes(generation.notes), registry);
      const pendingNotes = validatePendingNotes(pending.notes ?? {}, registry);
      const actor = Uint8Array.from(meta.actorId);
      if (actor.length !== ACTOR_ID_BYTES) throw new CacheUnavailable("invalid Actor metadata");
      const actorKey = Array.from(actor, (byte) => byte.toString(16).padStart(2, "0")).join("");
      const canonicalRevision = canonicalNotes.highestLocalRevisions.get(slug)?.get(actorKey);
      const pendingRevision = pendingNotes[slug]
        ? BigInt(pendingNotes[slug].localRevision)
        : undefined;
      const highest = [canonicalRevision, pendingRevision].filter(
        (revision): revision is bigint => revision !== undefined
      );
      const lastRevision = highest.length
        ? highest.reduce((left, right) => (left > right ? left : right))
        : undefined;
      if (lastRevision === MAX_UINT64)
        throw new CacheUnavailable("Problem Note revision exhausted");
      const localRevision = lastRevision === undefined ? BigInt(0) : lastRevision + BigInt(1);
      const mutation = createProblemNoteMutation(registry, actor, localRevision, slug, text);
      const nextPendingNotes = serializePendingNotes({
        ...pendingNotes,
        [slug]: serializePendingNote(mutation),
      });
      const nextSequence = BigInt(meta.localCommitSequence) + BigInt(1);
      if (nextSequence > MAX_UINT64) throw new CacheUnavailable("commit sequence exhausted");
      tx.objectStore(PENDING_STORE).put({ ...pending, notes: nextPendingNotes });
      tx.objectStore(MATERIALIZED_STORE).put({
        ...materialized,
        notes: materializeNotes(canonicalNotes, nextPendingNotes),
        localCommitSequence: nextSequence.toString(),
      } satisfies MaterializedProgress);
      tx.objectStore(META_STORE).put({
        ...meta,
        localCommitSequence: nextSequence.toString(),
      });
      options.beforeCommit?.(tx);
      await transactionDone(tx);
      if (requestVersion !== activationVersion || accountId !== targetAccountId)
        return { ok: false, snapshot: cloneSnapshot(snapshot), reason: "unavailable" };
      snapshot = await readFromDatabase(targetAccountId, database);
      notify();
      channel?.postMessage({
        accountId,
        affectedKeys: [slug],
        localCommitSequence: snapshot.localCommitSequence,
      });
      return { ok: true, snapshot: cloneSnapshot(snapshot) };
    } catch (error) {
      return {
        ok: false,
        snapshot: previous,
        reason: error instanceof CacheUnavailable ? "unavailable" : "aborted",
      };
    }
  };

  const importLegacy = async (storage: LegacyStorage): Promise<AccountCacheImportResult> => {
    const previous = cloneSnapshot(snapshot);
    const targetAccountId = accountId;
    const targetActivationVersion = activationVersion;
    if (closed || !database || !targetAccountId)
      return { ok: false, snapshot: previous, reason: "unavailable" };

    let capture: LegacyCapture;
    try {
      capture = await captureLegacy(storage);
    } catch {
      return { ok: false, snapshot: previous, reason: "unavailable" };
    }
    if (closed || accountId !== targetAccountId || activationVersion !== targetActivationVersion)
      return { ok: false, snapshot: previous, reason: "stale" };

    const tx = database.transaction(
      [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
      "readwrite"
    );
    try {
      const meta = (await request(tx.objectStore(META_STORE).get(targetAccountId))) as
        | AccountMeta
        | undefined;
      const generation = meta
        ? ((await request(
            tx.objectStore(GENERATION_STORE).get([targetAccountId, meta.activeGenerationId])
          )) as CanonicalGeneration | undefined)
        : undefined;
      const pending = (await request(tx.objectStore(PENDING_STORE).get(targetAccountId))) as
        | PendingOverlay
        | undefined;
      const materialized = (await request(
        tx.objectStore(MATERIALIZED_STORE).get(targetAccountId)
      )) as MaterializedProgress | undefined;
      if (meta) assertAccountId(meta, targetAccountId);
      if (generation) assertAccountId(generation, targetAccountId);
      if (pending) assertAccountId(pending, targetAccountId);
      if (materialized) assertAccountId(materialized, targetAccountId);
      if (
        !meta ||
        !generation?.complete ||
        !pending ||
        pending.generationId !== generation.generationId ||
        !materialized
      ) {
        throw new CacheUnavailable("incomplete active Account Cache generation");
      }

      const marker = meta.legacyImport;
      if (marker && !isLegacyImportMarker(marker)) {
        throw new CacheUnavailable("invalid legacy import marker");
      }
      if (marker) {
        await transactionDone(tx);
        const verified = await readFromDatabase(targetAccountId, database);
        snapshot = verified;
        if (marker.status === "pending") {
          const completeTx = database.transaction(META_STORE, "readwrite");
          const currentMeta = (await request(
            completeTx.objectStore(META_STORE).get(targetAccountId)
          )) as AccountMeta | undefined;
          if (!currentMeta) throw new CacheUnavailable("missing Account metadata");
          assertAccountId(currentMeta, targetAccountId);
          if (currentMeta.legacyImport?.mutationIdentity === marker.mutationIdentity) {
            completeTx.objectStore(META_STORE).put({
              ...currentMeta,
              legacyImport: { ...marker, status: "complete" },
            } satisfies AccountMeta);
          }
          await transactionDone(completeTx);
          notify();
        }
        await removeLegacyMatches(storage, marker.fingerprints);
        return { ok: true, imported: false, snapshot: cloneSnapshot(snapshot) };
      }

      const canonical = validateCanonical(deserializeProgress(generation.progress), registry);
      const overlay = validateCanonical(deserializeProgress(pending.progress), registry);
      const canonicalNotes = validateProblemNoteState(deserializeNotes(generation.notes), registry);
      const pendingNotes = validatePendingNotes(pending.notes ?? {}, registry);
      const actor = Uint8Array.from(meta.actorId);
      if (actor.length !== ACTOR_ID_BYTES) throw new CacheUnavailable("invalid Actor metadata");
      const actorKey = Array.from(actor, (byte) => byte.toString(16).padStart(2, "0")).join("");
      const importedProgress = parseLegacyProgress(
        capture.values["leetcode-checked-items"],
        registry
      );
      const importedNotes = parseLegacyNotes(capture.values["leetcode-problem-notes"], registry);
      const visible = joinProgress(canonical, overlay, registry);
      const visibleSlugs = new Set(progressSolvedSlugs(visible));
      let nextVisible = visible;
      let nextCounter = BigInt(reconcileActorCounter(meta, canonical, overlay, registry));
      const progressSlugs: string[] = [];
      for (const slug of importedProgress) {
        if (visibleSlugs.has(slug)) continue;
        if (nextCounter > MAX_UINT64) throw new CacheUnavailable("Actor counter exhausted");
        nextVisible = addProgress(nextVisible, registry, actor, nextCounter, slug);
        nextCounter = nextCounter === MAX_UINT64 ? MAX_UINT64 : nextCounter + BigInt(1);
        progressSlugs.push(slug);
        visibleSlugs.add(slug);
      }
      const nextOverlay = withoutCanonicalAdds(nextVisible, canonical);
      const nextPendingNotes = { ...pendingNotes };
      const importedNoteValues: Record<string, string> = {};
      for (const [slug, text] of Object.entries(importedNotes)) {
        if (canonicalNotes.notes.has(slug) || nextPendingNotes[slug]) continue;
        const canonicalRevision = canonicalNotes.highestLocalRevisions.get(slug)?.get(actorKey);
        const localRevision =
          canonicalRevision === undefined ? BigInt(0) : canonicalRevision + BigInt(1);
        const mutation = createProblemNoteMutation(registry, actor, localRevision, slug, text);
        nextPendingNotes[slug] = serializePendingNote(mutation);
        importedNoteValues[slug] = text;
      }
      const imported = progressSlugs.length > 0 || Object.keys(importedNoteValues).length > 0;
      const nextSequence = imported
        ? BigInt(meta.localCommitSequence) + BigInt(1)
        : BigInt(meta.localCommitSequence);
      if (nextSequence > MAX_UINT64) throw new CacheUnavailable("commit sequence exhausted");
      const markerToStore: LegacyImportMarker = {
        version: 1,
        status: "pending",
        digest: capture.digest,
        fingerprints: capture.fingerprints,
        mutationIdentity: `${capture.digest}:${actorKey}`,
        progressSlugs,
        notes: importedNoteValues,
      };
      tx.objectStore(PENDING_STORE).put({
        ...pending,
        progress: serializeProgress(nextOverlay),
        notes: nextPendingNotes,
      } satisfies PendingOverlay);
      tx.objectStore(MATERIALIZED_STORE).put({
        ...materialized,
        accountId: targetAccountId,
        progress: materialize(canonical, nextOverlay, registry),
        notes: materializeNotes(canonicalNotes, nextPendingNotes),
        localCommitSequence: nextSequence.toString(),
      } satisfies MaterializedProgress);
      tx.objectStore(META_STORE).put({
        ...meta,
        nextActorCounter: nextCounter.toString(),
        localCommitSequence: nextSequence.toString(),
        legacyImport: markerToStore,
      } satisfies AccountMeta);
      options.beforeCommit?.(tx);
      await transactionDone(tx);
      if (closed || accountId !== targetAccountId || activationVersion !== targetActivationVersion)
        return { ok: false, snapshot: previous, reason: "stale" };
      snapshot = await readFromDatabase(targetAccountId, database);
      for (const slug of progressSlugs) {
        if (!snapshot.progress[slug])
          throw new CacheUnavailable("legacy Progress import verification failed");
      }
      for (const [slug, text] of Object.entries(importedNoteValues)) {
        if (snapshot.notes[slug] !== text)
          throw new CacheUnavailable("legacy Problem Note import verification failed");
      }
      notify();
      channel?.postMessage({
        accountId: targetAccountId,
        affectedKeys: [...progressSlugs, ...Object.keys(importedNoteValues)],
        localCommitSequence: snapshot.localCommitSequence,
      });

      const completeTx = database.transaction(META_STORE, "readwrite");
      const currentMeta = (await request(
        completeTx.objectStore(META_STORE).get(targetAccountId)
      )) as AccountMeta | undefined;
      if (!currentMeta) throw new CacheUnavailable("missing Account metadata");
      assertAccountId(currentMeta, targetAccountId);
      if (currentMeta.legacyImport?.mutationIdentity === markerToStore.mutationIdentity) {
        completeTx.objectStore(META_STORE).put({
          ...currentMeta,
          legacyImport: { ...markerToStore, status: "complete" },
        } satisfies AccountMeta);
      }
      await transactionDone(completeTx);
      await removeLegacyMatches(storage, markerToStore.fingerprints);
      return { ok: true, imported, snapshot: cloneSnapshot(snapshot) };
    } catch (error) {
      return {
        ok: false,
        snapshot: previous,
        reason: error instanceof CacheUnavailable ? "unavailable" : "aborted",
      };
    }
  };

  const exportSyncState = async (): Promise<AccountCacheSyncState | null> => {
    const targetAccountId = accountId;
    if (closed || !database || !targetAccountId) return null;
    try {
      const tx = database.transaction([META_STORE, GENERATION_STORE, PENDING_STORE], "readonly");
      const meta = (await request(tx.objectStore(META_STORE).get(targetAccountId))) as
        | AccountMeta
        | undefined;
      if (!meta) throw new CacheUnavailable("missing Account metadata");
      assertAccountId(meta, targetAccountId);
      const handle = Uint8Array.from(meta.revocationHandle ?? []);
      if (handle.length !== 32) throw new CacheUnavailable("invalid Revocation Handle metadata");
      const generation = (await request(
        tx.objectStore(GENERATION_STORE).get([targetAccountId, meta.activeGenerationId])
      )) as CanonicalGeneration | undefined;
      const pending = (await request(tx.objectStore(PENDING_STORE).get(targetAccountId))) as
        | PendingOverlay
        | undefined;
      if (!generation || !pending) throw new CacheUnavailable("incomplete sync state");
      assertAccountId(generation, targetAccountId);
      assertAccountId(pending, targetAccountId);
      if (!generation.complete || pending.generationId !== generation.generationId) {
        throw new CacheUnavailable("incomplete sync state");
      }
      const canonical = validateCanonical(deserializeProgress(generation.progress), registry);
      const overlay = validateCanonical(deserializeProgress(pending.progress), registry);
      const joined = joinProgress(canonical, overlay, registry);
      return {
        accountId: targetAccountId,
        actorId: Uint8Array.from(meta.actorId),
        revocationHandle: handle,
        lastServerRevision: BigInt(generation.serverRevision ?? "0"),
        causalSummary: new Map(joined.causalSummary),
        pending: pendingMutationRecords(overlay, pending.notes ?? {}),
      };
    } catch {
      return null;
    }
  };

  const applyCanonicalMutation = async (
    mutation: AccountCacheCanonicalMutation
  ): Promise<AccountCacheSnapshot> => {
    const requestVersion = activationVersion;
    const targetAccountId = accountId;
    if (closed || !database || !targetAccountId) return unavailable();
    const previous = cloneSnapshot(snapshot);
    try {
      const tx = database.transaction(
        [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
        "readwrite"
      );
      const meta = (await request(tx.objectStore(META_STORE).get(targetAccountId))) as
        | AccountMeta
        | undefined;
      if (!meta) throw new CacheUnavailable("missing Account metadata");
      assertAccountId(meta, targetAccountId);
      const active = (await request(
        tx.objectStore(GENERATION_STORE).get([targetAccountId, meta.activeGenerationId])
      )) as CanonicalGeneration | undefined;
      const pending = (await request(tx.objectStore(PENDING_STORE).get(targetAccountId))) as
        | PendingOverlay
        | undefined;
      const materialized = (await request(
        tx.objectStore(MATERIALIZED_STORE).get(targetAccountId)
      )) as MaterializedProgress | undefined;
      if (active) assertAccountId(active, targetAccountId);
      if (pending) assertAccountId(pending, targetAccountId);
      if (materialized) assertAccountId(materialized, targetAccountId);
      if (
        !active?.complete ||
        !pending ||
        !materialized ||
        pending.generationId !== active.generationId
      ) {
        throw new CacheUnavailable("incomplete active Account Cache generation");
      }
      const activeRevision = BigInt(active.serverRevision ?? "0");
      if (mutation.serverRevision < BigInt(0) || mutation.serverRevision > MAX_UINT64) {
        throw new CacheUnavailable("invalid canonical server revision");
      }
      if (mutation.serverRevision <= activeRevision) {
        await transactionDone(tx);
        return previous;
      }
      const canonical = validateCanonical(deserializeProgress(active.progress), registry);
      const overlay = validateCanonical(deserializeProgress(pending.progress), registry);
      const canonicalNotes = validateProblemNoteState(deserializeNotes(active.notes), registry);
      const nextCanonical =
        mutation.kind === "progress"
          ? joinProgress(canonical, validateCanonical(mutation.state, registry), registry)
          : canonical;
      const nextNotes =
        mutation.kind === "note"
          ? applyProblemNoteMutation(
              canonicalNotes,
              registry,
              mutation.mutation,
              mutation.serverRevision
            ).state
          : canonicalNotes;
      if (nextNotes.serverRevision < mutation.serverRevision) {
        nextNotes.serverRevision = mutation.serverRevision;
      }
      const rebasedOverlay = validateCanonical(
        subtractCanonicalOverlay(overlay, nextCanonical),
        registry
      );
      const pendingNotes = validatePendingNotes(pending.notes ?? {}, registry);
      const rebasedNotes = rebasePendingNotes(nextNotes, pendingNotes);
      const nextActorCounter = reconcileActorCounter(meta, nextCanonical, rebasedOverlay, registry);
      const generationId = `sync-${mutation.serverRevision.toString(10)}`;
      tx.objectStore(GENERATION_STORE).put({
        accountId: targetAccountId,
        generationId,
        serverRevision: mutation.serverRevision.toString(),
        complete: true,
        progress: serializeProgress(nextCanonical),
        notes: serializeNotes(nextNotes),
      } satisfies CanonicalGeneration);
      tx.objectStore(PENDING_STORE).put({
        ...pending,
        generationId,
        progress: serializeProgress(rebasedOverlay),
        notes: rebasedNotes,
      } satisfies PendingOverlay);
      tx.objectStore(META_STORE).put({
        ...meta,
        activeGenerationId: generationId,
        nextActorCounter,
      } satisfies AccountMeta);
      tx.objectStore(MATERIALIZED_STORE).put({
        accountId: targetAccountId,
        progress: materialize(nextCanonical, rebasedOverlay, registry),
        notes: materializeNotes(nextNotes, rebasedNotes),
        localCommitSequence: meta.localCommitSequence,
      } satisfies MaterializedProgress);
      tx.objectStore(GENERATION_STORE).delete([targetAccountId, active.generationId]);
      await transactionDone(tx);
      if (requestVersion !== activationVersion || accountId !== targetAccountId) return previous;
      snapshot = await readFromDatabase(targetAccountId, database);
      notify();
      channel?.postMessage({
        accountId: targetAccountId,
        affectedKeys: Object.keys(snapshot.progress),
        localCommitSequence: snapshot.localCommitSequence,
      });
      return cloneSnapshot(snapshot);
    } catch {
      return previous;
    }
  };

  const acknowledgeProgress = async (
    delta: ProgressState,
    serverRevision?: bigint
  ): Promise<AccountCacheSnapshot> => {
    if (serverRevision !== undefined)
      await applyCanonicalMutation({ kind: "progress", state: delta, serverRevision });
    const requestVersion = activationVersion;
    const targetAccountId = accountId;
    const previous = cloneSnapshot(snapshot);
    if (closed || !database || !targetAccountId) return previous;
    try {
      const tx = database.transaction(
        [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
        "readwrite"
      );
      const meta = (await request(tx.objectStore(META_STORE).get(targetAccountId))) as
        | AccountMeta
        | undefined;
      const active = meta
        ? ((await request(
            tx.objectStore(GENERATION_STORE).get([targetAccountId, meta.activeGenerationId])
          )) as CanonicalGeneration | undefined)
        : undefined;
      const pending = (await request(tx.objectStore(PENDING_STORE).get(targetAccountId))) as
        | PendingOverlay
        | undefined;
      const materialized = (await request(
        tx.objectStore(MATERIALIZED_STORE).get(targetAccountId)
      )) as MaterializedProgress | undefined;
      if (!meta || !active?.complete || !pending || !materialized)
        throw new CacheUnavailable("incomplete sync state");
      assertAccountId(meta, targetAccountId);
      assertAccountId(active, targetAccountId);
      assertAccountId(pending, targetAccountId);
      assertAccountId(materialized, targetAccountId);
      const canonical = validateCanonical(deserializeProgress(active.progress), registry);
      const overlay = validateCanonical(deserializeProgress(pending.progress), registry);
      const accepted = validateCanonical(delta, registry);
      const remaining = validateCanonical(subtractCanonicalOverlay(overlay, accepted), registry);
      const pendingNotes = validatePendingNotes(pending.notes ?? {}, registry);
      const notes = validateProblemNoteState(deserializeNotes(active.notes), registry);
      tx.objectStore(PENDING_STORE).put({
        ...pending,
        progress: serializeProgress(remaining),
      } satisfies PendingOverlay);
      tx.objectStore(MATERIALIZED_STORE).put({
        ...materialized,
        progress: materialize(canonical, remaining, registry),
        notes: materializeNotes(notes, pendingNotes),
      } satisfies MaterializedProgress);
      await transactionDone(tx);
      if (requestVersion !== activationVersion || accountId !== targetAccountId) return previous;
      snapshot = await readFromDatabase(targetAccountId, database);
      notify();
      return cloneSnapshot(snapshot);
    } catch {
      return previous;
    }
  };

  const acknowledgeNote = async (
    acknowledgement: AccountCacheNoteAcknowledgement
  ): Promise<AccountCacheSnapshot> => {
    if (acknowledgement.canonical) {
      await applyCanonicalMutation({
        kind: "note",
        mutation: acknowledgement.canonical.mutation,
        serverRevision: acknowledgement.canonical.serverRevision,
      });
    }
    const requestVersion = activationVersion;
    const targetAccountId = accountId;
    const previous = cloneSnapshot(snapshot);
    if (closed || !database || !targetAccountId) return previous;
    try {
      const tx = database.transaction(
        [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
        "readwrite"
      );
      const meta = (await request(tx.objectStore(META_STORE).get(targetAccountId))) as
        | AccountMeta
        | undefined;
      const active = meta
        ? ((await request(
            tx.objectStore(GENERATION_STORE).get([targetAccountId, meta.activeGenerationId])
          )) as CanonicalGeneration | undefined)
        : undefined;
      const pending = (await request(tx.objectStore(PENDING_STORE).get(targetAccountId))) as
        | PendingOverlay
        | undefined;
      const materialized = (await request(
        tx.objectStore(MATERIALIZED_STORE).get(targetAccountId)
      )) as MaterializedProgress | undefined;
      if (!meta || !active?.complete || !pending || !materialized)
        throw new CacheUnavailable("incomplete sync state");
      assertAccountId(meta, targetAccountId);
      assertAccountId(active, targetAccountId);
      assertAccountId(pending, targetAccountId);
      assertAccountId(materialized, targetAccountId);
      const pendingNotes = validatePendingNotes(pending.notes ?? {}, registry);
      const current = pendingNotes[acknowledgement.slug];
      const actor = Array.from(acknowledgement.actorId);
      if (
        current &&
        current.localRevision === acknowledgement.localRevision.toString() &&
        JSON.stringify(current.actorId) === JSON.stringify(actor)
      ) {
        delete pendingNotes[acknowledgement.slug];
      }
      const canonical = validateCanonical(deserializeProgress(active.progress), registry);
      const notes = validateProblemNoteState(deserializeNotes(active.notes), registry);
      tx.objectStore(PENDING_STORE).put({
        ...pending,
        notes: pendingNotes,
      } satisfies PendingOverlay);
      tx.objectStore(MATERIALIZED_STORE).put({
        ...materialized,
        progress: materialize(
          canonical,
          validateCanonical(deserializeProgress(pending.progress), registry),
          registry
        ),
        notes: materializeNotes(notes, pendingNotes),
      } satisfies MaterializedProgress);
      await transactionDone(tx);
      if (requestVersion !== activationVersion || accountId !== targetAccountId) return previous;
      snapshot = await readFromDatabase(targetAccountId, database);
      notify();
      return cloneSnapshot(snapshot);
    } catch {
      return previous;
    }
  };

  const beginSnapshotStage = async (
    generationId: string,
    serverRevision: bigint
  ): Promise<boolean> => {
    if (closed || !database || !accountId || !generationId || serverRevision < BigInt(0))
      return false;
    try {
      const targetAccountId = accountId;
      const targetActivationVersion = activationVersion;
      const tx = database.transaction(
        [META_STORE, GENERATION_STORE, STAGED_SNAPSHOT_STORE],
        "readwrite"
      );
      const meta = (await request(tx.objectStore(META_STORE).get(targetAccountId))) as
        | AccountMeta
        | undefined;
      const active = meta
        ? ((await request(
            tx.objectStore(GENERATION_STORE).get([targetAccountId, meta.activeGenerationId])
          )) as CanonicalGeneration | undefined)
        : undefined;
      if (!meta || !active) throw new CacheUnavailable("missing active generation");
      assertAccountId(meta, targetAccountId);
      assertAccountId(active, targetAccountId);
      if (!active.complete || serverRevision <= BigInt(active.serverRevision ?? "0")) {
        throw new CacheUnavailable("late snapshot generation");
      }
      if (targetActivationVersion !== activationVersion || accountId !== targetAccountId) {
        throw new CacheUnavailable("stale snapshot generation");
      }
      const stageStore = tx.objectStore(STAGED_SNAPSHOT_STORE);
      const existing = (await request(stageStore.getAll())) as Array<{
        accountId: string;
        generationId: string;
        index: number;
        startedAt?: number;
      }>;
      const expiredGenerationIds = new Set(
        existing
          .filter(
            (item) =>
              item.accountId === targetAccountId &&
              item.index === -1 &&
              (typeof item.startedAt !== "number" ||
                item.startedAt <= Date.now() - MAX_SNAPSHOT_STAGE_AGE_MS)
          )
          .map((item) => item.generationId)
      );
      for (const item of existing) {
        if (item.accountId === targetAccountId && expiredGenerationIds.has(item.generationId)) {
          stageStore.delete([targetAccountId, item.generationId, item.index]);
        }
      }
      stageStore.put({
        accountId: targetAccountId,
        generationId,
        index: -1,
        kind: "manifest",
        serverRevision: serverRevision.toString(),
        startedAt: Date.now(),
        receivedChunks: 0,
        recordCount: 0,
      });
      await transactionDone(tx);
      return accountId === targetAccountId && activationVersion === targetActivationVersion;
    } catch {
      return false;
    }
  };

  const writeSnapshotChunk = async (
    generationId: string,
    chunkIndex: number,
    encodedRecords: readonly Uint8Array[]
  ): Promise<boolean> => {
    if (
      closed ||
      !database ||
      !accountId ||
      !generationId ||
      !Number.isInteger(chunkIndex) ||
      chunkIndex < 0 ||
      encodedRecords.length === 0
    )
      return false;
    try {
      const targetAccountId = accountId;
      const targetActivationVersion = activationVersion;
      for (const encoded of encodedRecords) decodeSnapshotRecord(encoded);
      const tx = database.transaction([STAGED_SNAPSHOT_STORE], "readwrite");
      const marker = (await request(
        tx.objectStore(STAGED_SNAPSHOT_STORE).get([accountId, generationId, -1])
      )) as
        | {
            accountId: string;
            generationId: string;
            kind: string;
            receivedChunks?: number;
            recordCount?: number;
          }
        | undefined;
      if (
        !marker ||
        marker.accountId !== accountId ||
        marker.generationId !== generationId ||
        chunkIndex !== (marker.receivedChunks ?? 0)
      ) {
        throw new CacheUnavailable("missing snapshot stage");
      }
      if (targetActivationVersion !== activationVersion || accountId !== targetAccountId) {
        throw new CacheUnavailable("stale snapshot record");
      }
      const recordStore = tx.objectStore(STAGED_SNAPSHOT_STORE);
      const base = marker.recordCount ?? 0;
      encodedRecords.forEach((encoded, offset) => {
        recordStore.put({
          accountId: targetAccountId,
          generationId,
          index: base + offset,
          encoded: Array.from(encoded),
        });
      });
      recordStore.put({
        ...marker,
        receivedChunks: chunkIndex + 1,
        recordCount: base + encodedRecords.length,
      });
      await transactionDone(tx);
      return accountId === targetAccountId && activationVersion === targetActivationVersion;
    } catch {
      return false;
    }
  };

  const writeSnapshotRecord = (generationId: string, index: number, encoded: Uint8Array) =>
    writeSnapshotChunk(generationId, index, [encoded]);

  const finishSnapshotStage = async (
    generationId: string,
    counts: SnapshotStageCounts
  ): Promise<AccountCacheSnapshot | null> => {
    if (closed || !database || !accountId || !generationId) return null;
    const targetAccountId = accountId;
    const targetActivationVersion = activationVersion;
    try {
      const progress = emptyProgressState();
      const causalSummary = new Map<string, bigint>();
      const notes = emptyProblemNoteState();
      let actorCount = 0;
      let progressShardCount = 0;
      let problemNoteCount = 0;
      let recordCount = 0;
      let totalLength = BigInt(0);
      const checksum = new Crc32cAccumulator();
      let marker:
        | { serverRevision?: string; receivedChunks?: number; recordCount?: number }
        | undefined;
      const actorRecords = new Set<string>();
      const applyRecord = (record: ReturnType<typeof decodeSnapshotRecord>) => {
        if (record.kind === "actor") {
          const actorKey = Array.from(asUint8Array(record.actorId)).join(",");
          if (actorRecords.has(actorKey))
            throw new CacheUnavailable("duplicate Actor snapshot record");
          actorRecords.add(actorKey);
          actorCount += 1;
        } else if (record.kind === "causal") {
          const actor = Array.from(asUint8Array(record.actorId), (byte) =>
            byte.toString(16).padStart(2, "0")
          ).join("");
          if (causalSummary.has(actor))
            throw new CacheUnavailable("duplicate causal snapshot record");
          causalSummary.set(actor, record.counter);
        } else if (record.kind === "shard") {
          progressShardCount += 1;
          const shard = decodeProgressShard(record.encoded);
          progress.adds.push(
            ...shard.adds.map((add) => ({
              slug: add.slug,
              dot: { actorId: asUint8Array(add.actorId), counter: add.counter },
            }))
          );
          for (const removed of shard.removed) {
            progress.removed.set(
              removed.slug,
              new Map(
                removed.summary.map((entry) => [
                  Array.from(asUint8Array(entry.actorId), (byte) =>
                    byte.toString(16).padStart(2, "0")
                  ).join(""),
                  entry.counter,
                ])
              )
            );
          }
        } else {
          problemNoteCount += 1;
          if (notes.notes.has(record.slug))
            throw new CacheUnavailable("duplicate Problem Note snapshot record");
          notes.notes.set(record.slug, {
            slug: record.slug,
            actorId: asUint8Array(record.actorId),
            localRevision: record.localRevision,
            serverRevision: record.serverRevision,
            operation:
              record.operation.kind === "delete"
                ? { kind: "delete" }
                : { kind: "value", bytes: asUint8Array(record.operation.bytes) },
          });
          const actor = Array.from(asUint8Array(record.actorId), (byte) =>
            byte.toString(16).padStart(2, "0")
          ).join("");
          const slugSummary =
            notes.highestLocalRevisions.get(record.slug) ?? new Map<string, bigint>();
          slugSummary.set(actor, record.localRevision);
          notes.highestLocalRevisions.set(record.slug, slugSummary);
          if (record.serverRevision > notes.serverRevision)
            notes.serverRevision = record.serverRevision;
        }
      };
      const tx = database.transaction([STAGED_SNAPSHOT_STORE], "readonly");
      await new Promise<void>((resolve, reject) => {
        const cursorRequest = tx.objectStore(STAGED_SNAPSHOT_STORE).openCursor();
        cursorRequest.onerror = () =>
          reject(cursorRequest.error ?? new Error("snapshot cursor failed"));
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result;
          if (!cursor) {
            resolve();
            return;
          }
          const row = cursor.value as {
            accountId: string;
            generationId: string;
            index: number;
            encoded?: number[];
            serverRevision?: string;
            receivedChunks?: number;
            recordCount?: number;
          };
          if (row.accountId === targetAccountId && row.generationId === generationId) {
            if (row.index === -1) marker = row;
            else {
              if (row.index !== recordCount || !row.encoded) {
                reject(new CacheUnavailable("invalid snapshot sequence"));
                return;
              }
              const encoded = Uint8Array.from(row.encoded);
              totalLength += BigInt(encoded.length);
              checksum.update(encoded);
              applyRecord(decodeSnapshotRecord(encoded));
              recordCount += 1;
            }
          }
          cursor.continue();
        };
      });
      await transactionDone(tx);
      if (
        !marker?.serverRevision ||
        marker.recordCount !== recordCount ||
        (counts.receivedChunkCount !== undefined &&
          marker.receivedChunks !== counts.receivedChunkCount) ||
        recordCount !== counts.chunkCount ||
        totalLength !== counts.totalLength ||
        checksum.digest() !== counts.checksum
      ) {
        throw new CacheUnavailable("invalid snapshot manifest, checksum, or length");
      }
      if (
        closed ||
        accountId !== targetAccountId ||
        activationVersion !== targetActivationVersion
      ) {
        throw new CacheUnavailable("stale snapshot installation");
      }
      progress.causalSummary = causalSummary;
      notes.serverRevision = BigInt(marker.serverRevision);
      if (
        actorCount !== counts.actorCount ||
        progressShardCount !== counts.progressShardCount ||
        problemNoteCount !== counts.problemNoteCount
      )
        throw new CacheUnavailable("snapshot section count mismatch");
      const installed = await replaceCanonical(
        generationId,
        validateCanonical(progress, registry),
        validateProblemNoteState(notes, registry),
        BigInt(marker.serverRevision)
      );
      const cleanupTx = database.transaction([STAGED_SNAPSHOT_STORE], "readwrite");
      for (let index = -1; index < recordCount; index++) {
        cleanupTx.objectStore(STAGED_SNAPSHOT_STORE).delete([targetAccountId, generationId, index]);
      }
      await transactionDone(cleanupTx);
      return accountId === targetAccountId && activationVersion === targetActivationVersion
        ? installed
        : null;
    } catch {
      return null;
    }
  };

  const replaceCanonical = async (
    generationId: string,
    input: ProgressState,
    notesInput?: ProblemNoteState,
    serverRevisionInput?: bigint
  ): Promise<AccountCacheSnapshot> => {
    if (closed || !database || !accountId) return unavailable();
    const previousSnapshot = cloneSnapshot(snapshot);
    try {
      if (!generationId) throw new CacheUnavailable("invalid canonical generation ID");
      const canonical = validateCanonical(input, registry);
      const tx = database.transaction(
        [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE],
        "readwrite"
      );
      const meta = (await request(tx.objectStore(META_STORE).get(accountId))) as
        | AccountMeta
        | undefined;
      const activeGeneration = (await request(
        tx.objectStore(GENERATION_STORE).get([accountId, meta?.activeGenerationId ?? ""])
      )) as CanonicalGeneration | undefined;
      const existingGeneration = (await request(
        tx.objectStore(GENERATION_STORE).get([accountId, generationId])
      )) as CanonicalGeneration | undefined;
      const pending = (await request(tx.objectStore(PENDING_STORE).get(accountId))) as
        | PendingOverlay
        | undefined;
      if (meta) assertAccountId(meta, accountId);
      if (activeGeneration) assertAccountId(activeGeneration, accountId);
      if (existingGeneration) assertAccountId(existingGeneration, accountId);
      if (pending) assertAccountId(pending, accountId);
      if (
        !meta ||
        !activeGeneration?.complete ||
        !pending ||
        pending.generationId !== meta.activeGenerationId ||
        existingGeneration
      ) {
        throw new CacheUnavailable("stale or incomplete Account Cache state");
      }
      const activeServerRevision = BigInt(activeGeneration.serverRevision ?? "0");
      const serverRevision =
        serverRevisionInput ?? notesInput?.serverRevision ?? activeServerRevision + BigInt(1);
      if (serverRevision <= activeServerRevision)
        throw new CacheUnavailable("late canonical generation");
      if (serverRevision > MAX_UINT64) throw new CacheUnavailable("server revision exhausted");
      const canonicalNotes = validateProblemNoteState(
        notesInput ?? deserializeNotes(activeGeneration.notes),
        registry
      );
      if (canonicalNotes.serverRevision > serverRevision)
        throw new CacheUnavailable("Problem Note server revision is newer than generation");
      const overlay = validateCanonical(deserializeProgress(pending.progress), registry);
      const pendingNotes = validatePendingNotes(pending.notes ?? {}, registry);
      const rebasedOverlay = validateCanonical(
        subtractCanonicalOverlay(overlay, canonical),
        registry
      );
      const rebasedNotes = rebasePendingNotes(canonicalNotes, pendingNotes);
      const nextActorCounter = reconcileActorCounter(meta, canonical, rebasedOverlay, registry);
      const nextGeneration: CanonicalGeneration = {
        accountId,
        generationId,
        serverRevision: serverRevision.toString(),
        complete: false,
        progress: serializeProgress(canonical),
        notes: serializeNotes(canonicalNotes),
      };
      tx.objectStore(GENERATION_STORE).put(nextGeneration);
      tx.objectStore(GENERATION_STORE).put({ ...nextGeneration, complete: true });
      tx.objectStore(PENDING_STORE).put({
        ...pending,
        generationId,
        progress: serializeProgress(rebasedOverlay),
        notes: rebasedNotes,
      });
      tx.objectStore(META_STORE).put({
        ...meta,
        activeGenerationId: generationId,
        nextActorCounter,
      });
      tx.objectStore(MATERIALIZED_STORE).put({
        accountId,
        progress: materialize(canonical, rebasedOverlay, registry),
        notes: materializeNotes(canonicalNotes, rebasedNotes),
        localCommitSequence: meta.localCommitSequence,
      } satisfies MaterializedProgress);
      // The old generation is removed only after the new pointer is staged.
      tx.objectStore(GENERATION_STORE).delete([accountId, activeGeneration.generationId]);
      await transactionDone(tx);
      snapshot = await readFromDatabase(accountId, database);
      notify();
      channel?.postMessage({
        accountId,
        affectedKeys: Array.from(
          new Set([
            ...Object.keys(previousSnapshot.progress),
            ...Object.keys(snapshot.progress),
            ...Object.keys(previousSnapshot.notes),
            ...Object.keys(snapshot.notes),
          ])
        ),
        localCommitSequence: snapshot.localCommitSequence,
      });
      return cloneSnapshot(snapshot);
    } catch {
      return unavailable();
    }
  };

  return {
    activate,
    deactivate: () => {
      if (closed) return;
      activationVersion += 1;
      accountId = null;
      snapshot = { progress: {}, notes: {}, localCommitSequence: "0" };
      channel?.close();
      channel = undefined;
      notify();
    },
    eraseAccount: async (targetAccountId = accountId ?? ""): Promise<boolean> => {
      const requestVersion = ++activationVersion;
      if (closed || !targetAccountId) return false;
      try {
        const targetDatabase = database ?? (await open());
        if (!database) database = targetDatabase;
        const tx = targetDatabase.transaction(
          [META_STORE, GENERATION_STORE, PENDING_STORE, MATERIALIZED_STORE, STAGED_SNAPSHOT_STORE],
          "readwrite"
        );
        await Promise.all(
          [
            META_STORE,
            GENERATION_STORE,
            PENDING_STORE,
            MATERIALIZED_STORE,
            STAGED_SNAPSHOT_STORE,
          ].map((storeName) => deleteAccountRecords(tx.objectStore(storeName), targetAccountId))
        );
        await transactionDone(tx);
        if (closed || requestVersion !== activationVersion) return false;
        if (accountId !== targetAccountId) return true;
        channel?.postMessage({ accountId: targetAccountId, erased: true });
        accountId = null;
        snapshot = { progress: {}, notes: {}, localCommitSequence: "0" };
        channel?.close();
        channel = undefined;
        notify();
        return true;
      } catch {
        return false;
      }
    },
    listRevocationHandles: async (): Promise<
      Array<{ accountId: string; revocationHandle: Uint8Array }>
    > => {
      if (closed) return [];
      try {
        const targetDatabase = database ?? (await open());
        if (!database) database = targetDatabase;
        const tx = targetDatabase.transaction(META_STORE, "readonly");
        const records = (await request(tx.objectStore(META_STORE).getAll())) as AccountMeta[];
        const handles: Array<{ accountId: string; revocationHandle: Uint8Array }> = [];
        for (const record of records) {
          if (typeof record.accountId !== "string" || record.accountId.length === 0) continue;
          const handle = Uint8Array.from(record.revocationHandle ?? []);
          if (handle.length !== 32) continue;
          handles.push({ accountId: record.accountId, revocationHandle: handle });
        }
        handles.sort((left, right) => left.accountId.localeCompare(right.accountId));
        return handles;
      } catch {
        return [];
      }
    },
    read: () => cloneSnapshot(snapshot),
    commit,
    saveNote: (slug, text) => commitNote(slug, text),
    clearNote: (slug) => commitNote(slug, null),
    importLegacy,
    replaceCanonical,
    exportSyncState,
    applyCanonicalMutation,
    acknowledgeProgress,
    acknowledgeNote,
    beginSnapshotStage,
    writeSnapshotRecord,
    writeSnapshotChunk,
    finishSnapshotStage,
    reload,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    close: () => {
      closed = true;
      channel?.close();
      database?.close();
      channel = undefined;
      database = null;
      listeners.clear();
    },
  };
}
