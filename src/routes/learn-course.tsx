import { useParams } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { LEARN_DATA } from "../../lib/learn/generated";

export default function LearnCourse() {
  const params = useParams<{ course: string }>();
  const course = createMemo(() =>
    LEARN_DATA.courses.find((item) => item.meta.slug === params.course)
  );
  return (
    <main class="container mx-auto max-w-3xl px-4 py-10">
      <a class="text-sm text-muted-foreground hover:underline" href="/learn">
        ← Learn
      </a>
      <Show
        when={course()}
        fallback={
          <section class="mt-6 rounded border border-border p-6">
            <h1 class="text-2xl font-bold">Course not found</h1>
          </section>
        }
      >
        {(item) => (
          <>
            <header class="mb-8 mt-4">
              <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{item().meta.title}</h1>
              <p class="mt-3 text-muted-foreground">{item().meta.description}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <For each={item().meta.languages}>
                  {(language) => (
                    <span class="rounded border border-border px-2 py-1 text-xs uppercase tracking-wider">
                      {language}
                    </span>
                  )}
                </For>
              </div>
            </header>
            <section>
              <h2 class="mb-3 text-sm uppercase tracking-wider text-muted-foreground">Lessons</h2>
              <ol class="space-y-2">
                <For each={item().lessons}>
                  {(lesson, index) => (
                    <li>
                      <a
                        class="group flex gap-4 rounded-lg border border-border p-4 hover:bg-accent"
                        href={`/learn/${item().meta.slug}/${lesson.slug}`}
                      >
                        <span class="pt-0.5 font-mono text-xs text-muted-foreground">
                          {String(index() + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <strong class="font-medium">{lesson.title}</strong>
                          <Show when={lesson.description}>
                            <span class="mt-1 block text-sm text-muted-foreground">
                              {lesson.description}
                            </span>
                          </Show>
                        </span>
                      </a>
                    </li>
                  )}
                </For>
              </ol>
            </section>
            <Show when={item().quizzes.length > 0}>
              <section class="mt-10">
                <h2 class="mb-3 text-sm uppercase tracking-wider text-muted-foreground">Quizzes</h2>
                <ol class="space-y-2">
                  <For each={item().quizzes}>
                    {(quiz, index) => (
                      <li>
                        <a
                          class="group flex gap-4 rounded-lg border border-border p-4 hover:bg-accent"
                          href={`/learn/${item().meta.slug}/quiz/${quiz.slug}`}
                        >
                          <span class="pt-0.5 font-mono text-xs text-muted-foreground">
                            Q{String(index() + 1).padStart(2, "0")}
                          </span>
                          <span>
                            <strong class="font-medium">{quiz.title}</strong>
                            <Show when={quiz.description}>
                              <span class="mt-1 block text-sm text-muted-foreground">
                                {quiz.description}
                              </span>
                            </Show>
                          </span>
                        </a>
                      </li>
                    )}
                  </For>
                </ol>
              </section>
            </Show>
          </>
        )}
      </Show>
    </main>
  );
}
