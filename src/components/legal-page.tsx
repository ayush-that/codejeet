import { For } from "solid-js";

type LegalPageProps = {
  crumb: string;
  paragraphs: readonly string[];
  title: string;
};

export function LegalPage(props: LegalPageProps) {
  return (
    <main class="container mx-auto max-w-3xl px-4 py-8">
      <nav class="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <a class="hover:text-foreground hover:underline" href="/">
          Home
        </a>
        <span aria-hidden="true"> / </span>
        <span>{props.crumb}</span>
      </nav>
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{props.title}</h1>
      </header>
      <div class="space-y-4 leading-relaxed text-muted-foreground">
        <For each={props.paragraphs}>{(paragraph) => <p>{paragraph}</p>}</For>
      </div>
    </main>
  );
}
