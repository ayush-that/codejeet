import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import {
  decodeDashboardPayload,
  toDisplayRow,
  type DashboardIndex,
} from "../../lib/dashboard/decode";
import { computeStats, filterLinks, sortLinks, type SortOrder } from "../../lib/dashboard/query";
import type { DashboardPayload, Difficulty, Timeframe } from "../../lib/dashboard/schema";

type GuestProgress = typeof import("../lib/loro-progress").loroGuestProgress;
const pageSizes = [10, 25, 50];

function checkedOptions(event: Event): string[] {
  return Array.from(
    (event.currentTarget as HTMLSelectElement).selectedOptions,
    (option) => option.value
  );
}

function progressWidth(numerator: number, denominator: number): string {
  return denominator === 0 ? "0%" : `${Math.round((numerator / denominator) * 100)}%`;
}

function StatCard(props: {
  label: string;
  solved: number;
  total: number;
  tone: "neutral" | "easy" | "medium" | "hard";
}) {
  return (
    <section class={`rounded-md border border-border bg-card p-5 stat-${props.tone}`}>
      <div class="flex items-baseline justify-between gap-2">
        <strong class="text-2xl">{props.solved}</strong>
        <span class="text-sm text-muted-foreground">/ {props.total}</span>
      </div>
      <p class="mt-1 text-sm text-muted-foreground">{props.label}</p>
      <div class="mt-3 h-2 overflow-hidden rounded bg-muted">
        <div
          class="h-full rounded bg-primary"
          style={{ width: progressWidth(props.solved, props.total) }}
        />
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [index, setIndex] = createSignal<DashboardIndex>();
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string>();
  const [search, setSearch] = createSignal("");
  const [difficulties, setDifficulties] = createSignal<Difficulty[]>([]);
  const [topics, setTopics] = createSignal<string[]>([]);
  const [timeframe, setTimeframe] = createSignal<Timeframe>("all");
  const [premium, setPremium] = createSignal<"free" | "premium" | "all">("free");
  const [frequency, setFrequency] = createSignal<SortOrder>("desc");
  const [acceptance, setAcceptance] = createSignal<SortOrder>(null);
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(10);
  const [solved, setSolved] = createSignal<Record<string, boolean>>({});
  let guestProgress: GuestProgress | undefined;

  const load = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch("/data/dashboard.json", { signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setIndex(decodeDashboardPayload((await response.json()) as DashboardPayload));
    } catch {
      setError("Could not load questions. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    void load();
    let active = true;
    let unsubscribe: (() => void) | undefined;
    void import("../lib/loro-progress").then(({ loroGuestProgress }) => {
      if (!active) return;
      guestProgress = loroGuestProgress;
      setSolved(guestProgress.read());
      unsubscribe = guestProgress.subscribe(setSolved);
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  });

  const links = createMemo(() => {
    const current = index();
    if (!current) return [];
    return sortLinks(
      current,
      filterLinks(current, {
        search: search(),
        difficulties: difficulties(),
        topics: topics(),
        timeframe: timeframe(),
        premium: premium(),
      }),
      frequency(),
      acceptance()
    );
  });
  const stats = createMemo(() => (index() ? computeStats(index()!, links(), solved()) : null));
  const totalPages = createMemo(() => Math.max(1, Math.ceil(links().length / pageSize())));
  const currentPage = createMemo(() => Math.min(page(), totalPages()));
  const rows = createMemo(() => {
    const current = index();
    if (!current) return [];
    const start = (currentPage() - 1) * pageSize();
    return links()
      .slice(start, start + pageSize())
      .map((item) => toDisplayRow(current, item));
  });

  const setPageFromFilter = (action: () => void) => {
    action();
    setPage(1);
  };
  const cycle = (value: SortOrder) => (value === null ? "desc" : value === "desc" ? "asc" : null);
  const toggle = (slug: string, completed: boolean) => {
    guestProgress?.set(slug, completed);
  };

  return (
    <main class="container mx-auto px-4 py-8">
      <header class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-3xl font-extrabold">Practice Questions</h1>
          <p class="mt-1 text-muted-foreground">Company-wise technical interview questions.</p>
        </div>
        <a class="text-sm underline-offset-2 hover:underline" href="/">
          Back home
        </a>
      </header>

      <Show when={loading()}>
        <p class="rounded-md border border-border p-6 text-muted-foreground">Loading questions…</p>
      </Show>
      <Show when={error()}>
        {(message) => (
          <section class="rounded-md border border-destructive p-6">
            <p>{message()}</p>
            <button
              class="mt-3 rounded bg-primary px-4 py-2 text-primary-foreground"
              type="button"
              onClick={() => void load()}
            >
              Retry
            </button>
          </section>
        )}
      </Show>
      <Show when={index() && !loading() && !error()}>
        <div class="space-y-6">
          <div class="grid gap-4 md:grid-cols-4">
            <StatCard
              label="Total solved"
              solved={stats()!.totalSolved}
              total={stats()!.total}
              tone="neutral"
            />
            <StatCard label="Easy" solved={stats()!.easySolved} total={stats()!.easy} tone="easy" />
            <StatCard
              label="Medium"
              solved={stats()!.mediumSolved}
              total={stats()!.medium}
              tone="medium"
            />
            <StatCard label="Hard" solved={stats()!.hardSolved} total={stats()!.hard} tone="hard" />
          </div>

          <section class="rounded-md border border-border bg-card p-4">
            <div class="grid gap-3 md:grid-cols-5">
              <label class="grid gap-1 text-sm">
                Search
                <input
                  class="rounded border border-input bg-background px-3 py-2"
                  value={search()}
                  onInput={(event) => setPageFromFilter(() => setSearch(event.currentTarget.value))}
                  placeholder="Company, problem, topic"
                />
              </label>
              <label class="grid gap-1 text-sm">
                Difficulty
                <select
                  class="min-h-10 rounded border border-input bg-background px-2"
                  multiple
                  value={difficulties()}
                  onChange={(event) =>
                    setPageFromFilter(() => setDifficulties(checkedOptions(event) as Difficulty[]))
                  }
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </label>
              <label class="grid gap-1 text-sm">
                Topics
                <select
                  class="min-h-10 rounded border border-input bg-background px-2"
                  multiple
                  value={topics()}
                  onChange={(event) => setPageFromFilter(() => setTopics(checkedOptions(event)))}
                >
                  <For each={index()!.topics}>
                    {(topic) => <option value={topic}>{topic}</option>}
                  </For>
                </select>
              </label>
              <label class="grid gap-1 text-sm">
                Last appeared
                <select
                  class="rounded border border-input bg-background px-2 py-2"
                  value={timeframe()}
                  onChange={(event) =>
                    setPageFromFilter(() => setTimeframe(event.currentTarget.value as Timeframe))
                  }
                >
                  <option value="all">All</option>
                  <option value="30_days">30 days</option>
                  <option value="3_months">3 months</option>
                  <option value="6_months">6 months</option>
                  <option value="more_than_6m">More than 6 months</option>
                </select>
              </label>
              <label class="grid gap-1 text-sm">
                Access
                <select
                  class="rounded border border-input bg-background px-2 py-2"
                  value={premium()}
                  onChange={(event) =>
                    setPageFromFilter(() =>
                      setPremium(event.currentTarget.value as "free" | "premium" | "all")
                    )
                  }
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="all">All</option>
                </select>
              </label>
            </div>
          </section>

          <section class="overflow-x-auto rounded-md border border-border bg-card">
            <table class="w-full min-w-[850px] text-left text-sm">
              <thead class="border-b border-border text-muted-foreground">
                <tr>
                  <th class="p-3">Solved</th>
                  <th class="p-3">Title</th>
                  <th class="p-3">Company</th>
                  <th class="p-3">Difficulty</th>
                  <th class="p-3">Topics</th>
                  <th class="p-3">
                    <button type="button" onClick={() => setFrequency(cycle(frequency()))}>
                      Frequency {frequency() === "desc" ? "↓" : frequency() === "asc" ? "↑" : ""}
                    </button>
                  </th>
                  <th class="p-3">
                    <button type="button" onClick={() => setAcceptance(cycle(acceptance()))}>
                      Acceptance {acceptance() === "desc" ? "↓" : acceptance() === "asc" ? "↑" : ""}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <For each={rows()}>
                  {(row) => (
                    <tr class="border-b border-border last:border-0">
                      <td class="p-3">
                        <input
                          aria-label={`Mark ${row.title} solved`}
                          type="checkbox"
                          checked={solved()[row.slug] === true}
                          onChange={(event) => toggle(row.slug, event.currentTarget.checked)}
                        />
                      </td>
                      <td class="p-3 font-medium">
                        <a class="hover:underline" href={row.url} target="_blank" rel="noreferrer">
                          {row.title}
                        </a>
                      </td>
                      <td class="p-3">{row.company}</td>
                      <td class="p-3">
                        <span class={`difficulty difficulty-${row.difficulty.toLowerCase()}`}>
                          {row.difficulty}
                        </span>
                      </td>
                      <td class="p-3">
                        <span class="flex flex-wrap gap-1">
                          <For each={row.topics}>
                            {(topic) => (
                              <span class="rounded bg-secondary px-2 py-1 text-xs">{topic}</span>
                            )}
                          </For>
                        </span>
                      </td>
                      <td class="p-3">{row.frequency}</td>
                      <td class="p-3">{row.acceptance}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </section>

          <nav class="flex flex-wrap items-center justify-end gap-3" aria-label="Dashboard pages">
            <label class="text-sm">
              Rows{" "}
              <select
                class="ml-1 rounded border border-input bg-background px-2 py-1"
                value={pageSize()}
                onChange={(event) =>
                  setPageFromFilter(() => setPageSize(Number(event.currentTarget.value)))
                }
              >
                <For each={pageSizes}>{(size) => <option value={size}>{size}</option>}</For>
              </select>
            </label>
            <button
              type="button"
              class="rounded border border-input px-3 py-1 disabled:opacity-50"
              disabled={currentPage() === 1}
              onClick={() => setPage(1)}
            >
              First
            </button>
            <button
              type="button"
              class="rounded border border-input px-3 py-1 disabled:opacity-50"
              disabled={currentPage() === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>
            <span class="text-sm">
              {currentPage()} / {totalPages()}
            </span>
            <button
              type="button"
              class="rounded border border-input px-3 py-1 disabled:opacity-50"
              disabled={currentPage() === totalPages()}
              onClick={() => setPage((current) => Math.min(totalPages(), current + 1))}
            >
              Next
            </button>
            <button
              type="button"
              class="rounded border border-input px-3 py-1 disabled:opacity-50"
              disabled={currentPage() === totalPages()}
              onClick={() => setPage(totalPages())}
            >
              Last
            </button>
          </nav>
        </div>
      </Show>
    </main>
  );
}
