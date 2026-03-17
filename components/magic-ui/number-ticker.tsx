"use client";

import { useRef, useSyncExternalStore, useCallback } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

import { cn } from "@/lib/utils";

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const hasStarted = useRef(false);

  if (isInView && !hasStarted.current) {
    hasStarted.current = true;
    animate(motionValue, direction === "down" ? 0 : value, {
      type: "spring",
      damping: 60,
      stiffness: 100,
      delay,
    });
  }

  const subscribe = useCallback((cb: () => void) => motionValue.on("change", cb), [motionValue]);

  const getSnapshot = useCallback(
    () =>
      Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(motionValue.get().toFixed(decimalPlaces))),
    [motionValue, decimalPlaces]
  );

  const initialValue = direction === "down" ? value : 0;
  const serverSnapshot = Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(initialValue);
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  const displayValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className
      )}
      ref={ref}
    >
      {displayValue}
    </span>
  );
}
