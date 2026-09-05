import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkRevocationHandle,
  deleteAccountData,
  handleClerkUserDeletedWebhook,
  hashRevocationHandle,
  isAccountDeleted,
  registerRevocationHandle,
  type VerifyClerkWebhook,
} from "../lib/sync/account-deletion";
import { accountRouteName, isAccountRouteName } from "../lib/sync/account-route";

type Row = Record<string, unknown>;

class Statement implements D1PreparedStatement {
  constructor(
    private readonly database: Database,
    readonly query: string,
    readonly values: unknown[] = []
  ) {}
  bind(...values: unknown[]): D1PreparedStatement {
    return new Statement(this.database, this.query, values);
  }
  all<T = Row>(): Promise<D1Result<T>> {
    return Promise.resolve({
      results: this.database.select(this.query, this.values) as T[],
      success: true,
    });
  }
  first<T = Row>(): Promise<T | null> {
    return Promise.resolve(
      (this.database.select(this.query, this.values)[0] as T | undefined) ?? null
    );
  }
  run(): Promise<D1Result<never>> {
    this.database.apply(this.query, this.values);
    return Promise.resolve({ results: [], success: true });
  }
}

class Database implements D1Database {
  private tables = new Map<string, Row[]>();
  fail = false;
  failAtStatement: number | undefined;
  prepare(query: string): D1PreparedStatement {
    return new Statement(this, query);
  }
  seed(table: string, row: Row): void {
    const rows = this.tables.get(table) ?? [];
    rows.push({ ...row });
    this.tables.set(table, rows);
  }
  async batch<T = Row>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    if (this.fail) throw new Error("D1 unavailable");
    const snapshot = new Map(
      Array.from(this.tables.entries()).map(([table, rows]) => [
        table,
        rows.map((row) => ({ ...row })),
      ])
    );
    try {
      for (const [index, statement] of statements.entries()) {
        if (!(statement instanceof Statement)) throw new Error("unexpected statement");
        this.apply(statement.query, statement.values);
        if (this.failAtStatement === index) throw new Error("injected D1 failure");
      }
    } catch (error) {
      this.tables = snapshot;
      throw error;
    }
    return statements.map(() => ({ results: [], success: true })) as D1Result<T>[];
  }
  private rows(table: string): Row[] {
    const rows = this.tables.get(table) ?? [];
    this.tables.set(table, rows);
    return rows;
  }
  private delete(table: string, key: string, value: unknown): void {
    this.tables.set(
      table,
      this.rows(table).filter((row) => row[key] !== value)
    );
  }
  apply(query: string, values: unknown[]): void {
    if (query.startsWith("INSERT INTO sync_account_deletions")) {
      if (!this.rows("sync_account_deletions").some((row) => row.account_route_key === values[0])) {
        this.rows("sync_account_deletions").push({
          account_route_key: values[0],
          deleted_at: values[1],
        });
      }
      return;
    }
    if (query.startsWith("INSERT INTO sync_revocation_handles") && query.includes("SELECT")) {
      for (const actor of this.rows("sync_actors").filter((row) => row.account_id === values[1])) {
        const hash = actor.revocation_handle_hash;
        const existing = this.rows("sync_revocation_handles").find((row) =>
          equal(row.handle_hash, hash)
        );
        if (existing) Object.assign(existing, { deleted_at: existing.deleted_at ?? values[0] });
        else
          this.rows("sync_revocation_handles").push({
            handle_hash: hash,
            deleted_at: values[0],
          });
      }
      return;
    }
    if (query.startsWith("INSERT INTO sync_revocation_handles")) {
      const existing = this.rows("sync_revocation_handles").find((row) =>
        equal(row.handle_hash, values[0])
      );
      if (!existing) {
        this.rows("sync_revocation_handles").push({ handle_hash: values[0], deleted_at: null });
      }
      return;
    }
    const deletion = query.match(/^DELETE FROM (\w+) WHERE (?:user_id|account_id) = \?/);
    if (deletion) {
      this.delete(deletion[1], query.includes("user_id") ? "user_id" : "account_id", values[0]);
      return;
    }
    throw new Error(`Unsupported SQL: ${query}`);
  }
  select(query: string, values: unknown[]): Row[] {
    const from = query.match(/FROM (\w+)/)?.[1];
    if (!from) throw new Error(`Unsupported SQL: ${query}`);
    const rows = this.rows(from);
    if (query.includes("WHERE handle_hash = ?"))
      return rows.filter((row) => equal(row.handle_hash, values[0]));
    if (query.includes("WHERE account_id = ?"))
      return rows.filter((row) => row.account_id === values[0]);
    if (query.includes("WHERE account_route_key = ?"))
      return rows.filter((row) => row.account_route_key === values[0]);
    return rows;
  }
}

function equal(left: unknown, right: unknown): boolean {
  const a = left instanceof ArrayBuffer ? new Uint8Array(left) : left;
  const b = right instanceof ArrayBuffer ? new Uint8Array(right) : right;
  return a instanceof Uint8Array && b instanceof Uint8Array
    ? a.length === b.length && a.every((value, index) => value === b[index])
    : a === b;
}

function handle(seed: number): Uint8Array {
  const value = new Uint8Array(32);
  value.fill(seed);
  return value;
}

const routeKey = `cjet-v1-${"a".repeat(43)}`;

function webhook(type: string, id?: string): VerifyClerkWebhook {
  return async () =>
    ({
      type,
      object: "event",
      data: { object: "user", id, deleted: true },
      event_attributes: { http_request: { client_ip: "", user_agent: "" } },
    }) as never;
}

describe("account deletion and Revocation Handle tombstones", () => {
  it("accepts only opaque HMAC-shaped account routes", async () => {
    const generated = await accountRouteName("test-secret", "user_42");
    assert.equal(isAccountRouteName(generated), true);
    assert.equal(isAccountRouteName("cjet-v1-user_42"), false);
    assert.equal(isAccountRouteName("user_42"), false);
  });

  it("hashes and checks handles without exposing unknown or active account state", async () => {
    const database = new Database();
    const account = routeKey;
    const raw = handle(1);
    await registerRevocationHandle({ DB: database }, account, raw);
    assert.deepEqual(await checkRevocationHandle({ DB: database }, raw), { deleted: false });
    assert.deepEqual(await checkRevocationHandle({ DB: database }, handle(2)), { deleted: false });
  });

  it("atomically retains handle and account tombstones while removing account state", async () => {
    const database = new Database();
    const account = "user_delete";
    const raw = handle(3);
    const hash = await hashRevocationHandle(raw);
    database.seed("sync_accounts", { account_id: account, server_revision: "9" });
    database.seed("sync_actors", {
      account_id: account,
      revocation_handle_hash: hash,
      is_legacy: 0,
    });
    for (const table of [
      "progress",
      "notes",
      "sync_progress_directory",
      "sync_progress_shards",
      "sync_problem_notes",
      "sync_note_actor_bounds",
      "sync_causal_summaries",
      "sync_legacy_migrations",
    ])
      database.seed(table, { account_id: account, user_id: account });
    const result = await deleteAccountData(
      { DB: database },
      account,
      routeKey,
      () => 1_700_000_000_000
    );
    assert.deepEqual(result, { deleted: true, tombstonedHandleCount: 1 });
    assert.deepEqual(await checkRevocationHandle({ DB: database }, raw), { deleted: true });
    assert.equal(await isAccountDeleted({ DB: database }, routeKey), true);
    assert.equal(await isAccountDeleted({ DB: database }, `cjet-v1-${"c".repeat(43)}`), false);
    const rollbackAccount = "user_rollback";
    const rollbackRouteKey = `cjet-v1-${"b".repeat(43)}`;
    database.seed("sync_accounts", { account_id: rollbackAccount, server_revision: "1" });
    database.seed("sync_actors", {
      account_id: rollbackAccount,
      revocation_handle_hash: await hashRevocationHandle(handle(4)),
      is_legacy: 0,
    });
    database.failAtStatement = 4;
    await assert.rejects(() =>
      deleteAccountData({ DB: database }, rollbackAccount, rollbackRouteKey)
    );
    assert.equal(await isAccountDeleted({ DB: database }, rollbackRouteKey), false);
  });

  it("only dispatches a verified user.deleted event and preserves webhook retry errors", async () => {
    let deleted: string | undefined;
    const callback = async (account: string) => {
      deleted = account;
    };
    const request = new Request("https://example.test/api/webhooks/clerk", { method: "POST" });
    assert.equal(
      (await handleClerkUserDeletedWebhook(request, callback, webhook("user.updated"))).status,
      204
    );
    assert.equal(
      (await handleClerkUserDeletedWebhook(request, callback, webhook("user.deleted", "user_42")))
        .status,
      204
    );
    assert.equal(deleted, "user_42");
    assert.equal(
      (await handleClerkUserDeletedWebhook(request, callback, webhook("user.deleted"))).status,
      400
    );
    const failure = await handleClerkUserDeletedWebhook(
      request,
      async () => {
        throw new Error("persistence");
      },
      webhook("user.deleted", "user_43")
    );
    assert.equal(failure.status, 500);
  });
});
