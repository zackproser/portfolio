# Inference Capacity Workbook

Drawing: TDD-011  
Artifact: BP-011 — Inference Capacity Workbook  
Format: A2 poster + editable workbook · PDF

## Memory ledger

Record binary units consistently: 1 GiB = 2^30 bytes and 1 MiB = 2^20 bytes.

### Weight memory

`weight bytes = parameter count × stored bytes per parameter + quantization metadata bytes`

| Field | Symbol | Value |
|---|---|---|
| Parameter count | P | ____ parameters |
| Stored precision | b_w | ____ bytes/parameter |
| Scale / zero-point / packing overhead | M_meta | ____ GiB |
| Weight memory | M_weights | ____ GiB |

### KV-cache memory

`KV bytes/request = 2 × layers × KV heads × head dimension × sequence tokens × KV bytes/element`

| Field | Symbol | Value |
|---|---|---|
| Layers | L | ____ |
| KV heads | H_kv | ____ |
| Head dimension | d_h | ____ elements/head |
| Prompt + generated sequence | S | ____ tokens |
| KV precision | b_kv | ____ bytes/element |
| Concurrent resident sequences | N | ____ requests |
| KV bytes per token | 2LH_kvd_hb_kv | ____ bytes/token |
| KV memory per request | M_KV,1 | ____ GiB |
| Total live KV memory | N × M_KV,1 | ____ GiB |

### Worked example

Assumptions: 7,000,000,000 parameters; BF16 weights; 32 layers; 8 KV heads; head dimension 128; BF16 KV; 4,096 tokens/request; 16 resident requests; 3.0 GiB activation/runtime reserve; 10% safety reserve; one 40 GiB device.

| Ledger line | Arithmetic | Result |
|---|---|---:|
| Weights | 7,000,000,000 parameters × 2 bytes/parameter | 13.04 GiB |
| KV per token | 2 × 32 layers × 8 heads × 128 elements/head × 2 bytes/element | 131,072 bytes/token = 128 KiB/token |
| KV per request | 131,072 bytes/token × 4,096 tokens | 0.50 GiB/request |
| KV for 16 requests | 0.50 GiB/request × 16 requests | 8.00 GiB |
| Activation/runtime reserve | measured or budgeted separately | 3.00 GiB |
| Subtotal | 13.04 + 8.00 + 3.00 GiB | 24.04 GiB |
| Safety reserve | 40 GiB × 10% | 4.00 GiB |
| Uncommitted after reserve | 40 − 24.04 − 4.00 GiB | 11.96 GiB |

## Concurrency envelope

`N_max = floor((M_device − M_weights − M_runtime − M_safety) / M_KV,request)`

The memory ceiling is necessary, not sufficient. Check latency and compute limits with measured traffic.

| Prompt p95 (tokens) | Output p95 (tokens) | KV/request (GiB) | Memory ceiling N | Tested N | p95 TTFT (ms) | p95 ITL (ms/token) | Goodput (req/s) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ | ____ | ____ | ____ | ____ |

## Quantization decision record

| Decision row | Baseline | Candidate | Evidence / acceptance boundary |
|---|---|---|---|
| Weight format | ____ | ____ | Model bytes: ____ → ____ |
| Activation format | ____ | ____ | Kernel/hardware support: ____ |
| KV-cache format | ____ | ____ | KV bytes/token: ____ → ____ |
| Calibration corpus | ____ | ____ | Domain/language coverage: ____ |
| Quality | metric ____ / score ____ | score ____ | Maximum accepted delta: ____ |
| TTFT | p50 ____ / p95 ____ ms | p50 ____ / p95 ____ ms | Accepted: ____ |
| ITL | p50 ____ / p95 ____ ms/token | p50 ____ / p95 ____ ms/token | Accepted: ____ |
| Throughput | ____ output tokens/s | ____ output tokens/s | Batch/concurrency: ____ |
| Operational cost | baseline image/kernel | scales, packing, fallback | Owner and rollback: ____ |

## Latency vocabulary

| Term | Start | Stop | Unit | Record |
|---|---|---|---|---|
| Queue delay | request accepted | execution admitted | ms | p50 ____ · p95 ____ · p99 ____ |
| TTFT | request accepted | first output token available | ms/request | p50 ____ · p95 ____ · p99 ____ |
| Inter-token latency | one output token available | next output token available | ms/token | p50 ____ · p95 ____ · p99 ____ |
| End-to-end latency | request accepted | final output token available | ms/request | p50 ____ · p95 ____ · p99 ____ |
| Throughput | measurement window start | window end | input/output tokens/s | ____ / ____ |
| Goodput | measurement window start | window end | requests/s meeting SLO | ____ |

Percentile population: ____  Window: ____  Warm-up: ____  Clock/source: ____

## Benchmark input record

- Model ID and revision: ____
- Tokenizer ID and revision: ____
- Weight / activation / KV precision: ____ / ____ / ____
- Engine and version: ____
- Kernel set and version: ____
- Accelerator model, count, memory, interconnect: ____
- Parallelism topology: ____
- Prompt-length distribution in tokens: p50 ____ · p95 ____ · max ____
- Output-length distribution in tokens: p50 ____ · p95 ____ · max ____
- Arrival process / rate / burst definition: ____
- Batch policy, token budget, preemption policy: ____
- KV block size and prefix-cache policy: ____
- Replicas and routing policy: ____
- SLO: TTFT ____ · ITL ____ · end-to-end ____
- Sample count, warm-up, duration, retries: ____
- Input/output token accounting convention: ____
- Quality evaluation and accepted delta: ____

## Incident checklist

### OOM

- [ ] Record exact device, process, model revision, engine version, and timestamp: ____
- [ ] Separate weights ____ GiB, runtime/activations ____ GiB, live KV ____ GiB, allocator reserve ____ GiB.
- [ ] Record resident sequences ____ and their token-length distribution ____.
- [ ] Check configured maximum tokens, maximum sequences, graph/workspace reserve, and parallelism: ____
- [ ] Determine whether failure occurred during model load, prefill, decode growth, or batch admission: ____
- [ ] Reduce one controlled limit, repeat the same input, and record result: ____
- [ ] Rollback / owner / follow-up: ____

### Queue growth

- [ ] Arrival rate ____ req/s; admission rate ____ req/s; completion rate ____ req/s.
- [ ] Queue depth p50 ____ / p95 ____ / max ____; oldest request age ____ ms.
- [ ] Prompt and output token distributions before/after onset: ____
- [ ] TTFT p50/p95/p99 ____ / ____ / ____ ms; ITL p50/p95/p99 ____ / ____ / ____ ms/token.
- [ ] Check long prefills, synchronized bursts, replica imbalance, retry amplification, and downstream backpressure: ____
- [ ] Apply admission control or load shedding boundary: ____
- [ ] Rollback / owner / follow-up: ____

### Cache fragmentation or thrash

- [ ] KV capacity ____ blocks; allocated ____; free ____; block size ____ tokens.
- [ ] Logical KV bytes ____ GiB; physical reserved KV bytes ____ GiB; waste ____%.
- [ ] Allocation failures, preemptions, evictions, recomputations, and prefix-cache hit rate: ____
- [ ] Sequence-length distribution and terminated-request cleanup delay: ____
- [ ] Compare block-table accounting with allocator/device telemetry: ____
- [ ] Repeat with one controlled block-size or cache-policy change: ____
- [ ] Rollback / owner / follow-up: ____
