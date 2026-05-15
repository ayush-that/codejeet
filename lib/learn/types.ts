// Language identifiers used across the learn section. Every lesson must have
// at least one language source. The cpp/javascript/python runtimes are real
// (browser WASM or native eval); the java runtime is still a placeholder that
// returns a structured "unsupported" result.
export type LessonLanguage = "cpp" | "javascript" | "python" | "java";

export const ALL_LESSON_LANGUAGES: LessonLanguage[] = ["cpp", "javascript", "python", "java"];

export const LANGUAGE_LABEL: Record<LessonLanguage, string> = {
  cpp: "C++",
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
};

export const LANGUAGE_FILE_EXTENSION: Record<LessonLanguage, string> = {
  cpp: "cpp",
  javascript: "js",
  python: "py",
  java: "java",
};

export interface TestCase {
  name: string;
  stdin: string;
  expectedStdout: string;
  visible: boolean;
}

export interface LessonExerciseMeta {
  prompt: string;
}

/** Per-language starter + solution source. */
export interface LanguageSource {
  starter: string;
  solution: string;
}

export interface LessonFrontmatter {
  slug: string;
  title: string;
  description?: string;
  order: number;
  difficulty?: "easy" | "medium" | "hard";
  exercise: LessonExerciseMeta;
}

export interface Lesson {
  courseSlug: string;
  slug: string;
  title: string;
  description?: string;
  order: number;
  difficulty?: "easy" | "medium" | "hard";
  body: string;
  exercise: LessonExerciseMeta;
  /** Languages this lesson has authored sources for. */
  languages: LessonLanguage[];
  /** Per-language starter + solution. */
  sources: Partial<Record<LessonLanguage, LanguageSource>>;
  tests: TestCase[];
}

export interface CourseMeta {
  slug: string;
  title: string;
  description: string;
  /** Default language for the course's editor when the user has no preference. */
  defaultLanguage: LessonLanguage;
  /** All languages this course has authored content for. */
  languages: LessonLanguage[];
  order: number;
  lessons: string[];
  /** Optional reference to the roadmap step the course belongs to. */
  step?: string;
  /** Optional topic slug within the step. */
  topic?: string;
}

export interface LessonSummary {
  slug: string;
  title: string;
  description?: string;
  order: number;
  difficulty?: "easy" | "medium" | "hard";
  languages: LessonLanguage[];
}

export interface CourseSummary {
  slug: string;
  title: string;
  description: string;
  defaultLanguage: LessonLanguage;
  languages: LessonLanguage[];
  order: number;
  step?: string;
  topic?: string;
  lessonCount: number;
  lessons: LessonSummary[];
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------

export type QuizQuestionKind = "mcq" | "fill-blank" | "predict-output";

export interface QuizQuestionBase {
  id: string;
  prompt: string;
  /** Optional code block displayed alongside the prompt. */
  code?: string;
  /** Optional language hint for the code block (used for syntax-highlighting/labels). */
  language?: LessonLanguage;
  /** Optional explanation shown after the user answers. */
  explanation?: string;
}

export interface QuizMcqQuestion extends QuizQuestionBase {
  kind: "mcq";
  options: string[];
  correctIndex: number;
}

export interface QuizFillBlankQuestion extends QuizQuestionBase {
  kind: "fill-blank";
  /** Acceptable answers (case- and whitespace-insensitive). */
  acceptedAnswers: string[];
}

export interface QuizPredictOutputQuestion extends QuizQuestionBase {
  kind: "predict-output";
  /** Acceptable outputs (normalized like the runner). */
  acceptedOutputs: string[];
}

export type QuizQuestion = QuizMcqQuestion | QuizFillBlankQuestion | QuizPredictOutputQuestion;

export interface Quiz {
  slug: string;
  courseSlug: string;
  title: string;
  description?: string;
  order: number;
  questions: QuizQuestion[];
}

export interface QuizSummary {
  slug: string;
  title: string;
  description?: string;
  order: number;
  questionCount: number;
}

// ---------------------------------------------------------------------------
// Roadmap
// ---------------------------------------------------------------------------

export interface RoadmapTopic {
  slug: string;
  title: string;
  description?: string;
  /** Course slugs that belong to this topic, in display order. */
  courses: string[];
}

export interface RoadmapStep {
  slug: string;
  order: number;
  title: string;
  description?: string;
  /** Estimated number of problems (used for the progress bar). */
  problemCount?: number;
  topics: RoadmapTopic[];
}

export interface Roadmap {
  steps: RoadmapStep[];
}
