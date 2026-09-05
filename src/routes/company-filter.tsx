import { createAsync, useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { loadPublicData } from "../lib/public-data";

type Question = {
  slug: string;
  title: string;
  difficulty: string;
  acceptance: string;
  frequency: string;
  topics: string[];
};
type Company = { displayName: string; questions: Question[] };
const topicSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CompanyFilter() {
  const params = useParams<{ slug: string; filter: string }>();
  const profiles = createAsync(() => loadPublicData<Record<string, Company>>("/data/company-profiles.json"), {
    initialValue: {},
    deferStream: true,
  });
  const company = createMemo(() => profiles()[params.slug]);
  const questions = createMemo(
    () =>
      company()?.questions.filter(
        (question) =>
          question.difficulty.toLowerCase() === params.filter ||
          question.slug === params.filter ||
          question.topics.some((topic) => topicSlug(topic) === params.filter)
      ) ?? []
  );
  const title = createMemo(() =>
    company()
      ? `${company()!.displayName} ${params.filter.replace(/-/g, " ")} Questions`
      : "Company questions"
  );
  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href={`/company/${params.slug}`}>
        ← Company
      </a>
      <Show
        when={company()}
        fallback={
          <p class="mt-6 text-muted-foreground">
            Company not found.
          </p>
        }
      >
        <header class="mb-8 mt-6">
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{title()}</h1>
          <p class="mt-2 text-muted-foreground">
            {questions().length.toLocaleString()} matching interview questions
          </p>
        </header>
        <Show
          when={questions().length > 0}
          fallback={
            <p class="rounded border border-border p-6 text-muted-foreground">
              No matching questions found.
            </p>
          }
        >
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
                <For each={questions()}>
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
                        {question.acceptance}
                      </td>
                      <td class="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                        {question.topics.join(", ")}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Show>
    </main>
  );
}
