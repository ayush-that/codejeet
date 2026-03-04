import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { collectionJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { capitalizeWords } from "@/utils/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Level = "easy" | "medium" | "hard";

interface QuestionRecord {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  company: string;
  "Acceptance %": string;
}

interface UniqueQuestion {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: string;
  companyCount: number;
  topCompanies: string[];
}

const VALID_LEVELS: Level[] = ["easy", "medium", "hard"];

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return VALID_LEVELS.map((level) => ({ level }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  if (!VALID_LEVELS.includes(level as Level)) return { title: "Not Found" };

  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return {
    title: `${label} LeetCode Questions`,
    description:
      `Browse all ${label.toLowerCase()} difficulty LeetCode interview questions. ` +
      `Sorted by company popularity. Filter and practice for your next tech interview.`,
    alternates: { canonical: `https://codejeet.com/difficulty/${level}` },
    openGraph: {
      title: `${label} LeetCode Questions | CodeJeet`,
      description: `Browse all ${label.toLowerCase()} difficulty LeetCode problems sorted by company frequency.`,
      type: "website",
      url: `https://codejeet.com/difficulty/${level}`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Data helpers                                                       */
/* ------------------------------------------------------------------ */

async function getQuestionsForDifficulty(level: Level): Promise<{
  questions: UniqueQuestion[];
  topCompanies: { slug: string; name: string; count: number }[];
}> {
  const dataPath = path.join(process.cwd(), "public", "data", "questions.json");
  const raw = await fs.readFile(dataPath, "utf8");
  const data = JSON.parse(raw) as { questions: QuestionRecord[] };

  const targetDifficulty = level.charAt(0).toUpperCase() + level.slice(1);

  // Filter by difficulty
  const filtered = data.questions.filter((q) => q.difficulty === targetDifficulty);

  // Deduplicate by slug and count companies
  const slugMap = new Map<string, { question: QuestionRecord; companies: Set<string> }>();

  for (const q of filtered) {
    const existing = slugMap.get(q.slug);
    if (existing) {
      existing.companies.add(q.company);
    } else {
      slugMap.set(q.slug, { question: q, companies: new Set([q.company]) });
    }
  }

  // Build unique questions sorted by company count (descending)
  const unique: UniqueQuestion[] = Array.from(slugMap.values())
    .map(({ question, companies }) => ({
      slug: question.slug,
      title: question.title,
      difficulty: question.difficulty,
      acceptance: question["Acceptance %"],
      companyCount: companies.size,
      topCompanies: Array.from(companies).slice(0, 3),
    }))
    .sort((a, b) => b.companyCount - a.companyCount);

  // Aggregate top companies for this difficulty
  const companyCounts = new Map<string, number>();
  for (const q of filtered) {
    companyCounts.set(q.company, (companyCounts.get(q.company) || 0) + 1);
  }

  const topCompanies = Array.from(companyCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([slug, count]) => ({ slug, name: capitalizeWords(slug), count }));

  return { questions: unique, topCompanies };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function DifficultyPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!VALID_LEVELS.includes(level as Level)) return notFound();

  const typedLevel = level as Level;
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  const { questions, topCompanies } = await getQuestionsForDifficulty(typedLevel);
  const displayQuestions = questions.slice(0, 200);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: "Difficulty", href: "/dashboard" },
          { name: label, href: `/difficulty/${level}` },
        ]}
      />

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {label} LeetCode Questions
          </h1>
          <DifficultyBadge difficulty={label as "Easy" | "Medium" | "Hard"} />
        </div>
        <p className="mt-2 text-muted-foreground">
          {questions.length.toLocaleString()} unique{" "}
          {questions.length === 1 ? "question" : "questions"} sorted by company popularity
        </p>
      </header>

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
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Acceptance</th>
                <th className="px-4 py-3 font-medium">Companies</th>
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
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {q.acceptance}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground">{q.companyCount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {displayQuestions.length.toLocaleString()} of {questions.length.toLocaleString()}{" "}
          questions
        </p>
      </section>

      {/* JSON-LD */}
      <JsonLd
        data={collectionJsonLd({
          name: `${label} LeetCode Questions`,
          description: `Browse ${questions.length} ${label.toLowerCase()} difficulty LeetCode problems sorted by company frequency.`,
          url: `https://codejeet.com/difficulty/${level}`,
          numberOfItems: questions.length,
        })}
      />
    </div>
  );
}
