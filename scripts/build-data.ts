import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { spreadBlogDates } from "../lib/blog/dates";
import { isCompareIndexable, parseComparePair } from "../lib/compare";
import { loadAllQuestions, type QuestionWithDetails } from "../lib/data";
import { capitalizeWords } from "../utils/utils";

interface ScrapedProblem {
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

interface DifficultyDist {
  easy: number;
  medium: number;
  hard: number;
}

interface CompanyProfile {
  slug: string;
  displayName: string;
  questionCount: number;
  difficultyDist: DifficultyDist;
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

interface TopicProfile {
  name: string;
  slug: string;
  questionCount: number;
  difficultyDist: DifficultyDist;
  topCompanies: { name: string; slug: string; count: number }[];
  questionSlugs: string[];
}

function topicSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-()]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[()]/g, "");
}

async function loadScrapedProblems(): Promise<Map<string, ScrapedProblem>> {
  const problemsDir = path.join(process.cwd(), "data", "problems");
  const map = new Map<string, ScrapedProblem>();

  try {
    const files = await fs.readdir(problemsDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json") && !f.startsWith("_"));

    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(problemsDir, file), "utf8");
      const data = JSON.parse(content) as ScrapedProblem;
      if (data.slug) {
        map.set(data.slug, data);
      }
    }
  } catch {
    console.warn("No scraped problems found in data/problems/, continuing with CSV data only");
  }

  return map;
}

async function main() {
  const { questions, companies } = await loadAllQuestions();
  const scraped = await loadScrapedProblems();
  console.log(`Loaded ${scraped.size} scraped problem details`);

  // Enrich questions with lightweight scraped metadata (no heavy HTML/markdown)
  // Also fix Is Premium flag: if scraper couldn't get content, the question is premium
  let enriched = 0;
  let enrichedQuestions = questions.map((q) => {
    const problem = scraped.get(q.slug);
    // Acceptance is sourced from the LeetCode-scraped problem JSON (clean), never
    // from the CSV. Re-scraping data/problems/*.json refreshes it on next build.
    const acStr = problem?.acceptance_rate || "";
    const base = { ...q, acceptance_rate: acStr ? parseFloat(acStr) : 0, "Acceptance %": acStr };
    if (problem && problem.content_html) {
      enriched++;
      return {
        ...base,
        "Is Premium": "N",
        category: problem.category || "",
        total_accepted: problem.total_accepted || 0,
        total_submissions: problem.total_submissions || 0,
        similar_questions: problem.similar_questions || [],
        hints: problem.hints || [],
        has_content: true,
        topics: q.topics.length > 0 ? q.topics : problem.topics || [],
        Topics: q.Topics || (problem.topics || []).join(", "),
      };
    }
    // No scraped content = premium question
    if (scraped.has(q.slug)) {
      return { ...base, "Is Premium": "Y" };
    }
    return base;
  });

  // Collapse per-timeframe duplicate rows into ONE record per (company, slug),
  // carrying the set of recency buckets it appears in. Without this, every list
  // view (dashboard, company pages) renders each problem up to 5x and balloons
  // the HTML/JSON. The dashboard's recency filter uses the `timeframes` array.
  const dedupMap = new Map<string, (typeof enrichedQuestions)[number] & { timeframes: string[] }>();
  for (const q of enrichedQuestions) {
    const key = `${q.company}|${q.slug}`;
    let rec = dedupMap.get(key);
    if (!rec) {
      rec = { ...q, timeframes: [] };
      dedupMap.set(key, rec);
    }
    if (q.timeframe && !rec.timeframes.includes(q.timeframe)) rec.timeframes.push(q.timeframe);
    // Canonical frequency = the all-time ("all") bucket.
    if (q.timeframe === "all") {
      rec.frequency = q.frequency;
      rec["Frequency %"] = q["Frequency %"];
    }
  }
  for (const r of dedupMap.values()) r.timeframes.sort();
  enrichedQuestions = Array.from(dedupMap.values());

  const topicSet = new Set<string>();
  for (const q of enrichedQuestions) {
    for (const topic of q.topics) {
      topicSet.add(topic);
    }
  }
  const topics = Array.from(topicSet).sort((a, b) => a.localeCompare(b));

  const outDir = path.join(process.cwd(), "public", "data");
  await fs.mkdir(outDir, { recursive: true });

  // Write main questions.json (lightweight, for dashboard listing). Strip the
  // heavy per-problem fields (hints, similar_questions, totals, category,
  // content) — those live only in public/data/problems/<slug>.json. Keeping them
  // here ballooned the file past Cloudflare's 25 MiB asset limit.
  const slimQuestions = enrichedQuestions.map((q) => ({
    id: q.id,
    slug: q.slug,
    title: q.title,
    difficulty: q.difficulty,
    Difficulty: q.Difficulty,
    acceptance_rate: q.acceptance_rate,
    "Acceptance %": q["Acceptance %"],
    link: q.link,
    URL: q.URL,
    company: q.company,
    frequency: q.frequency,
    "Frequency %": q["Frequency %"],
    timeframes: (q as { timeframes?: string[] }).timeframes ?? [],
    topics: q.topics,
    Topics: q.Topics,
    ID: q.ID,
    Title: q.Title,
    "Is Premium": q["Is Premium"],
  }));
  const outPath = path.join(outDir, "questions.json");
  await fs.writeFile(outPath, JSON.stringify({ questions: slimQuestions, companies, topics }));

  // Copy individual problem JSONs to public/data/problems/ (full content for problem pages)
  const problemsOutDir = path.join(outDir, "problems");
  await fs.mkdir(problemsOutDir, { recursive: true });

  let copied = 0;
  for (const [slug, problem] of scraped) {
    if (problem.content_html) {
      await fs.writeFile(path.join(problemsOutDir, `${slug}.json`), JSON.stringify(problem));
      copied++;
    }
  }

  console.log(
    `Wrote ${enrichedQuestions.length} questions (${enriched} enriched), ${companies.length} companies, ${topics.length} topics to ${outPath}`
  );
  console.log(`Copied ${copied} full problem files to ${problemsOutDir}`);

  // Copy podcast manifest to public/data/podcast.json
  const manifestSrc = path.join(process.cwd(), "data", "podcast-manifest.json");
  const manifestDest = path.join(outDir, "podcast.json");
  try {
    const manifestData = await fs.readFile(manifestSrc, "utf8");
    await fs.writeFile(manifestDest, manifestData);
    console.log(`Copied podcast manifest to ${manifestDest}`);
  } catch {
    console.warn("No audiobook manifest found, skipping podcast.json");
  }

  // === pSEO Data Generation ===
  console.log("\nGenerating pSEO aggregated data...");

  // 1. Build company profiles
  const companyMap = new Map<string, QuestionWithDetails[]>();
  for (const q of enrichedQuestions) {
    const list = companyMap.get(q.company) || [];
    list.push(q);
    companyMap.set(q.company, list);
  }

  const companyProfiles: Record<string, CompanyProfile> = {};
  for (const [slug, qs] of companyMap) {
    const dist: DifficultyDist = { easy: 0, medium: 0, hard: 0 };
    const topicCounts = new Map<string, number>();

    for (const q of qs) {
      if (q.difficulty === "Easy") dist.easy++;
      else if (q.difficulty === "Medium") dist.medium++;
      else dist.hard++;

      for (const t of q.topics) {
        topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
      }
    }

    const topTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, slug: topicSlug(name), count }));

    companyProfiles[slug] = {
      slug,
      displayName: capitalizeWords(slug),
      questionCount: qs.length,
      difficultyDist: dist,
      topTopics,
      questions: qs
        .sort((a, b) => b.frequency - a.frequency)
        .map((q) => ({
          slug: q.slug,
          title: q.title,
          difficulty: q.difficulty,
          acceptance: q["Acceptance %"],
          frequency: q["Frequency %"],
          topics: q.topics,
        })),
    };
  }

  await fs.writeFile(path.join(outDir, "company-profiles.json"), JSON.stringify(companyProfiles));
  console.log(`Wrote ${Object.keys(companyProfiles).length} company profiles`);

  // 2. Build problem-companies reverse map (which companies ask each problem)
  const problemCompanies: Record<string, string[]> = {};
  for (const q of enrichedQuestions) {
    if (!problemCompanies[q.slug]) {
      problemCompanies[q.slug] = [];
    }
    if (!problemCompanies[q.slug].includes(q.company)) {
      problemCompanies[q.slug].push(q.company);
    }
  }
  // Sort companies by frequency for each problem
  for (const slug of Object.keys(problemCompanies)) {
    problemCompanies[slug].sort();
  }

  await fs.writeFile(path.join(outDir, "problem-companies.json"), JSON.stringify(problemCompanies));
  console.log(`Wrote problem-companies map for ${Object.keys(problemCompanies).length} problems`);

  // 3. Build topic profiles
  const topicMap = new Map<
    string,
    { questions: Set<string>; companies: Map<string, number>; dist: DifficultyDist }
  >();
  for (const q of enrichedQuestions) {
    for (const t of q.topics) {
      if (!topicMap.has(t)) {
        topicMap.set(t, {
          questions: new Set(),
          companies: new Map(),
          dist: { easy: 0, medium: 0, hard: 0 },
        });
      }
      const entry = topicMap.get(t)!;
      if (!entry.questions.has(q.slug)) {
        entry.questions.add(q.slug);
        if (q.difficulty === "Easy") entry.dist.easy++;
        else if (q.difficulty === "Medium") entry.dist.medium++;
        else entry.dist.hard++;
      }
      entry.companies.set(q.company, (entry.companies.get(q.company) || 0) + 1);
    }
  }

  const topicProfiles: Record<string, TopicProfile> = {};
  for (const [name, data] of topicMap) {
    const slug = topicSlug(name);
    topicProfiles[slug] = {
      name,
      slug,
      questionCount: data.questions.size,
      difficultyDist: data.dist,
      topCompanies: Array.from(data.companies.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([compSlug, count]) => ({ name: capitalizeWords(compSlug), slug: compSlug, count })),
      questionSlugs: Array.from(data.questions),
    };
  }

  await fs.writeFile(path.join(outDir, "topic-profiles.json"), JSON.stringify(topicProfiles));
  console.log(`Wrote ${Object.keys(topicProfiles).length} topic profiles`);

  // 4. Build sitemap URL list
  const sitemapUrls: { path: string; priority: number; changeFrequency: string }[] = [];

  // Static pages
  sitemapUrls.push({ path: "/", priority: 1.0, changeFrequency: "weekly" });
  sitemapUrls.push({ path: "/dashboard", priority: 0.9, changeFrequency: "weekly" });
  sitemapUrls.push({ path: "/companies", priority: 0.9, changeFrequency: "weekly" });
  sitemapUrls.push({ path: "/podcast", priority: 0.6, changeFrequency: "monthly" });

  // Companies with fewer than 3 questions are noindex
  for (const slug of Object.keys(companyProfiles)) {
    const profile = companyProfiles[slug];
    if (profile.questionCount < 3) continue;
    sitemapUrls.push({
      path: `/company/${slug}`,
      priority: profile.questionCount >= 50 ? 0.8 : 0.7,
      changeFrequency: "weekly",
    });
  }

  // Problem pages
  for (const [slug, problem] of scraped) {
    if (problem.content_html) {
      sitemapUrls.push({ path: `/problem/${slug}`, priority: 0.7, changeFrequency: "monthly" });
    }
  }

  // Topic pages
  for (const slug of Object.keys(topicProfiles)) {
    sitemapUrls.push({ path: `/topic/${slug}`, priority: 0.8, changeFrequency: "weekly" });
  }

  // Difficulty pages
  for (const level of ["easy", "medium", "hard"]) {
    sitemapUrls.push({ path: `/difficulty/${level}`, priority: 0.6, changeFrequency: "monthly" });
  }

  await fs.writeFile(path.join(outDir, "sitemap-urls.json"), JSON.stringify(sitemapUrls));
  console.log(`Wrote ${sitemapUrls.length} sitemap URLs`);

  // 5. Build problem slugs list (for generateStaticParams)
  const problemSlugs = Array.from(scraped.entries())
    .filter(([, p]) => p.content_html)
    .map(([slug]) => slug);
  await fs.writeFile(path.join(outDir, "problem-slugs.json"), JSON.stringify(problemSlugs));
  console.log(`Wrote ${problemSlugs.length} problem slugs`);

  // === Cross-Product pSEO Pages ===
  console.log("\nGenerating cross-product page data...");

  // Build set of topic slugs and problem slugs with content for disambiguation
  const allTopicSlugs = new Set(Object.keys(topicProfiles));
  const problemSlugsWithContent = new Set(problemSlugs);
  const difficultyLevels = new Set(["easy", "medium", "hard"]);

  // 6. Company x Filter params (topic, difficulty, problem combos)
  const companyFilterParams: {
    slug: string;
    filter: string;
    type: "topic" | "difficulty" | "problem";
  }[] = [];

  for (const [companySlug, profile] of Object.entries(companyProfiles)) {
    // Company x Topic: generate for each topic this company has questions for
    const companyTopics = new Map<string, number>();
    for (const q of profile.questions) {
      for (const t of q.topics) {
        const ts = topicSlug(t);
        companyTopics.set(ts, (companyTopics.get(ts) || 0) + 1);
      }
    }
    for (const [ts, count] of companyTopics) {
      if (count >= 2 && allTopicSlugs.has(ts)) {
        companyFilterParams.push({ slug: companySlug, filter: ts, type: "topic" });
      }
    }

    // Company x Difficulty: generate for each difficulty level with questions
    for (const level of ["easy", "medium", "hard"] as const) {
      const count =
        level === "easy"
          ? profile.difficultyDist.easy
          : level === "medium"
            ? profile.difficultyDist.medium
            : profile.difficultyDist.hard;
      if (count >= 2) {
        companyFilterParams.push({ slug: companySlug, filter: level, type: "difficulty" });
      }
    }

    // Company x Problem: generate for each question this company asks (with content)
    for (const q of profile.questions) {
      if (problemSlugsWithContent.has(q.slug)) {
        companyFilterParams.push({ slug: companySlug, filter: q.slug, type: "problem" });
      }
    }
  }

  // Write filter params (used by generateStaticParams)
  await fs.writeFile(
    path.join(outDir, "company-filter-params.json"),
    JSON.stringify(companyFilterParams)
  );

  const topicFilterCount = companyFilterParams.filter((p) => p.type === "topic").length;
  const diffFilterCount = companyFilterParams.filter((p) => p.type === "difficulty").length;
  const problemFilterCount = companyFilterParams.filter((p) => p.type === "problem").length;
  console.log(
    `Wrote ${companyFilterParams.length} company filter params ` +
      `(${topicFilterCount} topic, ${diffFilterCount} difficulty, ${problemFilterCount} problem)`
  );

  // 7. Build comparison pairs (top 100 companies by question count)
  const sortedCompanies = Object.values(companyProfiles)
    .sort((a, b) => b.questionCount - a.questionCount)
    .filter((c) => c.questionCount >= 10);

  const topN = sortedCompanies.slice(0, 100);

  type CompareQuestion = {
    slug: string;
    title: string;
    difficulty: string;
    topics: string[];
  };

  type CompareTopicStat = {
    name: string;
    slug: string;
    count: number;
  };

  interface ComparisonPair {
    pair: string;
    companyA: {
      slug: string;
      displayName: string;
      questionCount: number;
      difficultyDist: DifficultyDist;
    };
    companyB: {
      slug: string;
      displayName: string;
      questionCount: number;
      difficultyDist: DifficultyDist;
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

  const comparisonPairs: ComparisonPair[] = [];

  let compareBlogSlugSet = new Set<string>();
  try {
    const compareBlogFiles = await fs.readdir(path.join(process.cwd(), "content", "blog"));
    compareBlogSlugSet = new Set(
      compareBlogFiles.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
    );
  } catch {
    // No blog directory during partial builds
  }

  // Pre-build question sets per company for fast overlap computation
  const companyQuestionSets = new Map<string, Set<string>>();
  for (const c of topN) {
    companyQuestionSets.set(c.slug, new Set(c.questions.map((q) => q.slug)));
  }

  function toCompareQuestion(q: CompanyProfile["questions"][number]): CompareQuestion {
    return {
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      topics: q.topics,
    };
  }

  function questionForSlug(slug: string, ...profiles: CompanyProfile[]): CompareQuestion | null {
    for (const profile of profiles) {
      const q = profile.questions.find((item) => item.slug === slug);
      if (q) return toCompareQuestion(q);
    }
    return null;
  }

  for (let i = 0; i < topN.length; i++) {
    for (let j = i + 1; j < topN.length; j++) {
      const a = topN[i];
      const b = topN[j];
      // Alphabetical ordering for consistent pair slug
      const [first, second] = a.slug < b.slug ? [a, b] : [b, a];
      const pair = `${first.slug}-vs-${second.slug}`;

      const setA = companyQuestionSets.get(first.slug)!;
      const setB = companyQuestionSets.get(second.slug)!;
      const shared = first.questions.map((q) => q.slug).filter((slug) => setB.has(slug));

      const topicCounts = new Map<string, number>();
      const sharedProblems: CompareQuestion[] = [];
      for (const slug of shared.slice(0, 30)) {
        const q = questionForSlug(slug, first, second);
        if (!q) continue;
        sharedProblems.push(q);
        for (const topic of q.topics) {
          topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
        }
      }

      const topSharedTopics: CompareTopicStat[] = Array.from(topicCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({
          name,
          slug: topicSlug(name),
          count,
        }));

      const exclusiveToA = first.questions
        .filter((q) => !setB.has(q.slug))
        .slice(0, 12)
        .map(toCompareQuestion);
      const exclusiveToB = second.questions
        .filter((q) => !setA.has(q.slug))
        .slice(0, 12)
        .map(toCompareQuestion);

      const parsed = parseComparePair(pair);
      const blogCandidates = parsed
        ? [
            `${parsed.companyA}-vs-${parsed.companyB}-interview-comparison`,
            `${parsed.companyB}-vs-${parsed.companyA}-interview-comparison`,
          ]
        : [];
      const blogSlug = blogCandidates.find((slug) => compareBlogSlugSet.has(slug));

      comparisonPairs.push({
        pair,
        companyA: {
          slug: first.slug,
          displayName: first.displayName,
          questionCount: first.questionCount,
          difficultyDist: first.difficultyDist,
        },
        companyB: {
          slug: second.slug,
          displayName: second.displayName,
          questionCount: second.questionCount,
          difficultyDist: second.difficultyDist,
        },
        sharedCount: shared.length,
        uniqueToACount: first.questionCount - shared.length,
        uniqueToBCount: second.questionCount - shared.length,
        sharedProblems,
        exclusiveToA,
        exclusiveToB,
        topSharedTopics,
        ...(blogSlug ? { blogSlug } : {}),
      });
    }
  }

  const compareDir = path.join(outDir, "compare");
  await fs.mkdir(compareDir, { recursive: true });

  const comparisonIndex = comparisonPairs.map((p) => ({
    pair: p.pair,
    companyA: {
      slug: p.companyA.slug,
      displayName: p.companyA.displayName,
      questionCount: p.companyA.questionCount,
    },
    companyB: {
      slug: p.companyB.slug,
      displayName: p.companyB.displayName,
      questionCount: p.companyB.questionCount,
    },
    sharedCount: p.sharedCount,
    uniqueToACount: p.uniqueToACount,
    uniqueToBCount: p.uniqueToBCount,
  }));

  await fs.writeFile(path.join(outDir, "comparison-index.json"), JSON.stringify(comparisonIndex));

  let compareFilesWritten = 0;
  for (const p of comparisonPairs) {
    if (!isCompareIndexable(p.sharedCount)) continue;
    await fs.writeFile(path.join(compareDir, `${p.pair}.json`), JSON.stringify(p));
    compareFilesWritten++;
  }

  try {
    await fs.unlink(path.join(outDir, "comparison-pairs.json"));
  } catch {
    // legacy monolith removed — per-pair files stay under Cloudflare's 25 MiB asset limit
  }

  console.log(
    `Wrote ${comparisonPairs.length} comparison index entries and ${compareFilesWritten} compare detail files`
  );

  // 8. Build filter type lookup (for page component to determine filter type)
  const filterTypeLookup: Record<string, "topic" | "difficulty"> = {};
  for (const ts of allTopicSlugs) {
    filterTypeLookup[ts] = "topic";
  }
  for (const d of difficultyLevels) {
    filterTypeLookup[d] = "difficulty";
  }
  await fs.writeFile(
    path.join(outDir, "filter-type-lookup.json"),
    JSON.stringify(filterTypeLookup)
  );

  sitemapUrls.push({ path: "/compare", priority: 0.8, changeFrequency: "weekly" });

  let indexableCompareCount = 0;
  for (const p of comparisonPairs) {
    if (!isCompareIndexable(p.sharedCount)) continue;
    indexableCompareCount++;
    const priority = p.sharedCount >= 50 ? 0.75 : p.sharedCount >= 20 ? 0.7 : 0.65;
    sitemapUrls.push({ path: `/compare/${p.pair}`, priority, changeFrequency: "monthly" });
  }
  console.log(`Added ${indexableCompareCount} indexable comparison URLs to sitemap`);

  // Blog pages
  const blogDir = path.join(process.cwd(), "content", "blog");
  try {
    const blogFiles = await fs.readdir(blogDir);
    const blogSlugs = blogFiles.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
    sitemapUrls.push({ path: "/blog", priority: 0.7, changeFrequency: "weekly" });
    for (const slug of blogSlugs) {
      sitemapUrls.push({ path: `/blog/${slug}`, priority: 0.7, changeFrequency: "monthly" });
    }
    console.log(`Added ${blogSlugs.length} blog URLs to sitemap`);
  } catch {
    console.log("No blog directory found, skipping blog URLs");
  }

  // Re-write sitemap with expanded URLs
  await fs.writeFile(path.join(outDir, "sitemap-urls.json"), JSON.stringify(sitemapUrls));
  console.log(`Updated sitemap to ${sitemapUrls.length} total URLs`);

  // === Blog Index Generation ===
  console.log("\nGenerating blog index...");
  try {
    const blogFiles = await fs.readdir(blogDir);
    const mdFiles = blogFiles.filter((f) => f.endsWith(".md"));

    const blogIndex: {
      slug: string;
      title: string;
      description: string;
      date: string;
      category: string;
    }[] = [];

    for (const file of mdFiles) {
      const raw = await fs.readFile(path.join(blogDir, file), "utf8");
      const { data } = matter(raw);
      blogIndex.push({
        slug: file.replace(/\.md$/, ""),
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        category: data.category ?? "",
      });
    }

    const datedIndex = spreadBlogDates(blogIndex);
    await fs.writeFile(path.join(outDir, "blog-index.json"), JSON.stringify(datedIndex));
    console.log(`Wrote ${datedIndex.length} blog entries to blog-index.json`);
  } catch {
    console.warn("No blog directory found, skipping blog-index.json");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
