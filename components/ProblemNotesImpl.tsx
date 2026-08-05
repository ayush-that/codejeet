"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  MAX_NOTE_LENGTH,
  clearLocalNote,
  fetchUserNotes,
  getLocalNote,
  getLocalNotes,
  mergeNotesMapsRespectingLocal,
  saveLocalNotes,
  setLocalNote,
  updateUserNote,
} from "@/utils/notesUtils";

interface ProblemNotesImplProps {
  slug: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Notes editor body. Loaded only on the client (via ProblemNotes dynamic ssr:false)
 * so the localStorage initializer runs in the browser, not during SSR.
 */
export function ProblemNotesImpl({ slug }: ProblemNotesImplProps) {
  const { isSignedIn } = useUser();
  const [text, setText] = useState(() => getLocalNote(slug));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // True once the user types, saves, or clears for this mount — remote merge must not clobber.
  const dirtyRef = useRef(false);
  // Slugs the user wrote/cleared while a cloud sync was in flight (local wins those keys).
  const protectedSlugsRef = useRef(new Set<string>());
  const pushedOnSignInRef = useRef(false);
  const savedFlashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On sign-in (once per mount): push local, pull remote, merge without stomping user edits.
  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    (async () => {
      if (!pushedOnSignInRef.current) {
        pushedOnSignInRef.current = true;
        const local = getLocalNotes();
        await Promise.all(Object.entries(local).map(([s, note]) => updateUserNote(s, note)));
      }
      const remote = await fetchUserNotes();
      if (cancelled) return;

      const local = getLocalNotes();
      const merged = mergeNotesMapsRespectingLocal(local, remote, protectedSlugsRef.current);
      saveLocalNotes(merged);

      // Never replace in-progress or just-saved textarea content with a stale remote value.
      if (!dirtyRef.current) {
        setText(merged[slug] ?? "");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, slug]);

  useEffect(() => {
    return () => {
      if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current);
    };
  }, []);

  const markUserEdit = useCallback((editedSlug: string) => {
    dirtyRef.current = true;
    protectedSlugsRef.current.add(editedSlug);
  }, []);

  const flashSaved = useCallback(() => {
    setSaveState("saved");
    if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current);
    savedFlashTimer.current = setTimeout(() => setSaveState("idle"), 1500);
  }, []);

  const handleSave = useCallback(async () => {
    markUserEdit(slug);
    setSaveState("saving");
    setLocalNote(slug, text);
    if (isSignedIn) {
      const ok = await updateUserNote(slug, text);
      if (!ok) {
        setSaveState("error");
        return;
      }
    }
    setText(getLocalNote(slug));
    flashSaved();
  }, [slug, text, isSignedIn, flashSaved, markUserEdit]);

  const handleClear = useCallback(async () => {
    markUserEdit(slug);
    setSaveState("saving");
    clearLocalNote(slug);
    setText("");
    if (isSignedIn) {
      const ok = await updateUserNote(slug, "");
      if (!ok) {
        setSaveState("error");
        return;
      }
    }
    flashSaved();
  }, [slug, isSignedIn, flashSaved, markUserEdit]);

  const remaining = MAX_NOTE_LENGTH - text.length;
  const hasStored = Boolean(getLocalNote(slug));
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
            markUserEdit(slug);
            setText(next);
          }
        }}
        placeholder="Patterns, edge cases, mistakes to avoid…"
        rows={5}
        maxLength={MAX_NOTE_LENGTH}
        className="w-full resize-y rounded-[2px] border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Personal note for this problem"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={() => void handleSave()}>
          Save note
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void handleClear()}
          disabled={!text && !hasStored}
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
