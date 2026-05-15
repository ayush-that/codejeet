"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import type { Extension } from "@codemirror/state";
import type { LessonLanguage } from "@/lib/learn/types";

interface CodeEditorImplProps {
  value: string;
  onChange: (next: string) => void;
  language?: LessonLanguage;
  readOnly?: boolean;
}

export function CodeEditorImpl({
  value,
  onChange,
  language = "cpp",
  readOnly,
}: CodeEditorImplProps) {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [theme, setTheme] = useState<Extension | "dark">("dark");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const exts: Extension[] = [];
      if (language === "cpp") {
        const { cpp } = await import("@codemirror/lang-cpp");
        exts.push(cpp());
      } else if (language === "javascript") {
        const { javascript } = await import("@codemirror/lang-javascript");
        exts.push(javascript());
      } else if (language === "python") {
        const { python } = await import("@codemirror/lang-python");
        exts.push(python());
      } else if (language === "java") {
        const { java } = await import("@codemirror/lang-java");
        exts.push(java());
      }
      const { oneDark } = await import("@codemirror/theme-one-dark");
      if (cancelled) return;
      setExtensions(exts);
      setTheme(oneDark);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <CodeMirror
      value={value}
      height="100%"
      style={{ height: "100%", fontSize: 13.5 }}
      theme={theme}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        autocompletion: false,
        bracketMatching: true,
        highlightActiveLine: true,
        indentOnInput: true,
      }}
      extensions={extensions}
      readOnly={readOnly}
      onChange={onChange}
    />
  );
}
