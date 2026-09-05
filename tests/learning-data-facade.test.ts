import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createLearningDataBrowserFixture } from "./fixtures/learning-data-browser";

describe("Learning Data browser fixture", () => {
  it("starts the Public View empty even when legacy storage has Account Data", () => {
    const fixture = createLearningDataBrowserFixture();
    try {
      fixture.storage.setItem(
        "leetcode-checked-items",
        JSON.stringify({ [fixture.problemSlug]: true })
      );
      fixture.storage.setItem(
        "leetcode-problem-notes",
        JSON.stringify({ [fixture.problemSlug]: "old" })
      );
      assert.deepEqual(fixture.facade.progress.readLocal(), {});
      assert.equal(fixture.facade.notes.readNote(fixture.problemSlug), "");
    } finally {
      fixture.restore();
    }
  });

  it("exercises one Progress change and one Problem Note through the facade", async () => {
    const fixture = createLearningDataBrowserFixture();
    try {
      const progress = fixture.facade.progress.update(fixture.problemSlug, true, true);
      assert.deepEqual(progress, { [fixture.problemSlug]: true });
      assert.deepEqual(fixture.facade.progress.readLocal(), progress);

      assert.equal(await fixture.facade.notes.save(fixture.problemSlug, "hash map", true), true);
      assert.equal(fixture.facade.notes.readNote(fixture.problemSlug), "hash map");

      assert.deepEqual(
        fixture.requests.map(({ url, method }) => `${method} ${url}`),
        ["POST /api/progress", "POST /api/notes"]
      );
    } finally {
      fixture.restore();
    }
  });

  it("owns signed-in Problem Note reconciliation behind the facade", async () => {
    const fixture = createLearningDataBrowserFixture();
    try {
      await fixture.facade.notes.save(fixture.problemSlug, "local note", false);
      let stopSync = () => {};
      await new Promise<void>((resolve) => {
        stopSync = fixture.facade.notes.startSignedInSync({
          slug: fixture.problemSlug,
          getProtectedSlugs: () => [],
          hasDirtyDraft: () => false,
          setCurrentNote: () => {},
          onComplete: resolve,
        });
      });
      stopSync();

      assert.equal(fixture.facade.notes.readNote(fixture.problemSlug), "local note");
      assert.deepEqual(
        fixture.requests.map(({ url, method }) => `${method} ${url}`),
        ["GET /api/notes", "POST /api/notes"]
      );
    } finally {
      fixture.restore();
    }
  });

  it("deduplicates re-entered Progress sync and ignores the canceled consumer", async () => {
    const fixture = createLearningDataBrowserFixture();
    const previousFetch = globalThis.fetch;
    try {
      const local = fixture.facade.progress.update(fixture.problemSlug, true, false);
      let resolveProgressFetch: (response: Response) => void = () => {};
      let progressFetchStarted = () => {};
      const progressFetchStartedPromise = new Promise<void>((resolve) => {
        progressFetchStarted = resolve;
      });
      const progressResponse = new Promise<Response>((resolve) => {
        resolveProgressFetch = resolve;
      });
      let progressPosts = 0;
      globalThis.fetch = async (input, init) => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        const method = init?.method ?? "GET";
        if (url === "/api/progress" && method === "POST") {
          progressPosts += 1;
          return Response.json({ ok: true });
        }
        if (url === "/api/progress" && method === "GET") {
          progressFetchStarted();
          return progressResponse;
        }
        return previousFetch(input, init);
      };

      const firstController = new AbortController();
      const first = fixture.facade.progress.syncSignedIn(
        local,
        () => local,
        firstController.signal
      );
      firstController.abort();
      const second = fixture.facade.progress.syncSignedIn(
        local,
        () => fixture.facade.progress.readLocal(),
        new AbortController().signal
      );
      await progressFetchStartedPromise;
      resolveProgressFetch(Response.json({ progress: { remote: "timestamp" } }));
      const [firstResult, secondResult] = await Promise.all([first, second]);

      assert.equal(progressPosts, 1);
      assert.deepEqual(firstResult, { [fixture.problemSlug]: true });
      assert.deepEqual(secondResult, {
        [fixture.problemSlug]: true,
        remote: true,
      });
      assert.deepEqual(fixture.facade.progress.readLocal(), {
        [fixture.problemSlug]: true,
        remote: true,
      });
    } finally {
      globalThis.fetch = previousFetch;
      fixture.restore();
    }
  });

  it("switches the facade between an account view and an empty Public View", async () => {
    const fixture = createLearningDataBrowserFixture();
    try {
      fixture.facade.progress.update(fixture.problemSlug, true, false);

      fixture.facade.lifecycle.deactivate();
      assert.deepEqual(fixture.facade.lifecycle.view(), { kind: "public", accountId: null });
      assert.deepEqual(fixture.facade.progress.readLocal(), {});
      assert.equal(fixture.facade.notes.readNote(fixture.problemSlug), "");
    } finally {
      fixture.restore();
      fixture.facade.lifecycle.deactivate();
    }
  });
});
