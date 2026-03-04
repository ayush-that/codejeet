import fs from "fs/promises";
import path from "path";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const API_URL = "https://api.deepseek.com/chat/completions";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const PROBLEMS_DIR = path.join(process.cwd(), "public", "data", "problems");
const CONCURRENCY = 500;
const BUDGET = 1.32;

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  topics: string[];
  question: string;
  hints: string[];
  total_accepted: number;
  acceptance_rate: string;
  similar_questions: { title: string; slug: string; difficulty: string }[];
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

const SYSTEM_PROMPT = `You are an expert technical writer for CodeJeet, a coding interview prep website. Write solution guides that are direct and practical. No fluff, no emojis. Every sentence should be useful. Use markdown formatting with ## headings.

IMPORTANT: Include complete, working code solutions in Python, JavaScript, and Java. Wrap multi-language code examples in <div class="code-group"> tags like this:

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

  const problemFiles = (await fs.readdir(PROBLEMS_DIR)).filter((f) => f.endsWith(".json"));
  const problems: Problem[] = [];

  for (const file of problemFiles) {
    const data = JSON.parse(await fs.readFile(path.join(PROBLEMS_DIR, file), "utf8"));
    if (data.question && data.topics?.length > 0) {
      problems.push(data);
    }
  }

  problems.sort((a, b) => (b.total_accepted || 0) - (a.total_accepted || 0));

  const allTasks: BlogTask[] = [];
  const baseDate = new Date("2026-02-01");
  let dayOffset = 0;

  for (const p of problems) {
    const fileName = `how-to-solve-${p.slug}`;
    if (existingFiles.has(fileName)) {
      skipped++;
      continue;
    }

    const date = dateStr(baseDate, dayOffset);
    dayOffset++;
    const topics = p.topics.slice(0, 5).join(", ");
    const similar = (p.similar_questions || [])
      .slice(0, 3)
      .map((s) => `${s.title} (${s.difficulty})`)
      .join(", ");
    const questionSnippet = (p.question || "").slice(0, 300);

    allTasks.push({
      fileName,
      frontmatter: `---
title: "How to Solve ${p.title} — LeetCode ${p.difficulty}"
description: "Step-by-step solution guide for LeetCode ${p.title}. ${p.difficulty} difficulty, ${p.acceptance_rate} acceptance rate. Topics: ${topics}."
date: "${date}"
category: "dsa-patterns"
tags: ${JSON.stringify([p.slug, ...p.topics.slice(0, 3).map((t) => t.toLowerCase().replace(/ /g, "-")), p.difficulty.toLowerCase()])}
---`,
      prompt: `Write a 500-800 word solution guide: "How to Solve ${p.title}"

Problem: ${questionSnippet}
Difficulty: ${p.difficulty}
Topics: ${topics}
Acceptance: ${p.acceptance_rate}
${similar ? `Similar problems: ${similar}` : ""}

Structure:
1. Brief problem restatement (1-2 sentences, don't copy the full problem)
2. ## Approach — explain the intuition and algorithm step by step
3. ## Solution — complete working code in Python, JavaScript, and Java wrapped in <div class="code-group">
4. ## Complexity Analysis — time and space complexity with explanation
5. ## Key Takeaways — 2-3 bullet points about what pattern this teaches
${
  similar
    ? `6. End with: Related problems: ${(p.similar_questions || [])
        .slice(0, 3)
        .map((s) => `[${s.title}](/problem/${s.slug})`)
        .join(", ")}`
    : `6. End with: [Practice this problem on CodeJeet](/problem/${p.slug})`
}

Include the complete solution code in a <div class="code-group"> with Python/JavaScript/Java.`,
    });
  }

  console.log(`Total tasks: ${allTasks.length} (skipping ${skipped} existing)`);
  console.log(`Budget: $${BUDGET}`);
  console.log(`Running with concurrency ${CONCURRENCY}...\n`);

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
  console.log(`Remaining: ~$${(BUDGET - totalCost).toFixed(4)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
