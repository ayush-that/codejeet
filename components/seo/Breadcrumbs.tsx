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
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
        <ol className="flex items-center gap-1.5 flex-wrap">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/50">/</span>}
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
