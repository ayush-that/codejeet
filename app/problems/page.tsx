/**
 * Problems Hub Page
 * Lists all unique LeetCode problems with company frequency data
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  getUniqueQuestions,
  generateProblemsHubMetadata,
  generateBreadcrumbSchema,
  seoConfig,
  getHubLinks,
  type UniqueQuestion,
  type Difficulty,
} from "@/lib/seo";
import { MultiJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageHeader } from "@/components/seo/PageHeader";
import { HubLinks } from "@/components/seo/InternalLinks";
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
export const revalidate = 86400; // 24 hours

export async function generateMetadata(): Promise<Metadata> {
  const questions = await getUniqueQuestions();
  return generateProblemsHubMetadata(questions.size);
}

export default async function ProblemsPage() {
  const questions = await getUniqueQuestions();
  const questionList = Array.from(questions.values());

  // Calculate statistics
  const difficultyBreakdown = {
    easy: questionList.filter((q) => q.difficulty === "Easy").length,
    medium: questionList.filter((q) => q.difficulty === "Medium").length,
    hard: questionList.filter((q) => q.difficulty === "Hard").length,
  };

  const breadcrumbItems = [
    { name: "Home", url: seoConfig.siteUrl },
    { name: "Problems", url: `${seoConfig.siteUrl}/problems` },
  ];

  // Get most popular questions (asked by most companies)
  const popularQuestions = questionList
    .sort((a, b) => b.companies.length - a.companies.length)
    .slice(0, 50);

  // Get questions by difficulty for quick links
  const easyQuestions = questionList.filter((q) => q.difficulty === "Easy").slice(0, 20);
  const mediumQuestions = questionList.filter((q) => q.difficulty === "Medium").slice(0, 20);
  const hardQuestions = questionList.filter((q) => q.difficulty === "Hard").slice(0, 20);

  return (
    <div className="container mx-auto px-4 py-8">
      <MultiJsonLd
        schemas={[
          generateBreadcrumbSchema(breadcrumbItems),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "LeetCode Interview Problems",
            description: `${questions.size} coding problems with company frequency data`,
            numberOfItems: questions.size,
            itemListElement: popularQuestions.slice(0, 50).map((q, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${seoConfig.siteUrl}/problem/${q.slug}`,
              name: q.title,
            })),
          },
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <PageHeader
        title="LeetCode Interview Problems"
        description={`Browse ${questions.size.toLocaleString()} unique coding problems with company-specific
          frequency data. Filter by difficulty, topic, or company to find the perfect practice problems.`}
        stats={[
          { label: "Total Problems", value: questions.size.toLocaleString() },
          { label: "Companies", value: "269+" },
        ]}
        difficultyBreakdown={difficultyBreakdown}
      />

      {/* Difficulty Quick Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Browse by Difficulty</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DifficultyCard
            difficulty="Easy"
            count={difficultyBreakdown.easy}
            color="text-green-500"
          />
          <DifficultyCard
            difficulty="Medium"
            count={difficultyBreakdown.medium}
            color="text-yellow-500"
          />
          <DifficultyCard difficulty="Hard" count={difficultyBreakdown.hard} color="text-red-500" />
        </div>
      </section>

      {/* Most Popular Problems */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Most Asked Problems</h2>
        <p className="text-muted-foreground mb-6">
          Problems asked by the most companies - essential for interview prep.
        </p>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Problem</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead>Topics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularQuestions.slice(0, 25).map((question) => (
                <TableRow key={question.slug}>
                  <TableCell>
                    <Link
                      href={`/problem/${question.slug}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {question.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={question.difficulty} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {question.companies.length} companies
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {question.topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {question.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{question.topics.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Easy Problems */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Easy Problems</h2>
          <Link
            href="/difficulty/easy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all {difficultyBreakdown.easy} problems →
          </Link>
        </div>
        <ProblemGrid questions={easyQuestions} />
      </section>

      {/* Medium Problems */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Medium Problems</h2>
          <Link
            href="/difficulty/medium"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all {difficultyBreakdown.medium} problems →
          </Link>
        </div>
        <ProblemGrid questions={mediumQuestions} />
      </section>

      {/* Hard Problems */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Hard Problems</h2>
          <Link
            href="/difficulty/hard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all {difficultyBreakdown.hard} problems →
          </Link>
        </div>
        <ProblemGrid questions={hardQuestions} />
      </section>

      {/* Navigation Links */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-lg font-semibold mb-4">Explore More</h2>
        <HubLinks links={getHubLinks().filter((l) => !l.href.includes("/problems"))} />
      </section>
    </div>
  );
}

function DifficultyCard({
  difficulty,
  count,
  color,
}: {
  difficulty: Difficulty;
  count: number;
  color: string;
}) {
  return (
    <Link href={`/difficulty/${difficulty.toLowerCase()}`}>
      <Card className="h-full hover:bg-accent transition-colors">
        <CardContent className="p-6">
          <div className={`text-3xl font-bold ${color}`}>{count.toLocaleString()}</div>
          <div className="text-lg font-medium mt-1">{difficulty} Problems</div>
          <p className="text-sm text-muted-foreground mt-2">
            {difficulty === "Easy" && "Perfect for beginners and warm-up practice"}
            {difficulty === "Medium" && "Core interview problems - most common difficulty"}
            {difficulty === "Hard" && "Challenging problems for senior positions"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const colors = {
    Easy: "bg-green-500/10 text-green-500",
    Medium: "bg-yellow-500/10 text-yellow-500",
    Hard: "bg-red-500/10 text-red-500",
  };

  return <Badge className={colors[difficulty]}>{difficulty}</Badge>;
}

function ProblemGrid({ questions }: { questions: UniqueQuestion[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {questions.map((question) => (
        <Link key={question.slug} href={`/problem/${question.slug}`}>
          <Card className="h-full hover:bg-accent transition-colors">
            <CardContent className="p-4">
              <div className="font-medium text-sm line-clamp-2">{question.title}</div>
              <div className="flex items-center gap-2 mt-2">
                <DifficultyBadge difficulty={question.difficulty} />
                <span className="text-xs text-muted-foreground">
                  {question.companies.length} companies
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
