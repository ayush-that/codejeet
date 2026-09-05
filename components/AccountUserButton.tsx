"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useLearningDataLifecycle } from "@/components/LearningDataLifecycle";

export function AccountUserButton() {
  const { user } = useUser();
  const { signOut } = useLearningDataLifecycle();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        ref={triggerRef}
        aria-label="Open account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="size-8 overflow-hidden rounded-full border border-border bg-muted"
      >
        <span className="text-xs font-medium">{user?.firstName?.[0] ?? "U"}</span>
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-10 z-50 min-w-32 rounded-md border border-border bg-popover p-1 shadow-md"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full rounded-sm px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
