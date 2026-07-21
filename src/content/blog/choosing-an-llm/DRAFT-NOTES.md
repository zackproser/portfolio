# DRAFT NOTES — "The Model Sheet" (choosing-an-llm)

Drafted 2026-07-21 (overnight), then **expanded 2026-07-21** into the comprehensive "mother of all model explainers." Still a draft, not shipped. Below: what exists, the decisions only you can make, and the checklist to ship.

## Expansion (2026-07-21) — what changed
Re-planned the 8 sheets so distillation, abliteration/merges, quantization, and Hugging Face sourcing each get dedicated depth, without losing the fit calculator, fit equation, testing, or selection procedure.

New/expanded 8-sheet outline (ids s0–s8, `sheet="SHEET N OF 8"`):
1. **s1 The name** — filename decomposed into fields (kept/tightened). FIG. 1.
2. **s2 Parameters + dense vs MoE** (kept, +paragraph on expert-count/shared-experts trend). FIG. 2.
3. **s3 Lineage + DISTILLATION** — NEW depth: pretraining→base→instruct/RLHF→reasoning, then distillation as first-class (teacher→student, soft targets, punches above param count, distilled reasoning models, `Distill` HF naming). FIG. 3 (teacher→student). Cites hinton-2015, sanh-2019.
4. **s4 Modification: ABLITERATION (+ merges/fine-tunes)** — NEW own sheet: refusal-direction mechanism (Arditi 2024), uncensored vs abliterated vs merge, SLERP/task-arithmetic merges, calibration cost, provenance/responsibility, huihui-ai. FIG. 4 (refusal direction).
5. **s5 QUANTIZATION** — deepened: FP16→Q8→…→Q2, bits-per-weight, k-quants (`_K`, `_S/_M/_L`), imatrix/`i1`, GGUF container + per-block scaling, KV-cache quant, weight-vs-activation quant, quality cliff, GPTQ/AWQ/GGUF (GPU vs local). FIG. 5 (ladder) + FIG. 6 (`QuantLadderDemo`, NEW interactive).
6. **s6 HUGGING FACE & sourcing** — deepened into a guide: Hub, org/repo namespace, model card (license+provenance), safetensors (pickle-safety) vs GGUF, quant providers (bartowski, unsloth, mradermacher, DavidAU, huihui-ai), split shards, mmproj (vision), gated repos, licenses ≠ open source. FIG. 7 (repo anatomy).
7. **s7 Fit & speed** — kept fit equation (now EQ. 7.1) + `ModelFitDemo` (now FIG. 8), +paragraph on prefill vs decode and concurrency.
8. **s8 Test + boundary** — merged personal-eval + procedure + local-vs-hosted. FIG. 9 (personal eval).

**Citations**: reordered `makeCitations` to first-appearance order; now **10** sources. Added `hinton-2015` (distillation, first at s3) and `sanh-2019` (DistilBERT). Order: hoffmann, shazeer, jiang, ouyang, hinton, sanh, arditi, dettmers-2022, frantar, dettmers-2023. `<References drawingCode="TDD-010" />` unchanged placeholder.

**Word count**: ~4,500 body words (script-measured, excludes figure captions/demo text). `readTime` set to `20 MIN`.

**Metadata**: broadened `description`, `subtitle`; added a `keywords` array (quantization, GGUF, k-quants, imatrix, GPTQ/AWQ, MoE, distillation, abliterated, Hugging Face, safetensors, local vs hosted, etc.); added an RFI suggestion about abliteration/distillation.

**Banned-word grep**: clean. **tsc**: my files clean (one pre-existing unrelated error in `src/lib/__tests__/resend-subscribe.test.ts`).

## What's here
- `metadata.json` — blueprint metadata, `blogStyle: blueprint`, broadened description/subtitle/keywords, `readTime: 20 MIN`.
- `page.mdx` — full 8-sheet drawing (~4,500 words), 7 SVG figures + 2 interactive figs, notes, 5 BpQA, 10 citations (`makeCitations`).
- `src/components/blueprint/demos-model-selection.tsx` — `ModelFitDemo` (fit & speed calculator) + `QuantLadderDemo` (NEW: size/quality/speed ladder inspector). Both real/illustrative arithmetic with ILLUSTRATIVE disclaimers. Exported from `blueprint/index.ts`.

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
    '§02 Parameters are capacity; the dense-vs-MoE split matters most locally — total params set memory fit, active params set generation speed; modern MoE uses many small experts + shared experts.',
    '§03 Training lineage: base completes, instruct/chat follow requests, reasoning thinks before answering; distillation transfers a large teacher into a smaller student via soft targets, so a distilled small model punches above its param count (Distill naming = student-then-teacher).',
    '§04 Modification of released weights: fine-tune specializes, merge blends tensors (SLERP/task arithmetic), abliteration removes the single refusal direction in activation space without retraining (Arditi 2024); uncensored/abliterated tags cost calibration; huihui-ai publishes many.',
    '§05 Quantization stores weights in fewer bits (FP16→Q8→Q2); bits-per-weight, k-quants (_K, _S/_M/_L), imatrix/i1 protect salient weights, GGUF = single container with per-block scales; quality holds then cliffs below ~Q3; GPTQ/AWQ for GPU, GGUF for local.',
    '§06 Models live as HF repos under an org namespace; read the card for license + provenance; safetensors (full precision, GPU/vLLM, pickle-safe) vs GGUF (quantized, local); quant providers bartowski/unsloth/mradermacher/DavidAU/huihui-ai; split shards, mmproj for vision, gated repos, licenses ≠ open source.',
    '§07 Fit = params×bits/8 + KV cache must sit inside usable memory; generation speed ≈ bandwidth ÷ bytes-read-per-token (active params only); prefill (compute-bound) vs decode (bandwidth-bound); concurrency raises throughput at cache cost.',
    '§08 Benchmarks leak into training; build a 10–30 prompt personal eval scored pass/fail with tok/s and cost. Procedure: define task+constraints, shortlist by spec, quantize to fit, test on your eval, deploy, keep the eval; local ceiling is the largest capable model that fits, hosted buys the frontier.',
  ],
  terms: [
    'parameters', 'dense model', 'mixture of experts', 'active parameters', 'base model',
    'instruction tuning', 'reasoning model', 'distillation', 'abliterated', 'merge',
    'quantization', 'bits per weight', 'k-quant', 'imatrix', 'GGUF', 'safetensors',
    'GPTQ', 'AWQ', 'KV cache', 'memory bandwidth', 'context window',
  ],
},
```

## Source material
Everything here is drawn from a real session standing up local inference on an M5 Max (128GB): quantization ladders, MoE vs dense fit/speed math, instruction-tuned vs reasoning behavior (a "thinking" model returning empty answers under a small token cap), abliterated/uncensored merges, GGUF sourcing and quant providers, and the GLM-4.5-Air fit calculation. The `ModelFitDemo` presets mirror models actually tested.
