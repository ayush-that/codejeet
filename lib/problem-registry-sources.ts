import fs from "fs/promises";
import path from "path";

export async function loadScrapedProblemSources<T extends { slug?: unknown }>(
  problemsDir: string
): Promise<Map<string, T>> {
  let files: string[];
  try {
    files = await fs.readdir(problemsDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Map();
    throw error;
  }

  const map = new Map<string, T>();
  const sourceFiles = new Map<string, string>();
  const jsonFiles = files
    .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
    .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));

  for (const file of jsonFiles) {
    const content = await fs.readFile(path.join(problemsDir, file), "utf8");
    const data = JSON.parse(content) as T;
    if (typeof data.slug !== "string" || data.slug.length === 0) continue;
    const existingFile = sourceFiles.get(data.slug);
    if (existingFile) {
      throw new Error(`Duplicate scraped problem slug ${data.slug} in ${existingFile} and ${file}`);
    }
    sourceFiles.set(data.slug, file);
    map.set(data.slug, data);
  }

  return map;
}
