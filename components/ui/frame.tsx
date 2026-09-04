import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Crosshair "+" marks centered on each corner — the ressl-style box-edge detail.
 * Drop inside any `relative` bordered element (Button, Card, badge, row).
 */
function CornerTicks({ className }: { className?: string }) {
  // Absolutely positioned, no wrapper element — so they never participate in
  // the parent's flex/grid flow (which would offset sibling content).
  return (
    <>
      <span aria-hidden className={cn("corner-tick corner-tl", className)} />
      <span aria-hidden className={cn("corner-tick corner-tr", className)} />
      <span aria-hidden className={cn("corner-tick corner-bl", className)} />
      <span aria-hidden className={cn("corner-tick corner-br", className)} />
    </>
  );
}

/** Bordered box with corner ticks. */
export const Frame = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ticks?: boolean }
>(({ className, children, ticks = true, ...props }, ref) => (
  <div ref={ref} className={cn("relative border border-border", className)} {...props}>
    {ticks && <CornerTicks />}
    {children}
  </div>
));
Frame.displayName = "Frame";
