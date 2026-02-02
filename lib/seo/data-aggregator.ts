/**
 * Data Aggregation Layer
 * Pre-computes aggregated statistics for SEO pages from raw CSV data
 */

import "server-only";
import { getQuestions, getCompanies, getTopics, type QuestionWithDetails } from "@/lib/data";
import { formatDisplayName, getCompanyTier, topicDescriptions } from "./config";
import type {
  Company,
  Topic,
  UniqueQuestion,
  QuestionWithCompanyContext,
  CompanyFrequency,
  DifficultyBreakdown,
  TopicCount,
  CompanyCount,
  CrossReferenceIndex,
  CompanyTopicCrossRef,
  BuildCache,
  Difficulty,
} from "./types";

// ============================================================
// Cache Management
// ============================================================

let buildCache: BuildCache | null = null;
let cachePromise: Promise<BuildCache> | null = null;

/**
 * Get or build the aggregated data cache
 * Uses singleton pattern to ensure data is computed only once
 */
export async function getBuildCache(): Promise<BuildCache> {
  if (buildCache) {
    return buildCache;
  }

  // Prevent race conditions with concurrent requests
  if (cachePromise) {
    return cachePromise;
  }

  cachePromise = buildAggregatedData();
  buildCache = await cachePromise;
  cachePromise = null;

  return buildCache;
}

/**
 * Build all aggregated data for the SEO system
 */
async function buildAggregatedData(): Promise<BuildCache> {
  const startTime = Date.now();

  // Load raw data
  const { questions: rawQuestions } = await getQuestions();
  const companyList = await getCompanies();
  const topicList = await getTopics();

  // Build aggregations
  const companies = aggregateCompanies(rawQuestions, companyList);
  const topics = aggregateTopics(rawQuestions, topicList);
  const questions = deduplicateQuestions(rawQuestions);
  const crossRefs = buildCrossReferenceIndex(rawQuestions);
  const companyQuestions = buildCompanyQuestionsIndex(rawQuestions);
  const topicQuestions = buildTopicQuestionsIndex(rawQuestions);

  const stats = {
    totalCompanies: companies.size,
    totalTopics: topics.size,
    totalUniqueQuestions: questions.size,
    totalQuestionRecords: rawQuestions.length,
    lastBuilt: new Date(),
  };

  console.log(`[SEO] Build cache completed in ${Date.now() - startTime}ms`);
  console.log(
    `[SEO] Stats: ${stats.totalCompanies} companies, ${stats.totalTopics} topics, ${stats.totalUniqueQuestions} unique questions`
  );

  return {
    companies,
    topics,
    questions,
    crossRefs,
    companyQuestions,
    topicQuestions,
    stats,
  };
}

// ============================================================
// Company Aggregation
// ============================================================

function aggregateCompanies(
  questions: QuestionWithDetails[],
  companyList: string[]
): Map<string, Company> {
  const companies = new Map<string, Company>();

  for (const companySlug of companyList) {
    const companyQuestions = questions.filter((q) => q.company === companySlug);

    if (companyQuestions.length === 0) continue;

    const difficultyBreakdown = calculateDifficultyBreakdown(companyQuestions);
    const topTopics = calculateTopTopics(companyQuestions, 10);
    const uniqueQuestionSlugs = new Set(companyQuestions.map((q) => q.slug));
    const avgAcceptance =
      companyQuestions.reduce((sum, q) => sum + q.acceptance_rate, 0) / companyQuestions.length;
    const avgFrequency =
      companyQuestions.reduce((sum, q) => sum + q.frequency, 0) / companyQuestions.length;

    companies.set(companySlug, {
      slug: companySlug,
      name: companySlug,
      displayName: formatDisplayName(companySlug),
      questionCount: companyQuestions.length,
      uniqueQuestionCount: uniqueQuestionSlugs.size,
      difficultyBreakdown,
      topTopics,
      averageAcceptance: Math.round(avgAcceptance * 10) / 10,
      averageFrequency: Math.round(avgFrequency * 10) / 10,
      lastUpdated: new Date(),
    });
  }

  // Sort by tier and question count
  const sortedEntries = Array.from(companies.entries()).sort((a, b) => {
    const tierDiff = getCompanyTier(a[0]) - getCompanyTier(b[0]);
    if (tierDiff !== 0) return tierDiff;
    return b[1].questionCount - a[1].questionCount;
  });

  return new Map(sortedEntries);
}

// ============================================================
// Topic Aggregation
// ============================================================

function aggregateTopics(
  questions: QuestionWithDetails[],
  topicList: string[]
): Map<string, Topic> {
  const topics = new Map<string, Topic>();

  for (const topicName of topicList) {
    const topicQuestions = questions.filter((q) =>
      q.topics.some((t) => t.toLowerCase() === topicName.toLowerCase())
    );

    if (topicQuestions.length === 0) continue;

    const topicSlug = topicName.toLowerCase().replace(/\s+/g, "-");
    const difficultyBreakdown = calculateDifficultyBreakdown(topicQuestions);
    const topCompanies = calculateTopCompanies(topicQuestions, 10);
    const relatedTopics = calculateRelatedTopics(questions, topicName, 5);

    topics.set(topicSlug, {
      slug: topicSlug,
      name: topicName,
      questionCount: topicQuestions.length,
      difficultyBreakdown,
      topCompanies,
      description:
        topicDescriptions[topicSlug] ||
        `Practice ${topicName} problems to master this essential topic.`,
      relatedTopics,
    });
  }

  // Sort by question count
  const sortedEntries = Array.from(topics.entries()).sort(
    (a, b) => b[1].questionCount - a[1].questionCount
  );

  return new Map(sortedEntries);
}

// ============================================================
// Question Deduplication
// ============================================================

function deduplicateQuestions(questions: QuestionWithDetails[]): Map<string, UniqueQuestion> {
  const uniqueQuestions = new Map<string, UniqueQuestion>();
  const questionCompanies = new Map<string, CompanyFrequency[]>();

  // Group by question slug
  for (const q of questions) {
    if (!questionCompanies.has(q.slug)) {
      questionCompanies.set(q.slug, []);
    }
    questionCompanies.get(q.slug)!.push({
      company: q.company,
      displayName: formatDisplayName(q.company),
      frequency: q.frequency,
      timeframe: q.timeframe,
    });
  }

  // Create unique question entries
  for (const q of questions) {
    if (uniqueQuestions.has(q.slug)) continue;

    const companies = questionCompanies.get(q.slug) || [];
    // Sort companies by frequency
    companies.sort((a, b) => b.frequency - a.frequency);

    // Find related questions (same topics, different questions)
    const relatedSlugs = findRelatedQuestions(questions, q, 5);

    // Generate SEO description
    const seoDescription = generateQuestionDescription(q, companies);

    uniqueQuestions.set(q.slug, {
      id: q.id,
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      topics: q.topics,
      acceptanceRate: q.acceptance_rate,
      companies,
      isPremium: q["Is Premium"] === "Y",
      leetcodeUrl: q.link,
      seoDescription,
      relatedQuestions: relatedSlugs,
    });
  }

  // Sort by number of companies asking (popularity)
  const sortedEntries = Array.from(uniqueQuestions.entries()).sort(
    (a, b) => b[1].companies.length - a[1].companies.length
  );

  return new Map(sortedEntries);
}

// ============================================================
// Cross-Reference Index
// ============================================================

function buildCrossReferenceIndex(questions: QuestionWithDetails[]): CrossReferenceIndex {
  const companyTopics = new Map<string, CompanyTopicCrossRef[]>();
  const topicCompanies = new Map<string, CompanyTopicCrossRef[]>();
  const questionCompanies = new Map<string, string[]>();
  const questionTopics = new Map<string, string[]>();

  // Build question -> companies mapping
  for (const q of questions) {
    if (!questionCompanies.has(q.slug)) {
      questionCompanies.set(q.slug, []);
    }
    const companies = questionCompanies.get(q.slug)!;
    if (!companies.includes(q.company)) {
      companies.push(q.company);
    }

    // Build question -> topics mapping
    if (!questionTopics.has(q.slug)) {
      questionTopics.set(q.slug, q.topics);
    }
  }

  // Build company-topic cross references
  const crossRefMap = new Map<string, QuestionWithDetails[]>();

  for (const q of questions) {
    for (const topic of q.topics) {
      const key = `${q.company}:${topic.toLowerCase()}`;
      if (!crossRefMap.has(key)) {
        crossRefMap.set(key, []);
      }
      crossRefMap.get(key)!.push(q);
    }
  }

  for (const [key, qs] of crossRefMap) {
    const [companySlug, topicLower] = key.split(":");
    const topicSlug = topicLower.replace(/\s+/g, "-");

    const crossRef: CompanyTopicCrossRef = {
      companySlug,
      companyName: formatDisplayName(companySlug),
      topicSlug,
      topicName: qs[0].topics.find((t) => t.toLowerCase() === topicLower) || topicLower,
      questionCount: qs.length,
      difficultyBreakdown: calculateDifficultyBreakdown(qs),
    };

    // Add to company -> topics
    if (!companyTopics.has(companySlug)) {
      companyTopics.set(companySlug, []);
    }
    companyTopics.get(companySlug)!.push(crossRef);

    // Add to topic -> companies
    if (!topicCompanies.has(topicSlug)) {
      topicCompanies.set(topicSlug, []);
    }
    topicCompanies.get(topicSlug)!.push(crossRef);
  }

  // Sort cross-refs by question count
  for (const refs of companyTopics.values()) {
    refs.sort((a, b) => b.questionCount - a.questionCount);
  }
  for (const refs of topicCompanies.values()) {
    refs.sort((a, b) => b.questionCount - a.questionCount);
  }

  return { companyTopics, topicCompanies, questionCompanies, questionTopics };
}

// ============================================================
// Company Questions Index
// ============================================================

function buildCompanyQuestionsIndex(
  questions: QuestionWithDetails[]
): Map<string, QuestionWithCompanyContext[]> {
  const index = new Map<string, QuestionWithCompanyContext[]>();

  for (const q of questions) {
    if (!index.has(q.company)) {
      index.set(q.company, []);
    }

    index.get(q.company)!.push({
      id: q.id,
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      topics: q.topics,
      acceptanceRate: q.acceptance_rate,
      frequency: q.frequency,
      timeframe: q.timeframe,
      isPremium: q["Is Premium"] === "Y",
      leetcodeUrl: q.link,
    });
  }

  // Sort each company's questions by frequency
  for (const qs of index.values()) {
    qs.sort((a, b) => b.frequency - a.frequency);
  }

  return index;
}

// ============================================================
// Topic Questions Index
// ============================================================

function buildTopicQuestionsIndex(
  questions: QuestionWithDetails[]
): Map<string, QuestionWithCompanyContext[]> {
  const index = new Map<string, QuestionWithCompanyContext[]>();

  for (const q of questions) {
    for (const topic of q.topics) {
      const topicSlug = topic.toLowerCase().replace(/\s+/g, "-");

      if (!index.has(topicSlug)) {
        index.set(topicSlug, []);
      }

      index.get(topicSlug)!.push({
        id: q.id,
        slug: q.slug,
        title: q.title,
        difficulty: q.difficulty,
        topics: q.topics,
        acceptanceRate: q.acceptance_rate,
        frequency: q.frequency,
        timeframe: q.timeframe,
        isPremium: q["Is Premium"] === "Y",
        leetcodeUrl: q.link,
      });
    }
  }

  // Sort by frequency and deduplicate within each topic
  for (const [topicSlug, qs] of index) {
    const seen = new Set<string>();
    const deduped: QuestionWithCompanyContext[] = [];
    for (const q of qs.sort((a, b) => b.frequency - a.frequency)) {
      if (!seen.has(q.slug)) {
        seen.add(q.slug);
        deduped.push(q);
      }
    }
    index.set(topicSlug, deduped);
  }

  return index;
}

// ============================================================
// Helper Functions
// ============================================================

function calculateDifficultyBreakdown(questions: QuestionWithDetails[]): DifficultyBreakdown {
  const breakdown = { easy: 0, medium: 0, hard: 0 };
  for (const q of questions) {
    const difficulty = q.difficulty.toLowerCase() as "easy" | "medium" | "hard";
    breakdown[difficulty]++;
  }
  return breakdown;
}

function calculateTopTopics(questions: QuestionWithDetails[], limit: number): TopicCount[] {
  const topicCounts = new Map<string, number>();

  for (const q of questions) {
    for (const topic of q.topics) {
      const count = topicCounts.get(topic) || 0;
      topicCounts.set(topic, count + 1);
    }
  }

  return Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      count,
    }));
}

function calculateTopCompanies(questions: QuestionWithDetails[], limit: number): CompanyCount[] {
  const companyCounts = new Map<string, number>();

  for (const q of questions) {
    const count = companyCounts.get(q.company) || 0;
    companyCounts.set(q.company, count + 1);
  }

  return Array.from(companyCounts.entries())
    .sort((a, b) => {
      const tierDiff = getCompanyTier(a[0]) - getCompanyTier(b[0]);
      if (tierDiff !== 0) return tierDiff;
      return b[1] - a[1];
    })
    .slice(0, limit)
    .map(([slug, count]) => ({
      slug,
      name: formatDisplayName(slug),
      count,
    }));
}

function calculateRelatedTopics(
  questions: QuestionWithDetails[],
  targetTopic: string,
  limit: number
): string[] {
  const cooccurrence = new Map<string, number>();
  const targetLower = targetTopic.toLowerCase();

  for (const q of questions) {
    const hasTarget = q.topics.some((t) => t.toLowerCase() === targetLower);
    if (hasTarget) {
      for (const topic of q.topics) {
        if (topic.toLowerCase() !== targetLower) {
          const count = cooccurrence.get(topic) || 0;
          cooccurrence.set(topic, count + 1);
        }
      }
    }
  }

  return Array.from(cooccurrence.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([topic]) => topic.toLowerCase().replace(/\s+/g, "-"));
}

function findRelatedQuestions(
  questions: QuestionWithDetails[],
  target: QuestionWithDetails,
  limit: number
): string[] {
  const scores = new Map<string, number>();

  for (const q of questions) {
    if (q.slug === target.slug) continue;

    let score = 0;
    // Same difficulty
    if (q.difficulty === target.difficulty) score += 1;
    // Topic overlap
    const overlap = q.topics.filter((t) =>
      target.topics.some((tt) => tt.toLowerCase() === t.toLowerCase())
    ).length;
    score += overlap * 2;

    if (score > 0) {
      scores.set(q.slug, score);
    }
  }

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);
}

function generateQuestionDescription(
  q: QuestionWithDetails,
  companies: CompanyFrequency[]
): string {
  const companyNames = companies.slice(0, 3).map((c) => c.displayName);
  const topicsText = q.topics.slice(0, 3).join(", ");

  return (
    `${q.title} is a ${q.difficulty} difficulty problem with ${q.acceptance_rate}% acceptance rate. ` +
    `Asked by ${companyNames.join(", ")}${companies.length > 3 ? ` and ${companies.length - 3} more companies` : ""}. ` +
    `Topics: ${topicsText}.`
  );
}

// ============================================================
// Public API
// ============================================================

export async function getAggregatedCompanies(): Promise<Map<string, Company>> {
  const cache = await getBuildCache();
  return cache.companies;
}

export async function getAggregatedTopics(): Promise<Map<string, Topic>> {
  const cache = await getBuildCache();
  return cache.topics;
}

export async function getUniqueQuestions(): Promise<Map<string, UniqueQuestion>> {
  const cache = await getBuildCache();
  return cache.questions;
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const cache = await getBuildCache();
  return cache.companies.get(slug) || null;
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const cache = await getBuildCache();
  return cache.topics.get(slug) || null;
}

export async function getQuestionBySlug(slug: string): Promise<UniqueQuestion | null> {
  const cache = await getBuildCache();
  return cache.questions.get(slug) || null;
}

export async function getQuestionsByCompany(
  companySlug: string
): Promise<QuestionWithCompanyContext[]> {
  const cache = await getBuildCache();
  return cache.companyQuestions.get(companySlug) || [];
}

export async function getQuestionsByTopic(
  topicSlug: string
): Promise<QuestionWithCompanyContext[]> {
  const cache = await getBuildCache();
  return cache.topicQuestions.get(topicSlug) || [];
}

export async function getQuestionsByCompanyAndTopic(
  companySlug: string,
  topicSlug: string
): Promise<QuestionWithCompanyContext[]> {
  const cache = await getBuildCache();
  const companyQuestions = cache.companyQuestions.get(companySlug) || [];

  return companyQuestions.filter((q) =>
    q.topics.some((t) => t.toLowerCase().replace(/\s+/g, "-") === topicSlug)
  );
}

export async function getCompanyTopicCrossRefs(
  companySlug: string
): Promise<CompanyTopicCrossRef[]> {
  const cache = await getBuildCache();
  return cache.crossRefs.companyTopics.get(companySlug) || [];
}

export async function getTopicCompanyCrossRefs(topicSlug: string): Promise<CompanyTopicCrossRef[]> {
  const cache = await getBuildCache();
  return cache.crossRefs.topicCompanies.get(topicSlug) || [];
}

export async function getQuestionCompanies(questionSlug: string): Promise<string[]> {
  const cache = await getBuildCache();
  return cache.crossRefs.questionCompanies.get(questionSlug) || [];
}

export async function getTopCrossReferences(limit: number): Promise<CompanyTopicCrossRef[]> {
  const cache = await getBuildCache();
  const allCrossRefs: CompanyTopicCrossRef[] = [];

  for (const refs of cache.crossRefs.companyTopics.values()) {
    allCrossRefs.push(...refs);
  }

  return allCrossRefs
    .filter((ref) => ref.questionCount >= 3)
    .sort((a, b) => {
      // Prioritize tier 1 companies
      const tierDiff = getCompanyTier(a.companySlug) - getCompanyTier(b.companySlug);
      if (tierDiff !== 0) return tierDiff;
      return b.questionCount - a.questionCount;
    })
    .slice(0, limit);
}

export async function getQuestionsByDifficulty(
  difficulty: Difficulty
): Promise<QuestionWithCompanyContext[]> {
  const cache = await getBuildCache();
  const results: QuestionWithCompanyContext[] = [];
  const seen = new Set<string>();

  for (const questions of cache.companyQuestions.values()) {
    for (const q of questions) {
      if (q.difficulty === difficulty && !seen.has(q.slug)) {
        seen.add(q.slug);
        results.push(q);
      }
    }
  }

  return results.sort((a, b) => b.frequency - a.frequency);
}

export async function getStats(): Promise<BuildCache["stats"]> {
  const cache = await getBuildCache();
  return cache.stats;
}
