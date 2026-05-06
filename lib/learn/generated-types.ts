import type { CourseMeta, Lesson } from "./types";

/** Shape of the data baked into `generated.ts` by `scripts/build-learn.ts`. */
export interface GeneratedCourse {
  meta: CourseMeta;
  lessons: Lesson[];
}
