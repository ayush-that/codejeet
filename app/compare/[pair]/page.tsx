import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getComparisonIndex, getComparisonPair, type CompareQuestion } from "@/lib/pseo-data";
import {
  breadcrumbJsonLd,
  buildCompareFaqs,
  collectionJsonLd,
  compareMetadata,
  faqJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { isCompareIndexable } from "@/lib/compare";

export const dynamicParams = true;

export async function generateStaticParams() {
  const pairs = await getComparisonIndex();
  return pairs.filter((p) => isCompareIndexable(p.sharedCount)).map((p) => ({ pair: p.pair }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const data = await getComparisonPair(pair);
  if (!data) return { title: "Comparison Not Found", robots: { index: false, follow: false } };
  return compareMetadata(data);
}

export default async function ComparePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const data = await getComparisonPair(pair);
  if (!data) return notFound();

  const {
    companyA,
    companyB,
    sharedCount,
    uniqueToACount,
    uniqueToBCount,
    sharedProblems,
    exclusiveToA,
    exclusiveToB,
    topSharedTopics,
    blogSlug,
  } = data;

  const overlapA =
    companyA.questionCount > 0 ? Math.round((sharedCount / companyA.questionCount) * 100) : 0;
  const overlapB =
    companyB.questionCount > 0 ? Math.round((sharedCount / companyB.questionCount) * 100) : 0;

  const maxDifficultyCount = Math.max(
    companyA.difficultyDist.easy,
    companyA.difficultyDist.medium,
    companyA.difficultyDist.hard,
    companyB.difficultyDist.easy,
    companyB.difficultyDist.medium,
    companyB.difficultyDist.hard,
    1
  );

  const harderCompany =
    companyA.difficultyDist.hard / (companyA.questionCount || 1) >
    companyB.difficultyDist.hard / (companyB.questionCount || 1)
      ? companyA.displayName
      : companyB.displayName;

  const faqs = buildCompareFaqs(data);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs
        items={[
          { name: "Compare", href: "/compare" },
          {
            name: `${companyA.displayName} vs ${companyB.displayName}`,
            href: `/compare/${pair}`,
          },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {companyA.displayName} vs {companyB.displayName} Interview Questions
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">
          {companyA.displayName} lists {companyA.questionCount.toLocaleString()} LeetCode interview
          questions while {companyB.displayName} lists {companyB.questionCount.toLocaleString()}.
          They share {sharedCount.toLocaleString()} problems — {overlapA}% of {companyA.displayName}
          &apos;s bank and {overlapB}% of {companyB.displayName}&apos;s. Focus on the overlap first,
          then drill into {uniqueToACount.toLocaleString()} {companyA.displayName}-only and{" "}
          {uniqueToBCount.toLocaleString()} {companyB.displayName}-only questions.
        </p>
        {blogSlug && (
          <p className="mt-3">
            <Link href={`/blog/${blogSlug}`} className="text-sm text-primary hover:underline">
              Read the full {companyA.displayName} vs {companyB.displayName} preparation guide →
            </Link>
          </p>
        )}
      </header>

      <section className="mb-8" aria-label="Company stats comparison">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CompanyCard company={companyA} />
          <CompanyCard company={companyB} />
        </div>
      </section>

      <section className="mb-8" aria-label="Preparation strategy">
        <h2 className="text-lg font-semibold mb-3">Preparation Strategy</h2>
        <div className="rounded-lg border bg-card p-5 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            <strong className="text-foreground">Step 1 — Shared core:</strong> Solve the{" "}
            {sharedCount.toLocaleString()} overlapping problems first. These are the highest-yield
            questions for candidates interviewing at both {companyA.displayName} and{" "}
            {companyB.displayName}.
          </p>
          <p>
            <strong className="text-foreground">Step 2 — Company-specific depth:</strong> Add{" "}
            {exclusiveToA.slice(0, 8).length > 0
              ? `${companyA.displayName}-specific problems like ${exclusiveToA
                  .slice(0, 3)
                  .map((q) => q.title)
                  .join(", ")}`
              : `${companyA.displayName}-specific problems`}{" "}
            and {companyB.displayName}-specific problems from the exclusive lists below.
          </p>
          <p>
            <strong className="text-foreground">Step 3 — Difficulty tuning:</strong> {harderCompany}{" "}
            skews harder in our data. Budget extra time for Hard problems if you are targeting that
            company.
          </p>
        </div>
      </section>

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

      {topSharedTopics.length > 0 && (
        <section className="mb-8" aria-label="Shared topics">
          <h2 className="text-lg font-semibold mb-4">Top Shared Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topSharedTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topic/${topic.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {topic.name}
                <span className="text-xs text-muted-foreground">{topic.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8" aria-label="Shared questions">
        <h2 className="text-lg font-semibold mb-2">
          {sharedCount.toLocaleString()} Shared {sharedCount === 1 ? "Question" : "Questions"}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          High-priority problems to practice for both {companyA.displayName} and{" "}
          {companyB.displayName}.
        </p>
        <QuestionTable questions={sharedProblems} emptyLabel="No shared problems found." />
        {sharedCount > sharedProblems.length && (
          <p className="mt-2 text-xs text-muted-foreground">
            Showing top {sharedProblems.length} of {sharedCount.toLocaleString()} shared problems.
          </p>
        )}
      </section>

      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label={`Questions unique to ${companyA.displayName}`}>
          <h2 className="text-lg font-semibold mb-2">
            Unique to {companyA.displayName} ({uniqueToACount.toLocaleString()})
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Problems in {companyA.displayName}&apos;s list that do not appear at{" "}
            {companyB.displayName}.
          </p>
          <QuestionTable
            questions={exclusiveToA}
            emptyLabel={`No exclusive ${companyA.displayName} problems to show.`}
          />
        </section>

        <section aria-label={`Questions unique to ${companyB.displayName}`}>
          <h2 className="text-lg font-semibold mb-2">
            Unique to {companyB.displayName} ({uniqueToBCount.toLocaleString()})
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Problems in {companyB.displayName}&apos;s list that do not appear at{" "}
            {companyA.displayName}.
          </p>
          <QuestionTable
            questions={exclusiveToB}
            emptyLabel={`No exclusive ${companyB.displayName} problems to show.`}
          />
        </section>
      </div>

      <section className="mb-8" aria-label="FAQ">
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border bg-card p-4">
              <h3 className="font-medium text-foreground">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

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
            <span className="text-xs text-muted-foreground">
              {companyA.questionCount.toLocaleString()} problems
            </span>
          </Link>
          <Link
            href={`/company/${companyB.slug}`}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            <span className="text-sm font-medium text-card-foreground">
              {companyB.displayName} Questions
            </span>
            <span className="text-xs text-muted-foreground">
              {companyB.questionCount.toLocaleString()} problems
            </span>
          </Link>
          <Link
            href="/compare"
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors sm:col-span-2"
          >
            <span className="text-sm font-medium text-card-foreground">
              Browse all company comparisons
            </span>
            <span className="text-xs text-muted-foreground">Compare index</span>
          </Link>
        </div>
      </section>

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
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Compare", url: "/compare" },
          { name: `${companyA.displayName} vs ${companyB.displayName}`, url: `/compare/${pair}` },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
    </div>
  );
}

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
        {questionCount.toLocaleString()} {questionCount === 1 ? "question" : "questions"}
      </p>

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
        <div className="flex items-center gap-3">
          <span className="w-24 truncate text-xs text-muted-foreground shrink-0">{nameA}</span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pctA}%` }} />
          </div>
          <span className="w-8 text-right text-xs font-medium text-foreground">{countA}</span>
        </div>
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

function QuestionTable({
  questions,
  emptyLabel,
}: {
  questions: CompareQuestion[];
  emptyLabel: string;
}) {
  if (questions.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Problem</th>
            <th className="px-4 py-3 font-medium">Difficulty</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Topics</th>
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
              <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {q.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
