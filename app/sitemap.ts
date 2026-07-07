import type { MetadataRoute } from "next";
import { SITEMAP_ENTRIES } from "@/lib/sitemap/generated";

export const dynamic = "force-static";

const SITE_URL = "https://codejeet.com";

const BUILD_DATE = new Date("2026-07-07");

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_ENTRIES.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: BUILD_DATE,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
