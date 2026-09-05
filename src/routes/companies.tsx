import { createAsync } from "@solidjs/router";
import { For, Show, createMemo, createSignal } from "solid-js";
import { loadPublicData } from "../lib/public-data";

type Company = {
  slug: string;
  displayName: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
};

const PAGE_SIZE = 24;

function percentage(value: number, total: number): string {
  return total === 0 ? "0%" : `${(value / total) * 100}%`;
}

export default function Companies() {
  const companies = createAsync(async () =>
    Object.values(await loadPublicData<Record<string, Company>>("/data/company-profiles.json")).sort(
      (a, b) => b.questionCount - a.questionCount
    ), { initialValue: [], deferStream: true });
  const [search, setSearch] = createSignal("");
  const [page, setPage] = createSignal(1);

  const filtered = createMemo(() => {
    const query = search().trim().toLowerCase();
    return query
      ? companies().filter((company) => company.displayName.toLowerCase().includes(query))
      : companies();
  });
  const totalPages = createMemo(() => Math.max(1, Math.ceil(filtered().length / PAGE_SIZE)));
  const currentPage = createMemo(() => Math.min(page(), totalPages()));
  const pageItems = createMemo(() =>
    filtered().slice((currentPage() - 1) * PAGE_SIZE, currentPage() * PAGE_SIZE)
  );

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <main class="container mx-auto max-w-6xl px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Company Directory</h1>
        <p class="mt-2 text-muted-foreground">
          Browse LeetCode interview questions from {companies().length.toLocaleString()} companies
        </p>
      </header>
      <Show when={companies()}>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label class="sr-only" for="company-search">
            Search companies
          </label>
          <input
            class="h-9 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground sm:max-w-xs"
            id="company-search"
            onInput={(event) => updateSearch(event.currentTarget.value)}
            placeholder="Search companies..."
            value={search()}
          />
          <p class="text-sm text-muted-foreground">
            {filtered().length.toLocaleString()} companies
          </p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={pageItems()}>
            {(company) => (
              <a
                class="group block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
                href={`/company/${company.slug}`}
              >
                <div class="flex items-start justify-between gap-2">
                  <h2 class="truncate font-semibold text-card-foreground">{company.displayName}</h2>
                  <span class="shrink-0 text-sm text-muted-foreground">
                    {company.questionCount.toLocaleString()} questions
                  </span>
                </div>
                <div class="mt-3 flex h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    class="bg-green-500/70"
                    style={{
                      width: percentage(company.difficultyDist.easy, company.questionCount),
                    }}
                  />
                  <div
                    class="bg-yellow-500/70"
                    style={{
                      width: percentage(company.difficultyDist.medium, company.questionCount),
                    }}
                  />
                  <div
                    class="bg-red-500/70"
                    style={{
                      width: percentage(company.difficultyDist.hard, company.questionCount),
                    }}
                  />
                </div>
                <p class="mt-2 text-xs text-muted-foreground">
                  {company.difficultyDist.easy} Easy · {company.difficultyDist.medium} Medium ·{" "}
                  {company.difficultyDist.hard} Hard
                </p>
              </a>
            )}
          </For>
        </div>
        <Show when={pageItems().length === 0 && companies().length > 0}>
          <p class="mt-8 text-center text-muted-foreground">No companies found.</p>
        </Show>
        <Show when={totalPages() > 1}>
          <nav class="mt-8 flex items-center justify-center gap-4" aria-label="Company pages">
            <button
              class="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={currentPage() <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              type="button"
            >
              Previous
            </button>
            <span class="text-sm text-muted-foreground">
              Page {currentPage()} of {totalPages()}
            </span>
            <button
              class="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={currentPage() >= totalPages()}
              onClick={() => setPage((value) => Math.min(totalPages(), value + 1))}
              type="button"
            >
              Next
            </button>
          </nav>
        </Show>
      </Show>
    </main>
  );
}
