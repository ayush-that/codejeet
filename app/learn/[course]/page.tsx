import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug, getQuizzesForCourse } from "@/lib/learn/loader";
import { LANGUAGE_LABEL } from "@/lib/learn/types";

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course } = await params;
  const data = await getCourseBySlug(course);
  if (!data) return { title: "Course Not Found" };
  return {
    title: `${data.title} — Learn`,
    description: data.description,
  };
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const data = await getCourseBySlug(course);
  if (!data) notFound();

  const quizzes = await getQuizzesForCourse(course);
  const languageBadges = data.languages.map((l) => LANGUAGE_LABEL[l]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href="/learn" className="text-xs text-muted-foreground hover:text-foreground">
        ← Learn
      </Link>
      <header className="mt-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
        <p className="mt-3 text-muted-foreground">{data.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
          {languageBadges.map((label) => (
            <span key={label} className="rounded border border-border bg-muted/40 px-2 py-1">
              {label}
            </span>
          ))}
        </div>
      </header>

      <section>
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Lessons</h2>
        <ol className="space-y-2">
          {data.lessons.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link
                href={`/learn/${data.slug}/${lesson.slug}`}
                className="group flex items-start gap-4 rounded-lg border border-border p-4 hover:border-foreground/40 transition-colors"
              >
                <div className="text-xs font-mono text-muted-foreground w-6 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground group-hover:text-foreground/90">
                    {lesson.title}
                  </div>
                  {lesson.description && (
                    <div className="text-sm text-muted-foreground mt-1">{lesson.description}</div>
                  )}
                  <div className="mt-2 flex gap-1 flex-wrap text-[10px] uppercase tracking-wider text-muted-foreground">
                    {lesson.languages.map((l) => (
                      <span
                        key={l}
                        className="rounded border border-border bg-muted/40 px-1.5 py-0.5"
                      >
                        {LANGUAGE_LABEL[l]}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {quizzes.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Quizzes</h2>
          <ol className="space-y-2">
            {quizzes.map((quiz, i) => (
              <li key={quiz.slug}>
                <Link
                  href={`/learn/${data.slug}/quiz/${quiz.slug}`}
                  className="group flex items-start gap-4 rounded-lg border border-border p-4 hover:border-foreground/40 transition-colors"
                >
                  <div className="text-xs font-mono text-muted-foreground w-6 pt-0.5">
                    Q{String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground group-hover:text-foreground/90">
                      {quiz.title}
                    </div>
                    {quiz.description && (
                      <div className="text-sm text-muted-foreground mt-1">{quiz.description}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {quiz.questionCount} question{quiz.questionCount === 1 ? "" : "s"}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
