/**
 * Breadcrumb Navigation Component
 * Renders breadcrumb navigation with JSON-LD schema
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { generateBreadcrumbSchema, type BreadcrumbItem } from "@/lib/seo";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const schema = generateBreadcrumbSchema(items);

  return (
    <>
      <JsonLd data={schema} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-sm text-muted-foreground ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" aria-hidden="true" />
              )}
              {index === items.length - 1 ? (
                <span
                  className="text-foreground font-medium truncate max-w-[200px]"
                  aria-current="page"
                >
                  {index === 0 ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">{item.name}</span>
                    </span>
                  ) : (
                    item.name
                  )}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-foreground transition-colors truncate max-w-[200px]"
                >
                  {index === 0 ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">{item.name}</span>
                    </span>
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
