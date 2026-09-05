import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isIntentForActivation,
  shouldInvalidateForLifecycleBroadcast,
  shouldExposeLocalAccount,
} from "../lib/learning-data/lifecycle-visibility";

describe("Learning Data lifecycle visibility", () => {
  it("retains the local account through temporary Clerk auth loss", () => {
    assert.equal(
      shouldExposeLocalAccount(
        { kind: "temporary-auth-loss", accountId: "account-a", epoch: 2 },
        { isLoaded: true, isSignedIn: false, userId: null }
      ),
      true
    );
    assert.equal(
      shouldExposeLocalAccount(
        { kind: "temporary-auth-loss", accountId: "account-a", epoch: 2 },
        { isLoaded: false, isSignedIn: false, userId: null }
      ),
      true
    );
  });

  it("hides the prior account as soon as Clerk identifies another user", () => {
    assert.equal(
      shouldExposeLocalAccount(
        { kind: "active", accountId: "account-a", epoch: 3 },
        { isLoaded: true, isSignedIn: true, userId: "account-b" }
      ),
      false
    );
  });

  it("replays only intents for the activation identity and epoch", () => {
    assert.equal(
      isIntentForActivation({ accountId: "account-a", epoch: 8 }, "account-a", 9, 8),
      true
    );
    assert.equal(isIntentForActivation({ accountId: null, epoch: 8 }, "account-a", 9, 8), true);
    assert.equal(
      isIntentForActivation({ accountId: "account-a", epoch: 7 }, "account-a", 9, 8),
      false
    );
    assert.equal(
      isIntentForActivation({ accountId: "account-b", epoch: 9 }, "account-a", 9, 8),
      false
    );
  });

  it("keeps same-account lifecycle notifications from clearing a queued intent", () => {
    assert.equal(shouldInvalidateForLifecycleBroadcast("account-a", 4, "account-a", 5), false);
    assert.equal(shouldInvalidateForLifecycleBroadcast("account-a", 4, null, 5), true);
    assert.equal(shouldInvalidateForLifecycleBroadcast("account-a", 4, "account-b", 5), true);
    assert.equal(shouldInvalidateForLifecycleBroadcast("account-a", 5, null, 5), false);
  });

  it("honors an explicit sign-out from another tab regardless of local epoch", () => {
    assert.equal(shouldInvalidateForLifecycleBroadcast("account-a", 99, null, 1, true), true);
    assert.equal(shouldInvalidateForLifecycleBroadcast(null, 99, null, 1, true), false);
  });

  it("makes explicit sign-out a Public View with no local account exposed", () => {
    assert.equal(
      shouldExposeLocalAccount(
        { kind: "public", epoch: 9 },
        { isLoaded: true, isSignedIn: false, userId: null }
      ),
      false
    );
  });
});
