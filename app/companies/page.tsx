import type { Metadata } from "next";
import { getAllCompanyProfiles } from "@/lib/pseo-data";
import { collectionJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CompaniesClient } from "./page.client";

export const dynamic = "force-static";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export function generateMetadata(): Metadata {
  return {
    title: "All Companies - LeetCode Interview Questions",
    description:
      "Browse LeetCode interview questions from 660+ companies. " +
      "Find company-specific problems sorted by frequency to prepare for your next tech interview.",
    alternates: { canonical: "https://codejeet.com/companies" },
    openGraph: {
      title: "All Companies - LeetCode Interview Questions | CodeJeet",
      description: "Browse LeetCode interview questions from 660+ companies.",
      type: "website",
      url: "https://codejeet.com/companies",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function CompaniesPage() {
  const profiles = await getAllCompanyProfiles();
  const companies = Object.values(profiles)
    .sort((a, b) => b.questionCount - a.questionCount)
    .map(({ slug, displayName, questionCount, difficultyDist }) => ({
      slug,
      displayName,
      questionCount,
      difficultyDist,
    }));
  const totalCompanies = companies.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Companies", href: "/companies" }]} />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Company Directory</h1>
        <p className="mt-2 text-muted-foreground">
          Browse LeetCode interview questions from {totalCompanies.toLocaleString()} companies
        </p>
      </header>

      {/* Client-side search + pagination + grid */}
      <CompaniesClient companies={companies} />

      {/* JSON-LD */}
      <JsonLd
        data={collectionJsonLd({
          name: "Company Directory - LeetCode Interview Questions",
          description: `Browse LeetCode interview questions from ${totalCompanies} companies.`,
          url: "https://codejeet.com/companies",
          numberOfItems: totalCompanies,
        })}
      />
    </div>
  );
}
