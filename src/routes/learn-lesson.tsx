import { useParams } from "@solidjs/router";
import { For, Show, createMemo, createSignal } from "solid-js";
import { LEARN_DATA } from "../../lib/learn/generated";
import type { LessonLanguage } from "../../lib/learn/types";

export default function LearnLesson() {
  const params = useParams<{ course: string; lesson: string }>();
  const course = createMemo(() =>
    LEARN_DATA.courses.find((item) => item.meta.slug === params.course)
  );
  const lesson = createMemo(() => course()?.lessons.find((item) => item.slug === params.lesson));
  const [language, setLanguage] = createSignal<LessonLanguage>();
  const selectedLanguage = createMemo(() => language() ?? lesson()?.languages[0]);
  const selectedSource = createMemo(() => {
    const selected = selectedLanguage();
    return selected ? lesson()?.sources[selected] : undefined;
  });
  const previous = createMemo(() => {
    const items = course()?.lessons ?? [];
    const at = items.findIndex((item) => item.slug === params.lesson);
    return at > 0 ? items[at - 1] : undefined;
  });
  const next = createMemo(() => {
    const items = course()?.lessons ?? [];
    const at = items.findIndex((item) => item.slug === params.lesson);
    return at >= 0 && at < items.length - 1 ? items[at + 1] : undefined;
  });
  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href={`/learn/${params.course}`}>
        ← Course
      </a>
      <Show
        when={lesson()}
        fallback={
          <section class="mt-6 rounded border border-border p-6">
            <h1 class="text-2xl font-bold">Lesson not found</h1>
          </section>
        }
      >
        {(item) => (
          <>
            <article class="mt-6">
              <header class="mb-8">
                <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{item().title}</h1>
                <Show when={item().description}>
                  <p class="mt-3 text-lg text-muted-foreground">{item().description}</p>
                </Show>
              </header>
              <pre class="whitespace-pre-wrap font-sans text-sm leading-7">{item().body}</pre>
            </article>
            <section class="mt-10 rounded-lg border border-border bg-card p-5">
              <h2 class="text-xl font-semibold">Your turn</h2>
              <p class="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                {item().exercise.prompt}
              </p>
              <div class="mt-5 flex flex-wrap gap-2">
                <For each={item().languages}>
                  {(value) => (
                    <button
                      class={`rounded border px-3 py-1.5 text-sm ${selectedLanguage() === value ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                      onClick={() => setLanguage(value)}
                      type="button"
                    >
                      {value}
                    </button>
                  )}
                </For>
              </div>
              <Show when={selectedSource()}>
                <pre class="mt-4 overflow-x-auto rounded bg-muted p-4 text-xs leading-6">
                  {selectedSource()?.starter}
                </pre>
              </Show>
            </section>
            <nav class="mt-8 flex justify-between gap-4">
              <Show when={previous()}>
                {(value) => (
                  <a
                    class="text-sm hover:underline"
                    href={`/learn/${params.course}/${value().slug}`}
                  >
                    ← {value().title}
                  </a>
                )}
              </Show>
              <Show when={next()}>
                {(value) => (
                  <a
                    class="ml-auto text-right text-sm hover:underline"
                    href={`/learn/${params.course}/${value().slug}`}
                  >
                    {value().title} →
                  </a>
                )}
              </Show>
            </nav>
          </>
        )}
      </Show>
    </main>
  );
}
