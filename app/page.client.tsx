"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomeHeroImage() {
  const [focusLabel, setFocusLabel] = useState<"DSA" | "System Design">("DSA");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: SSR-safe random after mount
    setFocusLabel(Math.random() < 0.5 ? "System Design" : "DSA");
  }, []);

  return (
    <Image
      src={focusLabel === "DSA" ? "/image1.webp" : "/image2.webp"}
      alt="CodeJeet dashboard showing company-wise LeetCode questions filtered by difficulty and topic"
      width={2000}
      height={1500}
      priority
      sizes="(max-width: 768px) 92vw, 1100px"
      className="w-full h-auto"
    />
  );
}
