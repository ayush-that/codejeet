import { createAsync } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { loadPublicData } from "../lib/public-data";

type Pair = {
  pair: string;
  companyA: { displayName: string };
  companyB: { displayName: string };
  sharedCount: number;
  uniqueToACount: number;
  uniqueToBCount: number;
};

export default function Compare() {
  const pairs = createAsync(() => loadPublicData<Pair[]>("/data/comparison-index.json"), {
    initialValue: [],
    deferStream: true,
  });
  const indexable = createMemo(() =>
    pairs()
      .filter((pair) => pair.sharedCount >= 3)
      .sort((left, right) => right.sharedCount - left.sharedCount)
  );
  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Company Interview Comparisons</h1>
        <p class="mt-3 max-w-3xl text-muted-foreground">
          Compare LeetCode question banks across {indexable().length.toLocaleString()} company
          pairs.
        </p>
      </header>
      <Show when={pairs()}>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={indexable()}>
            {(pair) => (
              <a
                class="group block rounded-lg border bg-card p-4 hover:bg-accent"
                href={`/compare/${pair.pair}`}
              >
                <h2 class="font-semibold group-hover:underline">
                  {pair.companyA.displayName} vs {pair.companyB.displayName}
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                  {pair.sharedCount.toLocaleString()} shared ·{" "}
                  {pair.uniqueToACount.toLocaleString()} unique to {pair.companyA.displayName} ·{" "}
                  {pair.uniqueToBCount.toLocaleString()} unique to {pair.companyB.displayName}
                </p>
              </a>
            )}
          </For>
        </div>
      </Show>
    </main>
  );
}
