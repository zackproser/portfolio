## Benchmark Design Pack

### 1. Decision and task specification

- Decision this evaluation supports: ____
- Candidate systems and versions: ____
- Users, workflow, and environment: ____
- Acceptable failure cost: ____
- Required quality threshold: ____
- Budget per completed task: ____
- p50 / p95 latency limit: ____ / ____

| Field | Specification |
|---|---|
| Input available to the system | ____ |
| Allowed tools and context | ____ |
| Required output | ____ |
| Success condition | ____ |
| Exclusions | ____ |

### 2. Sampling plan

- Target population of tasks: ____
- Sampling frame and date: ____
- Sampling unit: ____
- Stratification variables: ____
- Planned sample size: ____
- Repeat runs per item: ____
- Missing / invalid item policy: ____

| Slice | Population share | Sample count | Minimum acceptable result |
|---|---:|---:|---:|
| ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ |

### 3. Scorer contract

- Scorer type: exact match / executable / human / model judge / ____
- Scorer version and configuration: ____
- Normalization before scoring: ____
- Partial-credit rule: ____
- Timeout and flaky-test policy: ____
- Ties, abstentions, and invalid outputs: ____
- Human adjudication trigger: ____

### 4. Contamination register

| Item or source | Exposure route | Evidence | Risk | Action | Owner |
|---|---|---|---|---|---|
| ____ | ____ | ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ | ____ | ____ |

### 5. Confidence-interval prompts

- What is random: item sample / model run / judge / annotator / ____
- Estimand: ____
- Interval method: ____
- Confidence level: ____
- Dependence or clustering: ____
- Multiple-comparison adjustment: ____
- Minimum decision-relevant difference: ____

### 6. Failure-slice table

| Slice | n | Score | Interval | Failure mode | Severity | Example ID |
|---|---:|---:|---:|---|---|---|
| ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ | ____ | ____ | ____ |

### 7. Human-review rubric

| Criterion | 0 | 1 | 2 | Reviewer note |
|---|---|---|---|---|
| Correctness | ____ | ____ | ____ | ____ |
| Completeness | ____ | ____ | ____ | ____ |
| Evidence use | ____ | ____ | ____ | ____ |
| Safety / policy | ____ | ____ | ____ | ____ |

- Reviewer qualification: ____
- Blind assignment procedure: ____
- Calibration examples: ____
- Disagreement resolution: ____

### 8. Cost and latency record

| Candidate | Cost / task | p50 latency | p95 latency | Retry rate | Human minutes |
|---|---:|---:|---:|---:|---:|
| ____ | ____ | ____ | ____ | ____ | ____ |
| ____ | ____ | ____ | ____ | ____ | ____ |

## Reading a public leaderboard

- Score publication date: ____
- Benchmark version and split: ____
- Model checkpoint / API version: ____
- Prompt and few-shot format: ____
- Sampling settings and run count: ____
- Scorer and judge version: ____
- Aggregate and weighting rule: ____
- Sample size and uncertainty: ____
- Missing, excluded, or failed items: ____
- Contamination controls: ____
- Slice-level failures: ____
- Cost and latency at evaluation time: ____
- Decision this evidence can support: ____
- Evidence it cannot support: ____
