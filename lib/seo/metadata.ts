/**
 * Dynamic Metadata Generation System
 * Generates unique, intent-matched metadata for all page types
 */

import type { Metadata } from "next";
import { seoConfig, getCanonicalUrl } from "./config";
import type { Company, Topic, UniqueQuestion, Difficulty, CompanyTopicCrossRef } from "./types";

// ============================================================
// Base Metadata
// ============================================================

export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(seoConfig.siteUrl),
    title: {
      default: seoConfig.pageTypes.home.titleTemplate,
      template: `%s | ${seoConfig.siteName}`,
    },
    description: seoConfig.siteDescription,
    keywords: [
      "leetcode",
      "coding interview",
      "DSA",
      "data structures",
      "algorithms",
      "interview questions",
      "programming",
      "tech interview",
      "FAANG",
      "software engineering",
    ],
    authors: [{ name: "CodeJeet" }],
    creator: "CodeJeet",
    publisher: "CodeJeet",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: seoConfig.locale,
      url: seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      title: seoConfig.pageTypes.home.titleTemplate,
      description: seoConfig.siteDescription,
      images: [
        {
          url: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
          width: 1200,
          height: 630,
          alt: "CodeJeet - Master Coding Interviews",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoConfig.pageTypes.home.titleTemplate,
      description: seoConfig.siteDescription,
      creator: seoConfig.twitterHandle,
      images: [`${seoConfig.siteUrl}${seoConfig.defaultImage}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

// ============================================================
// Home Page Metadata
// ============================================================

export function generateHomeMetadata(): Metadata {
  return {
    title: seoConfig.pageTypes.home.titleTemplate,
    description: seoConfig.pageTypes.home.descriptionTemplate,
    alternates: {
      canonical: getCanonicalUrl("home"),
    },
    openGraph: {
      title: seoConfig.pageTypes.home.titleTemplate,
      description: seoConfig.pageTypes.home.descriptionTemplate,
      url: getCanonicalUrl("home"),
    },
    twitter: {
      title: seoConfig.pageTypes.home.titleTemplate,
      description: seoConfig.pageTypes.home.descriptionTemplate,
    },
  };
}

// ============================================================
// Companies Hub Metadata
// ============================================================

export function generateCompaniesHubMetadata(companyCount: number): Metadata {
  const title = seoConfig.pageTypes.companies.titleTemplate.replace(
    "{count}",
    companyCount.toString()
  );
  const description = seoConfig.pageTypes.companies.descriptionTemplate.replace(
    "{count}",
    companyCount.toString()
  );

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl("companies"),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl("companies"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ============================================================
// Topics Hub Metadata
// ============================================================

export function generateTopicsHubMetadata(topicCount: number): Metadata {
  const title = seoConfig.pageTypes.topics.titleTemplate.replace("{count}", topicCount.toString());
  const description = seoConfig.pageTypes.topics.descriptionTemplate.replace(
    "{count}",
    topicCount.toString()
  );

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl("topics"),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl("topics"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ============================================================
// Problems Hub Metadata
// ============================================================

export function generateProblemsHubMetadata(questionCount: number): Metadata {
  const title = seoConfig.pageTypes.problems.titleTemplate.replace(
    "{count}",
    questionCount.toString()
  );
  const description = seoConfig.pageTypes.problems.descriptionTemplate.replace(
    "{count}",
    questionCount.toString()
  );

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl("problems"),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl("problems"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ============================================================
// Company Page Metadata
// ============================================================

export function generateCompanyMetadata(company: Company): Metadata {
  const { displayName, questionCount, difficultyBreakdown, topTopics } = company;

  const title = seoConfig.pageTypes.company.titleTemplate
    .replace("{name}", displayName)
    .replace("{count}", questionCount.toString());

  const topTopicNames = topTopics
    .slice(0, 3)
    .map((t) => t.name)
    .join(", ");
  const description = seoConfig.pageTypes.company.descriptionTemplate
    .replace(/{name}/g, displayName)
    .replace("{count}", questionCount.toString())
    .replace("{hard}", difficultyBreakdown.hard.toString())
    .replace("{medium}", difficultyBreakdown.medium.toString())
    .replace("{easy}", difficultyBreakdown.easy.toString())
    .replace("{topics}", topTopicNames || "various topics");

  const keywords = [
    `${displayName} interview questions`,
    `${displayName} leetcode`,
    `${displayName} coding interview`,
    `${displayName} DSA questions`,
    ...topTopics.slice(0, 5).map((t) => `${displayName} ${t.name}`),
  ];

  const canonicalUrl = getCanonicalUrl("company", { slug: company.slug });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: `${seoConfig.siteUrl}/og/company/${company.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${displayName} Interview Questions`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ============================================================
// Topic Page Metadata
// ============================================================

export function generateTopicMetadata(topic: Topic): Metadata {
  const {
    name,
    questionCount,
    difficultyBreakdown,
    topCompanies,
    description: topicDescription,
  } = topic;

  const title = seoConfig.pageTypes.topic.titleTemplate
    .replace("{name}", name)
    .replace("{count}", questionCount.toString());

  const topCompanyNames = topCompanies
    .slice(0, 3)
    .map((c) => c.name)
    .join(", ");
  const description = seoConfig.pageTypes.topic.descriptionTemplate
    .replace(/{name}/g, name)
    .replace("{count}", questionCount.toString())
    .replace("{hard}", difficultyBreakdown.hard.toString())
    .replace("{medium}", difficultyBreakdown.medium.toString())
    .replace("{easy}", difficultyBreakdown.easy.toString())
    .replace("{companies}", topCompanyNames || "top tech companies");

  const keywords = [
    `${name} leetcode`,
    `${name} problems`,
    `${name} interview questions`,
    `${name} algorithms`,
    `${name} data structures`,
    ...topCompanies.slice(0, 5).map((c) => `${c.name} ${name}`),
  ];

  const canonicalUrl = getCanonicalUrl("topic", { slug: topic.slug });

  return {
    title,
    description: `${description} ${topicDescription}`.slice(0, 160),
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ============================================================
// Problem Page Metadata
// ============================================================

export function generateProblemMetadata(question: UniqueQuestion): Metadata {
  const { title: questionTitle, difficulty, acceptanceRate, companies, topics } = question;

  const title = seoConfig.pageTypes.problem.titleTemplate
    .replace("{title}", questionTitle)
    .replace("{difficulty}", difficulty);

  const topCompanyNames = companies
    .slice(0, 3)
    .map((c) => c.displayName)
    .join(", ");
  const topicsText = topics.slice(0, 3).join(", ");
  const description = seoConfig.pageTypes.problem.descriptionTemplate
    .replace("{title}", questionTitle)
    .replace("{difficulty}", difficulty)
    .replace("{acceptance}", acceptanceRate.toString())
    .replace("{companies}", topCompanyNames || "top tech companies")
    .replace("{topics}", topicsText || "algorithms");

  const keywords = [
    `${questionTitle} leetcode`,
    `${questionTitle} solution`,
    `${questionTitle} ${difficulty}`,
    ...companies.slice(0, 5).map((c) => `${c.displayName} ${questionTitle}`),
    ...topics.slice(0, 5).map((t) => `${t} ${questionTitle}`),
  ];

  const canonicalUrl = getCanonicalUrl("problem", { slug: question.slug });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// ============================================================
// Company + Topic Cross-Reference Metadata
// ============================================================

export function generateCompanyTopicMetadata(crossRef: CompanyTopicCrossRef): Metadata {
  const { companyName, topicName, questionCount, difficultyBreakdown } = crossRef;

  const title = seoConfig.pageTypes.companyTopic.titleTemplate
    .replace("{company}", companyName)
    .replace("{topic}", topicName)
    .replace("{count}", questionCount.toString());

  const description = seoConfig.pageTypes.companyTopic.descriptionTemplate
    .replace("{company}", companyName)
    .replace("{topic}", topicName)
    .replace("{count}", questionCount.toString())
    .replace("{hard}", difficultyBreakdown.hard.toString())
    .replace("{medium}", difficultyBreakdown.medium.toString())
    .replace("{easy}", difficultyBreakdown.easy.toString());

  const keywords = [
    `${companyName} ${topicName}`,
    `${companyName} ${topicName} interview questions`,
    `${companyName} ${topicName} leetcode`,
  ];

  const canonicalUrl = getCanonicalUrl("companyTopic", {
    company: crossRef.companySlug,
    topic: crossRef.topicSlug,
  });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// ============================================================
// Difficulty Page Metadata
// ============================================================

export function generateDifficultyMetadata(
  difficulty: Difficulty,
  questionCount: number
): Metadata {
  const title = seoConfig.pageTypes.difficulty.titleTemplate
    .replace("{level}", difficulty)
    .replace("{count}", questionCount.toString());

  const description = seoConfig.pageTypes.difficulty.descriptionTemplate
    .replace("{level}", difficulty.toLowerCase())
    .replace("{count}", questionCount.toString());

  const keywords = [
    `${difficulty.toLowerCase()} leetcode problems`,
    `${difficulty.toLowerCase()} coding questions`,
    `${difficulty.toLowerCase()} interview questions`,
  ];

  const canonicalUrl = getCanonicalUrl("difficulty", { level: difficulty.toLowerCase() });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// ============================================================
// System Design Metadata
// ============================================================

export function generateSystemDesignMetadata(
  title: string,
  slug: string,
  description?: string
): Metadata {
  const pageTitle = seoConfig.pageTypes.systemDesign.titleTemplate.replace("{title}", title);

  const pageDescription =
    description || seoConfig.pageTypes.systemDesign.descriptionTemplate.replace("{title}", title);

  const keywords = [
    `${title} system design`,
    `${title} architecture`,
    `system design interview ${title}`,
    "system design interview",
    "distributed systems",
  ];

  const canonicalUrl = getCanonicalUrl("systemDesign", { slug });

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

// ============================================================
// No-Index Metadata (for protected pages)
// ============================================================

export function generateNoIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description: description || seoConfig.siteDescription,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}
