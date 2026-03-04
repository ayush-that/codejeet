import type { MetadataRoute } from "next";
import { getSitemapUrls } from "@/lib/pseo-data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await getSitemapUrls();
  return urls.map((u) => ({
    url: `https://codejeet.com${u.path}`,
    lastModified: new Date(),
    changeFrequency: u.changeFrequency as "weekly" | "monthly" | "daily",
    priority: u.priority,
  }));
}
