"use client";

import { Chango } from "next/font/google";
import { cn } from "@/lib/utils";

const chango = Chango({
  subsets: ["latin"],
  weight: "400",
});

type BrandLockupProps = {
  className?: string;
};

export function BrandLockup({ className }: BrandLockupProps) {
  return (
    <span
      className={cn(chango.className, "brand-lockup inline-flex items-center", className)}
    >
      <span className="brand-wordmark select-none">Codejeet</span>
    </span>
  );
}
