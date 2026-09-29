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
  // Each case needs its own slug: readJson caches successful reads by path, so a
  // slug reused across cases would be served from the cache instead of the binding.
  const workerContext = (fetch: (url: URL) => Promise<Response>) => ({
    env: { ASSETS: { fetch } },
  });

  it("serves on-demand reads from the ASSETS binding when there is no filesystem", async () => {
    const requested: string[] = [];
    const fixture = { id: "42", title: "Two Sum", slug: "served-problem" };

    const problem = await withContext(
      workerContext(async (url) => {
        requested.push(url.pathname);
        return new Response(JSON.stringify(fixture), {
          headers: { "content-type": "application/json" },
        });
      }),
      () => getProblem("served-problem")
    );

    assert.deepEqual(problem, fixture);
    assert.deepEqual(requested, ["/data/problems/served-problem.json"]);
  });

  it("treats a 404 from the binding as a genuine miss", async () => {
    const miss = await withContext(
      workerContext(async () => new Response(null, { status: 404 })),
      () => getProblem("absent-problem")
    );

    assert.equal(miss, null);
  });

  it("encodes path segments so query or fragment characters cannot alias real files", async () => {
    const requested = { pathname: "", search: "", hash: "" };

    await withContext(
      workerContext(async (url) => {
        requested.pathname = url.pathname;
        requested.search = url.search;
        requested.hash = url.hash;
        return new Response(null, { status: 404 });
      }),
      () => getProblem("target.json?injected-query")
    );

    assert.deepEqual(requested, {
      pathname: "/data/problems/target.json%3Finjected-query.json",
      search: "",
      hash: "",
    });
  });

  it("surfaces a failed binding read instead of reporting a miss", async () => {
    const failures: Array<(url: URL) => Promise<Response>> = [
      async () => new Response("boom", { status: 500 }),
      async () => new Response("{ not json", { headers: { "content-type": "application/json" } }),
      () => Promise.reject(new Error("binding unreachable")),
    ];

    for (const [index, fetch] of failures.entries()) {
      await assert.rejects(
        withContext(workerContext(fetch), () => getProblem(`broken-problem-${index}`)),
        /ASSETS read of problems\/broken-problem-\d+\.json/
      );
    }
  });

  it("still reports a miss when no worker context and no file exist", async () => {
    const misses = await withContext(undefined, async () => [
      await getProblem("no-such-problem"),
      await getComparisonPair("nobody-vs-nothing"),
    ]);

    assert.deepEqual(misses, [null, null]);
  });
});
