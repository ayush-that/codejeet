// JavaScript runner worker for the Learn section.
//
// Runs user-authored JavaScript in this worker's global scope with:
//   - readline()              => returns one line of stdin (no trailing newline)
//   - print(...args)          => writes args.join(" ") + "\n" to stdout
//   - console.log(...args)    => writes args.join(" ") + "\n" to stdout
//   - console.error(...args)  => writes to stderr
//
// We rely on the main thread to terminate this worker on wall-clock timeout —
// the same pattern as the C++ runner, because a synchronous infinite loop in
// user code would also hang this worker's event loop.

function normalizeArg(a) {
  if (typeof a === "string") return a;
  if (a === null) return "null";
  if (a === undefined) return "undefined";
  try {
    return JSON.stringify(a);
  } catch {
    return String(a);
  }
}

self.addEventListener("message", (event) => {
  const req = event.data;
  if (!req || req.type !== "run") return;
  const { id, source, stdin } = req;
  const post = (response) => self.postMessage(response);
  const postProgress = (progress) => post({ id, type: "progress", progress });
  const startedAt = performance.now();

  let stdout = "";
  let stderr = "";

  const stdinLines = (stdin ?? "").split("\n");
  // Drop a single trailing empty element produced by a final newline so
  // readline() returns undefined after the real input ends.
  if (stdinLines.length > 0 && stdinLines[stdinLines.length - 1] === "") {
    stdinLines.pop();
  }
  let lineIndex = 0;

  // Build the sandbox API as locals passed into a Function constructor. The
  // user code runs in strict mode inside an isolated function scope; it can
  // still touch `self` (it's a worker), but we don't try to remove that.
  const sandboxReadline = () => {
    if (lineIndex >= stdinLines.length) return undefined;
    return stdinLines[lineIndex++];
  };
  const sandboxPrint = (...args) => {
    stdout += args.map(normalizeArg).join(" ") + "\n";
  };
  const sandboxConsole = {
    log: (...args) => {
      stdout += args.map(normalizeArg).join(" ") + "\n";
    },
    error: (...args) => {
      stderr += args.map(normalizeArg).join(" ") + "\n";
    },
    warn: (...args) => {
      stderr += args.map(normalizeArg).join(" ") + "\n";
    },
    info: (...args) => {
      stdout += args.map(normalizeArg).join(" ") + "\n";
    },
    debug: (...args) => {
      stdout += args.map(normalizeArg).join(" ") + "\n";
    },
  };

  postProgress({ phase: "running" });
  try {
    const userFn = new Function("readline", "print", "console", `"use strict";\n${source}`);
    const maybePromise = userFn(sandboxReadline, sandboxPrint, sandboxConsole);
    // If the user code is async, we await it. We don't enforce timeout here —
    // the main thread terminates the worker on wall-clock budget exceed.
    Promise.resolve(maybePromise)
      .then(() => {
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
      })
      .catch((err) => {
        const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        const stack = err instanceof Error && err.stack ? `\n${err.stack}` : "";
        post({
          id,
          type: "result",
          result: {
            ok: false,
            errorKind: "runtime",
            stdout,
            stderr: stderr + message + stack,
            message,
            durationMs: performance.now() - startedAt,
          },
        });
      });
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    const stack = err instanceof Error && err.stack ? `\n${err.stack}` : "";
    // SyntaxError from the Function constructor is the only "compile"-shaped
    // error we report; everything else is runtime.
    const isSyntax = err instanceof SyntaxError;
    post({
      id,
      type: "result",
      result: {
        ok: false,
        errorKind: isSyntax ? "compile" : "runtime",
        stdout,
        stderr: stderr + message + stack,
        message,
        durationMs: performance.now() - startedAt,
      },
    });
  }
});
