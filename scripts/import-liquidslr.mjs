#!/usr/bin/env node
// Import / refresh per-company data in data/companies/ from liquidslr's
// interview-company-wise-problems repo, MERGED with our existing companies.
//
//   bun run import:data
//
// What it does:
//   - Clones (or pulls) https://github.com/liquidslr/interview-company-wise-problems
//     into .liquidslr/ (gitignored).
//   - For each liquidslr company: emits one row per (problem, recency bucket) with a
//     Timeframe column (30_days / 3_months / 6_months / more_than_6m / all).
//   - Topics come from liquidslr (he scrapes them now). ID is backfilled from our
//     existing CSVs by slug. Acceptance % is left BLANK on purpose: it is sourced
//     from the scraped problem JSONs (data/problems/*.json) at build time, because
//     liquidslr's Acceptance Rate column is unreliable.
//   - Companies we have that liquidslr doesn't are kept (rewritten to the new schema,
//     Timeframe="all"); companies liquidslr has that we don't are added (union).
//
// After running: `bun run prebuild` to regenerate public/data + lib/learn.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(REPO, "package.json"));
const { parse } = require("csv-parse/sync");

const COMPANIES_DIR = path.join(REPO, "data", "companies");
const LIQUID_DIR = process.env.LIQUIDSLR_DIR || path.join(REPO, ".liquidslr");
const LIQUID_REPO = "https://github.com/liquidslr/interview-company-wise-problems";

const OUT_HEADER = [
  "ID",
  "URL",
  "Title",
  "Difficulty",
  "Acceptance %",
  "Frequency %",
  "Topics",
  "Timeframe",
];

const TIMEFRAME_MAP = {
  "1. Thirty Days": "30_days",
  "2. Three Months": "3_months",
  "3. Six Months": "6_months",
  "4. More Than Six Months": "more_than_6m",
  "5. All": "all",
};

// --- clone / pull liquidslr ------------------------------------------------

function syncLiquidslr() {
  if (fs.existsSync(path.join(LIQUID_DIR, ".git"))) {
    console.log(`Pulling latest liquidslr data into ${LIQUID_DIR} ...`);
    execFileSync("git", ["-C", LIQUID_DIR, "pull", "--ff-only"], { stdio: "inherit" });
  } else {
    console.log(`Cloning liquidslr data into ${LIQUID_DIR} ...`);
    execFileSync("git", ["clone", "--depth", "1", LIQUID_REPO, LIQUID_DIR], { stdio: "inherit" });
  }
}

// --- helpers ---------------------------------------------------------------

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function slugFromUrl(url) {
  if (!url) return "";
  const seg = url.trim().replace(/\/+$/, "").split("/").filter(Boolean).pop() || "";
  return seg.trim();
}

function titleCaseDifficulty(d) {
  const s = String(d || "")
    .trim()
    .toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function fmtFrequency(freq) {
  const n = parseFloat(freq);
  return Number.isNaN(n) ? "" : `${n.toFixed(1)}%`;
}

// RFC-4180 field quoting (csv-stringify is not installed).
const csvField = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const csvRow = (arr) => arr.map(csvField).join(",");

function readCsv(file) {
  const raw = fs.readFileSync(file, "utf8");
  if (!raw.trim()) return [];
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true, // some old files (e.g. one Netflix file) lack Topics
    bom: true,
    trim: false,
  });
}

// --- main ------------------------------------------------------------------

syncLiquidslr();

const existingFiles = fs.readdirSync(COMPANIES_DIR).filter((f) => f.endsWith(".csv"));
const E = new Set(existingFiles.map((f) => f.replace(/\.csv$/, "")));

const slugToId = new Map();
const existingRowsByCompany = new Map();
for (const file of existingFiles) {
  const companySlug = file.replace(/\.csv$/, "");
  let rows = [];
  try {
    rows = readCsv(path.join(COMPANIES_DIR, file));
  } catch (e) {
    console.error(`WARN: failed to read existing ${file}: ${e.message}`);
  }
  existingRowsByCompany.set(companySlug, rows);
  for (const r of rows) {
    const id = (r.ID || r.id || "").toString().trim();
    const slug = slugFromUrl(r.URL || r.url || "");
    if (id && slug && !slugToId.has(slug)) slugToId.set(slug, id);
  }
}

const liquidBySlug = new Map();
for (const dir of fs
  .readdirSync(LIQUID_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== ".git")
  .map((d) => d.name)) {
  const slug = slugify(dir);
  if (slug && !liquidBySlug.has(slug)) liquidBySlug.set(slug, dir);
}
const L = new Set(liquidBySlug.keys());

function buildLiquidRows(folderName) {
  const dir = path.join(LIQUID_DIR, folderName);
  const out = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".csv"))) {
    const timeframe = TIMEFRAME_MAP[f.replace(/\.csv$/, "")];
    if (!timeframe) continue;
    let rows = [];
    try {
      rows = readCsv(path.join(dir, f));
    } catch (e) {
      console.error(`WARN: failed to read ${folderName}/${f}: ${e.message}`);
      continue;
    }
    for (const r of rows) {
      const link = (r.Link || r.link || "").trim();
      const title = (r.Title || r.title || "").trim();
      if (!link && !title) continue;
      const slug = slugFromUrl(link);
      out.push([
        slug && slugToId.has(slug) ? slugToId.get(slug) : "",
        link,
        title,
        titleCaseDifficulty(r.Difficulty || r.difficulty),
        "", // Acceptance %: sourced from scraped problem JSON at build time
        fmtFrequency(r.Frequency ?? r.frequency),
        (r.Topics ?? r.topics ?? "").toString(),
        timeframe,
      ]);
    }
  }
  return out;
}

function buildExistingRows(companySlug) {
  return (existingRowsByCompany.get(companySlug) || []).map((r) => [
    (r.ID ?? "").toString(),
    (r.URL ?? "").toString(),
    (r.Title ?? "").toString(),
    (r.Difficulty ?? "").toString(),
    "", // Acceptance %: sourced from scraped problem JSON at build time
    (r["Frequency %"] ?? "").toString(),
    "", // Topics backfilled by the build step
    "all",
  ]);
}

let overlapRefreshed = 0,
  existingKept = 0,
  newAdded = 0,
  totalRows = 0;
const timeframeCounts = {};

for (const slug of new Set([...E, ...L])) {
  let rows;
  if (L.has(slug)) {
    rows = buildLiquidRows(liquidBySlug.get(slug));
    if (E.has(slug)) {
      overlapRefreshed++;
    } else {
      newAdded++;
    }
  } else {
    rows = buildExistingRows(slug);
    existingKept++;
  }
  for (const row of rows) {
    totalRows++;
    timeframeCounts[row[7]] = (timeframeCounts[row[7]] || 0) + 1;
  }
  fs.writeFileSync(
    path.join(COMPANIES_DIR, `${slug}.csv`),
    [csvRow(OUT_HEADER), ...rows.map(csvRow)].join("\n") + "\n",
    "utf8"
  );
}

console.log("\n==================== IMPORT REPORT ====================");
console.log(
  `Companies: ${overlapRefreshed + existingKept + newAdded} (refreshed ${overlapRefreshed}, kept ${existingKept}, new ${newAdded})`
);
console.log(`Total rows: ${totalRows}`);
for (const k of ["30_days", "3_months", "6_months", "more_than_6m", "all"]) {
  console.log(`  ${k.padEnd(13)}: ${timeframeCounts[k] || 0}`);
}
console.log("Next: run `bun run prebuild` to regenerate public/data.");
console.log("======================================================");
