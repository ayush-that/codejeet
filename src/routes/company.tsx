import { useParams } from "@solidjs/router";
import { For, Show, createMemo, createSignal, onMount } from "solid-js";

type Question = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: string;
  frequency: string;
  topics: string[];
};
type Company = {
  slug: string;
  displayName: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
  topTopics: { name: string; slug: string; count: number }[];
  questions: Question[];
};

const difficultyClass = (difficulty: Question["difficulty"]) =>
  difficulty === "Easy"
    ? "bg-green-500/15 text-green-700 dark:text-green-400"
    : difficulty === "Medium"
      ? "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
      : "bg-red-500/15 text-red-700 dark:text-red-400";

export default function CompanyPage() {
  const params = useParams<{ slug: string }>();
  const [profile, setProfile] = createSignal<Company>();
  const [failed, setFailed] = createSignal(false);
  const [loaded, setLoaded] = createSignal(false);
  const company = createMemo(() => profile());

  onMount(() => {
    void fetch("/data/company-profiles.json")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load company data");
        setProfile(((await response.json()) as Record<string, Company>)[params.slug]);
        setLoaded(true);
      })
      .catch(() => setFailed(true));
  });

  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href="/companies">
        ← Companies
      </a>
      <Show
        when={company()}
        fallback={
          <p class="mt-6 text-muted-foreground">
            {failed()
              ? "Could not load company data."
              : loaded()
                ? "Company not found."
                : "Loading company…"}
          </p>
        }
      >
        {(item) => (
          <>
            <header class="mb-8 mt-6">
              <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{item().displayName}</h1>
              <p class="mt-2 text-muted-foreground">
                {item().questionCount.toLocaleString()} LeetCode interview questions
              </p>
            </header>
            <section class="mb-8" aria-label="Difficulty distribution">
              <h2 class="mb-4 text-lg font-semibold">Difficulty distribution</h2>
              <div class="grid grid-cols-3 gap-3">
                <For
                  each={
                    [
                      ["Easy", item().difficultyDist.easy],
                      ["Medium", item().difficultyDist.medium],
                      ["Hard", item().difficultyDist.hard],
                    ] as const
                  }
                >
                  {([label, count]) => (
                    <div class="rounded-lg border border-border p-4">
                      <p class="text-sm text-muted-foreground">{label}</p>
                      <p class="mt-1 text-2xl font-bold">{count}</p>
                    </div>
                  )}
                </For>
              </div>
            </section>
            <Show when={item().topTopics.length > 0}>
              <section class="mb-8" aria-label="Top topics">
                <h2 class="mb-4 text-lg font-semibold">Top topics</h2>
                <div class="flex flex-wrap gap-2">
                  <For each={item().topTopics}>
                    {(topic) => (
                      <a
                        class="rounded-full border px-3 py-1.5 text-sm hover:bg-accent"
                        href={`/topic/${topic.slug}`}
                      >
                        {topic.name} <span class="text-muted-foreground">({topic.count})</span>
                      </a>
                    )}
                  </For>
                </div>
              </section>
            </Show>
            <section aria-label="Questions">
              <h2 class="mb-4 text-lg font-semibold">All questions</h2>
              <div class="overflow-x-auto rounded-lg border">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b bg-muted/50 text-left text-muted-foreground">
                      <th class="px-4 py-3">Title</th>
                      <th class="px-4 py-3">Difficulty</th>
                      <th class="hidden px-4 py-3 sm:table-cell">Acceptance</th>
                      <th class="hidden px-4 py-3 lg:table-cell">Topics</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={item().questions}>
                      {(question) => (
                        <tr class="border-b">
                          <td class="px-4 py-3">
                            <a
                              class="font-medium hover:underline"
                              href={`https://leetcode.com/problems/${question.slug}/`}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {question.title}
                            </a>
                          </td>
                          <td class="px-4 py-3">
                            <span
                              class={`rounded px-2 py-1 text-xs font-medium ${difficultyClass(question.difficulty)}`}
                            >
                              {question.difficulty}
                            </span>
                          </td>
                          <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                            {question.acceptance}
                          </td>
                          <td class="hidden px-4 py-3 lg:table-cell">
                            {question.topics.join(", ")}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </Show>
    </main>
  );
}
