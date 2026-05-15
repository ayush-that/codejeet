"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Quiz, QuizQuestion } from "@/lib/learn/types";
import { LANGUAGE_LABEL } from "@/lib/learn/types";

interface QuizWorkspaceProps {
  quiz: Quiz;
  courseTitle: string;
  courseHref: string;
}

type AnswerValue = number | string;

interface AnswerState {
  value: AnswerValue;
  /** Whether the user has revealed the answer / submitted this question. */
  revealed: boolean;
  /** Cached grading result so we don't recompute on every render. */
  passed: boolean;
}

function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

function grade(question: QuizQuestion, value: AnswerValue): boolean {
  if (question.kind === "mcq") {
    return typeof value === "number" && value === question.correctIndex;
  }
  if (typeof value !== "string") return false;
  const got = normalizeText(value);
  if (got === "") return false;
  if (question.kind === "fill-blank") {
    return question.acceptedAnswers.some((a) => normalizeText(a) === got);
  }
  // predict-output: normalize both sides like the runner.
  return question.acceptedOutputs.some((o) => normalizeText(o) === got);
}

export function QuizWorkspace({ quiz, courseTitle, courseHref }: QuizWorkspaceProps) {
  const initial: Record<string, AnswerState> = useMemo(
    () =>
      Object.fromEntries(
        quiz.questions.map((q) => [
          q.id,
          {
            value: q.kind === "mcq" ? -1 : "",
            revealed: false,
            passed: false,
          },
        ])
      ),
    [quiz]
  );
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(initial);
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = useCallback((qid: string, value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: { ...prev[qid], value },
    }));
  }, []);

  const revealOne = useCallback(
    (qid: string) => {
      const q = quiz.questions.find((x) => x.id === qid);
      if (!q) return;
      setAnswers((prev) => {
        const cur = prev[qid];
        return {
          ...prev,
          [qid]: {
            ...cur,
            revealed: true,
            passed: grade(q, cur.value),
          },
        };
      });
    },
    [quiz.questions]
  );

  const submitAll = useCallback(() => {
    setAnswers((prev) => {
      const next = { ...prev };
      for (const q of quiz.questions) {
        const cur = prev[q.id];
        next[q.id] = {
          ...cur,
          revealed: true,
          passed: grade(q, cur.value),
        };
      }
      return next;
    });
    setSubmitted(true);
  }, [quiz.questions]);

  const reset = useCallback(() => {
    setAnswers(initial);
    setSubmitted(false);
  }, [initial]);

  const totalCorrect = useMemo(
    () => Object.values(answers).reduce((acc, a) => (a.revealed && a.passed ? acc + 1 : acc), 0),
    [answers]
  );
  const totalRevealed = useMemo(
    () => Object.values(answers).reduce((acc, a) => (a.revealed ? acc + 1 : acc), 0),
    [answers]
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href={courseHref} className="text-xs text-muted-foreground hover:text-foreground">
        ← {courseTitle}
      </Link>
      <header className="mt-3 mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Quiz</div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">{quiz.title}</h1>
        {quiz.description && (
          <p className="mt-2 text-muted-foreground leading-relaxed">{quiz.description}</p>
        )}
        <div className="mt-3 text-xs text-muted-foreground">
          {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"}
          {totalRevealed > 0 && (
            <>
              {" "}
              ·{" "}
              <span className={totalCorrect === quiz.questions.length ? "text-emerald-400" : ""}>
                {totalCorrect} / {totalRevealed} correct
              </span>
            </>
          )}
        </div>
      </header>

      <ol className="space-y-5">
        {quiz.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            index={i}
            question={q}
            state={answers[q.id]}
            onChange={(value) => setAnswer(q.id, value)}
            onReveal={() => revealOne(q.id)}
          />
        ))}
      </ol>

      <div className="mt-8 flex items-center gap-2 border-t border-border pt-4">
        {!submitted ? (
          <Button onClick={submitAll}>Submit quiz</Button>
        ) : (
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        )}
        <div className="ml-auto text-sm text-muted-foreground">
          {submitted &&
            (totalCorrect === quiz.questions.length
              ? "All correct."
              : `${totalCorrect} / ${quiz.questions.length} correct`)}
        </div>
      </div>
    </div>
  );
}

interface QuestionCardProps {
  index: number;
  question: QuizQuestion;
  state: AnswerState;
  onChange: (value: AnswerValue) => void;
  onReveal: () => void;
}

function QuestionCard({ index, question, state, onChange, onReveal }: QuestionCardProps) {
  return (
    <li className="rounded-lg border border-border p-5 bg-card/40">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-xs font-mono text-muted-foreground">
          Q{String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {question.kind === "mcq"
            ? "multiple choice"
            : question.kind === "fill-blank"
              ? "fill in the blank"
              : "predict the output"}
        </span>
        {state.revealed && (
          <Badge
            variant="secondary"
            className={
              "ml-auto text-[10px] " +
              (state.passed ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300")
            }
          >
            {state.passed ? "correct" : "wrong"}
          </Badge>
        )}
      </div>
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
        {question.prompt}
      </div>
      {question.code && (
        <div className="mt-3 rounded border border-border bg-zinc-950 overflow-hidden">
          {question.language && (
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/20">
              {LANGUAGE_LABEL[question.language]}
            </div>
          )}
          <pre className="p-3 text-xs text-foreground overflow-x-auto whitespace-pre">
            {question.code}
          </pre>
        </div>
      )}

      <div className="mt-4">
        {question.kind === "mcq" ? (
          <McqOptions question={question} state={state} onChange={onChange} />
        ) : (
          <TextAnswer
            state={state}
            onChange={onChange}
            placeholder={
              question.kind === "fill-blank"
                ? "Type your answer here…"
                : "Type the exact expected stdout (whitespace ignored)…"
            }
          />
        )}
      </div>

      {!state.revealed && (
        <div className="mt-3">
          <Button size="sm" variant="outline" onClick={onReveal} className="text-xs h-8">
            Check
          </Button>
        </div>
      )}

      {state.revealed && question.explanation && (
        <div className="mt-3 rounded border border-border bg-muted/30 p-3 text-xs text-foreground">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Explanation
          </div>
          {question.explanation}
        </div>
      )}
    </li>
  );
}

function McqOptions({
  question,
  state,
  onChange,
}: {
  question: Extract<QuizQuestion, { kind: "mcq" }>;
  state: AnswerState;
  onChange: (value: AnswerValue) => void;
}) {
  return (
    <div className="space-y-2">
      {question.options.map((opt, i) => {
        const selected = state.value === i;
        const isCorrect = state.revealed && i === question.correctIndex;
        const isWrong = state.revealed && selected && i !== question.correctIndex;
        return (
          <label
            key={i}
            className={
              "flex items-start gap-3 rounded border p-3 text-sm cursor-pointer transition-colors " +
              (isCorrect
                ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                : isWrong
                  ? "border-red-500/40 bg-red-500/10 text-foreground"
                  : selected
                    ? "border-foreground/40 bg-muted/40"
                    : "border-border hover:border-foreground/30 hover:bg-muted/30")
            }
          >
            <input
              type="radio"
              name={question.id}
              value={i}
              checked={selected}
              onChange={() => onChange(i)}
              disabled={state.revealed}
              className="mt-1"
            />
            <span className="whitespace-pre-wrap">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function TextAnswer({
  state,
  onChange,
  placeholder,
}: {
  state: AnswerState;
  onChange: (value: AnswerValue) => void;
  placeholder: string;
}) {
  const value = typeof state.value === "string" ? state.value : "";
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={state.revealed}
      rows={3}
      className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-mono leading-relaxed focus:outline-none focus:border-foreground/40 disabled:opacity-70"
    />
  );
}
