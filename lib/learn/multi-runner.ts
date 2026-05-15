"use client";

import type {
  RunOptions,
  RunResult,
  RunnerProgress,
  RunnerRequest,
  RunnerResponse,
} from "./runner-types";
import type { LessonLanguage } from "./types";

interface PendingJob {
  resolve: (value: RunResult) => void;
  onProgress?: (p: RunnerProgress) => void;
  execTimeoutMs: number;
  execStartedAt: number | null;
  killTimer: ReturnType<typeof setTimeout> | null;
}

interface LanguageRuntime {
  /** URL of the plain ESM worker file (served from /public/learn-runtime/). */
  workerUrl: string;
  /** Display name used in error messages. */
  displayName: string;
  /** Whether this runtime requires a wall-clock kill timer on the main thread. */
  needsMainThreadKillTimer: boolean;
}

const RUNTIMES: Record<LessonLanguage, LanguageRuntime> = {
  cpp: {
    workerUrl: "/learn-runtime/cpp-runner.worker.js",
    displayName: "C++",
    needsMainThreadKillTimer: true,
  },
  javascript: {
    workerUrl: "/learn-runtime/js-runner.worker.js",
    displayName: "JavaScript",
    needsMainThreadKillTimer: true,
  },
  python: {
    workerUrl: "/learn-runtime/python-runner.worker.js",
    displayName: "Python",
    needsMainThreadKillTimer: true,
  },
  java: {
    workerUrl: "/learn-runtime/java-runner.worker.js",
    displayName: "Java",
    needsMainThreadKillTimer: false,
  },
};

interface LanguagePool {
  worker: Worker | null;
  pending: Map<number, PendingJob>;
}

const pools = new Map<LessonLanguage, LanguagePool>();
let nextId = 1;

/** Extra slack on top of the per-test budget before we hard-terminate. */
const TIMEOUT_SLACK_MS = 1000;

function getPool(language: LessonLanguage): LanguagePool {
  let pool = pools.get(language);
  if (!pool) {
    pool = { worker: null, pending: new Map() };
    pools.set(language, pool);
  }
  return pool;
}

function terminateWorker(language: LessonLanguage, reason: string) {
  const pool = pools.get(language);
  if (!pool) return;
  if (pool.worker) {
    try {
      pool.worker.terminate();
    } catch {
      // ignore
    }
    pool.worker = null;
  }
  for (const [, job] of pool.pending) {
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
  pool.pending.clear();
}

function ensureWorker(language: LessonLanguage): Worker {
  const pool = getPool(language);
  if (pool.worker) return pool.worker;
  if (typeof window === "undefined") {
    throw new Error(`${RUNTIMES[language].displayName} runner can only be used in the browser`);
  }
  const runtime = RUNTIMES[language];
  const w = new Worker(runtime.workerUrl, {
    type: "module",
    name: `codejeet-learn-${language}`,
  });
  w.addEventListener("message", (event: MessageEvent<RunnerResponse>) => {
    const msg = event.data;
    if (!msg || typeof msg.id !== "number") return;
    const job = pool.pending.get(msg.id);
    if (!job) return;
    if (msg.type === "progress") {
      // Once execution actually starts, arm a wall-clock kill timer on the
      // main thread. We can't rely on a setTimeout *inside* the worker because
      // each language's run loop is synchronous and blocks the worker's event
      // loop — any infinite loop in user code would otherwise hang the UI.
      if (msg.progress.phase === "running" && !job.killTimer && runtime.needsMainThreadKillTimer) {
        job.execStartedAt = performance.now();
        job.killTimer = setTimeout(() => {
          terminateWorker(language, `Execution exceeded ${job.execTimeoutMs}ms timeout`);
        }, job.execTimeoutMs + TIMEOUT_SLACK_MS);
      }
      job.onProgress?.(msg.progress);
    } else if (msg.type === "result") {
      if (job.killTimer) clearTimeout(job.killTimer);
      pool.pending.delete(msg.id);
      job.resolve(msg.result);
    }
  });
  w.addEventListener("error", (event) => {
    const message = event.message || `${runtime.displayName} runtime worker crashed`;
    for (const [, job] of pool.pending) {
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
    pool.pending.clear();
    pool.worker = null;
  });
  pool.worker = w;
  return w;
}

export function runCode(options: RunOptions): Promise<RunResult> {
  const id = nextId++;
  const worker = ensureWorker(options.language);
  const execTimeoutMs = options.timeoutMs ?? 5000;
  const pool = getPool(options.language);
  return new Promise<RunResult>((resolve) => {
    pool.pending.set(id, {
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

/** Tear down all workers, e.g. on route change. Exported for tests / cleanup. */
export function terminateAllRunners() {
  for (const lang of Array.from(pools.keys())) {
    terminateWorker(lang, "Runner terminated by client");
  }
}
