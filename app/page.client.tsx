"use client";

/**
 * Home Page Client Component
 * Interactive hero section with dynamic content
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NumberTicker from "@/components/magic-ui/number-ticker";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/magic-ui/dot-pattern";

interface HomeClientProps {
  totalCompanies: number;
  totalQuestions: number;
}

export default function HomeClient({ totalCompanies, totalQuestions }: HomeClientProps) {
  const [focusLabel] = useState<"DSA" | "System Design">(() =>
    Math.random() < 0.5 ? "DSA" : "System Design"
  );

  return (
    <div>
      <main>
        {/* Hero Section */}
        <div className="z-0 relative w-full bg-gradient-to-b from-background to-primary/10 pb-6 md:pb-40 md:min-h-screen overflow-hidden">
          <DotPattern className="absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]" />
          <div className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-4 px-4 pt-12">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-tight">
                Proudly Open Source
              </span>
              <span aria-hidden className="h-6 w-[2px] bg-foreground" />
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold leading-none text-foreground whitespace-nowrap">
                  Backed by
                </span>
                <Image
                  src="/cloudflare.png"
                  alt="Cloudflare"
                  width={168}
                  height={44}
                  className="h-9 w-auto translate-y-[1px]"
                />
              </div>
            </div>
            <h1 className="text-center text-5xl md:text-7xl font-bold break-words w-full max-w-[92vw] md:max-w-[1200px] px-2 mx-auto -z-10 leading-tight">
              <span className="md:whitespace-nowrap">Padhle {focusLabel} kahin se, </span>
              <br className="hidden md:block" />
              <span>selection hogi yahi se.</span>
            </h1>
            <h2 className="text-xl text-opacity-60 tracking-normal text-center max-w-2xl mx-auto z-10">
              Suffer from <NumberTicker value={totalQuestions} />+ company-wise DSA questions like a
              true Codejeet. Kyunki naukri ke liye sab kuch chalega!
            </h2>
            <div className="z-20 flex gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="shadow-2xl h-12 px-8 text-lg leading-none">
                  Get Started
                </Button>
              </Link>
              <Link href="/system-design">
                <Button
                  size="lg"
                  variant="outline"
                  className="shadow-2xl h-12 px-8 text-lg leading-none"
                >
                  System Design
                </Button>
              </Link>
            </div>
            <div className="-mt-16 w-full">
              <Image
                src={focusLabel === "DSA" ? "/image1.png" : "/image2.png"}
                alt={`${focusLabel === "DSA" ? "DSA Problems Dashboard" : "System Design Guide"} Preview`}
                width={2000}
                height={1500}
                className="w-full h-auto max-w-[92vw] md:max-w-[1200px] mx-auto rounded-2xl shadow-lg px-0 sm:px-4"
                priority
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value={totalQuestions} label="Interview Questions" />
              <StatCard value={totalCompanies} label="Tech Companies" />
              <StatCard value={50} suffix="+" label="DSA Topics" />
              <StatCard value={16} label="System Design Chapters" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need to Ace Your Interview
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Company-Wise Questions"
                description="Practice problems specifically asked at Google, Amazon, Meta, Microsoft, and 265+ other companies."
                href="/companies"
                linkText="Browse Companies"
              />
              <FeatureCard
                title="Topic-Based Practice"
                description="Master algorithms and data structures with problems organized by topic, from Arrays to Dynamic Programming."
                href="/topics"
                linkText="Explore Topics"
              />
              <FeatureCard
                title="System Design Guide"
                description="Comprehensive system design preparation with 16 chapters covering everything from basics to advanced concepts."
                href="/system-design"
                linkText="Start Learning"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Crack Your Dream Job?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of engineers who have used CodeJeet to prepare for their technical
              interviews at top tech companies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Start Practicing
                </Button>
              </Link>
              <Link href="/companies">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                  Browse Companies
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold">
        <NumberTicker value={value} />
        {suffix}
      </div>
      <div className="text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  linkText,
}: {
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="p-6 rounded-xl border bg-card">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Link href={href} className="text-primary hover:underline font-medium">
        {linkText} →
      </Link>
    </div>
  );
}
