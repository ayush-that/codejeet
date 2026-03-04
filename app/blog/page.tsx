import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionJsonLd } from "@/lib/seo";
import { BlogClient } from "./page.client";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return {
    title: "Blog - Interview Prep Guides & Tips",
    description:
      "In-depth guides on cracking tech interviews at top companies. " +
      "DSA patterns, problem-solving strategies, and company-specific preparation tips.",
    alternates: { canonical: "https://codejeet.com/blog" },
  };
}

export default function BlogIndexPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Interview prep guides, DSA patterns, and tips for cracking tech interviews
        </p>
      </header>

      <BlogClient />

      <JsonLd
        data={collectionJsonLd({
          name: "CodeJeet Blog",
          description: "Interview prep guides and DSA tips for tech interviews.",
          url: "https://codejeet.com/blog",
          numberOfItems: 0,
        })}
      />
    </div>
  );
}
