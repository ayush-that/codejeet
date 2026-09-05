import { useParams } from "@solidjs/router";
import { For, Show, createMemo, createSignal, onMount } from "solid-js";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  content: string;
};
type IndexPost = Omit<Post, "content">;

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = createSignal<Post>();
  const [index, setIndex] = createSignal<IndexPost[]>([]);
  const [failed, setFailed] = createSignal(false);
  const related = createMemo(() =>
    post()
      ? index()
          .filter((item) => item.slug !== post()!.slug && item.category === post()!.category)
          .slice(0, 4)
      : []
  );
  onMount(() => {
    void Promise.all([fetch(`/data/blog/${params.slug}.json`), fetch("/data/blog-index.json")])
      .then(async ([content, listing]) => {
        if (!content.ok || !listing.ok) throw new Error("Could not load the post");
        setPost((await content.json()) as Post);
        setIndex((await listing.json()) as IndexPost[]);
      })
      .catch(() => setFailed(true));
  });
  return (
    <main class="container mx-auto max-w-3xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href="/blog">
        ← Blog
      </a>
      <Show
        when={post()}
        fallback={
          <p class="mt-6 text-muted-foreground">
            {failed() ? "Blog post not found." : "Loading post…"}
          </p>
        }
      >
        {(item) => (
          <>
            <article class="mt-6">
              <header class="mb-8">
                <p class="text-sm text-muted-foreground">
                  <time>{item().date}</time> · {item().category.replace(/-/g, " ")}
                </p>
                <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{item().title}</h1>
                <p class="mt-3 text-lg text-muted-foreground">{item().description}</p>
              </header>
              <pre class="whitespace-pre-wrap font-sans text-sm leading-7 text-foreground">
                {item().content}
              </pre>
            </article>
            <Show when={related().length > 0}>
              <section class="mt-12 border-t pt-8">
                <h2 class="mb-4 text-xl font-semibold">Related articles</h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <For each={related()}>
                    {(relatedPost) => (
                      <a
                        class="rounded-lg border bg-card p-4 hover:bg-accent"
                        href={`/blog/${relatedPost.slug}`}
                      >
                        <h3 class="font-medium">{relatedPost.title}</h3>
                        <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {relatedPost.description}
                        </p>
                      </a>
                    )}
                  </For>
                </div>
              </section>
            </Show>
          </>
        )}
      </Show>
    </main>
  );
}
