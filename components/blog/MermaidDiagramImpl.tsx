"use client";

import { use, Suspense, type ReactNode } from "react";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

const renderCache = new Map<string, Promise<string | null>>();

function renderMermaid(chartText: string): Promise<string | null> {
  if (!renderCache.has(chartText)) {
    renderCache.set(
      chartText,
      (async () => {
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
          const { svg } = await mermaid.render(id, chartText);
          return svg;
        } catch {
          return null;
        }
      })()
    );
  }
  return renderCache.get(chartText)!;
}

function MermaidContent({ chartText }: { chartText: string }) {
  const svg = use(renderMermaid(chartText));

  if (!svg) {
    return (
      <pre className="my-4 rounded-lg border border-border bg-zinc-900 p-4 text-sm text-muted-foreground overflow-x-auto">
        <code>{chartText}</code>
      </pre>
    );
  }

  return (
    <div
      className="my-4 flex justify-center rounded-lg border border-border bg-zinc-900 p-4 overflow-x-auto [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function MermaidDiagramImpl({ chart }: { chart: ReactNode }) {
  const chartText = extractText(chart).trim();
  return (
    <Suspense
      fallback={
        <div className="my-4 flex items-center justify-center rounded-lg border border-border bg-zinc-900 p-8 text-sm text-muted-foreground">
          Loading diagram...
        </div>
      }
    >
      <MermaidContent chartText={chartText} />
    </Suspense>
  );
}
