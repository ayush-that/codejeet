export type LessonLanguage = "cpp";

export interface TestCase {
  name: string;
  stdin: string;
  expectedStdout: string;
  visible: boolean;
}

export interface LessonExerciseMeta {
  prompt: string;
}

export interface LessonFrontmatter {
  slug: string;
  title: string;
  description?: string;
  order: number;
  exercise: LessonExerciseMeta;
}

export interface Lesson {
  courseSlug: string;
  slug: string;
  title: string;
  description?: string;
  order: number;
  body: string;
  exercise: LessonExerciseMeta;
  starter: string;
  solution: string;
  tests: TestCase[];
}

export interface CourseMeta {
  slug: string;
  title: string;
  description: string;
  language: LessonLanguage;
  order: number;
  lessons: string[];
}

export interface CourseSummary {
  slug: string;
  title: string;
  description: string;
  language: LessonLanguage;
  order: number;
  lessonCount: number;
  lessons: Array<{ slug: string; title: string; description?: string; order: number }>;
}
