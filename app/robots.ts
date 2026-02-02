/**
 * Dynamic Robots.txt Generation
 * Controls search engine crawling behavior
 */

import { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = seoConfig.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/", "/_next/", "/private/"],
      },
      {
        // Google-specific rules for better crawling
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
