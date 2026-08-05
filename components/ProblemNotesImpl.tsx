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
  reconcileNotes,
  saveLocalNotes,
  saveLocalNotesMeta,
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
      return;
    }
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const maxAttempts = 3;

    const scheduleRetry = (nextAttempt: number) => {
      if (cancelled || nextAttempt > maxAttempts) return;
      retryTimer = setTimeout(() => {
        if (!cancelled) void runSync(nextAttempt);
      }, 1000 * (nextAttempt - 1));
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

      // Re-read local after fetch so saves that landed mid-flight are included.
      const rec = reconcileNotes(
        getLocalNotes(),
        getLocalNotesMeta(),
        result.notes,
        result.updatedAt,
        committedSlugsRef.current
      );
      const firstResults = await Promise.all(
        Object.entries(rec.toUpload).map(async ([s, note]) => ({
          slug: s,
          ok: await updateUserNote(s, note),
        }))
      );
      if (cancelled) return;

      const failedFirst = new Set(firstResults.filter((r) => !r.ok).map((r) => r.slug));

      // Second reconcile picks up concurrent local saves during POSTs.
      const final = reconcileNotes(
        getLocalNotes(),
        getLocalNotesMeta(),
        result.notes,
        result.updatedAt,
        committedSlugsRef.current
      );
      const secondResults = await Promise.all(
        Object.entries(final.toUpload)
          .filter(([s, note]) => {
            if (failedFirst.has(s)) return true;
            if (!Object.hasOwn(rec.toUpload, s)) return true;
            return rec.toUpload[s] !== note;
          })
          .map(([s, note]) => updateUserNote(s, note))
      );
      if (cancelled) return;

      // Re-read after POSTs so a save/clear during the second batch is not overwritten.
      const latest = reconcileNotes(
        getLocalNotes(),
        getLocalNotesMeta(),
        result.notes,
        result.updatedAt,
        committedSlugsRef.current
      );
      // Re-push concurrent commits (and any new local-wins) so a late second-batch POST
      // cannot leave cloud on a value the user already replaced or cleared.
      const thirdResults = await Promise.all(
        Object.entries(latest.toUpload)
          .filter(([s, note]) => {
            if (committedSlugsRef.current.has(s)) return true;
            if (!Object.hasOwn(rec.toUpload, s) && !Object.hasOwn(final.toUpload, s)) {
              return true;
            }
            const prev = Object.hasOwn(final.toUpload, s)
              ? final.toUpload[s]
              : rec.toUpload[s];
            return prev !== note;
          })
          .map(([s, note]) => updateUserNote(s, note))
      );
      if (cancelled) return;

      const uploadsFailed =
        firstResults.some((r) => !r.ok) ||
        secondResults.some((ok) => !ok) ||
        thirdResults.some((ok) => !ok);

      const settled = reconcileNotes(
        getLocalNotes(),
        getLocalNotesMeta(),
        result.notes,
        result.updatedAt,
        committedSlugsRef.current
      );
      saveLocalNotes(settled.merged);
      saveLocalNotesMeta(settled.mergedMeta);

      if (!dirtyRef.current) {
        setText(settled.merged[slug] ?? "");
      }

      if (uploadsFailed) {
        scheduleRetry(attempt + 1);
        return;
      }

      if (!cancelled) syncedOnSignInRef.current = true;
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
