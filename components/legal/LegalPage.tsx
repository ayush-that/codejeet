import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PROSE =
  "max-w-none space-y-4 text-muted-foreground leading-relaxed prose dark:prose-invert prose-p:my-3 prose-a:text-primary";

export function legalMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical },
    openGraph: {
      title: `${opts.title} | ${SITE_NAME}`,
      description: opts.description,
      type: "website",
      url: canonical,
    },
  };
}

export function LegalPage({
  title,
  crumb,
  path,
  paragraphs,
}: {
  title: string;
  crumb: string;
  path: string;
  paragraphs: string[];
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumbs items={[{ name: crumb, href: path }]} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      </header>
      <div className={PROSE}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
