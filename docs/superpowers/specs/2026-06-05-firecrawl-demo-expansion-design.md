# Firecrawl Demo + Content Expansion — Design

**Date:** 2026-06-05
**Branch:** `firecrawl-demo-expansion`
**Goal:** Expand Firecrawl affiliate coverage with two flagship interactive demos and four pillar blog posts, all at the quality bar of the existing RAG Visualized demo. Optimize for trust and high technical signal, with affiliate links woven throughout.

## Context

The portfolio already has:
- A committed reference demo: `/demos/firecrawl-knowledge-base` (crawl → extract → categorize → searchable KB).
- The gold-standard demo: `/demos/rag-visualized` — 3,369 lines across 7 files (`page.tsx`, `data.ts`, `utils.ts`, `RagArchitectureDiagram.tsx`, `RagPipelineVisualization.tsx`, `RagStepInspector.tsx`, `RagDemoClient.tsx`). Shared simulation state drives an architecture diagram, a live pipeline visualization, and a deep-dive step inspector. Ends in a trust-building premium CTA + Newsletter.
- Affiliate infrastructure: `getAffiliateLink()` (UTM tracking) in `src/lib/affiliate.ts`; `<AffiliateLink>`, `<InlineAffiliateCTA>`, `StickyAffiliateCTA` in `src/components/StickyAffiliateCTA.tsx`. The `firecrawl` product is wired to `https://firecrawl.link/zack-proser`.
- Existing Firecrawl blog cluster (all `hiddenFromIndex: true`, ~600–730 words, hero `firecrawl-hero.webp`): `best-web-scraping-api-2026`, `firecrawl-vs-crawl4ai`, `extract-structured-data-websites`, `firecrawl-for-rag-pipelines`.
- Recent narrative pillar posts (index-visible): `spark-bellows-quench`, `all-apple-smart-home-solo-parent`.

A previous agent (Devin) committed four demos (`firecrawl-competitor-analysis`, `firecrawl-seo-extraction`, `firecrawl-change-monitoring`, `firecrawl-dataset-builder`) and four blog posts to this branch. **The demos are failures** — placeholder data (`"Competitor A"`, banned word "Robust"), no real Firecrawl mechanics, monolithic single files, weak affiliate integration. **All Devin work (demos + posts) is scrapped and rebuilt.**

No `FIRECRAWL_API_KEY` in `.env`. Demos are **simulations** (like RAG) using hand-built data that mirrors real Firecrawl API request/response shapes.

## Non-negotiable writing rules

Per `CLAUDE.md` and project memory: the "not just X, it's Y" / "isn't X, it's Y" pattern is banned everywhere, including demo UI copy, headings, and blog content. No banned buzzwords (game-changer, robust, leverage, seamless, delve, etc.). State what things are. Lead with the point.

## Phase 0 — Cleanup

Remove all Devin work:
- Delete demo dirs: `src/app/demos/firecrawl-competitor-analysis/`, `firecrawl-seo-extraction/`, `firecrawl-change-monitoring/`, `firecrawl-dataset-builder/`.
- Delete blog dirs: `src/content/blog/ai-research-agent-cloudflare-workers-firecrawl/`, `clone-website-with-ai/`, `web-scraping-for-ai-2026/`, `why-i-use-firecrawl-workos-applied-ai/`.
- Revert the Devin additions to `src/app/demos/page.tsx` (the four `otherDemos` entries).

**Do NOT touch** `public/og-images/*.png` (those belong to other recent posts — all-apple, spark-bellows) or `next-env.d.ts` (auto-generated).

## Demo architecture (both demos mirror RAG decomposition)

Each demo lives in `src/app/demos/<slug>/` with:
- `page.tsx` — `createMetadata({...})` (full keywords/tags/robots like the KB demo) + `Container` + `Suspense` wrapper. **Not** the thin Devin metadata pattern.
- `data.ts` — realistic seed data (real-feeling sites, never "Competitor A").
- `utils.ts` — pure simulation engine + exported TypeScript types.
- One architecture-diagram component.
- One live-visualization component.
- One step-inspector component.
- One `*DemoClient.tsx` orchestrator holding shared state, intro card ("What is X" / "How to use this demo"), the visualization + inspector, a trust/CTA section, and `<Newsletter>`.

Affiliate links use `getAffiliateLink({ product: 'firecrawl', campaign: <slug>, medium: 'demo', placement: ... })` and fire `track('affiliate_click', ...)`. Each demo registered in `src/app/demos/page.tsx` `otherDemos[]` with a dedicated hero image.

### Demo A — Crawl & Map a Whole Site

**Slug:** `firecrawl-site-crawler` · **Promise:** "Watch Firecrawl turn an entire website into LLM-ready data."

- **Architecture diagram** (`FirecrawlCrawlArchitecture.tsx`): Seed URL → `/map` (link + sitemap discovery) → crawl queue → JS render → markdown extraction → your RAG/app. Active stage animates with the simulation.
- **Visualization** (`FirecrawlCrawlVisualization.tsx`): a site-map tree/graph that grows as URLs are discovered (BFS by depth), plus a concurrent worker/queue panel with per-page status pills (`queued → rendering → markdown → done`) and live counters (pages crawled, tokens, elapsed ms). Play / step / reset controls.
- **Inspector** (`FirecrawlCrawlInspector.tsx`): select any crawled page → tabs:
  - *Rendered Markdown* — the clean LLM-ready output.
  - *Raw vs Clean* — chrome-stripping via `onlyMainContent` (nav/footer/ads removed).
  - *API Request* — real `POST /v1/map` `{ url }` and `POST /v1/crawl` body: `{ url, includePaths, excludePaths, maxDepth, limit, ignoreSitemap, scrapeOptions: { formats: ["markdown","links"], onlyMainContent } }`. Async response shape `{ success, id, type, data[] }`.
  - *Page Metadata* — status code, depth, discovered links, token count.
  - Controls: depth slider, limit, include/exclude path glob inputs, format checkboxes (`markdown`/`html`/`links`), `onlyMainContent` toggle. Changing controls re-runs the simulation (debounced).
- **Seed sites** (`data.ts`): a documentation site, a SaaS marketing site, an e-commerce catalog — each with a real-looking URL tree, per-page raw-HTML size, rendered markdown, token count.

### Demo B — Change Tracking & Monitoring

**Slug:** `firecrawl-change-tracker` · **Promise:** "Know the instant any page changes — pricing, docs, competitors, compliance."

- **Architecture diagram** (`FirecrawlMonitorArchitecture.tsx`): Scheduler (cron / Cloudflare Worker) → scrape `formats: ["markdown", { type: "changeTracking", modes: [...] }]` → compare to `previousScrapeAt` → diff → alert (webhook / Slack). Active stage animates.
- **Visualization** (`FirecrawlMonitorVisualization.tsx`): a snapshot timeline with change markers, a monitoring-frequency control, a "next check in…" ticker, and a live change-event feed. Play advances simulated time and fires change events.
- **Inspector** (`FirecrawlMonitorInspector.tsx`): select any change event → tabs:
  - *Git-diff* — colorized line-level added/removed (git-diff mode).
  - *JSON Diff* — field-level changes vs a schema, real shape `changeTracking.json = { price: { previous, current }, availability: { previous, current } }`.
  - *changeTracking Response* — real shape: `{ previousScrapeAt, changeStatus: "new"|"same"|"changed"|"removed", visibility: "visible"|"hidden", diff?, json? }`, inside `{ success, data: { markdown, changeTracking } }`.
  - *Alert* — the webhook/Slack payload it would send.
  - Controls: mode toggle (`git-diff` vs `json`), JSON-mode schema editor, monitoring frequency.
- **Seed pages** (`data.ts`): a SaaS pricing page (price + plan change), a competitor changelog (new feature), a docs page (section added/removed), a policy/ToS page (compliance). Each has a timeline of snapshots with markdown + structured fields + computed `changeStatus`.

## Pillar content (4 posts, index-visible)

Each `src/content/blog/<slug>/` with `metadata.json` + `page.mdx`. In-voice, ~1.2–1.8k words, affiliate woven via `<AffiliateLink>` / `<InlineAffiliateCTA>`. Cross-link each other, the two demos, and the existing Firecrawl cluster. Metadata matches existing shape (author, date 2026-06-05, description, image, slug, keywords, tags) but **index-visible** (no `hiddenFromIndex`) to sit with recent pillars.

1. **Crawling an entire site into LLM-ready data** — companion to Demo A; embeds/links it. `/map` vs `/crawl`, depth/limit/path control, `onlyMainContent`, building a RAG corpus, cost control.
2. **Monitoring the web for changes with Firecrawl** — companion to Demo B; embeds/links it. `changeTracking`, scheduling on Cloudflare Workers, use cases (compliance, competitive intel, docs drift), webhook alerts.
3. **Why Firecrawl is my default for applied AI at WorkOS** — rebuilt trust pillar (Devin's bones were good; rebuild in-voice). Credibility / top-of-funnel.
4. **The complete guide to web scraping for AI (2026)** — rebuilt top-of-funnel pillar; links the whole cluster.

## Images

Generate dedicated hero + OG images (nano-banana-pro), upload to Bunny CDN (`images/<name>.webp`, `images/og-images/<slug>.png`). Hero for each demo and each post. Fallback to existing `firecrawl-hero.webp` if generation is deferred.

## Verification

- `npm run build` must pass (zero type errors) before any commit.
- `git status` — confirm all new files staged (metadata.json, images).
- No banned writing patterns anywhere (demos + posts).
- No merge/deploy without explicit approval.

## Execution

Demos A and B are independent → build in parallel (Agent tool, one per demo) against this spec. Posts written after demos exist (so they can link real demo URLs/screenshots). Register demos on `/demos`. Build, verify, present for review.

## Out of scope (YAGNI)

- Live Firecrawl API calls (no key; simulation is the proven pattern and avoids abuse surface). Revisit if a key is added.
- Reviving the dropped concepts (competitor analysis, SEO extraction, dataset builder) — covered conceptually by the KB demo and the crawl demo.
