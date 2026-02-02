/**
 * Topic Entity Page
 * Displays all questions for a specific DSA topic
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAggregatedTopics,
  getTopicBySlug,
  getQuestionsByTopic,
  getTopicCompanyCrossRefs,
  generateTopicMetadata,
  generateTopicBreadcrumbs,
  generateTopicPageSchema,
  generateBreadcrumbSchema,
  generateTopicPageLinks,
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

// Pre-generate all topic pages at build time (relatively small number)
export async function generateStaticParams() {
  const topics = await getAggregatedTopics();
  return Array.from(topics.values()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return { title: "Topic Not Found" };
  return generateTopicMetadata(topic);
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const [questions, crossRefs, allTopics] = await Promise.all([
    getQuestionsByTopic(slug),
    getTopicCompanyCrossRefs(slug),
    getAggregatedTopics(),
  ]);

  const breadcrumbs = generateTopicBreadcrumbs(topic);
  const links = generateTopicPageLinks(topic, allTopics, crossRefs);

  return (
    <div className="container mx-auto px-4 py-8">
      <MultiJsonLd
        schemas={[generateBreadcrumbSchema(breadcrumbs), generateTopicPageSchema(topic, questions)]}
      />

      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <PageHeader
        title={`${topic.name} Problems`}
        description={topic.description}
        stats={[{ label: "Total Problems", value: topic.questionCount }]}
        difficultyBreakdown={topic.difficultyBreakdown}
      />

      {/* Company Breakdown */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{topic.name} Questions by Company</h2>
        <p className="text-muted-foreground mb-6">
          See which companies ask {topic.name} questions most frequently.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {crossRefs.slice(0, 12).map((ref) => (
            <Link key={ref.companySlug} href={`/company/${ref.companySlug}/${slug}`}>
              <Card className="h-full hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="font-medium">{ref.companyName}</div>
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
            And {crossRefs.length - 12} more companies...
          </p>
        )}
      </section>

      {/* Questions Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">All {topic.name} Questions</h2>
        <p className="text-muted-foreground mb-6">
          {questions.length} {topic.name} problems sorted by frequency.
        </p>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Problem</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Acceptance</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead>Other Topics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.slice(0, 100).map((question) => (
                <QuestionRow key={question.slug} question={question} currentTopic={slug} />
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
              title: "Related Topics",
              links: links.relatedTopics,
              variant: "grid",
            },
            {
              title: `${topic.name} at Top Companies`,
              links: links.companyLinks,
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

function QuestionRow({
  question,
  currentTopic,
}: {
  question: QuestionWithCompanyContext;
  currentTopic: string;
}) {
  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-500",
    Medium: "bg-yellow-500/10 text-yellow-500",
    Hard: "bg-red-500/10 text-red-500",
  };

  const otherTopics = question.topics.filter(
    (t) => t.toLowerCase().replace(/\s+/g, "-") !== currentTopic
  );

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
        <span className="text-sm text-muted-foreground">{question.acceptanceRate.toFixed(1)}%</span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{question.frequency.toFixed(1)}% freq</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {otherTopics.slice(0, 2).map((topic) => (
            <Link key={topic} href={`/topic/${topic.toLowerCase().replace(/\s+/g, "-")}`}>
              <Badge variant="outline" className="text-xs hover:bg-accent">
                {topic}
              </Badge>
            </Link>
          ))}
          {otherTopics.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{otherTopics.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
