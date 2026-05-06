"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "./CodeEditor";
import { LessonContent } from "./LessonContent";
import { runAll, runSingle } from "@/lib/learn/runner";
import type { RunResult, RunnerProgress } from "@/lib/learn/runner-types";
import type { Lesson } from "@/lib/learn/types";
import type { TestRunOutcome } from "@/lib/learn/runner";

interface LessonWorkspaceProps {
  lesson: Lesson;
  prevHref: string | null;
  nextHref: string | null;
  prevTitle: string | null;
  nextTitle: string | null;
  courseTitle: string;
  courseHref: string;
}

type Tab = "tests" | "stdin" | "output";

const STORAGE_PREFIX = "codejeet:learn:cpp:v1:";

function storageKey(courseSlug: string, lessonSlug: string) {
  return `${STORAGE_PREFIX}${courseSlug}/${lessonSlug}`;
}

interface SavedCode {
  code: string;
  savedAt: number;
}

function loadSaved(courseSlug: string, lessonSlug: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(courseSlug, lessonSlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedCode;
    return parsed.code ?? null;
  } catch {
    return null;
  }
}

function saveCode(courseSlug: string, lessonSlug: string, code: string) {
  if (typeof window === "undefined") return;
  try {
    const payload: SavedCode = { code, savedAt: Date.now() };
    window.localStorage.setItem(storageKey(courseSlug, lessonSlug), JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}

function defaultStdin(lesson: Lesson): string {
  const visible = lesson.tests.find((t) => t.visible) ?? lesson.tests[0];
  return visible?.stdin ?? "";
}

interface RunStatus {
  kind: "idle" | "running" | "loading-toolchain" | "compiling";
  message?: string;
}

export function LessonWorkspace({
  lesson,
  prevHref,
  nextHref,
  prevTitle,
  nextTitle,
  courseTitle,
  courseHref,
}: LessonWorkspaceProps) {
  const [code, setCode] = useState<string>(lesson.starter);
  const [stdin, setStdin] = useState<string>(() => defaultStdin(lesson));
  const [tab, setTab] = useState<Tab>("tests");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    passed: number;
    total: number;
    results: TestRunOutcome[];
  } | null>(null);
  const [status, setStatus] = useState<RunStatus>({ kind: "idle" });
  const [, setRehydrated] = useState(false);

  // Hydrate from localStorage after mount. The setState here is intentional —
  // localStorage isn't available during SSR/static export so we can't read it
  // in a lazy initializer; this is the canonical SSR-safe rehydration pattern.
  useEffect(() => {
    const saved = loadSaved(lesson.courseSlug, lesson.slug);
    if (saved && saved.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(saved);
    }
    setRehydrated(true);
  }, [lesson.courseSlug, lesson.slug]);

  // Persist code on change (debounced via requestIdleCallback fallback).
  useEffect(() => {
    const handle = setTimeout(() => {
      saveCode(lesson.courseSlug, lesson.slug, code);
    }, 400);
    return () => clearTimeout(handle);
  }, [code, lesson.courseSlug, lesson.slug]);

  const onProgress = useCallback((p: RunnerProgress) => {
    if (p.phase === "loading-toolchain") {
      setStatus({ kind: "loading-toolchain", message: p.message ?? "Downloading C++ toolchain…" });
    } else if (p.phase === "compiling") {
      setStatus({ kind: "compiling", message: "Compiling…" });
    } else if (p.phase === "running") {
      setStatus({ kind: "running", message: "Running…" });
    }
  }, []);

  const handleRun = useCallback(async () => {
    setSubmitResult(null);
    setStatus({ kind: "compiling", message: "Compiling…" });
    setTab("output");
    const result = await runSingle(code, stdin, onProgress);
    setStatus({ kind: "idle" });
    setRunResult(result);
  }, [code, stdin, onProgress]);

  const handleSubmit = useCallback(async () => {
    setRunResult(null);
    setStatus({ kind: "compiling", message: "Compiling…" });
    setTab("tests");
    const outcome = await runAll(code, lesson.tests, (p) => {
      if ("phase" in p && p.phase === "test") {
        setStatus({
          kind: "running",
          message: `Running test ${p.index + 1} of ${p.total}…`,
        });
      } else {
        onProgress(p as RunnerProgress);
      }
    });
    setStatus({ kind: "idle" });
    setSubmitResult({
      passed: outcome.passed,
      total: outcome.totalTests,
      results: outcome.results,
    });
  }, [code, lesson.tests, onProgress]);

  const handleReset = useCallback(() => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Reset your code to the starter? Your edits will be lost.");
      if (!ok) return;
    }
    setCode(lesson.starter);
    setRunResult(null);
    setSubmitResult(null);
  }, [lesson.starter]);

  const handleSeeSolution = useCallback(() => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Replace your code with the reference solution?");
      if (!ok) return;
    }
    setCode(lesson.solution);
  }, [lesson.solution]);

  const visibleTests = useMemo(() => lesson.tests.filter((t) => t.visible), [lesson.tests]);

  const isBusy = status.kind !== "idle";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-4rem)] divide-y lg:divide-y-0 lg:divide-x divide-border">
      <div className="overflow-y-auto px-6 py-8 lg:py-10 lg:max-h-[calc(100vh-4rem)]">
        <div className="max-w-prose mx-auto">
          <div className="mb-4">
            <Link
              href={courseHref}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {courseTitle}
            </Link>
          </div>
          <LessonContent body={lesson.body} />
          {lesson.exercise.prompt && (
            <div className="mt-8 rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                Exercise
              </div>
              <ReactMarkdownLite text={lesson.exercise.prompt} />
            </div>
          )}
          <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
            {prevHref ? (
              <Link
                href={prevHref}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← {prevTitle ?? "Previous"}
              </Link>
            ) : (
              <span />
            )}
            {nextHref ? (
              <Link
                href={nextHref}
                className="text-sm text-foreground hover:text-foreground/80 transition-colors"
              >
                {nextTitle ?? "Next"} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-zinc-950 lg:max-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between gap-2 border-b border-border bg-background px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              main.cpp
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isBusy}
              className="h-8 text-xs"
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSeeSolution}
              disabled={isBusy}
              className="h-8 text-xs"
            >
              Solution
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={isBusy}
              className="h-8 text-xs"
            >
              Run
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isBusy} className="h-8 text-xs">
              Submit
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-[280px] max-h-[60vh] lg:max-h-none">
          <CodeEditor value={code} onChange={setCode} language="cpp" className="h-full" />
        </div>
        <ResultsPanel
          tab={tab}
          setTab={setTab}
          stdin={stdin}
          setStdin={setStdin}
          status={status}
          runResult={runResult}
          submitResult={submitResult}
          visibleTests={visibleTests}
          totalTests={lesson.tests.length}
        />
      </div>
    </div>
  );
}

interface ResultsPanelProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
  stdin: string;
  setStdin: (next: string) => void;
  status: RunStatus;
  runResult: RunResult | null;
  submitResult: { passed: number; total: number; results: TestRunOutcome[] } | null;
  visibleTests: Lesson["tests"];
  totalTests: number;
}

function ResultsPanel({
  tab,
  setTab,
  stdin,
  setStdin,
  status,
  runResult,
  submitResult,
  visibleTests,
  totalTests,
}: ResultsPanelProps) {
  return (
    <div className="border-t border-border bg-background min-h-[180px] max-h-[42vh] lg:max-h-[40vh] flex flex-col">
      <div className="flex items-stretch border-b border-border">
        <TabButton active={tab === "tests"} onClick={() => setTab("tests")}>
          Tests
          {submitResult && (
            <Badge
              variant="secondary"
              className={
                "ml-2 h-5 px-1.5 text-[10px] " +
                (submitResult.passed === submitResult.total
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-red-500/15 text-red-300")
              }
            >
              {submitResult.passed}/{submitResult.total}
            </Badge>
          )}
        </TabButton>
        <TabButton active={tab === "stdin"} onClick={() => setTab("stdin")}>
          Stdin
        </TabButton>
        <TabButton active={tab === "output"} onClick={() => setTab("output")}>
          Output
          {runResult && !runResult.ok && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 px-1.5 text-[10px] bg-red-500/15 text-red-300"
            >
              error
            </Badge>
          )}
        </TabButton>
        <div className="flex-1" />
        {status.kind !== "idle" && (
          <div className="flex items-center px-3 text-xs text-muted-foreground gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            {status.message ?? "Working…"}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
        {tab === "tests" && (
          <TestsTab
            visibleTests={visibleTests}
            totalTests={totalTests}
            submitResult={submitResult}
          />
        )}
        {tab === "stdin" && <StdinTab value={stdin} onChange={setStdin} />}
        {tab === "output" && <OutputTab result={runResult} />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px flex items-center " +
        (active
          ? "text-foreground border-primary"
          : "text-muted-foreground border-transparent hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function StdinTab({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Whatever you put here is fed to your program's stdin when you click Run."
      spellCheck={false}
      className="w-full h-full min-h-[120px] resize-none bg-transparent outline-none font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/60"
    />
  );
}

function OutputTab({ result }: { result: RunResult | null }) {
  if (!result) {
    return (
      <div className="text-muted-foreground italic">
        Click <span className="font-semibold text-foreground">Run</span> to compile and execute
        against the Stdin tab.
      </div>
    );
  }
  if (!result.ok) {
    return (
      <div className="space-y-3">
        <div className="text-red-300 font-semibold">
          {result.errorKind === "compile"
            ? "Compilation failed"
            : result.errorKind === "timeout"
              ? "Execution timed out"
              : result.errorKind === "runtime"
                ? "Runtime error"
                : "Internal runner error"}
        </div>
        {result.message && (
          <pre className="whitespace-pre-wrap break-words text-foreground">{result.message}</pre>
        )}
        {result.stderr && (
          <pre className="whitespace-pre-wrap break-words text-zinc-400">{result.stderr}</pre>
        )}
        {result.stdout && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              stdout
            </div>
            <pre className="whitespace-pre-wrap break-words text-foreground">{result.stdout}</pre>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="text-emerald-300 font-semibold">
        Exited with code {result.exitCode} in {Math.round(result.durationMs)}ms
      </div>
      {result.stdout ? (
        <pre className="whitespace-pre-wrap break-words text-foreground">{result.stdout}</pre>
      ) : (
        <div className="text-muted-foreground italic">(no stdout)</div>
      )}
      {result.stderr && (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            stderr
          </div>
          <pre className="whitespace-pre-wrap break-words text-zinc-400">{result.stderr}</pre>
        </div>
      )}
    </div>
  );
}

function TestsTab({
  visibleTests,
  totalTests,
  submitResult,
}: {
  visibleTests: Lesson["tests"];
  totalTests: number;
  submitResult: { passed: number; total: number; results: TestRunOutcome[] } | null;
}) {
  if (!submitResult) {
    return (
      <div className="space-y-2">
        <div className="text-muted-foreground">
          {totalTests} test{totalTests === 1 ? "" : "s"} — click{" "}
          <span className="font-semibold text-foreground">Submit</span> to run all of them.
        </div>
        {visibleTests.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Visible cases
            </div>
            {visibleTests.map((t, i) => (
              <div key={i} className="rounded border border-border bg-muted/30 p-2 text-foreground">
                <div className="text-[11px] text-muted-foreground mb-1">{t.name}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      stdin
                    </div>
                    <pre className="whitespace-pre-wrap text-foreground">
                      {t.stdin || "(empty)"}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      expected
                    </div>
                    <pre className="whitespace-pre-wrap text-foreground">
                      {t.expectedStdout || "(empty)"}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div
        className={
          "font-semibold " +
          (submitResult.passed === submitResult.total ? "text-emerald-300" : "text-red-300")
        }
      >
        {submitResult.passed} / {submitResult.total} tests passed
      </div>
      {submitResult.results.map((outcome, i) => (
        <TestResultRow key={i} outcome={outcome} />
      ))}
    </div>
  );
}

function TestResultRow({ outcome }: { outcome: TestRunOutcome }) {
  const visible = outcome.test.visible;
  const result = outcome.result;
  return (
    <details
      className={
        "rounded border p-2 " +
        (outcome.passed
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-red-500/30 bg-red-500/5")
      }
    >
      <summary className="cursor-pointer flex items-center gap-2">
        <span
          className={
            "inline-block h-2 w-2 rounded-full " +
            (outcome.passed ? "bg-emerald-400" : "bg-red-400")
          }
        />
        <span className="font-semibold text-foreground">{outcome.passed ? "PASS" : "FAIL"}</span>
        <span className="text-muted-foreground">{outcome.test.name}</span>
        {!visible && (
          <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
            hidden
          </span>
        )}
      </summary>
      {!outcome.passed && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {visible && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                stdin
              </div>
              <pre className="whitespace-pre-wrap text-foreground">
                {outcome.test.stdin || "(empty)"}
              </pre>
            </div>
          )}
          {visible && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                expected
              </div>
              <pre className="whitespace-pre-wrap text-foreground">
                {outcome.test.expectedStdout || "(empty)"}
              </pre>
            </div>
          )}
          <div className={visible ? "" : "col-span-2"}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">actual</div>
            <pre className="whitespace-pre-wrap text-foreground">
              {outcome.actualStdout || "(empty)"}
            </pre>
          </div>
          {!result.ok && (
            <div className="col-span-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                error
              </div>
              <pre className="whitespace-pre-wrap text-red-300">
                {result.errorKind}: {result.message}
              </pre>
              {result.stderr && (
                <pre className="whitespace-pre-wrap text-zinc-400 mt-1">{result.stderr}</pre>
              )}
            </div>
          )}
        </div>
      )}
    </details>
  );
}

function ReactMarkdownLite({ text }: { text: string }) {
  // Tiny inline markdown for the exercise prompt: respects backticks and **bold**.
  // We avoid the full ReactMarkdown pipeline here to keep the prompt lightweight.
  const html = useMemo(() => formatInline(text), [text]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatInline(text: string): string {
  const escaped = escapeHtml(text);
  // Convert paragraphs separated by blank lines.
  const paragraphs = escaped.split(/\n\s*\n/).map((p) => {
    const withCode = p.replace(/`([^`]+)`/g, '<code class="bg-zinc-800 px-1 rounded">$1</code>');
    const withBold = withCode.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return `<p>${withBold.replace(/\n/g, "<br/>")}</p>`;
  });
  return paragraphs.join("\n");
}
