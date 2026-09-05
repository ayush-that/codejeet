import { useParams } from "@solidjs/router";
import { For, Show, createMemo, createSignal, onMount } from "solid-js";

type Level = "easy" | "medium" | "hard";
type Question = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  company: string;
  "Acceptance %": string;
  link: string;
};
type Company = { displayName: string };
type Summary = Question & { companyCount: number };

const validLevel = (value: string): value is Level =>
  value === "easy" || value === "medium" || value === "hard";

export default function DifficultyPage() {
  const params = useParams<{ level: string }>();
  const [questions, setQuestions] = createSignal<Question[]>([]);
  const [companies, setCompanies] = createSignal<Record<string, Company>>({});
  const [failed, setFailed] = createSignal(false);
  const level = createMemo(() => (validLevel(params.level) ? params.level : undefined));
  const label = createMemo(() => level()?.replace(/^./, (letter) => letter.toUpperCase()));
  const results = createMemo<Summary[]>(() => {
    const requested = label();
    if (!requested) return [];
    const merged = new Map<string, { question: Question; companySlugs: Set<string> }>();
    for (const question of questions()) {
      if (question.difficulty !== requested) continue;
      const previous = merged.get(question.slug);
      if (previous) previous.companySlugs.add(question.company);
      else merged.set(question.slug, { question, companySlugs: new Set([question.company]) });
    }
    return [...merged.values()]
      .map(({ question, companySlugs }) => ({ ...question, companyCount: companySlugs.size }))
      .sort((left, right) => right.companyCount - left.companyCount);
  });
  const topCompanies = createMemo(() => {
    const requested = label();
    if (!requested) return [];
    const counts = new Map<string, number>();
    for (const question of questions())
      if (question.difficulty === requested)
        counts.set(question.company, (counts.get(question.company) ?? 0) + 1);
    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 15)
      .map(([slug, count]) => ({ slug, count, name: companies()[slug]?.displayName ?? slug }));
  });

  onMount(() => {
    void Promise.all([fetch("/data/questions.json"), fetch("/data/company-profiles.json")])
      .then(async ([questionResponse, companyResponse]) => {
        if (!questionResponse.ok || !companyResponse.ok)
          throw new Error("Could not load difficulty data");
        setQuestions(((await questionResponse.json()) as { questions: Question[] }).questions);
        setCompanies((await companyResponse.json()) as Record<string, Company>);
      })
      .catch(() => setFailed(true));
  });

  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href="/dashboard">
        ← Tracker
      </a>
      <Show
        when={level()}
        fallback={
          <section class="mt-6 rounded border border-border p-6">
            <h1 class="text-2xl font-bold">Difficulty not found</h1>
          </section>
        }
      >
        <>
          <header class="mb-8 mt-6">
            <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
              {label()} LeetCode Questions
            </h1>
            <p class="mt-2 text-muted-foreground">
              {results().length.toLocaleString()} unique questions sorted by company popularity
            </p>
          </header>
          <Show
            when={!failed()}
            fallback={
              <p class="rounded border border-destructive p-4">Could not load difficulty data.</p>
            }
          >
            <section class="mb-8">
              <h2 class="mb-4 text-lg font-semibold">Top companies</h2>
              <div class="flex flex-wrap gap-2">
                <For each={topCompanies()}>
                  {(company) => (
                    <a
                      class="rounded-full border px-3 py-1.5 text-sm hover:bg-accent"
                      href={`/company/${company.slug}`}
                    >
                      {company.name} <span class="text-muted-foreground">({company.count})</span>
                    </a>
                  )}
                </For>
              </div>
            </section>
            <section>
              <h2 class="mb-4 text-lg font-semibold">Questions</h2>
              <div class="overflow-x-auto rounded-lg border">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b bg-muted/50 text-left text-muted-foreground">
                      <th class="px-4 py-3">Title</th>
                      <th class="hidden px-4 py-3 sm:table-cell">Acceptance</th>
                      <th class="px-4 py-3">Companies</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={results().slice(0, 200)}>
                      {(question) => (
                        <tr class="border-b">
                          <td class="px-4 py-3">
                            <a
                              class="font-medium hover:underline"
                              href={question.link}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {question.title}
                            </a>
                          </td>
                          <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                            {question["Acceptance %"]}
                          </td>
                          <td class="px-4 py-3 text-muted-foreground">{question.companyCount}</td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
              <p class="mt-3 text-xs text-muted-foreground">
                Showing {Math.min(results().length, 200).toLocaleString()} of{" "}
                {results().length.toLocaleString()} questions
              </p>
            </section>
          </Show>
        </>
      </Show>
    </main>
  );
}
