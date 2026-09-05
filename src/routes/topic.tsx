import { createAsync, useParams } from "@solidjs/router";
import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { loadPublicData } from "../lib/public-data";

type Topic = {
  slug: string;
  name: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
  topCompanies: { slug: string; name: string; count: number }[];
  questionSlugs: string[];
};
type Question = {
  slug: string;
  title: string;
  difficulty: string;
  "Acceptance %": string;
  link: string;
};

export default function TopicPage() {
  const params = useParams<{ slug: string }>();
  const data = createAsync(
    async () => {
      const [profiles, questions] = await Promise.all([
        loadPublicData<Record<string, Topic>>("/data/topic-profiles.json"),
        loadPublicData<{ questions: Question[] }>("/data/questions.json"),
      ]);
      return { topic: profiles[params.slug] as Topic | undefined, questions: questions.questions };
    },
    { initialValue: { topic: undefined as Topic | undefined, questions: [] }, deferStream: true }
  );
  const topic = createMemo(() => data().topic);
  const questions = createMemo(() => data().questions);
  const [loaded, setLoaded] = createSignal(false);
  createEffect(() => {
    if (data().questions.length > 0) setLoaded(true);
  });
  const matching = createMemo(() => {
    const current = topic();
    if (!current) return [];
    const allowed = new Set(current.questionSlugs);
    const seen = new Set<string>();
    return questions()
      .filter((question) => {
        if (!allowed.has(question.slug) || seen.has(question.slug)) return false;
        seen.add(question.slug);
        return true;
      })
      .slice(0, 100);
  });

  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href="/dashboard">
        ← Tracker
      </a>
      <Show
        when={topic()}
        fallback={
          <p class="mt-6 text-muted-foreground">
            {loaded() ? "Topic not found." : "Loading topic…"}
          </p>
        }
      >
        {(item) => (
          <>
            <header class="mb-8 mt-6">
              <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{item().name}</h1>
              <p class="mt-2 text-muted-foreground">
                {item().questionCount.toLocaleString()} LeetCode questions
              </p>
            </header>
            <section class="mb-8">
              <h2 class="mb-4 text-lg font-semibold">Top companies</h2>
              <div class="flex flex-wrap gap-2">
                <For each={item().topCompanies}>
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
                      <th class="px-4 py-3">Difficulty</th>
                      <th class="hidden px-4 py-3 sm:table-cell">Acceptance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={matching()}>
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
                          <td class="px-4 py-3">{question.difficulty}</td>
                          <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                            {question["Acceptance %"]}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
              <p class="mt-3 text-xs text-muted-foreground">
                Showing {matching().length.toLocaleString()} of{" "}
                {item().questionCount.toLocaleString()} questions
              </p>
            </section>
          </>
        )}
      </Show>
    </main>
  );
}
