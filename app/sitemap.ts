import type { MetadataRoute } from "next";
import { SITEMAP_ENTRIES } from "@/lib/sitemap/generated";
import { STATIC_TRUST_PAGES, TRUST_PAGES_LAST_MODIFIED } from "@/lib/sitemap/static-pages";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const BUILD_DATE = new Date("2026-07-07");

export default function sitemap(): MetadataRoute.Sitemap {
  const seen = new Set(SITEMAP_ENTRIES.map((entry) => entry.path));
  const extras = STATIC_TRUST_PAGES.filter((entry) => !seen.has(entry.path));
  return [
    ...SITEMAP_ENTRIES.map((entry) => ({
      url: `${SITE_URL}${entry.path}`,
      lastModified: BUILD_DATE,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...extras.map((entry) => ({
      url: `${SITE_URL}${entry.path}`,
      lastModified: TRUST_PAGES_LAST_MODIFIED,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
  ];
}
