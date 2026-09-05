import { useParams } from "@solidjs/router";
import { For, Show, createSignal, onMount } from "solid-js";

type Question = { slug: string; title: string; difficulty: string; topics: string[] };
type Company = {
  slug: string;
  displayName: string;
  questionCount: number;
  difficultyDist: { easy: number; medium: number; hard: number };
};
type Comparison = {
  companyA: Company;
  companyB: Company;
  sharedCount: number;
  uniqueToACount: number;
  uniqueToBCount: number;
  sharedProblems: Question[];
  exclusiveToA: Question[];
  exclusiveToB: Question[];
  topSharedTopics: { slug: string; name: string; count: number }[];
  blogSlug?: string;
};

export default function ComparePair() {
  const params = useParams<{ pair: string }>();
  const [comparison, setComparison] = createSignal<Comparison>();
  const [failed, setFailed] = createSignal(false);
  onMount(() => {
    void fetch(`/data/compare/${params.pair}.json`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Comparison not found");
        setComparison((await response.json()) as Comparison);
      })
      .catch(() => setFailed(true));
  });
  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href="/compare">
        ← Compare
      </a>
      <Show
        when={comparison()}
        fallback={
          <p class="mt-6 text-muted-foreground">
            {failed() ? "Comparison not found." : "Loading comparison…"}
          </p>
        }
      >
        {(item) => (
          <>
            <header class="mb-8 mt-6">
              <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
                {item().companyA.displayName} vs {item().companyB.displayName} Interview Questions
              </h1>
              <p class="mt-3 text-muted-foreground">
                {item().companyA.displayName} and {item().companyB.displayName} share{" "}
                {item().sharedCount.toLocaleString()} problems.
              </p>
              <Show when={item().blogSlug}>
                <a class="mt-3 inline-block text-sm underline" href={`/blog/${item().blogSlug}`}>
                  Read the preparation guide
                </a>
              </Show>
            </header>
            <section class="mb-8">
              <h2 class="mb-4 text-lg font-semibold">Overview</h2>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <For each={[item().companyA, item().companyB]}>
                  {(company) => (
                    <a
                      class="rounded-lg border bg-card p-4 hover:bg-accent"
                      href={`/company/${company.slug}`}
                    >
                      <h3 class="font-semibold">{company.displayName}</h3>
                      <p class="mt-2 text-sm text-muted-foreground">
                        {company.questionCount.toLocaleString()} questions
                      </p>
                      <p class="mt-2 text-xs text-muted-foreground">
                        {company.difficultyDist.easy} Easy · {company.difficultyDist.medium} Medium
                        · {company.difficultyDist.hard} Hard
                      </p>
                    </a>
                  )}
                </For>
              </div>
            </section>
            <Show when={item().topSharedTopics.length > 0}>
              <section class="mb-8">
                <h2 class="mb-4 text-lg font-semibold">Top shared topics</h2>
                <div class="flex flex-wrap gap-2">
                  <For each={item().topSharedTopics}>
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
            <QuestionList
              heading={`${item().sharedCount.toLocaleString()} shared questions`}
              questions={item().sharedProblems}
            />
            <QuestionList
              heading={`${item().companyA.displayName}-only questions`}
              questions={item().exclusiveToA}
            />
            <QuestionList
              heading={`${item().companyB.displayName}-only questions`}
              questions={item().exclusiveToB}
            />
          </>
        )}
      </Show>
    </main>
  );
}

function QuestionList(props: { heading: string; questions: Question[] }) {
  return (
    <section class="mb-8">
      <h2 class="mb-4 text-lg font-semibold">{props.heading}</h2>
      <div class="overflow-x-auto rounded-lg border">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50 text-left text-muted-foreground">
              <th class="px-4 py-3">Title</th>
              <th class="px-4 py-3">Difficulty</th>
              <th class="hidden px-4 py-3 sm:table-cell">Topics</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.questions.slice(0, 100)}>
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
                  <td class="px-4 py-3">{question.difficulty}</td>
                  <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {question.topics.join(", ")}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <Show when={props.questions.length > 100}>
        <p class="mt-3 text-xs text-muted-foreground">Showing the first 100 questions.</p>
      </Show>
    </section>
  );
}
