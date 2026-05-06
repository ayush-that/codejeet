"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import type { Extension } from "@codemirror/state";

interface CodeEditorImplProps {
  value: string;
  onChange: (next: string) => void;
  language?: "cpp";
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
