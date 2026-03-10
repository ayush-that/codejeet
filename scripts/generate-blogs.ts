import fs from "fs/promises";
import path from "path";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const API_URL = "https://api.deepseek.com/chat/completions";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const DATA_DIR = path.join(process.cwd(), "public", "data");
const CONCURRENCY = 500;
const BUDGET = 100;

interface CompanyProfile {
  slug: string;
  displayName: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
  topTopics: { name: string; slug: string; count: number }[];
}

interface TopicProfile {
  name: string;
  slug: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
  topCompanies: { name: string; slug: string; count: number }[];
}

let totalCost = 0;
let totalTokens = 0;
let generated = 0;
let skipped = 0;
let failed = 0;

async function callDeepSeek(prompt: string, systemPrompt: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
    usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };

  const usage = data.usage;
  totalCost +=
    (usage.prompt_tokens / 1_000_000) * 0.28 + (usage.completion_tokens / 1_000_000) * 0.42;
  totalTokens += usage.total_tokens;

  return data.choices[0].message.content;
}

interface BlogTask {
  fileName: string;
  frontmatter: string;
  prompt: string;
}

const SYSTEM_PROMPT = `You are a senior software engineer and technical writer for CodeJeet, a coding interview prep website. You have conducted and passed hundreds of coding interviews at top tech companies. Write in-depth, expert-level content that provides genuine value — the kind of advice a senior engineer would give a friend preparing for interviews.

Quality requirements:
- Every post must have a unique angle. Do NOT produce generic "study hard and practice" advice. Provide specific problem-solving strategies, pattern recognition tips, and insider knowledge about how interviews actually work.
- Code examples must be complete, well-commented, and demonstrate the actual pattern being discussed. Every code example must include time and space complexity analysis in a comment or following paragraph.
- Vary your writing structure between posts. Do not follow the exact same template every time — mix up section ordering, use different rhetorical approaches (e.g., start with a common mistake, lead with a story, open with a surprising statistic).
- Reference specific LeetCode problem numbers and names when discussing patterns (e.g., "Two Sum (#1)", "Merge Intervals (#56)").
- Write as if explaining to a friend who is a decent programmer but new to interview prep. Be conversational but precise. No fluff, no emojis. Every sentence should be useful.

Use markdown formatting with ## headings.

IMPORTANT: Include code examples in Python, JavaScript, and Java wherever you discuss algorithms or patterns. Wrap multi-language code examples in <div class="code-group"> tags like this:

<div class="code-group">

\`\`\`python
# Time: O(n) | Space: O(1)
def example():
    pass
\`\`\`

\`\`\`javascript
// Time: O(n) | Space: O(1)
function example() {}
\`\`\`

\`\`\`java
// Time: O(n) | Space: O(1)
public void example() {}
\`\`\`

</div>

Do NOT include the frontmatter — only the markdown body content.`;

function dateStr(baseDate: Date, offsetDays: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

async function runBatch(tasks: BlogTask[]): Promise<void> {
  const results = await Promise.allSettled(
    tasks.map(async (task) => {
      const content = await callDeepSeek(task.prompt, SYSTEM_PROMPT);
      await fs.writeFile(
        path.join(BLOG_DIR, `${task.fileName}.md`),
        `${task.frontmatter}\n\n${content}\n`
      );
      generated++;
      return task.fileName;
    })
  );

  for (const r of results) {
    if (r.status === "fulfilled") {
      process.stdout.write(`  [${generated}] ${r.value} — $${totalCost.toFixed(4)}\n`);
    } else {
      failed++;
      process.stdout.write(`  FAIL: ${(r.reason as Error).message?.slice(0, 80)}\n`);
    }
  }
}

async function main() {
  await fs.mkdir(BLOG_DIR, { recursive: true });

  const existingFiles = new Set(
    (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
  );

  const companyProfiles: Record<string, CompanyProfile> = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "company-profiles.json"), "utf8")
  );
  const topicProfiles: Record<string, TopicProfile> = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "topic-profiles.json"), "utf8")
  );

  const companies = Object.values(companyProfiles)
    .sort((a, b) => b.questionCount - a.questionCount)
    .filter((c) => c.questionCount >= 3);
  const topics = Object.values(topicProfiles)
    .sort((a, b) => b.questionCount - a.questionCount)
    .filter((t) => t.questionCount >= 3);

  const allTasks: BlogTask[] = [];
  const baseDate = new Date("2026-01-05");
  let dayOffset = 0;

  // Company guides
  for (const c of companies) {
    const fileName = `how-to-crack-${c.slug}-coding-interviews`;
    if (existingFiles.has(fileName)) {
      skipped++;
      continue;
    }

    const date = dateStr(baseDate, dayOffset);
    dayOffset += 2;
    const total = c.questionCount;
    const easyPct = Math.round((c.difficultyDist.easy / total) * 100);
    const medPct = Math.round((c.difficultyDist.medium / total) * 100);
    const hardPct = Math.round((c.difficultyDist.hard / total) * 100);
    const topTopics = c.topTopics
      .slice(0, 5)
      .map((t) => t.name)
      .join(", ");

    allTasks.push({
      fileName,
      frontmatter: `---
title: "How to Crack ${c.displayName} Coding Interviews in 2026"
description: "Complete guide to ${c.displayName} coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "${date}"
category: "company-guide"
company: "${c.slug}"
tags: ["${c.slug}", "interview prep", "leetcode"]
---`,
      prompt: `Write a 900-1400 word blog post: "How to Crack ${c.displayName} Coding Interviews in 2026"

Data: ${total} questions. Easy: ${c.difficultyDist.easy} (${easyPct}%), Medium: ${c.difficultyDist.medium} (${medPct}%), Hard: ${c.difficultyDist.hard} (${hardPct}%). Top topics: ${topTopics}.

Structure:
1. Brief intro about ${c.displayName}'s interview process — mention specific rounds, timing, and what makes their process unique
2. ## What Makes ${c.displayName} Different — what sets this company's interview style apart from other FAANG/top companies (e.g., do they favor system design more? do they allow pseudocode? do they emphasize optimization?)
3. ## By the Numbers — difficulty breakdown and what it means for your prep. Reference specific LeetCode problems that are known to appear
4. ## Top Topics to Focus On — each topic with 2-3 sentences explaining WHY this company favors it, plus a code example showing the most important pattern. Reference specific problem numbers
5. ## Preparation Strategy — 4-6 week study plan with specific weekly goals and problem counts
6. ## Common Mistakes — 3-4 mistakes candidates specifically make when interviewing at ${c.displayName}, with actionable fixes
7. ## Key Tips — 3-5 actionable, specific tips (not generic advice like "practice more")
8. End with: [Browse all ${c.displayName} questions on CodeJeet](/company/${c.slug})

Include at least 3 <div class="code-group"> blocks with Python/JavaScript/Java showing key patterns for this company's top topics. Each code example must include time and space complexity comments. Use specific problem examples from ${c.displayName}'s question bank where possible.`,
    });
  }

  // Topic guides
  for (const t of topics) {
    const fileName = `${t.slug}-interview-questions-patterns`;
    if (existingFiles.has(fileName)) {
      skipped++;
      continue;
    }

    const date = dateStr(baseDate, dayOffset);
    dayOffset += 2;
    const total = t.questionCount;
    const easyPct = Math.round((t.difficultyDist.easy / total) * 100);
    const medPct = Math.round((t.difficultyDist.medium / total) * 100);
    const hardPct = Math.round((t.difficultyDist.hard / total) * 100);
    const topCompanies = t.topCompanies
      .slice(0, 5)
      .map((c) => c.name)
      .join(", ");

    allTasks.push({
      fileName,
      frontmatter: `---
title: "${t.name} Interview Questions: Patterns and Strategies"
description: "Master ${t.name} problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "${date}"
category: "dsa-patterns"
tags: ["${t.slug}", "dsa", "interview prep"]
---`,
      prompt: `Write a 800-1200 word blog post: "${t.name} Interview Questions: Patterns and Strategies"

Data: ${total} questions. Easy: ${t.difficultyDist.easy} (${easyPct}%), Medium: ${t.difficultyDist.medium} (${medPct}%), Hard: ${t.difficultyDist.hard} (${hardPct}%). Top companies: ${topCompanies}.

Structure:
1. Brief intro about why ${t.name} matters in interviews — include a specific example of a problem that catches candidates off guard
2. ## Common Patterns — 3-4 patterns with code examples. For each pattern, name 2-3 specific LeetCode problems that use it. Explain the intuition behind each pattern, not just the code
3. ## When to Use ${t.name} vs Alternatives — explain how to recognize when a problem needs this technique vs similar approaches (e.g., when to use BFS vs DFS, when to use a hash map vs sorting). Include decision criteria
4. ## Edge Cases and Gotchas — 3-4 specific traps and edge cases that interviewers love to test for this topic (e.g., empty input, overflow, off-by-one). Show how to handle them
5. ## Difficulty Breakdown — what the split means for study prioritization
6. ## Which Companies Ask ${t.name} — top companies with links (/company/[slug]) and what style of ${t.name} problems each company prefers
7. ## Study Tips — 3-4 practical, specific tips with recommended problem order
8. End with: [Practice all ${t.name} questions on CodeJeet](/topic/${t.slug})

Include at least 3 <div class="code-group"> blocks showing key patterns in Python/JavaScript/Java. Each must include time and space complexity analysis. Show the complexity tradeoffs between different approaches.`,
    });
  }

  // Comparison blogs (top 50 companies = 1,225 pairs)
  const top50 = companies.slice(0, 50);
  for (let i = 0; i < top50.length; i++) {
    for (let j = i + 1; j < top50.length; j++) {
      const a = top50[i],
        b = top50[j];
      const fileName = `${a.slug}-vs-${b.slug}-interview-comparison`;
      if (existingFiles.has(fileName)) {
        skipped++;
        continue;
      }

      const date = dateStr(baseDate, dayOffset);
      dayOffset += 2;

      allTasks.push({
        fileName,
        frontmatter: `---
title: "${a.displayName} vs ${b.displayName}: Interview Question Comparison"
description: "Compare coding interview questions at ${a.displayName} and ${b.displayName} — difficulty levels, topic focus, and preparation strategy."
date: "${date}"
category: "tips"
tags: ["${a.slug}", "${b.slug}", "comparison"]
---`,
        prompt: `Write a 600-1000 word comparison: "${a.displayName} vs ${b.displayName}: Interview Question Comparison"

${a.displayName}: ${a.questionCount}q (E${a.difficultyDist.easy}/M${a.difficultyDist.medium}/H${a.difficultyDist.hard}). Topics: ${a.topTopics
          .slice(0, 4)
          .map((t) => t.name)
          .join(", ")}
${b.displayName}: ${b.questionCount}q (E${b.difficultyDist.easy}/M${b.difficultyDist.medium}/H${b.difficultyDist.hard}). Topics: ${b.topTopics
          .slice(0, 4)
          .map((t) => t.name)
          .join(", ")}

Structure:
1. Brief intro — if someone is interviewing at both companies (or choosing between them), what should they know?
2. ## Question Volume and Difficulty — compare the numbers and what they imply about interview intensity
3. ## Topic Overlap — which topics both companies test heavily (shared prep value) and which are unique to each
4. ## Preparation Priority Matrix — a clear breakdown: topics that overlap (study first for max ROI), topics unique to ${a.displayName}, and topics unique to ${b.displayName}. Recommend specific LeetCode problems that are useful for both
5. ## Interview Format Differences — compare how each company structures their coding rounds (number of rounds, time per problem, on-site vs virtual, behavioral weight, system design expectations)
6. ## Specific Problem Recommendations — recommend 3-5 problems for someone interviewing at both companies, explaining why each is valuable
7. ## Which to Prepare for First — strategic advice on ordering
End with links to /company/${a.slug} and /company/${b.slug}`,
      });
    }
  }

  // Company x Topic deep dives (top 100 companies x top 20 topics)
  const top100 = companies.slice(0, 100);
  const top20Topics = topics.slice(0, 20);
  for (const company of top100) {
    for (const topic of top20Topics) {
      const match = company.topTopics.find((t) => t.slug === topic.slug);
      if (!match || match.count < 2) continue;

      const fileName = `${company.slug}-${topic.slug}-interview-questions`;
      if (existingFiles.has(fileName)) {
        skipped++;
        continue;
      }

      const date = dateStr(baseDate, dayOffset);
      dayOffset += 2;

      allTasks.push({
        fileName,
        frontmatter: `---
title: "${topic.name} Questions at ${company.displayName}: What to Expect"
description: "Prepare for ${topic.name} interview questions at ${company.displayName} — patterns, difficulty breakdown, and study tips."
date: "${date}"
category: "dsa-patterns"
tags: ["${company.slug}", "${topic.slug}", "interview prep"]
---`,
        prompt: `Write a 600-1000 word post: "${topic.name} Questions at ${company.displayName}: What to Expect"

${company.displayName} has ${match.count} ${topic.name} questions out of ${company.questionCount} total.

Structure:
1. Why ${topic.name} matters at ${company.displayName} — is it a core focus area or a secondary topic? How often does it appear in real interviews?
2. ## Specific Patterns ${company.displayName} Favors — what types of ${topic.name} problems does this company prefer? (e.g., do they lean toward graph traversal or graph theory? iterative or recursive DP?) Reference specific LeetCode problems where possible
3. ## How to Prepare — study tips with code examples showing the most common pattern variations
4. ## How ${company.displayName} Tests ${topic.name} vs Other Companies — compare the style and difficulty of ${topic.name} questions here vs at other major companies. What's unique about this company's approach?
5. ## Study Order — a numbered list of sub-topics/patterns to learn in order, with reasoning for why this order works (e.g., "Start with basic BFS/DFS before attempting shortest path problems because...")
6. ## Recommended Practice Order — specific problems to solve in sequence
End with: [Practice ${topic.name} at ${company.displayName}](/company/${company.slug}/${topic.slug})

Include at least 2 <div class="code-group"> blocks with key patterns in Python/JavaScript/Java. Each must include time and space complexity.`,
      });
    }
  }

  // Difficulty-specific guides per company (top 50 companies x 3 difficulties)
  for (const company of top50) {
    for (const diff of ["easy", "medium", "hard"] as const) {
      const count = company.difficultyDist[diff];
      if (count < 3) continue;

      const fileName = `${company.slug}-${diff}-interview-questions-guide`;
      if (existingFiles.has(fileName)) {
        skipped++;
        continue;
      }

      const date = dateStr(baseDate, dayOffset);
      dayOffset += 2;
      const diffLabel = diff.charAt(0).toUpperCase() + diff.slice(1);

      allTasks.push({
        fileName,
        frontmatter: `---
title: "${diffLabel} ${company.displayName} Interview Questions: Strategy Guide"
description: "How to tackle ${count} ${diffLabel.toLowerCase()} difficulty questions from ${company.displayName} — patterns, time targets, and practice tips."
date: "${date}"
category: "tips"
tags: ["${company.slug}", "${diff}", "interview prep"]
---`,
        prompt: `Write a 600-900 word post: "${diffLabel} ${company.displayName} Interview Questions: Strategy Guide"

${company.displayName} has ${count} ${diffLabel} questions out of ${company.questionCount} total.

Structure:
1. Brief intro about what ${diffLabel} questions at ${company.displayName} look like — what separates ${diffLabel} from other difficulties at this company?
2. ## Common Patterns and Templates — what types of ${diffLabel} problems this company favors. Include a code template showing the most common pattern for ${diffLabel} problems at ${company.displayName}
3. ## Time Benchmarks and What Interviewers Look For — how fast you should solve ${diffLabel} problems in interviews, what signals interviewers watch for beyond just getting the right answer (e.g., code quality, edge case handling, communication)
4. ## ${diff === "easy" ? "Building a Foundation for Medium Problems" : diff === "medium" ? "Key Differences from Easy Problems" : "Upgrading from Medium to Hard"} — explain the specific skills and patterns that differentiate this difficulty level from the adjacent one. What new techniques are required? What mindset shifts are needed?
5. ## Specific Patterns for ${diffLabel} — 2-3 patterns with brief code snippets that are characteristic of ${diffLabel} problems at ${company.displayName}
6. ## Practice Strategy — how to use these questions effectively, with a recommended order and daily targets
End with: [Practice ${diffLabel} ${company.displayName} questions](/company/${company.slug}/${diff})

Include at least 1 <div class="code-group"> block showing a key pattern template in Python/JavaScript/Java with time and space complexity.`,
      });
    }
  }

  console.log(`Total tasks: ${allTasks.length} (skipping ${skipped} existing)`);
  console.log(`Running with concurrency ${CONCURRENCY}...\n`);

  // Process in batches
  for (let i = 0; i < allTasks.length; i += CONCURRENCY) {
    if (totalCost >= BUDGET) {
      console.log(`\nBudget limit reached ($${totalCost.toFixed(4)}). Stopping.`);
      break;
    }

    const batch = allTasks.slice(i, i + CONCURRENCY);
    await runBatch(batch);
    process.stdout.write(
      `  --- Batch done. ${generated} generated, $${totalCost.toFixed(4)} spent ---\n`
    );
  }

  console.log(`\n=== DONE ===`);
  console.log(`Generated: ${generated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Tokens: ${totalTokens.toLocaleString()}`);
  console.log(`Cost: $${totalCost.toFixed(4)}`);
  console.log(`Remaining: ~$${(1.94 - totalCost).toFixed(4)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
