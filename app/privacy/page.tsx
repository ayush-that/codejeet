import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";
import { PRIVACY_H1, PRIVACY_PARAGRAPHS } from "@/lib/agent-resources";

export const dynamic = "force-static";

export const metadata: Metadata = legalMetadata({
  title: PRIVACY_H1,
  description:
    "How CodeJeet handles browsing, local progress, signed-in notes, and Clerk authentication.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title={PRIVACY_H1} crumb="Privacy" path="/privacy" paragraphs={PRIVACY_PARAGRAPHS} />
  );
}
