
# Blueprint Series Content and Newsletter Strategy

Date: 2026-07-19

> **Renumbering note (2026-07-19):** TDD-005 was claimed by **The Workshop**
> (gold-standard AI training workshops → RFP commission funnel), which jumped
> the queue by editorial decision. The technical slate below shifts by one:
> The Vector Database → TDD-006, The Context Window → TDD-007, The Speech
> Pipeline → TDD-008, The Agent Loop → TDD-009. Priorities and content are
> unchanged.

## Executive recommendation

Publish the next five drawings in this order:

1. TDD-004 — The Tokenizer
2. TDD-005 — The Vector Database
3. TDD-006 — The Context Window
4. TDD-007 — The Speech Pipeline
5. TDD-008 — The Agent Loop

The order weighs expected organic traffic, Zack's existing authority, internal-link support, distinction from TDD-001 through TDD-003, and the effort required for a useful client-side interactive. The Tokenizer is the clear first post because the site already has a substantial tokenization demo and TDD-001 introduces the subject without owning the full query. The Vector Database follows because the site's Pinecone, RAG, embeddings, and database comparison archive gives it the strongest internal-link base. The Context Window has broad demand and a cheap interactive, but needs careful scope control to avoid repeating the Transformer and RAG drawings. The Speech Pipeline connects a rare technical explainer to the site's voice audience and demos. The Agent Loop has strong internal support and weak general explainers in current results, though its terminology is still changing faster than the other four.

For newsletter capture, add one primary end-of-drawing **NEXT SHEET** card and one secondary compact **SUBSCRIBE TO THE SERIES** row below the title block. Both should state the utility directly: one complete technical drawing by email when it is issued. Keep every sheet and every RFI answer free. Do not apply `requiresEmail` to these posts.

## Method and limits

This recommendation is based on:

- All three existing Blueprint `page.mdx` files and their metadata.
- The seven demo families under `src/app/demos/`, plus `/chat`.
- The 165 indexable posts and six cluster assignments in `src/data/corpus.json`.
- Relevant directory names and metadata samples across the larger content directory, including the Granola, WisprFlow, voice, RAG, vector database, agent, fine-tuning, and infrastructure groups.
- The current article layouts, RFI desk, subscription forms, subscription APIs, commerce gate, and metadata handling.
- Directional search-result checks on 2026-07-19 for the candidate query families.

No keyword-volume source is present in the repo, and no paid keyword database was used. Search-demand claims below are relative, based on query breadth, recurring developer intent, the current result set, and the site's ability to support a page with relevant internal links. They should not be read as monthly-search estimates.

## What the existing drawing format does well

TDD-001 through TDD-003 establish a repeatable editorial contract:

- An abstract followed by eight numbered sheets.
- One question per sheet, explained through prose, equations, notes, and SVG schematics.
- Small interactive models that expose one variable at a time.
- Production failure lines, operating limits, and decision boundaries rather than a purely academic explanation.
- A references appendix when supplied, followed by an RFI desk whose answers cite sheet numbers.
- A title block with drawing number, subject, scale, author, and reading time.

The next subjects should have a visible circuit, adjustable variables, and failure modes that can be located on that circuit. All five selected topics satisfy that test.

# Part 1 — The next five drawings

## Priority 1: TDD-004 — The Tokenizer

**Working title:** The Tokenizer  
**SUBJECT:** TOKENIZATION  
**Slug:** `/blog/the-tokenizer`

### Search demand and ranking case

Primary head queries:

- `tokenizer`
- `LLM tokenizer`
- `what is tokenization in AI`
- `how tokenization works`
- `BPE tokenizer`

Long-tail queries:

- `how does an LLM tokenizer work`
- `how byte pair encoding works`
- `why do LLMs use tokens instead of words`
- `why token counts differ between models`
- `how tokenization affects context window`
- `how tokenization affects LLM cost`
- `why LLMs struggle with spelling and numbers`

The intent is evergreen and mechanical. Readers want to see text become vocabulary entries and IDs, not read release news. Current results for broad tokenization questions split between formal papers, general reference pages, library documentation, and small tutorials. A single drawing that shows vocabulary training, merge order, encoding, decoding, multilingual fragmentation, cost, and failure cases can serve the whole query family.

TDD-001 covers tokens in one sheet, which creates a strong feeder page. The new post must go further: how the vocabulary is trained, why merge order matters, how byte fallback works, why whitespace and Unicode change splits, and how the token boundary affects context, price, latency, and model behavior. Keep TDD-001 focused on the full Transformer and make TDD-004 the canonical tokenization explainer. Link the short treatment in TDD-001 to TDD-004 with descriptive anchor text.

### Internal-link plan

Link from and to:

- [The Transformer](/blog/the-transformer), especially §02.
- [Interactive tokenization demo](/demos/tokenize).
- [The Context Window](/blog/the-context-window) when TDD-006 ships.
- [The RAG Pipeline](/blog/the-rag-pipeline), especially the context-budget and chunking sheets.
- [The Embedding Space](/blog/the-embedding-space), where tokens become encoder inputs.

The existing `/demos/tokenize` page already covers character, word, BPE, WordPiece, model-style tokenization, token IDs, pricing, prepared examples, and a quiz. TDD-004 should link to it as the larger lab while embedding a smaller drawing-native interactive.

### Eight-sheet editorial outline

1. Text is not a model input.
2. Vocabulary training and the merge table.
3. Encoding text by applying ordered merges.
4. Bytes, Unicode, whitespace, and fallback.
5. Token IDs and the embedding lookup table.
6. Context, compute, latency, and price.
7. Failure lines: spelling, arithmetic, code, names, and unequal language costs.
8. Alternatives and design boundaries: BPE, WordPiece, Unigram, bytes, and learned token-free approaches.

### Client-side interactive concepts

**BPE merge bench.** Start with a six-line toy corpus. A step control applies one merge at a time, updates the vocabulary, and redraws the encoded sample. Readers can change one corpus frequency and see a different merge table emerge. Arrays, string counts, and React state are sufficient.

**Boundary and budget inspector.** Ship a small static merge table for prepared English, code, emoji, and multilingual examples. Color token boundaries, show token IDs, and update a context/cost meter as the text changes. Label the table as an instructional tokenizer rather than claiming exact parity with a current commercial model.

### Expected effort and risk

Effort is low. Most interaction and explanatory groundwork already exists. The main risk is duplication with `/demos/tokenize` and TDD-001. The merge-training schematic and a clear canonical-link structure solve that problem.

## Priority 2: TDD-005 — The Vector Database

**Working title:** The Vector Database  
**SUBJECT:** VECTOR SEARCH  
**Slug:** `/blog/the-vector-database`

### Search demand and ranking case

Primary head queries:

- `vector database`
- `what is a vector database`
- `how vector databases work`
- `vector search`
- `vector database explained`

Long-tail queries:

- `vector database vs relational database`
- `vector database vs vector index`
- `how HNSW search works`
- `how vector databases store embeddings`
- `metadata filtering vector database`
- `vector database for RAG`
- `Pinecone vs FAISS vs pgvector`
- `when do I need a vector database`

This is the site's strongest authority match. Zack has a Pinecone work history, a complete vector-database comparison page, production and CI/CD posts, six pairwise database comparisons, a Pinecone reference-architecture group, two embedding explainers, two RAG explainers, and interactive RAG and embedding demos.

The head query is competitive because database vendors publish large glossary pages. The opening comes from separating three ideas that many incumbents mix together: an embedding model creates vectors, an ANN index finds neighbors, and a database supplies persistence, updates, filters, deletion, isolation, and operations. TDD-002 already explains vector geometry and HNSW intuition. TDD-005 should own the system around the index: write path, read path, filtering, consistency, lifecycle, scale, and the choice between an embedded index and a managed database.

### Internal-link plan

Link from and to:

- [The Embedding Space](/blog/the-embedding-space).
- [The RAG Pipeline](/blog/the-rag-pipeline).
- [Vector Databases Compared](/blog/vector-databases-compared).
- [RAG Evaluation](/blog/rag-evaluation).
- [Vector Databases: CI/CD](/blog/vector-databases-ci-cd).
- [RAG visualized](/demos/rag-visualized) and the [embeddings demo](/demos/embeddings).

Update the comparison hub and pairwise comparison pages to point to TDD-005 as the neutral “how the system works” reference. TDD-005 should return readers to comparison pages only after explaining the selection criteria.

### Eight-sheet editorial outline

1. Why ordinary indexes do not answer nearest-neighbor queries.
2. The write path: object, embedding, ID, metadata, and index insertion.
3. Exact search and approximate search.
4. HNSW, IVF, and product-quantization tradeoffs.
5. Metadata filters, namespaces, and multi-tenant isolation.
6. Updates, deletes, compaction, replication, and consistency.
7. Evaluation: recall, latency, memory, freshness, and filtered recall.
8. Selection boundary: library, database extension, search engine, or managed service.

### Client-side interactive concepts

**Index traversal simulator.** Place 80 deterministic points in an SVG. Toggle exact scan and graph traversal. Animate visited nodes, comparisons, returned neighbors, and missed true neighbors. Controls for search breadth show the latency/recall trade.

**Filter-order failure demo.** Assign tenant and document-status metadata to the same points. Compare filter-during-search with top-k-then-filter. A selective filter makes post-filtering return too few legal results even though suitable points exist.

### Expected effort and risk

Effort is medium. The point geometry and search animation are straightforward, but an honest ANN simulation needs careful labeling. The largest risk is cannibalization with TDD-002. Keep geometry and embedding training in TDD-002; keep storage and database behavior in TDD-005.

## Priority 3: TDD-006 — The Context Window

**Working title:** The Context Window  
**SUBJECT:** CONTEXT  
**Slug:** `/blog/the-context-window`

### Search demand and ranking case

Primary head queries:

- `context window`
- `LLM context window`
- `what is a context window`
- `context length`
- `AI context window explained`

Long-tail queries:

- `how does an LLM context window work`
- `context window vs memory`
- `what happens when context window is exceeded`
- `why long context gets expensive`
- `lost in the middle LLM`
- `context window vs RAG`
- `how KV cache scales with context length`
- `how to manage context in AI agents`

The query family crosses end users, application developers, and inference engineers. It recurs whenever a model advertises a larger window, but the underlying mechanics are stable: tokens occupy positions, attention and the KV cache consume resources, applications assemble a bounded prompt, and effective use can fall short of the advertised maximum.

Current broad results include a management-consulting explainer, Wikipedia, model-comparison pages, and research papers. There is room for one page that connects the application-level budget to Transformer mechanics and inference memory. The schematic format is well suited to showing a fixed-width allocation bar, prefill and decode, eviction or summarization, and evidence placement.

Scope is the main SEO issue. TDD-001 mentions positions and the KV cache; TDD-003 has a context-budget sheet. TDD-006 should become the canonical full explanation and let those posts retain their local applications. Avoid current-model maximum tables in the main article. They age quickly and attract a different maintenance burden.

### Internal-link plan

Link from and to:

- [The Transformer](/blog/the-transformer), especially positional encoding and sampling.
- [The Tokenizer](/blog/the-tokenizer).
- [The RAG Pipeline](/blog/the-rag-pipeline), especially §06.
- [RAG visualized](/demos/rag-visualized).
- [RAG pipeline tutorial](/blog/rag-pipeline-tutorial).
- [Chat with my writing](/chat).

### Eight-sheet editorial outline

1. The window is a bounded token sequence, not durable memory.
2. What occupies it: system instructions, tools, history, evidence, query, and output reserve.
3. Position information and trained range.
4. Prefill, decode, and attention cost.
5. The KV cache and why concurrency consumes memory.
6. Effective context: distraction, conflict, and lost-in-the-middle behavior.
7. Management patterns: retrieval, trimming, summarization, compaction, and external state.
8. Selection boundary: long context, RAG, tools, fine-tuning, or a combination.

### Client-side interactive concepts

**Context packing board.** Readers drag or resize system, tool, history, evidence, query, and output segments inside a fixed token rail. Changing the model window or tokenizer estimate exposes overflow and shows which segment an application policy would trim.

**Recall-position test.** Hide a small fact near the beginning, middle, or end of a synthetic prompt and show a clearly labeled illustrative retrieval-probability curve. Let readers add distractors and conflicting facts. This must be presented as a teaching model, not a measured benchmark.

**KV memory meter.** Controls for layers, KV heads, head dimension, precision, sequence length, and concurrent requests update the cache-size formula. This absorbs The KV Cache as a sheet rather than spending a full drawing on a narrower query.

### Expected effort and risk

Effort is low to medium. All interactives can run on arithmetic and local state. The risk is factual drift if the page uses current vendor limits. Keep the central drawing model-agnostic and move any examples with dates into notes.

## Priority 4: TDD-007 — The Speech Pipeline

**Working title:** The Speech Pipeline  
**SUBJECT:** SPEECH RECOGNITION  
**Slug:** `/blog/the-speech-pipeline`

### Search demand and ranking case

Primary head queries:

- `speech to text`
- `how speech to text works`
- `automatic speech recognition`
- `ASR pipeline`
- `voice AI pipeline`

Long-tail queries:

- `how automatic speech recognition works`
- `waveform to text pipeline`
- `what is voice activity detection`
- `speaker diarization vs transcription`
- `how meeting transcription works`
- `streaming ASR latency`
- `how Whisper transcribes audio`
- `ASR word error rate explained`
- `speech to speech AI pipeline`

Search results for the full speech path are fragmented. Major hardware and speech vendors explain ASR at a high level, while newer niche pages cover pieces such as waveform framing, end-of-utterance detection, diarization, or real-time voice agents. A drawing that follows pressure samples through frames, features, recognition, timestamps, speakers, language cleanup, and optional TTS can cover a broad and durable family of questions.

The site has direct subject fit through the voice AI demo and its existing `VoicePipelineVisualization`, separate lawyer and realtor voice demos, a visible WisprFlow review, and visible Granola and untethered-development posts. The larger content directory contains many more voice and meeting pages, but many carry `hiddenFromIndex`. Treat those as distribution and conversion pages, not as proof of indexable authority. Link from the strongest visible pages first.

The title is distinctive, but the description, eyebrow, first paragraph, and sheet headings should state “how speech-to-text and automatic speech recognition work” to match the main query language.

### Internal-link plan

Link from and to:

- [Voice AI interactive demo](/demos/voice-ai).
- [Voice AI for lawyers demo](/demos/voice-ai-lawyers).
- [Voice AI for realtors demo](/demos/voice-ai-realtors).
- [WisprFlow Review: I Write Code at 179 WPM](/blog/wisprflow-review).
- [One Button Ended My Meeting Anxiety](/blog/granola-meeting-anxiety-one-button).
- [My 2026 AI Engineer Setup](/blog/2026-ai-engineer-setup).

Hidden campaign pages such as the no-bot transcription guides may also link to the drawing where useful, but the main link plan should not depend on them.

### Eight-sheet editorial outline

1. Air pressure becomes sampled numbers.
2. Framing, frequency features, and learned audio representations.
3. Voice activity detection and endpointing.
4. Acoustic recognition: audio frames to token probabilities.
5. Decoding, language priors, punctuation, and formatting.
6. Timestamps, alignment, and speaker diarization.
7. Streaming latency, overlap, noise, accents, and word error rate.
8. The larger voice loop: ASR, language model, tools, TTS, interruption, and privacy.

### Client-side interactive concepts

**Waveform-to-transcript bench.** Use a short bundled or synthetic waveform. Animate sample points, frames, a simplified spectrogram, speech regions, token hypotheses, and the final transcript. A scrubber moves the active frame through every stage.

**Failure mixer.** Controls for background noise, speaker overlap, endpoint delay, and domain vocabulary adjust deterministic confidence values and error annotations. Readers can compare raw transcript, punctuation pass, and diarized transcript.

**Latency budget.** Sliders for chunk size, endpointing, ASR first token, language-model first token, and TTS first audio update a stacked latency rail. This can reuse ideas from the current voice pipeline without importing a third-party audio or chart package.

### Expected effort and risk

Effort is medium. The site already has the pipeline concepts and interaction patterns, but a good waveform and spectrogram treatment takes more design work than the first three topics. Avoid claiming that one architecture represents every modern ASR system. Label CTC, transducer, encoder-decoder, and speech-to-speech models as distinct paths.

## Priority 5: TDD-008 — The Agent Loop

**Working title:** The Agent Loop  
**SUBJECT:** AGENTS  
**Slug:** `/blog/the-agent-loop`

### Search demand and ranking case

Primary head queries:

- `AI agent`
- `AI agent architecture`
- `agent loop`
- `how AI agents work`
- `LLM agent loop`

Long-tail queries:

- `tool calling loop explained`
- `how LLM agents use tools`
- `AI agent observe act loop`
- `agent loop stop conditions`
- `AI agent context management`
- `AI agent retries and permissions`
- `how coding agents work`
- `agent harness vs model`

The core loop is durable: assemble context, call the model, receive text or a structured tool request, execute the tool in a host runtime, append the result, and repeat until completion or a stop condition. Official tool-use documentation describes the pieces, while current broad results include many young, generic explainer sites. That gives a well-drawn implementation-level article a chance to earn links and rankings.

The site has 54 indexable posts in AI-assisted development, including agent fleets, orchestrators, PR-opening agents, remote agents, mechanic agents, and autonomy boundaries. Those pages describe systems Zack has built. TDD-008 can supply the neutral reference architecture they currently lack.

Terminology is moving quickly, and “AI agent” is much broader than “agent loop.” The article should target the broad query in its description and section headings while keeping the drawing itself on the runtime loop. Framework comparisons and current product capabilities should remain outside the core article.

### Internal-link plan

Link from and to:

- [The Agent Fleet That Runs My Business](/blog/the-agent-fleet).
- [The Orchestrator Pattern](/blog/orchestrator-pattern).
- [Build Agents That Open PRs](/blog/build-agents-that-open-prs).
- [The Autonomy Boundary](/blog/the-autonomy-boundary).
- [My AI Agent Has a Mechanic Agent](/blog/my-ai-agent-has-a-mechanic-agent).
- [AI Pipelines and Agents with Mastra](/blog/ai-pipelines-and-agents-mastra).

### Eight-sheet editorial outline

1. A model call and an agent run are different units.
2. Tool definitions, schemas, and selection.
3. The model/tool-result loop.
4. Context assembly and working state.
5. Plans, subgoals, and when planning helps.
6. Stop conditions, budgets, retries, and idempotency.
7. Permissions, approval points, traces, and failure recovery.
8. The boundary between workflow, agent, and multi-agent system.

### Client-side interactive concepts

**Deterministic agent runner.** Give the reader a small task such as “find the failing service and draft a fix.” Each step exposes the messages sent to the model, the selected tool, arguments, tool output, growing context, token cost, and stop decision. The model decisions are a local state machine, so no API or dependency is needed.

**Failure injection panel.** Toggle malformed tool arguments, timeout, stale observation, repeated action, permission denial, and exhausted step budget. Readers choose retry, repair, request approval, or stop, then see the resulting trace.

### Expected effort and risk

Effort is medium. The client state machine is easy; the editorial work must distinguish stable runtime mechanics from framework-specific vocabulary. There is also some topical overlap with The Autonomy Boundary. Keep that post about authority and human control; keep TDD-008 about execution.

## Candidate decision table

| Candidate | Decision | Reason |
|---|---|---|
| The Tokenizer | Accept as TDD-004 | Exact existing demo, broad evergreen intent, low build cost, and a clean expansion of TDD-001 §02. |
| The Vector Database | Accept as TDD-005 | Best authority match in the archive and strong head plus comparison queries. Scope it around database operations to avoid repeating TDD-002. |
| The Context Window | Accept as TDD-006 | Broad recurring query family, weak mixed incumbents, cheap interactives, and links across Transformer, RAG, chat, and tokenization. |
| The Speech Pipeline | Accept as TDD-007 | Strong connection to voice demos and commercial content, fragmented current explainers, and a naturally visual pipeline. |
| The Agent Loop | Accept as TDD-008 | Large agent archive, weak general explainers, and a client-side state machine that makes the core loop concrete. |
| The Fine-Tune (LoRA) | Hold for TDD-009 or later | Good evergreen mechanics and existing LoRA/fine-tuning posts, but less site authority and a higher-effort matrix/training demo than the first three. “The Adapter” is a cleaner series title, with LoRA and QLoRA in the subtitle. |
| The KV Cache | Fold into TDD-006 | Valuable but narrower, already introduced in TDD-001, and best understood beside prefill, decode, context length, concurrency, and memory. A later “The Inference Engine” could cover KV cache, batching, PagedAttention, quantization, and serving as one system. |
| The Eval Harness | Hold | Strong practitioner value and good fit with RAG evaluation and agent work, but the head query is narrower and current official material is strong. Reconsider after TDD-008 creates a natural upstream page. |
| The MCP Server | Hold | Current interest is high, but official MCP documentation owns the definitional intent and the protocol changes faster than a drawing should. A more durable later subject is “The Tool Call,” with MCP as one transport and discovery method. |
| The Diffusion Model | Reject for this batch | Large search demand, but weak connection to the current indexable archive, strong incumbents, rapidly changing image architectures, and the highest interactive-production cost. |

## Publication and internal-link sequence

Publish in numerical order. Each new drawing should add links in both directions on release day:

1. TDD-004 links TDD-001, TDD-002, TDD-003, and `/demos/tokenize` into one token-to-retrieval path.
2. TDD-005 completes the embeddings → database → RAG chain and receives links from the comparison archive.
3. TDD-006 links tokenization, Transformer mechanics, RAG context assembly, and agent context management.
4. TDD-007 creates a technical destination for the visible voice pages and demos.
5. TDD-008 turns the agent archive into a hub-and-spoke cluster and links back to context, RAG, and tools.

Use descriptive anchors that match the destination's question: “how BPE tokenization works,” “how a vector database searches and filters embeddings,” and “how an AI agent tool loop runs.” Avoid making every anchor the exact page title.

# Part 2 — Newsletter capture for Blueprint posts

## Current capture mechanics

The current path has several separate systems:

1. **Editorial articles.** `EditorialArticleLayout.tsx` renders `EditorialNewsletter.tsx` after the article body and any cluster rail. The form posts to `/api/form`, records a Vercel Analytics event and a GTM event, and sends the pathname as the referrer. It is an end card in the current editorial layout. An older `NewsletterWrapper` still contains sticky behavior, but `EditorialArticleLayout` does not use it.
2. **Per-post suppression.** `hideNewsletter` is copied from metadata by `content-handlers.ts` and suppresses the editorial end card. It has no effect on the Blueprint layout because that layout does not accept or render the editorial newsletter component.
3. **Blueprint articles.** The Blueprint branch returns `BlueprintArticleLayout` directly when `blogStyle` is `blueprint` and there is no paid or email commerce gate. The layout renders the drawing, RFI desk, RFI drawer, local drawing log, and colophon. It makes no subscription request and has no newsletter component.
4. **General subscription.** `/subscribe` renders `SubscribeForm` twice and posts to `/api/form`. The API subscribes through Resend, applies explicit and referrer-derived tags, uses a honeypot, and deduplicates repeat submissions for 30 seconds.
5. **Waiting lists.** `/api/waitinglist-subscribe` adds a product-specific `waitlist:<slug>` tag. The Blueprint series is an ongoing publication, not a product waitlist, so `/api/form` is the correct endpoint.
6. **Email-gated content.** `commerce.requiresEmail` triggers a server-side Resend subscription check tied to the authenticated session email. `renderPaywalledContent` then returns full content or an email gate. The Blueprint route explicitly excludes any post with `requiresEmail`, so an unsubscribed reader receives the editorial layout instead of the drawing layout.
7. **Paid content.** Paid commerce also forces the editorial layout, where `MiniPaywall` can appear. `MiniPaywall` is a purchase prompt and does not fit series subscription.

The practical result is zero native capture on TDD-001 through TDD-003 today.

## Ranked mechanisms

### 1. Primary: end-of-drawing NEXT SHEET card

**Proposed copy**

> NEXT SHEET · TDD-00N  
> GET THE NEXT DRAWING  
> One complete technical schematic, issued by email when it is ready.  
> `[you@company.com] [SEND THE NEXT DRAWING →]`  
> Free. One-click unsubscribe.

When the next title is committed, show it: `IN PRODUCTION · TDD-005 · THE VECTOR DATABASE`. When it is not, use `NEXT SUBJECT UNDER REVIEW` rather than a vague promise.

**Expected conversion mechanics**

Readers who reach the end have consumed the product and understand the format. The offer names the next unit, the delivery channel, and the frequency. It follows the same utility-first pattern as the no-bot Granola CTA that converted at 27.8%: the user gets a concrete outcome, with no puzzle or personality test between intent and form.

**Annoyance cost:** Low. It appears after the full drawing, does not obscure content, and requires no dismissal.

**Implementation sketch**

- Add a client component such as `src/components/blueprint/BlueprintSeriesCapture.tsx`.
- Render the full `next-sheet` variant in `BlueprintArticleLayout.tsx` after the RFI desk and before the colophon. This keeps the appendix sequence intact and makes the card part of the issued drawing.
- Post to `/api/form` with the pathname, honeypot, and explicit tags `interest:blueprint-series`, `interest:ai-engineering`, and `source:blog`.
- Add optional `blueprint.nextDrawing` metadata with number, title, subject, and status so each post can advertise the correct next sheet without hard-coded component logic.
- Add drawing-native rules to `src/styles/blueprint-deep-dive.css`: ruled cells, mono labels, accent registration marks, and the existing dark/light variables.
- On success, replace the form with `REVISION DISTRIBUTION LIST · ADDRESS RECORDED` and persist a local success flag so the secondary form also disappears on that device.

**Measure**

- `blueprint_capture_impression` when at least half the card is visible.
- `blueprint_capture_start` on input focus.
- `blueprint_capture_submit`, `success`, and `error`.
- Success per visible-card session, success per form start, and error rate.
- Results by drawing number, traffic source, device, and new versus returning visitor.
- Seven- and 30-day unsubscribe rate, welcome-email open rate, and click rate for this source tag.

### 2. Secondary: title-block SUBSCRIBE TO THE SERIES row

**Proposed copy**

> DISTRIBUTION · REVISIONS ISSUED BY EMAIL  
> Get the next complete drawing. `[email] [ADD ME →]`

Use a text link in the colophon — `REVISION DISTRIBUTION →` — to focus this row or the end card. Do not add a third form.

**Expected conversion mechanics**

Every reader sees the title block, including visitors who arrive for one definition and leave before the final sheets. The engineering-document language makes the placement native, while “Get the next complete drawing” states the outcome directly.

**Annoyance cost:** Low to medium. It adds density above the article and asks before the reader has sampled the format. Keep it to one line on desktop and two compact rows on mobile. Do not animate or make it sticky.

**Implementation sketch**

- Reuse `BlueprintSeriesCapture` with a `title-block` variant.
- Render it below `bp-titleblock-grid`, outside the `<dl>` so the HTML remains valid.
- Give it a separate location value such as `blueprint:title-block:TDD-004`.
- Share success state with the primary placement through a small context provider or a `storage`/custom event. A successful signup in either placement should replace or hide both forms.
- Preserve keyboard order and prevent the form from disturbing the existing sheet-index and theme controls.

**Measure**

- The same funnel events with `placement: title-block`.
- Title-block success per page session.
- Masthead-to-§01 continuation rate, to catch any drop caused by the added form.
- Primary-versus-secondary assisted conversion: a reader may first see the title row and submit at the end.

### 3. RFI desk follow-up

**Proposed behavior**

Always answer the question first. After the first successful RFI answer, show one quiet line below the answer:

> RFI CLOSED. Want the next drawing's RFI desk in your inbox? `[email] [NOTIFY ME →]`

The drawing log can also offer `EMAIL ME THIS LOG + FUTURE DRAWINGS`, with explicit consent text. Keep local viewing and a client-side download free. Requiring email for a local log that already exists would feel artificial.

**Expected conversion mechanics**

RFI users have shown high engagement and received immediate value. The invitation connects that value to the next drawing rather than interrupting the question. Its reach will be much lower than either page-level form.

**Annoyance cost:** Medium if shown once after an answer; high if repeated after every answer or required before viewing the answer.

**Implementation sketch**

- Add the compact capture to the successful assistant-message state in `BlueprintArticleLayout.tsx`.
- Show it once per drawing after the first completed answer, and suppress it after success or dismissal for that device.
- If email delivery of the log is built, create a separate endpoint for the log payload and newsletter consent. Do not overload `/api/blueprint-rfi`, whose current responsibility is question answering.

**Measure**

- Eligible RFI sessions, offer impressions, dismissals, starts, and successes.
- RFI completion and second-question rates before and after the offer.
- Signup rate per answered RFI rather than per page view.

### 4. Mid-scroll margin-note CTA

**Proposed copy**

> DISTRIBUTION NOTE  
> Reading the whole set? Get the next drawing by email. `ADD ADDRESS →`

**Expected conversion mechanics**

It reaches engaged readers before the appendix and uses the drawing's annotation column. It can point to the end form or expand a small inline email field.

**Annoyance cost:** Medium. A CTA in the explanation competes with technical notes. The existing `BpNote` column is hidden at narrower widths, so a literal margin note also misses mobile readers.

**Implementation sketch**

- Prefer an automatic layout insertion near the first section whose top crosses about 60% of article progress, rather than adding CTA markup to every MDX file.
- If implemented as a `BpNote`, provide a mobile equivalent outside the hidden margin column.
- Start as a link that focuses the end card. Add an inline field only if the link earns meaningful clicks.

**Measure**

- Note visibility, click-through to the end form, direct success, and section-to-section continuation.
- Compare completion among exposed and unexposed cohorts.

### 5. `requiresEmail` gating

**Recommendation:** Do not use it for the Blueprint series.

**Expected conversion mechanics**

A gate can produce a high submission rate among readers who want the remaining sheets. It also removes search-visible content from the reader experience, adds sign-in and subscription checks, and breaks the format for unsubscribed visitors.

**Annoyance cost:** Very high. The core promise is a definitive free reference with interactive drawings and an open RFI desk. A mid-article gate conflicts with that promise.

**Engineering tradeoff**

The current route deliberately sends gated posts to `EditorialArticleLayout`, so adding `requiresEmail` to metadata would remove the Blueprint shell for unsubscribed readers. Supporting a gate inside the drawing would require a new Blueprint-aware preview and subscription state path, changes to `src/app/blog/[slug]/page.tsx`, and changes to content rendering. It would also create SEO and accessibility questions around server-rendered versus hidden content.

Reserve gating for a separate artifact with independent value, such as a downloadable printable poster, editable worksheet, or compiled handbook. Keep the article and RFI answers open. Even for a bonus artifact, state that newsletter subscription is part of the exchange and provide a direct unsubscribe path.

## Recommended capture system

Use two placements of one component:

- **Primary:** full NEXT SHEET card at the end of the drawing.
- **Secondary:** compact DISTRIBUTION row below the title-block metadata.

Do not ship the RFI follow-up, margin note, and two page forms at once. That would make attribution unclear and create four requests in one reading session. Add the RFI follow-up only after the primary and secondary placements have enough data to establish their rates.

## Concrete implementation plan

### Step 1: Define the data contract

Extend the Blueprint metadata type with an optional object:

```ts
nextDrawing?: {
  number: string
  title?: string
  subject?: string
  status: 'planned' | 'in-production' | 'issued'
}
```

Add the same shape to processed metadata typing. Do not require it for old drawings; the component needs a useful generic fallback.

### Step 2: Build one drawing-native form component

Create `BlueprintSeriesCapture.tsx` with `title-block` and `next-sheet` variants. Reuse the `/api/form` request contract, including `email`, `referrer`, `hp`, and explicit tags. Include the synchronous double-submit protection and visible error handling already present in `SubscribeForm`.

The component should own these states: idle, focused, submitting, success, and error. It should emit consistent analytics only after an impression, and record success only after a successful API response. The current `EditorialNewsletter` records its conversion event before the request; the Blueprint events should distinguish submit attempts from confirmed subscriptions.

### Step 3: Place both variants in the layout

In `BlueprintArticleLayout.tsx`:

- Put the compact variant below the title-block definition list.
- Put the full variant after the RFI appendix and before the colophon.
- Change the colophon distribution link into a focus target for the full card.
- Hide both forms after a success on the current device.

No MDX file should need capture markup. Layout-level placement keeps TDD-001 through TDD-008 consistent and prevents authors from forgetting analytics or tags.

### Step 4: Add styling and responsive behavior

Add only Blueprint-prefixed rules to `src/styles/blueprint-deep-dive.css`. Test both dark blueprint and light print modes. On mobile, stack the field and button, keep labels readable at 320px, and ensure the fixed RFI tab does not cover the submit button or success message.

Respect reduced motion. The form needs no entrance animation.

### Step 5: Instrument the full funnel

Use one event family with properties:

- `drawing_id`
- `placement`
- `next_drawing_id`
- `device_class`
- `referrer_class`
- `visitor_state`

Track impression, focus, submit attempt, confirmed success, API error, and local suppression. Keep the existing server-side source tags for email analysis.

### Step 6: Roll out and decide

Ship both placements across TDD-001 through TDD-003 before TDD-004 if possible. That creates a baseline on existing drawings and ensures the new posts launch with capture already working.

Review:

- Confirmed subscriptions per 100 page sessions.
- Confirmed subscriptions per 100 visible CTA sessions for each placement.
- Starts that fail to submit and API error rate.
- Reading completion and RFI-use rate.
- Welcome-email engagement and unsubscribe rate by `interest:blueprint-series`.

Do not choose a placement winner from a handful of conversions. Keep both while they serve distinct stages of the reading session and neither causes a measurable fall in §01 continuation, drawing completion, or RFI use. If the title-block row produces little incremental capture and lowers continuation, remove it and retain the end card.

## Search research references

These sources support the technical and competitive assessment; they are not keyword-volume estimates.

- [Formalizing BPE Tokenization](https://arxiv.org/abs/2309.08715) shows that strong results for the tokenizer query often skew formal rather than instructional.
- [McKinsey: What is a context window?](https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-is-a-context-window) is one broad incumbent for the context-window query.
- [Anthropic: How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works) documents the stable model/tool-result loop behind TDD-008.
- [VS Code agent concepts](https://code.visualstudio.com/docs/agents/concepts/agents) shows the same loop in a coding-agent setting.
- [NVIDIA: What is speech to text?](https://www.nvidia.com/en-gb/glossary/speech-to-text/) is a major incumbent that explains ASR and the surrounding conversational pipeline at a high level.
- [Model Context Protocol architecture](https://modelcontextprotocol.io/docs/learn/architecture) and [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts) explain why a definitional MCP article would compete directly with maintained official documentation.
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) and the [LM Evaluation Harness concepts guide](https://lm-evaluation-harness.readthedocs.io/getting_started/concepts/) are strong current sources for the eval-harness query.
- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) remains the durable primary source for the held fine-tuning topic.
- [Hugging Face: Stable Diffusion](https://huggingface.co/blog/stable_diffusion) is a strong visual and technical incumbent for the rejected diffusion topic.

## Final decision

The five-post slate extends the existing chain in two directions. Tokenizer, Vector Database, and Context Window complete the core LLM/RAG reference set. Speech Pipeline and Agent Loop connect that set to the site's two strongest applied groups: voice tools and AI-assisted development.

The capture system should sell the next drawing, not access to the current one. A full NEXT SHEET card at completion and a compact distribution row in the title block give the series an early and late capture point without interrupting the technical work. The RFI desk remains an open reader benefit and a source of editorial questions.
