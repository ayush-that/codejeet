import * as React from "react";
import { cn } from "@/lib/utils";

/** Full-width diagonal-hatch divider strip between sections. */
export function HatchDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("hatch h-10 w-full border-y border-border", className)} />;
}

/** Small mono uppercase label with a leading bar marker (e.g. ▍ Features). */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className
      )}
    >
      <span aria-hidden className="h-3 w-[3px] bg-foreground/70" />
      {children}
    </span>
  );
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
