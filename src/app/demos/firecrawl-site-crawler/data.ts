// Seed data for the Firecrawl "Crawl & Map a Whole Site" demo.
//
// Three believable real-world sites, each with a URL tree (parent/depth links),
// per-page raw-HTML byte size, hand-written rendered markdown, a token estimate,
// and the links each page discovers. The simulation engine in utils.ts walks this
// tree breadth-first to mirror how a real Firecrawl /crawl job expands.

export type SeedPage = {
  /** Full URL of the page. */
  url: string
  /** Path portion only, e.g. "/docs/quickstart". Used for include/exclude globs. */
  path: string
  /** Page <title>. */
  title: string
  /** Crawl depth from the seed URL (seed = 0). */
  depth: number
  /** HTTP status the simulated fetch returns. */
  statusCode: number
  /** Size of the raw HTML payload in bytes (before chrome stripping). */
  rawHtmlBytes: number
  /** Clean, LLM-ready markdown after onlyMainContent extraction. */
  markdown: string
  /**
   * The same page WITHOUT onlyMainContent: nav, footer, cookie banner and ad
   * slots are still attached. Used by the "Raw vs Clean" inspector tab.
   */
  markdownWithChrome: string
  /** URLs this page links to (drives breadth-first discovery). */
  discoveredLinks: string[]
}

export type SeedSite = {
  id: string
  name: string
  /** Seed URL the crawl starts from. */
  seedUrl: string
  /** Apex domain, e.g. "docs.acmecloud.io". */
  domain: string
  description: string
  /** Short label for the kind of site (Documentation, Marketing, Catalog). */
  kind: string
  /** Tailwind-friendly accent hue used by the UI. */
  accent: 'blue' | 'emerald' | 'violet'
  /** Default include-path globs a user would reasonably start with. */
  defaultIncludePaths: string[]
  /** Default exclude-path globs. */
  defaultExcludePaths: string[]
  /** Whether the site exposes a sitemap.xml the /map endpoint can read. */
  hasSitemap: boolean
  pages: SeedPage[]
}

// Shared chrome (nav + footer + cookie banner) appended to the "with chrome"
// markdown so the Raw vs Clean tab has something concrete to strip.
function withChrome(domain: string, mainMarkdown: string): string {
  return `[Skip to content](#main)

- [Home](https://${domain}/)
- [Docs](https://${domain}/docs)
- [Pricing](https://${domain}/pricing)
- [Blog](https://${domain}/blog)
- [Sign in](https://${domain}/login)

${mainMarkdown}

---

This site uses cookies to analyze traffic. [Accept all] [Manage preferences]

© ${new Date().getFullYear()} ${domain}. All rights reserved.
[Terms](https://${domain}/legal/terms) · [Privacy](https://${domain}/legal/privacy) · [Status](https://status.${domain})

Sponsored: Ship faster with the all-in-one platform. [Learn more →]`
}

// ── Site 1: A documentation site ────────────────────────────────────────────
const ACME_DOMAIN = 'docs.acmecloud.io'
const acmePages: SeedPage[] = [
  {
    url: `https://${ACME_DOMAIN}/`,
    path: '/',
    title: 'AcmeCloud Docs',
    depth: 0,
    statusCode: 200,
    rawHtmlBytes: 48210,
    markdown: `# AcmeCloud Documentation

AcmeCloud is a managed Postgres and object-storage platform. These docs cover setup, the CLI, the REST API, and operational runbooks.

## Start here

- **Quickstart** — provision your first database in under five minutes.
- **CLI reference** — every \`acme\` command with examples.
- **API reference** — REST endpoints, auth, and rate limits.
- **Guides** — backups, replication, and scaling playbooks.`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${ACME_DOMAIN}/docs/quickstart`,
      `https://${ACME_DOMAIN}/docs/cli`,
      `https://${ACME_DOMAIN}/docs/api`,
      `https://${ACME_DOMAIN}/docs/guides`,
      `https://${ACME_DOMAIN}/pricing`,
      `https://${ACME_DOMAIN}/login`,
    ],
  },
  {
    url: `https://${ACME_DOMAIN}/docs/quickstart`,
    path: '/docs/quickstart',
    title: 'Quickstart — AcmeCloud Docs',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 61840,
    markdown: `# Quickstart

Provision your first managed Postgres instance and connect to it.

## 1. Install the CLI

\`\`\`bash
npm install -g @acmecloud/cli
acme login
\`\`\`

## 2. Create a database

\`\`\`bash
acme db create --name analytics --region us-east-1 --plan standard
\`\`\`

The command returns a connection string. Store it as a secret; it is shown only once.

## 3. Connect

\`\`\`bash
psql "$ACME_DATABASE_URL"
\`\`\`

Next: read the [CLI reference](/docs/cli) or set up [automated backups](/docs/guides/backups).`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${ACME_DOMAIN}/docs/cli`,
      `https://${ACME_DOMAIN}/docs/guides/backups`,
    ],
  },
  {
    url: `https://${ACME_DOMAIN}/docs/cli`,
    path: '/docs/cli',
    title: 'CLI Reference — AcmeCloud Docs',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 73520,
    markdown: `# CLI Reference

The \`acme\` CLI manages databases, buckets, and access tokens.

## acme db

| Command | Description |
| --- | --- |
| \`acme db create\` | Provision a new database |
| \`acme db list\` | List databases in the current project |
| \`acme db scale\` | Change the compute plan |
| \`acme db delete\` | Permanently destroy a database |

## acme bucket

| Command | Description |
| --- | --- |
| \`acme bucket create\` | Create an object-storage bucket |
| \`acme bucket cp\` | Copy files to or from a bucket |

Every command accepts \`--json\` for machine-readable output.`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${ACME_DOMAIN}/docs/api`,
      `https://${ACME_DOMAIN}/docs/guides/scaling`,
    ],
  },
  {
    url: `https://${ACME_DOMAIN}/docs/api`,
    path: '/docs/api',
    title: 'API Reference — AcmeCloud Docs',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 88140,
    markdown: `# REST API Reference

Base URL: \`https://api.acmecloud.io/v1\`. Authenticate with a bearer token.

## Authentication

\`\`\`http
GET /v1/databases
Authorization: Bearer acme_live_...
\`\`\`

## Rate limits

| Plan | Requests / minute |
| --- | --- |
| Free | 60 |
| Standard | 600 |
| Enterprise | Custom |

Exceeding the limit returns \`429 Too Many Requests\` with a \`Retry-After\` header.

## Endpoints

- \`GET /v1/databases\` — list databases
- \`POST /v1/databases\` — create a database
- \`GET /v1/databases/{id}/metrics\` — connection and storage metrics`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${ACME_DOMAIN}/docs/guides/replication`,
    ],
  },
  {
    url: `https://${ACME_DOMAIN}/docs/guides`,
    path: '/docs/guides',
    title: 'Guides — AcmeCloud Docs',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 41300,
    markdown: `# Operational Guides

Step-by-step playbooks for running AcmeCloud in production.

- [Automated backups](/docs/guides/backups)
- [Read replicas & replication](/docs/guides/replication)
- [Scaling under load](/docs/guides/scaling)`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${ACME_DOMAIN}/docs/guides/backups`,
      `https://${ACME_DOMAIN}/docs/guides/replication`,
      `https://${ACME_DOMAIN}/docs/guides/scaling`,
    ],
  },
  {
    url: `https://${ACME_DOMAIN}/docs/guides/backups`,
    path: '/docs/guides/backups',
    title: 'Automated Backups — AcmeCloud Docs',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 52900,
    markdown: `# Automated Backups

AcmeCloud takes a full snapshot daily and retains point-in-time recovery for seven days on Standard and 30 days on Enterprise.

## Configure retention

\`\`\`bash
acme db backup-policy set --name analytics --retention 30d
\`\`\`

## Restore

\`\`\`bash
acme db restore --name analytics --to "2026-06-01T12:00:00Z"
\`\`\`

Restores create a new instance; they never overwrite the source database.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${ACME_DOMAIN}/docs/guides/replication`,
    path: '/docs/guides/replication',
    title: 'Replication — AcmeCloud Docs',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 56720,
    markdown: `# Read Replicas & Replication

Add read replicas to spread query load across regions.

\`\`\`bash
acme db replica add --name analytics --region eu-west-1
\`\`\`

Replicas are asynchronous. Expect sub-second lag under normal load and design reads to tolerate it.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${ACME_DOMAIN}/docs/guides/scaling`,
    path: '/docs/guides/scaling',
    title: 'Scaling Under Load — AcmeCloud Docs',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 49880,
    markdown: `# Scaling Under Load

Vertical scaling changes the compute plan with a brief failover. Horizontal scaling adds replicas.

\`\`\`bash
acme db scale --name analytics --plan performance
\`\`\`

Use connection pooling (PgBouncer is built in) before reaching for a bigger plan.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${ACME_DOMAIN}/pricing`,
    path: '/pricing',
    title: 'Pricing — AcmeCloud',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 38600,
    markdown: `# Pricing

| Plan | Compute | Storage | Price |
| --- | --- | --- | --- |
| Free | Shared | 1 GB | $0 |
| Standard | 2 vCPU | 50 GB | $49/mo |
| Performance | 8 vCPU | 250 GB | $299/mo |
| Enterprise | Custom | Custom | Contact sales |`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${ACME_DOMAIN}/login`,
    path: '/login',
    title: 'Sign in — AcmeCloud',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 21400,
    markdown: `# Sign in

Authenticate to manage your AcmeCloud projects.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
]

// ── Site 2: A SaaS marketing site ───────────────────────────────────────────
const PULSE_DOMAIN = 'getpulsemetrics.com'
const pulsePages: SeedPage[] = [
  {
    url: `https://${PULSE_DOMAIN}/`,
    path: '/',
    title: 'Pulse Metrics — Product analytics for builders',
    depth: 0,
    statusCode: 200,
    rawHtmlBytes: 91200,
    markdown: `# Understand what your users actually do

Pulse Metrics is product analytics that answers "why" in seconds, not dashboards you never open.

- **Event tracking** with a one-line SDK.
- **Funnels & retention** computed live.
- **Session replay** linked to every metric.

[Start free](/signup) — no credit card, 50k events a month.`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${PULSE_DOMAIN}/features`,
      `https://${PULSE_DOMAIN}/pricing`,
      `https://${PULSE_DOMAIN}/customers`,
      `https://${PULSE_DOMAIN}/blog`,
      `https://${PULSE_DOMAIN}/signup`,
    ],
  },
  {
    url: `https://${PULSE_DOMAIN}/features`,
    path: '/features',
    title: 'Features — Pulse Metrics',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 78400,
    markdown: `# Features

## Event tracking
Send events with \`pulse.track('checkout_started', { plan })\`. Properties are queryable immediately.

## Funnels
Define a sequence of events and Pulse computes conversion and drop-off at each step, segmentable by any property.

## Retention
Cohort retention curves update in real time as new events arrive.

## Session replay
Every metric links to the sessions behind it, so you can watch the exact behavior that moved a number.`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${PULSE_DOMAIN}/features/funnels`,
      `https://${PULSE_DOMAIN}/features/replay`,
      `https://${PULSE_DOMAIN}/pricing`,
    ],
  },
  {
    url: `https://${PULSE_DOMAIN}/features/funnels`,
    path: '/features/funnels',
    title: 'Funnels — Pulse Metrics',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 64100,
    markdown: `# Funnels

Build a funnel from any ordered set of events. Pulse shows conversion between steps, median time to convert, and the segments most likely to drop off.

Funnels recompute as data lands, so a deploy that breaks signup shows up within minutes.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${PULSE_DOMAIN}/features/replay`,
    path: '/features/replay',
    title: 'Session Replay — Pulse Metrics',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 67300,
    markdown: `# Session Replay

Replay records DOM mutations, not video, so sessions are light and searchable. Sensitive fields are masked by default. Jump from any funnel drop-off straight to the replays behind it.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${PULSE_DOMAIN}/pricing`,
    path: '/pricing',
    title: 'Pricing — Pulse Metrics',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 54800,
    markdown: `# Pricing

| Plan | Events / month | Price |
| --- | --- | --- |
| Free | 50,000 | $0 |
| Growth | 1,000,000 | $99/mo |
| Scale | 10,000,000 | $499/mo |

All plans include funnels, retention, and 30-day session replay.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${PULSE_DOMAIN}/customers`,
    path: '/customers',
    title: 'Customers — Pulse Metrics',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 70200,
    markdown: `# Customers

Teams at Northwind, Bayside Software, and Lumen Robotics use Pulse to find where users stall.

> "We cut our onboarding drop-off in half in two weeks." — Head of Growth, Northwind`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${PULSE_DOMAIN}/customers/northwind`,
    ],
  },
  {
    url: `https://${PULSE_DOMAIN}/customers/northwind`,
    path: '/customers/northwind',
    title: 'Northwind case study — Pulse Metrics',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 58900,
    markdown: `# How Northwind cut onboarding drop-off in half

Northwind instrumented its signup flow with Pulse funnels, found a broken email-verification step, and shipped a fix within a sprint. Activation rose from 41% to 63%.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${PULSE_DOMAIN}/blog`,
    path: '/blog',
    title: 'Blog — Pulse Metrics',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 49700,
    markdown: `# Blog

- [What product teams get wrong about retention](/blog/retention-myths)
- [Event naming conventions that scale](/blog/event-naming)`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${PULSE_DOMAIN}/blog/retention-myths`,
      `https://${PULSE_DOMAIN}/blog/event-naming`,
    ],
  },
  {
    url: `https://${PULSE_DOMAIN}/blog/retention-myths`,
    path: '/blog/retention-myths',
    title: 'Retention myths — Pulse Metrics',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 62400,
    markdown: `# What product teams get wrong about retention

Retention is not one number. Day-1, week-4, and resurrected-user retention answer different questions. Pick the curve that matches the behavior you are trying to change.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${PULSE_DOMAIN}/blog/event-naming`,
    path: '/blog/event-naming',
    title: 'Event naming — Pulse Metrics',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 55100,
    markdown: `# Event naming conventions that scale

Use \`object_action\` in past tense: \`checkout_completed\`, not \`Completed Checkout\`. Keep properties flat and typed. Future-you will thank present-you when building funnels.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${PULSE_DOMAIN}/signup`,
    path: '/signup',
    title: 'Sign up — Pulse Metrics',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 30100,
    markdown: `# Start free

Create an account and send your first event in minutes.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${PULSE_DOMAIN}/admin`,
    path: '/admin',
    title: 'Admin — Pulse Metrics',
    depth: 1,
    statusCode: 403,
    rawHtmlBytes: 1200,
    markdown: `# 403 Forbidden

This area requires an authenticated admin session.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
]

// ── Site 3: A developer-tools catalog ───────────────────────────────────────
const FORGE_DOMAIN = 'forgehub.dev'
const forgePages: SeedPage[] = [
  {
    url: `https://${FORGE_DOMAIN}/`,
    path: '/',
    title: 'ForgeHub — The developer tools catalog',
    depth: 0,
    statusCode: 200,
    rawHtmlBytes: 82600,
    markdown: `# ForgeHub

A curated catalog of developer tools, organized by category, with install commands and honest notes.

Browse by category:

- [CLIs](/catalog/cli)
- [Databases](/catalog/databases)
- [Observability](/catalog/observability)`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${FORGE_DOMAIN}/catalog/cli`,
      `https://${FORGE_DOMAIN}/catalog/databases`,
      `https://${FORGE_DOMAIN}/catalog/observability`,
      `https://${FORGE_DOMAIN}/submit`,
    ],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/cli`,
    path: '/catalog/cli',
    title: 'CLI tools — ForgeHub',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 71200,
    markdown: `# CLI Tools

Command-line tools worth installing.

- [ripgrep](/catalog/cli/ripgrep) — fast recursive search
- [fzf](/catalog/cli/fzf) — fuzzy finder
- [jq](/catalog/cli/jq) — JSON processor`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${FORGE_DOMAIN}/catalog/cli/ripgrep`,
      `https://${FORGE_DOMAIN}/catalog/cli/fzf`,
      `https://${FORGE_DOMAIN}/catalog/cli/jq`,
    ],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/cli/ripgrep`,
    path: '/catalog/cli/ripgrep',
    title: 'ripgrep — ForgeHub',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 46800,
    markdown: `# ripgrep

Recursively search directories for a regex pattern while respecting \`.gitignore\`.

\`\`\`bash
brew install ripgrep
rg "TODO" --type ts
\`\`\`

Notes: it is the fastest grep alternative most people will ever need.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/cli/fzf`,
    path: '/catalog/cli/fzf',
    title: 'fzf — ForgeHub',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 44300,
    markdown: `# fzf

An interactive fuzzy finder for the terminal. Pipe anything into it.

\`\`\`bash
brew install fzf
git branch | fzf
\`\`\``,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/cli/jq`,
    path: '/catalog/cli/jq',
    title: 'jq — ForgeHub',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 47900,
    markdown: `# jq

A lightweight command-line JSON processor.

\`\`\`bash
brew install jq
curl -s api.example.com/users | jq '.[].name'
\`\`\``,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/databases`,
    path: '/catalog/databases',
    title: 'Databases — ForgeHub',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 68500,
    markdown: `# Databases

- [SQLite](/catalog/databases/sqlite) — embedded SQL
- [DuckDB](/catalog/databases/duckdb) — analytical SQL`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${FORGE_DOMAIN}/catalog/databases/sqlite`,
      `https://${FORGE_DOMAIN}/catalog/databases/duckdb`,
    ],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/databases/sqlite`,
    path: '/catalog/databases/sqlite',
    title: 'SQLite — ForgeHub',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 51200,
    markdown: `# SQLite

A self-contained, serverless SQL database engine. The most deployed database in the world.

\`\`\`bash
sqlite3 app.db "SELECT count(*) FROM users;"
\`\`\``,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/databases/duckdb`,
    path: '/catalog/databases/duckdb',
    title: 'DuckDB — ForgeHub',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 53400,
    markdown: `# DuckDB

An in-process analytical database. Query Parquet and CSV files directly.

\`\`\`bash
duckdb -c "SELECT * FROM 'events.parquet' LIMIT 5;"
\`\`\``,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/observability`,
    path: '/catalog/observability',
    title: 'Observability — ForgeHub',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 66100,
    markdown: `# Observability

- [Prometheus](/catalog/observability/prometheus) — metrics & alerting
- [Grafana](/catalog/observability/grafana) — dashboards`,
    markdownWithChrome: '',
    discoveredLinks: [
      `https://${FORGE_DOMAIN}/catalog/observability/prometheus`,
      `https://${FORGE_DOMAIN}/catalog/observability/grafana`,
    ],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/observability/prometheus`,
    path: '/catalog/observability/prometheus',
    title: 'Prometheus — ForgeHub',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 57800,
    markdown: `# Prometheus

A metrics database and alerting system that scrapes targets over HTTP.

\`\`\`yaml
scrape_configs:
  - job_name: app
    static_configs:
      - targets: ['localhost:9090']
\`\`\``,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${FORGE_DOMAIN}/catalog/observability/grafana`,
    path: '/catalog/observability/grafana',
    title: 'Grafana — ForgeHub',
    depth: 2,
    statusCode: 200,
    rawHtmlBytes: 59300,
    markdown: `# Grafana

Dashboards and visualization for time-series data. Pairs naturally with Prometheus.

\`\`\`bash
docker run -p 3000:3000 grafana/grafana
\`\`\``,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
  {
    url: `https://${FORGE_DOMAIN}/submit`,
    path: '/submit',
    title: 'Submit a tool — ForgeHub',
    depth: 1,
    statusCode: 200,
    rawHtmlBytes: 33800,
    markdown: `# Submit a tool

Suggest a tool for the catalog. Include the install command and a one-line honest take.`,
    markdownWithChrome: '',
    discoveredLinks: [],
  },
]

function finalizeSite(site: SeedSite): SeedSite {
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      markdownWithChrome: withChrome(site.domain, page.markdown),
    })),
  }
}

export const SEED_SITES: SeedSite[] = [
  finalizeSite({
    id: 'acmecloud-docs',
    name: 'AcmeCloud Docs',
    seedUrl: `https://${ACME_DOMAIN}/`,
    domain: ACME_DOMAIN,
    description: 'A managed-database documentation site with a CLI reference, REST API docs, and operational guides.',
    kind: 'Documentation',
    accent: 'blue',
    defaultIncludePaths: ['^/docs/.*$'],
    defaultExcludePaths: ['^/login$'],
    hasSitemap: true,
    pages: acmePages,
  }),
  finalizeSite({
    id: 'pulse-marketing',
    name: 'Pulse Metrics (marketing)',
    seedUrl: `https://${PULSE_DOMAIN}/`,
    domain: PULSE_DOMAIN,
    description: 'A product-analytics SaaS marketing site with features, pricing, customer stories, and a blog.',
    kind: 'Marketing',
    accent: 'emerald',
    defaultIncludePaths: [],
    defaultExcludePaths: ['^/admin.*$', '^/signup$'],
    hasSitemap: true,
    pages: pulsePages,
  }),
  finalizeSite({
    id: 'forgehub-catalog',
    name: 'ForgeHub Catalog',
    seedUrl: `https://${FORGE_DOMAIN}/`,
    domain: FORGE_DOMAIN,
    description: 'A developer-tools catalog organized into categories, each with install commands and notes.',
    kind: 'Catalog',
    accent: 'violet',
    defaultIncludePaths: ['^/catalog/.*$'],
    defaultExcludePaths: ['^/submit$'],
    hasSitemap: false,
    pages: forgePages,
  }),
]
