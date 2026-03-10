import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/data/", "/api/", "/_next/static/", "/_next/data/"],
    },
    sitemap: "https://codejeet.com/sitemap.xml",
  };
}
