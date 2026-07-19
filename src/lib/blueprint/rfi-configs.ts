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
  return `You are the RFI (Request For Information) desk for Blueprint Deep Dive ${cfg.drawingCode}, "${cfg.title}," a technical deep dive on zackproser.com by Zack Proser. The reader asks from a side panel while reading. Voice: plain language, direct, warm, practitioner-to-practitioner, zero condescension, no fluff.

THE DRAWING (your source of truth):
${cfg.drawingSummary}

TERMS (Appendix A):
${terms}

${VOICE_RULES}`
}

export const RFI_CONFIGS: Record<string, RfiConfig> = {
  'tdd-001': {
    drawingCode: 'TDD-001',
    title: 'The Transformer',
    path: '/blog/the-transformer',
    drawingSummary: `§01 The sequence problem — RNNs read serially (O(n) sequential steps, lossy fixed-size memory); transformers let every token attend to every other in parallel (O(1) sequential steps, O(n²) work). More math for less waiting.
§02 Tokens & embeddings — BPE subwords, vocab ~50k–200k; IDs index a learned embedding table producing d_model-wide vectors (512–12288); geometry encodes meaning; tokenization is why models can't spell.
§03 Attention — each token emits query/key/value via learned W_Q, W_K, W_V. Attention(Q,K,V) = softmax(QK⊤/√d_k)V. √d_k stops dot products from saturating the softmax. Demo sentence: "The animal didn't cross the street because it was too tired" — "it" attends to "animal."
§04 Multi-head — 8–128 parallel heads, each d_model/h wide, same total compute; heads learn jobs (previous-token, syntax, coreference, induction heads → best current account of in-context learning).
§05 Positional encoding — PE(pos,2i)=sin(pos/10000^(2i/d)), cos on odd dims; unique barcode per position; fixed offsets are linear maps of the encoding; modern models use RoPE (rotations of Q/K).
§06 The block — pre-norm decoder block: LN→multi-head attention→residual add, LN→FFN→residual add; FFN(x)=W₂·GELU(W₁x+b₁)+b₂, ~4× model width, holds ~2/3 of parameters and much factual knowledge; the residual stream is the shared bus; stack N=12–120+.
§07 Sampling — final projection gives one logit per vocab entry; softmax with temperature T divides logits first; T→0 argmax, T→∞ uniform; top-k/top-p/beam are selection policies over the same distribution; KV cache stores past keys/values so each new token is one forward pass (and why long context costs memory).
§08 Scale — same circuit since 2017; params ≈ 12·N·d²; loss follows smooth power laws in compute; Transformer 65M (2017) → GPT-4 ~1.8T (estimated). RoPE, RMSNorm, SwiGLU, GQA, MoE are margin revisions, not new sheets.`,
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
    ],
  },
  'tdd-002': {
    drawingCode: 'TDD-002',
    title: 'The Embedding Space',
    path: '/blog/the-embedding-space',
    drawingSummary: `§01 String matching — lexical search handles exact tokens, IDs, names, and quotes but misses equivalent intent expressed with different words; embeddings replace brittle synonym rules with learned semantic comparison.
§02 Coordinates — an embedding is x∈ℝ^d, usually hundreds or thousands of learned coordinates with distributed meaning; one encoder maps variable-length objects to a fixed-width vector. Never compare vectors from unrelated models, even at equal dimensionality; a 1,536-d float32 vector is 6,144 bytes before index overhead.
§03 Geometry — training places related items nearby and can encode useful relationship directions, though analogies are intuition rather than universal algebra. Cosine similarity is (x·y)/(‖x‖₂‖y‖₂), ranging from −1 to 1; calibrate thresholds on the real task because absolute scores are corpus-dependent.
§04 Training — contrastive learning pulls positive pairs together relative to negatives; simplified InfoNCE treats the matching passage as the correct item among batch candidates and temperature τ controls sharpness. Data defines similarity; false negatives punish truly related items, while trivial negatives teach little.
§05 Unit sphere — L2 normalization projects vectors onto the unit hypersphere and removes magnitude. For unit vectors cosine equals dot product, and Euclidean distance produces the same ranking via ‖x−y‖²=2−2x·y; follow the model's documented metric and normalization contract.
§06 Vector search — exact search scans every vector; ANN trades controlled recall for fewer comparisons. HNSW navigates sparse long-range upper layers then dense local layers; tune construction, degree, and search breadth, measure recall against exact top-k, and account for filters, deletes, replication, and persistence.
§07 Failure lines — chunks can be too broad or too context-poor; domain shift changes what similarity should mean; high-dimensional distance can crowd; model, pooling, normalization, instruction, or preprocessing changes create incompatible coordinates. Version the entire embedding/index contract and migrate by rebuilding a separate index.
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
    ],
  },
  'tdd-003': {
    drawingCode: 'TDD-003',
    title: 'The RAG Pipeline',
    path: '/blog/the-rag-pipeline',
    drawingSummary: `§01 External memory — model weights hold compressed training patterns, not a dependable current database. Retrieval supplies private, current, attributable evidence without parameter changes; long context works when material is already selected, fine-tuning targets behavior, and tools serve exact live state or actions.
§02 Pipeline — offline path: source→parse→chunk→embed→vector/text index; online path: query→rewrite→retrieve→rerank→assemble→generate. Preserve IDs, ACLs, provenance, component versions, candidates, final context, answer, and citations; freshness and deletion are ingestion responsibilities.
§03 Chunking — fixed windows are predictable, structure-aware chunks follow document boundaries, semantic chunks detect topic shifts, overlap protects boundaries but duplicates storage/results, and parent-child retrieval matches small units then returns larger context. Start from structure and evaluate a range on real questions.
§04 Retrieval — dense search handles paraphrase and conceptual matches; BM25 handles exact rare terms, IDs, and quoted language; hybrid combines both, often by reciprocal rank fusion because raw scales differ. Apply security and metadata filters inside retrieval when possible.
§05 Reranking — bi-encoders independently encode query/passages for fast high-recall search; cross-encoders jointly read each query-candidate pair for slower, more precise ranking. Retrieve wide then rerank a shortlist; reranking cannot recover candidates the first stage missed.
§06 Context budget — reserve tokens for instructions, history, query, and output, then pack selected evidence. Remove duplicates, preserve source boundaries, account for lost-in-the-middle behavior, order strong evidence deliberately, specify citation/abstention rules, and count with the target tokenizer.
§07 Eval & failures — trace corpus→parse→retrieve→rerank→assemble→generate. Retrieval: hit rate@k, recall@k, MRR, nDCG, latency; generation triad: context relevance, faithfulness, answer relevance. Use a human-reviewed set covering unanswerable, exact, paraphrase, ACL, stale, conflicting, table, and multi-hop cases.
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
    ],
  },
}
