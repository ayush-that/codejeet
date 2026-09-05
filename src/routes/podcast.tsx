import { For, Show, createMemo, createSignal, onMount } from "solid-js";

type Chapter = { index: number; title: string; file: string; duration_seconds: number };
type Podcast = { title: string; author: string; total_chapters: number; chapters: Chapter[] };
const duration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

export default function Podcast() {
  const [podcast, setPodcast] = createSignal<Podcast>();
  const [chapterIndex, setChapterIndex] = createSignal(0);
  const [failed, setFailed] = createSignal(false);
  const chapter = createMemo(() => podcast()?.chapters[chapterIndex()]);
  const source = createMemo(() =>
    chapter() ? `${import.meta.env.VITE_R2_BASE_URL ?? ""}/podcast/${chapter()!.file}` : ""
  );
  onMount(() => {
    void fetch("/data/podcast.json")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load podcast");
        setPodcast((await response.json()) as Podcast);
      })
      .catch(() => setFailed(true));
  });
  return (
    <main class="container mx-auto max-w-2xl px-4 py-8">
      <Show
        when={podcast()}
        fallback={
          <p class="py-16 text-center text-muted-foreground">
            {failed() ? "Could not load podcast." : "Loading podcast…"}
          </p>
        }
      >
        {(item) => (
          <>
            <header class="text-center">
              <a
                class="text-3xl font-bold tracking-tight hover:underline"
                href="https://github.com/subhashchy/The-Accidental-CTO"
                rel="noopener noreferrer"
                target="_blank"
              >
                {item().title}
              </a>
              <p class="mt-2 text-sm text-muted-foreground">{item().author}</p>
            </header>
            <section class="mt-10">
              <h1 class="text-center text-lg font-semibold">{chapter()?.title}</h1>
              <p class="mt-1 text-center text-xs text-muted-foreground">
                Chapter {chapter()?.index} of {item().total_chapters}
              </p>
              <audio class="mt-5 w-full" controls src={source()}>
                Your browser does not support audio playback.
              </audio>
              <div class="mt-4 flex justify-center gap-3">
                <button
                  class="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
                  disabled={chapterIndex() === 0}
                  onClick={() => setChapterIndex((value) => value - 1)}
                  type="button"
                >
                  Previous
                </button>
                <button
                  class="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
                  disabled={chapterIndex() >= item().chapters.length - 1}
                  onClick={() => setChapterIndex((value) => value + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            </section>
            <section class="mt-10 overflow-hidden rounded-lg border">
              <h2 class="border-b px-4 py-3 text-sm font-semibold">Chapters</h2>
              <ol class="max-h-96 overflow-y-auto">
                <For each={item().chapters}>
                  {(chapterItem, index) => (
                    <li>
                      <button
                        class={`flex w-full items-center gap-3 border-b px-4 py-3 text-left text-sm hover:bg-accent ${index() === chapterIndex() ? "bg-accent font-medium" : ""}`}
                        onClick={() => setChapterIndex(index())}
                        type="button"
                      >
                        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                          {chapterItem.index}
                        </span>
                        <span class="min-w-0 flex-1">{chapterItem.title}</span>
                        <span class="text-xs text-muted-foreground">
                          {duration(chapterItem.duration_seconds)}
                        </span>
                      </button>
                    </li>
                  )}
                </For>
              </ol>
            </section>
          </>
        )}
      </Show>
    </main>
  );
}
