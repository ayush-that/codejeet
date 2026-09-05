import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FAILURE_POLICIES,
  classifyFailure,
  createDiagnostic,
  mayClearAccountData,
  preservesAccountData,
  retryDelayMs,
  type DiagnosticInput,
  type FailureCode,
} from "../lib/sync/failure-policy";

describe("synchronization failure policy", () => {
  it("classifies every failure code with an explicit retry and retention policy", () => {
    const codes = Object.keys(FAILURE_POLICIES) as FailureCode[];
    assert.ok(codes.length > 0);
    for (const code of codes) {
      const failure = classifyFailure(code, 0);
      assert.equal(failure.code, code);
      assert.ok(
        ["permanent", "transient", "confirmed_deletion"].includes(failure.policy.disposition)
      );
      assert.ok(
        ["stop", "backoff", "restart_bootstrap", "clear_account"].includes(failure.policy.retry)
      );
      assert.equal(mayClearAccountData(failure), code === "account_deleted");
      assert.equal(preservesAccountData(failure), code !== "account_deleted");
      assert.equal(
        failure.policy.recovery,
        code === "account_deleted"
          ? "clear_account"
          : code === "bootstrap_overflow" || code === "session_incompatible"
            ? "restart_bootstrap"
            : [
                  "invalid_actor",
                  "invalid_dot",
                  "unsafe_counter",
                  "unknown_slug",
                  "oversized_note",
                  "invalid_note",
                  "actor_limit",
                  "rejected_item",
                ].includes(code)
              ? "replace_invalid_record"
              : "preserve_all"
      );
    }
  });

  it("stops permanent record failures and retries persistence failures silently with bounded backoff", () => {
    const permanent = classifyFailure("unknown_slug", 4);
    assert.equal(permanent.policy.retry, "stop");
    assert.equal(permanent.policy.recovery, "replace_invalid_record");
    assert.equal(retryDelayMs(permanent, 0), null);
    assert.equal(permanent.itemIndex, 4);

    const transient = classifyFailure("d1_transaction_failed");
    assert.equal(transient.policy.retry, "backoff");
    assert.deepEqual(
      [retryDelayMs(transient, 0), retryDelayMs(transient, 1), retryDelayMs(transient, 20)],
      [250, 500, 30_000]
    );
    assert.equal(transient.policy.preserveAccountData, true);
  });

  it("closes abusive connections without permitting partial application", () => {
    const failure = classifyFailure("abusive_connection");
    assert.equal(failure.policy.connection, "close");
    assert.equal(failure.policy.forbidPartialApply, true);
    assert.equal(failure.policy.recovery, "preserve_all");
    assert.equal(failure.policy.preserveAccountData, true);
  });

  it("allows cache clearing only after confirmed account deletion", () => {
    assert.equal(mayClearAccountData(classifyFailure("account_deleted")), true);
    assert.equal(mayClearAccountData(classifyFailure("authentication_expired")), false);
    assert.equal(mayClearAccountData(classifyFailure("canonical_corrupt")), false);
  });

  it("emits only bounded allowlisted fields and one-way correlation hashes", async () => {
    const accountId = "user_private_identifier";
    const actorId = new Uint8Array(16).fill(7);
    const diagnostic = await createDiagnostic({
      eventCode: "request_rejected",
      failureCode: "unknown_slug",
      protocolVersion: 1,
      messageType: 2,
      byteCount: 65_536,
      itemCount: 100,
      itemIndex: 3,
      serverRevision: BigInt(42),
      accountId,
      actorId,
      clerkToken: "clerk_token_must_not_appear",
      noteText: "private Problem Note must not appear",
      frame: "full binary frame must not appear",
      revocationHandle: "revocation_handle_must_not_appear",
    } as unknown as DiagnosticInput);
    const redacted = JSON.stringify(diagnostic);
    assert.equal(diagnostic.failureCategory, "domain");
    assert.equal(diagnostic.retryClass, "permanent");
    assert.equal(diagnostic.serverRevision, "42");
    assert.match(diagnostic.accountHash ?? "", /^[0-9a-f]{16}$/);
    assert.match(diagnostic.actorHash ?? "", /^[0-9a-f]{16}$/);
    assert.doesNotMatch(
      redacted,
      /user_private_identifier|clerk_token|private Problem Note|full binary frame|revocation_handle/
    );
    assert.notEqual(diagnostic.accountHash, accountId);
    assert.notEqual(diagnostic.actorHash, "0707070707070707");
  });

  it("does not accept prototype names or unbounded diagnostic values as codes", async () => {
    assert.throws(
      () => classifyFailure("toString" as FailureCode),
      /unknown synchronization failure code/
    );
    const diagnostic = await createDiagnostic({
      eventCode: "not-an-event",
      failureCode: "toString",
      protocolVersion: 256,
      messageType: 1_000_001,
      byteCount: Number.MAX_SAFE_INTEGER,
      itemCount: -1,
      serverRevision: BigInt(-1),
    } as unknown as DiagnosticInput);
    assert.deepEqual(diagnostic, {
      eventCode: "request_rejected",
    });
  });
});
