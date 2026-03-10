import type { MetadataRoute } from "next";
import { getSitemapUrls } from "@/lib/pseo-data";

export const dynamic = "force-static";

const SITE_URL = "https://codejeet.com";

/** Fixed build date — avoids misleading per-page "now" timestamps. */
const BUILD_DATE = new Date("2025-06-01");

type SitemapGroup = "static" | "company" | "problem" | "topic";

function classifyUrl(urlPath: string): SitemapGroup {
  if (urlPath.startsWith("/company/")) return "company";
  if (urlPath.startsWith("/problem/")) return "problem";
  if (urlPath.startsWith("/topic/")) return "topic";
  return "static";
}

const GROUP_IDS: SitemapGroup[] = ["static", "company", "problem", "topic"];

export async function generateSitemaps() {
  return GROUP_IDS.map((id) => ({ id }));
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const allUrls = await getSitemapUrls();
  const group = id as SitemapGroup;

  return allUrls
    .filter((u) => classifyUrl(u.path) === group)
    .map((u) => ({
      url: `${SITE_URL}${u.path}`,
      lastModified: BUILD_DATE,
      changeFrequency: u.changeFrequency as "weekly" | "monthly" | "daily",
      priority: u.priority,
    }));
}
