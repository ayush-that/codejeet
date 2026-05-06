"use client";

import type { RunResult, RunnerProgress, RunnerRequest, RunnerResponse } from "./runner-types";

interface PendingJob {
  resolve: (value: RunResult) => void;
  onProgress?: (p: RunnerProgress) => void;
}

let workerInstance: Worker | null = null;
let nextId = 1;
const pending = new Map<number, PendingJob>();

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
      job.onProgress?.(msg.progress);
    } else if (msg.type === "result") {
      pending.delete(msg.id);
      job.resolve(msg.result);
    }
  });
  w.addEventListener("error", (event) => {
    // Distribute the error to all pending jobs so callers don't hang forever.
    const message = event.message || "C++ runtime worker crashed";
    for (const [, job] of pending) {
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
  return new Promise<RunResult>((resolve) => {
    pending.set(id, { resolve, onProgress: options.onProgress });
    const req: RunnerRequest = {
      id,
      type: "run",
      source: options.source,
      stdin: options.stdin,
      timeoutMs: options.timeoutMs,
    };
    worker.postMessage(req);
  });
}
