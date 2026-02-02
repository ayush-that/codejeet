/**
 * Problem Entity Page
 * Displays details for a specific LeetCode problem
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  getUniqueQuestions,
  getAggregatedCompanies,
  getAggregatedTopics,
  getQuestionBySlug,
  generateProblemMetadata,
  generateProblemBreadcrumbs,
  generateProblemFAQSchema,
  generateBreadcrumbSchema,
  generateProblemPageLinks,
  seoConfig,
} from "@/lib/seo";
import { MultiJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageHeader } from "@/components/seo/PageHeader";
import { RelatedContent } from "@/components/seo/InternalLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  params: Promise<{ slug: string }>;
}

// Pre-generate top 500 most popular questions at build time
export async function generateStaticParams() {
  const questions = await getUniqueQuestions();
  return Array.from(questions.values())
    .sort((a, b) => b.companies.length - a.companies.length)
    .slice(0, 500)
    .map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = await getQuestionBySlug(slug);
  if (!question) return { title: "Problem Not Found" };
  return generateProblemMetadata(question);
}

export default async function ProblemPage({ params }: PageProps) {
  const { slug } = await params;
  const question = await getQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  const [allQuestions, allCompanies, allTopics] = await Promise.all([
    getUniqueQuestions(),
    getAggregatedCompanies(),
    getAggregatedTopics(),
  ]);

  const breadcrumbs = generateProblemBreadcrumbs(question);
  const links = generateProblemPageLinks(question, allQuestions, allCompanies, allTopics);

  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-500 border-green-500/30",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    Hard: "bg-red-500/10 text-red-500 border-red-500/30",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MultiJsonLd
        schemas={[generateBreadcrumbSchema(breadcrumbs), generateProblemFAQSchema(question)]}
      />

      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <PageHeader
            title={question.title}
            description={question.seoDescription}
            badges={[
              question.difficulty,
              question.isPremium ? "Premium" : "Free",
              `${question.acceptanceRate.toFixed(1)}% Acceptance`,
            ]}
          />

          {/* Topics */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {question.topics.map((topic) => (
                <Link key={topic} href={`/topic/${topic.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Badge variant="secondary" className="text-sm hover:bg-accent cursor-pointer">
                    {topic}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>

          {/* Companies Asking This Question */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Companies Asking This Question ({question.companies.length})
            </h2>
            <p className="text-muted-foreground mb-4">
              This problem has been reported in interviews at {question.companies.length} companies.
            </p>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Frequency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {question.companies.slice(0, 20).map((cf) => (
                    <TableRow key={cf.company}>
                      <TableCell>
                        <Link
                          href={`/company/${cf.company}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {cf.displayName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${Math.min(cf.frequency, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {cf.frequency.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {question.companies.length > 20 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                And {question.companies.length - 20} more companies...
              </p>
            )}
          </section>

          {/* FAQ Section (for SEO) */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <FAQItem
                question={`What companies ask "${question.title}"?`}
                answer={`${question.title} is asked by ${question.companies
                  .slice(0, 5)
                  .map((c) => c.displayName)
                  .join(
                    ", "
                  )}${question.companies.length > 5 ? ` and ${question.companies.length - 5} other companies` : ""}.`}
              />
              <FAQItem
                question={`What is the difficulty of "${question.title}"?`}
                answer={`${question.title} is a ${question.difficulty} difficulty problem with ${question.acceptanceRate}% acceptance rate on LeetCode.`}
              />
              <FAQItem
                question={`What topics does "${question.title}" cover?`}
                answer={`${question.title} covers ${question.topics.join(", ")}. Understanding these topics is essential for solving this problem.`}
              />
              <FAQItem
                question={`Is "${question.title}" a premium LeetCode problem?`}
                answer={
                  question.isPremium
                    ? `Yes, ${question.title} is a LeetCode Premium problem.`
                    : `No, ${question.title} is freely available on LeetCode.`
                }
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Problem Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge className={difficultyColors[question.difficulty]}>
                    {question.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Acceptance</span>
                  <span className="font-medium">{question.acceptanceRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Companies</span>
                  <span className="font-medium">{question.companies.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Topics</span>
                  <span className="font-medium">{question.topics.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Premium</span>
                  <span className="font-medium">{question.isPremium ? "Yes" : "No"}</span>
                </div>

                <div className="pt-4">
                  <a href={question.leetcodeUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" size="lg">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Solve on LeetCode
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Related Problems */}
            <Card>
              <CardHeader>
                <CardTitle>Related Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {links.relatedProblems.slice(0, 5).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Content */}
      <section className="mt-12 pt-8 border-t">
        <RelatedContent
          sections={[
            {
              title: "Practice at These Companies",
              links: links.companyLinks,
              variant: "grid",
            },
            {
              title: "Related Topics",
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border rounded-lg">
      <summary className="cursor-pointer p-4 font-medium list-none flex justify-between items-center">
        {question}
        <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="px-4 pb-4 text-muted-foreground">{answer}</div>
    </details>
  );
}
