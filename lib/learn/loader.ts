import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { CourseMeta, CourseSummary, Lesson, LessonFrontmatter, TestCase } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content", "learn");

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function listCourseSlugs(): Promise<string[]> {
  try {
    const dirents = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
    return dirents.filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return [];
  }
}

async function readCourseMeta(courseSlug: string): Promise<CourseMeta | null> {
  try {
    const meta = await readJson<CourseMeta>(path.join(CONTENT_ROOT, courseSlug, "course.json"));
    return meta;
  } catch {
    return null;
  }
}

async function readLessonFrontmatter(
  courseSlug: string,
  lessonDir: string
): Promise<{ frontmatter: LessonFrontmatter; body: string } | null> {
  try {
    const indexPath = path.join(CONTENT_ROOT, courseSlug, lessonDir, "index.md");
    const raw = await fs.readFile(indexPath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data as Partial<LessonFrontmatter> | undefined;
    if (!data?.slug || !data?.title || typeof data?.order !== "number" || !data?.exercise) {
      return null;
    }
    return {
      frontmatter: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        order: data.order,
        exercise: { prompt: data.exercise.prompt ?? "" },
      },
      body: parsed.content,
    };
  } catch {
    return null;
  }
}

export async function getAllCourses(): Promise<CourseSummary[]> {
  const slugs = await listCourseSlugs();
  const courses: CourseSummary[] = [];
  for (const slug of slugs) {
    const meta = await readCourseMeta(slug);
    if (!meta) continue;
    const lessons: CourseSummary["lessons"] = [];
    for (const lessonDir of meta.lessons) {
      const data = await readLessonFrontmatter(slug, lessonDir);
      if (!data) continue;
      lessons.push({
        slug: data.frontmatter.slug,
        title: data.frontmatter.title,
        description: data.frontmatter.description,
        order: data.frontmatter.order,
      });
    }
    lessons.sort((a, b) => a.order - b.order);
    courses.push({
      slug: meta.slug,
      title: meta.title,
      description: meta.description,
      language: meta.language,
      order: meta.order,
      lessonCount: lessons.length,
      lessons,
    });
  }
  courses.sort((a, b) => a.order - b.order);
  return courses;
}

export async function getCourseBySlug(courseSlug: string): Promise<CourseSummary | null> {
  const courses = await getAllCourses();
  return courses.find((c) => c.slug === courseSlug) ?? null;
}

async function findLessonDir(courseSlug: string, lessonSlug: string): Promise<string | null> {
  const meta = await readCourseMeta(courseSlug);
  if (!meta) return null;
  for (const lessonDir of meta.lessons) {
    const data = await readLessonFrontmatter(courseSlug, lessonDir);
    if (data?.frontmatter.slug === lessonSlug) return lessonDir;
  }
  return null;
}

export async function getLesson(courseSlug: string, lessonSlug: string): Promise<Lesson | null> {
  const lessonDir = await findLessonDir(courseSlug, lessonSlug);
  if (!lessonDir) return null;
  const data = await readLessonFrontmatter(courseSlug, lessonDir);
  if (!data) return null;
  const dirPath = path.join(CONTENT_ROOT, courseSlug, lessonDir);
  const [starter, solution, testsRaw] = await Promise.all([
    fs.readFile(path.join(dirPath, "starter.cpp"), "utf8"),
    fs.readFile(path.join(dirPath, "solution.cpp"), "utf8"),
    fs.readFile(path.join(dirPath, "tests.json"), "utf8"),
  ]);
  const tests = JSON.parse(testsRaw) as TestCase[];
  return {
    courseSlug,
    slug: data.frontmatter.slug,
    title: data.frontmatter.title,
    description: data.frontmatter.description,
    order: data.frontmatter.order,
    body: data.body,
    exercise: data.frontmatter.exercise,
    starter,
    solution,
    tests,
  };
}

export async function getAllLessonParams(): Promise<Array<{ course: string; lesson: string }>> {
  const courses = await getAllCourses();
  const out: Array<{ course: string; lesson: string }> = [];
  for (const course of courses) {
    for (const lesson of course.lessons) {
      out.push({ course: course.slug, lesson: lesson.slug });
    }
  }
  return out;
}
