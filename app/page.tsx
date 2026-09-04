import type { Metadata } from "next";
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

export default function Home() {
  return (
    <>
      <HomeClient />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={faqJsonLd(homepageFaqs)} />
    </>
  );
}
