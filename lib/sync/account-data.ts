import {
  MAX_BATCH_CHANGES,
  MAX_UINT64,
  decodeProblemNoteText,
  decodeProgressShard,
  encodeProblemNoteText,
  encodeMutationRecord,
  encodeProgressDeltaRecord,
  encodeRevisionedDeltaBatchFrame,
  encodeProgressShard,
} from "./codec";
import {
  ACTOR_ID_BYTES,
  acceptProblemNoteMutation,
  actorIdKey,
  applyProgressMutation,
  progressHas,
  emptyProblemNoteState,
  emptyProgressState,
  joinProgress,
  progressSolvedSlugs,
  type ActorId,
  type ProblemNoteMutation,
  type ProblemNoteRecord,
  type ProblemNoteState,
  type ProgressMutation,
  type ProgressState,
} from "./domain";
import { committedProblemRegistry, isRegisteredProblemSlug } from "../problem-registry";
import {
  deleteAccountData,
  isAccountDeleted,
  type AccountDeletionResult,
} from "./account-deletion";

export const MAX_PROGRESS_SHARD_BYTES = 48 * 1024;
const MAX_ACCOUNT_ACTORS = 64;
export const LEGACY_ACTOR_ID = "00000000000000000000000000000000";
const REVISION_PATTERN = /^(0|[1-9][0-9]*)$/;
const HANDLE_HASH_BYTES = 32;
const UTF8 = new TextEncoder();
const compareStrings = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

type D1Row = Record<string, unknown>;

export type AccountMutation =
  | { type: "progress"; mutation: ProgressMutation }
  | { type: "note"; mutation: ProblemNoteMutation };

type ActorRegistration = {
  actorId: ActorId;
  revocationHandleHash: Uint8Array;
  isLegacy: boolean;
};

export type CanonicalAccountData = {
  serverRevision: bigint;
  actors: Map<string, ActorRegistration>;
  progress: ProgressState;
  notes: ProblemNoteState;
  shards: Map<string, StoredShard>;
  directory: Map<string, string>;
};

export type StoredShard = {
  prefix: string;
  depth: number;
  encoded: Uint8Array;
  state: ProgressState;
};

type MutationResult = {
  accepted: boolean;
  serverRevision: bigint;
  current?: CanonicalAccountData;
};

export type BatchResult = {
  serverRevision: bigint;
  acceptedCount: number;
  results: MutationResult[];
  current: CanonicalAccountData;
};

export type AccountDataPersistedEvent = {
  accountId: string;
  serverRevision: bigint;
  kind: "actor" | "mutation";
  acceptedCount: number;
  changes?: readonly { revision: bigint; mutation: AccountMutation }[];
};

export type BootstrapSessionStatus = {
  revision: bigint;
  latestRevision: bigint;
  overflowed: boolean;
  expectedBatchCount: number;
  receivedBatchCount: number;
};

export type BootstrapSessionResult =
  | { status: "restart" }
  | {
      status: "ready";
      serverRevision: bigint;
      mutations: { revision: bigint; mutation: AccountMutation }[];
    };

export type BootstrapStartResult =
  | { status: "started"; revision: bigint; snapshot: CanonicalAccountData }
  | { status: "rejected"; reason: "invalid_record" };

type BootstrapSession = BootstrapSessionStatus & {
  snapshot: CanonicalAccountData;
  expiresAt: number;
  buffered: { revision: bigint; mutation: AccountMutation; encodedLength: number }[];
};

const MAX_BOOTSTRAP_CHANGES = 100;
const MAX_BOOTSTRAP_BYTES = 1024 * 1024;
const MAX_BOOTSTRAP_SESSIONS = 16;

type LegacyProgressRow = { slug: unknown; solved_at: unknown };
type LegacyNoteRow = { slug: unknown; note: unknown; updated_at: unknown };
type LegacyMigrationRow = { completed_revision: unknown };
type LegacyMirrorRows = { progress: LegacyProgressRow[]; notes: LegacyNoteRow[] };

type AccountEnvironment = { DB: D1Database };
type AccountDeletionCheck = (accountId: string) => Promise<boolean>;

export class PersistenceError extends Error {}

function copyBytes(value: unknown, label: string): Uint8Array {
  if (value instanceof Uint8Array) return value.slice();
  if (value instanceof ArrayBuffer) return new Uint8Array(value).slice();
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength).slice();
  }
  if (Object.prototype.toString.call(value) === "[object ArrayBuffer]") {
    return new Uint8Array(value as ArrayBuffer).slice();
  }
  if (
    Array.isArray(value) &&
    value.every((byte): byte is number => Number.isInteger(byte) && byte >= 0 && byte <= 255)
  ) {
    return Uint8Array.from(value);
  }
  throw new PersistenceError(`${label} must be a binary value`);
}

function u64(value: unknown, label: string): bigint {
  if (typeof value !== "string" || !REVISION_PATTERN.test(value)) {
    throw new PersistenceError(`${label} must be canonical decimal text`);
  }
  const result = BigInt(value);
  if (result < BigInt(0) || result > MAX_UINT64) {
    throw new PersistenceError(`${label} is outside the unsigned 64-bit range`);
  }
  return result;
}

function decimal(value: bigint, label: string): string {
  if (typeof value !== "bigint" || value < BigInt(0) || value > MAX_UINT64) {
    throw new PersistenceError(`${label} is outside the unsigned 64-bit range`);
  }
  return value.toString(10);
}

function nextRevision(value: bigint): bigint {
  if (value === MAX_UINT64) throw new PersistenceError("account server revision is exhausted");
  return value + BigInt(1);
}

function checkedU64(value: unknown, label: string): bigint {
  if (typeof value !== "bigint" || value < BigInt(0) || value > MAX_UINT64) {
    throw new PersistenceError(`${label} is outside the unsigned 64-bit range`);
  }
  return value;
}

function actor(value: Uint8Array | ArrayBuffer, label = "Actor"): Uint8Array {
  const result = value instanceof Uint8Array ? value.slice() : new Uint8Array(value).slice();
  if (result.length !== ACTOR_ID_BYTES) throw new PersistenceError(`${label} must be 16 bytes`);
  return result;
}

function hashBytes(value: Uint8Array | ArrayBuffer): Uint8Array {
  const result = value instanceof Uint8Array ? value.slice() : new Uint8Array(value).slice();
  if (result.length !== HANDLE_HASH_BYTES) {
    throw new PersistenceError("Revocation Handle hash must be 32 bytes");
  }
  return result;
}

function cloneOperation(operation: ProblemNoteRecord["operation"]): ProblemNoteRecord["operation"] {
  if (operation.kind === "delete") return { kind: "delete" };
  decodeProblemNoteText(operation.bytes);
  return { kind: "value", bytes: operation.bytes.slice() };
}

function cloneMutation(mutation: AccountMutation): AccountMutation {
  if (mutation.type === "progress") {
    if (mutation.mutation.kind === "delta") {
      return {
        type: "progress",
        mutation: {
          kind: "delta",
          state: joinProgress(
            mutation.mutation.state,
            emptyProgressState(),
            committedProblemRegistry
          ),
        },
      };
    }
    return {
      type: "progress",
      mutation: {
        kind: mutation.mutation.kind,
        slug: mutation.mutation.slug,
        actorId: copyBytes(mutation.mutation.actorId, "Progress Actor ID"),
        counter: mutation.mutation.counter,
      },
    };
  }
  return {
    type: "note",
    mutation: {
      slug: mutation.mutation.slug,
      actorId: copyBytes(mutation.mutation.actorId, "Problem Note Actor ID"),
      localRevision: mutation.mutation.localRevision,
      operation:
        mutation.mutation.operation.kind === "delete"
          ? { kind: "delete" }
          : {
              kind: "value",
              bytes: copyBytes(mutation.mutation.operation.bytes, "Problem Note value"),
            },
    },
  };
}

function encodedMutationFrame(mutation: AccountMutation): Uint8Array {
  const record =
    mutation.type === "progress"
      ? mutation.mutation.kind === "delta"
        ? {
            kind: "progress-delta" as const,
            adds: mutation.mutation.state.adds.map((add) => ({
              slug: add.slug,
              actorId: add.dot.actorId,
              counter: add.dot.counter,
            })),
            causalSummary: Array.from(mutation.mutation.state.causalSummary.entries()).map(
              ([actorId, counter]) => ({
                actorId: Uint8Array.from(actorId.match(/../g) ?? [], (part) => parseInt(part, 16)),
                counter,
              })
            ),
            removed: Array.from(mutation.mutation.state.removed.entries()).map(
              ([slug, summary]) => ({
                slug,
                summary: Array.from(summary.entries()).map(([actorId, counter]) => ({
                  actorId: Uint8Array.from(actorId.match(/../g) ?? [], (part) =>
                    parseInt(part, 16)
                  ),
                  counter,
                })),
              })
            ),
          }
        : {
            kind: mutation.mutation.kind,
            slug: mutation.mutation.slug,
            actorId: mutation.mutation.actorId,
            counter: mutation.mutation.counter,
          }
      : {
          kind: "note" as const,
          slug: mutation.mutation.slug,
          actorId: mutation.mutation.actorId,
          localRevision: mutation.mutation.localRevision,
          operation: mutation.mutation.operation,
        };
  return encodeRevisionedDeltaBatchFrame([
    { serverRevision: BigInt(0), record: encodeMutationRecord(record) },
  ]);
}

function cloneAccountData(data: CanonicalAccountData): CanonicalAccountData {
  return {
    serverRevision: data.serverRevision,
    actors: new Map(
      Array.from(data.actors.entries()).map(([key, value]) => [
        key,
        {
          actorId: value.actorId.slice(),
          revocationHandleHash: value.revocationHandleHash.slice(),
          isLegacy: value.isLegacy,
        },
      ])
    ),
    progress: joinProgress(data.progress, emptyProgressState(), committedProblemRegistry),
    notes: {
      serverRevision: data.notes.serverRevision,
      notes: new Map(
        Array.from(data.notes.notes.entries()).map(([slug, record]) => [
          slug,
          {
            slug: record.slug,
            actorId: record.actorId.slice(),
            localRevision: record.localRevision,
            serverRevision: record.serverRevision,
            operation: cloneOperation(record.operation),
          },
        ])
      ),
      highestLocalRevisions: new Map(
        Array.from(data.notes.highestLocalRevisions.entries()).map(([slug, summary]) => [
          slug,
          new Map(summary),
        ])
      ),
    },
    shards: new Map(
      Array.from(data.shards.entries()).map(([prefix, shard]) => [
        prefix,
        {
          prefix,
          depth: shard.depth,
          encoded: shard.encoded.slice(),
          state: joinProgress(shard.state, emptyProgressState(), committedProblemRegistry),
        },
      ])
    ),
    directory: new Map(data.directory),
  };
}

function emptyAccountData(): CanonicalAccountData {
  return {
    serverRevision: BigInt(0),
    actors: new Map(),
    progress: emptyProgressState(),
    notes: emptyProblemNoteState(),
    shards: new Map(),
    directory: new Map(),
  };
}

function encodeShard(state: ProgressState): Uint8Array {
  return encodeProgressShard({
    adds: state.adds.map((add) => ({
      slug: add.slug,
      actorId: add.dot.actorId,
      counter: add.dot.counter,
    })),
    removed: Array.from(state.removed.entries()).map(([slug, summary]) => ({
      slug,
      summary: Array.from(summary.entries()).map(([actorId, counter]) => ({
        actorId: Uint8Array.from(actorId.match(/../g) ?? [], (part) => parseInt(part, 16)),
        counter,
      })),
    })),
  });
}

function decodeShard(encoded: Uint8Array): ProgressState {
  const decoded = decodeProgressShard(encoded);
  return {
    adds: decoded.adds.map((add) => ({
      slug: add.slug,
      dot: { actorId: add.actorId.slice() as Uint8Array, counter: add.counter },
    })),
    causalSummary: new Map(),
    removed: new Map(
      decoded.removed.map((entry) => [
        entry.slug,
        new Map(entry.summary.map((item) => [actorIdKey(item.actorId), item.counter])),
      ])
    ),
  };
}

async function slugHash(slug: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", UTF8.encode(slug));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function stateForSlugs(progress: ProgressState, slugs: readonly string[]): ProgressState {
  const allowed = new Set(slugs);
  return {
    adds: progress.adds.filter((add) => allowed.has(add.slug)),
    causalSummary: new Map(),
    removed: new Map(Array.from(progress.removed.entries()).filter(([slug]) => allowed.has(slug))),
  };
}

export async function planShards(
  progress: ProgressState,
  previous: ReadonlyMap<string, StoredShard>,
  previousDirectory: ReadonlyMap<string, string>
): Promise<{ shards: Map<string, StoredShard>; directory: Map<string, string> }> {
  progress = joinProgress(progress, emptyProgressState(), committedProblemRegistry);
  const slugs = Array.from(
    new Set([...progress.adds.map((add) => add.slug), ...progress.removed.keys()])
  ).sort(compareStrings);
  const hashes = new Map(
    await Promise.all(slugs.map(async (slug) => [slug, await slugHash(slug)] as const))
  );
  const leaves = Array.from(previous.values()).sort((left, right) =>
    compareStrings(left.prefix, right.prefix)
  );
  const compactPrefix = (hash: string): string => {
    for (let length = 1; length <= hash.length; length++) {
      const candidate = hash.slice(0, length);
      const overlapsExisting = leaves.some(
        (leaf) => candidate.startsWith(leaf.prefix) || leaf.prefix.startsWith(candidate)
      );
      if (!overlapsExisting) return candidate;
    }
    return hash;
  };
  const assignments = new Map<string, string>();
  for (const slug of slugs) {
    const oldPrefix = previousDirectory.get(slug);
    const oldLeaf = oldPrefix === undefined ? undefined : previous.get(oldPrefix);
    if (oldLeaf && hashes.get(slug)?.startsWith(oldLeaf.prefix)) {
      assignments.set(slug, oldLeaf.prefix);
      continue;
    }
    const leaf = leaves.find((candidate) => hashes.get(slug)?.startsWith(candidate.prefix));
    // Sparse prior trees may not contain the new hash path. Start new records
    // in compact hash buckets, deepening only when that bucket overlaps an
    // existing leaf, so fresh accounts do not create one leaf per record.
    assignments.set(slug, leaf?.prefix ?? compactPrefix(hashes.get(slug) ?? ""));
  }

  const result = new Map<string, StoredShard>();
  const directory = new Map<string, string>();
  const visit = (prefix: string, slugsForPrefix: string[], depth: number): void => {
    const state = stateForSlugs(progress, slugsForPrefix);
    const encoded = encodeShard(state);
    if (encoded.length <= MAX_PROGRESS_SHARD_BYTES) {
      if (slugsForPrefix.length > 0) {
        result.set(prefix, { prefix, depth, encoded, state });
        for (const slug of slugsForPrefix) directory.set(slug, prefix);
      }
      return;
    }
    if (depth >= 256) throw new PersistenceError("Progress record cannot fit in a shard");
    const groups = new Map<string, string[]>();
    for (const slug of slugsForPrefix) {
      const hash = hashes.get(slug);
      if (!hash) throw new PersistenceError("Missing Progress slug hash");
      const child = hash.slice(0, depth / 4 + 1);
      const values = groups.get(child) ?? [];
      values.push(slug);
      groups.set(child, values);
    }
    for (const [child, group] of Array.from(groups.entries()).sort(([left], [right]) =>
      compareStrings(left, right)
    ))
      visit(child, group.sort(), depth + 4);
  };

  const groups = new Map<string, string[]>();
  for (const slug of slugs) {
    const prefix = assignments.get(slug) ?? "";
    const values = groups.get(prefix) ?? [];
    values.push(slug);
    groups.set(prefix, values);
  }
  for (const [prefix, group] of Array.from(groups.entries()).sort(([left], [right]) =>
    compareStrings(left, right)
  ))
    visit(prefix, group.sort(), prefix.length * 4);
  return { shards: result, directory };
}

function rowBytes(row: D1Row, key: string, label: string): Uint8Array {
  return copyBytes(row[key], label);
}

function rowActor(row: D1Row, key: string): Uint8Array {
  return actor(rowBytes(row, key, "Actor"));
}

function prepared(database: D1Database, sql: string, ...values: unknown[]): D1PreparedStatement {
  return database.prepare(sql).bind(...values);
}

function blob(value: Uint8Array): ArrayBuffer {
  return value.slice().buffer;
}

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

function progressDeltaBytes(state: ProgressState): Uint8Array {
  return encodeProgressDeltaRecord({
    kind: "progress-delta",
    adds: state.adds.map((add) => ({
      slug: add.slug,
      actorId: add.dot.actorId,
      counter: add.dot.counter,
    })),
    causalSummary: Array.from(state.causalSummary.entries()).map(([actorId, counter]) => ({
      actorId: Uint8Array.from(actorId.match(/../g) ?? [], (part) => parseInt(part, 16)),
      counter,
    })),
    removed: Array.from(state.removed.entries()).map(([slug, summary]) => ({
      slug,
      summary: Array.from(summary.entries()).map(([actorId, counter]) => ({
        actorId: Uint8Array.from(actorId.match(/../g) ?? [], (part) => parseInt(part, 16)),
        counter,
      })),
    })),
  });
}

function sameNote(
  left: ProblemNoteRecord | undefined,
  right: ProblemNoteRecord | undefined
): boolean {
  if (!left || !right) return left === right;
  if (
    left.slug !== right.slug ||
    !sameBytes(left.actorId, right.actorId) ||
    left.localRevision !== right.localRevision ||
    left.serverRevision !== right.serverRevision ||
    left.operation.kind !== right.operation.kind
  )
    return false;
  if (left.operation.kind === "delete") return true;
  if (right.operation.kind !== "value") return false;
  return sameBytes(left.operation.bytes, right.operation.bytes);
}

export class AccountDataCoordinator {
  private queue: Promise<unknown> = Promise.resolve();
  private loaded: Promise<void> | undefined;
  private accountId: string | undefined;
  private data: CanonicalAccountData | undefined;
  private readonly bootstrapSessions = new Map<string, BootstrapSession>();
  private readonly now: () => number;
  private deleted = false;

  constructor(
    private readonly env: AccountEnvironment,
    private readonly onPersisted?: (event: AccountDataPersistedEvent) => void,
    now: () => number = () => Date.now(),
    private readonly accountDeletionCheck: AccountDeletionCheck = async () => false
  ) {
    this.now = now;
  }

  private emitPersisted(event: AccountDataPersistedEvent): void {
    try {
      this.onPersisted?.(event);
    } catch {
      // A broadcast observer cannot turn a committed mutation into a failure.
    }
  }

  private enqueue<T>(work: () => Promise<T>): Promise<T> {
    const run = this.queue.then(work, work);
    this.queue = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  private setAccount(accountId: string): void {
    if (typeof accountId !== "string" || accountId.length === 0) {
      throw new PersistenceError("account ID is required");
    }
    if (this.accountId !== undefined && this.accountId !== accountId) {
      throw new PersistenceError("Durable Object account identity changed");
    }
    this.accountId = accountId;
  }

  private async ensureLoaded(accountId: string): Promise<CanonicalAccountData> {
    this.setAccount(accountId);
    if (this.deleted || (await this.accountDeletionCheck(accountId))) {
      this.deleted = true;
      this.data = undefined;
      throw new PersistenceError("Account has been deleted");
    }
    if (this.data) return this.data;
    if (!this.loaded) {
      this.loaded = this.load(accountId)
        .then((data) => this.migrateLegacy(accountId, data))
        .then((data) => {
          this.data = data;
        })
        .catch((error) => {
          this.loaded = undefined;
          throw error;
        });
    }
    await this.loaded;
    if (!this.data) throw new PersistenceError("Account Data did not load");
    return this.data;
  }

  private async load(accountId: string): Promise<CanonicalAccountData> {
    const data = emptyAccountData();
    const accountRow = await this.env.DB.prepare(
      "SELECT server_revision FROM sync_accounts WHERE account_id = ?"
    )
      .bind(accountId)
      .first<{ server_revision: unknown }>();
    if (accountRow) data.serverRevision = u64(accountRow.server_revision, "server revision");

    const actorRows = await this.env.DB.prepare(
      "SELECT actor_id, revocation_handle_hash, is_legacy FROM sync_actors WHERE account_id = ? ORDER BY actor_id"
    )
      .bind(accountId)
      .all<{ actor_id: unknown; revocation_handle_hash: unknown; is_legacy: unknown }>();
    for (const row of actorRows.results) {
      if (row.is_legacy !== 0 && row.is_legacy !== 1) {
        throw new PersistenceError("Invalid Actor legacy flag");
      }
      const actorId = rowActor(row, "actor_id");
      const key = actorIdKey(actorId);
      data.actors.set(key, {
        actorId,
        revocationHandleHash: hashBytes(
          rowBytes(row, "revocation_handle_hash", "Revocation Handle hash")
        ),
        isLegacy: row.is_legacy === 1,
      });
    }
    const nonLegacyActors = Array.from(data.actors.values()).filter((entry) => !entry.isLegacy);
    if (nonLegacyActors.length > MAX_ACCOUNT_ACTORS)
      throw new PersistenceError("Actor limit exceeded");
    for (const [key, entry] of data.actors) {
      if (entry.isLegacy !== (key === LEGACY_ACTOR_ID)) {
        throw new PersistenceError("Invalid reserved legacy Actor registration");
      }
    }

    const causalRows = await this.env.DB.prepare(
      "SELECT actor_id, counter FROM sync_causal_summaries WHERE account_id = ? ORDER BY actor_id"
    )
      .bind(accountId)
      .all<{ actor_id: unknown; counter: unknown }>();
    for (const row of causalRows.results) {
      const actorId = rowActor(row, "actor_id");
      const actorKey = actorIdKey(actorId);
      if (!data.actors.has(actorKey))
        throw new PersistenceError("Causal summary Actor is not registered");
      data.progress.causalSummary.set(actorKey, u64(row.counter, "causal counter"));
    }

    const shardRows = await this.env.DB.prepare(
      "SELECT shard_prefix, prefix_depth, encoded_state, byte_length FROM sync_progress_shards WHERE account_id = ? ORDER BY shard_prefix"
    )
      .bind(accountId)
      .all<{
        shard_prefix: unknown;
        prefix_depth: unknown;
        encoded_state: unknown;
        byte_length: unknown;
      }>();
    for (const row of shardRows.results) {
      if (
        typeof row.shard_prefix !== "string" ||
        !/^[0-9a-f]*$/.test(row.shard_prefix) ||
        typeof row.prefix_depth !== "number" ||
        !Number.isInteger(row.prefix_depth) ||
        row.prefix_depth < 0 ||
        row.prefix_depth > 256 ||
        row.prefix_depth !== row.shard_prefix.length * 4
      ) {
        throw new PersistenceError("Invalid Progress shard metadata");
      }
      const encoded = rowBytes(row, "encoded_state", "Progress shard");
      if (
        typeof row.byte_length !== "number" ||
        encoded.length !== row.byte_length ||
        encoded.length > MAX_PROGRESS_SHARD_BYTES
      ) {
        throw new PersistenceError("Invalid Progress shard length");
      }
      const state = decodeShard(encoded);
      if (
        !sameBytes(
          encodeShard(joinProgress(state, emptyProgressState(), committedProblemRegistry)),
          encoded
        )
      ) {
        throw new PersistenceError("Progress shard is not canonically encoded");
      }
      data.shards.set(row.shard_prefix, {
        prefix: row.shard_prefix,
        depth: row.prefix_depth,
        encoded,
        state,
      });
      data.progress = joinProgress(data.progress, state, committedProblemRegistry);
    }
    const prefixes = Array.from(data.shards.keys()).sort(compareStrings);
    for (let index = 1; index < prefixes.length; index++) {
      if (prefixes[index].startsWith(prefixes[index - 1])) {
        throw new PersistenceError("Progress shard leaves overlap");
      }
    }
    for (const shard of data.shards.values()) {
      if (shard.state.adds.length === 0 && shard.state.removed.size === 0) {
        throw new PersistenceError("Progress shard leaf is empty");
      }
      for (const add of shard.state.adds) {
        if (!data.actors.has(actorIdKey(add.dot.actorId))) {
          throw new PersistenceError("Progress add Actor is not registered");
        }
      }
      for (const summary of shard.state.removed.values()) {
        for (const actorKey of summary.keys()) {
          if (!data.actors.has(actorKey)) {
            throw new PersistenceError("Progress removal Actor is not registered");
          }
        }
      }
    }
    for (const actorKey of data.progress.causalSummary.keys()) {
      if (!data.actors.has(actorKey)) {
        throw new PersistenceError("Progress causal Actor is not registered");
      }
    }

    const directoryRows = await this.env.DB.prepare(
      "SELECT slug, shard_prefix FROM sync_progress_directory WHERE account_id = ? ORDER BY slug"
    )
      .bind(accountId)
      .all<{ slug: unknown; shard_prefix: unknown }>();
    for (const row of directoryRows.results) {
      if (typeof row.slug !== "string" || typeof row.shard_prefix !== "string") {
        throw new PersistenceError("Invalid Progress directory row");
      }
      if (!isRegisteredProblemSlug(committedProblemRegistry, row.slug)) {
        throw new PersistenceError("Progress directory contains unknown Problem Registry slug");
      }
      if (!data.shards.has(row.shard_prefix))
        throw new PersistenceError("Directory points to missing shard");
      data.directory.set(row.slug, row.shard_prefix);
    }
    for (const [prefix, shard] of data.shards) {
      const shardSlugs = new Set([
        ...shard.state.adds.map((add) => add.slug),
        ...shard.state.removed.keys(),
      ]);
      for (const slug of shardSlugs) {
        if (data.directory.get(slug) !== prefix) {
          throw new PersistenceError("Progress directory does not match shard state");
        }
        const hash = await slugHash(slug);
        if (!hash.startsWith(prefix))
          throw new PersistenceError("Progress slug has invalid shard placement");
      }
    }
    for (const [slug, prefix] of data.directory) {
      if (!data.shards.get(prefix)) throw new PersistenceError("Directory points to missing shard");
      const hash = await slugHash(slug);
      if (!hash.startsWith(prefix))
        throw new PersistenceError("Progress directory has invalid placement");
      const shard = data.shards.get(prefix);
      const contains =
        shard?.state.adds.some((add) => add.slug === slug) || shard?.state.removed.has(slug);
      if (!contains) throw new PersistenceError("Progress directory points to an absent slug");
    }

    const noteRows = await this.env.DB.prepare(
      "SELECT slug, operation_kind, value, actor_id, local_revision, server_revision FROM sync_problem_notes WHERE account_id = ? ORDER BY slug"
    )
      .bind(accountId)
      .all<{
        slug: unknown;
        operation_kind: unknown;
        value: unknown;
        actor_id: unknown;
        local_revision: unknown;
        server_revision: unknown;
      }>();
    const noteRevisions = new Set<bigint>();
    for (const row of noteRows.results) {
      if (
        typeof row.slug !== "string" ||
        (row.operation_kind !== "value" && row.operation_kind !== "delete")
      ) {
        throw new PersistenceError("Invalid Problem Note register");
      }
      if (!isRegisteredProblemSlug(committedProblemRegistry, row.slug)) {
        throw new PersistenceError("Problem Note contains unknown Problem Registry slug");
      }
      const operation =
        row.operation_kind === "delete"
          ? { kind: "delete" as const }
          : { kind: "value" as const, bytes: rowBytes(row, "value", "Problem Note value") };
      if (operation.kind === "value") {
        if (operation.bytes.length === 0) throw new PersistenceError("Problem Note value is empty");
        decodeProblemNoteText(operation.bytes);
      }
      const noteActor = rowActor(row, "actor_id");
      if (!data.actors.has(actorIdKey(noteActor))) {
        throw new PersistenceError("Problem Note Actor is not registered");
      }
      const serverRevision = u64(row.server_revision, "note server revision");
      if (serverRevision === BigInt(0) || serverRevision > data.serverRevision) {
        throw new PersistenceError("Problem Note server revision is outside account revision");
      }
      if (noteRevisions.has(serverRevision)) {
        throw new PersistenceError("Duplicate Problem Note server revision");
      }
      noteRevisions.add(serverRevision);
      data.notes.notes.set(row.slug, {
        slug: row.slug,
        actorId: noteActor,
        localRevision: u64(row.local_revision, "note local revision"),
        serverRevision,
        operation,
      });
    }
    data.notes.serverRevision = data.serverRevision;

    const boundRows = await this.env.DB.prepare(
      "SELECT slug, actor_id, highest_local_revision FROM sync_note_actor_bounds WHERE account_id = ? ORDER BY slug, actor_id"
    )
      .bind(accountId)
      .all<{ slug: unknown; actor_id: unknown; highest_local_revision: unknown }>();
    for (const row of boundRows.results) {
      if (
        typeof row.slug !== "string" ||
        !isRegisteredProblemSlug(committedProblemRegistry, row.slug)
      )
        throw new PersistenceError("Invalid Problem Note bound");
      const boundActor = rowActor(row, "actor_id");
      if (!data.actors.has(actorIdKey(boundActor))) {
        throw new PersistenceError("Problem Note bound Actor is not registered");
      }
      const summary = data.notes.highestLocalRevisions.get(row.slug) ?? new Map();
      summary.set(actorIdKey(boundActor), u64(row.highest_local_revision, "note revision bound"));
      data.notes.highestLocalRevisions.set(row.slug, summary);
    }
    for (const [slug, record] of data.notes.notes) {
      const bound = data.notes.highestLocalRevisions.get(slug)?.get(actorIdKey(record.actorId));
      if (bound === undefined || bound < record.localRevision) {
        throw new PersistenceError("Problem Note register has incomplete revision bounds");
      }
    }
    if (data.notes.serverRevision !== data.serverRevision) {
      throw new PersistenceError("Account and Problem Note revisions disagree");
    }
    return data;
  }

  private async migrateLegacy(
    accountId: string,
    data: CanonicalAccountData
  ): Promise<CanonicalAccountData> {
    const marker = await this.env.DB.prepare(
      "SELECT completed_revision FROM sync_legacy_migrations WHERE account_id = ?"
    )
      .bind(accountId)
      .first<LegacyMigrationRow>();
    if (marker) {
      u64(marker.completed_revision, "legacy migration revision");
      return data;
    }

    const legacy = await this.readLegacyMirrors(accountId);
    const next = cloneAccountData(data);
    const legacyActor = Uint8Array.from({ length: ACTOR_ID_BYTES }, () => 0);
    const legacyKey = actorIdKey(legacyActor);
    if (!next.actors.has(legacyKey)) {
      next.actors.set(legacyKey, {
        actorId: legacyActor,
        revocationHandleHash: new Uint8Array(HANDLE_HASH_BYTES),
        isLegacy: true,
      });
    }

    const progressSlugs = new Set<string>();
    for (const row of legacy.progress) {
      if (typeof row.slug !== "string")
        throw new PersistenceError("Legacy Progress contains an invalid Problem Registry slug");
      // Legacy endpoints accepted arbitrary non-empty slugs. Preserve the
      // account's usable registered data when an old row no longer exists in
      // the registry instead of making activation fail for the whole account.
      if (!isRegisteredProblemSlug(committedProblemRegistry, row.slug)) continue;
      if (typeof row.solved_at !== "string" || !row.solved_at)
        throw new PersistenceError("Legacy Progress has an invalid solve timestamp");
      progressSlugs.add(row.slug);
    }
    const noteRows = new Map<string, LegacyNoteRow>();
    for (const row of legacy.notes) {
      if (typeof row.slug !== "string")
        throw new PersistenceError("Legacy Problem Notes contain an invalid Problem Registry slug");
      if (!isRegisteredProblemSlug(committedProblemRegistry, row.slug)) continue;
      if (typeof row.note !== "string" || typeof row.updated_at !== "string" || !row.updated_at)
        throw new PersistenceError("Legacy Problem Note has invalid data");
      if (row.note.trim()) noteRows.set(row.slug, row);
    }

    const slugs = Array.from(new Set([...progressSlugs, ...noteRows.keys()])).sort(compareStrings);
    let legacyCounter = next.progress.causalSummary.get(legacyKey);
    for (const slug of slugs) {
      if (
        progressSlugs.has(slug) &&
        !progressHas(next.progress, slug) &&
        !next.progress.removed.has(slug)
      ) {
        const counter = legacyCounter === undefined ? BigInt(0) : legacyCounter + BigInt(1);
        next.progress = applyProgressMutation(next.progress, committedProblemRegistry, {
          kind: "add",
          actorId: legacyActor,
          counter,
          slug,
        });
        next.serverRevision = nextRevision(next.serverRevision);
        next.notes.serverRevision = next.serverRevision;
        legacyCounter = counter;
      }
      const legacyNote = noteRows.get(slug);
      if (legacyNote && !next.notes.notes.has(slug)) {
        const note = acceptProblemNoteMutation(
          next.notes,
          committedProblemRegistry,
          {
            slug,
            actorId: legacyActor,
            localRevision: BigInt(0),
            operation: { kind: "value", bytes: encodeProblemNoteText(legacyNote.note as string) },
          },
          nextRevision(next.serverRevision)
        );
        next.notes = note.state;
        next.serverRevision = note.state.serverRevision;
      }
    }

    if (next.progress.adds.length > 0 || next.progress.removed.size > 0) {
      const plan = await planShards(next.progress, next.shards, next.directory);
      next.shards = plan.shards;
      next.directory = plan.directory;
    }
    await this.persist(accountId, data, next, { markLegacyMigrated: true });
    return next;
  }

  private async readLegacyMirrors(accountId: string): Promise<LegacyMirrorRows> {
    const [progress, notes] = await Promise.all([
      this.env.DB.prepare("SELECT slug, solved_at FROM progress WHERE user_id = ?")
        .bind(accountId)
        .all<LegacyProgressRow>(),
      this.env.DB.prepare("SELECT slug, note, updated_at FROM notes WHERE user_id = ?")
        .bind(accountId)
        .all<LegacyNoteRow>(),
    ]);
    return { progress: progress.results, notes: notes.results };
  }

  async registerActor(
    accountId: string,
    actorIdInput: ActorId | ArrayBuffer,
    revocationHandleHashInput: Uint8Array | ArrayBuffer
  ): Promise<CanonicalAccountData> {
    if (actorIdKey(actorIdInput) === LEGACY_ACTOR_ID) {
      throw new PersistenceError("The reserved legacy Actor requires server registration");
    }
    return this.registerActorInternal(accountId, actorIdInput, revocationHandleHashInput, false);
  }

  async registerLegacyActor(
    accountId: string,
    revocationHandleHashInput: Uint8Array | ArrayBuffer
  ): Promise<CanonicalAccountData> {
    return this.registerActorInternal(
      accountId,
      Uint8Array.from({ length: ACTOR_ID_BYTES }, () => 0),
      revocationHandleHashInput,
      true
    );
  }

  private async registerActorInternal(
    accountId: string,
    actorIdInput: ActorId | ArrayBuffer,
    revocationHandleHashInput: Uint8Array | ArrayBuffer,
    allowLegacy: boolean
  ): Promise<CanonicalAccountData> {
    return this.enqueue(async () => {
      const data = await this.ensureLoaded(accountId);
      const actorId = actor(actorIdInput);
      const key = actorIdKey(actorId);
      const isLegacy = key === LEGACY_ACTOR_ID;
      if (isLegacy && !allowLegacy) {
        throw new PersistenceError("The reserved legacy Actor requires server registration");
      }
      const revocationHandleHash = hashBytes(revocationHandleHashInput);
      const current = data.actors.get(key);
      if (current) {
        if (
          Array.from(current.revocationHandleHash).some(
            (byte, index) => byte !== revocationHandleHash[index]
          )
        ) {
          throw new PersistenceError("Actor Revocation Handle does not match");
        }
        return cloneAccountData(data);
      }
      if (
        !isLegacy &&
        Array.from(data.actors.values()).filter((entry) => !entry.isLegacy).length >=
          MAX_ACCOUNT_ACTORS
      ) {
        throw new PersistenceError("Account Actor limit reached");
      }
      const next = cloneAccountData(data);
      next.actors.set(key, { actorId, revocationHandleHash, isLegacy });
      await this.persist(accountId, data, next);
      this.data = next;
      for (const session of this.bootstrapSessions.values()) session.overflowed = true;
      this.emitPersisted({
        accountId,
        serverRevision: next.serverRevision,
        kind: "actor",
        acceptedCount: 0,
      });
      return cloneAccountData(next);
    });
  }

  async getCanonical(accountId: string): Promise<CanonicalAccountData> {
    return this.enqueue(async () => cloneAccountData(await this.ensureLoaded(accountId)));
  }

  async deleteAccount(accountId: string, accountRouteKey: string): Promise<AccountDeletionResult> {
    return this.enqueue(async () => {
      this.setAccount(accountId);
      if (this.deleted || (await isAccountDeleted(this.env, accountRouteKey))) {
        this.deleted = true;
        this.data = undefined;
        this.loaded = undefined;
        this.bootstrapSessions.clear();
        return { deleted: true, tombstonedHandleCount: 0 };
      }
      const result = await deleteAccountData(this.env, accountId, accountRouteKey, this.now);
      this.deleted = true;
      this.data = undefined;
      this.loaded = undefined;
      this.bootstrapSessions.clear();
      return result;
    });
  }

  async beginBootstrap(
    accountId: string,
    sessionId: string,
    expiresAt: number,
    actorIdInput: ActorId | ArrayBuffer,
    revocationHandleHashInput: Uint8Array | ArrayBuffer,
    lastServerRevision = BigInt(0),
    causalSummary: readonly {
      actorId: ActorId | ArrayBuffer;
      counter: bigint;
    }[] = [],
    pendingBatchCount = 0
  ): Promise<BootstrapStartResult> {
    return this.enqueue(async () => {
      if (!/^[A-Za-z0-9_-]{16,128}$/.test(sessionId))
        throw new PersistenceError("invalid bootstrap session ID");
      if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(this.now() / 1000))
        throw new PersistenceError("invalid bootstrap expiration");
      if (
        !Number.isSafeInteger(pendingBatchCount) ||
        pendingBatchCount < 0 ||
        pendingBatchCount > 4096
      )
        throw new PersistenceError("invalid pending batch count");
      this.pruneBootstrapSessions();
      if (this.bootstrapSessions.size >= MAX_BOOTSTRAP_SESSIONS)
        throw new PersistenceError("too many active bootstrap sessions");
      if (this.bootstrapSessions.has(sessionId))
        throw new PersistenceError("bootstrap session already exists");
      let data = await this.ensureLoaded(accountId);
      const actorId = actor(actorIdInput, "bootstrap Actor ID");
      const key = actorIdKey(actorId);
      if (checkedU64(lastServerRevision, "last server revision") > data.serverRevision) {
        return { status: "rejected", reason: "invalid_record" };
      }
      const summaryActors = new Set<string>();
      for (const entry of causalSummary) {
        const summaryActor = actor(entry.actorId, "bootstrap causal Actor ID");
        const summaryKey = actorIdKey(summaryActor);
        if (summaryActors.has(summaryKey)) {
          return { status: "rejected", reason: "invalid_record" };
        }
        summaryActors.add(summaryKey);
        checkedU64(entry.counter, "bootstrap causal counter");
        if (summaryKey !== key && !data.actors.has(summaryKey)) {
          return { status: "rejected", reason: "invalid_record" };
        }
      }
      const revocationHandleHash = hashBytes(revocationHandleHashInput);
      const registered = data.actors.get(key);
      if (registered) {
        if (!sameBytes(registered.revocationHandleHash, revocationHandleHash))
          throw new PersistenceError("Actor Revocation Handle does not match");
      } else {
        if (key === LEGACY_ACTOR_ID) throw new PersistenceError("reserved legacy Actor");
        if (
          Array.from(data.actors.values()).filter((entry) => !entry.isLegacy).length >=
          MAX_ACCOUNT_ACTORS
        )
          throw new PersistenceError("Account Actor limit reached");
        const next = cloneAccountData(data);
        next.actors.set(key, { actorId, revocationHandleHash, isLegacy: false });
        await this.persist(accountId, data, next);
        this.data = next;
        data = next;
        // A newly registered actor changes the canonical snapshot even though
        // it does not consume a server revision. Any session captured before
        // this persistence must restart rather than commit without the actor.
        for (const session of this.bootstrapSessions.values()) session.overflowed = true;
        this.emitPersisted({
          accountId,
          serverRevision: next.serverRevision,
          kind: "actor",
          acceptedCount: 0,
        });
      }
      const snapshot = cloneAccountData(data);
      this.bootstrapSessions.set(sessionId, {
        revision: snapshot.serverRevision,
        latestRevision: snapshot.serverRevision,
        overflowed: false,
        snapshot,
        expiresAt,
        expectedBatchCount: pendingBatchCount,
        receivedBatchCount: 0,
        buffered: [],
      });
      return { status: "started", revision: snapshot.serverRevision, snapshot };
    });
  }

  async bootstrapStatus(accountId: string, sessionId: string): Promise<BootstrapSessionStatus> {
    return this.enqueue(async () => {
      await this.ensureLoaded(accountId);
      this.pruneBootstrapSessions();
      const session = this.bootstrapSessions.get(sessionId);
      if (!session) throw new PersistenceError("bootstrap session is not active");
      return {
        revision: session.revision,
        latestRevision: session.latestRevision,
        overflowed: session.overflowed,
        expectedBatchCount: session.expectedBatchCount,
        receivedBatchCount: session.receivedBatchCount,
      };
    });
  }

  async abortBootstrap(accountId: string, sessionId: string): Promise<void> {
    return this.enqueue(async () => {
      await this.ensureLoaded(accountId);
      this.bootstrapSessions.delete(sessionId);
    });
  }

  async bootstrapSnapshot(accountId: string, sessionId: string): Promise<CanonicalAccountData> {
    return this.enqueue(async () => {
      await this.ensureLoaded(accountId);
      this.pruneBootstrapSessions();
      const session = this.bootstrapSessions.get(sessionId);
      if (!session) throw new PersistenceError("bootstrap session is not active");
      return cloneAccountData(session.snapshot);
    });
  }

  async confirmBootstrap(
    accountId: string,
    sessionId: string,
    revision: bigint
  ): Promise<BootstrapSessionResult> {
    return this.enqueue(async () => {
      const data = await this.ensureLoaded(accountId);
      this.pruneBootstrapSessions();
      const session = this.bootstrapSessions.get(sessionId);
      if (!session) return { status: "restart" };
      this.bootstrapSessions.delete(sessionId);
      if (
        revision !== session.revision ||
        session.overflowed ||
        (data.serverRevision !== session.revision && data.serverRevision !== session.latestRevision)
      ) {
        return { status: "restart" };
      }
      return {
        status: "ready",
        serverRevision: data.serverRevision,
        mutations: session.buffered.map(({ revision, mutation }) => ({
          revision,
          mutation: cloneMutation(mutation),
        })),
      };
    });
  }

  private pruneBootstrapSessions(): void {
    const now = Math.floor(this.now() / 1000);
    for (const [sessionId, session] of this.bootstrapSessions) {
      if (session.expiresAt <= now) this.bootstrapSessions.delete(sessionId);
    }
  }

  async applyMutations(
    accountId: string,
    mutations: readonly AccountMutation[]
  ): Promise<BatchResult> {
    return this.enqueue(async () => this.applyLoadedMutations(accountId, mutations));
  }

  async applyBootstrapBatch(
    accountId: string,
    sessionId: string,
    batchIndex: number,
    batchCount: number,
    mutations: readonly AccountMutation[]
  ): Promise<BatchResult> {
    return this.enqueue(async () => {
      await this.ensureLoaded(accountId);
      this.pruneBootstrapSessions();
      const session = this.bootstrapSessions.get(sessionId);
      if (
        !session ||
        session.expectedBatchCount !== batchCount ||
        session.receivedBatchCount !== batchIndex
      )
        throw new PersistenceError("invalid bootstrap batch sequence");
      const result = await this.applyLoadedMutations(accountId, mutations);
      session.receivedBatchCount++;
      return result;
    });
  }

  private async applyLoadedMutations(
    accountId: string,
    mutations: readonly AccountMutation[]
  ): Promise<BatchResult> {
    const data = await this.ensureLoaded(accountId);
    if (mutations.length === 0 || mutations.length > MAX_BATCH_CHANGES) {
      throw new PersistenceError(`Mutation batch must contain 1-${MAX_BATCH_CHANGES} changes`);
    }
    const next = cloneAccountData(data);
    let acceptedCount = 0;
    const results: MutationResult[] = [];
    for (const item of mutations) {
      const mutationActor =
        item.type === "progress" && item.mutation.kind !== "delta"
          ? actor(item.mutation.actorId)
          : item.type === "note"
            ? actor(item.mutation.actorId)
            : null;
      if (item.type === "progress" && item.mutation.kind === "delta") {
        const delta = item.mutation.state;
        const actorKeys = new Set<string>(delta.causalSummary.keys());
        for (const add of delta.adds) actorKeys.add(actorIdKey(add.dot.actorId));
        for (const summary of delta.removed.values()) {
          for (const key of summary.keys()) actorKeys.add(key);
        }
        for (const key of actorKeys) {
          if (!next.actors.has(key)) throw new PersistenceError("Actor is not registered");
        }
        const beforeRevision = next.serverRevision;
        const joined = joinProgress(next.progress, delta, committedProblemRegistry);
        if (sameBytes(progressDeltaBytes(next.progress), progressDeltaBytes(joined))) {
          results.push({
            accepted: false,
            serverRevision: beforeRevision,
            current: cloneAccountData(next),
          });
          continue;
        }
        next.progress = joined;
        next.serverRevision = nextRevision(next.serverRevision);
        next.notes.serverRevision = next.serverRevision;
        acceptedCount++;
        results.push({ accepted: true, serverRevision: next.serverRevision });
        continue;
      }
      if (!mutationActor || !next.actors.has(actorIdKey(mutationActor)))
        throw new PersistenceError("Actor is not registered");
      const beforeRevision = next.serverRevision;
      if (item.type === "progress" && item.mutation.kind !== "delta") {
        const previous = next.progress.causalSummary.get(actorIdKey(mutationActor));
        const expected = previous === undefined ? BigInt(0) : previous + BigInt(1);
        if (item.mutation.counter < expected) {
          results.push({
            accepted: false,
            serverRevision: beforeRevision,
            current: cloneAccountData(next),
          });
          continue;
        }
        const progress = applyProgressMutation(
          next.progress,
          committedProblemRegistry,
          item.mutation
        );
        next.progress = progress;
        next.serverRevision = nextRevision(next.serverRevision);
        next.notes.serverRevision = next.serverRevision;
        acceptedCount++;
        results.push({ accepted: true, serverRevision: next.serverRevision });
        continue;
      }
      if (item.type !== "note") throw new PersistenceError("invalid mutation type");
      const note = acceptProblemNoteMutation(
        next.notes,
        committedProblemRegistry,
        item.mutation,
        nextRevision(next.serverRevision)
      );
      if (!note.accepted) {
        results.push({
          accepted: false,
          serverRevision: beforeRevision,
          current: cloneAccountData(next),
        });
        continue;
      }
      next.notes = note.state;
      next.serverRevision = note.state.serverRevision;
      acceptedCount++;
      results.push({ accepted: true, serverRevision: next.serverRevision });
    }
    if (acceptedCount === 0)
      return {
        serverRevision: data.serverRevision,
        acceptedCount,
        results,
        current: cloneAccountData(data),
      };
    const plan = await planShards(next.progress, next.shards, next.directory);
    next.shards = plan.shards;
    next.directory = plan.directory;
    await this.persist(accountId, data, next);
    this.data = next;
    this.pruneBootstrapSessions();
    for (const [index, result] of results.entries()) {
      if (!result.accepted) continue;
      for (const session of this.bootstrapSessions.values()) {
        if (session.overflowed) continue;
        if (session.buffered.length >= MAX_BOOTSTRAP_CHANGES) {
          session.overflowed = true;
          continue;
        }
        const mutation = mutations[index];
        const encodedLength = encodedMutationFrame(mutation).length;
        const usedBytes = session.buffered.reduce((total, item) => total + item.encodedLength, 0);
        if (usedBytes + encodedLength > MAX_BOOTSTRAP_BYTES) {
          session.overflowed = true;
          continue;
        }
        session.buffered.push({
          revision: result.serverRevision,
          mutation: cloneMutation(mutation),
          encodedLength,
        });
        session.latestRevision =
          result.serverRevision > session.latestRevision
            ? result.serverRevision
            : session.latestRevision;
      }
    }
    this.emitPersisted({
      accountId,
      serverRevision: next.serverRevision,
      kind: "mutation",
      acceptedCount,
      changes: results.flatMap((result, index) =>
        result.accepted
          ? [{ revision: result.serverRevision, mutation: cloneMutation(mutations[index]) }]
          : []
      ),
    });
    const current = cloneAccountData(next);
    const finalResults = results.map((result) =>
      result.accepted
        ? result
        : {
            accepted: false,
            serverRevision: next.serverRevision,
            current: cloneAccountData(next),
          }
    );
    return {
      serverRevision: next.serverRevision,
      acceptedCount,
      results: finalResults,
      current,
    };
  }

  async applyLegacyProgress(
    accountId: string,
    slug: string,
    completed: boolean
  ): Promise<BatchResult> {
    return this.enqueue(async () => {
      const data = await this.ensureLoaded(accountId);
      if (!isRegisteredProblemSlug(committedProblemRegistry, slug)) {
        throw new PersistenceError("Invalid Problem Registry slug");
      }
      const alreadyCompleted = progressHas(data.progress, slug);
      if (alreadyCompleted === completed) {
        const current = cloneAccountData(data);
        return {
          serverRevision: data.serverRevision,
          acceptedCount: 0,
          results: [{ accepted: false, serverRevision: data.serverRevision, current }],
          current: cloneAccountData(current),
        };
      }
      const legacyActor = Uint8Array.from({ length: ACTOR_ID_BYTES }, () => 0);
      const previous = data.progress.causalSummary.get(actorIdKey(legacyActor));
      const counter = previous === undefined ? BigInt(0) : nextRevision(previous);
      return this.applyLoadedMutations(accountId, [
        {
          type: "progress",
          mutation: {
            kind: completed ? "add" : "remove",
            actorId: legacyActor,
            counter,
            slug,
          },
        },
      ]);
    });
  }

  async applyLegacyNote(accountId: string, slug: string, text: string): Promise<BatchResult> {
    return this.enqueue(async () => {
      const data = await this.ensureLoaded(accountId);
      if (!isRegisteredProblemSlug(committedProblemRegistry, slug)) {
        throw new PersistenceError("Invalid Problem Registry slug");
      }
      const normalized = text.trim();
      const currentRecord = data.notes.notes.get(slug);
      const currentText =
        currentRecord?.operation.kind === "value"
          ? decodeProblemNoteText(currentRecord.operation.bytes)
          : "";
      if (currentText === normalized) {
        const current = cloneAccountData(data);
        return {
          serverRevision: data.serverRevision,
          acceptedCount: 0,
          results: [{ accepted: false, serverRevision: data.serverRevision, current }],
          current: cloneAccountData(current),
        };
      }
      const legacyActor = Uint8Array.from({ length: ACTOR_ID_BYTES }, () => 0);
      const legacyKey = actorIdKey(legacyActor);
      const previous = data.notes.highestLocalRevisions.get(slug)?.get(legacyKey);
      const localRevision = previous === undefined ? BigInt(0) : nextRevision(previous);
      const operation = normalized
        ? { kind: "value" as const, bytes: encodeProblemNoteText(normalized) }
        : { kind: "delete" as const };
      return this.applyLoadedMutations(accountId, [
        {
          type: "note",
          mutation: { slug, actorId: legacyActor, localRevision, operation },
        },
      ]);
    });
  }

  private async persist(
    accountId: string,
    previous: CanonicalAccountData,
    data: CanonicalAccountData,
    options: { markLegacyMigrated?: boolean } = {}
  ): Promise<void> {
    const mirrors = await this.readLegacyMirrors(accountId);
    const mirrorProgress = new Map(
      mirrors.progress
        .filter(
          (row): row is { slug: string; solved_at: string } =>
            typeof row.slug === "string" &&
            typeof row.solved_at === "string" &&
            row.solved_at.length > 0
        )
        .map((row) => [row.slug, row] as const)
    );
    const mirrorNotes = new Map(
      mirrors.notes
        .filter(
          (row): row is { slug: string; note: string; updated_at: string } =>
            typeof row.slug === "string" &&
            typeof row.note === "string" &&
            typeof row.updated_at === "string" &&
            row.updated_at.length > 0
        )
        .map((row) => [row.slug, row] as const)
    );
    const now = new Date().toISOString();
    const statements: D1PreparedStatement[] = [
      prepared(
        this.env.DB,
        "INSERT INTO sync_accounts (account_id, server_revision) VALUES (?, ?) ON CONFLICT(account_id) DO UPDATE SET server_revision = excluded.server_revision",
        accountId,
        decimal(data.serverRevision, "server revision")
      ),
    ];
    for (const [actorKey, entry] of data.actors) {
      const old = previous.actors.get(actorKey);
      if (
        old &&
        old.isLegacy === entry.isLegacy &&
        sameBytes(old.actorId, entry.actorId) &&
        sameBytes(old.revocationHandleHash, entry.revocationHandleHash)
      )
        continue;
      statements.push(
        prepared(
          this.env.DB,
          "INSERT INTO sync_actors (account_id, actor_id, revocation_handle_hash, is_legacy) VALUES (?, ?, ?, ?) ON CONFLICT(account_id, actor_id) DO UPDATE SET revocation_handle_hash = excluded.revocation_handle_hash, is_legacy = excluded.is_legacy",
          accountId,
          blob(entry.actorId),
          blob(entry.revocationHandleHash),
          entry.isLegacy ? 1 : 0
        )
      );
    }
    for (const [actorKey, counter] of data.progress.causalSummary) {
      if (previous.progress.causalSummary.get(actorKey) === counter) continue;
      statements.push(
        prepared(
          this.env.DB,
          "INSERT INTO sync_causal_summaries (account_id, actor_id, counter) VALUES (?, ?, ?) ON CONFLICT(account_id, actor_id) DO UPDATE SET counter = excluded.counter",
          accountId,
          blob(Uint8Array.from(actorKey.match(/../g) ?? [], (part) => parseInt(part, 16))),
          decimal(counter, "causal counter")
        )
      );
    }
    const shardPrefixes = new Set([...previous.shards.keys(), ...data.shards.keys()]);
    for (const prefix of shardPrefixes) {
      const old = previous.shards.get(prefix);
      const next = data.shards.get(prefix);
      if (!next) {
        if (old)
          statements.push(
            prepared(
              this.env.DB,
              "DELETE FROM sync_progress_shards WHERE account_id = ? AND shard_prefix = ?",
              accountId,
              prefix
            )
          );
      } else if (!old || !sameBytes(old.encoded, next.encoded) || old.depth !== next.depth) {
        statements.push(
          prepared(
            this.env.DB,
            "INSERT INTO sync_progress_shards (account_id, shard_prefix, prefix_depth, encoded_state, byte_length) VALUES (?, ?, ?, ?, ?) ON CONFLICT(account_id, shard_prefix) DO UPDATE SET prefix_depth = excluded.prefix_depth, encoded_state = excluded.encoded_state, byte_length = excluded.byte_length",
            accountId,
            next.prefix,
            next.depth,
            blob(next.encoded),
            next.encoded.length
          )
        );
      }
    }
    const directorySlugs = new Set([...previous.directory.keys(), ...data.directory.keys()]);
    for (const slug of directorySlugs) {
      const old = previous.directory.get(slug);
      const next = data.directory.get(slug);
      if (next === undefined) {
        if (old !== undefined)
          statements.push(
            prepared(
              this.env.DB,
              "DELETE FROM sync_progress_directory WHERE account_id = ? AND slug = ?",
              accountId,
              slug
            )
          );
      } else if (old !== next) {
        statements.push(
          prepared(
            this.env.DB,
            "INSERT INTO sync_progress_directory (account_id, slug, shard_prefix) VALUES (?, ?, ?) ON CONFLICT(account_id, slug) DO UPDATE SET shard_prefix = excluded.shard_prefix",
            accountId,
            slug,
            next
          )
        );
      }
    }
    const noteSlugs = new Set([...previous.notes.notes.keys(), ...data.notes.notes.keys()]);
    for (const slug of noteSlugs) {
      const old = previous.notes.notes.get(slug);
      const next = data.notes.notes.get(slug);
      if (!next) {
        if (old)
          statements.push(
            prepared(
              this.env.DB,
              "DELETE FROM sync_problem_notes WHERE account_id = ? AND slug = ?",
              accountId,
              slug
            )
          );
      } else if (!sameNote(old, next)) {
        statements.push(
          prepared(
            this.env.DB,
            "INSERT INTO sync_problem_notes (account_id, slug, operation_kind, value, actor_id, local_revision, server_revision) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(account_id, slug) DO UPDATE SET operation_kind = excluded.operation_kind, value = excluded.value, actor_id = excluded.actor_id, local_revision = excluded.local_revision, server_revision = excluded.server_revision",
            accountId,
            slug,
            next.operation.kind,
            next.operation.kind === "value" ? blob(next.operation.bytes) : null,
            blob(next.actorId),
            decimal(next.localRevision, "note local revision"),
            decimal(next.serverRevision, "note server revision")
          )
        );
      }
    }
    const boundKeys = new Set<string>();
    for (const [slug, summary] of previous.notes.highestLocalRevisions)
      for (const actorKey of summary.keys()) boundKeys.add(`${slug}\u0000${actorKey}`);
    for (const [slug, summary] of data.notes.highestLocalRevisions)
      for (const actorKey of summary.keys()) boundKeys.add(`${slug}\u0000${actorKey}`);
    for (const key of boundKeys) {
      const separator = key.indexOf("\u0000");
      const slug = key.slice(0, separator);
      const actorKey = key.slice(separator + 1);
      const old = previous.notes.highestLocalRevisions.get(slug)?.get(actorKey);
      const next = data.notes.highestLocalRevisions.get(slug)?.get(actorKey);
      if (next === undefined) {
        if (old !== undefined)
          statements.push(
            prepared(
              this.env.DB,
              "DELETE FROM sync_note_actor_bounds WHERE account_id = ? AND slug = ? AND actor_id = ?",
              accountId,
              slug,
              blob(Uint8Array.from(actorKey.match(/../g) ?? [], (part) => parseInt(part, 16)))
            )
          );
      } else if (old !== next) {
        statements.push(
          prepared(
            this.env.DB,
            "INSERT INTO sync_note_actor_bounds (account_id, slug, actor_id, highest_local_revision) VALUES (?, ?, ?, ?) ON CONFLICT(account_id, slug, actor_id) DO UPDATE SET highest_local_revision = excluded.highest_local_revision",
            accountId,
            slug,
            blob(Uint8Array.from(actorKey.match(/../g) ?? [], (part) => parseInt(part, 16))),
            decimal(next, "note revision bound")
          )
        );
      }
    }
    const previousProgress = new Set(progressSolvedSlugs(previous.progress));
    const nextProgress = new Set(progressSolvedSlugs(data.progress));
    for (const slug of new Set([...mirrorProgress.keys(), ...previousProgress, ...nextProgress])) {
      if (!nextProgress.has(slug)) {
        if (mirrorProgress.has(slug) || previousProgress.has(slug)) {
          statements.push(
            prepared(
              this.env.DB,
              "DELETE FROM progress WHERE user_id = ? AND slug = ?",
              accountId,
              slug
            )
          );
        }
        continue;
      }
      if (!previousProgress.has(slug) || !mirrorProgress.has(slug)) {
        statements.push(
          prepared(
            this.env.DB,
            "INSERT INTO progress (user_id, slug, solved_at) VALUES (?, ?, ?) ON CONFLICT(user_id, slug) DO UPDATE SET solved_at = excluded.solved_at",
            accountId,
            slug,
            mirrorProgress.get(slug)?.solved_at ?? now
          )
        );
      }
    }
    const previousNotes = new Set(
      Array.from(previous.notes.notes.entries())
        .filter(([, record]) => record.operation.kind === "value")
        .map(([slug]) => slug)
    );
    const nextNotes = new Map(
      Array.from(data.notes.notes.entries()).filter(
        ([, record]) => record.operation.kind === "value"
      )
    );
    for (const slug of new Set([...mirrorNotes.keys(), ...previousNotes, ...nextNotes.keys()])) {
      const record = nextNotes.get(slug);
      if (!record) {
        if (mirrorNotes.has(slug) || previousNotes.has(slug)) {
          statements.push(
            prepared(
              this.env.DB,
              "DELETE FROM notes WHERE user_id = ? AND slug = ?",
              accountId,
              slug
            )
          );
        }
        continue;
      }
      const previousRecord = previous.notes.notes.get(slug);
      if (
        !previousNotes.has(slug) ||
        !mirrorNotes.has(slug) ||
        previousRecord?.serverRevision !== record.serverRevision
      ) {
        if (record.operation.kind !== "value") continue;
        statements.push(
          prepared(
            this.env.DB,
            "INSERT INTO notes (user_id, slug, note, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, slug) DO UPDATE SET note = excluded.note, updated_at = excluded.updated_at",
            accountId,
            slug,
            decodeProblemNoteText(record.operation.bytes),
            now
          )
        );
      }
    }
    if (options.markLegacyMigrated) {
      statements.push(
        prepared(
          this.env.DB,
          "INSERT INTO sync_legacy_migrations (account_id, completed_revision) VALUES (?, ?) ON CONFLICT(account_id) DO UPDATE SET completed_revision = excluded.completed_revision",
          accountId,
          decimal(data.serverRevision, "legacy migration revision")
        )
      );
    }
    await this.env.DB.batch(statements);
  }
}
