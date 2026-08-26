import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomeOverview } from "@/components/home/HomeOverview";
import { Frame } from "@/components/ui/frame";
import { GridRails, HatchDivider } from "@/components/ui/decor";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { faqJsonLd, softwareApplicationJsonLd } from "@/lib/seo";
import { HOMEPAGE_H1, HOMEPAGE_SUBHEAD, homepageFaqs } from "@/lib/agent-resources";
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
import HomeHeroImage from "./page.client";

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

export default function Home() {
  return (
    <>
      <div>
        <HatchDivider />
        <div className="relative w-full overflow-hidden bg-background grid-field">
          <GridRails />
          <div className="container relative z-10 mx-auto flex flex-col items-center justify-start space-y-6 px-4 pt-16 pb-10">
            <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold break-words w-full max-w-[92vw] md:max-w-[1100px] px-2 mx-auto leading-tight tracking-tight">
              {HOMEPAGE_H1}
            </h1>
            <p className="text-base text-muted-foreground text-center max-w-2xl mx-auto">
              {HOMEPAGE_SUBHEAD}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base leading-none")}
              >
                DSA
              </Link>
              <Link
                href="/system-design"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 px-8 text-base leading-none"
                )}
              >
                System Design
              </Link>
            </div>
            <Frame
              ticks={false}
              className="mt-6 w-full max-w-[92vw] md:max-w-[1100px] bg-card p-1.5"
            >
              <HomeHeroImage />
            </Frame>
          </div>
        </div>
        <HatchDivider />
      </div>
      <HomeOverview />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={faqJsonLd(homepageFaqs)} />
    </>
  );
}
