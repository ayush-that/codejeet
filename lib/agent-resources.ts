import {
  CONTACT_EMAIL,
  CONTACT_GITHUB,
  CONTACT_GITHUB_ISSUES,
  CONTACT_X,
  SITE_NAME,
  SITE_URL,
} from "./site";

export const HOMEPAGE_H1 = `${SITE_NAME}: 15,000+ Company-wise LeetCode Interview Questions`;

export const HOMEPAGE_SUBHEAD =
  "Filter by company, topic, and difficulty. Practice smarter for your next tech interview.";

export const homepageFaqs = [
  {
    question: `What is ${SITE_NAME}?`,
    answer:
      `${SITE_NAME} is a free platform to browse 15,000+ company-wise LeetCode DSA interview questions from 700+ companies. ` +
      "Filter by company, topic, and difficulty to practice smarter for your next tech interview.",
  },
  {
    question: "How do I prepare for a FAANG coding interview?",
    answer:
      `Start by browsing company-specific questions on ${SITE_NAME}. Focus on the most frequently asked problems for your target company, ` +
      "practice by difficulty level (start with Easy, progress to Medium and Hard), and study the top topics like Arrays, Dynamic Programming, Trees, and Graphs.",
  },
  {
    question: `Which companies' interview questions are available on ${SITE_NAME}?`,
    answer:
      `${SITE_NAME} has interview questions from 700+ companies including Google, Amazon, Meta, Apple, Microsoft, Netflix, Goldman Sachs, Bloomberg, Uber, and many more. ` +
      "Each company page shows questions sorted by frequency.",
  },
  {
    question: "How are the LeetCode questions organized?",
    answer:
      "Questions are organized by company, topic (like Arrays, Trees, Dynamic Programming), and difficulty level (Easy, Medium, Hard). " +
      "You can filter and sort to find the most relevant problems for your interview preparation.",
  },
  {
    question: `Is ${SITE_NAME} free to use?`,
    answer: `Yes, ${SITE_NAME} is completely free. All 15,000+ company-wise LeetCode questions, system design chapters, and interview preparation resources are available without any sign-up or payment.`,
  },
];

export const HOMEPAGE_OVERVIEW_PARAGRAPHS = [
  `${SITE_NAME} is a free, browser-based interview prep site at ${SITE_URL}. It helps you study the LeetCode problems companies actually ask, ` +
    "instead of grinding an unsorted problem list. Company pages rank questions by reported frequency. Topic and difficulty filters " +
    "narrow the set when you have a week to prepare, not a year.",
  `The question tracker at ${SITE_URL}/dashboard is the main workspace: search titles, filter by company, topic, premium status, and timeframe, ` +
    "and check off problems as you solve them. Progress stays in the browser when you are signed out, and syncs to your account when you sign in.",
  `${SITE_NAME} also publishes system-design chapters (scaling, rate limiting, consistent hashing, URL shorteners, chat, news feeds, and more), ` +
    "a Learn section with in-browser DSA exercises, company-vs-company comparison pages, and 2,700+ blog guides. It is not LeetCode, not a coding judge, " +
    "and not an official careers portal. Use it to decide what to practice; submit solutions on LeetCode or in the Learn playground.",
];

export function homepageVisibleText(): string {
  const faqText = homepageFaqs.map((item) => `${item.question} ${item.answer}`).join(" ");
  return [HOMEPAGE_H1, HOMEPAGE_SUBHEAD, ...HOMEPAGE_OVERVIEW_PARAGRAPHS, faqText].join(" ");
}

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
  `${SITE_NAME} is an open-source interview preparation site. It organizes 15,000+ LeetCode-style coding questions by the companies that ask them, ` +
    "so you can spend practice time on problems that show up in real interviews at Google, Amazon, Meta, Apple, Microsoft, and hundreds of other employers.",
  "Company-wise lists are sourced from the public liquidslr/interview-company-wise-problems dataset and rebuilt into browsable pages: one page per company, " +
    "per topic, per difficulty, and per problem. Frequency sorting is the default because interview prep is a ranking problem, not a completionist one.",
  `Beyond the tracker, ${SITE_NAME} includes system-design chapters with diagrams, a Learn path with in-browser code execution, side-by-side company comparisons, ` +
    "and a large set of written guides. The product is free. Signing in is optional and only needed if you want progress and notes synced across devices.",
  `${SITE_NAME} is built by shydev and released under the GPL-3.0 license. The canonical site is ${SITE_URL}. Source lives at ${CONTACT_GITHUB}. ` +
    `${SITE_NAME} is not affiliated with LeetCode or with the companies whose interview questions appear here.`,
];

export const CONTACT_H1 = `Contact ${SITE_NAME}`;
export const CONTACT_PARAGRAPHS = [
  `The fastest way to reach the ${SITE_NAME} maintainer is email or a GitHub issue. There is no phone support line and no ticket portal. ` +
    "Use email for account or privacy questions. Use GitHub for bugs, data corrections, and feature requests so the discussion stays public and searchable.",
  `Email: ${CONTACT_EMAIL}. This is the address used on the public ${SITE_NAME} git history and the address to use for privacy requests, takedown questions, ` +
    `and anything you should not file in a public issue tracker.`,
  `GitHub issues: ${CONTACT_GITHUB_ISSUES}. Please include the ${SITE_NAME} URL you were on, what you expected, and what you saw. ` +
    "Company question lists come from an upstream dataset; if a problem is missing or miscategorized, link the company page.",
  `Public updates and lighter-weight pings: ${CONTACT_X} (shydev). The ${SITE_NAME} repository is ${CONTACT_GITHUB}. ` +
    `There is no physical office published for ${SITE_NAME}; it is a small open-source project, not a staffed company headquarters.`,
];

export const PRIVACY_H1 = `${SITE_NAME} Privacy Policy`;
export const PRIVACY_PARAGRAPHS = [
  `This policy describes how ${SITE_NAME} (${SITE_URL}) handles information. ${SITE_NAME} is a free interview-prep site. ` +
    "You can browse companies, problems, system-design chapters, and the blog without creating an account.",
  "If you never sign in, progress checkboxes and personal notes stay in your browser (localStorage) on that device. " +
    `${SITE_NAME} does not receive those local records. Clearing site data in the browser deletes them.`,
  `If you sign in, authentication is provided by Clerk. ${SITE_NAME} stores your Clerk user id plus the problem slugs you mark solved and the notes you save, ` +
    "in a Cloudflare D1 database, so the same progress can load on another device. Those APIs are /api/progress and /api/notes and require your session cookie. " +
    "Clerk's own privacy policy covers the identity data Clerk holds: https://clerk.com/legal/privacy",
  `${SITE_NAME} does not sell personal information. Question lists and editorial content are published to help people prepare for interviews. ` +
    `The site is hosted on Cloudflare. Cloudflare may process connection data (IP address, user agent) as any CDN would. ` +
    `To ask a question about this policy or request deletion of an account's stored progress and notes, email ${CONTACT_EMAIL} and use the same address on the account if you have one.`,
  `This page is the ${SITE_NAME} privacy notice as of 27 August 2026. If the data we store changes in a material way, this page will be updated.`,
];

export const DEVELOPERS_H1 = `${SITE_NAME} developer resources`;
export const DEVELOPERS_PARAGRAPHS = [
  `${SITE_NAME} does not publish a public REST API, OpenAPI spec, or MCP server. Agents and developers should treat HTML pages, ` +
    `/llms.txt, and /sitemap.xml as the supported machine-readable interface. Do not scrape /data/ JSON; robots.txt disallows /data/ and /api/.`,
  `Use ${SITE_NAME} when you need company-wise LeetCode interview question lists, topic/difficulty filters, company comparisons, system-design chapters, or blog guides. ` +
    "Call pages by URL. Prefer sitemap.xml to discover indexable routes instead of guessing slugs.",
  "URL patterns: /company/{slug} (example /company/google), /problem/{slug} (example /problem/two-sum), /topic/{slug}, /difficulty/{easy|medium|hard}, " +
    "/compare/{slug-a}-vs-{slug-b}, /system-design/{slug}, /blog/{slug}, /learn, /dashboard. Trust pages: /about, /contact, /privacy, /developers.",
  `Authenticated JSON endpoints exist only for a signed-in human's own data: GET/POST /api/progress and GET/POST /api/notes. ` +
    "They use a Clerk session cookie, not API keys. Signed-out GET returns empty maps. There is no bulk export and no service account. " +
    `Start at ${SITE_URL}/llms.txt for when-to-use guidance.`,
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
