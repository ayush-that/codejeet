import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";
import { CONTACT_H1, CONTACT_PARAGRAPHS } from "@/lib/agent-resources";

export const dynamic = "force-static";

export const metadata: Metadata = legalMetadata({
  title: CONTACT_H1,
  description: "Contact CodeJeet: email the maintainer, open a GitHub issue, or follow along on X.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage title={CONTACT_H1} crumb="Contact" path="/contact" paragraphs={CONTACT_PARAGRAPHS} />
  );
}
