"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Frame } from "@/components/ui/frame";
import { GridRails, HatchDivider } from "@/components/ui/decor";

export default function HomeClient() {
  const [focusLabel, setFocusLabel] = useState<"DSA" | "System Design">("DSA");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: SSR-safe random after mount
    setFocusLabel(Math.random() < 0.5 ? "System Design" : "DSA");
  }, []);
  return (
    <div>
      <main>
        <HatchDivider />
        <div className="relative w-full overflow-hidden bg-background grid-field">
          <GridRails />
          <div className="container relative z-10 mx-auto flex flex-col items-center justify-start space-y-6 px-4 pt-16 pb-10">
            <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold break-words w-full max-w-[92vw] md:max-w-[1100px] px-2 mx-auto leading-tight tracking-tight">
              15,000+ Company-wise LeetCode Interview Questions
            </h1>
            <h2 className="text-base text-muted-foreground text-center max-w-2xl mx-auto">
              Filter by company, topic, and difficulty. Practice smarter for your next tech
              interview.
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base leading-none">
                  DSA
                </Button>
              </Link>
              <Link href="/system-design">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base leading-none">
                  System Design
                </Button>
              </Link>
            </div>
            <Frame className="mt-6 w-full max-w-[92vw] md:max-w-[1100px] bg-card p-1.5">
              <Image
                src={focusLabel === "DSA" ? "/image1.webp" : "/image2.webp"}
                alt="CodeJeet dashboard showing company-wise LeetCode questions filtered by difficulty and topic"
                width={2000}
                height={1500}
                priority
                sizes="(max-width: 768px) 92vw, 1100px"
                className="w-full h-auto"
              />
            </Frame>
          </div>
        </div>
        <HatchDivider />
      </main>
    </div>
  );
}
