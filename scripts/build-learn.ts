import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type {
  CourseMeta,
  LanguageSource,
  Lesson,
  LessonFrontmatter,
  LessonLanguage,
  Quiz,
  Roadmap,
  TestCase,
} from "../lib/learn/types";
import { ALL_LESSON_LANGUAGES, LANGUAGE_FILE_EXTENSION } from "../lib/learn/types";

// Bake the contents of content/learn/ into a generated TS module so the rest
// of the app can read lessons without ever touching the filesystem at runtime.
// The Cloudflare worker bundle does not have a usable cwd / fs view, so any
// fs.* call from a server component returns nothing, which is what was making
// /learn show "No courses yet" in production even though the markdown was
// committed and visible during local builds.

const CONTENT_ROOT = path.join(process.cwd(), "content", "learn");
const ROADMAP_FILE = path.join(CONTENT_ROOT, "_roadmap.json");
const OUT_FILE = path.join(process.cwd(), "lib", "learn", "generated.ts");

interface GeneratedCourse {
  meta: CourseMeta;
  lessons: Lesson[];
  quizzes: Quiz[];
}

interface GeneratedLearnData {
  roadmap: Roadmap;
  courses: GeneratedCourse[];
}

async function listCourseSlugs(): Promise<string[]> {
  const dirents = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  return dirents.filter((d) => d.isDirectory() && !d.name.startsWith("_")).map((d) => d.name);
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function readFileOpt(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

async function readLanguageSources(
  dirPath: string
): Promise<Partial<Record<LessonLanguage, LanguageSource>>> {
  const sources: Partial<Record<LessonLanguage, LanguageSource>> = {};
  for (const lang of ALL_LESSON_LANGUAGES) {
    const ext = LANGUAGE_FILE_EXTENSION[lang];
    const [starter, solution] = await Promise.all([
      readFileOpt(path.join(dirPath, `starter.${ext}`)),
      readFileOpt(path.join(dirPath, `solution.${ext}`)),
    ]);
    if (starter !== null && solution !== null) {
      sources[lang] = { starter, solution };
    }
  }
  return sources;
}

async function readLesson(
  courseSlug: string,
  lessonDir: string,
  courseDefaultLanguage: LessonLanguage
): Promise<Lesson> {
  const dirPath = path.join(CONTENT_ROOT, courseSlug, lessonDir);
  const indexPath = path.join(dirPath, "index.md");
  const raw = await fs.readFile(indexPath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Partial<LessonFrontmatter> | undefined;
  if (!data?.slug || !data?.title || typeof data?.order !== "number" || !data?.exercise) {
    throw new Error(`invalid frontmatter at ${indexPath}`);
  }
  const frontmatter: LessonFrontmatter = {
    slug: data.slug,
    title: data.title,
    description: data.description,
    order: data.order,
    difficulty: data.difficulty,
    exercise: { prompt: data.exercise.prompt ?? "" },
  };
  const [sources, tests] = await Promise.all([
    readLanguageSources(dirPath),
    readJson<TestCase[]>(path.join(dirPath, "tests.json")),
  ]);
  const languages = ALL_LESSON_LANGUAGES.filter((l) => sources[l] !== undefined);
  if (languages.length === 0) {
    throw new Error(
      `lesson ${courseSlug}/${lessonDir} has no language sources (expected starter.<ext> + solution.<ext> for at least one of: ${ALL_LESSON_LANGUAGES.join(", ")})`
    );
  }
  if (!sources[courseDefaultLanguage]) {
    console.warn(
      `lesson ${courseSlug}/${lessonDir} is missing the course's default language ${courseDefaultLanguage}; falling back to ${languages[0]}`
    );
  }
  return {
    courseSlug,
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    order: frontmatter.order,
    difficulty: frontmatter.difficulty,
    body: parsed.content,
    exercise: frontmatter.exercise,
    languages,
    sources,
    tests,
  };
}

async function readQuizzes(courseSlug: string): Promise<Quiz[]> {
  const quizDir = path.join(CONTENT_ROOT, courseSlug, "_quizzes");
  let entries: { name: string; isFile: () => boolean }[];
  try {
    entries = await fs.readdir(quizDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: Quiz[] = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".json")) continue;
    try {
      const quiz = await readJson<Quiz>(path.join(quizDir, entry.name));
      out.push({ ...quiz, courseSlug });
    } catch (err) {
      console.warn(`Skipping quiz ${courseSlug}/_quizzes/${entry.name}: ${(err as Error).message}`);
    }
  }
  out.sort((a, b) => a.order - b.order);
  return out;
}

async function buildCourse(slug: string): Promise<GeneratedCourse | null> {
  let rawMeta: Partial<CourseMeta> & { language?: LessonLanguage };
  try {
    rawMeta = await readJson<Partial<CourseMeta> & { language?: LessonLanguage }>(
      path.join(CONTENT_ROOT, slug, "course.json")
    );
  } catch {
    return null;
  }
  // Backwards compat: older course.json files had a single `language` field.
  const defaultLanguage: LessonLanguage = rawMeta.defaultLanguage ?? rawMeta.language ?? "cpp";
  const declaredLanguages =
    rawMeta.languages && rawMeta.languages.length > 0
      ? rawMeta.languages
      : rawMeta.language
        ? [rawMeta.language]
        : [];
  if (!rawMeta.slug || !rawMeta.title || typeof rawMeta.order !== "number" || !rawMeta.lessons) {
    throw new Error(`invalid course.json at ${slug}`);
  }
  const lessons: Lesson[] = [];
  for (const lessonDir of rawMeta.lessons) {
    try {
      lessons.push(await readLesson(slug, lessonDir, defaultLanguage));
    } catch (err) {
      console.warn(`Skipping ${slug}/${lessonDir}: ${(err as Error).message}`);
    }
  }
  lessons.sort((a, b) => a.order - b.order);
  // Compute the union of languages actually authored if the course didn't declare them explicitly.
  const detected = new Set<LessonLanguage>();
  for (const lesson of lessons) for (const l of lesson.languages) detected.add(l);
  const languages = declaredLanguages.length > 0 ? declaredLanguages : Array.from(detected);
  const meta: CourseMeta = {
    slug: rawMeta.slug,
    title: rawMeta.title,
    description: rawMeta.description ?? "",
    defaultLanguage,
    languages,
    order: rawMeta.order,
    lessons: rawMeta.lessons,
    step: rawMeta.step,
    topic: rawMeta.topic,
  };
  const quizzes = await readQuizzes(slug);
  return { meta, lessons, quizzes };
}

async function readRoadmap(): Promise<Roadmap> {
  try {
    return await readJson<Roadmap>(ROADMAP_FILE);
  } catch (err) {
    console.warn(`No roadmap at ${ROADMAP_FILE}: ${(err as Error).message}`);
    return { steps: [] };
  }
}

async function main() {
  const roadmap = await readRoadmap();
  let slugs: string[];
  try {
    slugs = await listCourseSlugs();
  } catch {
    slugs = [];
  }
  const courses: GeneratedCourse[] = [];
  for (const slug of slugs) {
    try {
      const course = await buildCourse(slug);
      if (course) courses.push(course);
    } catch (err) {
      console.warn(`Skipping course ${slug}: ${(err as Error).message}`);
    }
  }
  courses.sort((a, b) => a.meta.order - b.meta.order);

  const data: GeneratedLearnData = { roadmap, courses };
  const banner =
    "// AUTO-GENERATED by scripts/build-learn.ts. Do not edit by hand.\n" +
    "// Run `pnpm run prebuild` (or `tsx scripts/build-learn.ts`) to refresh.\n\n";
  const body =
    `import type { GeneratedLearnData } from "./generated-types";\n\n` +
    `export const LEARN_DATA: GeneratedLearnData = ${JSON.stringify(data, null, 2)};\n\n` +
    `// Backwards-compatible legacy export. Prefer LEARN_DATA.courses for new code.\n` +
    `export const LEARN_COURSES = LEARN_DATA.courses;\n`;

  await fs.writeFile(OUT_FILE, banner + body, "utf8");
  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const totalQuizzes = courses.reduce((acc, c) => acc + c.quizzes.length, 0);
  console.log(
    `Wrote ${roadmap.steps.length} step(s), ${courses.length} course(s), ${totalLessons} lesson(s), ${totalQuizzes} quiz(zes) to ${path.relative(
      process.cwd(),
      OUT_FILE
    )}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
