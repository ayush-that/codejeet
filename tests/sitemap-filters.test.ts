import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifySitemapPath, shouldIncludeInSitemap } from "../lib/sitemap/filters";

describe("shouldIncludeInSitemap", () => {
  it("includes indexable routes", () => {
    assert.equal(shouldIncludeInSitemap("/"), true);
    assert.equal(shouldIncludeInSitemap("/company/google"), true);
    assert.equal(shouldIncludeInSitemap("/blog/how-to-crack-google"), true);
  });

  it("excludes podcast and noindex company filters", () => {
    assert.equal(shouldIncludeInSitemap("/podcast"), false);
    assert.equal(shouldIncludeInSitemap("/company/google/array"), false);
    assert.equal(shouldIncludeInSitemap("/company/google/easy"), false);
  });
});

describe("classifySitemapPath", () => {
  it("groups paths for logging", () => {
    assert.equal(classifySitemapPath("/"), "static");
    assert.equal(classifySitemapPath("/problem/two-sum"), "problem");
    assert.equal(classifySitemapPath("/compare/google-vs-amazon"), "compare");
    assert.equal(classifySitemapPath("/system-design/url-shortener"), "system-design");
  });
});
