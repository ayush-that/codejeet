"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLearningDataLifecycle } from "@/components/LearningDataLifecycle";
import { learningData } from "@/lib/learning-data/facade";

interface ProblemNoteButtonProps {
  slug: string;
  title: string;
  layout: "desktop" | "mobile";
}

function isVisibleLayout(layout: ProblemNoteButtonProps["layout"]): boolean {
  return window.matchMedia(layout === "desktop" ? "(min-width: 768px)" : "(max-width: 767px)")
    .matches;
}

export function ProblemNoteButton({ slug, title, layout }: ProblemNoteButtonProps) {
  const { isLocallyActive, state, requestNoteFocus, noteFocusRequest } = useLearningDataLifecycle();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saveError, setSaveError] = useState(false);
  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dirtyRef = useRef(false);
  const draftVersionRef = useRef(0);
  const mutationGenRef = useRef(0);

  useEffect(() => {
    if (state.kind === "public" || state.kind === "activating") {
      dirtyRef.current = false;
      // oxlint-disable-next-line react/set-state-in-effect
      setText("");
    } else if (!dirtyRef.current) {
      // oxlint-disable-next-line react/set-state-in-effect
      setText(learningData.notes.readDraft(slug));
    }
  }, [state, slug]);

  useEffect(
    () =>
      learningData.notes.subscribe((notes) => {
        if (!dirtyRef.current) setText(notes[slug] ?? "");
      }),
    [slug]
  );

  useEffect(() => {
    if (isLocallyActive && noteFocusRequest?.slug === slug && isVisibleLayout(layout)) {
      // oxlint-disable-next-line react/set-state-in-effect
      setOpen(true);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [isLocallyActive, layout, noteFocusRequest, slug]);

  useEffect(() => {
    if (open && isLocallyActive) requestAnimationFrame(() => textareaRef.current?.focus());
  }, [isLocallyActive, open]);

  const handleSave = useCallback(async () => {
    if (!isLocallyActive) {
      requestNoteFocus(slug);
      return;
    }
    const gen = ++mutationGenRef.current;
    const draftVersion = draftVersionRef.current;
    try {
      const ok = await learningData.notes.save(slug, text, false);
      if (gen !== mutationGenRef.current) return;
      if (!ok) {
        if (draftVersion === draftVersionRef.current) setSaveError(true);
        return;
      }
      if (draftVersion === draftVersionRef.current) {
        setText(learningData.notes.readNote(slug));
        dirtyRef.current = false;
        setSaveError(false);
      }
    } catch {
      if (gen === mutationGenRef.current && draftVersion === draftVersionRef.current) setSaveError(true);
    }
  }, [isLocallyActive, requestNoteFocus, slug, text]);

  const handleClear = useCallback(async () => {
    if (!isLocallyActive) {
      requestNoteFocus(slug);
      return;
    }
    const gen = ++mutationGenRef.current;
    const draftVersion = ++draftVersionRef.current;
    dirtyRef.current = true;
    const previous = learningData.notes.readNote(slug);
    learningData.notes.setDraft(slug, "");
    setText("");
    try {
      const ok = await learningData.notes.clear(slug, previous, false);
      if (gen !== mutationGenRef.current) return;
      if (!ok) {
        if (draftVersion === draftVersionRef.current) {
          learningData.notes.setDraft(slug, previous);
          setText(previous);
        }
        return;
      }
      if (draftVersion === draftVersionRef.current) {
        dirtyRef.current = false;
        setSaveError(false);
      }
    } catch {
      if (gen === mutationGenRef.current && draftVersion === draftVersionRef.current) {
        learningData.notes.setDraft(slug, previous);
        setText(previous);
      }
    }
  }, [isLocallyActive, requestNoteFocus, slug]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !isLocallyActive) {
      requestNoteFocus(slug);
      return;
    }
    setOpen(nextOpen);
  };

  const visibleText = isLocallyActive ? text : "";
  const hasStored = isLocallyActive && Boolean(learningData.notes.readNote(slug));

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-7 w-7 items-center justify-center rounded-[2px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={`Open note for ${title}${isLocallyActive ? "" : "; sign in to edit"}`}
          title="Problem note"
        >
          <NotebookPen className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-3">
        <label htmlFor={textareaId} className="sr-only">
          Personal note for {title}
        </label>
        <textarea
          ref={textareaRef}
          id={textareaId}
          value={visibleText}
          onChange={(event) => {
            const next = event.target.value;
            if (next.length > learningData.notes.maxLength) return;
            dirtyRef.current = true;
            draftVersionRef.current += 1;
            setSaveError(false);
            learningData.notes.setDraft(slug, next);
            setText(next);
          }}
          placeholder="Patterns, edge cases, mistakes to avoid…"
          rows={5}
          maxLength={learningData.notes.maxLength}
          className="w-full resize-y rounded-[2px] border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {saveError && (
          <p role="alert" className="mt-2 text-xs text-destructive">
            Could not save your note. Your draft is still here.
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
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
            {learningData.notes.maxLength - visibleText.length} left
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
