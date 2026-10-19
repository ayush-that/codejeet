import Link from "next/link";
import { cache, type ComponentProps } from "react";
import { getProblemSlugs } from "@/lib/pseo-data";

const availableProblems = cache(async () => new Set(await getProblemSlugs()));

export async function ProblemLink({
  slug,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { slug: string }) {
  const slugs = await availableProblems();
  const href = slugs.has(slug) ? `/problem/${slug}` : `https://leetcode.com/problems/${slug}/`;
  return <Link {...props} href={href} />;
}
