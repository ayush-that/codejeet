"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Company {
  slug: string;
  displayName: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
}

const ITEMS_PER_PAGE = 24;

export function CompaniesClient({ companies }: { companies: Company[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter((c) => c.displayName.toLowerCase().includes(q));
  }, [companies, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <>
      {/* Search + count */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:max-w-xs"
        />
        <p className="shrink-0 text-sm text-muted-foreground">
          {filtered.length.toLocaleString()} {filtered.length === 1 ? "company" : "companies"}
        </p>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageItems.map((company) => {
          const total = company.questionCount;
          const easyPct = total > 0 ? (company.difficultyDist.easy / total) * 100 : 0;
          const medPct = total > 0 ? (company.difficultyDist.medium / total) * 100 : 0;
          const hardPct = total > 0 ? (company.difficultyDist.hard / total) * 100 : 0;

          return (
            <Link
              key={company.slug}
              href={`/company/${company.slug}`}
              className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-card-foreground group-hover:text-accent-foreground truncate">
                  {company.displayName}
                </h2>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {total.toLocaleString()} {total === 1 ? "question" : "questions"}
                </span>
              </div>

              {/* Mini difficulty bar */}
              <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                {easyPct > 0 && (
                  <div
                    className="bg-green-500/70"
                    style={{ width: `${easyPct}%` }}
                    title={`Easy: ${company.difficultyDist.easy}`}
                  />
                )}
                {medPct > 0 && (
                  <div
                    className="bg-yellow-500/70"
                    style={{ width: `${medPct}%` }}
                    title={`Medium: ${company.difficultyDist.medium}`}
                  />
                )}
                {hardPct > 0 && (
                  <div
                    className="bg-red-500/70"
                    style={{ width: `${hardPct}%` }}
                    title={`Hard: ${company.difficultyDist.hard}`}
                  />
                )}
              </div>

              {/* Difficulty counts */}
              <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                <span>
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500/70 mr-1" />
                  {company.difficultyDist.easy} Easy
                </span>
                <span>
                  <span className="inline-block h-2 w-2 rounded-full bg-yellow-500/70 mr-1" />
                  {company.difficultyDist.medium} Med
                </span>
                <span>
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500/70 mr-1" />
                  {company.difficultyDist.hard} Hard
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {pageItems.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">No companies found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
