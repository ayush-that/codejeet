import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";
import { DEVELOPERS_H1, DEVELOPERS_PARAGRAPHS } from "@/lib/agent-resources";

export const dynamic = "force-static";

export const metadata: Metadata = legalMetadata({
  title: DEVELOPERS_H1,
  description:
    "CodeJeet developer resources: public URL patterns, sitemap, llms.txt, and authenticated progress APIs. No public OpenAPI or MCP server.",
  path: "/developers",
});

export default function DevelopersPage() {
  return (
    <LegalPage
      title={DEVELOPERS_H1}
      crumb="Developers"
      path="/developers"
      paragraphs={DEVELOPERS_PARAGRAPHS}
    />
  );
}
