/**
 * SEO Type Definitions
 * Core types for the scalable programmatic SEO system
 */

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Timeframe = "30_days" | "3_months" | "6_months" | "more_than_6m" | "all";

// ============================================================
// Core Entity Types
// ============================================================

export interface DifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
}

export interface TopicCount {
  slug: string;
  name: string;
  count: number;
}

export interface CompanyCount {
  slug: string;
  name: string;
  count: number;
}

export interface CompanyFrequency {
  company: string;
  displayName: string;
  frequency: number;
  timeframe: Timeframe;
}

/**
 * Aggregated company data for SEO pages
 */
export interface Company {
  slug: string;
  name: string;
  displayName: string;
  questionCount: number;
  uniqueQuestionCount: number;
  difficultyBreakdown: DifficultyBreakdown;
  topTopics: TopicCount[];
  averageAcceptance: number;
  averageFrequency: number;
  lastUpdated: Date;
}

/**
 * Aggregated topic data for SEO pages
 */
export interface Topic {
  slug: string;
  name: string;
  questionCount: number;
  difficultyBreakdown: DifficultyBreakdown;
  topCompanies: CompanyCount[];
  description: string;
  relatedTopics: string[];
}

/**
 * Unique question data (deduplicated across companies)
 */
export interface UniqueQuestion {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  acceptanceRate: number;
  companies: CompanyFrequency[];
  isPremium: boolean;
  leetcodeUrl: string;
  seoDescription: string;
  relatedQuestions: string[];
}

/**
 * Question with company context (for company-specific pages)
 */
export interface QuestionWithCompanyContext {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  acceptanceRate: number;
  frequency: number;
  timeframe: Timeframe;
  isPremium: boolean;
  leetcodeUrl: string;
}

// ============================================================
// Page Context Types
// ============================================================

export type PageType =
  | "home"
  | "companies"
  | "topics"
  | "problems"
  | "company"
  | "topic"
  | "problem"
  | "companyTopic"
  | "difficulty"
  | "systemDesign";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface InternalLink {
  href: string;
  text: string;
  title?: string;
  priority: number;
}

export interface PageContext {
  type: PageType;
  slug?: string;
  company?: Company;
  topic?: Topic;
  question?: UniqueQuestion;
  difficulty?: Difficulty;
}

// ============================================================
// Cross-Reference Types
// ============================================================

export interface CompanyTopicCrossRef {
  companySlug: string;
  companyName: string;
  topicSlug: string;
  topicName: string;
  questionCount: number;
  difficultyBreakdown: DifficultyBreakdown;
}

export interface CrossReferenceIndex {
  companyTopics: Map<string, CompanyTopicCrossRef[]>;
  topicCompanies: Map<string, CompanyTopicCrossRef[]>;
  questionCompanies: Map<string, string[]>;
  questionTopics: Map<string, string[]>;
}

// ============================================================
// Schema Types (JSON-LD)
// ============================================================

export interface SchemaOrganization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  description: string;
}

export interface SchemaBreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string;
}

export interface SchemaBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: SchemaBreadcrumbItem[];
}

export interface SchemaListItem {
  "@type": "ListItem";
  position: number;
  url: string;
  name: string;
}

export interface SchemaItemList {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name: string;
  description: string;
  numberOfItems: number;
  itemListElement: SchemaListItem[];
}

export interface SchemaFAQQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface SchemaFAQPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: SchemaFAQQuestion[];
}

export interface SchemaWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export interface SchemaLearningResource {
  "@context": "https://schema.org";
  "@type": "LearningResource";
  name: string;
  description: string;
  url: string;
  learningResourceType: string;
  educationalLevel: string;
  teaches: string[];
  provider: {
    "@type": "Organization";
    name: string;
    url: string;
  };
}

// ============================================================
// Content Template Types
// ============================================================

export interface ContentVariation {
  title: string;
  h1: string;
  description: string;
  intro: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ============================================================
// Build Cache Types
// ============================================================

export interface BuildCache {
  companies: Map<string, Company>;
  topics: Map<string, Topic>;
  questions: Map<string, UniqueQuestion>;
  crossRefs: CrossReferenceIndex;
  companyQuestions: Map<string, QuestionWithCompanyContext[]>;
  topicQuestions: Map<string, QuestionWithCompanyContext[]>;
  stats: {
    totalCompanies: number;
    totalTopics: number;
    totalUniqueQuestions: number;
    totalQuestionRecords: number;
    lastBuilt: Date;
  };
}

// ============================================================
// Sitemap Types
// ============================================================

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}
