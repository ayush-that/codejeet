import type { Metadata } from "next";
import type { CompanyProfile } from "./pseo-data";

const SITE_URL = "https://codejeet.com";
const SITE_NAME = "CodeJeet";

export function companyMetadata(profile: CompanyProfile): Metadata {
  const { displayName, questionCount, difficultyDist, topTopics } = profile;
  const topTopicNames = topTopics
    .slice(0, 3)
    .map((t) => t.name)
    .join(", ");

  return {
    title: `${displayName} Interview Questions (${questionCount} LeetCode Problems)`,
    description:
      `Practice ${questionCount} ${displayName} LeetCode interview questions. ` +
      `${difficultyDist.easy} Easy, ${difficultyDist.medium} Medium, ${difficultyDist.hard} Hard. ` +
      `Top topics: ${topTopicNames}.`,
    alternates: { canonical: `${SITE_URL}/company/${profile.slug}` },
    openGraph: {
      title: `${displayName} Interview Questions | ${SITE_NAME}`,
      description: `Browse ${questionCount} ${displayName} LeetCode problems sorted by frequency.`,
      type: "website",
      url: `${SITE_URL}/company/${profile.slug}`,
    },
  };
}

export function problemMetadata(problem: {
  title: string;
  slug: string;
  difficulty: string;
  acceptance_rate: string;
  topics: string[];
  companies: string[];
}): Metadata {
  const topicList = problem.topics.slice(0, 4).join(", ");
  const companyCount = problem.companies.length;

  return {
    title: `${problem.title} - LeetCode ${problem.difficulty}`,
    description:
      `${problem.title}. ${problem.difficulty} difficulty, ${problem.acceptance_rate} acceptance rate. ` +
      `Topics: ${topicList}. Asked by ${companyCount} companies.`,
    alternates: { canonical: `${SITE_URL}/problem/${problem.slug}` },
    openGraph: {
      title: `${problem.title} - LeetCode ${problem.difficulty} | ${SITE_NAME}`,
      description: `${problem.title}. Topics: ${topicList}. Asked by ${companyCount} companies.`,
      type: "article",
      url: `${SITE_URL}/problem/${problem.slug}`,
    },
  };
}

export function topicMetadata(topic: {
  name: string;
  slug: string;
  questionCount: number;
}): Metadata {
  return {
    title: `${topic.name} LeetCode Questions (${topic.questionCount} Problems)`,
    description:
      `Practice ${topic.questionCount} ${topic.name} LeetCode problems. ` +
      `Filter by difficulty and company. Sorted by frequency.`,
    alternates: { canonical: `${SITE_URL}/topic/${topic.slug}` },
    openGraph: {
      title: `${topic.name} Questions | ${SITE_NAME}`,
      description: `Browse ${topic.questionCount} ${topic.name} problems from top tech companies.`,
      type: "website",
      url: `${SITE_URL}/topic/${topic.slug}`,
    },
  };
}

export function collectionJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    numberOfItems: opts.numberOfItems,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function problemJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  difficulty: string;
  topics: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    educationalLevel: opts.difficulty,
    teaches: opts.topics,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
