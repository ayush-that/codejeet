import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import nextConfig from "../next.config";
import { getBlogIndex } from "../lib/blog-data";
import { getComparisonPair, getProblem, getQuestionsData } from "../lib/pseo-data";

const cloudflareContextSymbol = Symbol.for("__cloudflare-context__");
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

function walkSourceFiles(dir: URL): URL[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dir);
    if (entry.isDirectory()) return walkSourceFiles(child);
    return /\.tsx?$/.test(entry.name) ? [child] : [];
  });
}

function withFakeAssets(fetchImpl: (url: URL) => Promise<Response>) {
  return <T>(run: () => Promise<T>): Promise<T> => {
    const globals = globalThis as Record<symbol, unknown>;
    const previous = globals[cloudflareContextSymbol];
    globals[cloudflareContextSymbol] = { env: { ASSETS: { fetch: fetchImpl } } };
    return run().finally(() => {
      if (previous === undefined) delete globals[cloudflareContextSymbol];
      else globals[cloudflareContextSymbol] = previous;
    });
  };
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

  it("never statically imports the generated data directory from server code", () => {
    // public/data is gitignored and produced by prebuild, so a static import
    // both breaks module loading on a fresh checkout and drags megabytes of
    // generated data into the worker script, which Cloudflare asks you to keep
    // in Static Assets instead. Read it through readJson so the ASSETS binding
    // serves it at runtime.
    const offenders: string[] = [];

    for (const dir of ["app", "lib"]) {
      for (const file of walkSourceFiles(new URL(`../${dir}/`, import.meta.url))) {
        const source = fs.readFileSync(file, "utf8");
        if (/from\s+["'][^"']*public\/data\//.test(source)) {
          offenders.push(path.relative(projectRoot, fileURLToPath(file)));
        }
      }
    }

    assert.deepEqual(offenders, []);
  });
});

describe("worker data reads", () => {
  it("serves on-demand reads from the ASSETS binding when there is no filesystem", async () => {
    const requested: string[] = [];
    const fixture = { id: "42", title: "Two Sum", slug: "worker-only-problem" };

    const problem = await withFakeAssets(async (url) => {
      requested.push(url.pathname);
      return new Response(JSON.stringify(fixture), {
        headers: { "content-type": "application/json" },
      });
    })(() => getProblem("worker-only-problem"));

    assert.deepEqual(problem, fixture);
    assert.deepEqual(requested, ["/data/problems/worker-only-problem.json"]);
  });

  it("still reports a miss when no worker context and no file exist", async () => {
    const globals = globalThis as Record<symbol, unknown>;
    const previous = globals[cloudflareContextSymbol];
    delete globals[cloudflareContextSymbol];

    try {
      assert.equal(await getProblem("no-such-problem"), null);
      assert.equal(await getComparisonPair("nobody-vs-nothing"), null);
    } finally {
      if (previous !== undefined) globals[cloudflareContextSymbol] = previous;
    }
  });
});
