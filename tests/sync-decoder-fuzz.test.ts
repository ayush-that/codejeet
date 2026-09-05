import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fc from "fast-check";
import {
  CodecError,
  MAX_FRAME_BYTES,
  decodeFrame,
  decodeProgressShard,
  decodeSnapshotRecord,
} from "../lib/sync/codec";
import { addProgress, emptyProgressState, type ProgressState } from "../lib/sync/domain";
import type { ProblemRegistry } from "../lib/problem-registry";

const registry: ProblemRegistry = {
  version: 1,
  problems: [{ slug: "alpha", active: true }],
};

function stateKey(state: ProgressState): string {
  return JSON.stringify({
    adds: state.adds.map(({ slug, dot }) => [slug, [...dot.actorId], dot.counter.toString()]),
    causalSummary: [...state.causalSummary.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([actorId, counter]) => [actorId, counter.toString()]),
    removed: [...state.removed.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([slug, summary]) => [
        slug,
        [...summary.entries()]
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([actorId, counter]) => [actorId, counter.toString()]),
      ]),
  });
}

function assertBoundedDecode(action: () => unknown): void {
  try {
    action();
  } catch (error) {
    assert.ok(error instanceof CodecError);
  }
}

describe("seeded CJET decoder fuzzing", () => {
  it("decodes within bounds or rejects without mutating domain state", () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 1024 }), (bytes) => {
        const before = addProgress(
          emptyProgressState(),
          registry,
          new Uint8Array(16).fill(7),
          BigInt(0),
          "alpha"
        );
        const beforeKey = stateKey(before);
        assertBoundedDecode(() => decodeFrame(bytes));
        assertBoundedDecode(() => decodeProgressShard(bytes));
        assertBoundedDecode(() => decodeSnapshotRecord(bytes));
        assert.equal(stateKey(before), beforeKey);
      }),
      { seed: 7202001, numRuns: 500 }
    );
  });

  it("rejects oversized input before unbounded allocation", () => {
    const oversized = new Uint8Array(MAX_FRAME_BYTES + 1);
    assert.throws(
      () => decodeFrame(oversized),
      (error: unknown) => {
        assert.ok(error instanceof CodecError);
        assert.equal(error.code, "OVERSIZED");
        return true;
      }
    );
  });
});
