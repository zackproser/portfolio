# DRAFT NOTES — "The Model Sheet" (choosing-an-llm)

Drafted 2026-07-21 (overnight). This is a **complete draft**, not shipped. Below: what exists, the decisions only you can make, and the checklist to ship.

## What's here
- `metadata.json` — blueprint metadata, `blogStyle: blueprint`.
- `page.mdx` — full 8-sheet drawing (~2,900 words), 4 SVG figures, notes, 3 BpQA, 8 citations (`makeCitations`), one interactive.
- `src/components/blueprint/demos-model-selection.tsx` — `ModelFitDemo`, a fit & speed calculator (real arithmetic; ILLUSTRATIVE disclaimer). Exported from `blueprint/index.ts`.

## Decisions you own (I could not make these)
1. **Number + placement.** I used `"number": "010"` as a **placeholder**. This subject is NOT in `BLUEPRINT-STRATEGY.md` (004 Tokenizer in-production; 005–008 planned; 009 tentatively "The Adapter/LoRA"). Decide where it slots, set the real number everywhere (`metadata.json` number, `<References drawingCode="TDD-0NN">`, the RFI `drawingCode`), and wire the `nextDrawing` chain: point the previous drawing's `nextDrawing` at this one, and set this one's `nextDrawing` at whatever follows. Right now it tentatively points to "The Adapter".
2. **Title + slug.** Proposed title **"The Model Sheet"** (subject `MODEL SELECTION`), slug `choosing-an-llm` (chosen for SEO over an on-brand `the-model-sheet`). Rename either if you prefer.

## Ship checklist (from the blueprint-post skill)
- [ ] Paste the RFI config below into `RFI_CONFIGS` (`src/lib/blueprint/rfi-configs.ts`).
- [ ] `npm run blueprint:art -- --slug choosing-an-llm` then `:art:upload` (hero + og). Hero image path in metadata assumes `blueprint-the-model-sheet-hero.webp` — regenerate to match the final slug/title.
- [ ] `npm run verify:citations -- --slug choosing-an-llm` (8 arXiv links; all should title-match).
- [ ] `npx tsc --noEmit` and `npm run build` — zero errors.
- [ ] Banned-word grep over the new prose (I ran it while drafting; re-check after any edits).
- [ ] Update the previous drawing's `nextDrawing.status`/target once placement is decided.

## RFI config to paste (adjust drawingCode/path to final number+slug)
```ts
{
  drawingCode: 'TDD-010',
  title: 'The Model Sheet',
  path: '/blog/choosing-an-llm',
  drawingSummary: [
    '§01 A model name is a compressed spec sheet — family, domain, params, training stage, quantization, format; leaderboard rank is a weak prior, the fields are the decision.',
    '§02 Parameters are capacity; the dense-vs-MoE split matters most locally — total params set memory fit, active params set generation speed.',
    '§03 Post-training stage shapes behavior: base completes, instruct/chat follow requests, reasoning thinks before answering, abliterated has its refusal direction removed.',
    '§04 Quantization stores weights in fewer bits (Q8→Q2); size and speed improve down the ladder, quality holds then falls off a cliff below ~Q3.',
    '§05 Fit = params×bits/8 + KV cache must sit inside usable memory; generation speed ≈ bandwidth ÷ bytes-read-per-token (active params only).',
    '§06 Models live as HF repos; safetensors (full precision, GPU/vLLM) vs GGUF (quantized, local); read the card for license and merge/abliteration provenance.',
    '§07 Benchmarks measure someone else\'s task and leak into training; build a 10–30 prompt personal eval scored pass/fail with tok/s and cost recorded.',
    '§08 Procedure: define task+constraints, shortlist by spec, quantize to fit, test on your eval, deploy; local ceiling is the largest capable model that fits, hosted buys the frontier.',
  ],
  terms: [
    'parameters', 'dense model', 'mixture of experts', 'active parameters', 'base model',
    'instruction tuning', 'reasoning model', 'abliterated', 'quantization', 'bits per weight',
    'GGUF', 'safetensors', 'KV cache', 'memory bandwidth', 'context window',
  ],
},
```

## Source material
Everything here is drawn from a real session standing up local inference on an M5 Max (128GB): quantization ladders, MoE vs dense fit/speed math, instruction-tuned vs reasoning behavior (a "thinking" model returning empty answers under a small token cap), abliterated/uncensored merges, GGUF sourcing and quant providers, and the GLM-4.5-Air fit calculation. The `ModelFitDemo` presets mirror models actually tested.
