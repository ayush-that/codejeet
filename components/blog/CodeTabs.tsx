"use client";

import { useState, Children, isValidElement, type ReactNode } from "react";

const LANG_NAMES: Record<string, string> = {
  python: "Python",
  javascript: "JavaScript",
  js: "JavaScript",
  java: "Java",
  cpp: "C++",
  go: "Go",
  typescript: "TypeScript",
  ts: "TypeScript",
};

interface CodeBlock {
  lang: string;
  label: string;
  content: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

function extractCodeBlocks(children: ReactNode): CodeBlock[] {
  const blocks: CodeBlock[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const props = child.props as AnyProps;

    // ReactMarkdown renders fenced code as <pre><code className="language-x">
    if (child.type === "pre" || props?.node?.tagName === "pre") {
      const preChildren = Children.toArray(props.children);
      const codeChild = preChildren.find((c) => {
        if (!isValidElement(c)) return false;
        const cProps = c.props as AnyProps;
        return c.type === "code" || cProps?.node?.tagName === "code";
      });

      if (isValidElement(codeChild)) {
        const codeProps = codeChild.props as AnyProps;
        const className: string = codeProps?.className ?? "";
        const match = className.match(/language-(\w+)/);
        const lang = match ? match[1] : "text";
        const label = LANG_NAMES[lang] ?? lang;
        blocks.push({ lang, label, content: child });
      }
    }
  });

  return blocks;
}

export function CodeTabs({ children }: { children: ReactNode }) {
  const blocks = extractCodeBlocks(children);
  const [active, setActive] = useState(0);

  if (blocks.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <div className="my-4 rounded-lg border border-border bg-zinc-900 overflow-hidden">
      <div className="flex border-b border-border bg-zinc-900/80">
        {blocks.map((block, i) => (
          <button
            key={`${block.lang}-${i}`}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              i === active
                ? "text-foreground border-b-2 border-primary bg-zinc-800/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {block.label}
          </button>
        ))}
      </div>
      <div className="[&>pre]:!mt-0 [&>pre]:!mb-0 [&>pre]:!rounded-none [&>pre]:!border-0">
        {blocks[active].content}
      </div>
    </div>
  );
}
