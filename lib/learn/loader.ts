import type {
  CourseSummary,
  Lesson,
  LessonSummary,
  Quiz,
  QuizSummary,
  Roadmap,
  RoadmapStep,
} from "./types";
import { LEARN_DATA } from "./generated";

// Lessons are baked into a generated TS module at build time
// (see scripts/build-learn.ts). We deliberately avoid runtime fs reads
// because the Cloudflare worker bundle has no usable cwd, which made
// previous fs.readdir-based loaders silently return [] in production.

function summarizeLessons(lessons: Lesson[]): LessonSummary[] {
  return lessons.map((lesson) => ({
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    order: lesson.order,
    difficulty: lesson.difficulty,
    languages: lesson.languages,
  }));
}

export async function getAllCourses(): Promise<CourseSummary[]> {
  return LEARN_DATA.courses
    .map((course) => ({
      slug: course.meta.slug,
      title: course.meta.title,
      description: course.meta.description,
      defaultLanguage: course.meta.defaultLanguage,
      languages: course.meta.languages,
      order: course.meta.order,
      step: course.meta.step,
      topic: course.meta.topic,
      lessonCount: course.lessons.length,
      lessons: summarizeLessons(course.lessons),
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getCourseBySlug(courseSlug: string): Promise<CourseSummary | null> {
  const courses = await getAllCourses();
  return courses.find((c) => c.slug === courseSlug) ?? null;
}

export async function getLesson(courseSlug: string, lessonSlug: string): Promise<Lesson | null> {
  const course = LEARN_DATA.courses.find((c) => c.meta.slug === courseSlug);
  if (!course) return null;
  return course.lessons.find((l) => l.slug === lessonSlug) ?? null;
}

export async function getAllLessonParams(): Promise<Array<{ course: string; lesson: string }>> {
  const out: Array<{ course: string; lesson: string }> = [];
  for (const course of LEARN_DATA.courses) {
    for (const lesson of course.lessons) {
      out.push({ course: course.meta.slug, lesson: lesson.slug });
    }
  }
  return out;
}

export async function getRoadmap(): Promise<Roadmap> {
  return LEARN_DATA.roadmap;
}

export async function getRoadmapStep(stepSlug: string): Promise<RoadmapStep | null> {
  return LEARN_DATA.roadmap.steps.find((s) => s.slug === stepSlug) ?? null;
}

export async function getQuizzesForCourse(courseSlug: string): Promise<QuizSummary[]> {
  const course = LEARN_DATA.courses.find((c) => c.meta.slug === courseSlug);
  if (!course) return [];
  return course.quizzes.map((q) => ({
    slug: q.slug,
    title: q.title,
    description: q.description,
    order: q.order,
    questionCount: q.questions.length,
  }));
}

export async function getQuiz(courseSlug: string, quizSlug: string): Promise<Quiz | null> {
  const course = LEARN_DATA.courses.find((c) => c.meta.slug === courseSlug);
  if (!course) return null;
  return course.quizzes.find((q) => q.slug === quizSlug) ?? null;
}

export async function getAllQuizParams(): Promise<Array<{ course: string; quiz: string }>> {
  const out: Array<{ course: string; quiz: string }> = [];
  for (const course of LEARN_DATA.courses) {
    for (const quiz of course.quizzes) {
      out.push({ course: course.meta.slug, quiz: quiz.slug });
    }
  }
  return out;
}

/**
 * Resolve all courses listed inside a roadmap step. Returns the same shape as
 * getAllCourses(), but filtered to courses referenced by the step's topics.
 * Useful for the per-step landing page.
 */
export async function getCoursesForStep(stepSlug: string): Promise<CourseSummary[]> {
  const step = await getRoadmapStep(stepSlug);
  if (!step) return [];
  const courses = await getAllCourses();
  const wantedSlugs = new Set(step.topics.flatMap((t) => t.courses));
  return courses.filter((c) => wantedSlugs.has(c.slug));
}
