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
6. Bidirectional citations (`makeCitations`). Right after `export const metadata = ...`, declare the source list once: `export const { Cite, References } = makeCitations([{ id, label, href }, …])` — 7–9 sources, ordered by FIRST APPEARANCE in the body so inline numbers ascend. In the body, mark the first point each source informs the text with `<Cite id="author-year" />` (a superscript `[n]` that jumps down to the reference). End the post with `<References drawingCode="TDD-NNN" />` (pass `letter="B"` when an RFP desk takes appendix A) — it renders the numbered appendix, each entry anchored and carrying a `↩` back to its inline marker. Numbers derive from array order, so reordering sources renumbers everything and no body edit is needed. Only certain citations; a wrong link is worse than none. (The older `<BpReferences items={[…]} />` component still exists for reference but new posts use `makeCitations`.)
7. Internal links: one to the paired `/demos/*` page, plus 2–3 sibling drawings/posts with descriptive anchors.

### Verify citations before shipping (required)

`npm run verify:citations -- --slug <slug>` (or `--all`) fetches every cited URL and fails on dead links and arXiv/ACL title mismatch; publisher DOIs that bot-block (403/429) are reported UNVER, not failed — eyeball those by hand. It also checks the bidirectional wiring: a `<Cite id>` with no matching source in `makeCitations` is a FAIL (broken jump link); a source never cited inline is a note (place a marker, or leave it as deliberate further reading). Prefer a free author-hosted PDF over a paywalled DOI when one exists (e.g. BM25, RRF); keep DOIs only when no free canonical host exists (Harris 1954, Bradley-Terry 1952). Run this in the pre-commit gate alongside `npm run build`.

## Interactive demos

Client components in `demos-<topic>.tsx`: hardcoded deterministic data, real algorithm over toy inputs, `({ fig = N }: { fig?: number } = {})` prop for the caption number, existing CSS classes (`bp-attn-chip`, `bp-slider-label`, `bp-scroll-x`), keyboard access (preventDefault on Space for `role="button"`), and an ILLUSTRATIVE/NOT-A-BENCHMARK disclaimer in the footer when data is hand-made. Wide bodies get a `bp-scroll-x` wrapper with an inner `minWidth`.

## Conversion posts

For drawings whose goal is a booking rather than subscriptions (e.g. TDD-005 The Workshop), place `<BlueprintRfpDesk drawingCode="TDD-NNN" />` after the last sheet's prose and before `<BpReferences>`. It renders APPENDIX C — RFP DESK (an embedded commission form posting to `/api/consultation`) and registers itself on the rail. The newsletter NEXT SHEET card still renders after the RFI desk.

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

## Issuing the drawing (after deploy — this is what the capture card promises)

Blueprint signups land in the General Resend audience with an `interest:blueprint-series` Topic opt-in (topics auto-create on first use; the welcome-v1 automation receives the tag on its trigger event and can branch on it). When a new drawing deploys:

1. `npm run blueprint:issue-email -- --slug <slug>` → drawing-styled broadcast HTML in `scripts/blueprint/out/` + suggested subject.
2. Resend dashboard → Broadcasts → new broadcast → audience **General**, topic **interest:blueprint-series** → paste HTML → send test → send. The `{{{RESEND_UNSUBSCRIBE_URL}}}` merge tag in the footer must resolve in the test.
3. Update the PREVIOUS post's `nextDrawing.status` to `issued`.

Skipping this step breaks the NEXT SHEET card's promise — treat it as part of publishing, not marketing.

## Verify before commit (all required)

1. `npx tsc --noEmit` — no new errors.
2. `npm run build` — passes (restart any dev server with `rm -rf .next` afterward; a build corrupts a running dev server's cache).
3. Page renders at `/blog/<slug>`: masthead, rail (viewport >1460px), figures numbered sequentially including demo figs, references as APPENDIX A, RFI desk as APPENDIX B, capture card advertising `nextDrawing`.
4. Banned-word grep over the new prose (see CLAUDE.md list).
5. Every reference link fetched and title-matched.
6. Previous drawing's `nextDrawing` updated; this post's `nextDrawing` points at the next planned subject.
7. All new files staged (metadata.json, page.mdx, demos, rfi-configs, index.ts).
