import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCompanyProfile,
  getFilterTypeLookup,
  getProblem,
  getProblemCompanies,
} from "@/lib/pseo-data";
import { collectionJsonLd, problemJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { capitalizeWords } from "@/utils/utils";

export const dynamicParams = true;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FilterType = "topic" | "difficulty" | "problem";

type PageParams = { slug: string; filter: string };

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toTopicSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function resolveFilterType(filter: string): Promise<FilterType> {
  const lookup = await getFilterTypeLookup();
  return lookup[filter] ?? "problem";
}

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

// Empty to avoid pre-rendering (SSR on demand at the edge)
export function generateStaticParams() {
  return [];
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug, filter } = await params;
  const profile = await getCompanyProfile(slug);
  if (!profile) return { title: "Not Found" };

  const filterType = await resolveFilterType(filter);
  const { displayName, questions } = profile;

  if (filterType === "topic") {
    const topicLabel = capitalizeWords(filter);
    const filtered = questions.filter((q) => q.topics.some((t) => toTopicSlug(t) === filter));
    const count = filtered.length;

    return {
      title: `${displayName} ${topicLabel} Interview Questions (${count} Problems)`,
      description:
        `Practice ${count} ${topicLabel} problems asked at ${displayName}. ` +
        `Filter by difficulty and frequency. Sorted by interview frequency.`,
      alternates: { canonical: `https://codejeet.com/company/${slug}/${filter}` },
      robots: { index: false, follow: true },
      openGraph: {
        title: `${displayName} ${topicLabel} Interview Questions | CodeJeet`,
        description: `Browse ${count} ${topicLabel} LeetCode problems asked at ${displayName}.`,
        type: "website",
        url: `https://codejeet.com/company/${slug}/${filter}`,
      },
    };
  }

  if (filterType === "difficulty") {
    const diffLabel = capitalizeWords(filter);
    const filtered = questions.filter((q) => q.difficulty.toLowerCase() === filter);
    const count = filtered.length;

    return {
      title: `${displayName} ${diffLabel} Interview Questions (${count} Problems)`,
      description:
        `Practice ${count} ${diffLabel.toLowerCase()} difficulty problems asked at ${displayName}. ` +
        `Sorted by interview frequency.`,
      alternates: { canonical: `https://codejeet.com/company/${slug}/${filter}` },
      robots: { index: false, follow: true },
      openGraph: {
        title: `${displayName} ${diffLabel} Interview Questions | CodeJeet`,
        description: `Browse ${count} ${diffLabel.toLowerCase()} LeetCode problems asked at ${displayName}.`,
        type: "website",
        url: `https://codejeet.com/company/${slug}/${filter}`,
      },
    };
  }

  // Problem filter — canonical points to /problem/[slug] to avoid duplicate content
  const problem = await getProblem(filter);
  if (!problem) return { title: "Not Found" };

  return {
    title: `${problem.title} \u2014 ${displayName} Interview Question`,
    description:
      `${problem.title} is a ${problem.difficulty.toLowerCase()} LeetCode problem asked at ${displayName}. ` +
      `${problem.acceptance_rate} acceptance rate. Topics: ${problem.topics.slice(0, 4).join(", ")}.`,
    alternates: { canonical: `https://codejeet.com/problem/${filter}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: `${problem.title} \u2014 ${displayName} Interview Question | CodeJeet`,
      description: `${problem.title} at ${displayName}. ${problem.difficulty}, ${problem.acceptance_rate} acceptance.`,
      type: "article",
      url: `https://codejeet.com/company/${slug}/${filter}`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function CompanyFilterPage({ params }: { params: Promise<PageParams> }) {
  const { slug, filter } = await params;
  const profile = await getCompanyProfile(slug);
  if (!profile) return notFound();

  const filterType = await resolveFilterType(filter);

  if (filterType === "topic") {
    return <TopicFilterView slug={slug} filter={filter} profile={profile} />;
  }

  if (filterType === "difficulty") {
    return <DifficultyFilterView slug={slug} filter={filter} profile={profile} />;
  }

  return <ProblemFilterView slug={slug} filter={filter} profile={profile} />;
}

/* ------------------------------------------------------------------ */
/*  Topic Filter View                                                  */
/* ------------------------------------------------------------------ */

function TopicFilterView({
  slug,
  filter,
  profile,
}: {
  slug: string;
  filter: string;
  profile: NonNullable<Awaited<ReturnType<typeof getCompanyProfile>>>;
}) {
  const { displayName, questions } = profile;
  const topicLabel = capitalizeWords(filter);
  const filtered = questions.filter((q) => q.topics.some((t) => toTopicSlug(t) === filter));

  if (filtered.length === 0) return notFound();

  const diffDist = { easy: 0, medium: 0, hard: 0 };
  for (const q of filtered) {
    const key = q.difficulty.toLowerCase() as "easy" | "medium" | "hard";
    if (key in diffDist) diffDist[key]++;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs
        items={[
          { name: "Companies", href: "/dashboard" },
          { name: displayName, href: `/company/${slug}` },
          { name: topicLabel, href: `/company/${slug}/${filter}` },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {displayName} {topicLabel} Questions
        </h1>
        <p className="mt-2 text-muted-foreground">
          {filtered.length} {topicLabel.toLowerCase()}{" "}
          {filtered.length === 1 ? "problem" : "problems"} asked at {displayName} interviews
        </p>
      </header>

      {/* Difficulty breakdown */}
      <section className="mb-8" aria-label="Difficulty breakdown">
        <div className="flex flex-wrap gap-3">
          {(["Easy", "Medium", "Hard"] as const).map((d) => {
            const count = diffDist[d.toLowerCase() as "easy" | "medium" | "hard"];
            if (count === 0) return null;
            return <DifficultyBadge key={d} difficulty={d} count={count} showCount />;
          })}
        </div>
      </section>

      {/* Questions table */}
      <section aria-label="Questions">
        <h2 className="text-lg font-semibold mb-4">Questions</h2>
        <QuestionTable questions={filtered} />
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filtered.length} {filtered.length === 1 ? "question" : "questions"}
        </p>
      </section>

      {/* Internal links */}
      <nav className="mt-8 flex flex-wrap gap-3" aria-label="Related pages">
        <Link
          href={`/company/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          All {displayName} Questions
        </Link>
        <Link
          href={`/topic/${filter}`}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          All {topicLabel} Questions
        </Link>
      </nav>

      <JsonLd
        data={collectionJsonLd({
          name: `${displayName} ${topicLabel} Interview Questions`,
          description: `${filtered.length} ${topicLabel} LeetCode problems asked at ${displayName} interviews.`,
          url: `https://codejeet.com/company/${slug}/${filter}`,
          numberOfItems: filtered.length,
        })}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Difficulty Filter View                                             */
/* ------------------------------------------------------------------ */

function DifficultyFilterView({
  slug,
  filter,
  profile,
}: {
  slug: string;
  filter: string;
  profile: NonNullable<Awaited<ReturnType<typeof getCompanyProfile>>>;
}) {
  const { displayName, questions } = profile;
  const diffLabel = capitalizeWords(filter);
  const filtered = questions.filter((q) => q.difficulty.toLowerCase() === filter);

  if (filtered.length === 0) return notFound();

  // Collect topic distribution for this difficulty slice
  const topicCounts = new Map<string, number>();
  for (const q of filtered) {
    for (const t of q.topics) {
      topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
    }
  }
  const topTopics = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs
        items={[
          { name: "Companies", href: "/dashboard" },
          { name: displayName, href: `/company/${slug}` },
          { name: diffLabel, href: `/company/${slug}/${filter}` },
        ]}
      />

      <header className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {displayName} {diffLabel} Questions
          </h1>
          <DifficultyBadge difficulty={diffLabel as "Easy" | "Medium" | "Hard"} />
        </div>
        <p className="mt-2 text-muted-foreground">
          {filtered.length} {diffLabel.toLowerCase()}{" "}
          {filtered.length === 1 ? "problem" : "problems"} asked at {displayName} interviews
        </p>
      </header>

      {/* Top topics for this difficulty */}
      {topTopics.length > 0 && (
        <section className="mb-8" aria-label="Top topics">
          <h2 className="text-lg font-semibold mb-4">Top Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topTopics.map(([topic, count]) => (
              <Link
                key={topic}
                href={`/topic/${toTopicSlug(topic)}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {topic}
                <span className="text-muted-foreground">({count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Questions table */}
      <section aria-label="Questions">
        <h2 className="text-lg font-semibold mb-4">Questions</h2>
        <QuestionTable questions={filtered} />
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filtered.length} {filtered.length === 1 ? "question" : "questions"}
        </p>
      </section>

      {/* Internal links */}
      <nav className="mt-8 flex flex-wrap gap-3" aria-label="Related pages">
        <Link
          href={`/company/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          All {displayName} Questions
        </Link>
        <Link
          href={`/difficulty/${filter}`}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          All {diffLabel} Questions
        </Link>
      </nav>

      <JsonLd
        data={collectionJsonLd({
          name: `${displayName} ${diffLabel} Interview Questions`,
          description: `${filtered.length} ${diffLabel.toLowerCase()} LeetCode problems asked at ${displayName} interviews.`,
          url: `https://codejeet.com/company/${slug}/${filter}`,
          numberOfItems: filtered.length,
        })}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Problem Filter View                                                */
/* ------------------------------------------------------------------ */

async function ProblemFilterView({
  slug,
  filter,
  profile,
}: {
  slug: string;
  filter: string;
  profile: NonNullable<Awaited<ReturnType<typeof getCompanyProfile>>>;
}) {
  const { displayName, questions } = profile;

  // Find the question in this company's list
  const companyQuestion = questions.find((q) => q.slug === filter);
  if (!companyQuestion) return notFound();

  // Load full problem data
  const problem = await getProblem(filter);
  const companiesMap = await getProblemCompanies();
  const otherCompanies = (companiesMap[filter] ?? []).filter((c) => c !== slug);

  // Truncate the question description to 300 chars
  const description = problem?.question
    ? problem.question.length > 300
      ? problem.question.slice(0, 300).trimEnd() + "..."
      : problem.question
    : null;

  // Find related questions from the same company with overlapping topics
  const questionTopicSlugs = new Set(companyQuestion.topics.map(toTopicSlug));
  const related = questions
    .filter(
      (q) => q.slug !== filter && q.topics.some((t) => questionTopicSlugs.has(toTopicSlug(t)))
    )
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs
        items={[
          { name: "Companies", href: "/dashboard" },
          { name: displayName, href: `/company/${slug}` },
          { name: companyQuestion.title, href: `/company/${slug}/${filter}` },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {companyQuestion.title} at {displayName}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <DifficultyBadge difficulty={companyQuestion.difficulty as "Easy" | "Medium" | "Hard"} />
          <span className="text-sm text-muted-foreground">
            {companyQuestion.acceptance} acceptance
          </span>
        </div>
      </header>

      {/* Frequency */}
      <section className="mb-6 rounded-lg border bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          This problem has{" "}
          <span className="font-semibold text-foreground">{companyQuestion.frequency}</span>{" "}
          frequency at {displayName}.
        </p>
      </section>

      {/* Problem description preview */}
      {description && (
        <section className="mb-8" aria-label="Problem description">
          <h2 className="text-lg font-semibold mb-3">Problem Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <Link
            href={`/problem/${filter}`}
            className="inline-block mt-3 text-sm font-medium text-primary hover:underline"
          >
            Read full problem and hints
          </Link>
        </section>
      )}

      {/* Topic tags */}
      {companyQuestion.topics.length > 0 && (
        <section className="mb-8" aria-label="Topics">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {companyQuestion.topics.map((topic) => (
              <Link
                key={topic}
                href={`/topic/${toTopicSlug(topic)}`}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other companies asking this */}
      {otherCompanies.length > 0 && (
        <section className="mb-8" aria-label="Other companies">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Also asked at {otherCompanies.length}{" "}
            {otherCompanies.length === 1 ? "company" : "companies"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCompanies.slice(0, 20).map((companySlug) => (
              <Link
                key={companySlug}
                href={`/company/${companySlug}`}
                className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                {capitalizeWords(companySlug)}
              </Link>
            ))}
            {otherCompanies.length > 20 && (
              <span className="px-2 py-1 rounded-full text-xs bg-secondary text-muted-foreground">
                +{otherCompanies.length - 20} more
              </span>
            )}
          </div>
        </section>
      )}

      <hr className="border-border mb-8" />

      {/* Full problem link */}
      <div className="mb-8">
        <Link
          href={`/problem/${filter}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View Full Problem
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Related questions from this company */}
      {related.length > 0 && (
        <section aria-label="Related questions">
          <h2 className="text-lg font-semibold mb-4">More {displayName} Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((q) => (
              <Link
                key={q.slug}
                href={`/company/${slug}/${q.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium text-card-foreground truncate">{q.title}</span>
                <DifficultyBadge difficulty={q.difficulty as "Easy" | "Medium" | "Hard"} />
              </Link>
            ))}
          </div>
          <Link
            href={`/company/${slug}`}
            className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
          >
            View all {displayName} questions
          </Link>
        </section>
      )}

      <JsonLd
        data={problemJsonLd({
          name: `${companyQuestion.title} at ${displayName}`,
          description:
            `${companyQuestion.title} is a ${companyQuestion.difficulty.toLowerCase()} interview question asked at ${displayName}. ` +
            `Topics: ${companyQuestion.topics.join(", ")}.`,
          url: `https://codejeet.com/company/${slug}/${filter}`,
          difficulty: companyQuestion.difficulty,
          topics: companyQuestion.topics,
        })}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Question Table (shared by topic & difficulty views)                */
/* ------------------------------------------------------------------ */

function QuestionTable({
  questions,
}: {
  questions: {
    slug: string;
    title: string;
    difficulty: string;
    acceptance: string;
    frequency: string;
    topics: string[];
  }[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Difficulty</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Acceptance</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr
              key={q.slug}
              className={`border-b transition-colors hover:bg-muted/30 ${
                i % 2 === 0 ? "" : "bg-muted/10"
              }`}
            >
              <td className="px-4 py-3">
                <Link
                  href={`/problem/${q.slug}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {q.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <DifficultyBadge difficulty={q.difficulty as "Easy" | "Medium" | "Hard"} />
              </td>
              <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                {q.acceptance}
              </td>
              <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                {q.frequency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
