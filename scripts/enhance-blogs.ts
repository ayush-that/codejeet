import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const API_URL = "https://api.deepseek.com/chat/completions";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const CONCURRENCY = 10;

let totalCost = 0;
let totalTokens = 0;
let enhanced = 0;
let skipped = 0;

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
      temperature: 0.5,
      max_tokens: 8000,
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

const SYSTEM_PROMPT = `You are enhancing existing blog posts for CodeJeet, a coding interview prep website. Your job is to ADD code examples and diagrams to make the content more practical and in-depth.

Rules:
1. Keep ALL existing content — do not remove or significantly rewrite existing text
2. ADD code examples in Python, JavaScript, and Java wherever algorithms or data structures are discussed
3. Wrap multi-language code blocks in <div class="code-group"> tags:

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

4. Add more depth — expand brief sections with practical details
5. Do NOT include frontmatter — only return the markdown body
6. Do NOT add emojis
7. Make the post at least 50% longer than the original with the code additions
8. Fix any dates that say 2025 to 2026`;

async function enhanceFile(filePath: string): Promise<boolean> {
  const raw = await fs.readFile(filePath, "utf8");
  const { data: frontmatter, content } = matter(raw);

  // Skip if already has code-group (already enhanced)
  if (content.includes('class="code-group"')) {
    return false;
  }

  const prompt = `Here is a blog post that needs code examples and more depth. Enhance it by adding multi-language code examples (Python, JavaScript, Java) wrapped in <div class="code-group"> tags wherever algorithms, patterns, or data structures are discussed. Make it more practical and in-depth. Keep all existing content.

Current post:
${content}`;

  const enhanced_content = await callDeepSeek(prompt, SYSTEM_PROMPT);

  // Fix dates in frontmatter
  if (frontmatter.date && frontmatter.date.startsWith("2025")) {
    frontmatter.date = frontmatter.date.replace("2025", "2026");
  }
  if (frontmatter.title && frontmatter.title.includes("2025")) {
    frontmatter.title = frontmatter.title.replace("2025", "2026");
  }

  // Rebuild file with frontmatter + enhanced content
  const newFrontmatter = Object.entries(frontmatter)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`;
      if (typeof v === "string" && (v.includes(":") || v.includes('"') || v.includes("'")))
        return `${k}: "${v.replace(/"/g, '\\"')}"`;
      return `${k}: "${v}"`;
    })
    .join("\n");

  await fs.writeFile(filePath, `---\n${newFrontmatter}\n---\n\n${enhanced_content}\n`);
  return true;
}

async function main() {
  const files = (await fs.readdir(BLOG_DIR))
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(BLOG_DIR, f));

  console.log(`Found ${files.length} blog files to check for enhancement.\n`);

  // Process in batches
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);

    const results = await Promise.allSettled(
      batch.map(async (f) => {
        const wasEnhanced = await enhanceFile(f);
        return { file: path.basename(f), wasEnhanced };
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") {
        if (r.value.wasEnhanced) {
          enhanced++;
          console.log(`  [${enhanced}] Enhanced: ${r.value.file} — $${totalCost.toFixed(4)}`);
        } else {
          skipped++;
        }
      } else {
        console.log(`  FAIL: ${(r.reason as Error).message?.slice(0, 100)}`);
      }
    }

    console.log(`  --- Batch ${Math.floor(i / CONCURRENCY) + 1} done ---`);
  }

  console.log(`\n=== DONE ===`);
  console.log(`Enhanced: ${enhanced}`);
  console.log(`Skipped (already had code): ${skipped}`);
  console.log(`Tokens: ${totalTokens.toLocaleString()}`);
  console.log(`Cost: $${totalCost.toFixed(4)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
