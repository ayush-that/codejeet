import fs from "fs/promises";
import path from "path";

// Use explicit path segments so Turbopack doesn't over-bundle
const DATA_DIR = path.join(process.cwd(), "public", "data");
const PROBLEMS_DIR = path.join(DATA_DIR, "problems");

// In-memory cache to avoid re-parsing large JSON files per worker
const cache = new Map<string, unknown>();

async function readJson<T>(filePath: string): Promise<T> {
  const cached = cache.get(filePath);
  if (cached) return cached as T;
  const data = JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  cache.set(filePath, data);
  return data;
}

// === Company Profiles ===

export interface CompanyProfile {
  slug: string;
  displayName: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
  topTopics: { name: string; slug: string; count: number }[];
  questions: {
    slug: string;
    title: string;
    difficulty: string;
    acceptance: string;
    frequency: string;
    topics: string[];
  }[];
}

export async function getAllCompanyProfiles(): Promise<Record<string, CompanyProfile>> {
  return readJson(path.join(DATA_DIR, "company-profiles.json"));
}

export async function getCompanyProfile(slug: string): Promise<CompanyProfile | null> {
  const profiles = await getAllCompanyProfiles();
  return profiles[slug] ?? null;
}

// === Problem Data ===

export interface ScrapedProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  content_html: string;
  content_markdown: string;
  question: string;
  examples: string;
  constraints: string;
  topics: string[];
  total_accepted: number;
  total_submissions: number;
  acceptance_rate: string;
  similar_questions: { title: string; slug: string; difficulty: string; url: string }[];
  hints: string[];
}

export async function getProblem(slug: string): Promise<ScrapedProblem | null> {
  try {
    const filePath = path.join(PROBLEMS_DIR, `${slug}.json`);
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as ScrapedProblem;
  } catch {
    return null;
  }
}

export async function getProblemSlugs(): Promise<string[]> {
  return readJson(path.join(DATA_DIR, "problem-slugs.json"));
}

export async function getProblemCompanies(): Promise<Record<string, string[]>> {
  return readJson(path.join(DATA_DIR, "problem-companies.json"));
}

// === Topic Profiles ===

export interface TopicProfile {
  name: string;
  slug: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
  topCompanies: { name: string; slug: string; count: number }[];
  questionSlugs: string[];
}

export async function getAllTopicProfiles(): Promise<Record<string, TopicProfile>> {
  return readJson(path.join(DATA_DIR, "topic-profiles.json"));
}

export async function getTopicProfile(slug: string): Promise<TopicProfile | null> {
  const profiles = await getAllTopicProfiles();
  return profiles[slug] ?? null;
}

// === Cross-Product Data ===

export interface CompanyFilterParam {
  slug: string;
  filter: string;
  type: "topic" | "difficulty" | "problem";
}

export async function getCompanyFilterParams(): Promise<CompanyFilterParam[]> {
  return readJson(path.join(DATA_DIR, "company-filter-params.json"));
}

export async function getFilterTypeLookup(): Promise<Record<string, "topic" | "difficulty">> {
  return readJson(path.join(DATA_DIR, "filter-type-lookup.json"));
}

export interface ComparisonPair {
  pair: string;
  companyA: {
    slug: string;
    displayName: string;
    questionCount: number;
    difficultyDist: { easy: number; medium: number; hard: number };
  };
  companyB: {
    slug: string;
    displayName: string;
    questionCount: number;
    difficultyDist: { easy: number; medium: number; hard: number };
  };
  sharedCount: number;
  sharedSlugs: string[];
}

export async function getAllComparisonPairs(): Promise<Record<string, ComparisonPair>> {
  return readJson(path.join(DATA_DIR, "comparison-pairs.json"));
}

export async function getComparisonPair(pair: string): Promise<ComparisonPair | null> {
  const pairs = await getAllComparisonPairs();
  return pairs[pair] ?? null;
}

// === Sitemap ===

export interface SitemapUrl {
  path: string;
  priority: number;
  changeFrequency: string;
}

export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  return readJson(path.join(DATA_DIR, "sitemap-urls.json"));
}
