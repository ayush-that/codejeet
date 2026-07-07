import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampBlogDate, spreadBlogDates } from "../lib/blog/dates";

describe("clampBlogDate", () => {
  it("clamps future dates to today", () => {
    assert.equal(clampBlogDate("2032-10-04", "2026-07-07"), "2026-07-07");
    assert.equal(clampBlogDate("2025-01-01", "2026-07-07"), "2025-01-01");
  });

  it("uses today when date is empty", () => {
    assert.equal(clampBlogDate("", "2026-07-07"), "2026-07-07");
  });
});

describe("spreadBlogDates", () => {
  it("assigns descending dates within the span", () => {
    const today = new Date("2026-07-07T12:00:00Z");
    const result = spreadBlogDates(
      [
        { slug: "a-post", date: "2032-01-01" },
        { slug: "b-post", date: "2032-01-02" },
        { slug: "c-post", date: "2032-01-03" },
      ],
      today
    );

    assert.equal(result[0].date, "2026-07-07");
    assert.ok(result.at(-1)!.date < result[0].date);
    assert.ok(result.every((entry) => entry.date <= "2026-07-07"));
    assert.ok(result[0].date >= result[1].date);
    assert.ok(result[1].date >= result[2].date);
  });
});
