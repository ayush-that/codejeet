import * as React from "react";
import { cn } from "@/lib/utils";

/** Full-width diagonal-hatch divider strip between sections. */
export function HatchDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("hatch h-10 w-full border-y border-border", className)} />;
}

/** Thin faint vertical rails framing a centered content column. */
export function GridRails({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="container relative mx-auto h-full">
        <div className="absolute inset-y-0 left-0 w-px bg-border" />
        <div className="absolute inset-y-0 right-0 w-px bg-border" />
      </div>
    </div>
  );
}
