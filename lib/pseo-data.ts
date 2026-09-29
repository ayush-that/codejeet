import fs from "fs/promises";
import path from "path";

// Use explicit path segments so Turbopack doesn't over-bundle
const DATA_DIR = path.join(process.cwd(), "public", "data");
const PROBLEMS_DIR = path.join(DATA_DIR, "problems");

// In-memory cache to avoid re-parsing large JSON files per process
const cache = new Map<string, unknown>();

// A read that reached the binding but could not be completed. Distinct from a
// missing file, which is a normal miss the callers below turn into a 404.
class AssetReadError extends Error {}

// `public/` is not in the worker bundle: on Cloudflare Workers it is served
// through the ASSETS binding, so `fs` cannot see it at request time. Only routes
// that render on demand need this, e.g. /company/[slug]/[filter], whose
// generateStaticParams returns []. Imported lazily so dev, build and tests skip it.
async function assetsBinding() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    return getCloudflareContext().env?.ASSETS ?? null;
  } catch {
    // No worker context (dev, tests, static generation).
    return null;
  }
}

// null means "not there". A read that fails for any other reason throws, so a
// broken or unreachable asset never masquerades as a missing file.
async function readFromAssets<T>(filePath: string): Promise<T | null> {
  const assets = await assetsBinding();
  if (!assets) return null;

  const relative = path
    .relative(DATA_DIR, filePath)
    .split(path.sep)
    .map(encodeURIComponent)
    .join("/");

  try {
    const response = await assets.fetch(new URL(`/data/${relative}`, "https://assets.local"));
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as T;
  } catch (cause) {
    throw new AssetReadError(`ASSETS read of ${relative} failed`, { cause });
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  const cached = cache.get(filePath);
  if (cached) return cached as T;

  let data: T;
  try {
    data = JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch (error) {
    // No copy on the binding either, so the file is genuinely missing. Rethrow
    // the filesystem error: getProblem / getComparisonPair rely on it to 404,
    // and it stays the miss signal in the worker, where fs fails for every path.
    const fromAssets = await readFromAssets<T>(filePath);
    if (fromAssets === null) throw error;
    data = fromAssets;
  }

  cache.set(filePath, data);
  return data;
}

// === Questions (full list, runtime-safe via ASSETS) ===

export async function getQuestionsData(): Promise<{
  questions: Record<string, unknown>[];
  companies: string[];
  topics: string[];
}> {
  return readJson(path.join(DATA_DIR, "questions.json"));
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
    return await readJson<ScrapedProblem>(path.join(PROBLEMS_DIR, `${slug}.json`));
  } catch (error) {
    // A missing problem is a normal 404. A read that reached the binding and
    // failed is not a miss, so let it surface instead of serving "Not Found".
    if (error instanceof AssetReadError) throw error;
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

export async function getFilterTypeLookup(): Promise<Record<string, "topic" | "difficulty">> {
  return readJson(path.join(DATA_DIR, "filter-type-lookup.json"));
}

export interface CompareQuestion {
  slug: string;
  title: string;
  difficulty: string;
  topics: string[];
}

interface CompareTopicStat {
  name: string;
  slug: string;
  count: number;
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
  uniqueToACount: number;
  uniqueToBCount: number;
  sharedProblems: CompareQuestion[];
  exclusiveToA: CompareQuestion[];
  exclusiveToB: CompareQuestion[];
  topSharedTopics: CompareTopicStat[];
  blogSlug?: string;
}

export interface ComparisonIndexEntry {
  pair: string;
  companyA: { slug: string; displayName: string; questionCount: number };
  companyB: { slug: string; displayName: string; questionCount: number };
  sharedCount: number;
  uniqueToACount: number;
  uniqueToBCount: number;
}

export async function getComparisonIndex(): Promise<ComparisonIndexEntry[]> {
  return readJson(path.join(DATA_DIR, "comparison-index.json"));
}

export async function getComparisonPair(pair: string): Promise<ComparisonPair | null> {
  try {
    return await readJson<ComparisonPair>(path.join(DATA_DIR, "compare", `${pair}.json`));
  } catch (error) {
    if (error instanceof AssetReadError) throw error;
    return null;
  }
}

// === Sitemap ===
