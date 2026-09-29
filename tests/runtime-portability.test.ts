import assert from "node:assert/strict";
import { describe, it } from "node:test";
import nextConfig from "../next.config";
import { getBlogIndex } from "../lib/blog-data";
import { getComparisonPair, getProblem, getQuestionsData } from "../lib/pseo-data";

const globals = globalThis as Record<symbol, unknown>;
const contextKey = Symbol.for("__cloudflare-context__");

// Installs a fake Cloudflare context (the one getCloudflareContext reads off
// globalThis) so a read can be exercised the way the worker sees it.
async function withContext<T>(value: unknown, run: () => Promise<T>): Promise<T> {
  const previous = globals[contextKey];
  globals[contextKey] = value;
  try {
    return await run();
  } finally {
    if (previous === undefined) delete globals[contextKey];
    else globals[contextKey] = previous;
  }
}

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

describe("worker data reads", () => {
  it("serves on-demand reads from the ASSETS binding when there is no filesystem", async () => {
    const requested: string[] = [];
    const fixture = { id: "42", title: "Two Sum", slug: "worker-only-problem" };

    const problem = await withContext(
      {
        env: {
          ASSETS: {
            fetch: async (url: URL) => {
              requested.push(url.pathname);
              return new Response(JSON.stringify(fixture), {
                headers: { "content-type": "application/json" },
              });
            },
          },
        },
      },
      () => getProblem("worker-only-problem")
    );

    assert.deepEqual(problem, fixture);
    assert.deepEqual(requested, ["/data/problems/worker-only-problem.json"]);
  });

  it("still reports a miss when no worker context and no file exist", async () => {
    const misses = await withContext(undefined, async () => [
      await getProblem("no-such-problem"),
      await getComparisonPair("nobody-vs-nothing"),
    ]);

    assert.deepEqual(misses, [null, null]);
  });
});
