import type { Metadata } from "next";
import type { CompanyProfile } from "./pseo-data";

const SITE_URL = "https://codejeet.com";
const SITE_NAME = "CodeJeet";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Browse 17,000+ company-wise LeetCode DSA interview questions from 660+ companies.",
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
    logo: `${SITE_URL}/icon.svg`,
    sameAs: ["https://x.com/codejeet"],
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
        name: "System Design",
        url: `${SITE_URL}/system-design`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "Podcast",
        url: `${SITE_URL}/podcast`,
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
    uploadDate: opts.uploadDate ?? "2025-01-01",
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
