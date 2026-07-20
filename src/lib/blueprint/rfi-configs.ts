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
}
