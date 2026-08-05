import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { encodeDashboardData, type SourceQuestion } from "../lib/dashboard/encode";
import { formatPercent, maskFromTimeframes, timeframesFromMask } from "../lib/dashboard/schema";

function q(overrides: Partial<SourceQuestion> = {}): SourceQuestion {
  return {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    company: "google",
    topics: ["Array", "Hash Table"],
    Topics: "Array, Hash Table",
    "Acceptance %": "54.3%",
    "Frequency %": "100.0%",
    "Is Premium": "N",
    timeframes: ["all", "30_days"],
    ...overrides,
  };
}

describe("encodeDashboardData", () => {
  it("emits sorted topics and companies with counts", () => {
    const payload = encodeDashboardData([
      q(),
      q({
        company: "amazon",
        slug: "three-sum",
        title: "3Sum",
        topics: ["Two Pointers"],
        Topics: "Two Pointers",
      }),
      q({ company: "amazon" }),
    ]);

    assert.deepEqual(payload.topics, ["Array", "Hash Table", "Two Pointers"]);
    assert.deepEqual(payload.companies, [
      ["amazon", 2, "Amazon"],
      ["google", 1, "Google"],
    ]);
    assert.equal(payload.v, 2);
  });

  it("bakes brand-cased display names for special company slugs", () => {
    const payload = encodeDashboardData([q({ company: "jpmorgan" }), q({ company: "github" })]);
    assert.deepEqual(payload.companies, [
      ["github", 1, "GitHub"],
      ["jpmorgan", 1, "JPMorgan"],
    ]);
  });

  it("stores each problem once and links every row", () => {
    const payload = encodeDashboardData([q(), q({ company: "amazon" }), q({ company: "meta" })]);

    assert.equal(payload.problems.length, 1);
    assert.equal(payload.links.length, 3);
    assert.deepEqual(
      payload.links.map((l) => l[0]),
      [0, 0, 0]
    );
  });

  it("keeps disagreeing rows for the same slug as separate problems", () => {
    const payload = encodeDashboardData([
      q(),
      q({ company: "amazon", topics: ["Array"], Topics: "Array" }),
    ]);

    assert.equal(payload.problems.length, 2);
    assert.deepEqual(payload.problems[0][5], [0, 1]);
    assert.deepEqual(payload.problems[1][5], [0]);
  });

  it("encodes an unknown acceptance as null, not zero", () => {
    const payload = encodeDashboardData([q({ "Acceptance %": "" })]);

    assert.equal(payload.problems[0][3], null);
    assert.equal(formatPercent(payload.problems[0][3]), "");
  });

  it("round-trips percentages through their display strings", () => {
    const payload = encodeDashboardData([q({ "Acceptance %": "54.3%", "Frequency %": "7.5%" })]);

    assert.equal(formatPercent(payload.problems[0][3]), "54.3%");
    assert.equal(formatPercent(payload.links[0][2]), "7.5%");
  });

  it("encodes difficulty, premium, and timeframes", () => {
    const payload = encodeDashboardData([
      q({ difficulty: "Hard", "Is Premium": "Y", timeframes: ["3_months", "all"] }),
    ]);

    assert.equal(payload.problems[0][2], 2);
    assert.equal(payload.problems[0][4], 1);
    assert.deepEqual(timeframesFromMask(payload.links[0][3]).sort(), ["3_months", "all"]);
  });

  it("treats a missing timeframes array as an empty mask", () => {
    const payload = encodeDashboardData([q({ timeframes: undefined })]);

    assert.equal(payload.links[0][3], 0);
  });

  it("throws on an unknown difficulty", () => {
    assert.throws(() => encodeDashboardData([q({ difficulty: "Impossible" })]), /Impossible/);
  });

  it("pins literal TIMEFRAMES bit order", () => {
    assert.equal(maskFromTimeframes(["all"]), 1);
    assert.equal(maskFromTimeframes(["30_days"]), 2);
    assert.equal(maskFromTimeframes(["3_months", "all"]), 5);
    assert.equal(maskFromTimeframes(["more_than_6m"]), 16);
  });
});
