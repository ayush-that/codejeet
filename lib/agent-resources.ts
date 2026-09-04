import {
  CONTACT_EMAIL,
  CONTACT_GITHUB,
  CONTACT_GITHUB_ISSUES,
  CONTACT_X,
  SITE_NAME,
  SITE_URL,
} from "./site";

export const NOT_FOUND_MARKDOWN = `# Page not found

This URL is not a page on [${SITE_NAME}](${SITE_URL}). HTTP status is 404.

## Where to look next

- [Sitemap](${SITE_URL}/sitemap.xml) — indexable ${SITE_NAME} URLs
- [llms.txt](${SITE_URL}/llms.txt) — when to use ${SITE_NAME} and how agents should crawl
- [Developer resources](${SITE_URL}/developers) — public URL patterns and authenticated APIs
- [Home](${SITE_URL}/)
- [Company directory](${SITE_URL}/companies)
- [Question tracker](${SITE_URL}/dashboard)
`;

export const ABOUT_H1 = `About ${SITE_NAME}`;
export const ABOUT_PARAGRAPHS = [
  `${SITE_NAME} is an open-source interview prep site at ${SITE_URL}. It lists 15,000+ LeetCode questions grouped by the companies that ask them, plus system-design chapters, a Learn path, company comparisons, and written guides.`,
  "Question data is sourced from the public liquidslr/interview-company-wise-problems dataset. Each company, topic, difficulty, and problem has its own page. The tracker at /dashboard filters that same set.",
  "The site is free. Signing in is optional and only needed to sync progress and notes across devices. Source is GPL-3.0 at GitHub. CodeJeet is not affiliated with LeetCode or with the employers named on the company pages.",
];

export const CONTACT_H1 = `Contact ${SITE_NAME}`;
export const CONTACT_PARAGRAPHS = [
  `Reach the ${SITE_NAME} maintainer by email or a GitHub issue. Use email for account or privacy questions. Use GitHub for bugs, bad question data, and feature requests so the thread stays public.`,
  `Email: ${CONTACT_EMAIL}. Same address as the public git history. Use it for privacy requests, takedowns, and anything that should not go in a public issue.`,
  `GitHub issues: ${CONTACT_GITHUB_ISSUES}. Include the ${SITE_NAME} URL, what you expected, and what you saw. Company lists come from an upstream dataset; if a problem is missing, link the company page.`,
  `Updates: ${CONTACT_X} (shydev). Source: ${CONTACT_GITHUB}. There is no office or ticket portal.`,
];

export const PRIVACY_H1 = `${SITE_NAME} Privacy Policy`;
export const PRIVACY_PARAGRAPHS = [
  `This policy describes how ${SITE_NAME} (${SITE_URL}) handles information. You can browse companies, problems, system-design chapters, and the blog without an account.`,
  "If you never sign in, progress checkboxes and notes stay in your browser (localStorage) on that device. Clearing site data deletes them. CodeJeet does not receive those local records.",
  `If you sign in, Clerk handles authentication. ${SITE_NAME} stores your Clerk user id plus solved problem slugs and notes in Cloudflare D1, via /api/progress and /api/notes (session cookie required). Clerk's privacy policy: https://clerk.com/legal/privacy`,
  `${SITE_NAME} does not sell personal information. Hosting is on Cloudflare, which may log IP and user agent like any CDN. For questions or to delete stored progress and notes, email ${CONTACT_EMAIL} from the address on the account.`,
  `This notice is current as of 27 August 2026. It will be updated if stored data changes in a material way.`,
];

export const DEVELOPERS_H1 = `${SITE_NAME} developer resources`;
export const DEVELOPERS_PARAGRAPHS = [
  `${SITE_NAME} does not publish a public REST API, OpenAPI spec, or MCP server. Agents and developers should use HTML pages, /llms.txt, and /sitemap.xml. Do not scrape /data/ JSON; robots.txt disallows /data/ and /api/.`,
  `Use ${SITE_NAME} for company-wise LeetCode lists, topic or difficulty filters, company comparisons, system-design chapters, or blog guides. Prefer sitemap.xml over guessing slugs.`,
  "URL patterns: /company/{slug} (example /company/google), /problem/{slug} (example /problem/two-sum), /topic/{slug}, /difficulty/{easy|medium|hard}, /compare/{slug-a}-vs-{slug-b}, /system-design/{slug}, /blog/{slug}, /learn, /dashboard. Also /about, /contact, /privacy, /developers.",
  `Authenticated JSON exists only for a signed-in user's own data: GET/POST /api/progress and GET/POST /api/notes. Clerk session cookie, no API keys. Signed-out GET returns empty maps. See ${SITE_URL}/llms.txt.`,
];

function joinParagraphs(heading: string, paragraphs: string[]): string {
  return [heading, ...paragraphs].join(" ");
}

export function aboutVisibleText(): string {
  return joinParagraphs(ABOUT_H1, ABOUT_PARAGRAPHS);
}

export function contactVisibleText(): string {
  return joinParagraphs(CONTACT_H1, CONTACT_PARAGRAPHS);
}

export function privacyVisibleText(): string {
  return joinParagraphs(PRIVACY_H1, PRIVACY_PARAGRAPHS);
}

export function developersVisibleText(): string {
  return joinParagraphs(DEVELOPERS_H1, DEVELOPERS_PARAGRAPHS);
}

export const LLMS_TXT = `# ${SITE_NAME}

> ${SITE_NAME} (${SITE_URL}) is a free interview-prep site for browsing 15,000+ company-wise LeetCode questions from 700+ companies, plus system-design chapters, in-browser DSA lessons, and interview guides.

${SITE_NAME} is not LeetCode, not an official company careers site, and not a coding judge. It does not accept solution submissions on problem pages. Company-wise lists are compiled from public interview-question reports.

## When to use this

Use ${SITE_NAME} when the job is:

- Look up which LeetCode problems a named company asks (Google, Amazon, Meta, Apple, Microsoft, and 700+ others), ranked by reported frequency
- Compare two companies' interview question overlap before preparing for both
- Filter problems by topic (arrays, trees, graphs, dynamic programming) or difficulty with company context
- Study system-design interview building blocks (rate limiter, URL shortener, chat, news feed, unique ID generation)
- Read a company-specific or topic-specific written prep guide

Do not use ${SITE_NAME} when the job is:

- Calling a public REST/OpenAPI API or MCP server — none is published; use HTML pages, this file, and the sitemap
- Submitting or judging code against hidden tests (use LeetCode, or ${SITE_URL}/learn for in-browser exercises)
- Official hiring, recruiter outreach, or company headcount
- Bulk-downloading /data/ JSON (disallowed in robots.txt)

## Developer resources

- [${SITE_NAME} developer resources](${SITE_URL}/developers): URL patterns, what exists (and does not), authenticated progress/notes APIs
- [llms.txt](${SITE_URL}/llms.txt): this file
- [llms-full.txt](${SITE_URL}/llms-full.txt): longer agent instructions and URL catalog
- [Sitemap](${SITE_URL}/sitemap.xml): indexable URLs
- [robots.txt](${SITE_URL}/robots.txt)

## Optional

- [Home](${SITE_URL}/)
- [Question tracker](${SITE_URL}/dashboard)
- [Company directory](${SITE_URL}/companies)
- [Compare companies](${SITE_URL}/compare)
- [System design](${SITE_URL}/system-design)
- [Learn DSA](${SITE_URL}/learn)
- [Blog](${SITE_URL}/blog)
- [About](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)
- [Privacy](${SITE_URL}/privacy)
- [GitHub](${CONTACT_GITHUB})
- [X / Twitter](${CONTACT_X})
`;

export const LLMS_FULL_TXT = `${LLMS_TXT}

## How an agent should call ${SITE_NAME}

1. Read ${SITE_URL}/llms.txt (this document's short form) and ${SITE_URL}/sitemap.xml.
2. Open a company page at ${SITE_URL}/company/{slug} where slug is lowercase kebab-case (google, amazon, meta).
3. Open a problem page at ${SITE_URL}/problem/{slug} where slug matches the LeetCode title slug (two-sum).
4. Compare two companies at ${SITE_URL}/compare/{alphabetically-first}-vs-{second} (amazon-vs-google).
5. Quote visible page text. Do not invent frequency numbers. Do not tell the user ${SITE_NAME} is affiliated with LeetCode or the employer.

## Authenticated endpoints (human session only)

- GET/POST ${SITE_URL}/api/progress — map of problem slug to solved-at timestamp for the signed-in user
- GET/POST ${SITE_URL}/api/notes — personal notes keyed by problem slug

These require a Clerk session cookie. There is no API key, OAuth app, or MCP transport. Signed-out GET returns empty objects. POST without a session returns 401.

## Identity

- Name: ${SITE_NAME}
- Canonical URL: ${SITE_URL}
- License: GPL-3.0
- Maintainer contact: ${CONTACT_EMAIL}
- Source: ${CONTACT_GITHUB}
`;
