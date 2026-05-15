import type { LessonLanguage } from "./types";

export type RunnerProgress =
  | { phase: "loading-toolchain"; loaded: number; total: number; message?: string }
  | { phase: "compiling" }
  | { phase: "running" };

export interface RunOk {
  ok: true;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

export interface RunFail {
  ok: false;
  /** "compile" | "runtime" | "timeout" | "internal" | "unsupported" */
  errorKind: "compile" | "runtime" | "timeout" | "internal" | "unsupported";
  stdout: string;
  stderr: string;
  message: string;
  durationMs: number;
}

export type RunResult = RunOk | RunFail;

/** Messages from main thread to worker. */
export type RunnerRequest = {
  id: number;
  type: "run";
  source: string;
  stdin: string;
  timeoutMs?: number;
};

/** Messages from worker to main thread. */
export type RunnerResponse =
  | { id: number; type: "progress"; progress: RunnerProgress }
  | { id: number; type: "result"; result: RunResult };

export interface RunOptions {
  language: LessonLanguage;
  source: string;
  stdin: string;
  timeoutMs?: number;
  onProgress?: (p: RunnerProgress) => void;
}
