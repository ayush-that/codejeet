import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { getAllTopicProfiles, getTopicProfile } from "@/lib/pseo-data";
import { topicMetadata, collectionJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";

export const dynamic = "force-static";
export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface QuestionRecord {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  "Acceptance %": string;
  topics: string[];
}

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const profiles = await getAllTopicProfiles();
  return Object.keys(profiles).map((slug) => ({ slug }));
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
  const profile = await getTopicProfile(slug);
  if (!profile) return { title: "Topic Not Found" };
  return topicMetadata(profile);
}

/* ------------------------------------------------------------------ */
/*  Data helpers                                                       */
/* ------------------------------------------------------------------ */

async function getQuestionsForTopic(questionSlugs: string[]): Promise<QuestionRecord[]> {
  const dataPath = path.join(process.cwd(), "public", "data", "questions.json");
  const raw = await fs.readFile(dataPath, "utf8");
  const data = JSON.parse(raw) as { questions: QuestionRecord[] };

  const slugSet = new Set(questionSlugs);
  const seen = new Set<string>();
  const results: QuestionRecord[] = [];

  for (const q of data.questions) {
    if (slugSet.has(q.slug) && !seen.has(q.slug)) {
      seen.add(q.slug);
      results.push(q);
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getTopicProfile(slug);
  if (!profile) return notFound();

  const { name, questionCount, difficultyDist, topCompanies, questionSlugs } = profile;
  const questions = await getQuestionsForTopic(questionSlugs);
  const displayQuestions = questions.slice(0, 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: "Topics", href: "/dashboard" },
          { name, href: `/topic/${slug}` },
        ]}
      />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{name}</h1>
        <p className="mt-2 text-muted-foreground">
          {questionCount.toLocaleString()} LeetCode {questionCount === 1 ? "question" : "questions"}
        </p>
      </header>

      {/* Difficulty Distribution */}
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

      {/* Top Companies */}
      {topCompanies.length > 0 && (
        <section className="mb-8" aria-label="Top companies">
          <h2 className="text-lg font-semibold mb-4">Top Companies</h2>
          <div className="flex flex-wrap gap-2">
            {topCompanies.map((company) => (
              <Link
                key={company.slug}
                href={`/company/${company.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {company.name}
                <span className="text-muted-foreground">({company.count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Questions Table */}
      <section aria-label="Questions">
        <h2 className="text-lg font-semibold mb-4">Questions</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Difficulty</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {displayQuestions.map((q, i) => (
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
                    <DifficultyBadge difficulty={q.difficulty} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {q["Acceptance %"]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {displayQuestions.length.toLocaleString()} of {questionCount.toLocaleString()}{" "}
          questions
        </p>
      </section>

      {/* JSON-LD */}
      <JsonLd
        data={collectionJsonLd({
          name: `${name} LeetCode Questions`,
          description: `Practice ${questionCount} ${name} LeetCode problems. Filter by difficulty and company.`,
          url: `https://codejeet.com/topic/${slug}`,
          numberOfItems: questionCount,
        })}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Difficulty Card (local helper)                                     */
/* ------------------------------------------------------------------ */

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
      <div className="mt-1 text-2xl font-bold">{count.toLocaleString()}</div>
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
