"use client";

import dynamic from "next/dynamic";
import type { LessonLanguage } from "@/lib/learn/types";

interface CodeEditorProps {
  value: string;
  onChange: (next: string) => void;
  language?: LessonLanguage;
  className?: string;
  readOnly?: boolean;
}

const CodeEditorImpl = dynamic(() => import("./CodeEditorImpl").then((m) => m.CodeEditorImpl), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted/40 text-muted-foreground text-sm font-mono">
      Loading editor…
    </div>
  ),
});

export function CodeEditor(props: CodeEditorProps) {
  return (
    <div className={props.className} style={{ minHeight: 0 }}>
      <CodeEditorImpl {...props} />
    </div>
  );
}
