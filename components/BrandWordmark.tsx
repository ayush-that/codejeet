import { cn } from "@/lib/utils";

type BrandLockupProps = {
  className?: string;
};

/** Navbar brand wordmark — Boldonse display face (short lockups only). */
export function BrandLockup({ className }: BrandLockupProps) {
  return (
    <span className={cn("font-heading brand-lockup inline-flex items-center", className)}>
      <span className="brand-wordmark select-none">CODEJEET</span>
    </span>
  );
}
