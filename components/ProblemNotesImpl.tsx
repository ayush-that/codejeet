"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  MAX_NOTE_LENGTH,
  clearLocalNote,
  fetchUserNotes,
  getLocalNote,
  getLocalNotes,
  getLocalNotesMeta,
  getLocalNoteTombstones,
  reconcileNotes,
  saveLocalNotes,
  saveLocalNotesMeta,
  saveLocalNoteTombstones,
  setLocalNote,
  updateUserNote,
} from "@/utils/notesUtils";

interface ProblemNotesImplProps {
  slug: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function ProblemNotesImpl({ slug }: ProblemNotesImplProps) {
  const { isSignedIn } = useUser();
  const [text, setText] = useState(() => getLocalNote(slug));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // Unsaved typing: skip setText from remote, but do not treat as a committed clear/save.
  const dirtyRef = useRef(false);
  // Save/clear only: local wins merge for these slugs and they are re-pushed after fetch.
  const committedSlugsRef = useRef(new Set<string>());
  const syncedOnSignInRef = useRef(false);
  // Bumps on every save/clear so a slow earlier request cannot apply after a later one.
  const mutationGenRef = useRef(0);
  const savingRef = useRef(false);
  const savedFlashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      syncedOnSignInRef.current = false;
      // Drop session protection so a later sign-in uses LWW, not a stale save.
      committedSlugsRef.current.clear();
      return;
    }
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let slowRetries = 0;
    const maxAttempts = 3;
    const maxSlowRetries = 5;

    const scheduleRetry = (nextAttempt: number) => {
      if (cancelled || syncedOnSignInRef.current) return;
      if (nextAttempt > maxAttempts) {
        // Keep recovering from transient outages without requiring remount.
        if (slowRetries >= maxSlowRetries) return;
        slowRetries += 1;
        retryTimer = setTimeout(() => {
          if (!cancelled && !syncedOnSignInRef.current) void runSync(1);
        }, 30_000);
        return;
      }
      retryTimer = setTimeout(() => {
        if (!cancelled && !syncedOnSignInRef.current) void runSync(nextAttempt);
      }, 1000 * (nextAttempt - 1));
    };

    // Filled after successful GET.
    let resultNotes: Record<string, string> = {};
    let resultUpdatedAt: Record<string, string> = {};

    const snapshotLocal = () =>
      reconcileNotes(
        getLocalNotes(),
        getLocalNotesMeta(),
        getLocalNoteTombstones(),
        resultNotes,
        resultUpdatedAt,
        committedSlugsRef.current
      );

    const persistMerged = (
      settled: ReturnType<typeof reconcileNotes>
    ) => {
      saveLocalNotes(settled.merged);
      saveLocalNotesMeta(settled.mergedMeta);
      saveLocalNoteTombstones(settled.mergedTombstones);
      if (!dirtyRef.current) {
        setText(settled.merged[slug] ?? "");
      }
    };

    const runSync = async (attempt: number) => {
      // True only after a fully successful sign-in sync; never used as an in-flight lock.
      if (syncedOnSignInRef.current) return;

      const result = await fetchUserNotes();
      if (cancelled) return;
      // Failed GET must not look like an empty account (would mass-upload local over cloud).
      if (!result.ok) {
        scheduleRetry(attempt + 1);
        return;
      }
      resultNotes = result.notes;
      resultUpdatedAt = result.updatedAt;

      // Upload until local reconcile is stable (covers concurrent save/clear mid-batch).
      // Map of slug -> last body successfully POSTed this sync.
      const uploaded = new Map<string, string>();
      const maxRounds = 5;
      let roundFailed = false;

      for (let round = 0; round < maxRounds; round++) {
        if (cancelled) return;
        const rec = snapshotLocal();
        const pending = Object.entries(rec.toUpload).filter(
          ([s, note]) => uploaded.get(s) !== note
        );

        if (pending.length === 0) {
          persistMerged(rec);
          if (!cancelled) {
            syncedOnSignInRef.current = true;
            // Protection only covers in-flight sync; further conflicts use LWW timestamps.
            committedSlugsRef.current.clear();
          }
          return;
        }

        const results = await Promise.all(
          pending.map(async ([s, note]) => {
            const ok = await updateUserNote(s, note);
            return { s, note, ok };
          })
        );
        if (cancelled) return;

        for (const r of results) {
          if (r.ok) uploaded.set(r.s, r.note);
          else roundFailed = true;
        }

        // Keep local map current even if more rounds remain.
        persistMerged(snapshotLocal());
      }

      // Exhausted stabilize rounds and/or had POST failures.
      persistMerged(snapshotLocal());
      if (roundFailed || Object.entries(snapshotLocal().toUpload).some(([s, n]) => uploaded.get(s) !== n)) {
        scheduleRetry(attempt + 1);
        return;
      }
      if (!cancelled) {
        syncedOnSignInRef.current = true;
        committedSlugsRef.current.clear();
      }
    };

    void runSync(1);
    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [isSignedIn, slug]);

  useEffect(() => {
    return () => {
      if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current);
    };
  }, []);

  const flashSaved = useCallback(() => {
    setSaveState("saved");
    if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current);
    savedFlashTimer.current = setTimeout(() => setSaveState("idle"), 1500);
  }, []);

  const handleSave = useCallback(async () => {
    if (savingRef.current) return;
    const gen = ++mutationGenRef.current;
    savingRef.current = true;
    dirtyRef.current = true;
    committedSlugsRef.current.add(slug);
    setSaveState("saving");
    setLocalNote(slug, text);
    try {
      if (isSignedIn) {
        const ok = await updateUserNote(slug, text);
        if (gen !== mutationGenRef.current) return;
        if (!ok) {
          setSaveState("error");
          return;
        }
      }
      if (gen !== mutationGenRef.current) return;
      setText(getLocalNote(slug));
      flashSaved();
    } catch {
      if (gen === mutationGenRef.current) setSaveState("error");
    } finally {
      if (gen === mutationGenRef.current) savingRef.current = false;
    }
  }, [slug, text, isSignedIn, flashSaved]);

  const handleClear = useCallback(async () => {
    if (savingRef.current) return;
    const gen = ++mutationGenRef.current;
    savingRef.current = true;
    dirtyRef.current = true;
    committedSlugsRef.current.add(slug);
    setSaveState("saving");
    const previous = getLocalNote(slug);
    clearLocalNote(slug);
    setText("");
    try {
      if (isSignedIn) {
        const ok = await updateUserNote(slug, "");
        if (gen !== mutationGenRef.current) return;
        if (!ok) {
          setLocalNote(slug, previous);
          setText(previous);
          setSaveState("error");
          return;
        }
      }
      if (gen !== mutationGenRef.current) return;
      flashSaved();
    } catch {
      if (gen === mutationGenRef.current) {
        setLocalNote(slug, previous);
        setText(previous);
        setSaveState("error");
      }
    } finally {
      if (gen === mutationGenRef.current) savingRef.current = false;
    }
  }, [slug, isSignedIn, flashSaved]);

  const remaining = MAX_NOTE_LENGTH - text.length;
  const hasStored = Boolean(getLocalNote(slug));
  const busy = saveState === "saving";
  const statusLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? "Saved"
        : saveState === "error"
          ? "Save failed"
          : null;

  return (
    <section
      className="mb-8 rounded-[2px] border border-border bg-card p-4"
      aria-labelledby="problem-notes-heading"
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="problem-notes-heading"
          className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Your notes
        </h2>
        <p className="text-xs text-muted-foreground">
          Private revision notes for this problem
          {isSignedIn ? " · synced to your account" : " · saved on this device"}
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          const next = e.target.value;
          if (next.length <= MAX_NOTE_LENGTH) {
            dirtyRef.current = true;
            setText(next);
          }
        }}
        placeholder="Patterns, edge cases, mistakes to avoid…"
        rows={5}
        maxLength={MAX_NOTE_LENGTH}
        disabled={busy}
        className="w-full resize-y rounded-[2px] border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        aria-label="Personal note for this problem"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={() => void handleSave()} disabled={busy}>
          Save note
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void handleClear()}
          disabled={busy || (!text && !hasStored)}
        >
          Clear
        </Button>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {statusLabel ? (
            <span
              className={
                saveState === "error"
                  ? "text-destructive"
                  : saveState === "saved"
                    ? "text-foreground"
                    : ""
              }
            >
              {statusLabel}
            </span>
          ) : (
            `${remaining} left`
          )}
        </span>
      </div>
    </section>
  );
}
