import assert from "node:assert/strict";
import fs from "node:fs/promises";

const [baseUrl, reportPath] = process.argv.slice(2);
if (!baseUrl || !reportPath) {
  throw new Error("Usage: node tests/seo-pages.e2e.mjs BASE_URL REPORT_PATH");
}

const results = [];
async function check(path, verify) {
  try {
    const response = await fetch(new URL(path, baseUrl));
    const html = await response.text();
    assert.equal(response.status, 200);
    verify(html);
    results.push({ path, passed: true });
  } catch (error) {
    results.push({ path, passed: false, error: error.message.split("\n")[0] });
  }
}

await check("/company/de-shaw/minimum-runes-to-add-to-cast-spell", (html) => {
  assert.match(html, /<title>Minimum Runes to Add to Cast Spell/);
  assert.match(html, /<meta name="robots" content="noindex, follow"/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/codejeet.com\/company\/de-shaw\/minimum-runes-to-add-to-cast-spell"/
  );
  assert.doesNotMatch(html, /href="\/problem\/minimum-runes-to-add-to-cast-spell"/);
  assert.match(
    html,
    /href="https:\/\/leetcode.com\/problems\/minimum-runes-to-add-to-cast-spell\/"/
  );
});

await check("/company/oracle/basic-calculator-ii", (html) => {
  assert.match(html, /rel="canonical" href="https:\/\/codejeet.com\/problem\/basic-calculator-ii"/);
  assert.match(html, /<meta name="robots" content="noindex, follow"/);
  assert.match(html, /href="\/problem\/basic-calculator-ii"/);
});

for (const [path, missingSlug] of [
  ["/company/6sense", "count-univalue-subtrees"],
  ["/topic/two-pointers", "meeting-rooms-ii"],
  ["/difficulty/medium", "meeting-rooms-ii"],
  ["/compare/coupang-vs-salesforce", "split-bst"],
  [
    "/problem/subarrays-with-k-different-integers",
    "longest-substring-with-at-most-two-distinct-characters",
  ],
]) {
  await check(path, (html) => {
    assert.doesNotMatch(html, new RegExp(`href="/problem/${missingSlug}"`));
    assert.ok(html.includes(`href="https://leetcode.com/problems/${missingSlug}/"`));
  });
}

await check("/sitemap.xml", (xml) => {
  assert.doesNotMatch(
    xml,
    /<loc>https:\/\/codejeet.com\/blog\/[^<]*-vs-[^<]*-interview-comparison<\/loc>/
  );
  assert.doesNotMatch(xml, /<loc>https:\/\/codejeet.com\/system-design<\/loc>/);
  assert.match(xml, /<loc>https:\/\/codejeet.com\/system-design\/[^<]+<\/loc>/);
  assert.match(xml, /<loc>https:\/\/codejeet.com\/problem\/two-sum<\/loc>/);
});

await fs.writeFile(
  reportPath,
  JSON.stringify({ baseUrl, checkedAt: new Date().toISOString(), results }, null, 2) + "\n"
);
console.log(JSON.stringify(results, null, 2));
process.exitCode = results.some((result) => !result.passed) ? 1 : 0;
