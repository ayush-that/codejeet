export default function Home() {
  return (
    <main>
      <div class="h-2 hatch" />
      <section class="grid-field relative overflow-hidden bg-background">
        <div class="container mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
          <p class="mb-5 text-sm font-semibold tracking-[0.16em] text-muted-foreground">CODEJEET</p>
          <h1 class="max-w-5xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            15,000+ Company-wise LeetCode Interview Questions
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Filter by company, topic, and difficulty. Practice smarter for your next tech interview.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a
              class="rounded bg-primary px-8 py-3 text-base font-medium text-primary-foreground"
              href="/dashboard"
            >
              DSA
            </a>
            <a
              class="rounded border border-border px-8 py-3 text-base font-medium hover:bg-muted"
              href="/system-design"
            >
              System Design
            </a>
          </div>
          <figure class="mt-12 w-full overflow-hidden rounded border border-border bg-card p-1.5">
            <img
              alt="Codejeet dashboard showing company-wise LeetCode questions filtered by difficulty and topic"
              class="h-auto w-full"
              height="1500"
              src="/image1.webp"
              width="2000"
            />
          </figure>
        </div>
      </section>
      <div class="h-2 hatch" />
    </main>
  );
}
