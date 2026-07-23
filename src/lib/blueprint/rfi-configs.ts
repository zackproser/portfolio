// Server-side RFI (Request For Information) configurations for
// Blueprint Deep Dive posts. The system prompt for each drawing lives
// here — never client-supplied — so the API route can't be repurposed
// as a generic proxy. Add an entry per blueprint post.

export interface RfiConfig {
  /** Drawing code shown to the model, e.g. "TDD-001" */
  drawingCode: string
  /** Post title */
  title: string
  /** URL path of the post, for logging */
  path: string
  /** Condensed sheet-by-sheet source of truth for answers */
  drawingSummary: string
  /** Appendix glossary: [TERM, definition] */
  terms: Array<[string, string]>
}

const VOICE_RULES = `RULES:
- SHORT answers: 2–5 sentences for most questions. It's a side panel, not a lecture.
- Cite sheet numbers (like §03) when pointing back into the drawing — they render as clickable links.
- Format for a narrow panel: **bold** the key term, \`code\` for symbols and identifiers, short - lists for steps or comparisons, fenced code blocks only for actual code. No tables, no headings unless the answer truly has parts.
- Beyond the article's scope: answer briefly from general ML knowledge and say it's beyond this drawing.
- Never invent benchmarks or citations; estimates get called estimates.
- Banned: "great question", "I'd be happy to", "delve", "unlock", "seamless", and "this isn't X, it's Y" constructions.`

export function buildRfiSystemPrompt(cfg: RfiConfig): string {
  const terms = cfg.terms.map((t) => `- ${t[0]}: ${t[1]}`).join('\n')
  return `You are the RFI (Request For Information) desk for Blueprint Deep Dive ${cfg.drawingCode}, "${cfg.title}," a technical drawing on zackproser.com by Zack Proser. The reader asks from a side panel while reading. Voice: plain language, direct, warm, practitioner-to-practitioner, zero condescension, no fluff.

THE DRAWING (your source of truth):
${cfg.drawingSummary}

TERMS (Appendix A):
${terms}

${VOICE_RULES}`
}

export const RFI_CONFIGS: Record<string, RfiConfig> = {
  'tdd-014': {
    drawingCode: 'TDD-014',
    title: 'The Benchmark',
    path: '/blog/the-benchmark',
    drawingSummary: `§01 Pipeline — a public score is produced by a decision, target population, sampling frame, items, prompt adapter, dated model run, scorer, aggregation, uncertainty analysis, contamination audit, and reporting choice. Provenance makes every operation inspectable.
§02 Items and prompts — a sample represents a larger task population, often imperfectly. MMLU contains 15,908 four-choice questions across 57 subjects. Prompt text, examples, choice order, tools, output parser, model version, and date are measurement variables; Brown et al.'s September 2020 five-shot GPT-3 MMLU result was 43.9% under its declared regime.
§03 Instruments — MMLU exact-matches fixed answers; SWE-bench applies repository tests to generated patches; Chatbot Arena collects anonymous pairwise human votes and models comparative preference. They observe academic choice, executable issue resolution, and relative user preference respectively, so their scores are not interchangeable. The original SWE-bench paper dated October 2023 reported 1.96% resolved for its best evaluated model; the March 2024 Arena paper analyzed more than 240,000 votes.
§04 Scoring and aggregation — exact match, tests, rubrics, and preference produce different item data. Micro, macro, and utility-weighted aggregates answer different population questions. Means hide severe slices, timeouts, and abstentions. The deterministic demo uses prepared values and can reorder rankings by scorer, task weights, judge noise, sample size, and a contaminated subset; it is illustrative, not a benchmark.
§05 Uncertainty — score gaps need intervals around the real sampling unit. For independent binary items, SE(p̂)≈sqrt[p̂(1−p̂)/n], but clustered prompts, repositories, repeated runs, judges, users, and time require paired, clustered, repeated-run, or bootstrap analysis. A rank is unresolved when plausible values permit a tie or reversal.
§06 Contamination — evaluation information can leak through training items, solutions, near duplicates, patches, tutorials, prompt tuning, scorer adaptation, or repeated leaderboard feedback. A register records source, public date, route, evidence, affected versions, risk, and action. Fresh temporal sets, paraphrases, hashes, similarity checks, and canaries provide evidence but rarely prove absence.
§07 Goodhart — once a score drives selection, teams optimize genuine capability and score-specific shortcuts. Cost omission, best-of-many submission, judge style bias, static items, and selective reporting weaken transfer. Use fresh holdouts, rotations, full run logs, cost and latency, independent measures, transfer tests, and audits of surprising gains. The detachable Benchmark Design Pack is an A2 poster and editable worksheet.
§08 Decision design — begin with users, task population, failure costs, permissions, quality, cost, and latency. Sample real work, stratify frequency and severity, test the complete deployed system, validate scorers, pre-register aggregation and release rules, preserve acceptance and diagnostic sets, record versions, and refresh when tasks or scorers drift. Public leaderboards screen candidates; local evidence finishes the model-selection argument.`,
    terms: [
      ['ITEM SAMPLING', 'Selecting evaluation units from a declared task population through a documented sampling frame and inclusion rule.'],
      ['SCORER', 'Procedure that converts one system output into correctness, tests, rubric values, preference, cost, or another item result.'],
      ['AGGREGATION', 'Rule that combines item and slice results into a summary statistic, including weights and exclusions.'],
      ['CONFIDENCE INTERVAL', 'Range produced by a stated method to express sampling or measurement uncertainty around an estimate.'],
      ['CONTAMINATION', 'Influence of evaluation information on training, development, prompting, selection, or scoring that is unavailable in intended use.'],
      ['DATA LEAKAGE', 'Transfer of test items, solutions, duplicates, or derived information into model training or development evidence.'],
      ["GOODHART'S LAW", 'Observation that optimization against a measure can weaken its relationship to the underlying goal.'],
      ['PAIRWISE PREFERENCE', 'Judgment that compares two outputs on one prompt and records A, B, or a tie.'],
      ['ELO', 'Sequential relative-rating system based on expected and observed pairwise outcomes.'],
      ['BRADLEY–TERRY MODEL', 'Statistical model relating latent strengths to probabilities of pairwise wins.'],
      ['SLICE', 'Declared subset of evaluation items grouped by task, user, difficulty, severity, source, or another decision-relevant attribute.'],
      ['VALIDITY', 'Degree to which evidence supports the intended interpretation and decision for the target use.'],
      ['RELIABILITY', 'Consistency of measurement across repeated items, runs, scorers, reviewers, or times under a declared procedure.'],
      ['ESTIMAND', 'The exact population quantity a scoring and aggregation procedure intends to estimate.'],
      ['SCORE PROVENANCE', 'Record connecting a published number to tasks, versions, prompts, runs, scorers, exclusions, variance, and decision.'],
    ],
  },
  'tdd-013': {
    drawingCode: 'TDD-013',
    title: 'The Diffusion Model',
    path: '/blog/the-diffusion-model',
    drawingSummary: `§01 Idea — generation begins at a simple Gaussian prior and follows a learned time-dependent field toward the data distribution. One coordinate-consistent 2D teaching distribution is reused throughout; it is illustrative and is not image-model output. DDPM fixed the forward corruption and learned the reverse.
§02 Forward process — q(x_t|x_{t-1}) is Gaussian with beta schedule; alpha_t=1-beta_t and cumulative alpha-bar permit direct sampling x_t=sqrt(alpha-bar_t)x_0+sqrt(1-alpha-bar_t)epsilon. Noise is a same-shaped Gaussian tensor. The schedule allocates signal-to-noise ratio across time.
§03 Reverse process — a network receives noisy state, time, and optional condition, then predicts epsilon, clean x_0, velocity, or score. These targets have the state's dimension and are convertible with schedule coefficients. Score-based SDEs have a stochastic reverse and an equivalent probability-flow ODE with matching marginals.
§04 Objective — sample clean data, time, and Gaussian epsilon; construct x_t; minimize squared error between the known target and network output. The simplified epsilon loss is E||epsilon-epsilon_theta||^2. Parameterizations and time weighting alter training emphasis.
§05 Guidance — text encodings condition the field through cross-attention or adaptive modulation. Classifier-free guidance combines unconditional and conditional predictions as epsilon_uncond+w(epsilon_cond-epsilon_uncond). Higher w trades diversity for adherence and can produce distortion. The demo is a fixed 2D teaching transformation.
§06 Latent architecture — a VAE encoder maps H×W×3 pixels to h×w×c latents; the diffusion or flow network operates there; the decoder returns pixels. Compression reduces spatial cost and can discard detail. A U-Net estimates a multi-scale convolutional field; DiT replaces it with a transformer over latent patches.
§07 Sampling — the sampler chooses time grid, update rule, stochasticity, and conversions. Euler uses one local slope; Heun commonly uses two; ancestral methods inject noise; deterministic DDIM/ODE paths do not after initialization. Compare total network evaluations and matched starting tensors, not step labels alone.
§08 Flow view — the probability-flow ODE gives deterministic trajectories with diffusion's time marginals. Flow matching directly regresses a velocity field for a chosen probability path. Diffusion and flow can share VAE, DiT, conditioning, guidance, and solver; training path and target distinguish them.`,
    terms: [
      ['FORWARD PROCESS', 'Fixed corruption that gradually maps data toward a simple Gaussian distribution.'],
      ['REVERSE PROCESS', 'Learned stochastic or deterministic dynamics that move a prior sample toward data.'],
      ['NOISE SCHEDULE', 'Sequence or continuous function allocating signal and Gaussian noise across time.'],
      ['DENOISING OBJECTIVE', 'Supervised loss between a known corruption-derived target and the network prediction.'],
      ['CLASSIFIER-FREE GUIDANCE', 'Extrapolation from an unconditional field estimate toward a conditional estimate.'],
      ['LATENT DIFFUSION', 'Diffusion performed in a compressed autoencoder representation rather than pixels.'],
      ['VAE', 'Variational autoencoder used here to encode pixels into latents and decode latents into pixels.'],
      ['U-NET', 'Multi-scale convolutional encoder-decoder commonly used as a denoising field network.'],
      ['DiT', 'Diffusion Transformer: a transformer backbone operating on patches of a latent state.'],
      ['SAMPLER', 'Numerical procedure and time grid used to integrate a learned reverse or velocity field.'],
      ['PROBABILITY FLOW', 'Deterministic ODE associated with a diffusion SDE and sharing its time marginals.'],
      ['FLOW MATCHING', 'Training method that regresses the velocity of a chosen probability path.'],
      ['SCORE', 'Gradient of log density with respect to the current state: ∇x log p_t(x).'],
      ['VELOCITY PREDICTION', 'Time-dependent target combining clean signal and noise in the state’s coordinates.'],
      ['NETWORK EVALUATION', 'One call to the U-Net or DiT; a more comparable cost unit than a labeled step.'],
    ],
  },
  'tdd-012': {
    drawingCode: 'TDD-012',
    title: 'The Guard',
    path: '/blog/the-guard',
    drawingSummary: `§01 Confused deputy — a tool-using model proposes actions under application credentials while reading text controlled by other principals. Security review starts with principal, credential, operation, scope, and external effect. The model proposal is untrusted and is not an authorization record.
§02 Trust boundary — authenticated user instructions and external data share model context but never authority. Preserve source provenance and minimize context. The enforceable boundary sits where an external policy service binds a principal and task to a structured, expiring action grant checked by the tool adapter. Prompt text cannot create a dependable privilege boundary.
§03 Attack surface — direct injection enters through a user-to-model channel; indirect injection arrives in retrieved messages, documents, pages, records, or tool results. The complete route is hostile document → model context → privileged tool call. The first two hops move information; the last spends authority.
§04 Prompt controls — instruction hierarchy, delimiters, source labels, warnings, and detectors can reduce attack success for tested cases. They remain model-interpreted mitigations with false positives, false negatives, and adaptive failure modes. They do not independently deny an API call.
§05 Architecture — source labeling preserves producer and retrieval evidence; context assembly limits exposure; policy checks reject forbidden proposals; capability scoping limits operation, resource, recipient, value, rate, and duration; human approval creates a narrow grant for high-impact actions; tool adapters validate again; output handling prevents downstream interpretation. Every control has stated residual risk.
§06 Defense map — provenance affects source-to-context decisions, model controls affect proposal formation, authorization affects proposal-to-grant, tool validation affects grant-to-effect, and output handling affects renderers. Only authorization and tool enforcement directly control privileged effects. Residual risk needs an owner, evidence signal, and retest date.
§07 Testing — report benign task success, utility under attack, targeted attack success, blocked legitimate actions, impact by action class, adaptive variations, and repeated attempts. AgentDojo v3 (November 24, 2024) supplied 97 tasks and 629 cases; its figures are dated results, not durable guarantees. NIST's January 17, 2025 report, updated December 19, 2025, shows adaptive attacks and retries can change measured success sharply.
§08 Fixed boundary — the model may propose but cannot mint authority, widen scope, or approve its own privileged effect. Authorization outside the model binds principal + task + operation + resource + recipient/destination + limits + expiry + approval. “Secure” means specified enforcement and dated evidence, never that prompt injection has been solved.`,
    terms: [
      ['CONFUSED DEPUTY', 'A component with legitimate authority that can be induced to use it for the wrong principal or purpose.'],
      ['TRUST BOUNDARY', 'An enforcement crossing where identity, integrity, or authority assumptions change and are checked.'],
      ['DIRECT PROMPT INJECTION', 'Attacker-influenced instructions supplied through a channel that addresses the model directly.'],
      ['INDIRECT PROMPT INJECTION', 'Attacker-influenced instructions carried inside retrieved data such as a message, document, page, record, or tool result.'],
      ['PROVENANCE', 'Structured record of a datum’s producer, retrieval path, time, integrity evidence, and trust class.'],
      ['CAPABILITY SCOPING', 'Restricting authority by operation, resource, recipient or destination, value, rate, duration, and principal.'],
      ['AUTHORIZATION', 'Decision that binds an authenticated principal and task to a concrete permitted action.'],
      ['HUMAN-IN-THE-LOOP', 'Required person approval for a concrete privileged action before an external effect occurs.'],
      ['POLICY CHECK', 'Independent evaluation of a proposed action against structured rules and the available grant.'],
      ['TOOL ADAPTER', 'Code that validates schema and authorization before translating a model proposal into an external API operation.'],
      ['RESIDUAL RISK', 'Failure mode and impact that remain after a named control is operating.'],
      ['ATTACK SUCCESS RATE', 'Fraction of evaluated cases in which the attacker’s specified target state occurs.'],
      ['TASK SUCCESS', 'Fraction of evaluated cases in which the legitimate user goal is completed according to a declared oracle.'],
      ['BLOCKED LEGITIMATE ACTION', 'Authorized useful work prevented by a security control, recorded as a utility cost.'],
      ['OUTPUT HANDLING', 'Escaping, parameterization, typed interfaces, and inert rendering applied before model output reaches another interpreter.'],
    ],
  },
  'tdd-001': {
    drawingCode: 'TDD-001',
    title: 'The Transformer',
    path: '/blog/the-transformer',
    drawingSummary: `§01 The sequence problem and history — Sutskever et al. seq2seq (2014) compressed a source into recurrent state; Bahdanau and Luong attention let decoders consult encoder states. The 2017 Transformer made a subtraction claim: attention could replace recurrence/convolution. RNNs require O(n) sequential steps; attention uses O(1) sequential steps and O(n²) pairwise work. Causal masking preserves parallel next-token training, while generation remains serial.
§02 Tokens & embeddings — BPE subwords, vocab ~50k–200k; IDs index a learned embedding table producing d_model-wide vectors (512–12288). Token boundaries vary with language, whitespace, names, emoji, and code; every piece consumes context and compute.
§03 Attention — each token emits query/key/value via learned W_Q, W_K, W_V. Attention(Q,K,V) = softmax(QK⊤/√d_k)V. √d_k stops dot products from saturating the softmax. Demo sentence: "The animal didn't cross the street because it was too tired" — "it" attends to "animal."
§04 Multi-head — 8–128 parallel heads, each d_model/h wide, same total compute; observed jobs include previous-token, syntax, coreference, and induction behavior, but labels are descriptive and computation may be distributed. Induction heads are a leading candidate account of in-context learning.
§05 Positional encoding — PE(pos,2i)=sin(pos/10000^(2i/d)), cos on odd dims; unique barcode per position; fixed offsets are linear maps; modern models use RoPE rotations of Q/K. Position schemes permit coordinates beyond training ranges but do not guarantee useful extrapolation.
§06 The block and decoder-only lineage — pre-norm block: LN→multi-head attention→residual add, LN→FFN→residual add. FFN is ~4× model width and holds ~2/3 of parameters; the residual stream is a shared bus. GPT-1 (2018) retained the causally masked decoder and next-token objective; GPT-2 and GPT-3 scaled the line and exposed prompt-based task adaptation.
§07 Sampling — final projection gives one logit per vocab entry; temperature divides logits; top-k/top-p/beam are selection policies, not factual checks. KV caching reuses past keys/values, while attention work and cache reads still grow with context length.
§08 Scale — params ≈ 12·N·d²; Kaplan et al. found power-law loss trends with size, data, and compute. Chinchilla showed many models were undertrained and that compute-optimal allocation requires more training tokens relative to parameters. RoPE, RMSNorm, SwiGLU, GQA, and MoE revise the same circuit.`,
    terms: [
      ['TOKEN', "Subword unit from a fixed vocabulary (~50k–200k entries), produced by byte-pair encoding. The model's atom."],
      ['EMBEDDING', 'Learned vector (d_model wide) representing one token. Geometry encodes meaning.'],
      ['QUERY / KEY / VALUE', 'Three learned projections of each token: what I seek / what I contain / what I contribute.'],
      ['ATTENTION HEAD', 'One independent relevance function. Layers run 8–128 in parallel over d_model/h dims each.'],
      ['SOFTMAX', 'Turns raw scores into probabilities summing to 1. Appears twice: inside attention, and at the output.'],
      ['POSITIONAL ENCODING', 'Sinusoid (or rotary) stamp that injects token order into an otherwise order-blind mechanism.'],
      ['FFN', 'Per-token two-layer network, ~4× model width. Holds ~2/3 of parameters; stores much of the factual knowledge.'],
      ['RESIDUAL STREAM', "The running sum every layer reads from and writes into. The model's shared bus."],
      ['LAYER NORM', 'Re-centers activations before each sub-layer so 100-layer stacks remain trainable.'],
      ['LOGIT', 'Raw pre-softmax score for one vocabulary entry at the output layer.'],
      ['TEMPERATURE', 'Divisor on logits before sampling. Low = deterministic, high = diverse/chaotic.'],
      ['KV CACHE', 'Stored keys/values of past tokens so generation never recomputes them. Why context length costs memory.'],
      ['SEQ2SEQ', 'Encoder-decoder lineage that maps one sequence to another; early systems used recurrence and one compressed source state.'],
      ['CAUSAL MASK', 'Triangular attention mask hiding future tokens during parallel next-token training.'],
      ['SCALING LAW', 'Empirical power-law relationship connecting loss with model size, data, and training compute over measured regimes.'],
    ],
  },
  'tdd-002': {
    drawingCode: 'TDD-002',
    title: 'The Embedding Space',
    path: '/blog/the-embedding-space',
    drawingSummary: `§01 String matching and history — Harris (1954) and Firth (1957) established the distributional idea that meaning is reflected by linguistic company. word2vec (2013) made large-scale predictive word vectors practical; GloVe (2014) learned from global co-occurrence. One-vector-per-word systems could not disambiguate context.
§02 Coordinates — an embedding is x∈ℝ^d with distributed meaning. Contextual encoders produce token vectors conditioned on the sentence; SBERT (2019) trained reusable sentence vectors for efficient comparison. Pooling, query/document roles, prefixes, and normalization belong to the contract. Never compare unrelated model spaces even at equal dimensionality; a 1,536-d float32 vector is 6,144 bytes before overhead.
§03 Geometry — training places related items nearby and can encode useful relationship directions, though analogies are intuition rather than universal algebra. Cosine similarity is (x·y)/(‖x‖₂‖y‖₂), ranging from −1 to 1; calibrate thresholds on the real task because absolute scores are corpus-dependent.
§04 Training — contrastive learning pulls positive pairs together relative to negatives; InfoNCE treats the match as the correct batch candidate and τ controls sharpness. Hard negatives teach application-specific boundaries; false negatives punish truly related items. Data defines similarity.
§05 Unit sphere — L2 normalization projects vectors onto the unit hypersphere and removes magnitude. For unit vectors cosine equals dot product, and Euclidean distance produces the same ranking via ‖x−y‖²=2−2x·y; follow the model's documented metric and normalization contract.
§06 Vector search — exact search scans every vector; ANN trades controlled recall for fewer comparisons. HNSW (Malkov and Yashunin) navigates sparse long-range upper layers then dense local layers. Tune construction, graph degree, and search breadth; measure recall against exact top-k. Graph links, replication, deletes, and quantization add memory and accuracy tradeoffs.
§07 Failure lines — chunks can be too broad or context-poor; anisotropy and hubness can distort neighborhoods; domain shift changes relevance; truncation, OCR, boilerplate, and preprocessing alter encoder input. Model, pooling, normalization, instruction, or preprocessing changes create incompatible coordinates. Rebuild a separate versioned index for migration.
§08 Applications — RAG retrieves evidence, dedup finds near-copies, recommendation maps users and items, classification uses prototypes or learned heads, and clustering supports exploration. Each application needs its own positives, relevance judgments, thresholds, latency budget, and failure policy.`,
    terms: [
      ['EMBEDDING', 'A fixed-width learned vector representing an object; semantic properties are distributed across directions and coordinates.'],
      ['DIMENSION', 'One coordinate of a d-wide vector. Individual dimensions rarely carry a stable human-readable meaning.'],
      ['COSINE SIMILARITY', 'Angular similarity (x·y)/(‖x‖₂‖y‖₂), ranging from −1 to 1 for nonzero real vectors.'],
      ['L2 NORMALIZATION', 'Division by vector length, projecting a vector onto the unit hypersphere.'],
      ['POSITIVE PAIR', 'Two training inputs the objective should place close together, such as a query and relevant passage.'],
      ['NEGATIVE', 'A candidate the contrastive objective should rank below the positive; false negatives are actually relevant.'],
      ['INFONCE', 'Contrastive classification loss that favors a positive over negatives using similarity scores and temperature.'],
      ['ANN', 'Approximate nearest-neighbor search: fewer comparisons and lower latency in exchange for possible recall loss.'],
      ['HNSW', 'Hierarchical graph index using sparse long-range links above a dense local base layer.'],
      ['RECALL@K', 'Fraction of exact or labeled relevant neighbors found in the first k returned results.'],
      ['CHUNK', 'One retrieval unit embedded as a point; it should contain one coherent idea with enough local context.'],
      ['EMBEDDING DRIFT', 'Coordinate incompatibility caused by changing model, preprocessing, pooling, instructions, or normalization.'],
      ['DISTRIBUTIONAL HYPOTHESIS', 'Meaning can be inferred from the linguistic contexts in which a word or expression appears.'],
      ['CONTEXTUAL EMBEDDING', 'Representation conditioned on the surrounding tokens, allowing the same word to take different vectors in different sentences.'],
      ['HARD NEGATIVE', 'Plausible but incorrect candidate used in training to teach a fine relevance distinction.'],
      ['HUBNESS', 'A high-dimensional neighborhood effect where a few points appear unusually often among nearest neighbors.'],
    ],
  },
  'tdd-003': {
    drawingCode: 'TDD-003',
    title: 'The RAG Pipeline',
    path: '/blog/the-rag-pipeline',
    drawingSummary: `§01 External memory and history — DrQA (2017) paired lexical retrieval with a neural reader; REALM, DPR, and the RAG paper (2020) developed learned retrieval and retrieval-conditioned generation. Model weights are compressed training patterns, not a current database. Retrieval supplies private, current, attributable evidence; long context fits preselected material, fine-tuning targets behavior, and tools serve exact live state/actions.
§02 Pipeline — offline: source→parse→chunk→embed→index; online: query→rewrite→retrieve→rerank→assemble→generate. The paths run on different clocks. Preserve IDs, ACLs, provenance, component versions, candidates, final context, answer, and citations. Freshness, deletion, idempotency, reconciliation, and permission lag are ingestion concerns.
§03 Chunking — fixed windows are predictable; structure-aware chunks preserve headings, tables, code, and conversations; semantic chunks detect topic shifts. Overlap duplicates storage/results. Parent-child retrieval matches a focused child then returns broader context. Evaluate a size range on real questions.
§04 Retrieval — BM25 comes from the Okapi probabilistic retrieval lineage and excels on exact rare terms; dense search handles paraphrase. Hybrid commonly uses reciprocal rank fusion because score scales differ. Preserve original queries beside rewrites; apply security and metadata filters inside retrieval.
§05 Reranking — bi-encoders independently encode query/passages for reusable fast search; cross-encoders jointly read each pair for slower, more precise ranking. Retrieve wide then rerank a shortlist. Reranking cannot recover missing candidates; deduplication and diversity prevent repeated chunks from consuming context.
§06 Context budget — reserve tokens for instructions, history, query, and output, then pack evidence. Lost-in-the-middle research found models can underuse evidence in central positions even when it fits. Remove duplicates, preserve boundaries, order deliberately, and test citation/abstention rules. Multi-hop questions may require decomposition or iterative retrieval.
§07 Eval & failures — trace corpus→parse→retrieve→rerank→assemble→generate. Retrieval: hit rate@k, recall@k, MRR, nDCG, latency; generation: context relevance, faithfulness, answer relevance. Human-reviewed sets should cover unanswerable, exact, paraphrase, ACL, stale, conflicting, table, and multi-hop cases; expected source versions and abstention need direct testing.
§08 Use boundaries — plain long context fits small preselected sources; tools return exact live state and perform actions; fine-tuning changes repeated behavior; RAG selects from large searchable knowledge. These patterns compose, and architecture should follow the source and guarantee required at each step.`,
    terms: [
      ['RAG', 'Retrieval-augmented generation: selecting external evidence at request time and supplying it to a generator.'],
      ['INGESTION', 'Asynchronous path that reads, parses, chunks, embeds, versions, and indexes source documents.'],
      ['CHUNK', 'The unit retrieval can return; its boundary controls how much evidence and surrounding context travel together.'],
      ['DENSE RETRIEVAL', 'Vector-similarity search that handles paraphrase and conceptual similarity.'],
      ['BM25', 'Lexical ranking function rewarding query-term matches while discounting terms common in the corpus.'],
      ['HYBRID SEARCH', 'Combination of dense and lexical retrieval, commonly through normalized blending or rank fusion.'],
      ['BI-ENCODER', 'Fast retriever encoding query and passage separately so passage vectors can be precomputed.'],
      ['CROSS-ENCODER', 'Slower reranker jointly reading query and passage for token-level relevance scoring.'],
      ['CONTEXT BUDGET', 'Tokens available for retrieved evidence after instructions, history, query, and output reserve.'],
      ['FAITHFULNESS', 'Degree to which answer claims are supported by the context supplied to the generator.'],
      ['HIT RATE@K', 'Share of queries with at least one relevant result among the first k candidates.'],
      ['PROVENANCE', 'Source identity, version, location, and transformations needed to trace evidence back to its origin.'],
      ['OPEN-DOMAIN QA', 'Question answering over a large corpus where retrieval first selects documents for a reader.'],
      ['RERANKER', 'Second-stage model that scores a small retrieved candidate set with richer query-passage interaction.'],
      ['LOST IN THE MIDDLE', 'Observed tendency for models to use evidence less reliably when it sits in the middle of a long input.'],
      ['ABSTENTION', 'Deliberate refusal to answer when supplied evidence is absent, conflicting, or insufficient.'],
    ],
  },
  'tdd-004': {
    drawingCode: 'TDD-004',
    title: 'The Tokenizer',
    path: '/blog/the-tokenizer',
    drawingSummary: `§01 Representation tradeoff — models consume integer IDs, not raw text. Bytes and characters guarantee coverage but lengthen sequences; words shorten common inputs but create huge vocabularies and out-of-vocabulary failures. Subwords choose a middle point, with vocabulary size trading embedding parameters against sequence length.
§02 Vocabulary training — BPE begins from small symbols, counts adjacent pairs over a weighted corpus, merges the most frequent pair, and repeats. Merge order is the learned artifact. Gage described BPE for compression in 1994; Sennrich et al. adapted it to neural translation in 2016. WordPiece came through speech search; GPT-2 used byte-level BPE.
§03 Encoding — inference replays the fixed ordered merge table over new text. Earlier merges create symbols used by later merges, so applying every available merge without rank order gives a different segmentation. Encoding is deterministic for a fixed tokenizer configuration and normalization pipeline.
§04 Bytes and Unicode — byte-level BPE starts from UTF-8 bytes, so every input is representable without an unknown token. Non-ASCII characters span multiple bytes; uncommon emoji and CJK text may fragment. Tokenizers also encode whitespace through markers or space-attached vocabulary entries, and normalization changes boundaries.
§05 IDs and embeddings — each final token maps to an integer vocabulary ID, which selects one row from a learned embedding matrix. IDs are arbitrary addresses, not magnitudes or semantic coordinates. Tokenization is the bridge from text to the token vectors used by transformers and embedding models.
§06 Systems cost — token count determines context occupancy, prefill work, generated decoding steps, latency, and API billing. Fertility means tokens per word or comparable text unit; it varies by language and domain. A tokenizer trained heavily on one language can make another language longer and more expensive.
§07 Failure lines — token boundaries can hide character structure needed for spelling and counting, split digits inconsistently for arithmetic, fracture code identifiers, and allocate many pieces to rare names. The strawberry letter-counting failure belongs to this class, though model capability and data also matter.
§08 Design boundaries — BPE greedily builds frequent units; WordPiece uses a likelihood-inspired merge score and greedy longest-match encoding; Unigram begins with many candidates and prunes them probabilistically. SentencePiece trains from raw text. Byte models such as ByT5 remove subword OOV issues but run longer sequences. Vocabulary size is a systems decision balancing sequence length, embedding parameters, multilingual coverage, and serving cost.`,
    terms: [
      ['TOKEN', 'One vocabulary item emitted by a tokenizer and represented by an integer ID.'],
      ['VOCABULARY', 'Fixed inventory of tokens available to an encoder and its embedding table.'],
      ['BPE', 'Byte-pair encoding: repeated merging of the most frequent adjacent symbol pair.'],
      ['MERGE TABLE', 'Ordered list of symbol-pair merges learned from the training corpus and replayed during encoding.'],
      ['MERGE RANK', 'Position of a pair in the ordered merge table; lower ranks apply earlier.'],
      ['BYTE-LEVEL BPE', 'BPE whose base alphabet covers bytes, allowing any UTF-8 input to be represented.'],
      ['UTF-8', 'Variable-width Unicode encoding using one to four bytes per code point.'],
      ['FALLBACK', 'Base representation used when no larger learned token matches, commonly bytes or characters.'],
      ['TOKEN ID', 'Integer address assigned to one vocabulary entry.'],
      ['EMBEDDING LOOKUP', 'Selection of the learned matrix row indexed by a token ID.'],
      ['FERTILITY', 'Number of tokens produced per word or another comparable unit of text.'],
      ['WORDPIECE', 'Subword method associated with likelihood-based vocabulary construction and greedy longest-match encoding.'],
      ['UNIGRAM', 'Probabilistic subword model that prunes a large candidate vocabulary and scores segmentations.'],
      ['SENTENCEPIECE', 'Language-independent tokenizer toolkit that can train directly from raw sentences.'],
      ['SPECIAL TOKEN', 'Reserved vocabulary item representing control structure such as end-of-text or padding.'],
    ],
  },
  'tdd-005': {
    drawingCode: 'TDD-005',
    title: 'The Workshop',
    path: '/blog/the-workshop',
    drawingSummary: `§01 Product — a talk can transfer enthusiasm or a point of view; a workshop transfers observable capability. At the 2026 AI Engineer World's Fair, conference founder swyx told Zack Proser and Nick Nisi their workshops were “the gold standard” for AI Engineer content. The supporting product included a phone-ready deck, live room board, glossary with chat, local coach, and hands-on playground.
§02 Room diagnosis — assess roles, experience, devices, permissions, terminology, and desired work before building slides. The GHX room ranged from leaders who had never opened a terminal to advanced engineers. Define one outcome sentence: “After this workshop, the room can _____,” using an observable verb. Mixed rooms use shared outcomes with different entry ramps and extensions.
§03 Artifact stack — select artifacts against learning bottlenecks: deck-as-app via QR, live board, glossary and chat, hands-on repository, question log, and recap. Every selected artifact should remain useful after the session. The Cowork event had 800 registrations for 150 seats, so its public repo and recap extended the material beyond the room.
§04 Curriculum — psychological safety is structural: private chat made “no dumb questions” usable and logged questions as signal. Sequence ground rules, de-jargonification, guided practice, hands-on building, and advanced extension. The GHX plan used a 30-minute glossary walk and five levels from basic computer vocabulary through advanced agents.
§05 Hands-on lab — use working code, real inputs, state changes, and a useful output. The Mastra lab chained Zod-validated structured generation, modular workflow steps, model generation, and Imgflip APIs into a shareable meme. The Cowork lab ran seven timed GTM modules in one session so context accumulated. Attendees keep and rerun the implementation.
§06 Live operations — the run of show names timing, owner, attendee action, checkpoint, compression point, and known-good recovery state. Read pacing from completed actions. Narrate live failures, then switch to the fallback before one dependency consumes the learning path. Log questions by topic and curriculum stage.
§07 Follow-through — publish the support window and channel, ship the artifacts and recap, group logged questions into a report, patch recurring gaps, and test the original outcome sentence with completed work or a rerun. GHX async support ran from June 17 through July 1.
§08 Commission — engagement flow: scoping call → outcome sentence → artifact plan → tested build and run of show → delivery → agreed follow-through and report. Scope varies with room size, skill mix, subject, security, venue, duration, artifact depth, and support period. When a reader asks about booking, pricing, cost, or availability, direct them to the RFP desk immediately after §08 (Appendix A); do not invent a price or calendar availability.`,
    terms: [
      ['OUTCOME SENTENCE', 'An observable completion statement: “After this workshop, the room can _____.” It drives curriculum and measurement.'],
      ['ARTIFACT STACK', 'The selected deck, board, glossary, repository, question log, recap, and other software surrounding the live session.'],
      ['ENTRY RAMP', 'A starting path matched to an attendee’s prior experience while preserving the room’s shared outcome.'],
      ['DE-JARGONIFICATION', 'Teaching the plain meaning and visible object behind required technical language before asking attendees to use it.'],
      ['HANDS-ON BLOCK', 'A timed period in which attendees perform a concrete action and produce inspectable evidence.'],
      ['KNOWN-GOOD STATE', 'Prepared working branch, output, or environment used to recover the room without losing the next learning block.'],
      ['RUN OF SHOW', 'Operating plan with timing, ownership, attendee action, checkpoints, compression points, and recovery routes.'],
      ['QUESTION SIGNAL', 'A captured question tagged by topic and curriculum stage, used to diagnose gaps after delivery.'],
      ['SUPPORT WINDOW', 'The agreed post-workshop period and channel for attendee questions, fixes, and application help.'],
      ['RFP DESK', 'The commission form after §08 where a reader describes the room and desired outcome to request a workshop scope.'],
    ],
  },
  'tdd-006': {
    drawingCode: 'TDD-006',
    title: 'The Model Sheet',
    path: '/blog/choosing-an-llm',
    drawingSummary: `§01 The name — a weight filename (e.g. Qwen2.5-Coder-32B-Instruct-Q5_K_M.gguf) packs six fields: family/version, domain specialization, parameter count, post-training stage, quantization, and file format. Decompose the name and check each field against a constraint you own — memory, latency, task, license. A leaderboard rank collapses all of that into one number on tasks that may not resemble yours; it is a weak prior, and the fields are the decision. Field order is a community convention, not a standard, and repackagers append their own tags.
§02 Parameters — parameters are the learned weights; more raise the capability ceiling at a proportional memory and, for a dense model, per-token compute cost. Compute-optimal training matches capacity to data, so a well-trained 32B can beat a poorly-trained 70B. The decisive local split is dense versus mixture-of-experts (MoE): dense runs every parameter per token, while MoE routes each token to a few expert sub-networks, so total parameters set the memory footprint and active parameters set the speed (written total-A-active, e.g. 235B-A22B). A 100B-total / 12B-active MoE gives near-frontier quality at roughly 12B speed, provided the full weights fit in memory.
§03 Lineage — a model is built in stages and the stage it stopped at most changes behavior: pretraining yields a base model (completes text, does not converse); instruction tuning plus RLHF yields an instruct/chat model (follows requests); reasoning training makes it emit a hidden thinking span before the visible answer (more accuracy, more tokens). Distillation is a separate lever — a smaller student trained to match a larger teacher's full soft output distribution, so it behaves above its parameter count (e.g. DeepSeek-R1-Distill-Qwen-7B is a Qwen-7B student taught to reason by an R1 teacher). Distillation makes a genuinely smaller network; quantization keeps the same parameters in fewer bits — independent steps.
§04 Modification — the community edits released weights, each with its own tag: a fine-tune continues training on a narrower distribution; a merge blends the tensors of several models with no training (spherical interpolation, task arithmetic); an abliterated model has had its refusal behavior removed by editing activations. Abliteration works because refusal is largely mediated by one direction in activation space — estimate it from harmful-minus-harmless activations and orthogonalize the weights against it, no training involved. Removing it can also degrade calibration and strip refusals you wanted. Read the card for what was combined and by whom, test the result, and keep the plain instruct model as your default.
§05 Precision — quantization stores each weight in fewer bits (8 down to 2) plus small per-block scaling metadata; the file shrinks, memory traffic per token drops, generation speeds up, and precision is the cost. In GGUF, labels like Q8_0, Q6_K, Q5_K_M, Q4_K_M read as: the number is approximate bits per weight, _K marks the k-quant family (uneven bit allocation across a block), and _S/_M/_L is the size variant. An importance matrix (imatrix; i1, IQ2, IQ3) protects the weights that most affect output and wins big below 4 bits. Rules of thumb: Q8 is indistinguishable, Q6/Q5 near-lossless, Q4 the standard balance, Q3 degraded, Q2 a last resort; a bigger model at Q4 usually beats a smaller one at Q8 of the same family until below ~Q3. GGUF for a laptop (CPU/Metal); GPTQ or AWQ for a GPU box.
§06 Sourcing — open weights ship as Hugging Face repositories under an org/user namespace, which is the first provenance signal (original lab versus re-packager). Inside are the weights, a config, a tokenizer, a license, and the model card (README) — read it for what the filename omits: license, base model, how any merge or abliteration was produced, prompt format. Safetensors is the safe, near-full-precision container GPU stacks and fine-tuning load; GGUF is the quantized single-file format local runtimes load, usually published by a separate quantizer (bartowski, mradermacher, unsloth). Watch for sharded files (…-00001-of-00003), an mmproj file for vision input, gated repos, and licenses that restrict commercial use — open weights is not open source.
§07 The fit — two readable numbers decide usability. Fit: memory ≈ parameters × bits_per_weight ÷ 8, plus a KV cache that grows with context length and concurrency, plus overhead, and the sum must sit inside usable VRAM or the GPU's share of unified memory. Speed: token generation is memory-bandwidth-bound, so bandwidth ÷ bytes-read-per-token gives order-of-magnitude tokens per second — which is why an MoE, streaming only its active parameters per token, is the sweet spot on a big-memory machine. Prefill (reading the prompt) is compute-bound; decode (one token at a time) is bandwidth-bound. On Apple Silicon, raising the wired-memory cap (iogpu.wired_limit_mb) is the key tuning step.
§08 Test and boundary — a public benchmark measures a task someone else defined, and popular suites leak into training corpora, so a high score can reflect exposure as much as ability; rank narrows the field, your own test decides. Collect 10–30 prompts representing your real work, each with a known-good or clearly-judgeable answer, run every candidate through the same set, score pass/fail against what you needed, and record tokens per second and cost per run beside it. Pass/fail forces you to define "good" before you look; keep the set in version control and re-run it whenever a new model tempts you. The boundary between local and hosted: local buys privacy, zero marginal cost, and offline use; hosted buys frontier models and elastic concurrency. Links to The Transformer for memory-and-bandwidth details, The RAG Pipeline for context budget, and the 2026 AI Engineer Setup for daily practice.`,
    terms: [
      ['MODEL SHEET', 'A weight filename read as a compressed spec: family, domain, parameters, training stage, quantization, format.'],
      ['PARAMETERS', 'The learned weights; more raise the capability ceiling at proportional memory and per-token compute cost.'],
      ['DENSE', 'An architecture that runs every parameter for every token.'],
      ['MIXTURE-OF-EXPERTS', 'An architecture that routes each token to a small subset of expert sub-networks; total sets memory, active sets speed.'],
      ['ACTIVE PARAMETERS', 'The fraction of an MoE model actually computed per token; it governs generation speed, not memory footprint.'],
      ['BASE MODEL', 'A pretrained model that completes text but does not converse or follow instructions.'],
      ['INSTRUCT MODEL', 'A base model further trained on instruction-response pairs and aligned to follow requests.'],
      ['REASONING MODEL', 'A model trained to emit a hidden thinking span before its visible answer, spending tokens for accuracy.'],
      ['DISTILLATION', 'Training a smaller student to match a larger teacher’s soft output distribution, so it behaves above its size.'],
      ['ABLITERATION', 'Removing a model’s refusal behavior by editing activations along the refusal direction, without retraining.'],
      ['MERGE', 'Blending the tensors of two or more models with no training, e.g. by interpolation or task arithmetic.'],
      ['QUANTIZATION', 'Storing each weight in fewer bits plus per-block scaling metadata, trading precision for size and speed.'],
      ['K-QUANT', 'A GGUF quantization family that allocates bits unevenly across a block to hold quality at a lower average bit rate.'],
      ['IMATRIX', 'An importance matrix that protects the most output-affecting weights during quantization; wins most below 4 bits.'],
      ['GGUF', 'The single-file quantized format local CPU-and-Metal runtimes load; carries the ladder from Q8 down to Q2.'],
      ['SAFETENSORS', 'A safe, near-full-precision, data-only weight container that GPU stacks and fine-tuning load.'],
      ['MODEL CARD', 'A repository’s README recording license, base model, lineage, and prompt format — what the filename omits.'],
      ['KV CACHE', 'Cached keys and values for prior tokens; it grows with context length and concurrency and adds to the memory sum.'],
    ],
  },
  'tdd-011': {
    drawingCode: 'TDD-011',
    title: 'The Inference Engine',
    path: '/blog/the-inference-engine',
    drawingSummary: `§01 Request life — serving adds admission, tokenization, routing, queueing, KV allocation, streaming, cancellation, and release around model execution. The router, scheduler, model runner, sampler, and streamer own different state. A model’s weights can fit while runtime buffers and KV state still cause failure.
§02 Two workloads — prefill processes prompt positions in large parallel operations and directly contributes to TTFT. Autoregressive decode produces one token per active sequence per iteration, reads prior KV, and determines streaming ITL. Long prefills can interrupt decodes; chunked prefill bounds that interference.
§03 Memory ledger — weight bytes equal parameters times stored bytes/parameter plus metadata. KV bytes/request equal 2 × layers × KV heads × head dimension × sequence tokens × KV bytes/element. The worked 7B BF16 case uses 13.04 GiB weights, 128 KiB KV/token, 0.50 GiB KV per 4,096-token request, 8.00 GiB for 16 requests, 3.00 GiB runtime peak, and 4.00 GiB safety reserve on a 40 GiB device.
§04 KV paging — contiguous maximum-length reservations waste tails and suffer external fragmentation. PagedAttention maps logical request blocks to non-contiguous physical KV blocks, leaving ordinary rounding waste in the last block. Paging improves physical allocation but does not reduce logical KV bytes; preemption, swapping, or recomputation moves pressure into latency.
§05 Batching — static batches hold membership and can strand finished slots. Continuous batching revisits membership at iteration boundaries. Policy allocates latency: prefill priority lowers some TTFT but can widen ITL; decode priority protects streaming but ages queues; chunking bounds prefill work. The demo is deterministic and illustrative, not a benchmark.
§06 Kernels and bits — FlashAttention tiles exact attention to reduce HBM traffic and temporary materialization. Weight, activation, and KV quantization affect different ledger lines. SmoothQuant migrates channel-wise activation difficulty into weights before W8A8 rounding. Quality, kernel support, metadata, calibration, and deployed batch shape determine whether lower precision helps.
§07 Capacity frontier — memory-only concurrency is floor((device − weights − runtime peak − safety) / KV per request). Compute and latency impose separate ceilings. Sweep offered load and prompt/output buckets; count useful work as goodput inside declared TTFT/ITL/end-to-end SLOs. Replica routing should account for token work, not request count alone.
§08 Failure boundary — OOM requires a phase-specific memory ledger; queue collapse occurs when arrivals outpace completions and retries amplify load; cache thrash spends capacity on preemption and recomputation. Choose an engine for direct runtime control, an endpoint platform for deployment operations with runtime choices, or managed inference to transfer most accelerator operations under a testable contract. Vendor benchmark rows without workload fields cannot decide the boundary.`,
    terms: [
      ['PREFILL', 'Prompt-processing phase that creates KV state for supplied tokens before the first generated token.'],
      ['DECODE', 'Autoregressive phase that reads prior KV state and appends one generated token per active sequence per iteration.'],
      ['KV CACHE', 'Per-layer stored key and value vectors for prior sequence tokens, reused during decode.'],
      ['PAGEDATTENTION', 'Attention memory scheme mapping logical sequence blocks to non-contiguous physical KV blocks.'],
      ['CONTINUOUS BATCHING', 'Scheduling policy that can add and remove requests at iteration boundaries.'],
      ['STATIC BATCHING', 'Policy that fixes batch membership for a larger unit of work, often leaving completed slots idle.'],
      ['TTFT', 'Time from request acceptance until the first output token becomes available.'],
      ['INTER-TOKEN LATENCY', 'Elapsed time between consecutive output tokens for one streaming request, measured in ms/token.'],
      ['QUANTIZATION', 'Representing weights, activations, or KV elements with lower precision plus required scaling metadata.'],
      ['FLASHATTENTION', 'Exact tiled attention algorithm designed to reduce reads and writes between HBM and on-chip SRAM.'],
      ['MEMORY BANDWIDTH', 'Rate at which data can move through a memory interface, commonly measured in bytes per second.'],
      ['KV BLOCK', 'Fixed physical allocation unit holding KV entries for a bounded number of sequence tokens.'],
      ['GOODPUT', 'Completed requests or tokens that satisfy the declared latency and quality objective per unit time.'],
      ['PREFILL CHUNK', 'Bounded portion of a long prompt scheduled so decode work can run between prompt segments.'],
      ['CACHE THRASH', 'Repeated eviction, preemption, swapping, or recomputation that consumes capacity without proportional completed work.'],
    ],
  },
  'tdd-010': {
    drawingCode: 'TDD-010',
    title: 'The Attention Head',
    path: '/blog/the-attention-head',
    drawingSummary: `§01 Head anatomy — one head has a QK routing circuit and an OV writing circuit. QK scores choose source positions under the causal mask; weighted values pass through the output projection into the shared residual stream. An attention map exposes routing weights only. GPT-2 small has 12 layers, 12 heads per layer, width 768, and head width 64.
§02 Research question — mechanistic interpretability proposes testable routes from components to behavior. The claim-strength ladder is pattern, then logit attribution, then intervention. A pattern locates correlation; attribution reads a component output in a behavior-relevant basis; intervention changes the component and measures a counterfactual behavioral effect.
§03 Behavior — induction has the form [A][B] … [A] → [B]: at a repeated prefix token, attend to the token after its earlier occurrence and raise that continuation. The prepared GPT-2 replication uses three prompts made of two equal eight-token cycles. Copying score is the target continuation logit minus the mean logit of other cycle tokens.
§04 Circuit — an earlier previous-token head attends i→i−1 and writes a shifted token feature. A later induction head uses that feature in its QK circuit to find a matching earlier prefix; its OV circuit writes the earlier continuation toward the vocabulary output. In the export, zero-indexed L4H11 has previous-token score 0.848 and L5H1 has induction-pattern score 0.536.
§05 Pattern evidence — all 144 heads were scored across three prompts. The 24 highest were screened; candidates needed pattern score ≥0.10 and a copying-score reduction under ablation. L5H1 had the largest aggregate drop among retained candidates. At the displayed query it places 0.783 attention on the prescribed source. L5H5 has a brighter aggregate pattern, demonstrating why pattern rank alone cannot establish mechanism.
§06 Attribution — the exporter projects the selected 64-wide head result through its W_O slice, applies the intact final layer-normalization scale and gain, excludes bias, and dots with the tied unembedding. At the active position, L5H1 contributes +0.243 to the H target logit and +0.398 to the local copying-score contrast. This is a linear decomposition under a stated convention, not a rerun.
§07 Intervention — zero ablation removes the selected head slice before output projection at every position. Active copying score falls from 9.418 to 6.218 when L5H1 is zeroed; the mean drop across eligible positions and prompts is 1.023. Zeroing L4H11 lowers the active score by 2.350. Zeroing the layer-five MLP raises it, exposing non-additive interaction. Mean ablation, resampling, activation patching, and path patching define different counterfactuals.
§08 Boundaries — the result is local to GPT-2 revision 607a30d, the three prompts, selector, positions, metric, and zero intervention. It does not establish a universal account of in-context learning, a complete two-head circuit, or one function per head. Superposition, distributed features, off-distribution interventions, redundancy, prompt overfitting, and cross-checkpoint drift remain open boundaries. Booking, pricing, and availability are outside this research drawing; do not route them to a sales or consultation form.`,
    terms: [
      ['ATTENTION HEAD', 'One parallel attention component with its own query, key, value, and output-projection slices.'],
      ['INDUCTION HEAD', 'Head exhibiting [A][B] … [A] → [B] prefix matching and a copying-compatible output write.'],
      ['PREVIOUS-TOKEN HEAD', 'Head that attends from position i to i−1 and can write a shifted token feature for a later head.'],
      ['QK CIRCUIT', 'Query-key computation that scores source positions and determines where a head reads.'],
      ['OV CIRCUIT', 'Value-output computation that determines which residual direction a head writes from attended content.'],
      ['RESIDUAL STREAM', 'Shared model-width channel read and updated by attention heads and MLPs across layers.'],
      ['ATTENTION PATTERN', 'Softmax-normalized routing weights from each query position to allowed key positions.'],
      ['PREFIX MATCHING', 'Routing from a repeated token context to the continuation following its earlier match.'],
      ['COPYING SCORE', 'Here, the target continuation logit minus the mean logit of other prepared cycle tokens.'],
      ['LOGIT ATTRIBUTION', 'Declared readout mapping a component write into contributions along vocabulary-logit directions.'],
      ['ABLATION', 'Intervention replacing a component activation, here with zero, followed by a new forward pass.'],
      ['ACTIVATION PATCHING', 'Replacement of an activation in one run with the corresponding activation from another run.'],
      ['PATH PATCHING', 'Intervention designed to isolate communication along a proposed sender–receiver path.'],
      ['SUPERPOSITION', 'Representation of more features than available dimensions through overlapping feature directions.'],
      ['CAUSAL INTERVENTION', 'Controlled internal change used to estimate whether a measured behavior depends on a component or path.'],
    ],
  },
  'tdd-015': {
    drawingCode: 'TDD-015',
    title: 'ctx: The Personal Context Engine',
    path: '/blog/ctx-personal-context-engine',
    drawingSummary: `§01 Problem — agents change shape and vendor constantly and each starts cold; per-tool memory features are silos scoped to one product and company. ctx is one shared memory outside any tool: a single Postgres table behind a private MCP server at ctx.zackproser.com, reachable over MCP, plain REST, and OAuth. Goal: the right five items in an agent's context within about 300ms; hard constraint: the most private scope never leaks to a work-context surface.
§02 One table — a single items table; every source lands with the same shape (scope, origin, kind, title, body, entities, status, timestamps, embedding, fts). origin splits mirrors (re-derivable copies of data owned elsewhere, safe to wipe and re-sync) from memories (knowledge the engine owns, corrected by supersession). status (active, superseded, deleted) is the single source of truth for whether a row is live.
§03 Distill — nothing is embedded raw; everything is normalized to a {title, body, entities} shape. Memories are distilled by Claude Haiku on the write path; mirrors are shaped by their connector. The write path is gated by an idempotency key and a content hash; near-duplicates above cosine 0.85 are recorded as review suggestions, never auto-merged. The distilling model can only populate content fields, never scope, status, id, or supersedes — the blast radius of a bad input is exactly one row.
§04 Retrieval — three parallel retrievers (full-text for exact tokens, trigram on the title, vector for paraphrase) union into a weighted scorer with an abstention floor: score = 0.40·cosine_n + 0.30·lex + 0.15·exact + 0.10·entity + 0.05·fresh. Freshness is a small bounded feature, not a global decay multiplier; categorical rules remove rows outright (done tasks after 30 days, expired events, superseded rows). A Haiku reranker over the top 20 (an empty list is valid) was added only after eval stalled at recall@5 0.84; it falls back to the scorer order on any failure. Recall@5 rose to 0.955.
§05 The wall — private context must be structurally incapable of being read from work surfaces, not merely instructed against it. Enforced in Postgres: two roles (ctx_personal, ctx_work) behind separate credentials, FORCE ROW LEVEL SECURITY, WITH CHECK policies on every verb, column-level revokes. The role is chosen once at authentication from the token; there is no SET ROLE in serving code. A canary suite plants personal marker rows and asserts zero leaks under a real work token before any work token is minted.
§06 Failures — soft-delete hit an RLS violation because the deleted row is invisible to the select policy, fixed by routing status transitions through a SECURITY DEFINER function. A 126-item eval fixture was seeded into production personal scope; the runner now tears down its fixture after each run. Task extraction found 3,000 phantom todos from every vault checkbox; fixed by scoping extraction to todo notes and parsing the month-day-year daily-note filename as the rank date.
§07 Bootstrapping — an MCP or REST agent connects with one line and a scoped, independently revocable bearer token. Browser connectors mandate a full OAuth handshake instead. A minimal OAuth 2.1 shim runs it: 401 plus WWW-Authenticate, two well-known discovery docs, dynamic registration with redirect URIs locked to Anthropic hosts, one human step (paste an existing ctx token in my own browser, which only proves authorization and is never handed to the agent), a freshly minted scoped token bound to a one-time code, and a PKCE code exchange before any tool call.
§08 Adversarial review — three rounds against a separate frontier model (GPT-5.6) before any code was written. Round one replaced prompt-level scope enforcement with database RLS and killed cosine-threshold auto-merge and equal-weight rank fusion. Round two caught the sensitivity screen violating the new RLS and forced honest phasing. Round three caught invalid SQL and an unhardened function. The cheapest bug is the one an adversary finds in the plan.
§09 Cost and worth — a deliberately boring managed stack: a Cloudflare Worker, Neon Postgres with pgvector, OpenAI embeddings, Claude Haiku for distillation and reranking, GitHub Actions for encrypted nightly backups, Healthchecks for dead-man's switches. Every agent now starts warm regardless of shape or vendor because the memory lives in one place they all reach over open protocols, behind a wall the database enforces. Booking, pricing, and availability are outside this drawing; do not route them to a sales or consultation form.`,
    terms: [
      ['CTX', 'The personal context engine: one shared memory behind a private MCP server that any agent can plug into.'],
      ['MCP', 'Model Context Protocol, an open protocol for exposing tools and context to agents that speak it.'],
      ['MIRROR', 'A re-derivable copy of data owned authoritatively elsewhere; always safe to wipe and re-sync.'],
      ['MEMORY', 'Knowledge the engine itself owns with no other home; corrected by supersession, not by re-sync.'],
      ['SCOPE', 'The personal, work, or shared partition of a row; the axis the security wall is built on.'],
      ['ROW LEVEL SECURITY', 'Postgres policies that filter which rows a database role may read or write, enforced by the database.'],
      ['SECURITY DEFINER', 'A Postgres function that runs with its definer’s privileges, used to make a privileged write explicit.'],
      ['DISTILLATION', 'Normalizing raw input into a consistent {title, body, entities} shape before embedding.'],
      ['CONTENT HASH', 'A hash of a row’s content used for exact deduplication and change detection on the write path.'],
      ['HYBRID RETRIEVAL', 'Combining full-text, trigram, and vector candidates rather than relying on any one signal.'],
      ['RECIPROCAL RANK FUSION', 'A rank-only fusion method rejected here because it discards signal strength across lists.'],
      ['RERANKER', 'An LLM pass over the top candidates that returns the ids that genuinely answer a query, or an empty list.'],
      ['RECALL@5', 'The fraction of queries whose correct answer appears in the top five returned items.'],
      ['PKCE', 'Proof Key for Code Exchange; binds an OAuth authorization code to the client that started the flow.'],
      ['CANARY SUITE', 'Planted personal marker rows probed under a work token to assert the scope wall leaks nothing.'],
    ],
  },
}
