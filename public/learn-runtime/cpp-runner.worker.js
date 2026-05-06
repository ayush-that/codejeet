// C++ runner worker for the Learn section.
//
// We deliberately avoid bundling so that:
//   1) the user's main bundle stays small (CodeMirror + page chrome only)
//   2) the ~95 MB clang+lld+sysroot toolchain is fetched lazily from a CDN
//      and cached by the browser, not shipped from our origin.
//
// Both browsercc (clang/lld in WASM) and @bjorn3/browser_wasi_shim are loaded
// from jsDelivr/esm.sh as ESM modules. Because they live on the same origin,
// browsercc's emscripten-generated `import.meta.url` paths resolve correctly.

const BROWSERCC_VERSION = "0.1.1";
const WASI_SHIM_VERSION = "0.4.2";

const BROWSERCC_URL = `https://cdn.jsdelivr.net/npm/browsercc@${BROWSERCC_VERSION}/dist/index.js`;
const WASI_SHIM_URL = `https://esm.sh/@bjorn3/browser_wasi_shim@${WASI_SHIM_VERSION}`;

let toolchainPromise = null;
let wasiShimPromise = null;

function loadWasiShim() {
  if (!wasiShimPromise) {
    wasiShimPromise = import(WASI_SHIM_URL);
  }
  return wasiShimPromise;
}

function loadToolchain(postProgress) {
  if (!toolchainPromise) {
    postProgress({
      phase: "loading-toolchain",
      loaded: 0,
      total: 0,
      message: "Downloading C++ toolchain (~50 MB the first time, cached after)…",
    });
    toolchainPromise = import(BROWSERCC_URL);
  }
  return toolchainPromise;
}

function decode(bytes) {
  return new TextDecoder().decode(bytes);
}

async function runWasmOnce({ module, stdin, timeoutMs }) {
  const { WASI, File, OpenFile, ConsoleStdout, PreopenDirectory } = await loadWasiShim();
  const stdinBytes = new TextEncoder().encode(stdin);
  let stdout = "";
  let stderr = "";
  const fds = [
    new OpenFile(new File(stdinBytes)),
    new ConsoleStdout((data) => {
      stdout += decode(data);
    }),
    new ConsoleStdout((data) => {
      stderr += decode(data);
    }),
    new PreopenDirectory("/tmp", new Map()),
  ];
  const wasi = new WASI([], [], fds);
  const start = performance.now();
  let timedOut = false;
  const timeoutHandle = setTimeout(() => {
    timedOut = true;
  }, timeoutMs);
  try {
    const instance = await WebAssembly.instantiate(module, {
      wasi_snapshot_preview1: wasi.wasiImport,
    });
    let exitCode = 0;
    try {
      wasi.start(instance);
    } catch (err) {
      // browser_wasi_shim throws an Error with a `code` field on proc_exit.
      if (err && typeof err === "object" && "code" in err) {
        exitCode = Number(err.code) || 0;
      } else {
        throw err;
      }
    }
    clearTimeout(timeoutHandle);
    return {
      ok: true,
      stdout,
      stderr,
      exitCode,
      durationMs: performance.now() - start,
    };
  } catch (err) {
    clearTimeout(timeoutHandle);
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      errorKind: timedOut ? "timeout" : "runtime",
      stdout,
      stderr,
      message: timedOut ? `Execution exceeded ${timeoutMs}ms timeout` : message,
      durationMs: performance.now() - start,
    };
  }
}

self.addEventListener("message", async (event) => {
  const req = event.data;
  if (!req || req.type !== "run") return;
  const { id } = req;
  const post = (response) => self.postMessage(response);
  const postProgress = (progress) => post({ id, type: "progress", progress });
  const startedAt = performance.now();

  try {
    const toolchain = await loadToolchain(postProgress);
    postProgress({ phase: "compiling" });
    const compileResult = await toolchain.compile({
      source: req.source,
      fileName: "main.cpp",
      flags: ["-std=c++20", "-O1", "-fno-exceptions"],
    });
    if (!compileResult.module) {
      post({
        id,
        type: "result",
        result: {
          ok: false,
          errorKind: "compile",
          stdout: "",
          stderr: compileResult.compileOutput || "",
          message: "Compilation failed",
          durationMs: performance.now() - startedAt,
        },
      });
      return;
    }
    postProgress({ phase: "running" });
    const outcome = await runWasmOnce({
      module: compileResult.module,
      stdin: req.stdin,
      timeoutMs: req.timeoutMs ?? 5000,
    });
    post({ id, type: "result", result: outcome });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    post({
      id,
      type: "result",
      result: {
        ok: false,
        errorKind: "internal",
        stdout: "",
        stderr: "",
        message,
        durationMs: performance.now() - startedAt,
      },
    });
  }
});
