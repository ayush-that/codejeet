"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToBlog, getBlogSnapshot, getBlogServerSnapshot } from "@/lib/blog-store";

const ITEMS_PER_PAGE = 24;

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Company Guides", value: "company-guide" },
  { label: "DSA Patterns", value: "dsa-patterns" },
  { label: "Tips & Strategies", value: "tips" },
] as const;

export function BlogClient() {
  const { posts, loading } = useSyncExternalStore(
    subscribeToBlog,
    getBlogSnapshot,
    getBlogServerSnapshot
  );
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  function updateCategory(v: string) {
    setCategory(v);
    setPage(1);
  }
  function updateSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  const filtered = useMemo(() => {
    let result = posts;
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    return result;
  }, [posts, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-5 animate-pulse">
            <div className="h-5 bg-muted rounded w-3/4 mb-3" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-2/3 mb-3" />
            <div className="h-3 bg-muted rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={category === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          className="sm:ml-auto sm:max-w-xs"
        />
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        {category !== "all" || search ? " found" : ""}
      </p>

      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border bg-card p-5 hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold text-card-foreground group-hover:text-accent-foreground">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.description}</p>
              <time className="mt-3 block text-xs text-muted-foreground">{post.date}</time>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-12 text-center">No posts match your filters.</p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
