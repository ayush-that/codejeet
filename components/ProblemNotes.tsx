"use client";

import dynamic from "next/dynamic";

interface ProblemNotesProps {
  slug: string;
}

// dynamic(ssr:false) must live in a Client Component — Next 16 rejects it in Server Components.
const ProblemNotesImpl = dynamic(
  () => import("./ProblemNotesImpl").then((m) => m.ProblemNotesImpl),
  {
    ssr: false,
    loading: () => (
      <section
        className="mb-8 rounded-[2px] border border-border bg-card p-4"
        aria-hidden
      >
        <div className="mb-2 h-4 w-24 rounded-[2px] bg-muted" />
        <div className="h-28 rounded-[2px] bg-muted/60" />
      </section>
    ),
  }
);

export default function ProblemNotes({ slug }: ProblemNotesProps) {
  return <ProblemNotesImpl slug={slug} />;
}
