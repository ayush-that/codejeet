import type { Metadata } from "next";
import Link from "next/link";
import { getAllComparisonPairs } from "@/lib/pseo-data";
import { isCompareIndexable } from "@/lib/compare";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Company Interview Question Comparisons",
  description:
    "Compare LeetCode interview questions across top tech companies. See shared problems, " +
    "difficulty breakdowns, and unique questions side by side.",
  alternates: { canonical: "https://codejeet.com/compare" },
  openGraph: {
    title: "Company Interview Question Comparisons | CodeJeet",
    description: "Side-by-side LeetCode interview question comparisons for top tech companies.",
    type: "website",
    url: "https://codejeet.com/compare",
  },
};

export default async function CompareIndexPage() {
  const pairs = await getAllComparisonPairs();
  const indexable = Object.values(pairs)
    .filter((p) => isCompareIndexable(p.sharedCount))
    .sort((a, b) => b.sharedCount - a.sharedCount);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs items={[{ name: "Compare", href: "/compare" }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Company Interview Comparisons
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Compare LeetCode question banks across {indexable.length.toLocaleString()} company pairs.
          Each page shows shared problems, difficulty mix, overlapping topics, and company-specific
          questions to focus your interview prep.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {indexable.map((pair) => (
          <Link
            key={pair.pair}
            href={`/compare/${pair.pair}`}
            className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
          >
            <h2 className="font-semibold text-card-foreground group-hover:text-accent-foreground">
              {pair.companyA.displayName} vs {pair.companyB.displayName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {pair.sharedCount.toLocaleString()} shared · {pair.uniqueToACount.toLocaleString()}{" "}
              unique to {pair.companyA.displayName} · {pair.uniqueToBCount.toLocaleString()} unique
              to {pair.companyB.displayName}
            </p>
          </Link>
        ))}
      </div>

      <JsonLd
        data={collectionJsonLd({
          name: "Company Interview Question Comparisons",
          description:
            "Side-by-side LeetCode interview question comparisons for top tech companies.",
          url: "https://codejeet.com/compare",
          numberOfItems: indexable.length,
        })}
      />
    </div>
  );
}
