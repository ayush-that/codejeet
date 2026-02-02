/**
 * Topics Hub Page
 * Lists all DSA topics with their question counts
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  getAggregatedTopics,
  generateTopicsHubMetadata,
  generateTopicListSchema,
  generateBreadcrumbSchema,
  seoConfig,
  getHubLinks,
  type Topic,
} from "@/lib/seo";
import { MultiJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageHeader, DifficultyBar } from "@/components/seo/PageHeader";
import { HubLinks } from "@/components/seo/InternalLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export async function generateMetadata(): Promise<Metadata> {
  const topics = await getAggregatedTopics();
  return generateTopicsHubMetadata(topics.size);
}

// Topic categories for better organization
const topicCategories = {
  "Data Structures": [
    "array",
    "hash-table",
    "linked-list",
    "stack",
    "queue",
    "tree",
    "binary-tree",
    "binary-search-tree",
    "heap",
    "trie",
    "graph",
    "matrix",
    "segment-tree",
    "binary-indexed-tree",
    "ordered-set",
  ],
  Algorithms: [
    "sorting",
    "binary-search",
    "two-pointers",
    "sliding-window",
    "dynamic-programming",
    "greedy",
    "backtracking",
    "divide-and-conquer",
    "recursion",
    "simulation",
  ],
  "Graph Algorithms": [
    "depth-first-search",
    "breadth-first-search",
    "topological-sort",
    "union-find",
    "shortest-path",
    "minimum-spanning-tree",
    "strongly-connected-component",
    "eulerian-circuit",
  ],
  "Math & Logic": [
    "math",
    "bit-manipulation",
    "number-theory",
    "geometry",
    "combinatorics",
    "counting",
  ],
  "Advanced Techniques": ["monotonic-stack", "prefix-sum", "rolling-hash", "bitmask", "design"],
};

export default async function TopicsPage() {
  const topics = await getAggregatedTopics();
  const topicList = Array.from(topics.values());
  const totalQuestions = topicList.reduce((sum, t) => sum + t.questionCount, 0);

  const breadcrumbItems = [
    { name: "Home", url: seoConfig.siteUrl },
    { name: "Topics", url: `${seoConfig.siteUrl}/topics` },
  ];

  // Categorize topics
  const categorized = new Map<string, Topic[]>();
  const uncategorized: Topic[] = [];

  for (const topic of topicList) {
    let found = false;
    for (const [category, slugs] of Object.entries(topicCategories)) {
      if (slugs.includes(topic.slug)) {
        if (!categorized.has(category)) {
          categorized.set(category, []);
        }
        categorized.get(category)!.push(topic);
        found = true;
        break;
      }
    }
    if (!found) {
      uncategorized.push(topic);
    }
  }

  // Sort topics within each category by question count
  for (const topics of categorized.values()) {
    topics.sort((a, b) => b.questionCount - a.questionCount);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MultiJsonLd
        schemas={[
          generateBreadcrumbSchema(breadcrumbItems),
          generateTopicListSchema(topicList, topics.size),
        ]}
      />

      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <PageHeader
        title="DSA Topics"
        description={`Master ${topics.size} algorithm and data structure topics with over
          ${totalQuestions.toLocaleString()} practice problems. Each topic includes company-specific
          frequency data to help prioritize your preparation.`}
        stats={[
          { label: "Topics", value: topics.size },
          { label: "Total Questions", value: totalQuestions.toLocaleString() },
        ]}
      />

      {/* Popular Topics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Most Popular Topics</h2>
        <p className="text-muted-foreground mb-6">
          Top topics by question count - essential for any coding interview.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicList.slice(0, 9).map((topic) => (
            <TopicCard key={topic.slug} topic={topic} featured />
          ))}
        </div>
      </section>

      {/* Categorized Topics */}
      {Array.from(categorized.entries()).map(([category, categoryTopics]) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryTopics.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        </section>
      ))}

      {/* Uncategorized Topics */}
      {uncategorized.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Other Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {uncategorized.map((topic) => (
              <TopicCardCompact key={topic.slug} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {/* Navigation Links */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="text-lg font-semibold mb-4">Explore More</h2>
        <HubLinks links={getHubLinks().filter((l) => !l.href.includes("/topics"))} />
      </section>
    </div>
  );
}

function TopicCard({ topic, featured = false }: { topic: Topic; featured?: boolean }) {
  return (
    <Link href={`/topic/${topic.slug}`}>
      <Card
        className={`h-full hover:bg-accent transition-colors ${featured ? "border-primary/50" : ""}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">{topic.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold">{topic.questionCount}</div>
            <div className="text-sm text-muted-foreground">Practice Problems</div>
            <DifficultyBar breakdown={topic.difficultyBreakdown} />
            <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{topic.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {topic.topCompanies.slice(0, 3).map((company) => (
                <Badge key={company.slug} variant="outline" className="text-xs">
                  {company.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TopicCardCompact({ topic }: { topic: Topic }) {
  return (
    <Link href={`/topic/${topic.slug}`}>
      <Card className="h-full hover:bg-accent transition-colors">
        <CardContent className="p-4">
          <div className="font-medium truncate">{topic.name}</div>
          <div className="text-sm text-muted-foreground">{topic.questionCount} problems</div>
        </CardContent>
      </Card>
    </Link>
  );
}
