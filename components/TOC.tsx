"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback, { passive: true });
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getActiveHeadingId(items: TocItem[]): string {
  const headings = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
  let current = headings[0]?.id || "";
  for (const h of headings) {
    const top = h.getBoundingClientRect().top;
    if (top <= 100) current = h.id;
    else break;
  }
  return current;
}

export default function TOC({ items }: { items: TocItem[] }) {
  const getSnapshot = React.useCallback(() => getActiveHeadingId(items), [items]);
  const activeId = React.useSyncExternalStore(subscribeToScroll, getSnapshot, () => "");

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="text-sm sticky top-20 max-h-[80vh] overflow-auto pr-4"
    >
      <div className="font-medium mb-2 text-muted-foreground">On this page</div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn("leading-6", item.depth > 2 && "pl-4", item.depth > 3 && "pl-8")}
          >
            <Link
              href={`#${item.id}`}
              className={cn(
                "hover:underline",
                activeId === item.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
