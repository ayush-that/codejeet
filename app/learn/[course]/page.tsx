import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/learn/loader";

export const dynamic = "force-static";
export const dynamicParams = false;

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

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href="/learn" className="text-xs text-muted-foreground hover:text-foreground">
        ← Learn
      </Link>
      <header className="mt-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{data.title}</h1>
        <p className="mt-3 text-muted-foreground">{data.description}</p>
      </header>
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
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
