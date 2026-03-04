import fs from "fs/promises";
import path from "path";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const API_URL = "https://api.deepseek.com/chat/completions";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const DATA_DIR = path.join(process.cwd(), "public", "data");
const CONCURRENCY = 500;
const BUDGET = 1.94;

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
      max_tokens: 4096,
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

const SYSTEM_PROMPT = `You are an expert technical writer for CodeJeet, a coding interview prep website. Write in a direct, practical style. No fluff, no emojis. Every sentence should be useful. Use markdown formatting with ## headings.

IMPORTANT: Include code examples in Python, JavaScript, and Java wherever you discuss algorithms or patterns. Wrap multi-language code examples in <div class="code-group"> tags like this:

<div class="code-group">

\`\`\`python
def example():
    pass
\`\`\`

\`\`\`javascript
function example() {}
\`\`\`

\`\`\`java
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
      prompt: `Write a 600-900 word blog post: "How to Crack ${c.displayName} Coding Interviews in 2026"

Data: ${total} questions. Easy: ${c.difficultyDist.easy} (${easyPct}%), Medium: ${c.difficultyDist.medium} (${medPct}%), Hard: ${c.difficultyDist.hard} (${hardPct}%). Top topics: ${topTopics}.

Structure:
1. Brief intro about ${c.displayName}'s interview process
2. ## By the Numbers — difficulty breakdown and what it means
3. ## Top Topics to Focus On — each topic with 1-2 sentences + a code example for the most important pattern
4. ## Preparation Strategy — 4-6 week study plan
5. ## Key Tips — 3-5 actionable tips
6. End with: [Browse all ${c.displayName} questions on CodeJeet](/company/${c.slug})

Include at least one <div class="code-group"> with Python/JavaScript/Java showing a key pattern for this company's top topic.`,
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
      prompt: `Write a 500-800 word blog post: "${t.name} Interview Questions: Patterns and Strategies"

Data: ${total} questions. Easy: ${t.difficultyDist.easy} (${easyPct}%), Medium: ${t.difficultyDist.medium} (${medPct}%), Hard: ${t.difficultyDist.hard} (${hardPct}%). Top companies: ${topCompanies}.

Structure:
1. Brief intro about why ${t.name} matters in interviews
2. ## Common Patterns — 3-4 patterns with code examples
3. ## Difficulty Breakdown — what the split means
4. ## Which Companies Ask ${t.name} — top companies with links (/company/[slug])
5. ## Study Tips — 3-4 practical tips
6. End with: [Practice all ${t.name} questions on CodeJeet](/topic/${t.slug})

Include at least 2 <div class="code-group"> blocks showing key patterns in Python/JavaScript/Java.`,
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
        prompt: `Write a 400-600 word comparison: "${a.displayName} vs ${b.displayName}: Interview Question Comparison"

${a.displayName}: ${a.questionCount}q (E${a.difficultyDist.easy}/M${a.difficultyDist.medium}/H${a.difficultyDist.hard}). Topics: ${a.topTopics
          .slice(0, 4)
          .map((t) => t.name)
          .join(", ")}
${b.displayName}: ${b.questionCount}q (E${b.difficultyDist.easy}/M${b.difficultyDist.medium}/H${b.difficultyDist.hard}). Topics: ${b.topTopics
          .slice(0, 4)
          .map((t) => t.name)
          .join(", ")}

Structure: intro, ## Question Volume and Difficulty, ## Topic Overlap, ## Which to Prepare for First
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
        prompt: `Write a 400-600 word post: "${topic.name} Questions at ${company.displayName}: What to Expect"

${company.displayName} has ${match.count} ${topic.name} questions out of ${company.questionCount} total.

Structure:
1. Why ${topic.name} matters at ${company.displayName}
2. ## What to Expect — types of problems
3. ## How to Prepare — study tips with one code example
4. ## Recommended Practice Order
End with: [Practice ${topic.name} at ${company.displayName}](/company/${company.slug}/${topic.slug})

Include one <div class="code-group"> with a key pattern in Python/JavaScript/Java.`,
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
        prompt: `Write a 400-500 word post: "${diffLabel} ${company.displayName} Interview Questions: Strategy Guide"

${company.displayName} has ${count} ${diffLabel} questions out of ${company.questionCount} total.

Structure:
1. Brief intro about what ${diffLabel} questions at ${company.displayName} look like
2. ## Common Patterns — what types of ${diffLabel} problems this company favors
3. ## Time Targets — how fast you should solve ${diffLabel} problems in interviews
4. ## Practice Strategy — how to use these questions effectively
End with: [Practice ${diffLabel} ${company.displayName} questions](/company/${company.slug}/${diff})`,
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
