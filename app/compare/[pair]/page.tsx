import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllComparisonPairs, getComparisonPair } from "@/lib/pseo-data";
import { collectionJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { capitalizeWords } from "@/utils/utils";

export const dynamicParams = true;

// ---------------------------------------------------------------------------
// Static params — pre-render all comparison pages at build time
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const pairs = await getAllComparisonPairs();
  return Object.keys(pairs).map((pair) => ({ pair }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const data = await getComparisonPair(pair);
  if (!data) return { title: "Comparison Not Found" };

  const { companyA, companyB, sharedCount } = data;

  return {
    title: `${companyA.displayName} vs ${companyB.displayName} Interview Questions Comparison`,
    description:
      `Compare ${companyA.displayName} (${companyA.questionCount} questions) and ` +
      `${companyB.displayName} (${companyB.questionCount} questions). ` +
      `${sharedCount} shared LeetCode problems.`,
    alternates: { canonical: `https://codejeet.com/compare/${pair}` },
    openGraph: {
      title: `${companyA.displayName} vs ${companyB.displayName} | CodeJeet`,
      description:
        `Side-by-side comparison of ${companyA.displayName} and ${companyB.displayName} ` +
        `interview questions. ${sharedCount} shared problems.`,
      type: "website",
      url: `https://codejeet.com/compare/${pair}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ComparePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const data = await getComparisonPair(pair);
  if (!data) return notFound();

  const { companyA, companyB, sharedCount, sharedSlugs } = data;

  const overlapPercentage =
    companyA.questionCount > 0 ? Math.round((sharedCount / companyA.questionCount) * 100) : 0;

  const maxDifficultyCount = Math.max(
    companyA.difficultyDist.easy,
    companyA.difficultyDist.medium,
    companyA.difficultyDist.hard,
    companyB.difficultyDist.easy,
    companyB.difficultyDist.medium,
    companyB.difficultyDist.hard,
    1
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: "Compare", href: "/compare" },
          {
            name: `${companyA.displayName} vs ${companyB.displayName}`,
            href: `/compare/${pair}`,
          },
        ]}
      />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {companyA.displayName} vs {companyB.displayName}
        </h1>
        <p className="mt-2 text-muted-foreground">Interview Questions Comparison</p>
      </header>

      {/* Stats Comparison — side-by-side cards */}
      <section className="mb-8" aria-label="Company stats comparison">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CompanyCard company={companyA} />
          <CompanyCard company={companyB} />
        </div>
      </section>

      {/* Difficulty Comparison — visual bars */}
      <section className="mb-8" aria-label="Difficulty comparison">
        <h2 className="text-lg font-semibold mb-4">Difficulty Comparison</h2>
        <div className="space-y-4">
          <DifficultyRow
            label="Easy"
            countA={companyA.difficultyDist.easy}
            countB={companyB.difficultyDist.easy}
            maxCount={maxDifficultyCount}
            colorClass="bg-green-500/70"
            nameA={companyA.displayName}
            nameB={companyB.displayName}
          />
          <DifficultyRow
            label="Medium"
            countA={companyA.difficultyDist.medium}
            countB={companyB.difficultyDist.medium}
            maxCount={maxDifficultyCount}
            colorClass="bg-yellow-500/70"
            nameA={companyA.displayName}
            nameB={companyB.displayName}
          />
          <DifficultyRow
            label="Hard"
            countA={companyA.difficultyDist.hard}
            countB={companyB.difficultyDist.hard}
            maxCount={maxDifficultyCount}
            colorClass="bg-red-500/70"
            nameA={companyA.displayName}
            nameB={companyB.displayName}
          />
        </div>
      </section>

      {/* Overlap Section */}
      <section className="mb-8" aria-label="Shared questions">
        <h2 className="text-lg font-semibold mb-2">
          {sharedCount} Shared {sharedCount === 1 ? "Question" : "Questions"}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {overlapPercentage}% of {companyA.displayName}&apos;s questions also appear at{" "}
          {companyB.displayName}
        </p>

        {sharedSlugs.length > 0 && <SharedQuestionsTable slugs={sharedSlugs} />}
      </section>

      {/* Internal Links */}
      <section className="mb-8" aria-label="Related pages">
        <h2 className="text-lg font-semibold mb-4">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/company/${companyA.slug}`}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            <span className="text-sm font-medium text-card-foreground">
              {companyA.displayName} Questions
            </span>
            <span className="text-xs text-muted-foreground">{companyA.questionCount} problems</span>
          </Link>
          <Link
            href={`/company/${companyB.slug}`}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            <span className="text-sm font-medium text-card-foreground">
              {companyB.displayName} Questions
            </span>
            <span className="text-xs text-muted-foreground">{companyB.questionCount} problems</span>
          </Link>
        </div>
      </section>

      {/* JSON-LD */}
      <JsonLd
        data={collectionJsonLd({
          name: `${companyA.displayName} vs ${companyB.displayName} Interview Questions`,
          description:
            `Compare ${companyA.questionCount} ${companyA.displayName} and ` +
            `${companyB.questionCount} ${companyB.displayName} LeetCode interview questions. ` +
            `${sharedCount} shared problems.`,
          url: `https://codejeet.com/compare/${pair}`,
          numberOfItems: sharedCount,
        })}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Company Card
// ---------------------------------------------------------------------------

function CompanyCard({
  company,
}: {
  company: {
    slug: string;
    displayName: string;
    questionCount: number;
    difficultyDist: { easy: number; medium: number; hard: number };
  };
}) {
  const { slug, displayName, questionCount, difficultyDist } = company;
  const total = questionCount || 1;

  const easyPct = Math.round((difficultyDist.easy / total) * 100);
  const mediumPct = Math.round((difficultyDist.medium / total) * 100);
  const hardPct = Math.round((difficultyDist.hard / total) * 100);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <Link
        href={`/company/${slug}`}
        className="text-lg font-semibold text-foreground hover:underline"
      >
        {displayName}
      </Link>
      <p className="mt-1 text-sm text-muted-foreground">
        {questionCount} {questionCount === 1 ? "question" : "questions"}
      </p>

      {/* Difficulty distribution bar */}
      <div className="mt-4 h-3 w-full rounded-full overflow-hidden bg-muted flex">
        {easyPct > 0 && (
          <div
            className="h-full bg-green-500/70"
            style={{ width: `${easyPct}%` }}
            title={`Easy: ${difficultyDist.easy}`}
          />
        )}
        {mediumPct > 0 && (
          <div
            className="h-full bg-yellow-500/70"
            style={{ width: `${mediumPct}%` }}
            title={`Medium: ${difficultyDist.medium}`}
          />
        )}
        {hardPct > 0 && (
          <div
            className="h-full bg-red-500/70"
            style={{ width: `${hardPct}%` }}
            title={`Hard: ${difficultyDist.hard}`}
          />
        )}
      </div>

      {/* Counts */}
      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500/70" />
          <span className="text-muted-foreground">Easy {difficultyDist.easy}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-500/70" />
          <span className="text-muted-foreground">Medium {difficultyDist.medium}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500/70" />
          <span className="text-muted-foreground">Hard {difficultyDist.hard}</span>
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Difficulty Comparison Row
// ---------------------------------------------------------------------------

function DifficultyRow({
  label,
  countA,
  countB,
  maxCount,
  colorClass,
  nameA,
  nameB,
}: {
  label: string;
  countA: number;
  countB: number;
  maxCount: number;
  colorClass: string;
  nameA: string;
  nameB: string;
}) {
  const pctA = Math.round((countA / maxCount) * 100);
  const pctB = Math.round((countB / maxCount) * 100);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm font-medium text-foreground mb-3">{label}</div>
      <div className="space-y-2">
        {/* Company A */}
        <div className="flex items-center gap-3">
          <span className="w-24 truncate text-xs text-muted-foreground shrink-0">{nameA}</span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pctA}%` }} />
          </div>
          <span className="w-8 text-right text-xs font-medium text-foreground">{countA}</span>
        </div>
        {/* Company B */}
        <div className="flex items-center gap-3">
          <span className="w-24 truncate text-xs text-muted-foreground shrink-0">{nameB}</span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pctB}%` }} />
          </div>
          <span className="w-8 text-right text-xs font-medium text-foreground">{countB}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared Questions Table
// ---------------------------------------------------------------------------

async function SharedQuestionsTable({ slugs }: { slugs: string[] }) {
  // Resolve display names from slugs — use capitalizeWords as a fallback.
  // We intentionally avoid loading full problem data for each slug to keep
  // the build fast; the slug itself encodes the problem title.
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Problem</th>
          </tr>
        </thead>
        <tbody>
          {slugs.map((slug, i) => (
            <tr
              key={slug}
              className={`border-b transition-colors hover:bg-muted/30 ${
                i % 2 === 0 ? "" : "bg-muted/10"
              }`}
            >
              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/problem/${slug}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {capitalizeWords(slug)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {slugs.length >= 50 && (
        <p className="px-4 py-2 text-xs text-muted-foreground">Showing top 50 shared problems</p>
      )}
    </div>
  );
}
