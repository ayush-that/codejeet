// Java runner worker stub for the Learn section.
//
// Running unmodified user-written Java in the browser is significantly harder
// than C++/Python/JavaScript — there is no off-the-shelf, well-maintained,
// freely-licensed combination of (in-browser javac) + (in-browser JVM) right
// now. The two practical options are:
//
//   1. DoppioJVM — a JVM in JS that also bundles javac. Functional but the
//      project hasn't seen meaningful updates since 2020.
//   2. CheerpJ 3.0 — Leaning Technologies' AGPL-licensed Java→WASM/JS runtime.
//      Heavy (~30 MB), but actively maintained.
//
// We're shipping a clean stub now so the UI can advertise Java as a language
// without breaking on Run. The runner returns a structured "unsupported" error
// that the UI surfaces as a friendly message.

self.addEventListener("message", (event) => {
  const req = event.data;
  if (!req || req.type !== "run") return;
  const { id } = req;
  const startedAt = performance.now();
  self.postMessage({
    id,
    type: "result",
    result: {
      ok: false,
      errorKind: "unsupported",
      stdout: "",
      stderr: "",
      message:
        "Java in-browser execution is coming soon. For now please pick C++, Python, or JavaScript.",
      durationMs: performance.now() - startedAt,
    },
  });
});
