#!/usr/bin/env python3
"""Export a small, inspectable GPT-2 induction-head experiment.

The script selects heads by two preregistered attention scores over repeated-token
prompts, then runs the demo prompt under every combination of three zero ablations.
It writes rounded, browser-sized JSON; it does not train or modify the model.
"""

from __future__ import annotations

import hashlib
import json
import platform
from datetime import date
from pathlib import Path

import torch
import transformers
from transformers import AutoModelForCausalLM, AutoTokenizer


MODEL_ID = "openai-community/gpt2"
PROMPTS = [
    " A B C D E F G H A B C D E F G H",
    " one two three four five six seven eight one two three four five six seven eight",
    " red blue green gold black white orange purple red blue green gold black white orange purple",
]
OUT_PATH = Path("src/components/blueprint/data/induction-gpt2.json")
SCRIPT_PATH = Path(__file__)
CACHE_DIR = Path("scripts/blueprint/out/huggingface-cache")


def rounded(values, digits=5):
    return [round(float(value), digits) for value in values]


def tokenized_cycle(tokenizer, prompt):
    ids = tokenizer(prompt, return_tensors="pt").input_ids
    if ids.shape[1] % 2 or not torch.equal(ids[0, : ids.shape[1] // 2], ids[0, ids.shape[1] // 2 :]):
        raise ValueError(f"Prompt does not tokenize into two equal cycles: {prompt!r}")
    return ids


def induction_score(attn, cycle):
    # During the second cycle, position cycle+j should attend to first-cycle j+1.
    pairs = [(cycle + j, j + 1) for j in range(cycle - 1)]
    return float(torch.stack([attn[q, k] for q, k in pairs]).mean())


def previous_token_score(attn):
    return float(torch.diagonal(attn, offset=-1).mean())


def main():
    torch.manual_seed(0)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, revision="main", cache_dir=CACHE_DIR)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        revision="main",
        cache_dir=CACHE_DIR,
        attn_implementation="eager",
    )
    model.eval()

    encoded = [tokenized_cycle(tokenizer, prompt) for prompt in PROMPTS]
    all_attentions = []
    with torch.inference_mode():
        for ids in encoded:
            output = model(ids, output_attentions=True, use_cache=False)
            all_attentions.append([layer[0].cpu() for layer in output.attentions])

    n_layers = len(all_attentions[0])
    n_heads = all_attentions[0][0].shape[0]
    induction_scores = {}
    previous_scores = {}
    for layer in range(n_layers):
        for head in range(n_heads):
            key = (layer, head)
            induction_scores[key] = sum(
                induction_score(prompt_attn[layer][head], ids.shape[1] // 2)
                for prompt_attn, ids in zip(all_attentions, encoded)
            ) / len(encoded)
            previous_scores[key] = sum(
                previous_token_score(prompt_attn[layer][head]) for prompt_attn in all_attentions
            ) / len(encoded)

    pattern_ranking = sorted(induction_scores, key=induction_scores.get, reverse=True)

    def mean_copying_score(logits, ids):
        cycle = ids.shape[1] // 2
        candidates = ids[0, :cycle]
        scores = []
        for offset in range(cycle - 1):
            query = cycle + offset
            target = int(ids[0, offset + 1])
            alternatives = candidates[candidates != target]
            scores.append(logits[0, query, target] - logits[0, query, alternatives].mean())
        return float(torch.stack(scores).mean())

    def logits_with_head_ablation(ids, layer, head):
        def hook(_module, inputs):
            hidden = inputs[0].clone()
            head_size = hidden.shape[-1] // n_heads
            hidden[..., head * head_size : (head + 1) * head_size] = 0
            return (hidden,) + inputs[1:]

        handle = model.transformer.h[layer].attn.c_proj.register_forward_pre_hook(hook)
        with torch.inference_mode():
            logits = model(ids, use_cache=False).logits
        handle.remove()
        return logits

    with torch.inference_mode():
        baseline_logits = [model(ids, use_cache=False).logits for ids in encoded]
    baseline_copying = [mean_copying_score(logits, ids) for logits, ids in zip(baseline_logits, encoded)]
    ablation_drops = {}
    # Screen the 24 strongest pattern candidates. A positive drop means ablation
    # reduced copying across the prompt set.
    for layer, head in pattern_ranking[:24]:
        ablated = [
            mean_copying_score(logits_with_head_ablation(ids, layer, head), ids)
            for ids in encoded
        ]
        ablation_drops[(layer, head)] = sum(
            before - after for before, after in zip(baseline_copying, ablated)
        ) / len(encoded)
    supportive = [
        key
        for key in pattern_ranking[:24]
        if key[0] > 0 and induction_scores[key] >= 0.10 and ablation_drops[key] > 0
    ]
    if not supportive:
        raise RuntimeError("No causally supportive candidate among the 24 strongest pattern heads")
    induction_head = max(supportive, key=ablation_drops.get)
    display_heads = [induction_head] + [key for key in pattern_ranking if key != induction_head][:2]
    eligible_previous = [key for key in previous_scores if key[0] < induction_head[0]]
    if not eligible_previous:
        eligible_previous = list(previous_scores)
    previous_head = max(eligible_previous, key=previous_scores.get)

    demo_ids = encoded[0]
    demo_tokens = tokenizer.convert_ids_to_tokens(demo_ids[0])
    cycle = demo_ids.shape[1] // 2
    candidate_ablated_logits = logits_with_head_ablation(
        demo_ids, induction_head[0], induction_head[1]
    )
    position_drops = []
    for offset in range(cycle - 1):
        query = cycle + offset
        target = int(demo_ids[0, offset + 1])
        alternatives = demo_ids[0, :cycle][demo_ids[0, :cycle] != target]
        before = baseline_logits[0][0, query, target] - baseline_logits[0][0, query, alternatives].mean()
        after = candidate_ablated_logits[0, query, target] - candidate_ablated_logits[0, query, alternatives].mean()
        position_drops.append(float(before - after))
    active_offset = max(range(cycle - 1), key=position_drops.__getitem__)
    active_position = cycle + active_offset
    target_position = active_offset + 1
    target_id = int(demo_ids[0, target_position])
    cycle_token_ids = [int(value) for value in demo_ids[0, 1:cycle]]

    captured = {}

    def capture_head_input(_module, inputs):
        captured["headInput"] = inputs[0].detach()

    def capture_final_residual(_module, inputs):
        captured["finalResidual"] = inputs[0].detach()

    layer, head = induction_head
    head_handle = model.transformer.h[layer].attn.c_proj.register_forward_pre_hook(capture_head_input)
    residual_handle = model.transformer.ln_f.register_forward_pre_hook(capture_final_residual)
    with torch.inference_mode():
        model(demo_ids, use_cache=False)
    head_handle.remove()
    residual_handle.remove()
    head_size = model.config.n_embd // n_heads
    head_slice = slice(head * head_size, (head + 1) * head_size)
    with torch.inference_mode():
        head_write = captured["headInput"][0, active_position, head_slice] @ model.transformer.h[layer].attn.c_proj.weight[head_slice, :]
        final_residual = captured["finalResidual"][0, active_position]
        final_scale = torch.sqrt(final_residual.var(unbiased=False) + model.transformer.ln_f.eps)
        frozen_ln_component = (head_write - head_write.mean()) / final_scale * model.transformer.ln_f.weight
        direct_logits = model.lm_head.weight @ frozen_ln_component
        direct_alternatives = torch.tensor([token_id for token_id in cycle_token_ids if token_id != target_id])
        direct_copy_attribution = direct_logits[target_id] - direct_logits[direct_alternatives].mean()

    def run(ablate_previous=False, ablate_induction=False, ablate_mlp=False):
        handles = []

        def head_pre_hook(head):
            def hook(_module, inputs):
                hidden = inputs[0].clone()
                head_size = hidden.shape[-1] // n_heads
                hidden[..., head * head_size : (head + 1) * head_size] = 0
                return (hidden,) + inputs[1:]

            return hook

        if ablate_previous:
            layer, head = previous_head
            handles.append(model.transformer.h[layer].attn.c_proj.register_forward_pre_hook(head_pre_hook(head)))
        if ablate_induction:
            layer, head = induction_head
            handles.append(model.transformer.h[layer].attn.c_proj.register_forward_pre_hook(head_pre_hook(head)))
        if ablate_mlp:
            layer = induction_head[0]

            def zero_mlp(_module, _inputs, output):
                return torch.zeros_like(output)

            handles.append(model.transformer.h[layer].mlp.register_forward_hook(zero_mlp))

        with torch.inference_mode():
            logits = model(demo_ids, use_cache=False).logits[0, active_position]
            probs = torch.softmax(logits, dim=-1)
        for handle in handles:
            handle.remove()
        alternatives = torch.tensor([token_id for token_id in cycle_token_ids if token_id != target_id])
        copying_score = logits[target_id] - logits[alternatives].mean()
        return {
            "targetLogit": round(float(logits[target_id]), 5),
            "targetProbability": round(float(probs[target_id]), 7),
            "copyingScore": round(float(copying_score), 5),
        }

    conditions = {}
    for previous in (True, False):
        for induction in (True, False):
            for mlp in (True, False):
                key = f"p{int(previous)}-i{int(induction)}-m{int(mlp)}"
                conditions[key] = run(not previous, not induction, not mlp)
    baseline = conditions["p1-i1-m1"]
    for result in conditions.values():
        result["targetLogitDelta"] = round(result["targetLogit"] - baseline["targetLogit"], 5)
        result["copyingScoreDelta"] = round(result["copyingScore"] - baseline["copyingScore"], 5)

    attention_heads = []
    for layer, head in display_heads:
        matrix = all_attentions[0][layer][head]
        attention_heads.append(
            {
                "layer": layer,
                "head": head,
                "meanInductionScore": round(induction_scores[(layer, head)], 5),
                "meanCopyingScoreDropUnderAblation": round(ablation_drops.get((layer, head), 0.0), 5),
                "activeRow": rounded(matrix[active_position, : active_position + 1]),
                "fullPattern": [rounded(row[: index + 1]) for index, row in enumerate(matrix)],
            }
        )

    revision = getattr(model.config, "_commit_hash", None) or "main (commit unavailable from config)"
    script_hash = hashlib.sha256(SCRIPT_PATH.read_bytes()).hexdigest()
    payload = {
        "provenance": {
            "kind": "real-model-export",
            "modelId": MODEL_ID,
            "revision": revision,
            "transformersVersion": transformers.__version__,
            "torchVersion": torch.__version__,
            "pythonVersion": platform.python_version(),
            "promptSet": PROMPTS,
            "generationDate": date.today().isoformat(),
            "exportScript": str(SCRIPT_PATH.relative_to(Path.cwd())),
            "exportScriptSha256": script_hash,
            "command": "scripts/blueprint/out/induction-venv/bin/python scripts/blueprint/export-induction.py",
            "selectionRule": "Screen the 24 heads with highest mean attention to the token after a matching prefix, retain candidates with mean pattern score ≥0.10 and a positive copying-score drop under zero ablation, then select the largest drop across all prompts. The previous-token head is the strongest mean t→t−1 head in an earlier layer.",
            "attribution": "Project the selected head result through its slice of c_proj, apply the intact run's final layer-normalization scale and gain, then dot with the tied unembedding. Bias is excluded.",
            "intervention": "Zero the selected head's pre-projection slice at every position; MLP ablation zeros the candidate layer MLP output.",
        },
        "modelShape": {"layers": n_layers, "headsPerLayer": n_heads, "modelWidth": model.config.n_embd},
        "demo": {
            "prompt": PROMPTS[0],
            "tokens": demo_tokens,
            "activePosition": active_position,
            "targetPosition": target_position,
            "targetToken": demo_tokens[target_position],
            "copyingScoreDefinition": "Target-token logit minus the mean logit of the other first-cycle continuation tokens.",
            "candidateInductionHead": {"layer": induction_head[0], "head": induction_head[1]},
            "candidatePreviousTokenHead": {"layer": previous_head[0], "head": previous_head[1]},
            "mlpLayer": induction_head[0],
            "attentionHeads": attention_heads,
            "previousTokenMeanScore": round(previous_scores[previous_head], 5),
            "candidateMeanCopyingScoreDropUnderAblation": round(ablation_drops[induction_head], 5),
            "directLogitAttribution": {
                "targetToken": round(float(direct_logits[target_id]), 5),
                "copyingScore": round(float(direct_copy_attribution), 5),
            },
            "conditions": conditions,
        },
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"wrote {OUT_PATH} ({OUT_PATH.stat().st_size} bytes)")
    print(f"induction head L{induction_head[0]}H{induction_head[1]} score={induction_scores[induction_head]:.5f}")
    print(f"previous head L{previous_head[0]}H{previous_head[1]} score={previous_scores[previous_head]:.5f}")
    print("screened pattern candidates:")
    for key in pattern_ranking[:24]:
        print(f"  L{key[0]}H{key[1]} pattern={induction_scores[key]:.5f} copying_drop={ablation_drops[key]:.5f}")
    print(json.dumps(conditions, indent=2))


if __name__ == "__main__":
    main()
