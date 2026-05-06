import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLessonParams, getCourseBySlug, getLesson } from "@/lib/learn/loader";
import { LessonWorkspace } from "@/components/learn/LessonWorkspace";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllLessonParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}): Promise<Metadata> {
  const { course, lesson } = await params;
  const data = await getLesson(course, lesson);
  if (!data) return { title: "Lesson Not Found" };
  return {
    title: `${data.title} — Learn`,
    description: data.description,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course, lesson } = await params;
  const [lessonData, courseData] = await Promise.all([
    getLesson(course, lesson),
    getCourseBySlug(course),
  ]);
  if (!lessonData || !courseData) notFound();

  const orderedLessons = courseData.lessons;
  const currentIndex = orderedLessons.findIndex((l) => l.slug === lessonData.slug);
  const prev = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < orderedLessons.length - 1
      ? orderedLessons[currentIndex + 1]
      : null;

  return (
    <LessonWorkspace
      lesson={lessonData}
      courseTitle={courseData.title}
      courseHref={`/learn/${courseData.slug}`}
      prevHref={prev ? `/learn/${courseData.slug}/${prev.slug}` : null}
      nextHref={next ? `/learn/${courseData.slug}/${next.slug}` : null}
      prevTitle={prev?.title ?? null}
      nextTitle={next?.title ?? null}
    />
  );
}
