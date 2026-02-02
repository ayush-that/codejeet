/**
 * Internal Links Component
 * Renders related content links for SEO and UX
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InternalLink } from "@/lib/seo";

interface InternalLinksProps {
  title: string;
  links: InternalLink[];
  className?: string;
  variant?: "grid" | "list" | "inline";
}

export function InternalLinks({
  title,
  links,
  className = "",
  variant = "grid",
}: InternalLinksProps) {
  if (links.length === 0) return null;

  const containerClasses = {
    grid: "grid grid-cols-2 md:grid-cols-3 gap-3",
    list: "flex flex-col gap-2",
    inline: "flex flex-wrap gap-2",
  };

  const linkClasses = {
    grid: "block p-3 rounded-lg border bg-card hover:bg-accent transition-colors",
    list: "flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors",
    inline: "px-3 py-1.5 rounded-full border hover:bg-accent transition-colors text-sm",
  };

  return (
    <section className={`${className}`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className={containerClasses[variant]}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={linkClasses[variant]}
            title={link.title}
          >
            {variant === "grid" ? (
              <div>
                <span className="font-medium text-sm">{link.text}</span>
                {link.title && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{link.title}</p>
                )}
              </div>
            ) : variant === "list" ? (
              <>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm">{link.text}</span>
              </>
            ) : (
              <span>{link.text}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Related Content Section with multiple link groups
 */
interface RelatedContentProps {
  sections: {
    title: string;
    links: InternalLink[];
    variant?: "grid" | "list" | "inline";
  }[];
  className?: string;
}

export function RelatedContent({ sections, className = "" }: RelatedContentProps) {
  const nonEmptySections = sections.filter((s) => s.links.length > 0);

  if (nonEmptySections.length === 0) return null;

  return (
    <div className={`space-y-8 ${className}`}>
      {nonEmptySections.map((section, index) => (
        <InternalLinks
          key={index}
          title={section.title}
          links={section.links}
          variant={section.variant || "grid"}
        />
      ))}
    </div>
  );
}

/**
 * Hub Navigation Links (always visible)
 */
interface HubLinksProps {
  links: InternalLink[];
  className?: string;
}

export function HubLinks({ links, className = "" }: HubLinksProps) {
  return (
    <nav className={`flex flex-wrap gap-2 ${className}`} aria-label="Main navigation">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-4 py-2 rounded-lg border bg-card hover:bg-accent transition-colors text-sm font-medium"
          title={link.title}
        >
          {link.text}
        </Link>
      ))}
    </nav>
  );
}
