import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { clampBlogDate } from "../lib/blog/dates";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const OUT_DIR = path.join(process.cwd(), "public", "data", "blog");

export interface BlogPostJson {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  company?: string;
  tags?: string[];
  content: string;
}

async function main() {
  let files: string[];
  try {
    files = (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    console.warn("No content/blog directory found, skipping blog JSON generation");
    return;
  }

  const indexPath = path.join(process.cwd(), "public", "data", "blog-index.json");
  const dateBySlug = new Map<string, string>();
  try {
    const index = JSON.parse(await fs.readFile(indexPath, "utf8")) as {
      slug: string;
      date: string;
    }[];
    for (const entry of index) {
      dateBySlug.set(entry.slug, entry.date);
    }
  } catch {
    // blog-index.json is optional when build-data has not run yet
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  const today = new Date().toISOString().split("T")[0];
  let written = 0;
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const rawDate = dateBySlug.get(slug) ?? (data.date as string) ?? "";
    const date = clampBlogDate(rawDate, today);

    const post: BlogPostJson = {
      slug,
      title: (data.title as string) ?? "",
      description: (data.description as string) ?? "",
      date,
      category: (data.category as string) ?? "",
      content,
    };
    if (data.company) post.company = data.company as string;
    if (Array.isArray(data.tags)) post.tags = data.tags as string[];

    await fs.writeFile(path.join(OUT_DIR, `${slug}.json`), JSON.stringify(post));
    written++;
  }

  console.log(`Wrote ${written} blog post(s) to ${path.relative(process.cwd(), OUT_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
