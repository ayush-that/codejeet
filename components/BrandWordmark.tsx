"use client";

import Image from "next/image";
import { Antonio } from "next/font/google";
import { cn } from "@/lib/utils";

const antonio = Antonio({
  subsets: ["latin"],
  weight: ["700"],
});

type BrandLockupProps = {
  className?: string;
};

export function BrandLockup({ className }: BrandLockupProps) {
  return (
    <span
      className={cn(antonio.className, "brand-lockup inline-flex items-center gap-2", className)}
    >
      <Image
        src="/logo.png"
        alt=""
        width={24}
        height={24}
        priority
        aria-hidden
        className="brand-logo shrink-0"
      />
      <span className="brand-wordmark select-none">codejeet</span>
    </span>
  );
}
