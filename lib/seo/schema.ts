/**
 * JSON-LD Schema Factory
 * Generates structured data for rich search results
 */

import { seoConfig, getCanonicalUrl } from "./config";
import type {
  Company,
  Topic,
  UniqueQuestion,
  QuestionWithCompanyContext,
  BreadcrumbItem,
  SchemaOrganization,
  SchemaBreadcrumbList,
  SchemaItemList,
  SchemaFAQPage,
  SchemaWebSite,
  SchemaLearningResource,
  Difficulty,
} from "./types";

// ============================================================
// Organization Schema (Site-wide)
// ============================================================

export const organizationSchema: SchemaOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: seoConfig.organization.name,
  url: seoConfig.siteUrl,
  logo: `${seoConfig.siteUrl}${seoConfig.organization.logo}`,
  sameAs: [seoConfig.organization.github, seoConfig.organization.twitter],
  description: seoConfig.siteDescription,
};

// ============================================================
// Website Schema (Home page)
// ============================================================

export const websiteSchema: SchemaWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: seoConfig.siteName,
  url: seoConfig.siteUrl,
  description: seoConfig.siteDescription,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${seoConfig.siteUrl}/problems?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ============================================================
// Breadcrumb Schema
// ============================================================

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): SchemaBreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: index < items.length - 1 ? item.url : undefined, // Last item shouldn't have item property
    })),
  };
}

// ============================================================
// Company List Schema (for hub page)
// ============================================================

export function generateCompanyListSchema(
  companies: Company[],
  totalCount: number
): SchemaItemList {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tech Company Interview Questions",
    description: `Browse coding interview questions from ${totalCount} tech companies`,
    numberOfItems: totalCount,
    itemListElement: companies.slice(0, 50).map((company, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getCanonicalUrl("company", { slug: company.slug }),
      name: `${company.displayName} (${company.questionCount} questions)`,
    })),
  };
}

// ============================================================
// Topic List Schema (for hub page)
// ============================================================

export function generateTopicListSchema(topics: Topic[], totalCount: number): SchemaItemList {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "DSA Topics for Coding Interviews",
    description: `Master ${totalCount} algorithm and data structure topics`,
    numberOfItems: totalCount,
    itemListElement: topics.slice(0, 50).map((topic, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getCanonicalUrl("topic", { slug: topic.slug }),
      name: `${topic.name} (${topic.questionCount} questions)`,
    })),
  };
}

// ============================================================
// Question List Schema (for company/topic pages)
// ============================================================

export function generateQuestionListSchema(
  questions: QuestionWithCompanyContext[],
  listName: string,
  listDescription: string
): SchemaItemList {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    description: listDescription,
    numberOfItems: questions.length,
    itemListElement: questions.slice(0, 100).map((q, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getCanonicalUrl("problem", { slug: q.slug }),
      name: `${q.title} (${q.difficulty})`,
    })),
  };
}

// ============================================================
// Company Page Schema
// ============================================================

export function generateCompanyPageSchema(
  company: Company,
  questions: QuestionWithCompanyContext[]
): SchemaItemList {
  return generateQuestionListSchema(
    questions,
    `${company.displayName} Interview Questions`,
    `${company.questionCount} coding problems asked at ${company.displayName} interviews. ` +
      `${company.difficultyBreakdown.hard} Hard, ${company.difficultyBreakdown.medium} Medium, ${company.difficultyBreakdown.easy} Easy.`
  );
}

// ============================================================
// Topic Page Schema
// ============================================================

export function generateTopicPageSchema(
  topic: Topic,
  questions: QuestionWithCompanyContext[]
): SchemaItemList {
  return generateQuestionListSchema(
    questions,
    `${topic.name} Problems`,
    `${topic.questionCount} ${topic.name} coding problems. ` +
      `${topic.difficultyBreakdown.hard} Hard, ${topic.difficultyBreakdown.medium} Medium, ${topic.difficultyBreakdown.easy} Easy.`
  );
}

// ============================================================
// Problem FAQ Schema
// ============================================================

export function generateProblemFAQSchema(question: UniqueQuestion): SchemaFAQPage {
  const companyNames = question.companies.slice(0, 5).map((c) => c.displayName);
  const topicsText = question.topics.join(", ");

  const faqs = [
    {
      question: `What companies ask "${question.title}"?`,
      answer:
        question.companies.length > 5
          ? `${question.title} is asked by ${companyNames.join(", ")} and ${question.companies.length - 5} other companies.`
          : `${question.title} is asked by ${companyNames.join(", ")}.`,
    },
    {
      question: `What is the difficulty of "${question.title}"?`,
      answer: `${question.title} is a ${question.difficulty} difficulty problem with ${question.acceptanceRate}% acceptance rate on LeetCode.`,
    },
    {
      question: `What topics does "${question.title}" cover?`,
      answer: `${question.title} covers ${topicsText}. Understanding these topics is essential for solving this problem.`,
    },
    {
      question: `Is "${question.title}" a premium LeetCode problem?`,
      answer: question.isPremium
        ? `Yes, ${question.title} is a LeetCode Premium problem.`
        : `No, ${question.title} is freely available on LeetCode.`,
    },
  ];

  // Add frequency FAQ if there's notable frequency data
  const topCompany = question.companies[0];
  if (topCompany && topCompany.frequency > 50) {
    faqs.push({
      question: `How frequently is "${question.title}" asked in interviews?`,
      answer: `${question.title} has a ${topCompany.frequency}% frequency at ${topCompany.displayName}, making it a commonly asked interview question.`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================================
// Learning Resource Schema (for System Design)
// ============================================================

export function generateLearningResourceSchema(
  title: string,
  slug: string,
  description: string,
  topics: string[]
): SchemaLearningResource {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description,
    url: getCanonicalUrl("systemDesign", { slug }),
    learningResourceType: "System Design Guide",
    educationalLevel: "Intermediate to Advanced",
    teaches: topics,
    provider: {
      "@type": "Organization",
      name: seoConfig.organization.name,
      url: seoConfig.siteUrl,
    },
  };
}

// ============================================================
// Difficulty Page Schema
// ============================================================

export function generateDifficultyPageSchema(
  difficulty: Difficulty,
  questions: QuestionWithCompanyContext[]
): SchemaItemList {
  return generateQuestionListSchema(
    questions,
    `${difficulty} LeetCode Problems`,
    `${questions.length} ${difficulty.toLowerCase()} difficulty coding problems for interview preparation.`
  );
}

// ============================================================
// Breadcrumb Helpers
// ============================================================

export function getHomeBreadcrumb(): BreadcrumbItem {
  return { name: "Home", url: seoConfig.siteUrl };
}

export function getCompaniesBreadcrumb(): BreadcrumbItem {
  return { name: "Companies", url: getCanonicalUrl("companies") };
}

export function getTopicsBreadcrumb(): BreadcrumbItem {
  return { name: "Topics", url: getCanonicalUrl("topics") };
}

export function getProblemsBreadcrumb(): BreadcrumbItem {
  return { name: "Problems", url: getCanonicalUrl("problems") };
}

export function getCompanyBreadcrumb(company: Company): BreadcrumbItem {
  return {
    name: company.displayName,
    url: getCanonicalUrl("company", { slug: company.slug }),
  };
}

export function getTopicBreadcrumb(topic: Topic): BreadcrumbItem {
  return {
    name: topic.name,
    url: getCanonicalUrl("topic", { slug: topic.slug }),
  };
}

export function getSystemDesignBreadcrumb(): BreadcrumbItem {
  return { name: "System Design", url: `${seoConfig.siteUrl}/system-design` };
}

// ============================================================
// Page-specific Breadcrumb Generators
// ============================================================

export function generateCompanyBreadcrumbs(company: Company): BreadcrumbItem[] {
  return [getHomeBreadcrumb(), getCompaniesBreadcrumb(), getCompanyBreadcrumb(company)];
}

export function generateTopicBreadcrumbs(topic: Topic): BreadcrumbItem[] {
  return [getHomeBreadcrumb(), getTopicsBreadcrumb(), getTopicBreadcrumb(topic)];
}

export function generateProblemBreadcrumbs(question: UniqueQuestion): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    getProblemsBreadcrumb(),
    { name: question.title, url: getCanonicalUrl("problem", { slug: question.slug }) },
  ];
}

export function generateCompanyTopicBreadcrumbs(
  company: Company,
  topicName: string,
  topicSlug: string
): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    getCompaniesBreadcrumb(),
    getCompanyBreadcrumb(company),
    {
      name: topicName,
      url: getCanonicalUrl("companyTopic", { company: company.slug, topic: topicSlug }),
    },
  ];
}

export function generateSystemDesignBreadcrumbs(title: string, slug: string): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    getSystemDesignBreadcrumb(),
    { name: title, url: getCanonicalUrl("systemDesign", { slug }) },
  ];
}

export function generateDifficultyBreadcrumbs(difficulty: Difficulty): BreadcrumbItem[] {
  return [
    getHomeBreadcrumb(),
    getProblemsBreadcrumb(),
    {
      name: `${difficulty} Problems`,
      url: getCanonicalUrl("difficulty", { level: difficulty.toLowerCase() }),
    },
  ];
}
