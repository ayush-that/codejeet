import { Show, createMemo } from "solid-js";
import { useParams } from "@solidjs/router";
import { SYSTEM_DESIGN_CHAPTERS } from "../../lib/system-design/generated";

export default function SystemDesignChapter() {
  const params = useParams<{ slug: string }>();
  const chapter = createMemo(() =>
    SYSTEM_DESIGN_CHAPTERS.find((item) => item.slug === params.slug)
  );
  return (
    <main class="container mx-auto max-w-4xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href="/system-design">
        ← System Design
      </a>
      <Show
        when={chapter()}
        fallback={
          <section class="mt-6 rounded border border-border p-6">
            <h1 class="text-2xl font-bold">Chapter not found</h1>
          </section>
        }
      >
        {(item) => (
          <article class="mt-6">
            <header class="mb-8">
              <p class="text-sm text-muted-foreground">Chapter {item().order}</p>
              <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {item().title ?? item().heading ?? item().folder}
              </h1>
              <Show when={item().video}>
                <a
                  class="mt-4 inline-block text-sm underline"
                  href={item().video}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Watch the accompanying video
                </a>
              </Show>
            </header>
            <pre class="whitespace-pre-wrap font-sans text-sm leading-7 text-muted-foreground">
              {item().content}
            </pre>
          </article>
        )}
      </Show>
    </main>
  );
}
