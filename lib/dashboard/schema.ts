// Compact wire format for the dashboard question table. Every field the table
// renders is derivable from this payload, so the fat questions.json never
// reaches the browser.

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

// Bit order is load-bearing: timeframe masks are stored on disk.
export const TIMEFRAMES = ["all", "30_days", "3_months", "6_months", "more_than_6m"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const LEETCODE_BASE_URL = "https://leetcode.com";

export type EncodedProblem = [
  slug: string,
  title: string,
  difficulty: number,
  acceptance: number | null,
  premium: 0 | 1,
  topics: number[],
];

export type EncodedLink = [
  problem: number,
  company: number,
  frequency: number,
  timeframeMask: number,
];

// displayName is baked at build time (brand casing: JPMorgan, GitHub, AT&T).
// UI never re-capitalizes slugs at runtime.
export type EncodedCompany = [slug: string, count: number, displayName: string];

export interface DashboardPayload {
  v: 2;
  topics: string[];
  companies: EncodedCompany[];
  problems: EncodedProblem[];
  links: EncodedLink[];
}

export function maskFromTimeframes(timeframes: readonly string[]): number {
  let mask = 0;
  for (const timeframe of timeframes) {
    const bit = TIMEFRAMES.indexOf(timeframe as Timeframe);
    if (bit >= 0) mask |= 1 << bit;
  }
  return mask;
}

export function maskHasTimeframe(mask: number, timeframe: Timeframe): boolean {
  const bit = TIMEFRAMES.indexOf(timeframe);
  return bit >= 0 && (mask & (1 << bit)) !== 0;
}

export function timeframesFromMask(mask: number): Timeframe[] {
  return TIMEFRAMES.filter((_, bit) => (mask & (1 << bit)) !== 0);
}

// Percentages are stored as the number behind their one-decimal display string,
// so toFixed(1) returns the original string byte for byte. An unknown
// acceptance is null and renders as a blank cell, never as "0.0%".
export function formatPercent(value: number | null): string {
  return value === null ? "" : `${value.toFixed(1)}%`;
}

export function problemPath(slug: string): string {
  return `/problems/${slug}`;
}

export function problemUrl(slug: string): string {
  return `${LEETCODE_BASE_URL}${problemPath(slug)}`;
}
