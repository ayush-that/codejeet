import {
  DIFFICULTIES,
  formatPercent,
  problemPath,
  type DashboardPayload,
  type Difficulty,
  type EncodedLink,
  type EncodedProblem,
} from "./schema";

// The parsed payload plus the lookups the table needs on every filter pass.
// Built once after fetch so no per-keystroke lowercasing or string splitting
// happens over 15k rows.
export interface DashboardIndex {
  topics: string[];
  topicsLower: string[];
  /** URL-safe company slugs (stable keys). */
  companies: string[];
  /** Brand-cased display names baked at build time. */
  companyNames: string[];
  companyCounts: number[];
  problems: EncodedProblem[];
  links: EncodedLink[];
  titleLower: string[];
  /** Search haystack: slug + display name, lowercased once. */
  companyLower: string[];
  topicSets: Set<number>[];
}

export function decodeDashboardPayload(payload: DashboardPayload): DashboardIndex {
  const companies = payload.companies.map(([slug]) => slug);
  const companyNames = payload.companies.map(([, , displayName]) => displayName);

  return {
    topics: payload.topics,
    topicsLower: payload.topics.map((topic) => topic.toLowerCase()),
    companies,
    companyNames,
    companyCounts: payload.companies.map(([, count]) => count),
    problems: payload.problems,
    links: payload.links,
    titleLower: payload.problems.map(([, title]) => title.toLowerCase()),
    companyLower: payload.companies.map(
      ([slug, , displayName]) => `${slug} ${displayName}`.toLowerCase()
    ),
    topicSets: payload.problems.map(([, , , , , topics]) => new Set(topics)),
  };
}

// Only the visible page of rows is materialised into this shape.
export interface DisplayRow {
  key: string;
  slug: string;
  title: string;
  path: string;
  difficulty: Difficulty;
  /** Brand-cased company label (not the slug). */
  company: string;
  acceptance: string;
  frequency: string;
  topics: string[];
  premium: boolean;
}

export function toDisplayRow(index: DashboardIndex, linkIndex: number): DisplayRow {
  const [problem, company, frequency] = index.links[linkIndex];
  const [slug, title, difficulty, acceptance, premium, topics] = index.problems[problem];

  return {
    key: String(linkIndex),
    slug,
    title,
    path: problemPath(slug),
    difficulty: DIFFICULTIES[difficulty],
    company: index.companyNames[company],
    acceptance: formatPercent(acceptance),
    frequency: formatPercent(frequency),
    topics: topics.map((topic) => index.topics[topic]),
    premium: premium === 1,
  };
}
