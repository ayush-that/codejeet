import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { loadScrapedProblemSources } from "../lib/problem-registry-sources";
import {
  assertProblemRegistryRetains,
  committedProblemRegistry,
  isRegisteredProblemSlug,
  isValidProblemRegistrySlug,
  updateProblemRegistry,
  validateProblemRegistry,
  type ProblemRegistry,
} from "../lib/problem-registry";

describe("Problem Registry", () => {
  it("keeps the committed registry valid for current and retired slugs", () => {
    const registry = JSON.parse(
      readFileSync(path.join(process.cwd(), "data", "problem-registry.json"), "utf8")
    ) as ProblemRegistry;

    validateProblemRegistry(registry);
    assert.equal(isRegisteredProblemSlug(registry, "two-sum"), true);
    assert.equal(isRegisteredProblemSlug(registry, "never-recognized"), false);
  });

  it("adds current slugs and keeps entries sorted", () => {
    const registry = updateProblemRegistry(null, ["two-sum", "add-two-numbers"]);

    assert.deepEqual(registry, {
      version: 1,
      problems: [
        { slug: "add-two-numbers", active: true },
        { slug: "two-sum", active: true },
      ],
    });
  });

  it("retains a removed slug as inactive and still recognizes it", () => {
    const previous: ProblemRegistry = {
      version: 1,
      problems: [
        { slug: "retired-problem", active: true },
        { slug: "two-sum", active: true },
      ],
    };

    const registry = updateProblemRegistry(previous, ["two-sum"]);

    assert.deepEqual(registry.problems, [
      { slug: "retired-problem", active: false },
      { slug: "two-sum", active: true },
    ]);
    assert.equal(isRegisteredProblemSlug(registry, "retired-problem"), true);
    assert.equal(isRegisteredProblemSlug(registry, "never-recognized"), false);
  });

  it("fails if a generated registry drops a previous entry", () => {
    const previous: ProblemRegistry = {
      version: 1,
      problems: [{ slug: "retired-problem", active: true }],
    };
    const next: ProblemRegistry = { version: 1, problems: [] };

    assert.throws(
      () => assertProblemRegistryRetains(previous, next),
      /dropped previously registered slug: retired-problem/
    );
  });

  it("reactivates a previously retained slug when it returns to the data", () => {
    const previous: ProblemRegistry = {
      version: 1,
      problems: [{ slug: "retired-problem", active: false }],
    };

    const registry = updateProblemRegistry(previous, ["retired-problem"]);

    assert.deepEqual(registry.problems, [{ slug: "retired-problem", active: true }]);
  });

  it("rejects duplicate registry entries", () => {
    assert.throws(
      () =>
        validateProblemRegistry({
          version: 1,
          problems: [
            { slug: "two-sum", active: true },
            { slug: "two-sum", active: false },
          ],
        }),
      /duplicate slug/
    );
  });

  it("rejects empty current slugs", () => {
    assert.throws(() => updateProblemRegistry(null, [""]), /empty slug/);
  });

  it("validates active and retired targets against the committed registry", () => {
    const activeSlug = committedProblemRegistry.problems.find((entry) => entry.active)?.slug;
    assert.ok(activeSlug);
    assert.equal(isValidProblemRegistrySlug(activeSlug), true);

    const retiredRegistry = updateProblemRegistry(committedProblemRegistry, []);
    assert.equal(isValidProblemRegistrySlug(activeSlug, retiredRegistry), true);
    assert.equal(isValidProblemRegistrySlug("never-recognized"), false);
  });

  it("loads scraped sources in filename order and rejects duplicate slugs", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "codejeet-registry-"));
    try {
      await writeFile(path.join(directory, "z-problem.json"), JSON.stringify({ slug: "z" }));
      await writeFile(path.join(directory, "a-problem.json"), JSON.stringify({ slug: "a" }));

      const loaded = await loadScrapedProblemSources<{ slug: string }>(directory);
      assert.deepEqual([...loaded.keys()], ["a", "z"]);

      await writeFile(path.join(directory, "duplicate.json"), JSON.stringify({ slug: "a" }));
      await assert.rejects(
        () => loadScrapedProblemSources<{ slug: string }>(directory),
        /Duplicate scraped problem slug a/
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("only treats a missing scraped directory as empty", async () => {
    const missing = path.join(os.tmpdir(), `codejeet-missing-${Date.now()}`);
    assert.deepEqual(await loadScrapedProblemSources(missing), new Map());

    const directory = await mkdtemp(path.join(os.tmpdir(), "codejeet-registry-"));
    try {
      await writeFile(path.join(directory, "broken.json"), "not-json");
      await assert.rejects(() => loadScrapedProblemSources(directory), SyntaxError);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }

    const filePath = path.join(os.tmpdir(), `codejeet-registry-file-${Date.now()}`);
    try {
      await writeFile(filePath, "not-a-directory");
      await assert.rejects(() => loadScrapedProblemSources(filePath), /ENOTDIR/);
    } finally {
      await rm(filePath, { force: true });
    }
  });
});
