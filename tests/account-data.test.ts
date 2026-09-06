import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AccountDataCoordinator,
  LEGACY_ACTOR_ID,
  MAX_PROGRESS_SHARD_BYTES,
  planShards,
  type AccountMutation,
} from "../lib/sync/account-data";
import { ACTOR_ID_BYTES, actorIdKey, type ProgressState } from "../lib/sync/domain";
import { committedProblemRegistry } from "../lib/problem-registry";

type Row = Record<string, unknown>;

function copyValue(value: unknown): unknown {
  if (value instanceof Uint8Array) return value.slice();
  if (value instanceof ArrayBuffer) return value.slice(0);
  return value;
}

class MemoryStatement implements D1PreparedStatement {
  constructor(
    readonly database: MemoryD1,
    readonly query: string,
    readonly values: unknown[] = []
  ) {}

  bind(...values: unknown[]): D1PreparedStatement {
    return new MemoryStatement(this.database, this.query, values);
  }

  all<T = Row>(): Promise<D1Result<T>> {
    return Promise.resolve({
      results: this.database.select(this.query, this.values) as T[],
      success: true,
    });
  }

  first<T = Row>(): Promise<T | null> {
    const rows = this.database.select(this.query, this.values) as T[];
    return Promise.resolve(rows[0] ?? null);
  }

  run(): Promise<D1Result<never>> {
    this.database.apply(this.query, this.values);
    return Promise.resolve({ results: [], success: true });
  }
}

class MemoryD1 implements D1Database {
  private rows = new Map<string, Row[]>();
  failAtStatement: number | undefined;
  failQuery: string | undefined;
  batchDelay = 0;

  prepare(query: string): D1PreparedStatement {
    return new MemoryStatement(this, query);
  }

  seed(table: string, row: Row): void {
    this.table(table).push(
      Object.fromEntries(Object.entries(row).map(([key, value]) => [key, copyValue(value)]))
    );
  }

  async batch<T = Row>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    if (this.batchDelay > 0) await new Promise((resolve) => setTimeout(resolve, this.batchDelay));
    const snapshot = new Map(
      Array.from(this.rows.entries()).map(([table, rows]) => [
        table,
        rows.map((row) =>
          Object.fromEntries(Object.entries(row).map(([key, value]) => [key, copyValue(value)]))
        ),
      ])
    );
    const original = this.rows;
    this.rows = snapshot;
    try {
      for (let index = 0; index < statements.length; index++) {
        const statement = statements[index];
        if (!(statement instanceof MemoryStatement)) throw new Error("unknown statement");
        this.apply(statement.query, statement.values);
        if (this.failAtStatement === index || statement.query.includes(this.failQuery ?? "\0")) {
          throw new Error("injected D1 failure");
        }
      }
      this.rows = snapshot;
      this.failAtStatement = undefined;
      this.failQuery = undefined;
      return statements.map(() => ({ results: [], success: true })) as D1Result<T>[];
    } catch (error) {
      this.rows = original;
      this.failAtStatement = undefined;
      this.failQuery = undefined;
      throw error;
    }
  }

  private table(name: string): Row[] {
    const rows = this.rows.get(name) ?? [];
    this.rows.set(name, rows);
    return rows;
  }

  apply(query: string, values: unknown[]): void {
    const insert = query.match(/INSERT INTO (\w+) \(([^)]+)\) VALUES/);
    if (insert) {
      const table = insert[1];
      const columns = insert[2].split(",").map((column) => column.trim());
      const row = Object.fromEntries(
        columns.map((column, index) => [column, copyValue(values[index])])
      );
      const rows = this.table(table);
      const accountId = row.account_id ?? row.user_id;
      const keys =
        table === "sync_accounts"
          ? ["account_id"]
          : table === "sync_legacy_migrations"
            ? ["account_id"]
            : table === "sync_note_actor_bounds"
              ? ["account_id", "slug", "actor_id"]
              : table === "sync_progress_shards"
                ? ["account_id", "shard_prefix"]
                : table === "sync_progress_directory" || table === "sync_problem_notes"
                  ? ["account_id", "slug"]
                  : table === "progress" || table === "notes"
                    ? ["user_id", "slug"]
                    : ["account_id", "actor_id"];
      const existing = rows.findIndex((candidate) =>
        keys.every((key) => equal(candidate[key], row[key]))
      );
      if (existing >= 0) rows[existing] = row;
      else rows.push(row);
      if (accountId === undefined) throw new Error("missing account");
      return;
    }
    const deletion = query.match(
      /DELETE FROM (\w+) WHERE (account_id|user_id) = \?(?: AND (\w+) = \?(?: AND (\w+) = \?)?)?/
    );
    if (deletion) {
      const rows = this.table(deletion[1]);
      this.rows.set(
        deletion[1],
        rows.filter((row) => {
          if (row[deletion[2]] !== values[0]) return true;
          if (deletion[3] && !equal(row[deletion[3]], values[1])) return true;
          if (deletion[4] && !equal(row[deletion[4]], values[2])) return true;
          return false;
        })
      );
      return;
    }
    throw new Error(`Unsupported test SQL: ${query}`);
  }

  select(query: string, values: unknown[]): Row[] {
    const match = query.match(/SELECT (.+) FROM (\w+) WHERE (account_id|user_id) = \?/);
    if (!match) throw new Error(`Unsupported test SELECT: ${query}`);
    const columns = match[1].split(",").map((column) => column.trim());
    return this.table(match[2])
      .filter((row) => row[match[3]] === values[0])
      .map((row) => Object.fromEntries(columns.map((column) => [column, copyValue(row[column])])))
      .sort((left, right) =>
        String(left.slug ?? left.account_id).localeCompare(String(right.slug ?? right.account_id))
      );
  }
}

function equal(left: unknown, right: unknown): boolean {
  if (left instanceof ArrayBuffer) left = new Uint8Array(left);
  if (right instanceof ArrayBuffer) right = new Uint8Array(right);
  if (left instanceof Uint8Array && right instanceof Uint8Array) {
    return left.length === right.length && left.every((byte, index) => byte === right[index]);
  }
  return left === right;
}

function actor(seed: number): Uint8Array {
  const value = new Uint8Array(ACTOR_ID_BYTES);
  value.fill(seed);
  return value;
}

function hash(seed: number): Uint8Array {
  const value = new Uint8Array(32);
  value.fill(seed);
  return value;
}

function object(database: MemoryD1): AccountDataCoordinator {
  return new AccountDataCoordinator({ DB: database });
}

function instrumented(
  database: MemoryD1,
  onPersisted: (event: { kind: "actor" | "mutation"; serverRevision: bigint }) => void
): AccountDataCoordinator {
  return new AccountDataCoordinator({ DB: database }, (event) =>
    onPersisted({ kind: event.kind, serverRevision: event.serverRevision })
  );
}

const account = "user_123";
const slug = "01-matrix";

async function registered(database: MemoryD1, value = actor(1)): Promise<AccountDataCoordinator> {
  const durableObject = object(database);
  await durableObject.registerActor(account, value, hash(1));
  return durableObject;
}

function progress(
  actorId: Uint8Array,
  counter: number,
  kind: "add" | "remove" = "add"
): AccountMutation {
  return { type: "progress", mutation: { kind, actorId, counter: BigInt(counter), slug } };
}

describe("Account Data Durable Object persistence", () => {
  it("serializes concurrent mutations and allocates contiguous revisions", async () => {
    const database = new MemoryD1();
    database.batchDelay = 1;
    const durableObject = await registered(database);
    const results = await Promise.all([
      durableObject.applyMutations(account, [progress(actor(1), 0)]),
      durableObject.applyMutations(account, [
        {
          type: "note",
          mutation: {
            slug,
            actorId: actor(1),
            localRevision: BigInt(0),
            operation: { kind: "value", bytes: new TextEncoder().encode("private") },
          },
        },
      ]),
    ]);
    assert.deepEqual(
      results.map((result) => result.serverRevision),
      [BigInt(1), BigInt(2)]
    );
    assert.equal(results[1].current.serverRevision, BigInt(2));
  });

  it("bounds concurrent bootstrap sessions and prunes expired sessions", async () => {
    const database = new MemoryD1();
    let now = 1_000_000;
    const durableObject = new AccountDataCoordinator({ DB: database }, undefined, () => now * 1000);
    await durableObject.registerActor(account, actor(1), hash(1));
    for (let index = 0; index < 16; index++) {
      await durableObject.beginBootstrap(
        account,
        `session-${String(index).padStart(2, "0")}-abcdefghijkl`,
        now + 300,
        actor(1),
        hash(1)
      );
    }
    await assert.rejects(() =>
      durableObject.beginBootstrap(
        account,
        "session-over-cap-abcdefghijkl",
        now + 300,
        actor(1),
        hash(1)
      )
    );
    now += 300;
    await durableObject.beginBootstrap(
      account,
      "session-after-expiry-abcdefghijkl",
      now + 300,
      actor(1),
      hash(1)
    );
  });

  it("rejects invalid HELLO vectors before installing an Actor or session", async () => {
    const durableObject = await registered(new MemoryD1());
    const expiresAt = Math.floor(Date.now() / 1000) + 300;
    const proposedActor = actor(2);
    const unknownActor = actor(3);
    const invalidCausal = await durableObject.beginBootstrap(
      account,
      "invalid-causal-abcdefghijkl",
      expiresAt,
      proposedActor,
      hash(2),
      BigInt(0),
      [{ actorId: unknownActor, counter: BigInt(0) }]
    );
    assert.deepEqual(invalidCausal, { status: "rejected", reason: "invalid_record" });
    const afterCausal = await durableObject.getCanonical(account);
    assert.equal(afterCausal.actors.size, 2);
    const validAfterCausal = await durableObject.beginBootstrap(
      account,
      "invalid-causal-abcdefghijkl",
      expiresAt,
      proposedActor,
      hash(2),
      BigInt(0),
      []
    );
    assert.equal(validAfterCausal.status, "started");

    const invalidRevision = await durableObject.beginBootstrap(
      account,
      "invalid-revision-abcdefghijkl",
      expiresAt,
      actor(4),
      hash(4),
      BigInt(1),
      []
    );
    assert.deepEqual(invalidRevision, { status: "rejected", reason: "invalid_record" });
    assert.equal((await durableObject.getCanonical(account)).actors.size, 3);
  });

  it("does not allocate a revision for repeated note or stale Progress mutations", async () => {
    const durableObject = await registered(new MemoryD1());
    const first = await durableObject.applyMutations(account, [progress(actor(1), 0)]);
    const repeated = await durableObject.applyMutations(account, [progress(actor(1), 0)]);
    assert.equal(first.serverRevision, BigInt(1));
    assert.equal(repeated.serverRevision, BigInt(1));
    const note: AccountMutation = {
      type: "note",
      mutation: {
        slug,
        actorId: actor(1),
        localRevision: BigInt(4),
        operation: { kind: "value", bytes: new TextEncoder().encode("first") },
      },
    };
    const accepted = await durableObject.applyMutations(account, [note]);
    const stale = await durableObject.applyMutations(account, [note]);
    assert.equal(accepted.serverRevision, BigInt(2));
    assert.equal(stale.serverRevision, BigInt(2));
    assert.equal(stale.results[0].accepted, false);
  });

  it("joins compacted Progress deltas out of order and deduplicates repeats", async () => {
    const durableObject = await registered(new MemoryD1());
    const delta: AccountMutation = {
      type: "progress",
      mutation: {
        kind: "delta",
        state: {
          adds: [{ slug, dot: { actorId: actor(1), counter: BigInt(0) } }],
          causalSummary: new Map([[actorIdKey(actor(1)), BigInt(5)]]),
          removed: new Map(),
        },
      },
    };
    const first = await durableObject.applyMutations(account, [delta]);
    const repeated = await durableObject.applyMutations(account, [delta]);
    assert.equal(first.acceptedCount, 1);
    assert.equal(first.serverRevision, BigInt(1));
    assert.equal(repeated.acceptedCount, 0);
    assert.equal(repeated.serverRevision, BigInt(1));
    assert.equal(
      (await durableObject.getCanonical(account)).progress.causalSummary.get(actorIdKey(actor(1))),
      BigInt(5)
    );
  });

  it("rolls back a failed D1 batch and reconstructs after object replacement", async () => {
    const database = new MemoryD1();
    const durableObject = await registered(database);
    await durableObject.applyMutations(account, [progress(actor(1), 0)]);
    database.failAtStatement = 2;
    await assert.rejects(() => durableObject.applyMutations(account, [progress(actor(1), 1)]));
    const afterFailure = await durableObject.getCanonical(account);
    assert.equal(afterFailure.serverRevision, BigInt(1));
    assert.equal(afterFailure.progress.adds.length, 1);
    const replacement = object(database);
    const reconstructed = await replacement.getCanonical(account);
    assert.equal(reconstructed.serverRevision, BigInt(1));
    assert.equal(reconstructed.progress.adds.length, 1);
  });

  it("rolls back canonical changes when the accompanying Loro update fails", async () => {
    const database = new MemoryD1();
    const durableObject = object(database);
    await durableObject.registerLegacyActor(account, hash(0));
    database.failQuery = "INSERT INTO sync_loro_updates";
    const updateStatement = database
      .prepare(
        "INSERT INTO sync_loro_updates (account_id, revision, update_data, byte_length, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(account, 1, new Uint8Array([1]), 1, 1);

    await assert.rejects(() =>
      durableObject.applyLegacyState(account, { [slug]: true }, {}, [updateStatement])
    );

    const canonical = await durableObject.getCanonical(account);
    assert.equal(canonical.serverRevision, BigInt(0));
    assert.equal(canonical.progress.adds.length, 0);
    assert.equal(
      database.select("SELECT revision FROM sync_loro_updates WHERE account_id = ?", [account])
        .length,
      0
    );
  });

  it("enforces the installation Actor limit while retaining the legacy Actor", async () => {
    const database = new MemoryD1();
    const durableObject = object(database);
    for (let seed = 1; seed <= 64; seed++) {
      await durableObject.registerActor(account, actor(seed), hash(seed));
    }
    await assert.rejects(() => durableObject.registerActor(account, actor(200), hash(200)));
    await assert.rejects(() =>
      durableObject.registerActor(account, new Uint8Array(ACTOR_ID_BYTES), hash(0))
    );
    await durableObject.registerLegacyActor(account, hash(0));
    const canonical = await durableObject.getCanonical(account);
    assert.equal(canonical.actors.size, 65);
    assert.equal(canonical.actors.get("00000000000000000000000000000000")?.isLegacy, true);
  });

  it("keeps shard encodings bounded and directory placement deterministic", async () => {
    const slugs = committedProblemRegistry.problems.map((entry) => entry.slug);
    const state: ProgressState = {
      adds: slugs.map((currentSlug, counter) => ({
        slug: currentSlug,
        dot: { actorId: actor(1), counter: BigInt(counter) },
      })),
      causalSummary: new Map([[actorIdKey(actor(1)), BigInt(slugs.length - 1)]]),
      removed: new Map(),
    };
    const first = await planShards(state, new Map(), new Map());
    assert.ok(first.shards.size > 1);
    for (const shard of first.shards.values()) {
      assert.ok(shard.encoded.length <= MAX_PROGRESS_SHARD_BYTES);
    }
    const second = await planShards(state, first.shards, first.directory);
    assert.deepEqual(Array.from(first.directory.entries()), Array.from(second.directory.entries()));
  });

  it("keeps newly hashed records outside sparse prior shard leaves", async () => {
    const initial = committedProblemRegistry.problems.slice(0, 1_500).map((entry) => entry.slug);
    const expanded = committedProblemRegistry.problems.map((entry) => entry.slug);
    const makeState = (slugs: string[]): ProgressState => ({
      adds: slugs.map((slug, counter) => ({
        slug,
        dot: { actorId: actor(1), counter: BigInt(counter) },
      })),
      causalSummary: new Map([[actorIdKey(actor(1)), BigInt(slugs.length - 1)]]),
      removed: new Map(),
    });
    const first = await planShards(makeState(initial), new Map(), new Map());
    const second = await planShards(makeState(expanded), first.shards, first.directory);
    const prefixes = Array.from(second.shards.keys()).sort();
    for (let index = 1; index < prefixes.length; index++) {
      assert.equal(prefixes[index].startsWith(prefixes[index - 1]), false);
    }
    for (const [slug, prefix] of second.directory) {
      assert.ok(second.shards.has(prefix));
      const shard = second.shards.get(prefix);
      assert.ok(shard?.state.adds.some((add) => add.slug === slug));
    }
  });

  it("emits persistence events only after a successful D1 batch", async () => {
    const database = new MemoryD1();
    const events: Array<{ kind: "actor" | "mutation"; serverRevision: bigint }> = [];
    const durableObject = instrumented(database, (event) => events.push(event));
    await durableObject.registerActor(account, actor(1), hash(1));
    assert.deepEqual(events, [{ kind: "actor", serverRevision: BigInt(0) }]);
    database.failAtStatement = 2;
    await assert.rejects(() => durableObject.applyMutations(account, [progress(actor(1), 0)]));
    assert.deepEqual(events, [{ kind: "actor", serverRevision: BigInt(0) }]);
    await durableObject.applyMutations(account, [progress(actor(1), 0)]);
    assert.deepEqual(events, [
      { kind: "actor", serverRevision: BigInt(0) },
      { kind: "mutation", serverRevision: BigInt(1) },
    ]);
  });

  it("imports legacy rows once in slug order and retains the migration marker", async () => {
    const database = new MemoryD1();
    database.seed("progress", {
      user_id: account,
      slug: "add-two-numbers",
      solved_at: "2026-01-02T00:00:00.000Z",
    });
    database.seed("progress", {
      user_id: account,
      slug: "01-matrix",
      solved_at: "2026-01-01T00:00:00.000Z",
    });
    database.seed("progress", {
      user_id: account,
      slug: "renamed-legacy-problem",
      solved_at: "2026-01-01T00:00:00.000Z",
    });
    database.seed("notes", {
      user_id: account,
      slug: "add-two-numbers",
      note: "legacy note",
      updated_at: "2026-01-03T00:00:00.000Z",
    });

    const firstObject = object(database);
    const [first, concurrent] = await Promise.all([
      firstObject.getCanonical(account),
      firstObject.getCanonical(account),
    ]);
    assert.equal(first.serverRevision, BigInt(3));
    assert.equal(concurrent.serverRevision, BigInt(3));
    assert.equal(first.actors.get(LEGACY_ACTOR_ID)?.isLegacy, true);
    assert.deepEqual(
      first.progress.adds.map((entry) => entry.slug),
      ["01-matrix", "add-two-numbers"]
    );
    assert.equal(first.notes.notes.get("add-two-numbers")?.serverRevision, BigInt(3));

    const second = await object(database).getCanonical(account);
    assert.equal(second.serverRevision, BigInt(3));
    assert.equal(second.progress.adds.length, 2);
    assert.equal(second.notes.notes.size, 1);
  });

  it("serializes legacy add/remove and note delete mutations through the legacy Actor", async () => {
    const database = new MemoryD1();
    const durableObject = object(database);
    await durableObject.getCanonical(account);

    const added = await durableObject.applyLegacyProgress(account, slug, true);
    const removed = await durableObject.applyLegacyProgress(account, slug, false);
    const noted = await durableObject.applyLegacyNote(account, slug, "private");
    const deleted = await durableObject.applyLegacyNote(account, slug, "");
    assert.deepEqual(
      [added.serverRevision, removed.serverRevision, noted.serverRevision, deleted.serverRevision],
      [BigInt(1), BigInt(2), BigInt(3), BigInt(4)]
    );
    const canonical = await durableObject.getCanonical(account);
    assert.equal(canonical.progress.adds.length, 0);
    assert.equal(canonical.notes.notes.get(slug)?.operation.kind, "delete");
    assert.equal(canonical.actors.get(LEGACY_ACTOR_ID)?.isLegacy, true);
    await assert.rejects(() => durableObject.applyLegacyProgress(account, "not-a-problem", true));
  });

  it("rolls back canonical and compatibility mirrors together", async () => {
    const database = new MemoryD1();
    const durableObject = object(database);
    await durableObject.getCanonical(account);
    database.failAtStatement = 4;
    await assert.rejects(() => durableObject.applyLegacyProgress(account, slug, true));
    const canonical = await durableObject.getCanonical(account);
    assert.equal(canonical.serverRevision, BigInt(0));
    assert.equal(canonical.progress.adds.length, 0);
    const mirror = await database
      .prepare("SELECT slug, solved_at FROM progress WHERE user_id = ?")
      .bind(account)
      .all();
    assert.equal(mirror.results.length, 0);
  });
});
