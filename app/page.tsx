/**
 * Home Page
 * Server component with SEO metadata and JSON-LD structured data
 */

import { Metadata } from "next";
import {
  generateHomeMetadata,
  organizationSchema,
  websiteSchema,
  getStats,
  seoConfig,
} from "@/lib/seo";
import { MultiJsonLd } from "@/components/seo/JsonLd";
import HomeClient from "./page.client";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata();
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <>
      <MultiJsonLd schemas={[organizationSchema, websiteSchema]} />
      <HomeClient
        totalCompanies={stats.totalCompanies}
        totalQuestions={stats.totalQuestionRecords}
      />
    </>
  );
}
