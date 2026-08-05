import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import Slugger from "github-slugger";
import TOC, { TocItem } from "@/components/TOC";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, videoObjectJsonLd } from "@/lib/seo";
import { SYSTEM_DESIGN_CHAPTERS } from "@/lib/system-design/generated";

export const dynamicParams = true;

function findChapterBySlug(slug: string) {
  return SYSTEM_DESIGN_CHAPTERS.find((c) => c.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return SYSTEM_DESIGN_CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = findChapterBySlug(slug);
  if (chapter) {
    const title = chapter.title || chapter.heading || "System Design";
    return {
      title: `${title} - System Design Interview`,
      description: `Learn ${title} for system design interviews. In-depth guide with diagrams, examples, and video explanations.`,
      alternates: { canonical: `https://codejeet.com/system-design/${slug}` },
      openGraph: {
        title: `${title} - System Design Interview | CodeJeet`,
        description: `Learn ${title} for system design interviews. In-depth guide with diagrams and examples.`,
        type: "article",
        url: `https://codejeet.com/system-design/${slug}`,
      },
    };
  }
  return { title: "System Design" };
}

export default async function SystemDesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const slug = decodeURIComponent(resolved.slug);
  const chapter = findChapterBySlug(slug);
  if (!chapter) return notFound();
  const { content, folder } = chapter;
  const video = chapter.video ?? null;

  function toYouTubeEmbed(url: string): string | null {
    try {
      const trimmed = url.trim();
      if (!trimmed) return null;
      let m = trimmed.match(/^https?:\/\/youtu\.be\/([\w-]{6,})/i);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
      m = trimmed.match(/[?&]v=([\w-]{6,})/i);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
      m = trimmed.match(/youtube\.com\/shorts\/([\w-]{6,})/i);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
      return null;
    } catch {
      return null;
    }
  }
  const embedUrl = video ? toYouTubeEmbed(video) : null;

  const slugger = new Slugger();
  const toc: TocItem[] = [];
  for (const line of content.split("\n")) {
    const m = /^(#{1,4})\s+(.+)$/.exec(line.trim());
    if (m) {
      const depth = m[1].length;
      const text = m[2].replace(/[#`*_]+/g, "").trim();
      const id = slugger.slug(text);
      toc.push({ id, text, depth });
    }
  }

  const chapters = SYSTEM_DESIGN_CHAPTERS.map((c) => ({
    slug: c.slug,
    title: c.heading || c.folder.replace(/[-_]+/g, " "),
  }));

  const pageTitle = chapter.heading ?? slug;

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "System Design", url: "/system-design" },
          { name: pageTitle, url: `/system-design/${slug}` },
        ])}
      />
      {embedUrl && (
        <JsonLd
          data={videoObjectJsonLd({
            name: `${pageTitle} - System Design`,
            description: `System design interview guide: ${pageTitle}. Learn key concepts with visual explanations.`,
            thumbnailUrl: `https://codejeet.com/og-image.png`,
            embedUrl,
          })}
        />
      )}
      <div className="md:hidden mb-4 space-y-2">
        <details className="w-full border rounded-lg">
          <summary className="cursor-pointer px-3 py-2">Chapters</summary>
          <div className="p-3">
            <nav aria-label="Chapters" className="text-sm">
              <ul className="space-y-1">
                {chapters.map((c) => (
                  <li key={c.slug} className="leading-6">
                    <Link
                      href={`/system-design/${encodeURIComponent(c.slug)}`}
                      className={cn(
                        "hover:underline",
                        c.slug === slug ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </details>
        <details className="w-full border rounded-lg">
          <summary className="cursor-pointer px-3 py-2">On this page</summary>
          <div className="p-3">
            <TOC items={toc} />
          </div>
        </details>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <aside className="hidden md:block col-span-3">
          <TOC items={toc} />
        </aside>
        <div className="col-span-12 md:col-span-6 mx-auto max-w-3xl order-last md:order-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              rehypeHighlight,
            ]}
            className="prose dark:prose-invert max-w-none prose-headings:mt-6 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-pre:my-3 prose-table:my-4"
            components={{
              h1: ({ children }) => (
                <div>
                  <h1>{children}</h1>
                  {embedUrl && (
                    <div className="my-4">
                      <div
                        className="w-full rounded-lg overflow-hidden border"
                        style={{ aspectRatio: "16 / 9" }}
                      >
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              ),
              iframe: undefined,
              img: (props) => {
                const rawSrc = (props.src ?? "").toString();
                const isAbsolute = /^([a-z]+:)?\/\//i.test(rawSrc) || rawSrc.startsWith("/");
                const normalized = rawSrc.replace(/^\.\/?/, "");
                const finalSrc = isAbsolute
                  ? rawSrc
                  : `/system-design/${encodeURIComponent(folder)}/${normalized}`;
                return (
                  <Image
                    src={finalSrc}
                    alt={props.alt ?? ""}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="rounded-lg border my-4"
                  />
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <aside className="hidden md:block col-span-3">
          <nav
            aria-label="Chapters"
            className="text-sm sticky top-20 max-h-[80vh] overflow-auto pl-2"
          >
            <div className="font-medium mb-2 text-muted-foreground">Chapters</div>
            <ul className="space-y-1">
              {chapters.map((c) => (
                <li key={c.slug} className="leading-6">
                  <Link
                    href={`/system-design/${encodeURIComponent(c.slug)}`}
                    className={cn(
                      "hover:underline",
                      c.slug === slug ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
