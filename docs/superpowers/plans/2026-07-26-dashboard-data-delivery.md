# Dashboard Data Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the `/dashboard` payload from 1.02 MB gzip to about 155 KB by re-encoding the question data losslessly, make the localStorage cache actually work, and fix six related defects.

**Architecture:** A new compact build artifact `public/data/dashboard.json` replaces `questions.json` **for the client only**. Pure encode, decode, and query modules live under `lib/dashboard/` so the logic is unit-testable with `node:test`. `questions.json` stays byte-identical, so the server-rendered pSEO pages are untouched. A prebuild verification script asserts the compact form rehydrates to exactly the current rows, or the build fails.

**Tech Stack:** TypeScript, Next.js 16 App Router, React 19, `tsx --test` with `node:test` and `node:assert/strict`, deployed to Cloudflare Workers via OpenNext.

**Spec:** `docs/superpowers/specs/2026-07-26-dashboard-data-delivery-design.md`

## Global Constraints

- Package manager is **bun** for this project. Use `bun run <script>` and `bunx <bin>`.
- **Commit messages:** plain description, no Conventional Commits prefix (no `feat:`, `fix:`, `refactor:`). Single subject line, exactly one `-m`, no body. No AI or tool attribution of any kind.
- **No em dashes** in any comment, doc, or user-facing string.
- `public/data/` is gitignored and generated. Never commit generated JSON.
- Do **not** modify `public/data/questions.json` or its shape. `lib/pseo-data.ts`, `app/difficulty/[level]/page.tsx`, and `app/topic/[slug]/page.tsx` depend on it.
- Do **not** run `wrangler types`. It globally overrides DOM types and breaks client code.
- Formatting is `oxfmt` (double quotes, semicolons, 100 char width). Husky runs it on commit.
- Timeframe bit order is fixed and load-bearing: `["all", "30_days", "3_months", "6_months", "more_than_6m"]`.
- Difficulty index order is fixed and load-bearing: `["Easy", "Medium", "Hard"]`.
- Percentages encode as `parseFloat` of the display string (always one decimal), never the raw float and never rounded to an integer.

---

## File Structure

**Create:**
- `lib/dashboard/schema.ts` — payload types, fixed orderings, and the pure format helpers shared by encode, decode, and verify. No I/O.
- `lib/dashboard/encode.ts` — `encodeDashboardData(questions)`. Build-time only.
- `lib/dashboard/decode.ts` — `decodeDashboardPayload(payload)` and `toDisplayRow(index, i)`. Client-side only.
- `lib/dashboard/query.ts` — `filterLinks`, `sortLinks`, `computeStats`. Pure. This is the logic lifted out of the component so it can be tested.
- `scripts/verify-dashboard-data.ts` — asserts `dashboard.json` rehydrates to `questions.json`.
- `tests/dashboard-encode.test.ts`, `tests/dashboard-decode.test.ts`, `tests/dashboard-query.test.ts`

**Modify:**
- `scripts/build-data.ts` — write `dashboard.json` alongside the existing outputs.
- `package.json` — add `verify-dashboard-data.ts` to the `prebuild` chain.
- `lib/cache-version.ts` — bump to `v5`.
- `lib/dashboard-store.ts` — fetch the new file, add timeout, error, and retry, evict stale cache keys.
- `components/LeetCodeDashboard.tsx` — consume the index, use `lib/dashboard/query.ts`, add the error card, default sort by frequency.
- `app/dashboard/page.client.tsx` — pass the new store shape through.

---

### Task 1: Schema and encoder

**Files:**
- Create: `lib/dashboard/schema.ts`
- Create: `lib/dashboard/encode.ts`
- Test: `tests/dashboard-encode.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `DIFFICULTIES`, `TIMEFRAMES`, `LEETCODE_BASE_URL`, types `Difficulty`, `Timeframe`, `EncodedProblem`, `EncodedLink`, `EncodedCompany`, `DashboardPayload`; functions `maskFromTimeframes(readonly string[]): number`, `maskHasTimeframe(number, Timeframe): boolean`, `timeframesFromMask(number): Timeframe[]`, `formatPercent(number | null): string`, `problemPath(string): string`, `problemUrl(string): string`; and `encodeDashboardData(readonly SourceQuestion[]): DashboardPayload` plus the `SourceQuestion` interface.

- [ ] **Step 1: Write the failing test**

Create `tests/dashboard-encode.test.ts`:

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { encodeDashboardData, type SourceQuestion } from "../lib/dashboard/encode";
import { formatPercent, timeframesFromMask } from "../lib/dashboard/schema";

function q(overrides: Partial<SourceQuestion> = {}): SourceQuestion {
  return {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    company: "google",
    topics: ["Array", "Hash Table"],
    Topics: "Array, Hash Table",
    "Acceptance %": "54.3%",
    "Frequency %": "100.0%",
    "Is Premium": "N",
    timeframes: ["all", "30_days"],
    ...overrides,
  };
}

describe("encodeDashboardData", () => {
  it("emits sorted topics and companies with counts", () => {
    const payload = encodeDashboardData([
      q(),
      q({ company: "amazon", slug: "three-sum", title: "3Sum", topics: ["Two Pointers"], Topics: "Two Pointers" }),
      q({ company: "amazon" }),
    ]);

    assert.deepEqual(payload.topics, ["Array", "Hash Table", "Two Pointers"]);
    assert.deepEqual(payload.companies, [
      ["amazon", 2],
      ["google", 1],
    ]);
    assert.equal(payload.v, 1);
  });

  it("stores each problem once and links every row", () => {
    const payload = encodeDashboardData([q(), q({ company: "amazon" }), q({ company: "meta" })]);

    assert.equal(payload.problems.length, 1);
    assert.equal(payload.links.length, 3);
    assert.deepEqual(
      payload.links.map((l) => l[0]),
      [0, 0, 0]
    );
  });

  it("keeps disagreeing rows for the same slug as separate problems", () => {
    const payload = encodeDashboardData([
      q(),
      q({ company: "amazon", topics: ["Array"], Topics: "Array" }),
    ]);

    assert.equal(payload.problems.length, 2);
    assert.deepEqual(payload.problems[0][5], [0, 1]);
    assert.deepEqual(payload.problems[1][5], [0]);
  });

  it("encodes an unknown acceptance as null, not zero", () => {
    const payload = encodeDashboardData([q({ "Acceptance %": "" })]);

    assert.equal(payload.problems[0][3], null);
    assert.equal(formatPercent(payload.problems[0][3]), "");
  });

  it("round-trips percentages through their display strings", () => {
    const payload = encodeDashboardData([q({ "Acceptance %": "54.3%", "Frequency %": "7.5%" })]);

    assert.equal(formatPercent(payload.problems[0][3]), "54.3%");
    assert.equal(formatPercent(payload.links[0][2]), "7.5%");
  });

  it("encodes difficulty, premium, and timeframes", () => {
    const payload = encodeDashboardData([
      q({ difficulty: "Hard", "Is Premium": "Y", timeframes: ["3_months", "all"] }),
    ]);

    assert.equal(payload.problems[0][2], 2);
    assert.equal(payload.problems[0][4], 1);
    assert.deepEqual(timeframesFromMask(payload.links[0][3]).sort(), ["3_months", "all"]);
  });

  it("treats a missing timeframes array as an empty mask", () => {
    const payload = encodeDashboardData([q({ timeframes: undefined })]);

    assert.equal(payload.links[0][3], 0);
  });

  it("throws on an unknown difficulty", () => {
    assert.throws(() => encodeDashboardData([q({ difficulty: "Impossible" })]), /Impossible/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bunx tsx --test tests/dashboard-encode.test.ts`
Expected: FAIL, cannot find module `../lib/dashboard/encode`.

- [ ] **Step 3: Write the schema module**

Create `lib/dashboard/schema.ts`:

```ts
// Compact wire format for the dashboard question table. Every field the table
// renders is derivable from this payload, so the fat questions.json never
// reaches the browser. See docs/superpowers/specs/2026-07-26-dashboard-data-delivery-design.md

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

export type EncodedCompany = [slug: string, count: number];

export interface DashboardPayload {
  v: 1;
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
```

- [ ] **Step 4: Write the encoder**

Create `lib/dashboard/encode.ts`:

```ts
import {
  DIFFICULTIES,
  maskFromTimeframes,
  type DashboardPayload,
  type Difficulty,
  type EncodedLink,
  type EncodedProblem,
} from "./schema";

// The subset of a questions.json row the dashboard actually needs.
export interface SourceQuestion {
  slug: string;
  title: string;
  difficulty: string;
  company: string;
  topics: string[];
  Topics: string;
  "Acceptance %": string;
  "Frequency %": string;
  "Is Premium": string;
  timeframes?: string[];
}

// Rows for the same slug do not always agree across companies (239 disagree on
// Topics, 1 on title). Keying on the full identity keeps those variants
// separate so the encoding stays exactly lossless.
function problemKey(question: SourceQuestion): string {
  return [
    question.slug,
    question.title,
    question.Topics,
    question.difficulty,
    question["Acceptance %"],
    question["Is Premium"],
  ].join(" ");
}

export function encodeDashboardData(questions: readonly SourceQuestion[]): DashboardPayload {
  const topics = [...new Set(questions.flatMap((q) => q.topics))].sort((a, b) =>
    a.localeCompare(b)
  );
  const topicIndex = new Map(topics.map((topic, i) => [topic, i]));

  const companies = [...new Set(questions.map((q) => q.company))].sort();
  const companyIndex = new Map(companies.map((company, i) => [company, i]));
  const counts = new Array<number>(companies.length).fill(0);

  const problems: EncodedProblem[] = [];
  const problemIndex = new Map<string, number>();
  const links: EncodedLink[] = [];

  for (const question of questions) {
    const key = problemKey(question);
    let problem = problemIndex.get(key);

    if (problem === undefined) {
      const difficulty = DIFFICULTIES.indexOf(question.difficulty as Difficulty);
      if (difficulty < 0) {
        throw new Error(`Unknown difficulty "${question.difficulty}" for ${question.slug}`);
      }
      problem = problems.length;
      problemIndex.set(key, problem);
      problems.push([
        question.slug,
        question.title,
        difficulty,
        question["Acceptance %"] ? parseFloat(question["Acceptance %"]) : null,
        question["Is Premium"] === "Y" ? 1 : 0,
        question.topics.map((topic) => topicIndex.get(topic)!),
      ]);
    }

    const company = companyIndex.get(question.company)!;
    counts[company]++;
    links.push([
      problem,
      company,
      parseFloat(question["Frequency %"]),
      maskFromTimeframes(question.timeframes ?? []),
    ]);
  }

  return {
    v: 1,
    topics,
    companies: companies.map((company, i): [string, number] => [company, counts[i]]),
    problems,
    links,
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bunx tsx --test tests/dashboard-encode.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
git add lib/dashboard/schema.ts lib/dashboard/encode.ts tests/dashboard-encode.test.ts
git commit -m "add compact dashboard payload schema and encoder"
```

---

### Task 2: Decoder and display rows

**Files:**
- Create: `lib/dashboard/decode.ts`
- Test: `tests/dashboard-decode.test.ts`

**Interfaces:**
- Consumes: everything from Task 1.
- Produces: `DashboardIndex` with fields `topics: string[]`, `topicsLower: string[]`, `companies: string[]`, `companyCounts: number[]`, `problems: EncodedProblem[]`, `links: EncodedLink[]`, `titleLower: string[]`, `companyLower: string[]`, `topicSets: Set<number>[]`; `decodeDashboardPayload(DashboardPayload): DashboardIndex`; `DisplayRow` with fields `key`, `slug`, `title`, `path`, `difficulty`, `company`, `acceptance`, `frequency`, `topics`, `premium`; `toDisplayRow(DashboardIndex, number): DisplayRow`.

- [ ] **Step 1: Write the failing test**

Create `tests/dashboard-decode.test.ts`:

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { encodeDashboardData, type SourceQuestion } from "../lib/dashboard/encode";
import { decodeDashboardPayload, toDisplayRow } from "../lib/dashboard/decode";

function q(overrides: Partial<SourceQuestion> = {}): SourceQuestion {
  return {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    company: "google",
    topics: ["Array", "Hash Table"],
    Topics: "Array, Hash Table",
    "Acceptance %": "54.3%",
    "Frequency %": "100.0%",
    "Is Premium": "N",
    timeframes: ["all"],
    ...overrides,
  };
}

const index = decodeDashboardPayload(
  encodeDashboardData([
    q(),
    q({
      company: "amazon",
      slug: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      topics: ["Array"],
      Topics: "Array",
      "Acceptance %": "",
      "Frequency %": "7.5%",
      "Is Premium": "Y",
    }),
  ])
);

describe("decodeDashboardPayload", () => {
  it("splits companies from their counts", () => {
    assert.deepEqual(index.companies, ["amazon", "google"]);
    assert.deepEqual(index.companyCounts, [1, 1]);
  });

  it("precomputes lowercase lookups so search does no work per keystroke", () => {
    assert.deepEqual(index.titleLower, ["two sum", "median of two sorted arrays"]);
    assert.deepEqual(index.companyLower, ["amazon", "google"]);
    assert.deepEqual(index.topicsLower, ["array", "hash table"]);
  });

  it("precomputes a topic index set per problem", () => {
    assert.deepEqual([...index.topicSets[0]].sort(), [0, 1]);
    assert.deepEqual([...index.topicSets[1]], [0]);
  });
});

describe("toDisplayRow", () => {
  it("rebuilds every rendered field", () => {
    assert.deepEqual(toDisplayRow(index, 0), {
      key: "0-1",
      slug: "two-sum",
      title: "Two Sum",
      path: "/problems/two-sum",
      difficulty: "Easy",
      company: "google",
      acceptance: "54.3%",
      frequency: "100.0%",
      topics: ["Array", "Hash Table"],
      premium: false,
    });
  });

  it("renders an unknown acceptance as a blank cell", () => {
    const row = toDisplayRow(index, 1);

    assert.equal(row.acceptance, "");
    assert.equal(row.frequency, "7.5%");
    assert.equal(row.difficulty, "Hard");
    assert.equal(row.premium, true);
  });

  it("gives every row a unique key", () => {
    const keys = index.links.map((_, i) => toDisplayRow(index, i).key);

    assert.equal(new Set(keys).size, keys.length);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bunx tsx --test tests/dashboard-decode.test.ts`
Expected: FAIL, cannot find module `../lib/dashboard/decode`.

- [ ] **Step 3: Write the decoder**

Create `lib/dashboard/decode.ts`:

```ts
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
  companies: string[];
  companyCounts: number[];
  problems: EncodedProblem[];
  links: EncodedLink[];
  titleLower: string[];
  companyLower: string[];
  topicSets: Set<number>[];
}

export function decodeDashboardPayload(payload: DashboardPayload): DashboardIndex {
  const companies = payload.companies.map(([slug]) => slug);

  return {
    topics: payload.topics,
    topicsLower: payload.topics.map((topic) => topic.toLowerCase()),
    companies,
    companyCounts: payload.companies.map(([, count]) => count),
    problems: payload.problems,
    links: payload.links,
    titleLower: payload.problems.map(([, title]) => title.toLowerCase()),
    companyLower: companies.map((company) => company.toLowerCase()),
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
    key: `${problem}-${company}`,
    slug,
    title,
    path: problemPath(slug),
    difficulty: DIFFICULTIES[difficulty],
    company: index.companies[company],
    acceptance: formatPercent(acceptance),
    frequency: formatPercent(frequency),
    topics: topics.map((topic) => index.topics[topic]),
    premium: premium === 1,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bunx tsx --test tests/dashboard-decode.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/dashboard/decode.ts tests/dashboard-decode.test.ts
git commit -m "add dashboard payload decoder and display row builder"
```

---

### Task 3: Filter, sort, and stats

This is the logic currently inlined in `components/LeetCodeDashboard.tsx`. It must behave **identically** to today, with two deliberate exceptions noted in Task 6 (default sort, and the dead `selectedCompany` filter which is removed).

**Files:**
- Create: `lib/dashboard/query.ts`
- Test: `tests/dashboard-query.test.ts`

**Interfaces:**
- Consumes: `DashboardIndex` from Task 2, `Difficulty` / `Timeframe` / `maskHasTimeframe` from Task 1.
- Produces: `QueryOptions` with fields `search: string`, `difficulties: Difficulty[]`, `topics: string[]`, `timeframe: Timeframe`, `premium: "free" | "premium" | "all"`; `SortOrder = "asc" | "desc" | null`; `filterLinks(DashboardIndex, QueryOptions): number[]`; `sortLinks(DashboardIndex, number[], SortOrder, SortOrder): number[]`; `Stats` with fields `total`, `totalSolved`, `easy`, `easySolved`, `medium`, `mediumSolved`, `hard`, `hardSolved`, all numbers; `computeStats(DashboardIndex, number[], Record<string, boolean>): Stats`.

- [ ] **Step 1: Write the failing test**

Create `tests/dashboard-query.test.ts`:

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { encodeDashboardData, type SourceQuestion } from "../lib/dashboard/encode";
import { decodeDashboardPayload } from "../lib/dashboard/decode";
import { computeStats, filterLinks, sortLinks, type QueryOptions } from "../lib/dashboard/query";

function q(overrides: Partial<SourceQuestion> = {}): SourceQuestion {
  return {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    company: "google",
    topics: ["Array", "Hash Table"],
    Topics: "Array, Hash Table",
    "Acceptance %": "54.3%",
    "Frequency %": "100.0%",
    "Is Premium": "N",
    timeframes: ["all"],
    ...overrides,
  };
}

const rows = [
  q(),
  q({
    company: "amazon",
    slug: "three-sum",
    title: "3Sum",
    difficulty: "Medium",
    topics: ["Array", "Two Pointers"],
    Topics: "Array, Two Pointers",
    "Frequency %": "40.0%",
    "Acceptance %": "32.1%",
    timeframes: ["all", "30_days"],
  }),
  q({
    company: "meta",
    slug: "lru-cache",
    title: "LRU Cache",
    difficulty: "Hard",
    topics: ["Design"],
    Topics: "Design",
    "Frequency %": "70.0%",
    "Acceptance %": "41.0%",
    "Is Premium": "Y",
    timeframes: ["6_months"],
  }),
];

const index = decodeDashboardPayload(encodeDashboardData(rows));

function opts(overrides: Partial<QueryOptions> = {}): QueryOptions {
  return {
    search: "",
    difficulties: [],
    topics: [],
    timeframe: "all",
    premium: "all",
    ...overrides,
  };
}

const titlesOf = (linkIndexes: number[]) =>
  linkIndexes.map((i) => index.problems[index.links[i][0]][1]);

describe("filterLinks", () => {
  it("returns everything when nothing is set", () => {
    assert.deepEqual(titlesOf(filterLinks(index, opts())), ["Two Sum", "3Sum", "LRU Cache"]);
  });

  it("matches search against title, company, and topic", () => {
    assert.deepEqual(titlesOf(filterLinks(index, opts({ search: "lru" }))), ["LRU Cache"]);
    assert.deepEqual(titlesOf(filterLinks(index, opts({ search: "amazon" }))), ["3Sum"]);
    assert.deepEqual(titlesOf(filterLinks(index, opts({ search: "two pointers" }))), ["3Sum"]);
  });

  it("requires every search word to match", () => {
    assert.deepEqual(titlesOf(filterLinks(index, opts({ search: "sum google" }))), ["Two Sum"]);
    assert.deepEqual(filterLinks(index, opts({ search: "sum meta" })), []);
  });

  it("ignores surrounding whitespace and case in the search", () => {
    assert.deepEqual(titlesOf(filterLinks(index, opts({ search: "  LRU  " }))), ["LRU Cache"]);
  });

  it("filters by difficulty as an OR set", () => {
    assert.deepEqual(titlesOf(filterLinks(index, opts({ difficulties: ["Easy", "Hard"] }))), [
      "Two Sum",
      "LRU Cache",
    ]);
  });

  it("filters by topic as an AND set", () => {
    assert.deepEqual(titlesOf(filterLinks(index, opts({ topics: ["Array"] }))), [
      "Two Sum",
      "3Sum",
    ]);
    assert.deepEqual(titlesOf(filterLinks(index, opts({ topics: ["Array", "Two Pointers"] }))), [
      "3Sum",
    ]);
  });

  it("treats the all timeframe as no filter at all", () => {
    assert.equal(filterLinks(index, opts({ timeframe: "all" })).length, 3);
  });

  it("filters by a specific timeframe", () => {
    assert.deepEqual(titlesOf(filterLinks(index, opts({ timeframe: "30_days" }))), ["3Sum"]);
    assert.deepEqual(titlesOf(filterLinks(index, opts({ timeframe: "6_months" }))), ["LRU Cache"]);
  });

  it("filters by premium access", () => {
    assert.deepEqual(titlesOf(filterLinks(index, opts({ premium: "free" }))), ["Two Sum", "3Sum"]);
    assert.deepEqual(titlesOf(filterLinks(index, opts({ premium: "premium" }))), ["LRU Cache"]);
  });
});

describe("sortLinks", () => {
  const all = filterLinks(index, opts());

  it("sorts by frequency descending", () => {
    assert.deepEqual(titlesOf(sortLinks(index, all, "desc", null)), [
      "Two Sum",
      "LRU Cache",
      "3Sum",
    ]);
  });

  it("sorts by frequency ascending", () => {
    assert.deepEqual(titlesOf(sortLinks(index, all, "asc", null)), [
      "3Sum",
      "LRU Cache",
      "Two Sum",
    ]);
  });

  it("sorts by acceptance when frequency is off", () => {
    assert.deepEqual(titlesOf(sortLinks(index, all, null, "desc")), [
      "Two Sum",
      "LRU Cache",
      "3Sum",
    ]);
  });

  it("treats an unknown acceptance as the lowest value", () => {
    const local = decodeDashboardPayload(
      encodeDashboardData([q({ "Acceptance %": "" }), q({ company: "meta" })])
    );
    const sorted = sortLinks(local, filterLinks(local, opts()), null, "asc");

    assert.equal(local.problems[local.links[sorted[0]][0]][3], null);
  });

  it("does not mutate its input", () => {
    const input = [...all];
    sortLinks(index, input, "desc", null);

    assert.deepEqual(input, all);
  });
});

describe("computeStats", () => {
  it("counts unique slugs, not rows", () => {
    const local = decodeDashboardPayload(
      encodeDashboardData([q(), q({ company: "amazon" }), q({ company: "meta" })])
    );
    const stats = computeStats(local, filterLinks(local, opts()), {});

    assert.equal(stats.total, 1);
    assert.equal(stats.easy, 1);
  });

  it("counts solved per difficulty from the slug-keyed progress map", () => {
    const stats = computeStats(index, filterLinks(index, opts()), {
      "two-sum": true,
      "lru-cache": true,
      "three-sum": false,
    });

    assert.deepEqual(stats, {
      total: 3,
      totalSolved: 2,
      easy: 1,
      easySolved: 1,
      medium: 1,
      mediumSolved: 0,
      hard: 1,
      hardSolved: 1,
    });
  });

  it("returns zeroes for an empty result set", () => {
    assert.deepEqual(computeStats(index, [], {}), {
      total: 0,
      totalSolved: 0,
      easy: 0,
      easySolved: 0,
      medium: 0,
      mediumSolved: 0,
      hard: 0,
      hardSolved: 0,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bunx tsx --test tests/dashboard-query.test.ts`
Expected: FAIL, cannot find module `../lib/dashboard/query`.

- [ ] **Step 3: Write the query module**

Create `lib/dashboard/query.ts`:

```ts
import { DIFFICULTIES, maskHasTimeframe, type Difficulty, type Timeframe } from "./schema";
import type { DashboardIndex } from "./decode";

export interface QueryOptions {
  search: string;
  difficulties: Difficulty[];
  topics: string[];
  timeframe: Timeframe;
  premium: "free" | "premium" | "all";
}

export type SortOrder = "asc" | "desc" | null;

// Returns indexes into index.links, never row objects. Nothing is allocated
// per row, so this stays cheap over 15k links on every keystroke.
export function filterLinks(index: DashboardIndex, options: QueryOptions): number[] {
  const words = options.search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const difficulties = options.difficulties.map((d) => DIFFICULTIES.indexOf(d));
  const topics = options.topics
    .map((topic) => index.topics.indexOf(topic))
    .filter((topic) => topic >= 0);
  // "all" means no recency filter, matching the current dropdown.
  const timeframe = options.timeframe === "all" ? null : options.timeframe;

  const result: number[] = [];

  for (let i = 0; i < index.links.length; i++) {
    const [problem, company, , mask] = index.links[i];

    if (difficulties.length > 0 && !difficulties.includes(index.problems[problem][2])) continue;

    if (options.premium !== "all") {
      const isPremium = index.problems[problem][4] === 1;
      if (options.premium === "free" ? isPremium : !isPremium) continue;
    }

    if (timeframe !== null && !maskHasTimeframe(mask, timeframe)) continue;

    if (topics.length > 0) {
      const owned = index.topicSets[problem];
      if (!topics.every((topic) => owned.has(topic))) continue;
    }

    if (words.length > 0) {
      const title = index.titleLower[problem];
      const companyName = index.companyLower[company];
      // Iterate the topic id array directly. Spreading the Set or lowercasing
      // here would allocate once per row per keystroke, which is the cost this
      // whole rewrite exists to remove.
      const topicIds = index.problems[problem][5];
      const matchesAll = words.every(
        (word) =>
          title.includes(word) ||
          companyName.includes(word) ||
          topicIds.some((topic) => index.topicsLower[topic].includes(word))
      );
      if (!matchesAll) continue;
    }

    result.push(i);
  }

  return result;
}

export function sortLinks(
  index: DashboardIndex,
  linkIndexes: readonly number[],
  frequency: SortOrder,
  acceptance: SortOrder
): number[] {
  const sorted = [...linkIndexes];
  if (!frequency && !acceptance) return sorted;

  sorted.sort((a, b) => {
    if (frequency) {
      const diff = index.links[a][2] - index.links[b][2];
      if (diff !== 0) return frequency === "asc" ? diff : -diff;
    }
    if (acceptance) {
      // An unknown acceptance sorts below every known value.
      const left = index.problems[index.links[a][0]][3] ?? -1;
      const right = index.problems[index.links[b][0]][3] ?? -1;
      const diff = left - right;
      if (diff !== 0) return acceptance === "asc" ? diff : -diff;
    }
    return 0;
  });

  return sorted;
}

export interface Stats {
  total: number;
  totalSolved: number;
  easy: number;
  easySolved: number;
  medium: number;
  mediumSolved: number;
  hard: number;
  hardSolved: number;
}

// Counts are per unique slug, not per row, so a question asked by 40 companies
// counts once. Progress is keyed by slug for the same reason.
export function computeStats(
  index: DashboardIndex,
  linkIndexes: readonly number[],
  solved: Record<string, boolean>
): Stats {
  const seen = new Set<string>();
  const stats: Stats = {
    total: 0,
    totalSolved: 0,
    easy: 0,
    easySolved: 0,
    medium: 0,
    mediumSolved: 0,
    hard: 0,
    hardSolved: 0,
  };

  for (const linkIndex of linkIndexes) {
    const [slug, , difficulty] = index.problems[index.links[linkIndex][0]];
    if (seen.has(slug)) continue;
    seen.add(slug);

    const isSolved = solved[slug] === true;
    stats.total++;
    if (isSolved) stats.totalSolved++;

    if (difficulty === 0) {
      stats.easy++;
      if (isSolved) stats.easySolved++;
    } else if (difficulty === 1) {
      stats.medium++;
      if (isSolved) stats.mediumSolved++;
    } else {
      stats.hard++;
      if (isSolved) stats.hardSolved++;
    }
  }

  return stats;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bunx tsx --test tests/dashboard-query.test.ts`
Expected: PASS, 17 tests.

- [ ] **Step 5: Run the whole suite to check nothing regressed**

Run: `bun run test`
Expected: PASS, including the pre-existing `compare`, `blog-dates`, and `sitemap-filters` tests.

- [ ] **Step 6: Commit**

```bash
git add lib/dashboard/query.ts tests/dashboard-query.test.ts
git commit -m "add pure filter, sort, and stats logic for the dashboard table"
```

---

### Task 4: Generate and verify the artifact

**Files:**
- Modify: `scripts/build-data.ts` (after the `questions.json` write, around line 186)
- Create: `scripts/verify-dashboard-data.ts`
- Modify: `package.json` (the `prebuild` script)

**Interfaces:**
- Consumes: `encodeDashboardData` from Task 1, `decodeDashboardPayload` / `toDisplayRow` from Task 2, `timeframesFromMask` / `problemUrl` from Task 1.
- Produces: `public/data/dashboard.json` matching `DashboardPayload`.

- [ ] **Step 1: Write the dashboard.json emit into the build script**

In `scripts/build-data.ts`, add to the imports at the top:

```ts
import { encodeDashboardData } from "../lib/dashboard/encode";
```

Immediately after the existing `await fs.writeFile(outPath, JSON.stringify({ questions: slimQuestions, companies, topics }));` line, insert:

```ts
  // Compact client payload. questions.json stays as-is for the server-rendered
  // pSEO pages; only the dashboard reads this one, at roughly a fifth the
  // gzipped size. scripts/verify-dashboard-data.ts proves the two agree.
  const dashboardPayload = encodeDashboardData(slimQuestions);
  const dashboardPath = path.join(outDir, "dashboard.json");
  await fs.writeFile(dashboardPath, JSON.stringify(dashboardPayload));
  console.log(
    `Wrote ${dashboardPayload.problems.length} problems, ${dashboardPayload.links.length} links, ` +
      `${dashboardPayload.companies.length} companies to ${dashboardPath}`
  );
```

- [ ] **Step 2: Write the verification script**

Create `scripts/verify-dashboard-data.ts`:

```ts
import fs from "fs/promises";
import path from "path";
import { decodeDashboardPayload, toDisplayRow } from "../lib/dashboard/decode";
import { problemUrl, timeframesFromMask, type DashboardPayload } from "../lib/dashboard/schema";

interface LegacyQuestion {
  ID: string;
  Title: string;
  Difficulty: string;
  Topics: string;
  URL: string;
  link: string;
  company: string;
  "Acceptance %": string;
  "Frequency %": string;
  "Is Premium": string;
  timeframes?: string[];
}

const DATA_DIR = path.join(process.cwd(), "public", "data");

async function main() {
  const legacy = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "questions.json"), "utf8")
  ) as { questions: LegacyQuestion[] };
  const payload = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "dashboard.json"), "utf8")
  ) as DashboardPayload;

  const index = decodeDashboardPayload(payload);
  const failures: string[] = [];

  if (index.links.length !== legacy.questions.length) {
    failures.push(`row count ${index.links.length} != ${legacy.questions.length}`);
  }

  const limit = Math.min(index.links.length, legacy.questions.length);
  for (let i = 0; i < limit; i++) {
    const expected = legacy.questions[i];
    const row = toDisplayRow(index, i);
    const mask = index.links[i][3];

    const checks: [string, unknown, unknown][] = [
      ["ID", row.slug, expected.ID],
      ["Title", row.title, expected.Title],
      ["Difficulty", row.difficulty, expected.Difficulty],
      ["Topics", row.topics.join(", "), expected.Topics],
      ["URL", row.path, expected.URL],
      ["link", problemUrl(row.slug), expected.link],
      ["company", row.company, expected.company],
      ["Acceptance %", row.acceptance, expected["Acceptance %"]],
      ["Frequency %", row.frequency, expected["Frequency %"]],
      ["Is Premium", row.premium ? "Y" : "N", expected["Is Premium"]],
      [
        "timeframes",
        timeframesFromMask(mask).slice().sort().join(","),
        (expected.timeframes ?? []).slice().sort().join(","),
      ],
    ];

    for (const [field, actual, want] of checks) {
      if (actual !== want) {
        failures.push(`row ${i} (${expected.ID}/${expected.company}) ${field}: ${actual} != ${want}`);
      }
    }

    if (failures.length >= 20) break;
  }

  // Company counts must match the links that actually reference them.
  const counted = new Array<number>(index.companies.length).fill(0);
  for (const [, company] of index.links) counted[company]++;
  index.companyCounts.forEach((count, i) => {
    if (count !== counted[i]) {
      failures.push(`company ${index.companies[i]} count ${count} != ${counted[i]}`);
    }
  });

  if (failures.length > 0) {
    console.error("dashboard.json does not match questions.json:");
    for (const failure of failures.slice(0, 20)) console.error(`  ${failure}`);
    process.exit(1);
  }

  console.log(
    `Verified ${limit} dashboard rows against questions.json ` +
      `(${index.problems.length} problems, ${index.companies.length} companies)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Wire it into the prebuild**

In `package.json`, change the `prebuild` script from:

```
"prebuild": "tsx scripts/build-data.ts && tsx scripts/build-blog.ts && tsx scripts/build-learn.ts && tsx scripts/build-system-design.ts && tsx scripts/build-sitemap.ts",
```

to:

```
"prebuild": "tsx scripts/build-data.ts && tsx scripts/verify-dashboard-data.ts && tsx scripts/build-blog.ts && tsx scripts/build-learn.ts && tsx scripts/build-system-design.ts && tsx scripts/build-sitemap.ts",
```

- [ ] **Step 4: Generate and verify against the real data**

Run: `bunx tsx scripts/build-data.ts && bunx tsx scripts/verify-dashboard-data.ts`

Expected: the build logs `Wrote 3408 problems, 15504 links, 686 companies`, then the verifier logs `Verified 15504 dashboard rows against questions.json`. Exit code 0.

If the verifier reports mismatches, the encoding is wrong. Fix `lib/dashboard/encode.ts`, do not relax the check.

- [ ] **Step 5: Confirm the size win**

Run:

```bash
ls -l public/data/dashboard.json public/data/questions.json
gzip -9 -c public/data/dashboard.json | wc -c
```

Expected: `dashboard.json` around 0.58 MB raw and about 155 KB gzipped, against 8.8 MB and 1.02 MB for `questions.json`.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-data.ts scripts/verify-dashboard-data.ts package.json
git commit -m "generate and verify the compact dashboard payload at build time"
```

---

### Task 5: Store rewrite

**Files:**
- Modify: `lib/cache-version.ts`
- Modify: `lib/dashboard-store.ts` (full rewrite)
- Modify: `app/dashboard/page.client.tsx`

**Interfaces:**
- Consumes: `decodeDashboardPayload` and `DashboardIndex` from Task 2, `DashboardPayload` from Task 1.
- Produces: `subscribeToDashboard(callback): () => void`, `getDashboardSnapshot(): DashboardStore`, `getDashboardServerSnapshot(): DashboardStore`, `retryDashboard(): void`, and `DashboardStore` with fields `data: DashboardIndex | null`, `loading: boolean`, `error: string | null`.

- [ ] **Step 1: Bump the cache version**

Replace the contents of `lib/cache-version.ts`:

```ts
// Bump when the dashboard payload shape changes. Stale keys are evicted in
// lib/dashboard-store.ts, so an old oversized entry cannot eat the quota.
export const CACHE_VERSION = "v5";
```

- [ ] **Step 2: Rewrite the store**

Replace the entire contents of `lib/dashboard-store.ts`:

```ts
import { CACHE_VERSION } from "@/lib/cache-version";
import { decodeDashboardPayload, type DashboardIndex } from "@/lib/dashboard/decode";
import type { DashboardPayload } from "@/lib/dashboard/schema";

const CACHE_PREFIX = "dashboard-cache-";
const CACHE_KEY = `${CACHE_PREFIX}${CACHE_VERSION}`;
const FETCH_TIMEOUT_MS = 15000;

export interface DashboardStore {
  data: DashboardIndex | null;
  loading: boolean;
  error: string | null;
}

let store: DashboardStore = { data: null, loading: true, error: null };
const listeners = new Set<() => void>();
let started = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function setStore(next: DashboardStore) {
  store = next;
  emit();
}

// A pre-v5 entry could be several megabytes and would block the new write.
function dropStaleCaches() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX) && key !== CACHE_KEY) {
        localStorage.removeItem(key);
      }
    }
  } catch {}
}

function readCache(): DashboardIndex | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const payload = JSON.parse(cached) as DashboardPayload;
    if (payload?.v !== 1 || !Array.isArray(payload.links)) throw new Error("bad shape");
    return decodeDashboardPayload(payload);
  } catch {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {}
    return null;
  }
}

function load() {
  dropStaleCaches();

  const cached = readCache();
  if (cached) {
    setStore({ data: cached, loading: false, error: null });
    return;
  }

  setStore({ data: null, loading: true, error: null });

  fetch("/data/dashboard.json", { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then((text) => {
      // Cache the raw text so nothing is stringified twice.
      const index = decodeDashboardPayload(JSON.parse(text) as DashboardPayload);
      try {
        localStorage.setItem(CACHE_KEY, text);
      } catch {}
      setStore({ data: index, loading: false, error: null });
    })
    .catch((err: unknown) => {
      const timedOut = err instanceof Error && err.name === "TimeoutError";
      setStore({
        data: null,
        loading: false,
        error: timedOut ? "That took too long. Check your connection." : "Could not load questions.",
      });
    });
}

export function retryDashboard() {
  load();
}

export function subscribeToDashboard(callback: () => void): () => void {
  listeners.add(callback);
  if (!started) {
    started = true;
    load();
  }
  return () => {
    listeners.delete(callback);
  };
}

export function getDashboardSnapshot(): DashboardStore {
  return store;
}

// ponytail: stable reference — a fresh object each call makes useSyncExternalStore loop forever.
const serverSnapshot: DashboardStore = { data: null, loading: true, error: null };
export function getDashboardServerSnapshot(): DashboardStore {
  return serverSnapshot;
}
```

- [ ] **Step 3: Update the page client to pass the new props**

Replace the contents of `app/dashboard/page.client.tsx`:

```tsx
"use client";

import { useSyncExternalStore } from "react";
import LeetCodeDashboard from "@/components/LeetCodeDashboard";
import {
  subscribeToDashboard,
  getDashboardSnapshot,
  getDashboardServerSnapshot,
  retryDashboard,
} from "@/lib/dashboard-store";

export default function DashboardClient() {
  const { data, loading, error } = useSyncExternalStore(
    subscribeToDashboard,
    getDashboardSnapshot,
    getDashboardServerSnapshot
  );

  return (
    <div className="container mx-auto py-8">
      <LeetCodeDashboard index={data} loading={loading} error={error} onRetry={retryDashboard} />
    </div>
  );
}
```

- [ ] **Step 4: Confirm it type-checks so far**

Run: `bunx tsc --noEmit`

Expected: errors **only** inside `components/LeetCodeDashboard.tsx`, because its props have not been updated yet. Any error in `lib/` or `app/` must be fixed before continuing.

- [ ] **Step 5: Commit**

```bash
git add lib/cache-version.ts lib/dashboard-store.ts app/dashboard/page.client.tsx
git commit -m "load the compact dashboard payload with timeout, retry, and a working cache"
```

---

### Task 6: Dashboard component

Three behaviour changes are deliberate: default sort becomes frequency descending, the dead `selectedCompany` state is deleted (it was `useState("")` with no setter), and the failed-fetch state renders an error card instead of the empty-results message. Everything else must look and behave exactly as it does today.

**Files:**
- Modify: `components/LeetCodeDashboard.tsx`

**Interfaces:**
- Consumes: `DashboardIndex` / `DisplayRow` / `toDisplayRow` from Task 2, `filterLinks` / `sortLinks` / `computeStats` / `SortOrder` from Task 3, `LEETCODE_BASE_URL` / `Difficulty` / `Timeframe` from Task 1.
- Produces: a default-exported `LeetCodeDashboard` taking props `index: DashboardIndex | null`, `loading?: boolean`, `error?: string | null`, `onRetry?: () => void`.

- [ ] **Step 1: Replace the imports, exported type, and props**

Delete the exported `Question` interface (lines 33 to 52) and the `LEETCODE_BASE_URL` constant on line 31. Nothing imports `Question` after Task 5. Replace the import block and props with:

```tsx
"use client";

import React, { useState, useMemo, useEffect, useRef, useDeferredValue } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchUserProgress, updateQuestionProgress } from "@/utils/progressUtils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { capitalizeWords } from "@/utils/utils";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import TopicDropdown from "@/components/TopicDropdown";
import { toDisplayRow, type DashboardIndex } from "@/lib/dashboard/decode";
import { computeStats, filterLinks, sortLinks, type SortOrder } from "@/lib/dashboard/query";
import { LEETCODE_BASE_URL, type Difficulty, type Timeframe } from "@/lib/dashboard/schema";

interface LeetCodeDashboardProps {
  index: DashboardIndex | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const LeetCodeDashboard: React.FC<LeetCodeDashboardProps> = ({
  index,
  loading = false,
  error = null,
  onRetry,
}) => {
```

- [ ] **Step 2: Update the state block**

Replace the `difficultyFilter`, `selectedCompany`, `selectedTopics`, `frequencySort`, `acceptanceSort`, and `timeframeFilter` declarations (lines 66, 67, 84 to 87) with:

```tsx
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  // Page 1 shows the most-asked questions instead of arbitrary CSV order.
  const [frequencySort, setFrequencySort] = useState<SortOrder>("desc");
  const [acceptanceSort, setAcceptanceSort] = useState<SortOrder>(null);
  const [timeframeFilter, setTimeframeFilter] = useState<Timeframe>("all");
```

Leave `searchQuery`, `checkedItems`, `currentPage`, `itemsPerPage`, `premiumFilter`, and `showCompanyDropdown` exactly as they are. Delete the `selectedCompany` line entirely.

Directly below the state block, add:

```tsx
  // React's native debounce: the input stays instant while the 15k-link filter
  // re-runs at lower priority. The company dropdown keeps the raw value.
  const deferredSearch = useDeferredValue(searchQuery);
```

- [ ] **Step 3: Replace the five derived-data memos**

Replace `companyStats` (lines 133 to 140), `uniqueTopics` (142 to 153), `filteredQuestions` (155 to 200), `filteredAndSortedQuestions` (202 to 224), and `statistics` (242 to 290) with:

```tsx
  // Counts come precomputed from the build, so no 11M-comparison scan on mount.
  const companyStats = useMemo(() => {
    if (!index) return [];
    return index.companies
      .map((name, i) => ({ name, count: index.companyCounts[i] }))
      .sort((a, b) => b.count - a.count);
  }, [index]);

  const uniqueTopics = useMemo(() => index?.topics ?? [], [index]);

  const filteredLinks = useMemo(() => {
    if (!index) return [];
    return filterLinks(index, {
      search: deferredSearch,
      difficulties: difficultyFilter,
      topics: selectedTopics,
      timeframe: timeframeFilter,
      premium: premiumFilter as "free" | "premium" | "all",
    });
  }, [index, deferredSearch, difficultyFilter, selectedTopics, timeframeFilter, premiumFilter]);

  const sortedLinks = useMemo(() => {
    if (!index) return [];
    return sortLinks(index, filteredLinks, frequencySort, acceptanceSort);
  }, [index, filteredLinks, frequencySort, acceptanceSort]);

  const statistics = useMemo(() => {
    if (!index) {
      return {
        total: 0,
        totalSolved: 0,
        easy: 0,
        easySolved: 0,
        medium: 0,
        mediumSolved: 0,
        hard: 0,
        hardSolved: 0,
      };
    }
    return computeStats(index, filteredLinks, checkedItems);
  }, [index, filteredLinks, checkedItems]);
```

- [ ] **Step 4: Replace the pagination slice**

Replace `totalPages`, `currentPageToUse`, and `currentItems` (lines 292 to 299) with:

```tsx
  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / itemsPerPage));
  const currentPageToUse = Math.min(currentPage, totalPages);

  // Only the visible page is materialised into display strings.
  const currentItems = useMemo(() => {
    if (!index) return [];
    const start = (currentPageToUse - 1) * itemsPerPage;
    return sortedLinks
      .slice(start, start + itemsPerPage)
      .map((linkIndex) => toDisplayRow(index, linkIndex));
  }, [index, sortedLinks, currentPageToUse, itemsPerPage]);
```

- [ ] **Step 5: Update the difficulty handler signature**

Replace `handleDifficultyChange` (lines 304 to 307) and `handleTimeframeChange` (314 to 317):

```tsx
  const handleDifficultyChange = (options: string[]) => {
    setDifficultyFilter(options as Difficulty[]);
    setCurrentPage(1);
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframeFilter(value as Timeframe);
    setCurrentPage(1);
  };
```

- [ ] **Step 6: Add the error branch**

The render currently reads `loading ? (...) : filteredQuestions.length === 0 ? (...) : (...)`. Change the middle condition so a failed fetch is never reported as an empty filter result. Replace this line:

```tsx
            ) : filteredQuestions.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No questions found , try some other filters?
              </div>
```

with:

```tsx
            ) : error ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Retry
                </Button>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No questions found , try some other filters?
              </div>
```

- [ ] **Step 7: Update both row renderers to use DisplayRow**

In the desktop `<TableBody>` (currently lines 656 to 716), replace the `currentItems.map` body. The `topics` variable and `question.Topics.split(",")` call are gone, since `row.topics` is already an array:

```tsx
                      {currentItems.map((row) => (
                        <TableRow key={row.key}>
                          <TableCell className="w-4">
                            <Checkbox
                              checked={checkedItems[row.slug] || false}
                              onCheckedChange={(value) =>
                                handleCheckboxChange(row.slug, Boolean(value))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <a
                              href={`${LEETCODE_BASE_URL}${row.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground hover:text-primary hover:underline"
                            >
                              {row.title}
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="capitalize">{capitalizeWords(row.company)}</div>
                          </TableCell>
                          <TableCell>
                            <DifficultyBadge difficulty={row.difficulty} />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {row.topics.length === 0 ? (
                                <span className="text-muted-foreground">-</span>
                              ) : (
                                row.topics.map((topic) => (
                                  <span
                                    key={topic}
                                    className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 dark:text-blue-400"
                                  >
                                    {topic}
                                  </span>
                                ))
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{row.acceptance}</TableCell>
                          <TableCell className="text-center">{row.frequency}</TableCell>
                          <TableCell className="flex items-center gap-2" aria-hidden="true">
                            <div className="h-9 w-9 opacity-0" />
                          </TableCell>
                        </TableRow>
                      ))}
```

In the mobile card grid (currently lines 783 to 836), apply the same substitutions:

```tsx
                  {currentItems.map((row) => (
                    <Card key={row.key} className="p-4 bg-background/50 border">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={checkedItems[row.slug] || false}
                            onCheckedChange={(value) =>
                              handleCheckboxChange(row.slug, Boolean(value))
                            }
                          />
                          <div>
                            <a
                              href={`${LEETCODE_BASE_URL}${row.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:underline"
                            >
                              {row.title}
                            </a>
                            <div className="capitalize text-xs text-muted-foreground">
                              {capitalizeWords(row.company)}
                            </div>
                          </div>
                        </div>
                        <DifficultyBadge difficulty={row.difficulty} />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {row.topics.length === 0 ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          row.topics.map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 dark:text-blue-400"
                            >
                              {topic}
                            </span>
                          ))
                        )}
                      </div>
                    </Card>
                  ))}
```

- [ ] **Step 8: Type-check and lint**

Run: `bunx tsc --noEmit && bun run lint`
Expected: both clean. `DifficultyBadge` now receives a typed `Difficulty`, so the old `as "Easy" | "Medium" | "Hard"` casts are gone.

- [ ] **Step 9: Run the full test suite**

Run: `bun run test`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add components/LeetCodeDashboard.tsx
git commit -m "render the dashboard table from the compact index with an error state"
```

---

### Task 7: End-to-end verification

**Files:** none modified. This task proves the spec's success criteria.

- [ ] **Step 1: Build the data and start the dev server**

Run: `bun run prebuild`
Expected: `Verified 15504 dashboard rows against questions.json`.

Then: `bun dev` and open `http://localhost:3000/dashboard`.

- [ ] **Step 2: Check the payload over the wire**

In DevTools Network, hard-reload with cache disabled and find `dashboard.json`.

Expected: transferred size around 150 KB, not 1 MB. No request for `questions.json`.

- [ ] **Step 3: Check the cache works**

Reload the page normally. In the Network tab, filter for `dashboard.json`.

Expected: **no request at all.** In Application, Local Storage, `dashboard-cache-v5` exists at roughly 0.58 MB, and no `dashboard-cache-v4` key remains.

- [ ] **Step 4: Check the error state**

In DevTools Network, switch the throttle to Offline. Clear `dashboard-cache-v5` from Local Storage. Reload.

Expected: an error card reading "Could not load questions." with a Retry button, **not** "No questions found , try some other filters?". Switch back to Online, click Retry, and the table loads.

- [ ] **Step 5: Check the six defects are closed**

Confirm each in the browser:

1. Offline shows the error card with a working Retry button.
2. The fetch aborts after 15 seconds rather than spinning forever (throttle to a custom profile at 1 kb/s to observe).
3. First paint is fast. In the Performance tab, no long task from a 714-by-15504 scan.
4. Type a letter in the company search. Every suggestion shows a non-zero count, and the list covers 686 companies, not 714.
5. Type quickly in the search box. Characters appear without lag.
6. Page 1 shows the highest-frequency questions with the Frequency header arrow pointing down.

- [ ] **Step 6: Spot-check the data against production behaviour**

Search for `google`, set Difficulty to Hard, set Access to All Questions. Confirm the row count and the first page of titles match what the current deployed dashboard shows for the same filters. Acceptance cells that are blank today must still be blank, never "0.0%".

- [ ] **Step 7: Confirm the pSEO pages are untouched**

Visit `http://localhost:3000/topic/array` and `http://localhost:3000/difficulty/hard`.

Expected: both render exactly as before. They read `questions.json`, which this change never touched.

- [ ] **Step 8: Commit any fixes found**

If steps 1 to 7 surfaced problems, fix them and commit with a plain subject line, for example:

```bash
git commit -m "correct the timeframe filter on the dashboard table"
```

---

## Self-Review

**Spec coverage:**

| Spec item | Task |
|---|---|
| Compact `dashboard.json` format | 1, 4 |
| `questions.json` untouched | 4 (constraint), 7 step 7 |
| Company counts precomputed, 686 companies (defects 4 and 5) | 1, 7 step 5 |
| Problem identity keyed on the full tuple, 3,408 entries | 1 |
| Percentages via `parseFloat` of the display string | 1 |
| Unknown acceptance as `null`, blank cell | 1, 2, 7 step 6 |
| Store timeout and abort (defect 3) | 5 |
| Error state and retry (defect 2) | 5, 6, 7 step 4 |
| Cache actually writes, stale keys evicted (defect 1) | 5, 7 step 3 |
| `useDeferredValue` for search (defect 6) | 6 |
| Default frequency sort (defect 7) | 6 |
| Precomputed lowercase and topic-set lookups | 2 |
| Only the visible page materialised | 6 |
| Prebuild verification script | 4 |

**Placeholder scan:** none. Every step carries the code or the exact command.

**Type consistency:** `DashboardIndex`, `DisplayRow`, `QueryOptions`, `SortOrder`, and `Stats` are defined once and referenced with the same names and field names in Tasks 2, 3, 5, and 6. `filterLinks` and `sortLinks` both take and return `number[]` of link indexes. `computeStats` and the component's `checkedItems` are both keyed by slug.

**Known deliberate deviations from current behaviour**, all approved in the spec:

1. Default sort is frequency descending, was unsorted.
2. `selectedCompany` state is deleted. It was `useState("")` with no setter and always matched everything.
3. A failed fetch shows an error card, was a false empty-results message.
4. `question.id` is dropped from the payload. It was only a React key, now the link index.
5. Sorting by acceptance treats an unknown value as `-1`, so those 118 rows sort below every known value. Today `parseFloat("")` yields `NaN`, every comparison is false, and their position is left to chance. The new behaviour is deterministic.
