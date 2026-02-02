/**
 * Companies Hub Page
 * Lists all companies with their interview question counts
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  getAggregatedCompanies,
  generateCompaniesHubMetadata,
  generateCompanyListSchema,
  generateBreadcrumbSchema,
  seoConfig,
  getHubLinks,
  type Company,
} from "@/lib/seo";
import { JsonLd, MultiJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageHeader, DifficultyBar } from "@/components/seo/PageHeader";
import { HubLinks } from "@/components/seo/InternalLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export async function generateMetadata(): Promise<Metadata> {
  const companies = await getAggregatedCompanies();
  return generateCompaniesHubMetadata(companies.size);
}

export default async function CompaniesPage() {
  const companies = await getAggregatedCompanies();
  const companyList = Array.from(companies.values());
  const totalQuestions = companyList.reduce((sum, c) => sum + c.questionCount, 0);

  const breadcrumbItems = [
    { name: "Home", url: seoConfig.siteUrl },
    { name: "Companies", url: `${seoConfig.siteUrl}/companies` },
  ];

  // Group companies by tier
  const tier1 = companyList.filter((c) => getTier(c.slug) === 1);
  const tier2 = companyList.filter((c) => getTier(c.slug) === 2);
  const tier3 = companyList.filter((c) => getTier(c.slug) === 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <MultiJsonLd
        schemas={[
          generateBreadcrumbSchema(breadcrumbItems),
          generateCompanyListSchema(companyList, companies.size),
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <PageHeader
        title="Company Interview Questions"
        description={`Browse coding interview questions from ${companies.size} tech companies.
          Over ${totalQuestions.toLocaleString()} questions with company-specific frequency data
          to help you prepare for your next interview.`}
        stats={[
          { label: "Companies", value: companies.size },
          { label: "Total Questions", value: totalQuestions.toLocaleString() },
        ]}
      />

      {/* Tier 1 Companies - FAANG+ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Top Tech Companies</h2>
        <p className="text-muted-foreground mb-6">
          Most sought-after tech companies with extensive interview question data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tier1.map((company) => (
            <CompanyCard key={company.slug} company={company} featured />
          ))}
        </div>
      </section>

      {/* Tier 2 Companies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Top Tier Companies</h2>
        <p className="text-muted-foreground mb-6">
          Leading tech companies known for rigorous technical interviews.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tier2.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      </section>

      {/* Tier 3 Companies - All Others */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">All Companies</h2>
        <p className="text-muted-foreground mb-6">
          Browse interview questions from {tier3.length} more tech companies.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {tier3.map((company) => (
            <CompanyCardCompact key={company.slug} company={company} />
          ))}
        </div>
      </section>

      {/* Navigation Links */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-lg font-semibold mb-4">Explore More</h2>
        <HubLinks links={getHubLinks().filter((l) => !l.href.includes("/companies"))} />
      </section>
    </div>
  );
}

function CompanyCard({ company, featured = false }: { company: Company; featured?: boolean }) {
  return (
    <Link href={`/company/${company.slug}`}>
      <Card
        className={`h-full hover:bg-accent transition-colors ${featured ? "border-primary/50" : ""}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">{company.displayName}</span>
            {featured && <Badge variant="secondary">FAANG+</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold">{company.questionCount}</div>
            <div className="text-sm text-muted-foreground">Interview Questions</div>
            <DifficultyBar breakdown={company.difficultyBreakdown} />
            <div className="flex flex-wrap gap-1 mt-2">
              {company.topTopics.slice(0, 3).map((topic) => (
                <Badge key={topic.slug} variant="outline" className="text-xs">
                  {topic.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CompanyCardCompact({ company }: { company: Company }) {
  return (
    <Link href={`/company/${company.slug}`}>
      <Card className="h-full hover:bg-accent transition-colors">
        <CardContent className="p-4">
          <div className="font-medium truncate">{company.displayName}</div>
          <div className="text-sm text-muted-foreground">{company.questionCount} questions</div>
        </CardContent>
      </Card>
    </Link>
  );
}

function getTier(slug: string): number {
  const tier1 = ["google", "amazon", "meta", "facebook", "microsoft", "apple", "netflix"];
  const tier2 = [
    "uber",
    "airbnb",
    "linkedin",
    "twitter",
    "salesforce",
    "adobe",
    "oracle",
    "nvidia",
    "stripe",
    "square",
    "paypal",
    "bloomberg",
    "snap",
    "spotify",
    "lyft",
    "doordash",
    "instacart",
    "coinbase",
    "robinhood",
    "databricks",
    "snowflake",
    "palantir",
    "splunk",
  ];
  if (tier1.includes(slug.toLowerCase())) return 1;
  if (tier2.includes(slug.toLowerCase())) return 2;
  return 3;
}
