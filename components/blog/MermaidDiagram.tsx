"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export function MermaidDiagram({ chart }: { chart: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const chartText = extractText(chart).trim();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            darkMode: true,
            background: "#18181b",
            primaryColor: "#3b82f6",
            primaryTextColor: "#e4e4e7",
            lineColor: "#71717a",
          },
        });

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, chartText);
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chartText]);

  if (error) {
    return (
      <pre className="my-4 rounded-lg border border-border bg-zinc-900 p-4 text-sm text-muted-foreground overflow-x-auto">
        <code>{chartText}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="my-4 flex items-center justify-center rounded-lg border border-border bg-zinc-900 p-8 text-sm text-muted-foreground">
        Loading diagram...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center rounded-lg border border-border bg-zinc-900 p-4 overflow-x-auto [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
