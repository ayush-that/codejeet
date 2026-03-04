import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import matter from "gray-matter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CodeTabs } from "@/components/blog/CodeTabs";
import { MermaidDiagram } from "@/components/blog/MermaidDiagram";
import "./code-theme.css";

export const dynamic = "force-static";
export const dynamicParams = false;

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const DATA_DIR = path.join(process.cwd(), "public", "data");

interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  category: "company-guide" | "tips" | "dsa-patterns";
  company?: string;
  tags?: string[];
}

interface BlogIndexEntry {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

async function getBlogIndex(): Promise<BlogIndexEntry[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, "blog-index.json"), "utf8");
  return JSON.parse(raw);
}

async function getPost(
  slug: string
): Promise<{ frontmatter: BlogFrontmatter; content: string } | null> {
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), "utf8");
    const { data, content } = matter(raw);
    return { frontmatter: data as BlogFrontmatter, content };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const files = await fs.readdir(BLOG_DIR);
  return files.filter((f) => f.endsWith(".md")).map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Blog Post Not Found" };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: { canonical: `https://codejeet.com/blog/${slug}` },
    openGraph: {
      title: `${post.frontmatter.title} | CodeJeet`,
      description: post.frontmatter.description,
      type: "article",
      url: `https://codejeet.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();

  const { frontmatter, content: rawContent } = post;

  // Ensure blank lines around code-group div tags so fenced code blocks
  // inside them are parsed as markdown, not raw HTML
  const content = rawContent
    .replace(/<div class="code-group">\s*\n/g, '<div class="code-group">\n\n')
    .replace(/\n\s*<\/div>/g, "\n\n</div>");

  const blogIndex = await getBlogIndex();
  const related = blogIndex
    .filter((p) => p.slug !== slug && p.category === frontmatter.category)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: frontmatter.title,
          description: frontmatter.description,
          datePublished: frontmatter.date,
          url: `https://codejeet.com/blog/${slug}`,
          isPartOf: { "@type": "WebSite", name: "CodeJeet", url: "https://codejeet.com" },
        }}
      />

      <Breadcrumbs
        items={[
          { name: "Blog", href: "/blog" },
          { name: frontmatter.title, href: `/blog/${slug}` },
        ]}
      />

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <time dateTime={frontmatter.date}>{frontmatter.date}</time>
            <span className="text-muted-foreground/50">|</span>
            <span className="capitalize">{frontmatter.category.replace(/-/g, " ")}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{frontmatter.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{frontmatter.description}</p>
        </header>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
          className="prose dark:prose-invert max-w-none prose-headings:mt-8 prose-headings:mb-3 prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-pre:my-4 prose-table:my-4 prose-a:text-primary"
          components={{
            a: ({ href, children }) => {
              if (href?.startsWith("/")) {
                return (
                  <Link href={href} className="text-primary hover:underline">
                    {children}
                  </Link>
                );
              }
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            },
            div: ({ className, children }) => {
              if (className?.includes("code-group")) {
                return <CodeTabs>{children}</CodeTabs>;
              }
              return <div className={className}>{children}</div>;
            },
            pre: ({ children }) => {
              // Check if the child is a mermaid code block
              if (
                children &&
                typeof children === "object" &&
                "props" in children &&
                typeof (children as { props: Record<string, unknown> }).props.className ===
                  "string" &&
                (
                  (children as { props: Record<string, unknown> }).props.className as string
                ).includes("language-mermaid")
              ) {
                return (
                  <MermaidDiagram
                    chart={(children as { props: { children: React.ReactNode } }).props.children}
                  />
                );
              }
              return <pre>{children}</pre>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="block rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
              >
                <h3 className="font-medium text-card-foreground">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
