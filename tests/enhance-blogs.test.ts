import assert from "node:assert/strict";
import { describe, it } from "node:test";
import matter from "gray-matter";
import { serializeFrontmatter } from "../scripts/enhance-blogs";

/** Mirror of the writer in enhance-blogs.ts: serialize then re-parse with gray-matter. */
function roundTrip(frontmatter: Record<string, unknown>): Record<string, unknown> {
  const raw = `---\n${serializeFrontmatter(frontmatter)}\n---\n\nbody`;
  return matter(raw).data as Record<string, unknown>;
}

describe("serializeFrontmatter", () => {
  it("round-trips strings with literal backslashes", () => {
    const source = { title: "C:\\Users\\me", note: "match \\d+ times" };
    assert.deepEqual(roundTrip(source), source);
  });

  it("round-trips strings with double quotes", () => {
    const source = { title: 'say "hi" to "you"' };
    assert.deepEqual(roundTrip(source), source);
  });

  it("round-trips strings with both backslashes and double quotes", () => {
    const source = { note: 'regex "\\d+" ok' };
    assert.deepEqual(roundTrip(source), source);
  });

  it("round-trips plain strings and string arrays", () => {
    const source = { title: "Hello, world", tags: ["a", "b-c", 'd"e'] };
    assert.deepEqual(roundTrip(source), source);
  });
});
