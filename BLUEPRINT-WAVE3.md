# Blueprint Deep Dive — Wave 3 strategy

Date: 2026-07-19  
Scope: TDD-010 through TDD-014

## Executive recommendation

Publish Wave 3 in this order:

1. **TDD-010 — The Attention Head** — Reproduce an induction head, then show the interventions required to turn an attractive attention map into a causal claim.
2. **TDD-011 — The Inference Engine** — Trace one request through prefill, KV allocation, continuous batching, PagedAttention, quantization, and the latency/throughput trade.
3. **TDD-012 — The Guard** — Draw prompt injection as a trust-boundary failure and give builders a testable defense architecture for tool-using agents.
4. **TDD-013 — The Diffusion Model** — Follow noise into an image through denoising, latent space, guidance, and the newer flow-matching path.
5. **TDD-014 — The Benchmark** — Show how a task becomes a score, how the score becomes misleading, and how to design an evaluation that can support a decision.

The order opens with a clear research credential, moves into production systems and security, reaches a visually oriented audience the site barely serves, and ends with a subject shared by researchers, data scientists, technical leaders, and students. Each post enters a different distribution network. Together they avoid turning Wave 3 into a second pass over RAG and agent fundamentals.

The three goals are weighted equally. Audience fit asks whether the post can enter a professional community that rarely visits zackproser.com today. Authority asks whether the drawing can reproduce or faithfully connect published results and carry those results into engineering practice. Capture asks whether the subject yields a separate artifact useful enough to earn an email address. Effort and drift are tie-breakers, not hidden fourth and fifth goals.

Search-demand statements in this report are directional. The repository contains no paid keyword-volume source. They reflect query breadth, recurring practitioner questions, the shape of current results, and likely distribution channels as of the report date.

## What the portfolio needs next

The corpus contains 167 indexable posts distributed as follows:

| Existing cluster | Posts |
|---|---:|
| RAG & retrieval | 23 |
| Voice & tools | 6 |
| AI-assisted development | 55 |
| Evals & fine-tuning | 9 |
| Infrastructure | 32 |
| Career & enablement | 42 |

The first five drawings reinforce transformers, embeddings, RAG, tokenization, and workshops. The queued TDD-006 through TDD-009 posts add vector databases, context windows, speech, and the agent loop. That sequence supplies a strong applied-LLM foundation. Wave 3 should use it as an internal-link base while putting work in front of communities with different home pages, conferences, newsletters, and social graphs.

The shipped format sets a useful quality bar: an abstract, eight numbered sheets, original schematics, equations where they clarify the mechanism, small client-side experiments, named failure lines, references, and an RFI desk. A Wave 3 subject must support a circuit a reader can inspect. A glossary article with blueprint styling does not qualify.

## Candidate scorecard

Scores run from 1 to 5. The first three columns correspond to the equally weighted goals. Capture measures the strength of the separate-artifact exchange. Effort and drift use Low, Medium, High, and Very high.

| Rank | Candidate | New audience | Research + applied authority | Capture | Effort | Drift | Wave 3 decision |
|---:|---|---:|---:|---:|---|---|---|
| 1 | The Attention Head | 5 | 5 | 5 | High | Medium | Publish TDD-010 |
| 2 | The Inference Engine | 5 | 5 | 4 | High | Medium | Publish TDD-011 |
| 3 | The Guard | 5 | 4 | 5 | Medium | High | Publish TDD-012 |
| 4 | The Diffusion Model | 5 | 5 | 5 | High | Medium | Publish TDD-013 |
| 5 | The Benchmark | 5 | 5 | 5 | Medium | Medium | Publish TDD-014 |
| 6 | The Reasoning Model | 4 | 5 | 4 | High | Very high | Hold |
| 7 | The Training Run | 4 | 5 | 5 | Very high | Low | Hold |
| 8 | The Data Mixture | 5 | 5 | 5 | High | Medium | Hold; added candidate |
| 9 | The Adapter | 3 | 4 | 4 | Medium | Low | Keep held |
| 10 | The Eval Harness | 3 | 4 | 5 | Medium | Medium | Keep held |
| 11 | The RLHF Loop | 4 | 5 | 4 | High | High | Hold |
| 12 | The Mixture of Experts | 4 | 5 | 4 | High | Medium | Hold |
| 13 | The Prompt | 5 | 2 | 5 | Low | Very high | Reject for Wave 3 |
| 14 | The Tool Call / MCP | 2 | 3 | 4 | Medium | High | Keep held |

## Candidate evaluations

### 1. The Attention Head — publish

- **Audience and arrival:** Mechanistic-interpretability researchers, alignment researchers, research engineers, ML students, and technically curious model builders. Likely routes are X research circles, Alignment Forum and LessWrong, Hacker News, The Gradient and Import AI-style newsletters, r/MachineLearning, paper-reading groups, and searches such as `induction heads explained`, `mechanistic interpretability attention heads`, `activation patching`, and `superposition explained`.
- **Authority mechanism:** Begin where The Transformer §04 ends. Reproduce the prefix-matching and copying behavior from [*In-context Learning and Induction Heads*](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html), connect it to [*Toy Models of Superposition*](https://transformer-circuits.pub/2022/toy_model/index.html), then show why attention visualization alone is weak evidence. The original citable object is a single circuit plate with three evidence layers: observed attention pattern, logit attribution, and a causal intervention or ablation. Publish the small prompt set, precomputed tensors, expected outputs, model/version record, and failed cases beside the drawing. That evidence package matters more than claiming a universal theory of in-context learning.
- **Demand:** Search volume is smaller than prompt engineering, but the audience links careful visual work. Induction heads, sparse features, activation patching, and circuit discovery recur in research discussion. A faithful replication can travel through citations and course reading lists long after launch day.
- **Gated artifact:** “Circuit Tracing Field Sheet,” an A1 poster plus a printable lab worksheet. It includes the QK and OV paths, the induction-head composition, intervention checklist, claim-strength ladder, tensor-shape ledger, and blank boxes for recording a reader’s own model, prompt, and ablation result.
- **Interactive:** A prepared token sequence such as `A B … A` exposes attention weights and next-token logits. Readers toggle the previous-token head, induction head, and MLP; patch one activation from a control prompt; and watch the copying score and loss change. All tensors ship as static JSON and all arithmetic runs locally.
- **Overlap and reinforcement:** It shares attention terminology with TDD-001 but owns a different question: how researchers infer a mechanism from trained activations. Link TDD-001 for Q/K/V mechanics and TDD-007 for context behavior. Keep sparse autoencoders as a boundary and later subject so the piece does not become an interpretability survey.
- **Effort and drift:** High effort. The replication, model licensing, tensor export, and causal language need expert review. Medium drift: methods will change, while the distinction between observation and intervention will remain useful.

### 2. The Inference Engine — publish

- **Audience and arrival:** ML platform engineers, inference engineers, GPU programmers, SREs running model endpoints, local-model operators, and engineering leaders buying serving capacity. Routes include Hacker News, r/LocalLLaMA, systems newsletters, MLOps Community, X infrastructure circles, conference Slack groups, and searches such as `LLM inference engine`, `PagedAttention explained`, `continuous batching`, `KV cache memory calculator`, and `LLM throughput vs latency`.
- **Authority mechanism:** Build the serving circuit from the [vLLM/PagedAttention paper](https://arxiv.org/abs/2309.06180), [FlashAttention](https://arxiv.org/abs/2205.14135), and [SmoothQuant](https://arxiv.org/abs/2211.10438). Show prefill and decode as different workloads; account separately for weights, activations, and KV state; and connect scheduling policy to time-to-first-token and inter-token latency. The citable object is a worked memory-and-time ledger whose variables, units, assumptions, and scheduling trace can be checked line by line.
- **Demand:** Model serving has durable purchase and debugging intent. Current answers are often vendor documentation, benchmark posts with incompatible assumptions, or isolated explainers for one optimization. A neutral end-to-end schematic can rank for the broad mechanism and earn links from teams explaining their own stacks.
- **Gated artifact:** “Inference Capacity Workbook,” delivered as a printable PDF and editable worksheet. It contains formulas for weight and KV memory, concurrency envelopes, quantization choices, latency vocabulary, benchmark-input fields, and a one-page incident checklist for OOM, queue growth, and cache fragmentation.
- **Interactive:** A request scheduler with fixed synthetic arrivals. Readers change prompt length, output length, memory, block size, batch policy, precision, and replica count. The diagram animates queue, prefill, decode, page allocation, evictions, and resulting p50/p95 latency. No runtime or model download is required.
- **Overlap and reinforcement:** It absorbs the KV-cache mechanics introduced in TDD-001 and expanded in queued TDD-007, then follows them into fleet-level scheduling. It strengthens the infrastructure cluster without repeating vector-database operations. TDD-009 supplies the workload; this drawing supplies the engine beneath it.
- **Effort and drift:** High effort because units and scheduling examples must be exact. Medium drift: engine features change quickly, while memory accounting, batching, bandwidth, and latency tradeoffs persist. Keep product benchmark tables outside the permanent sheets.

### 3. The Guard — publish

- **Audience and arrival:** Application-security engineers, red teamers, security architects, CISOs evaluating agent deployments, and platform teams that own permissions. Routes include OWASP and NIST-linked discussions, security newsletters, Hacker News, Black Hat and DEF CON circles, r/netsec, r/cybersecurity, X security researchers, and queries such as `prompt injection defense`, `indirect prompt injection`, `LLM agent security`, and `AI agent threat model`.
- **Authority mechanism:** Treat prompt injection as a trust-boundary and confused-deputy problem. Use the threat model and attack classes in [OWASP’s LLM guidance](https://owasp.org/www-project-top-10-for-large-language-model-applications/), NIST’s [agent-hijacking evaluation work](https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations), and the [AgentDojo benchmark](https://arxiv.org/abs/2406.13352). Draw the full route from hostile document to model context to privileged tool call. The citable plate maps each defense to the boundary it can affect and labels residual risk. It must say plainly that prompt text cannot create a dependable privilege boundary.
- **Demand:** Prompt injection remains the first question security teams ask about RAG and agents. The query family has urgent operational intent, current standards activity, and frequent demonstrations that travel on social channels. Most explainers stop at attack examples or generic advice; a testable architecture has a sharper reason to be cited.
- **Gated artifact:** “Agent Threat-Model Pack,” with a printable trust-boundary diagram, data/source inventory, tool-permission matrix, attack-tree worksheet, red-team test cases, and an evidence log for attack success and task utility. This is the strongest email exchange in the slate because a security review can use it directly.
- **Interactive:** A deterministic email-and-calendar agent receives a user task and a hostile message. Readers place defenses at source labeling, context assembly, policy checks, authorization, tool execution, and output handling. Each run reports task success, attack success, and blocked legitimate actions. Prepared cases prevent any live attack generation.
- **Overlap and reinforcement:** Queued TDD-009 explains how an agent acts; The Guard explains how untrusted content crosses that loop and where authority must stop. It also links naturally to the existing Autonomy Boundary and secure-RAG work. Keep model jailbreaks and content-policy evasion as a short distinction; the post owns application compromise and tool misuse.
- **Effort and drift:** Medium effort for the drawing and demo, with high editorial review requirements. Threat examples and standards names drift quickly; the trust-boundary model is stable. Date every benchmark result and avoid a “solved” defense claim.

### 4. The Diffusion Model — publish; reverse the prior rejection

- **Audience and arrival:** Image and video-generation creators, computer-vision engineers, creative technologists, ML researchers outside NLP, students, and people fine-tuning visual models. Routes include r/StableDiffusion, r/comfyui, YouTube and creator newsletters, X image-research circles, Hacker News, Hugging Face communities, and searches such as `diffusion model explained`, `how stable diffusion works`, `classifier free guidance`, `latent diffusion`, and `flow matching explained`.
- **Authority mechanism:** Draw a continuous lineage from [DDPM](https://arxiv.org/abs/2006.11239) through [classifier-free guidance](https://arxiv.org/abs/2207.12598), [latent diffusion](https://arxiv.org/abs/2112.10752), [Diffusion Transformers](https://arxiv.org/abs/2212.09748), and [Flow Matching](https://arxiv.org/abs/2210.02747). The original citable object is a coordinate-consistent comparison: the same two-dimensional toy distribution shown under forward noising, reverse denoising, latent compression, guidance, and a probability-flow path. Readers can see which pieces changed and which remained.
- **Demand:** This is the broadest clean break from the current audience. The topic has large evergreen educational intent and unusually strong visual sharing. Competition is strong, but many results either freeze the story at Stable Diffusion or explain one sampler. A mechanism-first drawing that includes the transition toward flow-based generation has a distinct editorial claim.
- **Gated artifact:** “Generative Image Process Poster,” an A1 print with the forward and reverse equations, noise schedule, U-Net/DiT and VAE roles, conditioning and guidance paths, sampler comparison, latent dimensions, and a contact sheet showing matched seeds across steps and guidance values.
- **Interactive:** A precomputed 2D point cloud is progressively noised and reconstructed. Controls change timestep, schedule, guidance strength, step count, and Euler versus a prepared alternative solver. A second tab reveals a tiny grayscale latent grid reconstructed from bundled arrays. The teaching model stays client-side and avoids image-model dependencies.
- **Overlap and reinforcement:** The transformer post supplies attention and DiT background; the embedding post supplies latent-space intuition. Otherwise this opens a new cluster rather than competing with shipped or queued pages. It can later feed image retrieval, multimodal models, and creative-tool reviews.
- **Effort and drift:** High visual and mathematical effort. Architecture drift is medium: named products and favored samplers move fast, while score-based generation, latent compression, conditioning, and flow matching provide a durable frame. The subtitle should mention diffusion and flow so the drawing remains honest as the field moves.

### 5. The Benchmark — publish

- **Audience and arrival:** Data scientists, ML evaluators, research engineers, technical PMs, engineering leaders, procurement teams, students, and journalists who interpret model claims. Routes include Hacker News, r/MachineLearning, r/datascience, AI evaluation newsletters, X benchmark discussions, course syllabi, and queries such as `how MMLU works`, `SWE-bench explained`, `Chatbot Arena methodology`, `LLM benchmark contamination`, and `how to evaluate an LLM`.
- **Authority mechanism:** Put three different instruments on one drawing: fixed-answer tasks such as [MMLU](https://arxiv.org/abs/2009.03300), executable repository tasks from [SWE-bench](https://arxiv.org/abs/2310.06770), and pairwise human preference from [Chatbot Arena](https://arxiv.org/abs/2403.04132). Show item sampling, prompt format, scorer, aggregation, uncertainty, contamination, and the decision a score is supposed to support. The original citable artifact is a “score provenance” diagram that lets a reader trace a leaderboard number back to tasks, versions, judges, exclusions, and variance.
- **Demand:** Benchmark releases repeatedly generate social attention, while the underlying queries remain evergreen. The reader pool extends past builders to anyone making a model-selection or roadmap decision. Search results often explain a named benchmark without comparing measurement contracts or showing how aggregation hides failures.
- **Gated artifact:** “Benchmark Design Pack,” an editable worksheet and PDF containing a task-spec template, sampling plan, scorer contract, contamination register, confidence-interval prompts, failure-slice table, human-review rubric, cost/latency fields, and a one-page checklist for reading public leaderboards.
- **Interactive:** Readers score the same prepared model outputs under exact match, unit tests, pairwise preference, and rubric judging. They can alter task weights, judge noise, sample size, and a contaminated subset, then watch the ranking reverse and confidence intervals widen. The demo uses fixed local data.
- **Overlap and reinforcement:** It complements TDD-003’s stage-level RAG metrics and the existing RAG-evaluation post. The queued Agent Loop supplies examples for agent benchmarks. Preserve The Eval Harness for internal regression infrastructure; The Benchmark owns measurement design and public claims.
- **Effort and drift:** Medium effort. The conceptual demo is simple, but the treatment of uncertainty and contamination needs care. Benchmark versions drift; the measurement pipeline, provenance record, and Goodhart failure are durable. Date every public score and avoid a “best model” table.

### 6. The Reasoning Model — hold for the next review

- **Audience and arrival:** ML researchers, reinforcement-learning practitioners, model-training teams, students, and heavy users comparing reasoning modes. Arrival would come from X research circles, Hacker News, r/MachineLearning, r/LocalLLaMA, AI research newsletters, and `reasoning model`, `test time compute`, `GRPO`, and `RL for reasoning` queries.
- **Authority mechanism:** Connect chain-of-thought prompting to verifier-guided search, process supervision, test-time allocation, and reinforcement learning using [*Scaling LLM Test-Time Compute Optimally*](https://arxiv.org/abs/2408.03314) and [DeepSeek-R1](https://arxiv.org/abs/2501.12948). A credible artifact would separate observed output traces from private internal reasoning and distinguish search, sampling, verification, distillation, and policy training. A small open-model replication with exact prompts, reward, and seeds would be required.
- **Demand:** Very high current attention and broad search interest. Much of it is release-driven, and “reasoning model” currently names several materially different systems.
- **Gated artifact:** A reasoning-method selection chart with task-verifiability axes, budget formulas, best-of-N and verifier worksheets, stopping rules, and an experiment log.
- **Interactive:** Allocate a fixed compute budget among longer generation, multiple samples, verifier scoring, and revision for prepared math and code tasks; plot success and cost from published or reproduced data.
- **Overlap and reinforcement:** Strong links to Transformer sampling, Context Window, Agent Loop, Benchmark, and RLHF. It risks becoming a current-model explainer rather than a lasting drawing.
- **Effort and drift:** High effort and very high drift. Closed providers reveal too little training detail for a faithful generic circuit, and visible chain-of-thought is a poor proxy for internal computation. Reconsider when Zack can publish a reproducible open-model experiment rather than a synthesis of vendor claims.

### 7. The Training Run — hold

- **Audience and arrival:** Pretraining researchers, ML engineers, MLOps teams, data engineers, technical leaders planning compute, and students. Channels include ML systems conferences, Hacker News, r/MachineLearning, r/learnmachinelearning, training-infrastructure newsletters, and `LLM training pipeline`, `scaling laws`, `Chinchilla scaling`, and `training loss curve` searches.
- **Authority mechanism:** Reproduce small scaling-law fits from [Kaplan et al.](https://arxiv.org/abs/2001.08361) and [Chinchilla](https://arxiv.org/abs/2203.15556), then connect data mixture, deduplication, tokenization, optimizer state, checkpointing, validation loss, and failure recovery. The citable object would be a complete run ledger with units and decision gates, backed by several small training runs and released logs.
- **Demand:** Broad educational demand and strong curriculum value. Social interest spikes around major training reports, while the general query remains useful.
- **Gated artifact:** A training-run planning workbook covering token budget, FLOPs, memory, data passes, checkpoints, evaluation cadence, loss anomalies, and a run postmortem template.
- **Interactive:** Fit power laws to bundled run data, allocate a fixed compute budget between parameters and tokens, and inject data or optimizer failures into a prepared loss curve.
- **Overlap and reinforcement:** It would connect Tokenizer, Transformer, Adapter, RLHF, and Benchmark. Its eight sheets could swallow The Data Mixture and much of The Adapter unless the scope is strict.
- **Effort and drift:** Very high effort, low conceptual drift. A toy run alone would weaken the authority claim; a serious series of controlled runs takes more production time than one Wave 3 slot permits.

### 8. The Data Mixture — hold; strongest added candidate

- **Audience and arrival:** Data-centric AI researchers, data engineers, dataset curators, ML governance teams, and students. Routes include Data-Centric AI circles, ML research newsletters, Hacker News, r/datasets, r/MachineLearning, and searches for `LLM training data mixture`, `data deduplication LLM`, `dataset contamination`, and `data quality scaling laws`.
- **Authority mechanism:** Trace source acquisition, licensing, filtering, deduplication, quality scoring, mixture weights, curriculum, and evaluation leakage. The research frame can use [The Pile](https://arxiv.org/abs/2101.00027), [Deduplicating Training Data Makes Language Models Better](https://arxiv.org/abs/2107.06499), and data-mixture optimization work such as [DoReMi](https://arxiv.org/abs/2305.10429). The citable plate would make every transformation and exclusion count auditable.
- **Demand:** Smaller head demand than diffusion or prompting, with high interest among researchers and policy-aware teams. Public argument about data provenance gives the subject recurring relevance.
- **Gated artifact:** A dataset card, provenance register, license/PII review sheet, deduplication audit, mixture experiment table, and contamination checklist.
- **Interactive:** Mix several tiny corpora, change filters and weights, inspect duplicate clusters and token distributions, then view prepared validation effects.
- **Overlap and reinforcement:** Strong upstream link to Tokenizer, Training Run, Benchmark, and RAG ingestion. It reaches a missing audience cleanly.
- **Effort and drift:** High effort and medium policy drift. It narrowly misses Wave 3 because five other topics create clearer social launches and more demonstrable mechanisms. It should lead Wave 4 if a real dataset audit or mixture experiment is available.

### 9. The Adapter — keep held

- **Audience and arrival:** Fine-tuning engineers, open-model builders, data scientists, students, and r/LocalLLaMA practitioners. Search and social routes include `LoRA explained`, `QLoRA`, `PEFT`, Hugging Face forums, fine-tuning newsletters, and notebook communities.
- **Authority mechanism:** Reproduce the low-rank update from [LoRA](https://arxiv.org/abs/2106.09685) and the memory accounting from [QLoRA](https://arxiv.org/abs/2305.14314). A citable plate would show matrix rank, trainable parameter count, optimizer memory, quantized base weights, adapter merge, and measured task change from a small released run.
- **Demand:** Durable practitioner intent, but the site already has a well-titled LoRA/QLoRA explainer, a Llama fine-tuning tutorial, an Alpaca dataset article, and an MLOps series. Wave 3 acquisition would come mainly from an existing cluster.
- **Gated artifact:** A PEFT experiment worksheet with rank/alpha/module selection, VRAM estimates, data checks, merge/deploy steps, and evaluation comparisons.
- **Interactive:** Apply rank-1 through rank-r approximations to a toy weight update and plot reconstruction error, trainable parameters, and memory.
- **Overlap and reinforcement:** Excellent links to Training Run and Inference Engine, with meaningful cannibalization risk against the existing LoRA post. A replication-first version can later become the canonical technical page.
- **Effort and drift:** Medium effort and low drift. Keep held because it scores well on authority and capture but weakly on reaching a new audience.

### 10. The Eval Harness — keep held

- **Audience and arrival:** Applied-AI engineers, quality engineers, agent builders, and platform teams. Channels include AI engineering newsletters, Hacker News, r/LocalLLaMA, framework communities, and `LLM eval harness`, `agent evals`, `prompt regression testing`, and `LLM as judge` queries.
- **Authority mechanism:** Reproduce a small task suite using the design of the [Language Model Evaluation Harness](https://arxiv.org/abs/2405.14782), then cover fixtures, deterministic and model-based scorers, repeated trials, slices, traces, thresholds, and CI decisions. The citable artifact would be a test-contract diagram tied to a public fixture set and expected results.
- **Demand:** Strong practitioner demand, narrower general interest, and strong official/framework documentation in current results.
- **Gated artifact:** An editable eval-spec pack with dataset schema, judge rubric, flaky-test policy, slice inventory, release threshold, cost budget, and regression report.
- **Interactive:** Run fixed outputs through exact, semantic, rubric, and pairwise scorers; alter thresholds and seeds; inspect false passes and false failures.
- **Overlap and reinforcement:** The Benchmark should establish measurement validity first. The Eval Harness can later own operational regression testing for RAG and agents without carrying MMLU, SWE-bench, or Arena history.
- **Effort and drift:** Medium effort and medium drift. Keep held until TDD-014 gives it a clean upstream distinction.

### 11. The RLHF Loop — hold

- **Audience and arrival:** Alignment researchers, post-training engineers, RL practitioners, data-labeling teams, and students. Routes include X research circles, r/MachineLearning, Alignment Forum, ML newsletters, and `RLHF explained`, `reward model`, `PPO for LLM`, and `DPO vs RLHF` queries.
- **Authority mechanism:** Draw supervised instruction tuning, preference collection, Bradley–Terry reward modeling, PPO with a KL penalty, and the different route taken by [DPO](https://arxiv.org/abs/2305.18290). Ground the lineage in [Learning to Summarize from Human Feedback](https://arxiv.org/abs/2009.01325). The citable object would be a matched-data comparison showing what each objective reads, updates, and can overfit.
- **Demand:** Large and durable educational interest. Terminology now bundles many preference-optimization methods under one familiar acronym, which creates both demand and scope trouble.
- **Gated artifact:** A post-training objective map, preference-data QA sheet, reward-hacking checklist, KL and margin calculation page, and experiment log.
- **Interactive:** Rank prepared response pairs, fit a one-parameter reward model, and compare illustrative PPO and DPO updates as label noise and KL strength change.
- **Overlap and reinforcement:** Strong ties to Adapter, Reasoning Model, Benchmark, and Training Run. It reaches research readers, though less cleanly than The Attention Head.
- **Effort and drift:** High effort and high drift. A browser toy can explain objectives but cannot establish applied authority without a real post-training run. Hold until paired with publishable training evidence.

### 12. The Mixture of Experts — hold

- **Audience and arrival:** Model-architecture researchers, distributed-training engineers, inference engineers, open-model users, and students. Channels include X paper circles, Hacker News, r/MachineLearning, r/LocalLLaMA, and `mixture of experts explained`, `MoE routing`, `Switch Transformer`, and `expert parallelism` searches.
- **Authority mechanism:** Connect sparse routing and load balancing from [Switch Transformers](https://arxiv.org/abs/2101.03961) to open architectures such as [Mixtral](https://arxiv.org/abs/2401.04088) and [DeepSeekMoE](https://arxiv.org/abs/2401.06066). The citable artifact would account for total versus active parameters, token routes, auxiliary losses, capacity, dropped tokens, communication, and inference residency in one diagram.
- **Demand:** Strong whenever a prominent model announces an MoE architecture, with moderate evergreen educational intent.
- **Gated artifact:** A router-capacity worksheet and poster showing top-k routing, load balance, expert parallel groups, memory residency, communication cost, and failure diagnostics.
- **Interactive:** Route a stream of colored tokens across experts while changing top-k, capacity factor, router temperature, and balance penalty; show overload, dropped work, and utilization.
- **Overlap and reinforcement:** Natural extension of The Transformer and Inference Engine. Publishing it immediately after the inference post would concentrate two slots in model internals and serving.
- **Effort and drift:** High effort and medium drift. Hold for a later architecture wave or pair it with a small MoE training replication.

### 13. The Prompt — reject for Wave 3

- **Audience and arrival:** Technical PMs, engineering leaders, students, knowledge workers, and new AI builders. Routes include Google, LinkedIn, general productivity newsletters, Reddit prompt communities, and broad `prompt engineering` and `context engineering` searches.
- **Authority mechanism:** The best version would test instruction order, examples, retrieved evidence, tool definitions, output schemas, and context conflicts across a fixed task suite. Its original artifact would need measured results rather than a catalog of tips.
- **Demand:** Very broad, but crowded, volatile, and increasingly split between consumer tricks and application context assembly. The word “prompt” attracts an audience much larger than the series’ technical contract, with weak evidence that those visitors want paper-backed drawings.
- **Gated artifact:** An editable context-spec worksheet covering task, inputs, evidence, examples, tools, output contract, failure cases, and an experiment table.
- **Interactive:** Assemble a prompt from prepared blocks and run it against fixed outputs and scores; demonstrate conflicts, truncation, and brittle examples without calling a model.
- **Overlap and reinforcement:** Much of the useful systems content belongs in Context Window, RAG Pipeline, Agent Loop, and Eval Harness. A broad version would repeat those posts; a narrow measured version becomes an eval article.
- **Effort and drift:** Low build effort and very high editorial drift. Reject because it can grow subscribers while weakening the research-authority goal. Use the worksheet idea later as a supporting artifact for Context Window or Eval Harness.

### 14. The Tool Call / MCP — keep held

- **Audience and arrival:** Agent developers, API designers, developer-tool teams, and MCP adopters. Routes include framework communities, Hacker News, X developer circles, and `tool calling explained`, `function calling`, `MCP server`, and `MCP architecture` searches.
- **Authority mechanism:** Draw schema declaration, model selection, host validation, execution, result insertion, errors, and authorization; treat MCP as one discovery and transport contract. A citable object would compare the stable semantic loop across several protocol envelopes without tying the explanation to one SDK.
- **Demand:** High product interest, but official documentation owns much definitional intent and protocol details continue to change.
- **Gated artifact:** A tool-contract checklist with JSON Schema fields, error taxonomy, idempotency, permissions, approval points, test fixtures, and an MCP mapping page.
- **Interactive:** Repair malformed tool calls, validate arguments, inject timeouts and duplicate calls, and inspect the message transcript in a deterministic local runner.
- **Overlap and reinforcement:** TDD-009 already owns tool selection and the model/tool-result loop. TDD-012 owns untrusted inputs and permissions. A separate post now would repeat both unless it focuses on protocol engineering.
- **Effort and drift:** Medium effort and high drift. Keep held until the protocol stabilizes or Zack has a concrete interoperability result worth publishing.

## Why these five, in this order

### TDD-010 — The Attention Head

Lead with the highest-authority research move. The post can make a narrow, falsifiable claim, reproduce a known result, expose the tensors, and show the causal test. It announces that Wave 3 will engage with papers as evidence rather than decoration.

### TDD-011 — The Inference Engine

Follow research with a production system whose audience and vocabulary differ from the current application-developer base. The Attention Head explains computation inside a model; The Inference Engine explains how a service schedules that computation under memory and latency constraints.

### TDD-012 — The Guard

Publish after TDD-009 Agent Loop and TDD-011. Readers will have both the agent execution circuit and its serving substrate. The security drawing can point to exact trust boundaries instead of repeating agent basics. Its threat-model pack should produce the strongest subscriber conversion of the wave.

### TDD-013 — The Diffusion Model

Change modality and visual rhythm after three LLM-heavy posts. This is the wave’s largest net-new audience bet and its most shareable drawing. Publishing fourth allows more time for the custom visual system and paper review.

### TDD-014 — The Benchmark

Close with a broad decision-making subject that can link every prior drawing. The benchmark asks whether the claimed mechanism or system improvement survives measurement. It also creates a direct sequel path to The Eval Harness in Wave 4.

## Held candidates and rejected proposals

### Held candidates from the prior strategy

- **The Adapter stays held.** It is durable, visual, and supported by Zack’s fine-tuning archive. Its likely visitors already sit inside an existing site cluster, so it loses the new-audience comparison. Promote it when a small LoRA/QLoRA replication and released logs can make the drawing more authoritative than the existing article.
- **The Eval Harness stays held.** Its practical value remains high. The Benchmark takes the research and public-measurement layer in Wave 3; the later harness can focus on fixtures, scorers, traces, thresholds, and CI without confusing those two jobs.
- **The Tool Call / MCP stays held.** TDD-009 and The Guard already cover the stable loop, permissions, and failure boundaries. MCP-specific details move quickly and official documentation is the natural definitional source.

No held title is promoted unchanged. The Benchmark advances the broader evaluation problem while preserving The Eval Harness as a later implementation drawing.

### Proposals from the brief that do not make the final five

- **The Reasoning Model:** Hold because the demand is partly release-driven, training disclosures are incomplete, and visible reasoning traces provide too little evidence for strong claims about internal computation. It becomes a top candidate when an open-model replication is ready.
- **The RLHF Loop:** Hold until it can include a real matched-data post-training experiment. An objective diagram alone would explain the literature without proving applied command.
- **The Adapter:** Keep held because audience expansion is limited relative to security, interpretability, inference, vision, and evaluation.
- **The Eval Harness:** Keep held behind The Benchmark, which establishes what a valid measurement contract requires.
- **The Mixture of Experts:** Hold to avoid spending two Wave 3 slots on model-serving and architecture readers. It fits a later architecture pair with a reproducible sparse-routing experiment.
- **The Prompt:** Reject for Wave 3 because broad demand and artifact potential cannot offset weak research distinction and heavy overlap with Context Window, RAG, Agent Loop, and evals.
- **The Training Run:** Hold because a credible result requires multiple controlled runs, released logs, and careful accounting. The topic deserves that evidence rather than a toy-only simulation.

### Re-litigation of The Diffusion Model

The previous rejection was correct under the old criteria: weak archive support, strong incumbents, rapid architecture change, and high interactive cost made it a poor adjacent-traffic choice.

The new brief changes the decision. Diffusion reaches image and video creators, computer-vision engineers, and non-NLP researchers who have few reasons to enter the current site. The source material supports a faithful multi-paper lineage. The visual mechanism fits the drawing format better than most LLM topics, and the poster has clear standalone value. Flow matching and Diffusion Transformers should appear inside the scope so the post explains the direction of travel rather than freezing the field at one Stable Diffusion release. On equal weighting of audience, authority, and capture, those benefits outweigh the production cost.

## The separate-artifact capture pattern

### Recommendation

Gate a separate work product, never an article sheet, reference, interactive result, or RFI answer. The exchange works when the downloadable object saves the reader a future hour at a desk, in a design review, or during an experiment. A decorative export of the same article will train readers to ignore later offers.

Use three artifact classes:

1. **Wall reference:** an A1 poster that reorganizes the drawing for print, adds dense labels, formulas, and a compact comparison plate.
2. **Working document:** an editable worksheet for capacity planning, threat modeling, benchmark design, or experiment recording.
3. **Evidence bundle:** prepared prompts, tensors, traces, fixtures, or result tables that let a reader inspect or reproduce the claim.

The strongest offers in this slate are the Guard threat-model pack, Benchmark design pack, Inference capacity workbook, and Attention circuit-tracing sheet. The Diffusion poster should perform well with creator audiences. Each bundle needs independent value beyond a print command: writable fields, additional tables, reproducibility material, or a work-ready review format.

### Placement in the drawing

Place one **DETACHABLE PLATE** callout immediately after the sheet where the reader first uses the artifact:

- Attention: after the causal-intervention sheet.
- Inference: after the memory and batching sheets.
- Guard: after the defense architecture.
- Diffusion: after the sampler and guidance comparison.
- Benchmark: after score provenance and failure modes.

The callout should show a cropped preview, exact contents, format, page count, and intended job. It should have one button and no email field in the article flow:

> DETACHABLE PLATE · BP-010-A  
> CIRCUIT TRACING FIELD SHEET  
> A1 print + editable experiment worksheet. Record the prompt, component, intervention, expected effect, and observed loss change.  
> `[EMAIL ME THE FIELD SHEET →]`

Clicking opens a small drawing-native panel with the exchange stated before the field:

> Send the Circuit Tracing Field Sheet to my inbox. I’ll also receive future Blueprint drawings when they are issued. Free; one-click unsubscribe.  
> `[you@company.com] [SEND THE FILE →]`

Use the artifact’s real name in every version of the copy. “Get the bonus” and “download resources” conceal the value.

### Coexistence with the current distribution asks

An artifact-equipped post should never show three active email fields.

- Replace the title-block email form on that post with a compact, non-form distribution link: `DISTRIBUTION · GET THE FIELD SHEET + FUTURE DRAWINGS →`. It opens the same artifact panel.
- Keep the end-of-drawing NEXT SHEET card for readers who ignored the artifact offer. Its existing copy remains focused on the next issue.
- A successful artifact request should set the same shared subscribed state used by the current Blueprint capture component. The NEXT SHEET card then becomes the existing “address recorded” confirmation, and the title-block link disappears.
- A reader who already subscribed should receive a direct `GET THE FIELD SHEET` route without another newsletter consent step. Email lookup or a signed link in the issue can handle delivery; do not make subscribers enter the same address repeatedly.
- Use `interest:blueprint-series` for the shared publication consent and add an artifact tag such as `asset:bp-012-threat-model`. Store `drawing_id`, `artifact_id`, and `placement` with the event so artifact demand and general series demand can be separated.

Deliver the file after confirmed submission on the success screen and by email. The on-screen link protects the experience if delivery is delayed. Treat the link as shareable rather than building heavy access control; the email exchange is a consent and delivery mechanism, not digital-rights management.

### Measurement and decision rule

Track preview impressions, panel opens, starts, confirmed submissions, file clicks, delivery failures, artifact-email opens, later Blueprint-email engagement, and unsubscribes by artifact. Compare confirmed subscriptions per 100 eligible sessions with posts that use only the current NEXT SHEET system.

Keep an artifact when it earns incremental confirmed subscriptions and those subscribers engage with a later Blueprint issue. A high file-click rate paired with immediate unsubscribes means the object has value but the publication promise was poorly matched or poorly stated. A low panel-open rate means the artifact, name, preview, or placement needs work before the email form does.

## Editorial requirements for Wave 3

Each selected post should ship with:

- A claim table connecting every major mechanism to a primary paper, reproduced result, or clearly labeled teaching model.
- A reproducibility note naming model, version, prompts or inputs, seeds where relevant, preprocessing, and the difference between measured and illustrative values.
- At least one negative result, failed case, or boundary where the mechanism does not support the stronger popular claim.
- A stable main drawing with dated product examples kept in notes or appendices.
- A separate artifact whose purpose can be stated as a job: trace a circuit, plan capacity, threat-model an agent, compare generation paths, or design a benchmark.
- Distribution copy prepared for the community that should carry it. The same launch text will not fit r/netsec, an interpretability reading group, and an image-creator forum.

That standard gives Wave 3 a coherent promise: every drawing explains a published mechanism, tests the claim at least once, marks what remains uncertain, and leaves the reader with an object they can use after closing the page.
