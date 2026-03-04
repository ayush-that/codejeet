import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProblem, getProblemSlugs, getProblemCompanies } from "@/lib/pseo-data";
import { problemMetadata, problemJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { capitalizeWords } from "@/utils/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const slugs = await getProblemSlugs();
  return slugs.map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = await getProblem(slug);
  if (!problem) return { title: "Problem Not Found" };

  const companiesMap = await getProblemCompanies();
  const companies = companiesMap[slug] ?? [];

  return problemMetadata({
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    acceptance_rate: problem.acceptance_rate,
    topics: problem.topics,
    companies,
  });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function topicSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = await getProblem(slug);
  if (!problem) return notFound();

  const companiesMap = await getProblemCompanies();
  const companies = companiesMap[slug] ?? [];

  const MAX_COMPANIES = 20;
  const visibleCompanies = companies.slice(0, MAX_COMPANIES);
  const remainingCount = companies.length - MAX_COMPANIES;

  const leetcodeUrl = `https://leetcode.com/problems/${problem.slug}/`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* JSON-LD structured data */}
      <JsonLd
        data={problemJsonLd({
          name: problem.title,
          description: `${problem.title} - ${problem.difficulty} LeetCode problem. ${problem.acceptance_rate} acceptance rate. Topics: ${problem.topics.join(", ")}.`,
          url: `https://codejeet.com/problem/${problem.slug}`,
          difficulty: problem.difficulty,
          topics: problem.topics,
        })}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: "Problems", href: "/dashboard" },
          { name: problem.title, href: `/problem/${problem.slug}` },
        ]}
      />

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
        {problem.id}. {problem.title}
      </h1>

      {/* Metadata row: difficulty, acceptance, submissions */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <DifficultyBadge difficulty={problem.difficulty as "Easy" | "Medium" | "Hard"} />
        <span className="text-sm text-muted-foreground">{problem.acceptance_rate} acceptance</span>
        <span className="text-sm text-muted-foreground">
          {formatNumber(problem.total_accepted)} / {formatNumber(problem.total_submissions)}{" "}
          submissions
        </span>
      </div>

      {/* Asked by companies */}
      {companies.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Asked by {companies.length} {companies.length === 1 ? "company" : "companies"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {visibleCompanies.map((companySlug) => (
              <Link
                key={companySlug}
                href={`/company/${companySlug}`}
                className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                {capitalizeWords(companySlug)}
              </Link>
            ))}
            {remainingCount > 0 && (
              <span className="px-2 py-1 rounded-full text-xs bg-secondary text-muted-foreground">
                +{remainingCount} more
              </span>
            )}
          </div>
        </section>
      )}

      {/* Topic tags */}
      {problem.topics.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {problem.topics.map((topic) => (
              <Link
                key={topic}
                href={`/topic/${topicSlug(topic)}`}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <hr className="border-border mb-8" />

      {/* Problem content */}
      <div
        className="prose dark:prose-invert max-w-none prose-pre:bg-secondary prose-pre:text-secondary-foreground prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none mb-8"
        dangerouslySetInnerHTML={{ __html: problem.content_html }}
      />

      {/* Hints */}
      {problem.hints.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">Hints</h2>
          <div className="space-y-2">
            {problem.hints.map((hint, i) => (
              <details key={i} className="group border border-border rounded-lg overflow-hidden">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground bg-secondary/50 hover:bg-secondary transition-colors select-none">
                  Hint {i + 1}
                </summary>
                <div
                  className="px-4 py-3 text-sm text-muted-foreground prose dark:prose-invert max-w-none prose-p:my-1"
                  dangerouslySetInnerHTML={{ __html: hint }}
                />
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Similar questions */}
      {problem.similar_questions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">Similar Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {problem.similar_questions.map((sq) => (
              <Link
                key={sq.slug}
                href={`/problem/${sq.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium text-card-foreground truncate">
                  {sq.title}
                </span>
                <DifficultyBadge difficulty={sq.difficulty as "Easy" | "Medium" | "Hard"} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* LeetCode link */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <a
          href={leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Solve on LeetCode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
