import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";
import { ABOUT_H1, ABOUT_PARAGRAPHS } from "@/lib/agent-resources";

export const dynamic = "force-static";

export const metadata: Metadata = legalMetadata({
  title: ABOUT_H1,
  description:
    "What CodeJeet is: a free, open-source site for company-wise LeetCode interview questions, system design, and prep guides.",
  path: "/about",
});

export default function AboutPage() {
  return <LegalPage title={ABOUT_H1} crumb="About" path="/about" paragraphs={ABOUT_PARAGRAPHS} />;
}
