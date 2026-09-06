import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { GET } from "../app/api/health/route";

describe("Coolify container boundary", () => {
  it("exposes a dependency-free health response", async () => {
    const response = await GET();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), { ok: true });
  });

  it("builds a standalone non-root Node runtime on port 3000", async () => {
    const dockerfile = await readFile("Dockerfile", "utf8");
    assert.match(dockerfile, /^FROM node:22-alpine/m);
    assert.match(dockerfile, /^ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY$/m);
    assert.match(dockerfile, /^ARG NEXT_PUBLIC_R2_BASE_URL$/m);
    assert.match(dockerfile, /^ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=/m);
    assert.match(dockerfile, /^ENV NEXT_PUBLIC_R2_BASE_URL=/m);
    assert.match(dockerfile, /COPY --from=builder .*\.next\/standalone/);
    assert.match(dockerfile, /COPY --from=builder .*\.next\/static/);
    assert.match(dockerfile, /COPY --from=builder .*public/);
    assert.match(dockerfile, /ENV HOSTNAME="0\.0\.0\.0"/);
    assert.match(dockerfile, /EXPOSE 3000/);
    assert.match(dockerfile, /USER nextjs/);
    assert.match(dockerfile, /HEALTHCHECK .*\/api\/health/);
    assert.match(dockerfile, /CMD \["node", "server\.js"\]/);
  });

  it("keeps secrets and local artifacts out of the image context", async () => {
    const dockerignore = await readFile(".dockerignore", "utf8");
    const entries = new Set(dockerignore.split("\n").filter(Boolean));
    for (const ignored of [".env*", ".git", ".next", ".migration", "node_modules"]) {
      assert.equal(entries.has(ignored), true, `${ignored} must be excluded`);
    }
  });
});
