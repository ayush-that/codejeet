import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  ABOUT_H1,
  CONTACT_H1,
  DEVELOPERS_H1,
  LLMS_FULL_TXT,
  LLMS_TXT,
  NOT_FOUND_MARKDOWN,
  PRIVACY_H1,
  aboutVisibleText,
  contactVisibleText,
  developersVisibleText,
  privacyVisibleText,
} from "../lib/agent-resources";
import { organizationJsonLd, softwareApplicationJsonLd, websiteJsonLd } from "../lib/seo";
import { OG_IMAGE_PATH, OG_TYPE, SITE_LANG, SITE_NAME, SITE_URL } from "../lib/site";
import sitemap from "../app/sitemap";
import { classifySitemapPath } from "../lib/sitemap/filters";
import { STATIC_TRUST_PAGES, TRUST_PAGES_LAST_MODIFIED } from "../lib/sitemap/static-pages";

const root = process.cwd();

const ORIGINAL_HOMEPAGE_H1 = "15,000+ Company-wise LeetCode Interview Questions";

function assertMinChars(label: string, text: string, min = 500) {
  assert.ok(
    text.length >= min,
    `${label} should have at least ${min} characters, got ${text.length}`
  );
}

function assertNoPhone(label: string, text: string) {
  assert.doesNotMatch(text, /tel:/i, `${label} should not include tel: links`);
  assert.doesNotMatch(text, /telephone/i, `${label} should not include a telephone field`);
  assert.doesNotMatch(text, /\+?\d[\d\s().-]{8,}\d/, `${label} should not include a phone number`);
}

describe("homepage server-rendered content", () => {
  it("keeps the primary H1 and subhead", () => {
    const source = readFileSync(path.join(root, "app/page.client.tsx"), "utf8");
    assert.equal(source.includes(ORIGINAL_HOMEPAGE_H1), true);
    assert.equal(source.includes("Filter by company, topic, and difficulty."), true);
    assert.equal(source.includes("Practice smarter for your next tech"), true);
  });
});

describe("agent 404 body", () => {
  it("is markdown with recovery links", () => {
    assert.match(NOT_FOUND_MARKDOWN, /^# Page not found/m);
    assert.match(NOT_FOUND_MARKDOWN, /sitemap\.xml/);
    assert.match(NOT_FOUND_MARKDOWN, /llms\.txt/);
    assert.match(NOT_FOUND_MARKDOWN, /developers/);
    assert.match(NOT_FOUND_MARKDOWN, /404/);
  });
});

describe("llms.txt", () => {
  it("includes identity, when-to-use, and developer resources", () => {
    assert.match(LLMS_TXT, new RegExp(`^# ${SITE_NAME}`, "m"));
    assert.match(LLMS_TXT, /## When to use this/);
    assert.match(LLMS_TXT, /## Developer resources/);
    assert.match(LLMS_TXT, /\/developers/);
    assert.match(LLMS_TXT, /company-wise LeetCode/);
    assert.match(LLMS_TXT, /does not publish a public REST|none is published/);
  });

  it("ships a longer llms-full.txt with call instructions", () => {
    assert.match(LLMS_FULL_TXT, /How an agent should call/);
    assert.match(LLMS_FULL_TXT, /\/company\/\{slug\}/);
    assert.match(LLMS_FULL_TXT, /\/api\/progress/);
  });

  it("matches the public llms.txt files", () => {
    const llms = readFileSync(path.join(root, "public/llms.txt"), "utf8");
    const full = readFileSync(path.join(root, "public/llms-full.txt"), "utf8");
    assert.equal(llms, LLMS_TXT);
    assert.equal(full, LLMS_FULL_TXT);
  });
});

describe("trust pages", () => {
  it("has 500+ characters on about, contact, privacy, and developers", () => {
    assert.equal(ABOUT_H1.includes(SITE_NAME), true);
    assert.equal(CONTACT_H1.includes(SITE_NAME), true);
    assert.equal(PRIVACY_H1.includes(SITE_NAME), true);
    assert.equal(DEVELOPERS_H1.includes(SITE_NAME), true);
    assertMinChars("about", aboutVisibleText());
    assertMinChars("contact", contactVisibleText());
    assertMinChars("privacy", privacyVisibleText());
    assertMinChars("developers", developersVisibleText());
  });
});

describe("JSON-LD", () => {
  it("includes Organization name, description, and contactPoint without a phone", () => {
    const org = organizationJsonLd();
    assert.equal(org.name, SITE_NAME);
    assert.ok(typeof org.description === "string" && org.description.length > 40);
    assert.equal(org.url, SITE_URL);
    assert.equal(org.contactPoint["@type"], "ContactPoint");
    assert.ok(org.contactPoint.email.includes("@"));
    assert.equal(org.contactPoint.contactType, "customer support");
    assert.equal("telephone" in org.contactPoint, false);
    assert.equal("telephone" in org, false);
  });

  it("includes SoftwareApplication name, description, url, and offers", () => {
    const app = softwareApplicationJsonLd();
    assert.equal(app["@type"], "SoftwareApplication");
    assert.equal(app.name, SITE_NAME);
    assert.ok(typeof app.description === "string" && app.description.length > 40);
    assert.equal(app.url, SITE_URL);
    assert.equal(app.offers["@type"], "Offer");
    assert.equal(app.offers.price, "0");
  });

  it("keeps WebSite name and description", () => {
    const site = websiteJsonLd();
    assert.equal(site.name, SITE_NAME);
    assert.ok(site.description.length > 40);
  });
});

describe("no phone number on agent or trust surfaces", () => {
  it("omits telephone from copy, llms.txt, and JSON-LD", () => {
    assertNoPhone("about", aboutVisibleText());
    assertNoPhone("contact", contactVisibleText());
    assertNoPhone("privacy", privacyVisibleText());
    assertNoPhone("developers", developersVisibleText());
    assertNoPhone("llms.txt", LLMS_TXT);
    assertNoPhone("llms-full.txt", LLMS_FULL_TXT);
    assertNoPhone("json-ld", JSON.stringify(organizationJsonLd()));
  });
});

describe("metadata contract", () => {
  it("defines canonical origin, lang, og:image, and og:type", () => {
    assert.equal(SITE_URL, "https://codejeet.com");
    assert.equal(SITE_LANG, "en");
    assert.equal(OG_TYPE, "website");
    assert.equal(OG_IMAGE_PATH, "/og-image.png");
    const ogFile = path.join(root, "public", OG_IMAGE_PATH.replace(/^\//, ""));
    assert.equal(existsSync(ogFile), true, "public/og-image.png must exist");
    const bytes = readFileSync(ogFile);
    assert.ok(bytes.length > 1000, "og image should be a real asset");
    assert.equal(bytes[0], 0x89);
    assert.equal(bytes[1], 0x50);
    assert.equal(bytes[2], 0x4e);
    assert.equal(bytes[3], 0x47);
  });

  it("wires homepage metadata to those fields", () => {
    const homepage = readFileSync(path.join(root, "app/page.tsx"), "utf8");
    assert.match(homepage, /canonical/);
    assert.match(homepage, /OG_IMAGE_PATH/);
    assert.match(homepage, /OG_TYPE/);
    const layout = readFileSync(path.join(root, "app/layout.tsx"), "utf8");
    assert.match(layout, /lang=\{SITE_LANG\}/);
    assert.match(layout, /OG_IMAGE_PATH/);
    assert.match(layout, /type: OG_TYPE/);
    const notFound = readFileSync(path.join(root, "app/not-found.tsx"), "utf8");
    assert.match(notFound, /NOT_FOUND_MARKDOWN/);
  });
});

describe("video structured data", () => {
  it("does not emit VideoObject without a source upload date", () => {
    const detailPage = readFileSync(path.join(root, "app/system-design/[slug]/page.tsx"), "utf8");
    assert.doesNotMatch(detailPage, /videoObjectJsonLd/);
    assert.doesNotMatch(detailPage, /"@type": "VideoObject"/);
  });
});

describe("sitemap trust pages", () => {
  it("classifies legal routes as static", () => {
    assert.equal(classifySitemapPath("/about"), "static");
    assert.equal(classifySitemapPath("/contact"), "static");
    assert.equal(classifySitemapPath("/privacy"), "static");
    assert.equal(classifySitemapPath("/developers"), "static");
  });

  it("includes about, contact, privacy, and developers with an August lastModified", () => {
    const entries = sitemap();
    const byPath = new Map(
      entries.map((entry) => [new URL(entry.url).pathname, entry.lastModified])
    );
    for (const page of STATIC_TRUST_PAGES) {
      assert.equal(byPath.has(page.path), true, `sitemap missing ${page.path}`);
      const modified = byPath.get(page.path);
      assert.ok(modified instanceof Date, `${page.path} lastModified should be a Date`);
      assert.equal(
        (modified as Date).toISOString().slice(0, 10),
        TRUST_PAGES_LAST_MODIFIED.toISOString().slice(0, 10)
      );
    }
  });
});
