import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ name: "Home", href: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(allItems.map((i) => ({ name: i.name, url: i.href })))} />
      {/* Full-bleed so the trail always aligns to the global container (same
          left edge as the navbar), regardless of each page's content width. */}
      <nav aria-label="Breadcrumb" className="relative left-1/2 w-screen -translate-x-1/2">
        <ol className="container mx-auto flex flex-wrap items-center gap-2 px-4 pb-6 text-sm text-muted-foreground">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted-foreground/40">/</span>}
              {i < allItems.length - 1 ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              ) : (
                <span className="text-foreground">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
