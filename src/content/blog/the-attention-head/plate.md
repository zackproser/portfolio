# Circuit Tracing Field Sheet

Drawing: TDD-010  
Artifact: BP-010 — Circuit Tracing Field Sheet  
Format: A1 poster + editable worksheet

## Claim-strength ladder

| Layer | Question | Minimum record | Claim supported |
|---|---|---|---|
| 1 — Pattern | Where does information appear to move? | Model revision, exact prompt/token IDs, layer/head, attention row, selection rule | “This head attends in a prefix-matching pattern on these inputs.” |
| 2 — Attribution | What vocabulary directions does the component write? | Component output, readout convention, target token, logit contribution, comparison set | “This component contributes toward copying this token under this readout.” |
| 3 — Intervention | Does the behavior depend on the component? | Clean/control inputs, intervention site, replacement value, metric before/after, controls | “Under this intervention, this component is causally implicated in this measured behavior.” |

Pattern < attribution < intervention. Each rung answers a different question; retain the lower-rung evidence when advancing the claim.

## QK and OV circuit ledger

| Operation | Input shape | Weight shape | Output shape | Recorded meaning |
|---|---|---|---|---|
| Residual stream | `[batch, position, d_model]` | — | `[batch, position, d_model]` | Shared communication channel |
| Query projection | `[b, p, d_model]` | `[d_model, d_head]` | `[b, p, d_head]` | What the destination position seeks |
| Key projection | `[b, p, d_model]` | `[d_model, d_head]` | `[b, p, d_head]` | What each source position advertises |
| QK scores | `Q, K` | — | `[b, head, query, key]` | Routing scores before/after mask and softmax |
| Value projection | `[b, p, d_model]` | `[d_model, d_head]` | `[b, p, d_head]` | Content available to move |
| Weighted values | `attention, V` | — | `[b, p, d_head]` | Routed content per head |
| Output projection | `[b, p, d_head]` | `[d_head, d_model]` | `[b, p, d_model]` | Head write into the residual stream |
| Vocabulary readout | `[b, p, d_model]` | `[d_model, vocabulary]` | `[b, p, vocabulary]` | Token-direction contribution under the stated normalization convention |

## Intervention checklist

- [ ] Pin model ID, weight revision, tokenizer revision, library versions, device, dtype, and seed.
- [ ] Store the visible prompt, token IDs, decoded tokens, active position, and target token.
- [ ] Define the behavior metric before inspecting heads.
- [ ] State how candidates are selected and how many are screened.
- [ ] Save the attention pattern independently of the behavior score.
- [ ] State the attribution readout, including layer normalization treatment.
- [ ] Choose the intervention: zero ablation, mean ablation, resampling, activation patch, or path patch.
- [ ] Record the exact hook site and tensor slice.
- [ ] Compare clean, corrupted, and intervention runs where the hypothesis requires them.
- [ ] Run negative-control heads and prompt variants.
- [ ] Report effect direction, magnitude, variance, and failed cases.
- [ ] Narrow the written claim to the tested model, prompts, positions, and metric.

## Blank experiment record

| Field | Record |
|---|---|
| Date / operator | |
| Model ID / revision | |
| Tokenizer / revision | |
| Framework / version | |
| Device / dtype / seed | |
| Prompt and token IDs | |
| Clean input / control input | |
| Active position / target | |
| Candidate component | |
| Candidate-selection rule | |
| Pattern metric / result | |
| Attribution method / result | |
| Intervention site / replacement | |
| Behavior metric before / after | |
| Negative controls | |
| Prompt variants | |
| Failed or contrary cases | |
| Claim supported | |
| Claim explicitly unsupported | |
