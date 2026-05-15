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
      try {
        // pyodide 0.27+ ships an ESM bundle; dynamic import that.
        const mod = await import(`${PYODIDE_BASE}pyodide.mjs`);
        const loadPyodide = mod.loadPyodide ?? self.loadPyodide;
        if (typeof loadPyodide !== "function") {
          throw new Error("Failed to locate loadPyodide entry");
        }
        const py = await loadPyodide({ indexURL: PYODIDE_BASE });
        return py;
      } catch (err) {
        // Reset the cached promise so a future call re-attempts the load
        // instead of re-awaiting an already-rejected promise. Without this a
        // single CDN failure permanently bricks the runner for the session.
        pyodidePromise = null;
        throw err;
      }
    })();
  }
  try {
    pyodideReady = await pyodidePromise;
    return pyodideReady;
  } catch (err) {
    // Belt-and-suspenders: also reset here in case some other call awaited
    // the same promise before the inner catch ran.
    pyodidePromise = null;
    pyodideReady = null;
    throw err;
  }
}

self.addEventListener("message", async (event) => {
  const req = event.data;
  if (!req || req.type !== "run") return;
  const { id, source, stdin } = req;
  const post = (response) => self.postMessage(response);
  const postProgress = (progress) => post({ id, type: "progress", progress });
  const startedAt = performance.now();

  // Collect stdout/stderr as byte arrays and decode once at the end. Appending
  // characters one-at-a-time to a JS string is O(n²) overall, which becomes
  // visible even on a few KB of program output.
  const stdoutBytes = [];
  const stderrBytes = [];
  const textDecoder = new TextDecoder();
  const decodeOut = () => textDecoder.decode(new Uint8Array(stdoutBytes));
  const decodeErr = () => textDecoder.decode(new Uint8Array(stderrBytes));

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
        stdoutBytes.push(byte);
      },
      isatty: false,
    });
    py.setStderr({
      raw: (byte) => {
        stderrBytes.push(byte);
      },
      isatty: false,
    });

    postProgress({ phase: "running" });
    try {
      // pyodide.runPython is synchronous so any exception lands in our catch.
      py.runPython(source);
      post({
        id,
        type: "result",
        result: {
          ok: true,
          stdout: decodeOut(),
          stderr: decodeErr(),
          exitCode: 0,
          durationMs: performance.now() - startedAt,
        },
      });
    } catch (err) {
      // Pyodide wraps Python exceptions as JS PythonError with .message.
      const message = err instanceof Error ? err.message : String(err);
      const isSyntax = /SyntaxError|IndentationError/.test(message);
      const stderrText = decodeErr();
      const sep = stderrText === "" || stderrText.endsWith("\n") ? "" : "\n";
      post({
        id,
        type: "result",
        result: {
          ok: false,
          errorKind: isSyntax ? "compile" : "runtime",
          stdout: decodeOut(),
          stderr: stderrText + sep + message,
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
        stdout: decodeOut(),
        stderr: decodeErr() + message,
        message,
        durationMs: performance.now() - startedAt,
      },
    });
  }
});
