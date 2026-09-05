"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useLearningDataLifecycle } from "@/components/LearningDataLifecycle";

export function AccountUserButton() {
  const { user } = useUser();
  const { signOut } = useLearningDataLifecycle();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="size-8 overflow-hidden rounded-full border border-border bg-muted"
      >
        <span className="text-xs font-medium">{user?.firstName?.[0] ?? "U"}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 min-w-32 rounded-md border border-border bg-popover p-1 shadow-md">
          <button
            type="button"
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
