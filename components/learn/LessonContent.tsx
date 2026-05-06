import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { cn } from "@/lib/utils";

interface LessonContentProps {
  body: string;
  className?: string;
}

export function LessonContent({ body, className }: LessonContentProps) {
  return (
    <article
      className={cn(
        "prose prose-invert max-w-none prose-pre:!bg-zinc-950 prose-pre:!border prose-pre:!border-zinc-800",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-headings:tracking-tight prose-headings:font-semibold",
        "prose-p:leading-relaxed",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
      >
        {body}
      </ReactMarkdown>
    </article>
  );
}
