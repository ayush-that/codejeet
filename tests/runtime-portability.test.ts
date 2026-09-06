import assert from "node:assert/strict";
import { describe, it } from "node:test";
import nextConfig from "../next.config";
import { getBlogIndex } from "../lib/blog-data";
import { getQuestionsData } from "../lib/pseo-data";

describe("portable production runtime", () => {
  it("emits a standalone Node.js server", () => {
    assert.equal(nextConfig.output, "standalone");
  });

  it("reads generated application data from the packaged filesystem", async () => {
    const [posts, questions] = await Promise.all([getBlogIndex(), getQuestionsData()]);

    assert.ok(posts.length > 0);
    assert.ok(questions.questions.length > 0);
    assert.ok(questions.companies.length > 0);
  });
});
