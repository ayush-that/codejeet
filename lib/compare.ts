/** Minimum shared questions for a comparison page to be indexable. */
export const MIN_COMPARE_SHARED = 3;

export type CompareQuestion = {
  slug: string;
  title: string;
  difficulty: string;
  topics: string[];
};

export type CompareTopicStat = {
  name: string;
  slug: string;
  count: number;
};

/** Canonical pair slug: alphabetically ordered `a-vs-b`. */
export function comparePairSlug(companyA: string, companyB: string): string {
  const [first, second] = companyA < companyB ? [companyA, companyB] : [companyB, companyA];
  return `${first}-vs-${second}`;
}

export function parseComparePair(pair: string): { companyA: string; companyB: string } | null {
  const idx = pair.indexOf("-vs-");
  if (idx <= 0 || idx === pair.length - 4) return null;
  return { companyA: pair.slice(0, idx), companyB: pair.slice(idx + 4) };
}

/** Map a blog comparison slug to the canonical `/compare/{pair}` slug, if applicable. */
export function comparePairFromBlogSlug(blogSlug: string): string | null {
  const suffix = "-interview-comparison";
  if (!blogSlug.endsWith(suffix)) return null;

  const core = blogSlug.slice(0, -suffix.length);
  const idx = core.indexOf("-vs-");
  if (idx <= 0 || idx === core.length - 4) return null;

  const left = core.slice(0, idx);
  const right = core.slice(idx + 4);
  if (!left || !right) return null;

  return comparePairSlug(left, right);
}

export function isCompareIndexable(sharedCount: number): boolean {
  return sharedCount >= MIN_COMPARE_SHARED;
}

export function compareBlogSlug(pair: string): string {
  return `${pair}-interview-comparison`;
}
