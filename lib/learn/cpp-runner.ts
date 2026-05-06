"use client";

import type { RunResult, RunnerProgress, RunnerRequest, RunnerResponse } from "./runner-types";

interface PendingJob {
  resolve: (value: RunResult) => void;
  onProgress?: (p: RunnerProgress) => void;
  /** ms budget for the actual WASM execution (after compile). */
  execTimeoutMs: number;
  /** wall-clock start of execution; set when we receive phase="running". */
  execStartedAt: number | null;
  /** active execution kill timer, if any. */
  killTimer: ReturnType<typeof setTimeout> | null;
}

let workerInstance: Worker | null = null;
let nextId = 1;
const pending = new Map<number, PendingJob>();

/** Extra slack on top of the per-test budget before we hard-terminate. */
const TIMEOUT_SLACK_MS = 1000;

function terminateWorker(reason: string) {
  if (workerInstance) {
    try {
      workerInstance.terminate();
    } catch {
      // ignore
    }
    workerInstance = null;
  }
  for (const [, job] of pending) {
    if (job.killTimer) clearTimeout(job.killTimer);
    job.resolve({
      ok: false,
      errorKind: "timeout",
      stdout: "",
      stderr: "",
      message: reason,
      durationMs: job.execStartedAt ? performance.now() - job.execStartedAt : 0,
    });
  }
  pending.clear();
}

function ensureWorker(): Worker {
  if (workerInstance) return workerInstance;
  if (typeof window === "undefined") {
    throw new Error("cpp-runner can only be used in the browser");
  }
  // We host the worker as a plain ESM JS file in /public/ rather than going
  // through the Next.js bundler. The worker pulls clang+lld+sysroot from
  // jsDelivr at runtime — way too big to bundle — so the bundler's
  // worker-chunking machinery isn't useful here.
  const w = new Worker("/learn-runtime/cpp-runner.worker.js", {
    type: "module",
    name: "codejeet-learn-cpp",
  });
  w.addEventListener("message", (event: MessageEvent<RunnerResponse>) => {
    const msg = event.data;
    if (!msg || typeof msg.id !== "number") return;
    const job = pending.get(msg.id);
    if (!job) return;
    if (msg.type === "progress") {
      // Once execution actually starts, arm a wall-clock kill timer on the
      // main thread. We can't rely on a setTimeout *inside* the worker because
      // wasi.start() is synchronous and blocks the worker's event loop —
      // any infinite loop in user code would otherwise hang the UI forever.
      if (msg.progress.phase === "running" && !job.killTimer) {
        job.execStartedAt = performance.now();
        job.killTimer = setTimeout(() => {
          terminateWorker(`Execution exceeded ${job.execTimeoutMs}ms timeout`);
        }, job.execTimeoutMs + TIMEOUT_SLACK_MS);
      }
      job.onProgress?.(msg.progress);
    } else if (msg.type === "result") {
      if (job.killTimer) clearTimeout(job.killTimer);
      pending.delete(msg.id);
      job.resolve(msg.result);
    }
  });
  w.addEventListener("error", (event) => {
    // Distribute the error to all pending jobs so callers don't hang forever.
    const message = event.message || "C++ runtime worker crashed";
    for (const [, job] of pending) {
      if (job.killTimer) clearTimeout(job.killTimer);
      job.resolve({
        ok: false,
        errorKind: "internal",
        stdout: "",
        stderr: "",
        message,
        durationMs: 0,
      });
    }
    pending.clear();
    workerInstance = null;
  });
  workerInstance = w;
  return w;
}

export interface RunOptions {
  source: string;
  stdin: string;
  timeoutMs?: number;
  onProgress?: (p: RunnerProgress) => void;
}

export function runCpp(options: RunOptions): Promise<RunResult> {
  const id = nextId++;
  const worker = ensureWorker();
  const execTimeoutMs = options.timeoutMs ?? 5000;
  return new Promise<RunResult>((resolve) => {
    pending.set(id, {
      resolve,
      onProgress: options.onProgress,
      execTimeoutMs,
      execStartedAt: null,
      killTimer: null,
    });
    const req: RunnerRequest = {
      id,
      type: "run",
      source: options.source,
      stdin: options.stdin,
      timeoutMs: execTimeoutMs,
    };
    worker.postMessage(req);
  });
}
