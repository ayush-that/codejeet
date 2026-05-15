import type { CourseMeta, Lesson, Quiz, Roadmap } from "./types";

export interface GeneratedCourse {
  meta: CourseMeta;
  lessons: Lesson[];
  quizzes: Quiz[];
}

export interface GeneratedLearnData {
  roadmap: Roadmap;
  courses: GeneratedCourse[];
}
