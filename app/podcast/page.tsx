import type { Metadata } from "next";
import PodcastClient from "./page.client";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "The Accidental CTO - Audiobook | CodeJeet",
  description:
    "Listen to The Accidental CTO by Subhash Choudhary. A system design journey from startup to scale.",
  alternates: { canonical: "https://codejeet.com/podcast" },
  openGraph: {
    title: "The Accidental CTO - Audiobook | CodeJeet",
    description:
      "Listen to The Accidental CTO by Subhash Choudhary. A system design journey from startup to scale.",
    type: "website",
    url: "https://codejeet.com/podcast",
  },
};

export default function PodcastPage() {
  return <PodcastClient />;
}
