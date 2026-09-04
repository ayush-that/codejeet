import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";

type Timeframe = "30_days" | "3_months" | "6_months" | "more_than_6m" | "all";

export interface QuestionWithDetails {
  id: number;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  Difficulty: "Easy" | "Medium" | "Hard";
  acceptance_rate: number;
  link: string;
  company: string;
  frequency: number;
  timeframe: Timeframe;
  topics: string[];
  "Acceptance %": string;
  "Frequency %": string;
  Topics: string;
  ID: string;
  Title: string;
  URL: string;
  "Is Premium": string;
}

type RawCsvRecord = {
  ID?: string;
  Title?: string;
  URL?: string;
  "Is Premium"?: string;
  "Acceptance %"?: string;
  Difficulty?: string;
  "Frequency %"?: string;
  Topics?: string;
  Timeframe?: string;
};

const VALID_TIMEFRAMES: ReadonlySet<Timeframe> = new Set<Timeframe>([
  "30_days",
  "3_months",
  "6_months",
  "more_than_6m",
  "all",
]);

const normalizeTimeframe = (value?: string): Timeframe => {
  const trimmed = (value || "").trim() as Timeframe;
  return VALID_TIMEFRAMES.has(trimmed) ? trimmed : "all";
};

const DATA_DIR = path.join(process.cwd(), "data", "companies");

let cachedQuestions: QuestionWithDetails[] | null = null;
let cachedCompanies: string[] | null = null;

const normalizeDifficulty = (value?: string): "Easy" | "Medium" | "Hard" => {
  const upperValue = (value || "").toUpperCase();
  if (upperValue === "HARD") return "Hard";
  if (upperValue === "MEDIUM") return "Medium";
  return "Easy";
};

const parsePercentage = (value?: string | number): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (!value) return 0;
  const cleaned = `${value}`.replace(/[^0-9.+-]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const ensurePercentString = (value: string | number | undefined, numeric: number) => {
  if (value !== undefined && `${value}`.trim() !== "") {
    const stringValue = `${value}`.trim();
    return stringValue.endsWith("%") ? stringValue : `${stringValue}%`;
  }
  return `${numeric.toFixed(1)}%`;
};

const normalizePremium = (value?: string) => {
  if (!value) return "N";
  const upper = value.trim().toUpperCase();
  if (upper === "Y" || upper === "YES" || upper === "TRUE") return "Y";
  return "N";
};

const deriveSlug = (
  url?: string,
  title?: string,
  fallbackId?: string,
  company?: string,
  index?: number
) => {
  if (url) {
    const parts = url.split("/").filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  if (title) {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  return `${company ?? "question"}-${index ?? 0}`;
};

const normalizeUrl = (url?: string, slug?: string) => {
  if (url && url.trim() !== "") {
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return new URL(trimmed).pathname;
    }
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  return slug ? `/problems/${slug}` : "/";
};

export async function loadAllQuestions(): Promise<{
  questions: QuestionWithDetails[];
  companies: string[];
}> {
  if (cachedQuestions && cachedCompanies) {
    return { questions: cachedQuestions, companies: cachedCompanies };
  }

  const files = await fs.readdir(DATA_DIR);
  const csvFiles = files.filter((file) => file.toLowerCase().endsWith(".csv"));

  const questions: QuestionWithDetails[] = [];
  const companies: string[] = [];

  for (const file of csvFiles) {
    const companySlug = file.replace(/\.csv$/i, "");
    companies.push(companySlug);

    const filePath = path.join(DATA_DIR, file);
    const content = await fs.readFile(filePath, "utf8");
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as RawCsvRecord[];

    records.forEach((record, index) => {
      const slug = deriveSlug(record.URL, record.Title, record.ID, companySlug, index);
      const id = Number.parseInt(record.ID || "", 10);
      const acceptanceNumeric = parsePercentage(record["Acceptance %"]);
      const frequencyNumeric = parsePercentage(record["Frequency %"]);
      const topicsArray = (record.Topics || "")
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean);

      questions.push({
        id: Number.isFinite(id) ? id : index + 1,
        slug,
        title: record.Title || slug,
        difficulty: normalizeDifficulty(record.Difficulty),
        Difficulty: normalizeDifficulty(record.Difficulty),
        acceptance_rate: acceptanceNumeric,
        link: `https://leetcode.com${normalizeUrl(record.URL, slug)}`,
        company: companySlug,
        frequency: frequencyNumeric,
        timeframe: normalizeTimeframe(record.Timeframe),
        topics: topicsArray,
        "Acceptance %": ensurePercentString(record["Acceptance %"], acceptanceNumeric),
        "Frequency %": ensurePercentString(record["Frequency %"], frequencyNumeric),
        Topics: topicsArray.join(", "),
        ID: slug || `${companySlug}-${index + 1}`,
        Title: record.Title || slug,
        URL: normalizeUrl(record.URL, slug),
        "Is Premium": normalizePremium(record["Is Premium"]),
      });
    });
  }

  cachedQuestions = questions;
  cachedCompanies = companies;

  return { questions, companies };
}
