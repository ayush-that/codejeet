import Link from "next/link";
import { HOMEPAGE_OVERVIEW_PARAGRAPHS, homepageFaqs } from "@/lib/agent-resources";
import { SectionLabel } from "@/components/ui/decor";

export function HomeOverview() {
  return (
    <section className="container relative z-10 mx-auto max-w-[1100px] px-4 py-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <SectionLabel>About CodeJeet</SectionLabel>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Company-wise LeetCode prep, not an unsorted grind
        </h2>
        {HOMEPAGE_OVERVIEW_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard"
          className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
        >
          <h3 className="font-semibold">Question tracker</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Filter 15,000+ CodeJeet problems by company, topic, difficulty, and timeframe.
          </p>
        </Link>
        <Link
          href="/companies"
          className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
        >
          <h3 className="font-semibold">Company directory</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Open a company page to see frequency-sorted LeetCode questions for that employer.
          </p>
        </Link>
        <Link
          href="/system-design"
          className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
        >
          <h3 className="font-semibold">System design</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Sixteen chapters covering scaling, rate limiters, hashing, chat, and feeds.
          </p>
        </Link>
        <Link
          href="/developers"
          className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
        >
          <h3 className="font-semibold">Developer resources</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            How agents and tools should use CodeJeet: sitemap, llms.txt, and public URL patterns.
          </p>
        </Link>
      </div>

      <div className="max-w-3xl space-y-6">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="text-2xl font-bold tracking-tight">CodeJeet FAQ</h2>
        {homepageFaqs.map((item) => (
          <div key={item.question}>
            <h3 className="font-semibold">{item.question}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
