/**
 * Difficulty Level Page
 * Displays all questions of a specific difficulty
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getQuestionsByDifficulty,
  generateDifficultyMetadata,
  generateDifficultyBreadcrumbs,
  generateBreadcrumbSchema,
  generateDifficultyPageSchema,
  seoConfig,
  getHubLinks,
  type Difficulty,
  type QuestionWithCompanyContext,
} from "@/lib/seo";
import { MultiJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageHeader } from "@/components/seo/PageHeader";
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
export const revalidate = 86400; // 24 hours

interface PageProps {
  params: Promise<{ level: string }>;
}

const validLevels: Record<string, Difficulty> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export async function generateStaticParams() {
  return [{ level: "easy" }, { level: "medium" }, { level: "hard" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { level } = await params;
  const difficulty = validLevels[level.toLowerCase()];
  if (!difficulty) return { title: "Page Not Found" };

  const questions = await getQuestionsByDifficulty(difficulty);
  return generateDifficultyMetadata(difficulty, questions.length);
}

export default async function DifficultyPage({ params }: PageProps) {
  const { level } = await params;
  const difficulty = validLevels[level.toLowerCase()];

  if (!difficulty) {
    notFound();
  }

  const questions = await getQuestionsByDifficulty(difficulty);
  const breadcrumbs = generateDifficultyBreadcrumbs(difficulty);

  const difficultyColors = {
    Easy: {
      text: "text-green-500",
      bg: "bg-green-500/10",
    },
    Medium: {
      text: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    Hard: {
      text: "text-red-500",
      bg: "bg-red-500/10",
    },
  };

  const descriptions = {
    Easy: "Perfect for warming up and building confidence. These problems test fundamental concepts and are great for beginners.",
    Medium:
      "The most common interview difficulty. Master these to ace your technical interviews at top tech companies.",
    Hard: "Challenging problems that test advanced algorithms. Often asked for senior positions or at top-tier companies.",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MultiJsonLd
        schemas={[
          generateBreadcrumbSchema(breadcrumbs),
          generateDifficultyPageSchema(difficulty, questions),
        ]}
      />

      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <PageHeader
        title={`${difficulty} LeetCode Problems`}
        description={descriptions[difficulty]}
        stats={[{ label: "Total Problems", value: questions.length.toLocaleString() }]}
      />

      {/* Difficulty Navigation */}
      <section className="mb-8">
        <div className="flex gap-3">
          {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
            <Link key={d} href={`/difficulty/${d.toLowerCase()}`}>
              <Badge
                className={`text-base px-4 py-2 ${
                  d === difficulty
                    ? `${difficultyColors[d].bg} ${difficultyColors[d].text}`
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {d}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Questions Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">All {difficulty} Problems</h2>
        <p className="text-muted-foreground mb-6">
          {questions.length.toLocaleString()} {difficulty.toLowerCase()} difficulty problems sorted
          by frequency.
        </p>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Problem</TableHead>
                <TableHead>Acceptance</TableHead>
                <TableHead>Topics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.slice(0, 200).map((question) => (
                <QuestionRow key={question.slug} question={question} />
              ))}
            </TableBody>
          </Table>
        </div>
        {questions.length > 200 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Showing 200 of {questions.length} problems
          </p>
        )}
      </section>

      {/* Navigation Links */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-lg font-semibold mb-4">Explore More</h2>
        <HubLinks links={getHubLinks()} />
      </section>
    </div>
  );
}

function QuestionRow({ question }: { question: QuestionWithCompanyContext }) {
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
        <span className="text-sm text-muted-foreground">{question.acceptanceRate.toFixed(1)}%</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {question.topics.slice(0, 3).map((topic) => (
            <Link key={topic} href={`/topic/${topic.toLowerCase().replace(/\s+/g, "-")}`}>
              <Badge variant="outline" className="text-xs hover:bg-accent">
                {topic}
              </Badge>
            </Link>
          ))}
          {question.topics.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{question.topics.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
