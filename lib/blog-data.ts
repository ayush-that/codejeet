import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "data");
const BLOG_DIR = path.join(DATA_DIR, "blog");

const cache = new Map<string, unknown>();

async function fetchFromAssets<T>(dataPath: string): Promise<T> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext();
  const res = await env.ASSETS.fetch(new Request(`http://assets.local/data/${dataPath}`));
  if (!res.ok) throw new Error(`Asset fetch failed: /data/${dataPath} (${res.status})`);
  return (await res.json()) as T;
}

async function readJson<T>(filePath: string): Promise<T> {
  const cached = cache.get(filePath);
  if (cached) return cached as T;

  let data: T;
  try {
    data = JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    const relativePath = filePath.substring(DATA_DIR.length + 1);
    data = await fetchFromAssets<T>(relativePath);
  }

  cache.set(filePath, data);
  return data;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  company?: string;
  tags?: string[];
  content: string;
}

export interface BlogIndexEntry {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export async function getBlogIndex(): Promise<BlogIndexEntry[]> {
  return readJson(path.join(DATA_DIR, "blog-index.json"));
}

export async function getBlogSlugs(): Promise<string[]> {
  const index = await getBlogIndex();
  return index.map((p) => p.slug);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.json`);
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as BlogPost;
  } catch {
    try {
      return await fetchFromAssets<BlogPost>(`blog/${slug}.json`);
    } catch {
      return null;
    }
  }
}
