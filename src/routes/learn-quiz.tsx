import { useParams } from "@solidjs/router";
import { For, Show, createMemo, createSignal } from "solid-js";
import { LEARN_DATA } from "../../lib/learn/generated";

type Question =
  | {
      id: string;
      kind: "mcq";
      prompt: string;
      options: string[];
      correctIndex: number;
      code?: string;
      explanation?: string;
    }
  | {
      id: string;
      kind: "fill-blank" | "predict-output";
      prompt: string;
      acceptedAnswers?: string[];
      acceptedOutputs?: string[];
      code?: string;
      explanation?: string;
    };
const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

export default function LearnQuiz() {
  const params = useParams<{ course: string; quiz: string }>();
  const quiz = createMemo(() =>
    LEARN_DATA.courses
      .find((course) => course.meta.slug === params.course)
      ?.quizzes.find((item) => item.slug === params.quiz)
  );
  const [answers, setAnswers] = createSignal<Record<string, string>>({});
  const [submitted, setSubmitted] = createSignal(false);
  const correct = (question: Question) =>
    question.kind === "mcq"
      ? answers()[question.id] === String(question.correctIndex)
      : (question.acceptedAnswers ?? question.acceptedOutputs ?? [])
          .map(normalize)
          .includes(normalize(answers()[question.id] ?? ""));
  const setAnswer = (id: string, value: string) =>
    setAnswers((current) => ({ ...current, [id]: value }));
  return (
    <main class="container mx-auto max-w-3xl px-4 py-8">
      <a class="text-sm text-muted-foreground hover:underline" href={`/learn/${params.course}`}>
        ← Course
      </a>
      <Show
        when={quiz()}
        fallback={
          <section class="mt-6 rounded border border-border p-6">
            <h1 class="text-2xl font-bold">Quiz not found</h1>
          </section>
        }
      >
        {(item) => (
          <>
            <header class="mb-8 mt-6">
              <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{item().title}</h1>
              <Show when={item().description}>
                <p class="mt-3 text-muted-foreground">{item().description}</p>
              </Show>
            </header>
            <ol class="space-y-6">
              <For each={item().questions as Question[]}>
                {(question, index) => (
                  <li class="rounded-lg border border-border p-5">
                    <h2 class="font-semibold">
                      {index() + 1}. {question.prompt}
                    </h2>
                    <Show when={question.code}>
                      <pre class="mt-4 overflow-x-auto rounded bg-muted p-4 text-xs">
                        {question.code}
                      </pre>
                    </Show>
                    <Show
                      when={question.kind === "mcq"}
                      fallback={
                        <input
                          class="mt-4 h-10 w-full rounded border border-input bg-background px-3 text-sm"
                          onInput={(event) => setAnswer(question.id, event.currentTarget.value)}
                          value={answers()[question.id] ?? ""}
                        />
                      }
                    >
                      <div class="mt-4 space-y-2">
                        <For each={(question as Extract<Question, { kind: "mcq" }>).options}>
                          {(option, choice) => (
                            <label class="flex gap-2 rounded border p-3 text-sm">
                              <input
                                checked={answers()[question.id] === String(choice())}
                                name={question.id}
                                onChange={() => setAnswer(question.id, String(choice()))}
                                type="radio"
                              />
                              {option}
                            </label>
                          )}
                        </For>
                      </div>
                    </Show>
                    <Show when={submitted()}>
                      <p
                        class={`mt-4 text-sm ${correct(question) ? "text-green-600" : "text-red-600"}`}
                      >
                        {correct(question) ? "Correct" : "Not quite"}
                      </p>
                      <Show when={question.explanation}>
                        <p class="mt-2 text-sm text-muted-foreground">{question.explanation}</p>
                      </Show>
                    </Show>
                  </li>
                )}
              </For>
            </ol>
            <button
              class="mt-8 rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
              onClick={() => setSubmitted(true)}
              type="button"
            >
              Check answers
            </button>
            <Show when={submitted()}>
              <p class="mt-3 text-sm text-muted-foreground">
                {item().questions.filter((question) => correct(question as Question)).length} of{" "}
                {item().questions.length} correct
              </p>
            </Show>
          </>
        )}
      </Show>
    </main>
  );
}
