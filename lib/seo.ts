import type { Metadata } from "next";
import type { CompanyProfile, ComparisonPair } from "./pseo-data";
import { isCompareIndexable } from "./compare";

const SITE_URL = "https://codejeet.com";
const SITE_NAME = "CodeJeet";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Browse 15,000+ company-wise LeetCode DSA interview questions from 700+ companies.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/dashboard?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: ["https://x.com/shydev69"],
  };
}

export function siteNavigationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Companies",
        url: `${SITE_URL}/companies`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Blog",
        url: `${SITE_URL}/blog`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Tracker",
        url: `${SITE_URL}/dashboard`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Compare",
        url: `${SITE_URL}/compare`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "System Design",
        url: `${SITE_URL}/system-design`,
      },
    ],
  };
}

export function faqJsonLd(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function videoObjectJsonLd(opts: {
  name: string;
  description: string;
  thumbnailUrl: string;
  embedUrl: string;
  uploadDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: opts.name,
    description: opts.description,
    thumbnailUrl: opts.thumbnailUrl,
    embedUrl: opts.embedUrl,
    ...(opts.uploadDate ? { uploadDate: opts.uploadDate } : {}),
  };
}

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

export function compareMetadata(data: ComparisonPair): Metadata {
  const { pair, companyA, companyB, sharedCount, uniqueToACount, uniqueToBCount, topSharedTopics } =
    data;
  const topicNames = topSharedTopics
    .slice(0, 4)
    .map((t) => t.name)
    .join(", ");
  const overlapA =
    companyA.questionCount > 0 ? Math.round((sharedCount / companyA.questionCount) * 100) : 0;
  const overlapB =
    companyB.questionCount > 0 ? Math.round((sharedCount / companyB.questionCount) * 100) : 0;

  const description =
    `${companyA.displayName} (${companyA.questionCount} questions) vs ` +
    `${companyB.displayName} (${companyB.questionCount} questions): ${sharedCount} shared LeetCode ` +
    `problems (${overlapA}% of ${companyA.displayName}, ${overlapB}% of ${companyB.displayName}). ` +
    `${uniqueToACount} unique to ${companyA.displayName}, ${uniqueToBCount} unique to ` +
    `${companyB.displayName}. Top shared topics: ${topicNames || "Array, Dynamic Programming"}.`;

  const meta: Metadata = {
    title: `${companyA.displayName} vs ${companyB.displayName} Interview Questions Comparison`,
    description,
    alternates: { canonical: `${SITE_URL}/compare/${pair}` },
    openGraph: {
      title: `${companyA.displayName} vs ${companyB.displayName} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/compare/${pair}`,
    },
  };

  if (!isCompareIndexable(sharedCount)) {
    return { ...meta, robots: { index: false, follow: true } };
  }

  return meta;
}

export function buildCompareFaqs(data: ComparisonPair) {
  const { companyA, companyB, sharedCount, uniqueToACount, uniqueToBCount, topSharedTopics } = data;
  const topTopicAnswer =
    topSharedTopics.length > 0
      ? topSharedTopics
          .slice(0, 5)
          .map((t) => `${t.name} (${t.count} shared questions)`)
          .join(", ")
      : "Array, String, Hash Table, and Dynamic Programming";

  const harder =
    companyA.difficultyDist.hard / (companyA.questionCount || 1) >
    companyB.difficultyDist.hard / (companyB.questionCount || 1)
      ? companyA.displayName
      : companyB.displayName;

  return [
    {
      question: `How many LeetCode questions do ${companyA.displayName} and ${companyB.displayName} share?`,
      answer: `${companyA.displayName} and ${companyB.displayName} share ${sharedCount} LeetCode interview questions. ${uniqueToACount} problems appear only in ${companyA.displayName}'s list and ${uniqueToBCount} appear only in ${companyB.displayName}'s list.`,
    },
    {
      question: `What topics overlap most between ${companyA.displayName} and ${companyB.displayName}?`,
      answer: `The most common shared topics between ${companyA.displayName} and ${companyB.displayName} are ${topTopicAnswer}. Mastering these areas prepares you for both companies.`,
    },
    {
      question: `Which company asks harder LeetCode questions: ${companyA.displayName} or ${companyB.displayName}?`,
      answer: `${companyA.displayName} has ${companyA.difficultyDist.easy} Easy, ${companyA.difficultyDist.medium} Medium, and ${companyA.difficultyDist.hard} Hard questions. ${companyB.displayName} has ${companyB.difficultyDist.easy} Easy, ${companyB.difficultyDist.medium} Medium, and ${companyB.difficultyDist.hard} Hard questions. ${harder} has a higher proportion of Hard problems in its interview set.`,
    },
    {
      question: `How should I prepare if interviewing at both ${companyA.displayName} and ${companyB.displayName}?`,
      answer: `Start with the ${sharedCount} shared problems since they cover what both companies ask most often. Then add ${Math.min(uniqueToACount, 20)} ${companyA.displayName}-specific and ${Math.min(uniqueToBCount, 20)} ${companyB.displayName}-specific questions to round out your prep.`,
    },
  ];
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
