// The test runner gives each file its own process, which is what makes this
// possible: lib/pseo-data resolves public/data from process.cwd() when it is
// first imported, so chdir has to happen before that import to reproduce the
// worker, where public/ is only reachable through the ASSETS binding.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

const originalCwd = process.cwd();
const emptyCwd = fs.mkdtempSync(path.join(os.tmpdir(), "codejeet-no-fs-"));

// Imported lazily and only after the chdir, so the module is first evaluated with
// the empty directory as its cwd. A top-level import would run too early, and
// top-level await is unavailable here because the package is CommonJS.
let getCompanyProfile: (typeof import("../lib/pseo-data"))["getCompanyProfile"];

before(async () => {
  process.chdir(emptyCwd);
  ({ getCompanyProfile } = await import("../lib/pseo-data"));
});

after(() => {
  delete (globalThis as Record<symbol, unknown>)[Symbol.for("__cloudflare-context__")];
  process.chdir(originalCwd);
  fs.rmSync(emptyCwd, { recursive: true, force: true });
});

describe("company profiles without a filesystem", () => {
  it("reads company profiles from the ASSETS binding", async () => {
    const requested: string[] = [];
    const fixture = {
      google: { slug: "google", displayName: "Google", questions: [] },
    };

    const globals = globalThis as Record<symbol, unknown>;
    globals[Symbol.for("__cloudflare-context__")] = {
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
    };

    const profile = await getCompanyProfile("google");

    assert.equal(profile?.displayName, "Google");
    assert.deepEqual(requested, ["/data/company-profiles.json"]);
  });
});
