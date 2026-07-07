import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CodeTabs } from "@/components/blog/CodeTabs";
import { MermaidDiagram } from "@/components/blog/MermaidDiagram";
import { comparePairFromBlogSlug } from "@/lib/compare";
import { getBlogIndex, getBlogPost, getBlogSlugs } from "@/lib/blog-data";
import "./code-theme.css";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Blog Post Not Found" };

  const comparePair = comparePairFromBlogSlug(slug);
  const canonical = comparePair
    ? `https://codejeet.com/compare/${comparePair}`
    : `https://codejeet.com/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: `${post.title} | CodeJeet`,
      description: post.description,
      type: "article",
      url: canonical,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return notFound();

  const rawContent = post.content;

  const content = rawContent
    .replace(/<div class="code-group">\s*\n/g, '<div class="code-group">\n\n')
    .replace(/\n\s*<\/div>/g, "\n\n</div>");

  const blogIndex = await getBlogIndex();
  const related = blogIndex
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          url: `https://codejeet.com/blog/${slug}`,
          author: {
            "@type": "Organization",
            name: "CodeJeet",
            url: "https://codejeet.com",
          },
          publisher: {
            "@type": "Organization",
            name: "CodeJeet",
            url: "https://codejeet.com",
            logo: { "@type": "ImageObject", url: "https://codejeet.com/icon.svg" },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://codejeet.com/blog/${slug}`,
          },
          isPartOf: { "@type": "WebSite", name: "CodeJeet", url: "https://codejeet.com" },
        }}
      />

      <Breadcrumbs
        items={[
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${slug}` },
        ]}
      />

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <time dateTime={post.date}>{post.date}</time>
            <span className="text-muted-foreground/50">|</span>
            <span className="capitalize">{post.category.replace(/-/g, " ")}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
        </header>

        <div className="prose dark:prose-invert max-w-none prose-headings:mt-8 prose-headings:mb-3 prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-pre:my-4 prose-table:my-4 prose-a:text-primary">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
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
        </div>
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
