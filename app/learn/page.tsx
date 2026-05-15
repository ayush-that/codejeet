import type { Metadata } from "next";
import Link from "next/link";
import { getAllCourses, getRoadmap } from "@/lib/learn/loader";
import { LANGUAGE_LABEL } from "@/lib/learn/types";
import type { CourseSummary } from "@/lib/learn/types";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Learn DSA — Codejeet",
  description:
    "A complete data-structures-and-algorithms roadmap with lessons, exercises and quizzes. Solve problems in C++, Python, JavaScript or Java — your code compiles and runs in your browser.",
};

export default async function LearnIndexPage() {
  const [roadmap, courses] = await Promise.all([getRoadmap(), getAllCourses()]);
  const coursesBySlug = new Map<string, CourseSummary>(courses.map((c) => [c.slug, c]));

  const totalCourses = courses.length;
  const totalLessons = courses.reduce((acc, c) => acc + c.lessonCount, 0);
  const totalSteps = roadmap.steps.length;
  const totalTopics = roadmap.steps.reduce((acc, s) => acc + s.topics.length, 0);
  const estimatedProblems = roadmap.steps.reduce((acc, s) => acc + (s.problemCount ?? 0), 0);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          DSA roadmap
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Learn data structures and algorithms, end to end
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
          {totalSteps} chapters, {totalTopics} topics, ~{estimatedProblems} problems. Read a lesson,
          solve the exercise, take a quiz. Your code compiles and runs in your browser — C++, Python
          and JavaScript today, Java soon.
        </p>
        <div className="mt-5 flex gap-2 flex-wrap text-xs text-muted-foreground">
          <span className="rounded border border-border px-2 py-1">
            {totalCourses} course{totalCourses === 1 ? "" : "s"} live
          </span>
          <span className="rounded border border-border px-2 py-1">
            {totalLessons} lesson{totalLessons === 1 ? "" : "s"} authored
          </span>
          <span className="rounded border border-border px-2 py-1">100% in-browser execution</span>
        </div>
      </header>

      <div className="space-y-6">
        {roadmap.steps.map((step) => {
          const stepCourses = step.topics.flatMap((t) =>
            t.courses.map((slug) => coursesBySlug.get(slug)).filter(Boolean)
          );
          const liveCount = stepCourses.length;
          return (
            <section
              key={step.slug}
              className="rounded-lg border border-border bg-card/40 overflow-hidden"
            >
              <div className="flex items-baseline justify-between gap-4 px-5 py-4 border-b border-border bg-muted/20">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Step {step.order}
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold tracking-tight mt-0.5">
                    {step.title}
                  </h2>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {step.problemCount ? `${step.problemCount} problems` : ""}
                  {liveCount > 0 && <span className="ml-2 text-emerald-400">{liveCount} live</span>}
                </div>
              </div>
              {step.description && (
                <p className="px-5 pt-3 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
                {step.topics.map((topic) => {
                  const liveCoursesForTopic = topic.courses
                    .map((slug) => coursesBySlug.get(slug))
                    .filter((c): c is CourseSummary => c !== undefined);
                  const hasLive = liveCoursesForTopic.length > 0;
                  return (
                    <div
                      key={topic.slug}
                      className={
                        "rounded border p-3 text-sm transition-colors " +
                        (hasLive
                          ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                          : "border-border bg-muted/20 text-muted-foreground")
                      }
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="font-semibold text-foreground">{topic.title}</div>
                        {hasLive ? (
                          <span className="text-[10px] uppercase tracking-wider text-emerald-400">
                            ready
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider">soon</span>
                        )}
                      </div>
                      {topic.description && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {topic.description}
                        </p>
                      )}
                      {hasLive && (
                        <div className="mt-2 space-y-1">
                          {liveCoursesForTopic.map((course) => (
                            <Link
                              key={course.slug}
                              href={`/learn/${course.slug}`}
                              className="group flex items-center justify-between gap-2 rounded border border-border bg-background hover:border-foreground/40 px-2 py-1.5"
                            >
                              <span className="text-foreground truncate group-hover:text-foreground/90 text-xs">
                                {course.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {course.lessonCount} lesson{course.lessonCount === 1 ? "" : "s"} ·{" "}
                                {course.languages.map((l) => LANGUAGE_LABEL[l]).join(", ")}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
