"use client";

import { runCode } from "./multi-runner";
import type { RunOptions, RunResult, RunnerProgress } from "./runner-types";
import type { LessonLanguage, TestCase } from "./types";

export interface TestRunOutcome {
  test: TestCase;
  index: number;
  result: RunResult;
  passed: boolean;
  actualStdout: string;
}

export interface SubmitOutcome {
  totalTests: number;
  passed: number;
  results: TestRunOutcome[];
  allPassed: boolean;
  durationMs: number;
}

/** Strip trailing whitespace from each line and trailing newlines from the doc. */
function normalize(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n+$/g, "");
}

export function compareOutput(actual: string, expected: string): boolean {
  return normalize(actual) === normalize(expected);
}

export async function runSingle(
  language: LessonLanguage,
  source: string,
  stdin: string,
  onProgress?: (p: RunnerProgress) => void
): Promise<RunResult> {
  return runCode({ language, source, stdin, onProgress, timeoutMs: 5000 });
}

export async function runAll(
  language: LessonLanguage,
  source: string,
  tests: TestCase[],
  onProgress?: (p: RunnerProgress | { phase: "test"; index: number; total: number }) => void
): Promise<SubmitOutcome> {
  const start = performance.now();
  const results: TestRunOutcome[] = [];
  let passed = 0;
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    onProgress?.({ phase: "test", index: i, total: tests.length });
    const opts: RunOptions = {
      language,
      source,
      stdin: test.stdin,
      onProgress,
      timeoutMs: 5000,
    };
    const result = await runCode(opts);
    const actualStdout = result.stdout;
    const isPass = result.ok && compareOutput(actualStdout, test.expectedStdout);
    if (isPass) passed++;
    results.push({
      test,
      index: i,
      result,
      passed: isPass,
      actualStdout,
    });
  }
  return {
    totalTests: tests.length,
    passed,
    results,
    allPassed: passed === tests.length,
    durationMs: performance.now() - start,
  };
}
