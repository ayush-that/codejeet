// Python runner worker for the Learn section.
//
// Loads Pyodide (CPython compiled to WebAssembly) lazily from a CDN on first
// run, and reuses the same interpreter for subsequent calls. Pyodide handles
// `input()` and `print()` via setStdin / setStdout, so user code uses the
// standard library as-is.
//
// Like the C++ runner, the main thread is responsible for terminating this
// worker if execution exceeds the wall-clock budget — pyodide.runPython is
// synchronous and would block the worker's event loop on an infinite loop.

const PYODIDE_VERSION = "0.28.3";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;
let pyodideReady = null;

async function loadPyodideInstance(postProgress) {
  if (pyodideReady) return pyodideReady;
  if (!pyodidePromise) {
    postProgress({
      phase: "loading-toolchain",
      loaded: 0,
      total: 0,
      message: "Downloading Python runtime (~10 MB the first time, cached after)…",
    });
    pyodidePromise = (async () => {
      // Pyodide is shipped as a classic IIFE that adds globals to self.
      // We use importScripts because this worker is loaded as a module worker
      // and importScripts is unavailable there — fall back to dynamic eval of
      // the fetched source as a classic script via Function. Simpler: use a
      // dynamic import of the ESM build if available, otherwise self-attach.
      // pyodide 0.27+ ships an ESM bundle too.
      const mod = await import(`${PYODIDE_BASE}pyodide.mjs`);
      const loadPyodide = mod.loadPyodide ?? self.loadPyodide;
      if (typeof loadPyodide !== "function") {
        throw new Error("Failed to locate loadPyodide entry");
      }
      const py = await loadPyodide({ indexURL: PYODIDE_BASE });
      return py;
    })();
  }
  pyodideReady = await pyodidePromise;
  return pyodideReady;
}

self.addEventListener("message", async (event) => {
  const req = event.data;
  if (!req || req.type !== "run") return;
  const { id, source, stdin } = req;
  const post = (response) => self.postMessage(response);
  const postProgress = (progress) => post({ id, type: "progress", progress });
  const startedAt = performance.now();

  let stdout = "";
  let stderr = "";

  try {
    const py = await loadPyodideInstance(postProgress);
    // Build a stdin handler that drains the request's stdin string line by
    // line. Returning null signals EOF.
    const stdinBytes = new TextEncoder().encode(stdin ?? "");
    let stdinOffset = 0;
    py.setStdin({
      stdin: () => {
        // Return one chunk per call; pyodide will batch as needed.
        if (stdinOffset >= stdinBytes.length) return null;
        // Read until newline (or end of buffer) for input()-compatible chunks.
        let end = stdinOffset;
        while (end < stdinBytes.length && stdinBytes[end] !== 10) end++;
        if (end < stdinBytes.length) end++; // include the newline
        const slice = stdinBytes.subarray(stdinOffset, end);
        stdinOffset = end;
        return slice;
      },
      isatty: false,
    });
    py.setStdout({
      raw: (byte) => {
        stdout += String.fromCharCode(byte);
      },
      isatty: false,
    });
    py.setStderr({
      raw: (byte) => {
        stderr += String.fromCharCode(byte);
      },
      isatty: false,
    });

    postProgress({ phase: "running" });
    try {
      // Wrap user code so unhandled exceptions don't poison subsequent runs.
      // pyodide.runPython is synchronous so this is fine.
      py.runPython(source);
      post({
        id,
        type: "result",
        result: {
          ok: true,
          stdout,
          stderr,
          exitCode: 0,
          durationMs: performance.now() - startedAt,
        },
      });
    } catch (err) {
      // Pyodide wraps Python exceptions as JS PythonError with .message.
      const message = err instanceof Error ? err.message : String(err);
      const isSyntax = /SyntaxError|IndentationError/.test(message);
      post({
        id,
        type: "result",
        result: {
          ok: false,
          errorKind: isSyntax ? "compile" : "runtime",
          stdout,
          stderr: stderr + (stderr.endsWith("\n") || stderr === "" ? "" : "\n") + message,
          message,
          durationMs: performance.now() - startedAt,
        },
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    post({
      id,
      type: "result",
      result: {
        ok: false,
        errorKind: "internal",
        stdout,
        stderr: stderr + message,
        message,
        durationMs: performance.now() - startedAt,
      },
    });
  }
});
