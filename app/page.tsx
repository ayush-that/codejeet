import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, softwareApplicationJsonLd } from "@/lib/seo";
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_TYPE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import HomeClient from "./page.client";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Company-wise LeetCode Interview Questions`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} - Company-wise LeetCode Interview Questions`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: OG_TYPE,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
};

const homepageFaqs = [
  {
    question: "What is CodeJeet?",
    answer:
      "CodeJeet is a free platform to browse 15,000+ company-wise LeetCode DSA interview questions from 700+ companies. Filter by company, topic, and difficulty to practice smarter for your next tech interview.",
  },
  {
    question: "How do I prepare for a FAANG coding interview?",
    answer:
      "Start by browsing company-specific questions on CodeJeet. Focus on the most frequently asked problems for your target company, practice by difficulty level (start with Easy, progress to Medium and Hard), and study the top topics like Arrays, Dynamic Programming, Trees, and Graphs.",
  },
  {
    question: "Which companies' interview questions are available on CodeJeet?",
    answer:
      "CodeJeet has interview questions from 700+ companies including Google, Amazon, Meta, Apple, Microsoft, Netflix, Goldman Sachs, Bloomberg, Uber, and many more. Each company page shows questions sorted by frequency.",
  },
  {
    question: "How are the LeetCode questions organized?",
    answer:
      "Questions are organized by company, topic (like Arrays, Trees, Dynamic Programming), and difficulty level (Easy, Medium, Hard). You can filter and sort to find the most relevant problems for your interview preparation.",
  },
  {
    question: "Is CodeJeet free to use?",
    answer:
      "Yes, CodeJeet is completely free. All 15,000+ company-wise LeetCode questions, system design chapters, and interview preparation resources are available without any sign-up or payment.",
  },
];

function HomeOverview() {
  return (
    <section className="border-t bg-muted/20 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Prepare for coding interviews with focused practice
        </h2>
        <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            CodeJeet organizes more than 15,000 LeetCode interview questions by the companies that
            reportedly ask them. Start with a company such as Google, Amazon, Meta, Apple, or
            Microsoft, then work through questions in reported frequency order. Each company page
            shows its question count, common topics, and a difficulty breakdown, so you can build a
            practical study plan instead of working from a generic list.
          </p>
          <p>
            You can also browse problems by topic or difficulty, compare two companies to find
            shared preparation priorities, and read system-design and interview guides. Problem
            pages include the statement, constraints, hints, related questions, and links back to
            the companies associated with the problem. CodeJeet is free to browse. Sign in only if
            you want to save solved questions and personal notes across devices.
          </p>
        </div>
        <nav
          className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium"
          aria-label="Explore CodeJeet"
        >
          <Link className="text-primary hover:underline" href="/companies">
            Browse companies
          </Link>
          <Link className="text-primary hover:underline" href="/dashboard">
            Explore questions
          </Link>
          <Link className="text-primary hover:underline" href="/system-design">
            Study system design
          </Link>
        </nav>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HomeClient />
      <HomeOverview />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={faqJsonLd(homepageFaqs)} />
    </>
  );
}
