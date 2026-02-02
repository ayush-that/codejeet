/**
 * Dynamic Sitemap Generation
 * Generates sitemap for all SEO pages
 */

import { MetadataRoute } from "next";
import {
  seoConfig,
  getAggregatedCompanies,
  getAggregatedTopics,
  getUniqueQuestions,
  getTopCrossReferences,
} from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl;
  const now = new Date();

  // Fetch all aggregated data
  const [companies, topics, questions, crossRefs] = await Promise.all([
    getAggregatedCompanies(),
    getAggregatedTopics(),
    getUniqueQuestions(),
    getTopCrossReferences(1000),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // ============================================================
  // Static Pages (Highest Priority)
  // ============================================================

  entries.push(
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/problems`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/system-design`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }
  );

  // ============================================================
  // Difficulty Pages
  // ============================================================

  const difficulties = ["easy", "medium", "hard"] as const;
  for (const difficulty of difficulties) {
    entries.push({
      url: `${baseUrl}/difficulty/${difficulty}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // ============================================================
  // Company Pages (269 companies)
  // ============================================================

  for (const company of companies.values()) {
    entries.push({
      url: `${baseUrl}/company/${company.slug}`,
      lastModified: company.lastUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // ============================================================
  // Topic Pages (~50 topics)
  // ============================================================

  for (const topic of topics.values()) {
    entries.push({
      url: `${baseUrl}/topic/${topic.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // ============================================================
  // Problem Pages (~3000 unique questions)
  // ============================================================

  for (const question of questions.values()) {
    entries.push({
      url: `${baseUrl}/problem/${question.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // ============================================================
  // Cross-Reference Pages (company + topic combinations)
  // Only include pages with sufficient content
  // ============================================================

  for (const crossRef of crossRefs) {
    if (crossRef.questionCount >= seoConfig.thinContentThresholds.companyTopic) {
      entries.push({
        url: `${baseUrl}/company/${crossRef.companySlug}/${crossRef.topicSlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
