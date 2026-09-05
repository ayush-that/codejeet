## CodeJeet

Browse 17,000+ company-wise LeetCode interview questions from 660+ companies. Filter by company, topic, and difficulty. Public educational content is statically generated; signed-in learning data uses the authenticated sync service.

> Company-wise interview questions are sourced from [liquidslr/interview-company-wise-problems](https://github.com/liquidslr/interview-company-wise-problems).

<img width="900" height="856" alt="image" src="https://github.com/user-attachments/assets/cc681e71-ce2a-4136-91b9-a496479ed98a" />

### Features

- **Company-wise questions** — 663 companies with frequency-sorted questions (Google, Amazon, Meta, Apple, Microsoft, etc.)
- **Filtering** — by company, difficulty (Easy/Medium/Hard), topic, premium status, and timeframe
- **Full-text search** — search across titles, companies, and topics
- **Progress tracking**: signed-in Progress is kept in a per-account IndexedDB Account Cache and synchronized automatically when authenticated
- **Problem Notes**: signed-in private notes with explicit Save and Clear actions
- **Company comparison** — side-by-side comparison of question sets between two companies
- **System design** — 16 chapters covering scaling, rate limiting, consistent hashing, URL shortener, chat systems, and more
- **Blog** — 2,700+ articles on DSA and interview prep
- **Audiobook** — built-in player for "The Accidental CTO"

### Tech Stack

- **Next.js 16** (static export) with React 19
- **TypeScript**
- **Tailwind CSS** with OKLCH color tokens
- **shadcn/ui** (new-york style) + Radix primitives
- **OpenNext on Cloudflare Workers**, with Durable Objects and D1 for authenticated learning data

### How It Works

Public educational content lives in 663 CSV files (`data/companies/`), one per company. At build time, a prebuild script parses all CSVs into a single `public/data/questions.json`. The dashboard fetches this public content client-side and may cache it in localStorage.

Progress and Problem Notes are Account Data. A signed-in browser keeps an authoritative per-account IndexedDB Account Cache and applies a Pending Overlay for local edits. Authenticated sync persists the canonical account state through the Cloudflare Worker, Durable Object, and server-readable D1. The signed-out Public View hides retained Account Caches and shows empty learning data.

Explicit account deletion removes server Account Data and connected caches after confirmation. A browser that stays permanently offline cannot receive a remote deletion until it reconnects. See [Privacy](https://codejeet.com/privacy) and the [deployment guide](docs/deployment.md) for the data and rollout contracts.

### Development

```bash
# Install dependencies
pnpm install

# Run dev server (Turbopack)
pnpm dev

# Build for production
pnpm run prebuild   # generates public/data/questions.json from CSVs
pnpm build          # static export to out/

# Lint & format
pnpm lint
pnpm format
```

### Deployment

```bash
pnpm run build:worker   # build for Cloudflare
pnpm run preview        # local preview with Wrangler
pnpm run deploy         # deploy the Worker to Cloudflare
```

Production rollout is ordered: apply additive D1 migrations, verify bindings and auth prerequisites, build and inspect the Worker asset guard, then activate the Worker. Keep the legacy mirrors and `/api/progress` and `/api/notes` compatibility endpoints during the rollback window. The [deployment guide](docs/deployment.md) contains the prerequisites and verification matrix.

### Project Structure

```
app/                  Next.js App Router pages
components/           React components (shadcn/ui + custom)
  ui/                 shadcn primitives
  magic-ui/           animation components
lib/                  data loading, stores, SEO, utilities
data/companies/       663 CSV files (one per company)
public/system-design/ 16 markdown-based chapters
content/              blog markdown files
scripts/              build-data.ts (CSV → JSON prebuild)
```

### License

[GPL-3.0](LICENSE)
