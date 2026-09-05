import { For, Show, createMemo, createSignal, onMount } from "solid-js";

type Post = { slug: string; title: string; description: string; date: string; category: string };
const PAGE_SIZE = 24;
const categories = [
  ["All", "all"],
  ["Company Guides", "company-guide"],
  ["DSA Patterns", "dsa-patterns"],
  ["Tips & Strategies", "tips"],
] as const;

export default function Blog() {
  const [posts, setPosts] = createSignal<Post[]>([]);
  const [category, setCategory] = createSignal("all");
  const [search, setSearch] = createSignal("");
  const [page, setPage] = createSignal(1);
  const [failed, setFailed] = createSignal(false);
  const filtered = createMemo(() => {
    const query = search().trim().toLowerCase();
    return posts().filter(
      (post) =>
        (category() === "all" || post.category === category()) &&
        (!query || post.title.toLowerCase().includes(query))
    );
  });
  const totalPages = createMemo(() => Math.max(1, Math.ceil(filtered().length / PAGE_SIZE)));
  const currentPage = createMemo(() => Math.min(page(), totalPages()));
  const visible = createMemo(() =>
    filtered().slice((currentPage() - 1) * PAGE_SIZE, currentPage() * PAGE_SIZE)
  );
  const reset = (action: () => void) => {
    action();
    setPage(1);
  };

  onMount(() => {
    void fetch("/data/blog-index.json")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the blog");
        setPosts((await response.json()) as Post[]);
      })
      .catch(() => setFailed(true));
  });

  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <header class="mb-10">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p class="mt-2 text-muted-foreground">
          Interview prep guides, DSA patterns, and tips for cracking tech interviews
        </p>
      </header>
      <Show
        when={!failed()}
        fallback={<p class="rounded border border-destructive p-4">Could not load blog posts.</p>}
      >
        <div class="mb-6 flex flex-col gap-3 sm:flex-row">
          <div class="flex flex-wrap gap-2">
            <For each={categories}>
              {([label, value]) => (
                <button
                  class={`rounded border px-3 py-1.5 text-sm ${category() === value ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                  onClick={() => reset(() => setCategory(value))}
                  type="button"
                >
                  {label}
                </button>
              )}
            </For>
          </div>
          <input
            class="h-9 rounded border border-input bg-background px-3 text-sm sm:ml-auto sm:max-w-xs"
            onInput={(event) => reset(() => setSearch(event.currentTarget.value))}
            placeholder="Search posts..."
            value={search()}
          />
        </div>
        <p class="mb-4 text-sm text-muted-foreground">{filtered().length.toLocaleString()} posts</p>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={visible()}>
            {(post) => (
              <a
                class="group block rounded-lg border bg-card p-5 transition-colors hover:bg-accent"
                href={`/blog/${post.slug}`}
              >
                <h2 class="font-semibold group-hover:underline">{post.title}</h2>
                <p class="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
                <time class="mt-3 block text-xs text-muted-foreground">{post.date}</time>
              </a>
            )}
          </For>
        </div>
        <Show when={visible().length === 0 && posts().length > 0}>
          <p class="py-12 text-center text-muted-foreground">No posts match your filters.</p>
        </Show>
        <Show when={totalPages() > 1}>
          <nav class="mt-8 flex items-center justify-center gap-4" aria-label="Blog pages">
            <button
              class="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={currentPage() <= 1}
              onClick={() => setPage((value) => value - 1)}
              type="button"
            >
              Previous
            </button>
            <span class="text-sm text-muted-foreground">
              Page {currentPage()} of {totalPages()}
            </span>
            <button
              class="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={currentPage() >= totalPages()}
              onClick={() => setPage((value) => value + 1)}
              type="button"
            >
              Next
            </button>
          </nav>
        </Show>
      </Show>
    </main>
  );
}
