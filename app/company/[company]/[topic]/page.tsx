/**
 * Company + Topic Cross-Reference Page
 * Displays questions for a specific company and topic combination
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getCompanyBySlug,
  getTopicBySlug,
  getQuestionsByCompanyAndTopic,
  getTopCrossReferences,
  generateCompanyTopicMetadata,
  generateCompanyTopicBreadcrumbs,
  generateBreadcrumbSchema,
  generateQuestionListSchema,
  seoConfig,
  getHubLinks,
  type QuestionWithCompanyContext,
} from "@/lib/seo";
import { MultiJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageHeader, DifficultyBar } from "@/components/seo/PageHeader";
import { HubLinks } from "@/components/seo/InternalLinks";
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
export const revalidate = 604800; // 7 days

interface PageProps {
  params: Promise<{ company: string; topic: string }>;
}

// Pre-generate top 500 company+topic combinations
export async function generateStaticParams() {
  const crossRefs = await getTopCrossReferences(500);
  return crossRefs
    .filter((ref) => ref.questionCount >= seoConfig.thinContentThresholds.companyTopic)
    .map((ref) => ({
      company: ref.companySlug,
      topic: ref.topicSlug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { company: companySlug, topic: topicSlug } = await params;

  const [company, topic, questions] = await Promise.all([
    getCompanyBySlug(companySlug),
    getTopicBySlug(topicSlug),
    getQuestionsByCompanyAndTopic(companySlug, topicSlug),
  ]);

  if (!company || !topic || questions.length < seoConfig.thinContentThresholds.companyTopic) {
    return { title: "Page Not Found" };
  }

  const difficultyBreakdown = {
    easy: questions.filter((q) => q.difficulty === "Easy").length,
    medium: questions.filter((q) => q.difficulty === "Medium").length,
    hard: questions.filter((q) => q.difficulty === "Hard").length,
  };

  return generateCompanyTopicMetadata({
    companySlug: company.slug,
    companyName: company.displayName,
    topicSlug: topic.slug,
    topicName: topic.name,
    questionCount: questions.length,
    difficultyBreakdown,
  });
}

export default async function CompanyTopicPage({ params }: PageProps) {
  const { company: companySlug, topic: topicSlug } = await params;

  const [company, topic, questions] = await Promise.all([
    getCompanyBySlug(companySlug),
    getTopicBySlug(topicSlug),
    getQuestionsByCompanyAndTopic(companySlug, topicSlug),
  ]);

  // Thin content protection - redirect to parent company page
  if (!company || !topic || questions.length < seoConfig.thinContentThresholds.companyTopic) {
    if (company) {
      redirect(`/company/${companySlug}`);
    }
    notFound();
  }

  const difficultyBreakdown = {
    easy: questions.filter((q) => q.difficulty === "Easy").length,
    medium: questions.filter((q) => q.difficulty === "Medium").length,
    hard: questions.filter((q) => q.difficulty === "Hard").length,
  };

  const breadcrumbs = generateCompanyTopicBreadcrumbs(company, topic.name, topic.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <MultiJsonLd
        schemas={[
          generateBreadcrumbSchema(breadcrumbs),
          generateQuestionListSchema(
            questions,
            `${company.displayName} ${topic.name} Questions`,
            `${questions.length} ${topic.name} problems asked at ${company.displayName}`
          ),
        ]}
      />

      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <PageHeader
        title={`${company.displayName} ${topic.name} Questions`}
        description={`Practice ${questions.length} ${topic.name} coding interview questions asked at ${company.displayName}.
          Master ${topic.name} algorithms and data structures with problems sorted by frequency.`}
        stats={[{ label: "Total Questions", value: questions.length }]}
        difficultyBreakdown={difficultyBreakdown}
      />

      {/* Difficulty Breakdown */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Difficulty Distribution</h2>
        <DifficultyBar breakdown={difficultyBreakdown} className="max-w-md" />
      </section>

      {/* Questions Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">All Questions</h2>
        <p className="text-muted-foreground mb-6">
          {questions.length} {topic.name} problems from {company.displayName} interviews.
        </p>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Problem</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Acceptance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <QuestionRow key={question.slug} question={question} />
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="mt-12 pt-8 border-t">
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            href={`/company/${companySlug}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← All {company.displayName} Questions
          </Link>
          <Link
            href={`/topic/${topicSlug}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← All {topic.name} Questions
          </Link>
        </div>
        <h2 className="text-lg font-semibold mb-4">Explore More</h2>
        <HubLinks links={getHubLinks()} />
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
    </TableRow>
  );
}
