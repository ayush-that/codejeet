import { For } from "solid-js";
import { SYSTEM_DESIGN_CHAPTERS } from "../../lib/system-design/generated";

export default function SystemDesign() {
  const chapters = SYSTEM_DESIGN_CHAPTERS.slice().sort((left, right) => left.order - right.order);
  return (
    <main class="container mx-auto max-w-4xl px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">System Design</h1>
        <p class="mt-2 text-muted-foreground">
          Practical chapters for system design interview preparation.
        </p>
      </header>
      <ol class="space-y-3">
        <For each={chapters}>
          {(chapter) => (
            <li>
              <a
                class="block rounded border border-border bg-card p-4 hover:bg-accent"
                href={`/system-design/${chapter.slug}`}
              >
                <span class="text-sm text-muted-foreground">Chapter {chapter.order}</span>
                <h2 class="mt-1 font-semibold">
                  {chapter.title ?? chapter.heading ?? chapter.folder}
                </h2>
              </a>
            </li>
          )}
        </For>
      </ol>
    </main>
  );
}
