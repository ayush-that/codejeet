import { For } from "solid-js";
import { LEARN_DATA } from "../../lib/learn/generated";

export default function Learn() {
  const courses = LEARN_DATA.courses
    .slice()
    .sort((left, right) => left.meta.order - right.meta.order);
  const bySlug = new Map(courses.map((course) => [course.meta.slug, course]));
  const totalTopics = LEARN_DATA.roadmap.steps.reduce(
    (total, step) => total + step.topics.length,
    0
  );
  return (
    <main class="container mx-auto max-w-5xl px-4 py-10">
      <header class="mb-10">
        <p class="mb-2 text-xs uppercase tracking-wider text-muted-foreground">DSA roadmap</p>
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
          Learn data structures and algorithms, end to end
        </h1>
        <p class="mt-3 max-w-2xl text-muted-foreground">
          {LEARN_DATA.roadmap.steps.length} chapters, {totalTopics} topics, and {courses.length}{" "}
          live courses.
        </p>
      </header>
      <div class="space-y-6">
        <For each={LEARN_DATA.roadmap.steps}>
          {(step) => (
            <section class="overflow-hidden rounded-lg border border-border bg-card/40">
              <header class="border-b border-border bg-muted/20 px-5 py-4">
                <p class="text-xs uppercase tracking-wider text-muted-foreground">
                  Step {step.order}
                </p>
                <h2 class="mt-1 text-lg font-semibold">{step.title}</h2>
                <ShowDescription text={step.description} />
              </header>
              <div class="grid grid-cols-1 gap-2 p-3 md:grid-cols-2">
                <For each={step.topics}>
                  {(topic) => (
                    <div class="rounded border border-border p-3">
                      <h3 class="font-semibold">{topic.title}</h3>
                      <ShowDescription text={topic.description} />
                      <For
                        each={topic.courses
                          .map((slug) => bySlug.get(slug))
                          .filter((course) => course !== undefined)}
                      >
                        {(course) => (
                          <a
                            class="mt-3 block rounded border border-border bg-background px-3 py-2 text-sm hover:bg-accent"
                            href={`/learn/${course.meta.slug}`}
                          >
                            {course.meta.title}
                            <span class="ml-2 text-xs text-muted-foreground">
                              {course.lessons.length} lessons
                            </span>
                          </a>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </section>
          )}
        </For>
      </div>
    </main>
  );
}

function ShowDescription(props: { text?: string }) {
  return props.text ? <p class="mt-2 text-sm text-muted-foreground">{props.text}</p> : null;
}
