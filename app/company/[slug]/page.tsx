/**
 * Company Entity Page
 * Displays all interview questions for a specific company
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAggregatedCompanies,
  getCompanyBySlug,
  getQuestionsByCompany,
  getCompanyTopicCrossRefs,
  generateCompanyMetadata,
  generateCompanyBreadcrumbs,
  generateCompanyPageSchema,
  generateBreadcrumbSchema,
  generateCompanyPageLinks,
  seoConfig,
  type Company,
  type QuestionWithCompanyContext,
} from "@/lib/seo";
import { MultiJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageHeader, DifficultyBar } from "@/components/seo/PageHeader";
import { RelatedContent } from "@/components/seo/InternalLinks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400; // 24 hours

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-generate top 100 company pages at build time
export async function generateStaticParams() {
  const companies = await getAggregatedCompanies();
  return Array.from(companies.values())
    .sort((a, b) => b.questionCount - a.questionCount)
    .slice(0, 100)
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return { title: "Company Not Found" };
  return generateCompanyMetadata(company);
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const [questions, crossRefs, allCompanies] = await Promise.all([
    getQuestionsByCompany(slug),
    getCompanyTopicCrossRefs(slug),
    getAggregatedCompanies(),
  ]);

  const breadcrumbs = generateCompanyBreadcrumbs(company);
  const links = generateCompanyPageLinks(company, allCompanies, crossRefs);

  return (
    <div className="container mx-auto px-4 py-8">
      <MultiJsonLd
        schemas={[
          generateBreadcrumbSchema(breadcrumbs),
          generateCompanyPageSchema(company, questions),
        ]}
      />

      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <PageHeader
        title={`${company.displayName} Interview Questions`}
        description={`Practice ${company.questionCount} coding interview questions asked at ${company.displayName}.
          Prepare with real problems organized by difficulty and topic, with frequency data
          to help you prioritize your study time.`}
        stats={[
          { label: "Total Questions", value: company.questionCount },
          { label: "Avg Acceptance", value: `${company.averageAcceptance}%` },
        ]}
        difficultyBreakdown={company.difficultyBreakdown}
      />

      {/* Topic Breakdown */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Questions by Topic</h2>
        <p className="text-muted-foreground mb-6">
          Browse {company.displayName} interview questions organized by topic.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {crossRefs.slice(0, 12).map((ref) => (
            <Link key={ref.topicSlug} href={`/company/${slug}/${ref.topicSlug}`}>
              <Card className="h-full hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="font-medium">{ref.topicName}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {ref.questionCount} questions
                  </div>
                  <DifficultyBar breakdown={ref.difficultyBreakdown} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {crossRefs.length > 12 && (
          <p className="text-sm text-muted-foreground mt-4">
            And {crossRefs.length - 12} more topics...
          </p>
        )}
      </section>

      {/* Questions Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">All Questions</h2>
        <p className="text-muted-foreground mb-6">
          {company.questionCount} interview questions sorted by frequency.
        </p>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Problem</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Acceptance</TableHead>
                <TableHead>Topics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.slice(0, 100).map((question) => (
                <QuestionRow key={question.slug} question={question} />
              ))}
            </TableBody>
          </Table>
        </div>
        {questions.length > 100 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Showing 100 of {questions.length} questions
          </p>
        )}
      </section>

      {/* Related Content */}
      <section className="mt-12 pt-8 border-t">
        <RelatedContent
          sections={[
            {
              title: "Related Companies",
              links: links.relatedCompanies,
              variant: "grid",
            },
            {
              title: `${company.displayName} Questions by Topic`,
              links: links.topicLinks,
              variant: "inline",
            },
            {
              title: "Explore More",
              links: links.hubLinks,
              variant: "inline",
            },
          ]}
        />
      </section>
    </div>
  );
}

function QuestionRow({ question }: { question: QuestionWithCompanyContext }) {
  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-500",
    Medium: "bg-yellow-500/10 text-yellow-500",
    Hard: "bg-red-500/10 text-red-500",
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Link
            href={`/problem/${question.slug}`}
            className="font-medium hover:text-primary transition-colors"
          >
            {question.title}
          </Link>
          {question.isPremium && (
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={difficultyColors[question.difficulty]}>{question.difficulty}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(question.frequency, 100)}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{question.frequency.toFixed(1)}%</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{question.acceptanceRate.toFixed(1)}%</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {question.topics.slice(0, 2).map((topic) => (
            <Link key={topic} href={`/topic/${topic.toLowerCase().replace(/\s+/g, "-")}`}>
              <Badge variant="outline" className="text-xs hover:bg-accent">
                {topic}
              </Badge>
            </Link>
          ))}
          {question.topics.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{question.topics.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
