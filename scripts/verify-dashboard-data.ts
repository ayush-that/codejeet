import fs from "fs/promises";
import path from "path";
import { decodeDashboardPayload, toDisplayRow } from "../lib/dashboard/decode";
import { problemUrl, timeframesFromMask, type DashboardPayload } from "../lib/dashboard/schema";

interface LegacyQuestion {
  ID: string;
  Title: string;
  Difficulty: string;
  Topics: string;
  URL: string;
  link: string;
  company: string;
  "Acceptance %": string;
  "Frequency %": string;
  "Is Premium": string;
  timeframes?: string[];
}

const DATA_DIR = path.join(process.cwd(), "public", "data");

async function main() {
  const legacy = JSON.parse(await fs.readFile(path.join(DATA_DIR, "questions.json"), "utf8")) as {
    questions: LegacyQuestion[];
  };
  const payload = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "dashboard.json"), "utf8")
  ) as DashboardPayload;

  const index = decodeDashboardPayload(payload);
  const failures: string[] = [];

  if (index.links.length !== legacy.questions.length) {
    failures.push(`row count ${index.links.length} != ${legacy.questions.length}`);
  }

  const limit = Math.min(index.links.length, legacy.questions.length);
  for (let i = 0; i < limit; i++) {
    const expected = legacy.questions[i];
    const row = toDisplayRow(index, i);
    const companyIndex = index.links[i][1];
    const companySlug = index.companies[companyIndex];
    const mask = index.links[i][3];

    // company slug must match questions.json; display name is baked separately.
    const checks: [string, unknown, unknown][] = [
      ["ID", row.slug, expected.ID],
      ["Title", row.title, expected.Title],
      ["Difficulty", row.difficulty, expected.Difficulty],
      ["Topics", row.topics.join(", "), expected.Topics],
      ["URL", row.path, expected.URL],
      ["link", problemUrl(row.slug), expected.link],
      ["company", companySlug, expected.company],
      ["Acceptance %", row.acceptance, expected["Acceptance %"]],
      ["Frequency %", row.frequency, expected["Frequency %"]],
      ["Is Premium", row.premium ? "Y" : "N", expected["Is Premium"]],
      [
        "timeframes",
        timeframesFromMask(mask).slice().sort().join(","),
        (expected.timeframes ?? []).slice().sort().join(","),
      ],
    ];

    for (const [field, actual, want] of checks) {
      if (actual !== want) {
        failures.push(
          `row ${i} (${expected.ID}/${expected.company}) ${field}: ${actual} != ${want}`
        );
      }
    }

    if (!row.company || row.company.trim() === "") {
      failures.push(
        `row ${i} (${expected.ID}/${expected.company}) company displayName is empty`
      );
    }

    if (failures.length >= 20) break;
  }

  // Company counts must match the links that actually reference them.
  const counted = new Array<number>(index.companies.length).fill(0);
  for (const [, company] of index.links) counted[company]++;
  index.companyCounts.forEach((count, i) => {
    if (count !== counted[i]) {
      failures.push(`company ${index.companies[i]} count ${count} != ${counted[i]}`);
    }
  });

  if (failures.length > 0) {
    console.error("dashboard.json does not match questions.json:");
    for (const failure of failures.slice(0, 20)) console.error(`  ${failure}`);
    process.exit(1);
  }

  console.log(
    `Verified ${limit} dashboard rows against questions.json ` +
      `(${index.problems.length} problems, ${index.companies.length} companies)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
