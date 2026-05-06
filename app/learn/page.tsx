import type { Metadata } from "next";
import Link from "next/link";
import { getAllCourses } from "@/lib/learn/loader";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Learn — Interactive DSA Exercises",
  description:
    "Hands-on coding exercises that compile and run in your browser. Start with linked lists in C++, with more languages and topics on the way.",
};

export default async function LearnIndexPage() {
  const courses = await getAllCourses();

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Learn</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Interactive exercises that compile and run in your browser. Read on the left, code on the
          right, hit Run. No accounts, no servers — your code never leaves your machine.
        </p>
      </header>

      {courses.length === 0 ? (
        <div className="rounded-lg border border-border p-6 text-muted-foreground">
          No courses yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/learn/${course.slug}`}
              className="group rounded-lg border border-border p-5 hover:border-foreground/40 transition-colors block"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-lg font-semibold tracking-tight group-hover:text-foreground/90">
                  {course.title}
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {course.language}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
              <div className="mt-4 text-xs text-muted-foreground">
                {course.lessonCount} lesson{course.lessonCount === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
