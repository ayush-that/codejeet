import { For, Show, createMemo, createSignal, onMount } from "solid-js";

type Pair = {
  pair: string;
  companyA: { displayName: string };
  companyB: { displayName: string };
  sharedCount: number;
  uniqueToACount: number;
  uniqueToBCount: number;
};

export default function Compare() {
  const [pairs, setPairs] = createSignal<Pair[]>([]);
  const [failed, setFailed] = createSignal(false);
  const indexable = createMemo(() =>
    pairs()
      .filter((pair) => pair.sharedCount >= 3)
      .sort((left, right) => right.sharedCount - left.sharedCount)
  );
  onMount(() => {
    void fetch("/data/comparison-index.json")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load comparisons");
        setPairs((await response.json()) as Pair[]);
      })
      .catch(() => setFailed(true));
  });
  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Company Interview Comparisons</h1>
        <p class="mt-3 max-w-3xl text-muted-foreground">
          Compare LeetCode question banks across {indexable().length.toLocaleString()} company
          pairs.
        </p>
      </header>
      <Show
        when={!failed()}
        fallback={<p class="rounded border border-destructive p-4">Could not load comparisons.</p>}
      >
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
