"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TopBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-[#FACC15] text-black py-2.5 px-4 pr-10 text-center text-sm font-medium">
      <div className="mx-auto max-w-5xl">
        <span>
          Typing code is easy. Explaining it out loud is hard. Pass the verbal technical screen with
          Crackr&apos;s Live AI Interviewer. 🎙️{" "}
        </span>
        <a
          href="https://crackr.dev/?utm_source=codejeet&utm_medium=top_banner&utm_campaign=1week_test"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="ml-1 inline-block rounded-md bg-black px-3 py-0.5 text-sm font-semibold text-[#FACC15] transition-opacity hover:opacity-80"
        >
          Start Free Mock
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 transition-opacity hover:opacity-60"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
