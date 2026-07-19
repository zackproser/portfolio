---
name: blueprint-post
description: Author and ship a new Blueprint Deep Dive post (TDD-NNN) — the engineering-drawing blog format. Covers content structure, interactive demos, RFI config, card art, capture chain, and the verification checklist. Use when asked to write a blueprint post, add a TDD drawing, or extend the Blueprint series.
---

# Shipping a Blueprint Deep Dive post

A Blueprint Deep Dive renders a technical explainer as an engineering drawing. Format contract, in order of authority: the three shipped posts (`src/content/blog/the-transformer`, `the-embedding-space`, `the-rag-pipeline`), the component APIs in `src/components/blueprint/`, and `BLUEPRINT-STRATEGY.md` (planned subjects TDD-005–008, SEO targets, outlines). CLAUDE.md writing rules apply to every sentence; "Blueprint Deep Dive" as the series name is the only permitted "deep dive".

## Files a new post touches

| File | What |
|---|---|
| `src/content/blog/<slug>/metadata.json` | Post metadata + `blogStyle: "blueprint"` + `blueprint` object |
| `src/content/blog/<slug>/page.mdx` | The drawing |
| `src/components/blueprint/demos-<topic>.tsx` | New interactives (`'use client'`, zero deps) |
| `src/components/blueprint/index.ts` | Export the new demos |
| `src/lib/blueprint/rfi-configs.ts` | `'tdd-NNN'` entry — system prompt for the RFI chat |
| Previous post's `metadata.json` | Update its `blueprint.nextDrawing` to point at this post |

## metadata.json shape

```json
{
  "title": "The Tokenizer",
  "author": "Zachary Proser",
  "date": "YYYY-MM-DD",
  "description": "SEO description targeting the query family.",
  "image": "https://zackproser.b-cdn.net/images/blueprint-<slug>-hero.webp",
  "tags": ["AI", "..."],
  "blogStyle": "blueprint",
  "blueprint": {
    "number": "004",
    "subject": "TOKENIZATION",
    "readTime": "15 MIN",
    "eyebrow": "Masthead eyebrow line",
    "subtitle": "Serif-italic dek under the H1.",
    "rfiSuggestions": ["Three sharp questions", "...", "..."],
    "nextDrawing": { "number": "005", "title": "...", "subject": "...", "status": "planned" }
  }
}
```

`readTime`: body words / 230, rounded to a 5-minute step. `nextDrawing.status`: `planned` | `in-production` | `issued`; it renders on the series-capture card, so keep it current across the chain.

## page.mdx structure

1. Imports from `'@/components/blueprint'` + `export const metadata = createMetadata(rawMetadata)`.
2. `<BpAnchor id="s0" num="00" label="Abstract" />` then 2–3 abstract paragraphs (first paragraph gets the drop cap).
3. Eight sheets: `<BpSection id="s1..s8" num="01..08" label="Rail label" sheet="SHEET N OF 8" title="..." />`. Ids `s0–s8` only — `refs` and `s9` are reserved (references appendix and RFI desk).
4. Per sheet as needed: prose (~3,000 words total), `<BpNote>` margin notes (own block, immediately after the paragraph they annotate), `<BpFigure caption="FIG. N — CAPS.">` SVG line art (camelCase attrs, `bp-svg-t*` text classes, `bp-dash*` animated dashes), `<BpEquation tag="EQ. N.1">`, `<BpQA q="Plain question?">answer</BpQA>` (3–5 per post, placed at from-zero stall points), interactive demos.
5. History of the technique woven into early sheets, with named sources in margin notes.
6. `<BpReferences drawingCode="TDD-NNN" items={[{ label, href }]} />` last — 7–9 sources. Only certain citations; verify every link resolves and the page title matches the label before shipping (publisher DOIs may 403 for bots — verify the DOI string itself). A wrong link is worse than none.
7. Internal links: one to the paired `/demos/*` page, plus 2–3 sibling drawings/posts with descriptive anchors.

## Interactive demos

Client components in `demos-<topic>.tsx`: hardcoded deterministic data, real algorithm over toy inputs, `({ fig = N }: { fig?: number } = {})` prop for the caption number, existing CSS classes (`bp-attn-chip`, `bp-slider-label`, `bp-scroll-x`), keyboard access (preventDefault on Space for `role="button"`), and an ILLUSTRATIVE/NOT-A-BENCHMARK disclaimer in the footer when data is hand-made. Wide bodies get a `bp-scroll-x` wrapper with an inner `minWidth`.

## RFI config

Add to `RFI_CONFIGS` in `src/lib/blueprint/rfi-configs.ts`: `drawingCode`, `title`, `path`, a per-sheet `drawingSummary` (one dense line per §, mirroring what the post actually says — the model answers ONLY from this), and 12–15 glossary `terms`.

## Card art

```
npm run blueprint:art -- --slug <slug>          # og + dark hero + light hero → scripts/blueprint/out/
npm run blueprint:art:upload -- --slug <slug>   # PUT to Bunny + purge edge cache
```

Art reads title/subtitle/number/readTime from metadata.json — regenerate and re-upload whenever those change. The blog index swaps hero variants by theme via the `-hero.webp` / `-hero-light.webp` naming convention.

## Delegation pattern

Content drafting delegates well to sol (`codex exec -m gpt-5.6-sol --sandbox workspace-write ... - < brief.md`, backgrounded): give it the canon posts to read, the strategy outline, the files it may touch, and the hard rules; keep layout/CSS/route files off-limits. Review its output yourself — especially citations (fetch and title-match every link) and banned words.

## Verify before commit (all required)

1. `npx tsc --noEmit` — no new errors.
2. `npm run build` — passes (restart any dev server with `rm -rf .next` afterward; a build corrupts a running dev server's cache).
3. Page renders at `/blog/<slug>`: masthead, rail (viewport >1460px), figures numbered sequentially including demo figs, references as APPENDIX A, RFI desk as APPENDIX B, capture card advertising `nextDrawing`.
4. Banned-word grep over the new prose (see CLAUDE.md list).
5. Every reference link fetched and title-matched.
6. Previous drawing's `nextDrawing` updated; this post's `nextDrawing` points at the next planned subject.
7. All new files staged (metadata.json, page.mdx, demos, rfi-configs, index.ts).
