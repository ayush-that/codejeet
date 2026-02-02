/**
 * Internal Linking System
 * Generates intelligent internal links for PageRank distribution and UX
 */

import { seoConfig, getCanonicalUrl, getCompanyTier } from "./config";
import type {
  Company,
  Topic,
  UniqueQuestion,
  InternalLink,
  PageType,
  CompanyTopicCrossRef,
} from "./types";

// ============================================================
// Related Companies
// ============================================================

/**
 * Get related companies based on topic overlap and tier
 */
export function getRelatedCompanies(
  currentCompany: Company,
  allCompanies: Map<string, Company>,
  limit: number = 6
): InternalLink[] {
  const currentTopics = new Set(currentCompany.topTopics.map((t) => t.slug));
  const currentTier = getCompanyTier(currentCompany.slug);

  const scored: Array<{ company: Company; score: number }> = [];

  for (const company of allCompanies.values()) {
    if (company.slug === currentCompany.slug) continue;

    let score = 0;

    // Topic overlap (primary factor)
    const topicOverlap = company.topTopics.filter((t) => currentTopics.has(t.slug)).length;
    score += topicOverlap * 10;

    // Same tier bonus
    const companyTier = getCompanyTier(company.slug);
    if (companyTier === currentTier) score += 5;
    if (companyTier < currentTier) score += 3; // Slightly prefer higher-tier companies

    // Similar size bonus
    const sizeDiff = Math.abs(company.questionCount - currentCompany.questionCount);
    if (sizeDiff < 50) score += 3;
    if (sizeDiff < 100) score += 1;

    if (score > 0) {
      scored.push({ company, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ company }) => ({
      href: getCanonicalUrl("company", { slug: company.slug }),
      text: company.displayName,
      title: `${company.displayName} Interview Questions (${company.questionCount} problems)`,
      priority: getCompanyTier(company.slug) === 1 ? 1 : 0.8,
    }));
}

// ============================================================
// Related Topics
// ============================================================

/**
 * Get related topics based on co-occurrence and popularity
 */
export function getRelatedTopics(
  currentTopic: Topic,
  allTopics: Map<string, Topic>,
  limit: number = 6
): InternalLink[] {
  const relatedSlugs = new Set(currentTopic.relatedTopics);

  const links: InternalLink[] = [];

  // First, add explicitly related topics
  for (const slug of relatedSlugs) {
    const topic = allTopics.get(slug);
    if (topic) {
      links.push({
        href: getCanonicalUrl("topic", { slug: topic.slug }),
        text: topic.name,
        title: `${topic.name} Problems (${topic.questionCount} questions)`,
        priority: 1,
      });
    }
  }

  // Then add popular topics if needed
  if (links.length < limit) {
    const popular = Array.from(allTopics.values())
      .filter((t) => t.slug !== currentTopic.slug && !relatedSlugs.has(t.slug))
      .sort((a, b) => b.questionCount - a.questionCount)
      .slice(0, limit - links.length);

    for (const topic of popular) {
      links.push({
        href: getCanonicalUrl("topic", { slug: topic.slug }),
        text: topic.name,
        title: `${topic.name} Problems (${topic.questionCount} questions)`,
        priority: 0.7,
      });
    }
  }

  return links.slice(0, limit);
}

// ============================================================
// Related Problems
// ============================================================

/**
 * Get related problems based on topic overlap and difficulty
 */
export function getRelatedProblems(
  currentQuestion: UniqueQuestion,
  allQuestions: Map<string, UniqueQuestion>,
  limit: number = 6
): InternalLink[] {
  const currentTopics = new Set(currentQuestion.topics.map((t) => t.toLowerCase()));
  const relatedSlugs = new Set(currentQuestion.relatedQuestions);

  const links: InternalLink[] = [];

  // First, add explicitly related questions
  for (const slug of relatedSlugs) {
    const question = allQuestions.get(slug);
    if (question) {
      links.push({
        href: getCanonicalUrl("problem", { slug: question.slug }),
        text: question.title,
        title: `${question.title} - ${question.difficulty}`,
        priority: 1,
      });
    }
  }

  // Then add questions with topic overlap
  if (links.length < limit) {
    const scored: Array<{ question: UniqueQuestion; score: number }> = [];

    for (const question of allQuestions.values()) {
      if (question.slug === currentQuestion.slug || relatedSlugs.has(question.slug)) continue;

      let score = 0;

      // Topic overlap
      const topicOverlap = question.topics.filter((t) => currentTopics.has(t.toLowerCase())).length;
      score += topicOverlap * 5;

      // Same difficulty bonus
      if (question.difficulty === currentQuestion.difficulty) score += 2;

      // Popularity (number of companies asking)
      score += Math.min(question.companies.length, 5);

      if (score > 0) {
        scored.push({ question, score });
      }
    }

    const additional = scored.sort((a, b) => b.score - a.score).slice(0, limit - links.length);

    for (const { question } of additional) {
      links.push({
        href: getCanonicalUrl("problem", { slug: question.slug }),
        text: question.title,
        title: `${question.title} - ${question.difficulty}`,
        priority: 0.8,
      });
    }
  }

  return links.slice(0, limit);
}

// ============================================================
// Hub Page Links
// ============================================================

/**
 * Get links to hub pages (always include for PageRank)
 */
export function getHubLinks(): InternalLink[] {
  return [
    {
      href: getCanonicalUrl("companies"),
      text: "All Companies",
      title: "Browse all company interview questions",
      priority: 1,
    },
    {
      href: getCanonicalUrl("topics"),
      text: "All Topics",
      title: "Browse all DSA topics",
      priority: 1,
    },
    {
      href: getCanonicalUrl("problems"),
      text: "All Problems",
      title: "Browse all LeetCode problems",
      priority: 1,
    },
    {
      href: `${seoConfig.siteUrl}/system-design`,
      text: "System Design",
      title: "System Design Interview Guide",
      priority: 1,
    },
  ];
}

// ============================================================
// Cross-Reference Links
// ============================================================

/**
 * Get company-topic cross-reference links
 */
export function getCompanyTopicLinks(
  crossRefs: CompanyTopicCrossRef[],
  limit: number = 6
): InternalLink[] {
  return crossRefs
    .filter((ref) => ref.questionCount >= seoConfig.thinContentThresholds.companyTopic)
    .slice(0, limit)
    .map((ref) => ({
      href: getCanonicalUrl("companyTopic", {
        company: ref.companySlug,
        topic: ref.topicSlug,
      }),
      text: `${ref.companyName} ${ref.topicName}`,
      title: `${ref.questionCount} ${ref.topicName} questions at ${ref.companyName}`,
      priority: 0.7,
    }));
}

// ============================================================
// Page-Specific Link Generation
// ============================================================

/**
 * Generate all internal links for a company page
 */
export function generateCompanyPageLinks(
  company: Company,
  allCompanies: Map<string, Company>,
  crossRefs: CompanyTopicCrossRef[]
): {
  relatedCompanies: InternalLink[];
  topicLinks: InternalLink[];
  hubLinks: InternalLink[];
} {
  return {
    relatedCompanies: getRelatedCompanies(company, allCompanies, 6),
    topicLinks: getCompanyTopicLinks(crossRefs, 8),
    hubLinks: getHubLinks().filter((l) => !l.href.includes("/companies")),
  };
}

/**
 * Generate all internal links for a topic page
 */
export function generateTopicPageLinks(
  topic: Topic,
  allTopics: Map<string, Topic>,
  crossRefs: CompanyTopicCrossRef[]
): {
  relatedTopics: InternalLink[];
  companyLinks: InternalLink[];
  hubLinks: InternalLink[];
} {
  const companyLinks = crossRefs.slice(0, 6).map((ref) => ({
    href: getCanonicalUrl("companyTopic", {
      company: ref.companySlug,
      topic: ref.topicSlug,
    }),
    text: `${ref.companyName}`,
    title: `${ref.questionCount} ${topic.name} questions at ${ref.companyName}`,
    priority: getCompanyTier(ref.companySlug) === 1 ? 1 : 0.8,
  }));

  return {
    relatedTopics: getRelatedTopics(topic, allTopics, 6),
    companyLinks,
    hubLinks: getHubLinks().filter((l) => !l.href.includes("/topics")),
  };
}

/**
 * Generate all internal links for a problem page
 */
export function generateProblemPageLinks(
  question: UniqueQuestion,
  allQuestions: Map<string, UniqueQuestion>,
  allCompanies: Map<string, Company>,
  allTopics: Map<string, Topic>
): {
  relatedProblems: InternalLink[];
  companyLinks: InternalLink[];
  topicLinks: InternalLink[];
  hubLinks: InternalLink[];
} {
  const companyLinks = question.companies.slice(0, 5).map((cf) => {
    const company = allCompanies.get(cf.company);
    return {
      href: getCanonicalUrl("company", { slug: cf.company }),
      text: cf.displayName,
      title: company
        ? `${cf.displayName} Interview Questions (${company.questionCount} problems)`
        : `${cf.displayName} Interview Questions`,
      priority: getCompanyTier(cf.company) === 1 ? 1 : 0.8,
    };
  });

  const topicLinks = question.topics.slice(0, 5).map((topicName) => {
    const slug = topicName.toLowerCase().replace(/\s+/g, "-");
    const topic = allTopics.get(slug);
    return {
      href: getCanonicalUrl("topic", { slug }),
      text: topicName,
      title: topic
        ? `${topicName} Problems (${topic.questionCount} questions)`
        : `${topicName} Problems`,
      priority: 0.8,
    };
  });

  return {
    relatedProblems: getRelatedProblems(question, allQuestions, 6),
    companyLinks,
    topicLinks,
    hubLinks: getHubLinks().filter((l) => !l.href.includes("/problems")),
  };
}

// ============================================================
// Contextual Link Suggestions
// ============================================================

/**
 * Get contextual link suggestions based on page type
 */
export function getContextualLinks(pageType: PageType, limit: number = 5): InternalLink[] {
  const allLinks: InternalLink[] = [];

  switch (pageType) {
    case "home":
      allLinks.push(
        {
          href: getCanonicalUrl("companies"),
          text: "Browse Companies",
          title: "View all company interview questions",
          priority: 1,
        },
        {
          href: getCanonicalUrl("topics"),
          text: "Explore Topics",
          title: "Browse by algorithm and data structure",
          priority: 1,
        },
        {
          href: `${seoConfig.siteUrl}/system-design`,
          text: "System Design Guide",
          title: "Comprehensive system design interview preparation",
          priority: 1,
        }
      );
      break;

    case "companies":
      allLinks.push(
        {
          href: getCanonicalUrl("topics"),
          text: "Browse by Topic",
          title: "View questions by topic instead",
          priority: 0.9,
        },
        {
          href: getCanonicalUrl("problems"),
          text: "All Problems",
          title: "View all coding problems",
          priority: 0.9,
        }
      );
      break;

    case "topics":
      allLinks.push(
        {
          href: getCanonicalUrl("companies"),
          text: "Browse by Company",
          title: "View questions by company instead",
          priority: 0.9,
        },
        {
          href: getCanonicalUrl("problems"),
          text: "All Problems",
          title: "View all coding problems",
          priority: 0.9,
        }
      );
      break;

    default:
      allLinks.push(...getHubLinks());
  }

  return allLinks.slice(0, limit);
}
