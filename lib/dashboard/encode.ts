import { capitalizeWords } from "../../utils/utils";
import {
  DIFFICULTIES,
  maskFromTimeframes,
  type DashboardPayload,
  type Difficulty,
  type EncodedCompany,
  type EncodedLink,
  type EncodedProblem,
} from "./schema";

// The subset of a questions.json row the dashboard actually needs.
export interface SourceQuestion {
  slug: string;
  title: string;
  difficulty: string;
  company: string;
  topics: string[];
  Topics: string;
  "Acceptance %": string;
  "Frequency %": string;
  "Is Premium": string;
  timeframes?: string[];
}

// Rows for the same slug do not always agree across companies (239 disagree on
// Topics, 1 on title). Keying on the full identity keeps those variants
// separate so the encoding stays exactly lossless.
function problemKey(question: SourceQuestion): string {
  return JSON.stringify([
    question.slug,
    question.title,
    question.Topics,
    question.difficulty,
    question["Acceptance %"],
    question["Is Premium"],
  ]);
}

export function encodeDashboardData(questions: readonly SourceQuestion[]): DashboardPayload {
  const topics = [...new Set(questions.flatMap((q) => q.topics))].sort((a, b) =>
    a.localeCompare(b)
  );
  const topicIndex = new Map(topics.map((topic, i) => [topic, i]));

  const companies = [...new Set(questions.map((q) => q.company))].sort();
  const companyIndex = new Map(companies.map((company, i) => [company, i]));
  const counts = new Array<number>(companies.length).fill(0);

  const problems: EncodedProblem[] = [];
  const problemIndex = new Map<string, number>();
  const links: EncodedLink[] = [];

  for (const question of questions) {
    const key = problemKey(question);
    let problem = problemIndex.get(key);

    if (problem === undefined) {
      const difficulty = DIFFICULTIES.indexOf(question.difficulty as Difficulty);
      if (difficulty < 0) {
        throw new Error(`Unknown difficulty "${question.difficulty}" for ${question.slug}`);
      }
      problem = problems.length;
      problemIndex.set(key, problem);
      problems.push([
        question.slug,
        question.title,
        difficulty,
        question["Acceptance %"] ? parseFloat(question["Acceptance %"]) : null,
        question["Is Premium"] === "Y" ? 1 : 0,
        question.topics.map((topic) => topicIndex.get(topic)!),
      ]);
    }

    const company = companyIndex.get(question.company)!;
    counts[company]++;
    links.push([
      problem,
      company,
      parseFloat(question["Frequency %"]),
      maskFromTimeframes(question.timeframes ?? []),
    ]);
  }

  return {
    v: 2,
    topics,
    companies: companies.map(
      (company, i): EncodedCompany => [company, counts[i], capitalizeWords(company)]
    ),
    problems,
    links,
  };
}
