import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCompanyProfiles, getCompanyProfile } from "@/lib/pseo-data";
import { companyMetadata, collectionJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";

export const dynamicParams = true;

export async function generateStaticParams() {
  const profiles = await getAllCompanyProfiles();
  return Object.keys(profiles).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getCompanyProfile(slug);
  if (!profile) return { title: "Company Not Found" };

  const meta = companyMetadata(profile);

  if (profile.questionCount < 3) {
    return {
      ...meta,
      robots: { index: false, follow: true },
    };
  }

  return meta;
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getCompanyProfile(slug);
  if (!profile) return notFound();

  const { displayName, questionCount, difficultyDist, topTopics, questions } = profile;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: "Companies", href: "/dashboard" },
          { name: displayName, href: `/company/${slug}` },
        ]}
      />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{displayName}</h1>
        <p className="mt-2 text-muted-foreground">
          {questionCount} LeetCode interview {questionCount === 1 ? "question" : "questions"}
        </p>
      </header>

      {/* Difficulty Stats */}
      <section className="mb-8" aria-label="Difficulty distribution">
        <h2 className="text-lg font-semibold mb-4">Difficulty Distribution</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <DifficultyCard
            label="Easy"
            count={difficultyDist.easy}
            total={questionCount}
            variant="easy"
          />
          <DifficultyCard
            label="Medium"
            count={difficultyDist.medium}
            total={questionCount}
            variant="medium"
          />
          <DifficultyCard
            label="Hard"
            count={difficultyDist.hard}
            total={questionCount}
            variant="hard"
          />
        </div>
      </section>

      {/* Top Topics */}
      {topTopics.length > 0 && (
        <section className="mb-8" aria-label="Top topics">
          <h2 className="text-lg font-semibold mb-4">Top Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topic/${topic.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {topic.name}
                <span className="text-muted-foreground">({topic.count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Questions Table */}
      <section aria-label="Questions">
        <h2 className="text-lg font-semibold mb-4">All Questions</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Difficulty</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Acceptance</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Frequency</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Topics</th>
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
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {q.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                      {q.topics.length > 3 && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          +{q.topics.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {questions.length} of {questionCount} questions
        </p>
      </section>

      {/* JSON-LD Structured Data */}
      <JsonLd
        data={collectionJsonLd({
          name: `${displayName} Interview Questions`,
          description: `${questionCount} LeetCode interview questions asked at ${displayName}.`,
          url: `https://codejeet.com/company/${slug}`,
          numberOfItems: questionCount,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Companies", url: "/companies" },
          { name: displayName, url: `/company/${slug}` },
        ])}
      />
      <JsonLd
        data={faqJsonLd([
          {
            question: `How many LeetCode questions does ${displayName} ask in interviews?`,
            answer: `${displayName} has ${questionCount} known LeetCode interview questions. The difficulty breakdown is ${difficultyDist.easy} Easy, ${difficultyDist.medium} Medium, and ${difficultyDist.hard} Hard problems.`,
          },
          {
            question: `What are the most common topics in ${displayName} coding interviews?`,
            answer: `The most frequently asked topics at ${displayName} are ${topTopics
              .slice(0, 5)
              .map((t) => `${t.name} (${t.count} questions)`)
              .join(", ")}. Focus on these topics to maximize your preparation.`,
          },
          {
            question: `How should I prepare for a ${displayName} coding interview?`,
            answer: `Start with the most frequently asked ${displayName} problems on CodeJeet, sorted by frequency. Focus on ${difficultyDist.medium > difficultyDist.easy ? "Medium" : "Easy"} difficulty first since ${displayName} asks ${difficultyDist.medium} Medium problems. Practice the top topics: ${topTopics
              .slice(0, 3)
              .map((t) => t.name)
              .join(", ")}.`,
          },
        ])}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Difficulty Card (local helper component)
// ---------------------------------------------------------------------------

function DifficultyCard({
  label,
  count,
  total,
  variant,
}: {
  label: string;
  count: number;
  total: number;
  variant: "easy" | "medium" | "hard";
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  const variantStyles = {
    easy: "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
    medium: "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    hard: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400",
  };

  const barStyles = {
    easy: "bg-green-500/40",
    medium: "bg-yellow-500/40",
    hard: "bg-red-500/40",
  };

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="mt-1 text-2xl font-bold">{count}</div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-background/50">
        <div
          className={`h-full rounded-full ${barStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-xs opacity-60">{percentage}%</div>
    </div>
  );
}
