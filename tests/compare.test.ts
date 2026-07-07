import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  comparePairFromBlogSlug,
  comparePairSlug,
  isCompareIndexable,
  parseComparePair,
} from "../lib/compare";

describe("comparePairSlug", () => {
  it("orders slugs alphabetically", () => {
    assert.equal(comparePairSlug("google", "amazon"), "amazon-vs-google");
    assert.equal(comparePairSlug("amazon", "google"), "amazon-vs-google");
  });
});

describe("comparePairFromBlogSlug", () => {
  it("maps blog slugs to canonical compare pairs", () => {
    assert.equal(
      comparePairFromBlogSlug("google-vs-amazon-interview-comparison"),
      "amazon-vs-google"
    );
    assert.equal(
      comparePairFromBlogSlug("amazon-vs-google-interview-comparison"),
      "amazon-vs-google"
    );
    assert.equal(comparePairFromBlogSlug("how-to-crack-google"), null);
  });
});

describe("parseComparePair", () => {
  it("parses pair slugs", () => {
    assert.deepEqual(parseComparePair("amazon-vs-google"), {
      companyA: "amazon",
      companyB: "google",
    });
    assert.equal(parseComparePair("invalid"), null);
  });
});

describe("isCompareIndexable", () => {
  it("requires minimum shared questions", () => {
    assert.equal(isCompareIndexable(2), false);
    assert.equal(isCompareIndexable(3), true);
  });
});
