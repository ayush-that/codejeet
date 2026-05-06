import type { CourseSummary, Lesson } from "./types";
import { LEARN_COURSES } from "./generated";

// Lessons are baked into a generated TS module at build time
// (see scripts/build-learn.ts). We deliberately avoid runtime fs reads
// because the Cloudflare worker bundle has no usable cwd, which made
// previous fs.readdir-based loaders silently return [] in production.

export async function getAllCourses(): Promise<CourseSummary[]> {
  return LEARN_COURSES.map((course) => ({
    slug: course.meta.slug,
    title: course.meta.title,
    description: course.meta.description,
    language: course.meta.language,
    order: course.meta.order,
    lessonCount: course.lessons.length,
    lessons: course.lessons.map((lesson) => ({
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
    })),
  })).sort((a, b) => a.order - b.order);
}

export async function getCourseBySlug(courseSlug: string): Promise<CourseSummary | null> {
  const courses = await getAllCourses();
  return courses.find((c) => c.slug === courseSlug) ?? null;
}

export async function getLesson(courseSlug: string, lessonSlug: string): Promise<Lesson | null> {
  const course = LEARN_COURSES.find((c) => c.meta.slug === courseSlug);
  if (!course) return null;
  return course.lessons.find((l) => l.slug === lessonSlug) ?? null;
}

export async function getAllLessonParams(): Promise<Array<{ course: string; lesson: string }>> {
  const out: Array<{ course: string; lesson: string }> = [];
  for (const course of LEARN_COURSES) {
    for (const lesson of course.lessons) {
      out.push({ course: course.meta.slug, lesson: lesson.slug });
    }
  }
  return out;
}
