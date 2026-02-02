/**
 * SEO Module Entry Point
 * Re-exports all SEO utilities for clean imports
 */

// Types
export type {
  Difficulty,
  Timeframe,
  DifficultyBreakdown,
  TopicCount,
  CompanyCount,
  CompanyFrequency,
  Company,
  Topic,
  UniqueQuestion,
  QuestionWithCompanyContext,
  PageType,
  BreadcrumbItem,
  InternalLink,
  PageContext,
  CompanyTopicCrossRef,
  CrossReferenceIndex,
  BuildCache,
  SitemapEntry,
  ContentVariation,
  FAQItem,
} from "./types";

// Configuration
export {
  seoConfig,
  getCanonicalUrl,
  formatDisplayName,
  topicDescriptions,
  getCompanyTier,
} from "./config";

// Data Aggregation
export {
  getBuildCache,
  getAggregatedCompanies,
  getAggregatedTopics,
  getUniqueQuestions,
  getCompanyBySlug,
  getTopicBySlug,
  getQuestionBySlug,
  getQuestionsByCompany,
  getQuestionsByTopic,
  getQuestionsByCompanyAndTopic,
  getCompanyTopicCrossRefs,
  getTopicCompanyCrossRefs,
  getQuestionCompanies,
  getTopCrossReferences,
  getQuestionsByDifficulty,
  getStats,
} from "./data-aggregator";

// Metadata Generation
export {
  generateBaseMetadata,
  generateHomeMetadata,
  generateCompaniesHubMetadata,
  generateTopicsHubMetadata,
  generateProblemsHubMetadata,
  generateCompanyMetadata,
  generateTopicMetadata,
  generateProblemMetadata,
  generateCompanyTopicMetadata,
  generateDifficultyMetadata,
  generateSystemDesignMetadata,
  generateNoIndexMetadata,
} from "./metadata";

// Schema (JSON-LD)
export {
  organizationSchema,
  websiteSchema,
  generateBreadcrumbSchema,
  generateCompanyListSchema,
  generateTopicListSchema,
  generateQuestionListSchema,
  generateCompanyPageSchema,
  generateTopicPageSchema,
  generateProblemFAQSchema,
  generateLearningResourceSchema,
  generateDifficultyPageSchema,
  getHomeBreadcrumb,
  getCompaniesBreadcrumb,
  getTopicsBreadcrumb,
  getProblemsBreadcrumb,
  getCompanyBreadcrumb,
  getTopicBreadcrumb,
  getSystemDesignBreadcrumb,
  generateCompanyBreadcrumbs,
  generateTopicBreadcrumbs,
  generateProblemBreadcrumbs,
  generateCompanyTopicBreadcrumbs,
  generateSystemDesignBreadcrumbs,
  generateDifficultyBreadcrumbs,
} from "./schema";

// Internal Linking
export {
  getRelatedCompanies,
  getRelatedTopics,
  getRelatedProblems,
  getHubLinks,
  getCompanyTopicLinks,
  generateCompanyPageLinks,
  generateTopicPageLinks,
  generateProblemPageLinks,
  getContextualLinks,
} from "./internal-linking";
