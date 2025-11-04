import type { RagDataset, RagDatasetDocument } from './data';

export type RetrieverMode = 'semantic' | 'keyword' | 'hybrid';

export type RagChunk = {
  id: string;
  docId: string;
  docTitle: string;
  text: string;
  tags: string[];
  lastUpdated: string;
  embedding: number[];
  keywords: string[];
  wordCount: number;
};

export type RagRetrievalResult = {
  chunk: RagChunk;
  similarity: number;
  semanticScore: number;
  keywordScore: number;
  hybridScore: number;
  score: number;
  reasons: string[];
  estimatedTokens: number;
};

export type GeneratedAnswer = {
  prompt: string;
  promptParts?: {
    systemPrompt: string;
    contextSections: Array<{ text: string; docTitle: string; index: number }>;
    userQuery: string;
  };
  promptTokens: number;
  responseTokens: number;
  estimatedLatencyMs: number;
  estimatedCostUsd: number;
  answer: string;
  citations: Array<{ title: string; chunkId: string; docId: string; snippet: string; label: string }>;
};

const DIMENSION_KEYWORDS: Array<{
  keywords: string[];
  weight: number;
}> = [
  {
    keywords: ['sla', 'uptime', 'reliability', 'guarantee', 'response', 'support', 'escalation', 'severity'],
    weight: 1
  },
  {
    keywords: ['sso', 'scim', 'api', 'webhook', 'integration', 'provisioning', 'token'],
    weight: 1
  },
  {
    keywords: ['security', 'compliance', 'audit', 'encryption', 'kms', 'credential', 'rotation'],
    weight: 1
  },
  {
    keywords: ['runbook', 'workflow', 'pipeline', 'automation', 'incident', 'playbook'],
    weight: 0.9
  },
  {
    keywords: ['release', 'feature', 'migration', 'upgrade', 'deprecate', 'version'],
    weight: 0.8
  },
  {
    keywords: ['policy', 'control', 'evidence', 'review', 'approval', 'audit'],
    weight: 0.85
  },
  {
    keywords: ['customer', 'impact', 'notification', 'status', 'summary', 'stakeholder'],
    weight: 0.75
  }
];

const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'to',
  'of',
  'for',
  'in',
  'on',
  'with',
  'by',
  'is',
  'are',
  'be',
  'that',
  'this',
  'as',
  'at',
  'it',
  'from'
]);

function sanitize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function keywordTokens(text: string): string[] {
  return sanitize(text).filter((token) => !STOP_WORDS.has(token));
}

export function generateEmbedding(text: string): number[] {
  const tokens = keywordTokens(text);
  const embedding = new Array(DIMENSION_KEYWORDS.length).fill(0);

  tokens.forEach((token) => {
    DIMENSION_KEYWORDS.forEach((bucket, index) => {
      if (bucket.keywords.some((kw) => token.includes(kw))) {
        embedding[index] += bucket.weight;
      }
    });
  });

  // Add deterministic variation so similar strings feel related but not identical
  let seed = text.length;
  for (let i = 0; i < text.length; i += 1) {
    seed = (seed * 33 + text.charCodeAt(i)) % 1000003;
  }

  return embedding.map((value, index) => {
    const noise = (((seed * (index + 3)) % 1000) / 1000) * 0.3 - 0.15;
    const normalized = Math.min(1.5, value / 3 + noise);
    return normalized;
  });
}

export function calculateSimilarity(vec1: number[], vec2: number[]): number {
  const dot = vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, value) => sum + value * value, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, value) => sum + value * value, 0));

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dot / (mag1 * mag2);
}

export function estimateTokenCount(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words * 1.3));
}

export function chunkDocument(doc: RagDatasetDocument, chunkSize: number): RagChunk[] {
  const words = doc.content.split(/\s+/).filter(Boolean);
  const chunks: RagChunk[] = [];

  for (let start = 0, index = 0; start < words.length; start += chunkSize, index += 1) {
    const portion = words.slice(start, start + chunkSize);
    const text = portion.join(' ');

    if (!text) continue;

    const keywords = Array.from(new Set(keywordTokens(text))).slice(0, 8);

    chunks.push({
      id: `${doc.id}-chunk-${index + 1}`,
      docId: doc.id,
      docTitle: doc.title,
      text,
      tags: doc.tags,
      lastUpdated: doc.lastUpdated,
      wordCount: portion.length,
      keywords,
      embedding: generateEmbedding(text)
    });
  }

  return chunks;
}

export function buildChunkIndex(dataset: RagDataset, chunkSize: number): RagChunk[] {
  return dataset.documents.flatMap((doc) => chunkDocument(doc, chunkSize));
}

export function computeKeywordScore(query: string, text: string): number {
  const queryTokens = new Set(keywordTokens(query));
  if (queryTokens.size === 0) return 0;

  const textTokens = keywordTokens(text);
  const overlap = textTokens.filter((token) => queryTokens.has(token));

  return Math.min(1, overlap.length / Math.max(1, queryTokens.size));
}

export function buildReasons(chunk: RagChunk, query: string): string[] {
  const matches = new Set<string>();
  const queryTokens = new Set(keywordTokens(query));

  chunk.keywords.forEach((keyword) => {
    if (queryTokens.has(keyword)) {
      matches.add(`Matches keyword "${keyword}"`);
    }
  });

  chunk.tags.forEach((tag) => {
    if (queryTokens.has(tag)) {
      matches.add(`Tagged with "${tag}"`);
    }
  });

  if (chunk.text.toLowerCase().includes('audit log')) {
    matches.add('Mentions audit logs for traceability');
  }

  if (chunk.text.toLowerCase().includes('rotate') || chunk.text.toLowerCase().includes('rotation')) {
    matches.add('Details rotation cadence');
  }

  if (matches.size === 0) {
    matches.add('High semantic similarity to the question');
  }

  return Array.from(matches).slice(0, 3);
}

export function simulateRetrieval({
  query,
  chunks,
  topK,
  mode
}: {
  query: string;
  chunks: RagChunk[];
  topK: number;
  mode: RetrieverMode;
}): RagRetrievalResult[] {
  const queryEmbedding = generateEmbedding(query);

  const scored = chunks.map((chunk) => {
    const similarity = calculateSimilarity(queryEmbedding, chunk.embedding);
    const semanticScore = (similarity + 1) / 2; // normalize to [0,1]
    const keywordScore = computeKeywordScore(query, chunk.text);
    const hybridScore = semanticScore * 0.65 + keywordScore * 0.35;

    let score = semanticScore;
    if (mode === 'keyword') score = keywordScore;
    if (mode === 'hybrid') score = hybridScore;

    return {
      chunk,
      similarity,
      semanticScore,
      keywordScore,
      hybridScore,
      score,
      reasons: buildReasons(chunk, query),
      estimatedTokens: estimateTokenCount(chunk.text)
    } satisfies RagRetrievalResult;
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  return sorted.slice(0, topK);
}

export function generateGroundedAnswer({
  query,
  selectedChunks,
  dataset
}: {
  query: string;
  selectedChunks: RagRetrievalResult[];
  dataset: RagDataset;
}): GeneratedAnswer {
  const systemPrompt = `You are an expert assistant helping a team understand their ${dataset.name}. Use only the provided context. Cite the source number in brackets when you reference information.`;

  const contextSections = selectedChunks
    .map((result, index) => {
      return `Source ${index + 1} - ${result.chunk.docTitle} (updated ${result.chunk.lastUpdated})\n${result.chunk.text}`;
    })
    .join('\n\n');

  const contextParts = selectedChunks.map((result, index) => ({
    text: `Source ${index + 1} - ${result.chunk.docTitle} (updated ${result.chunk.lastUpdated})\n${result.chunk.text}`,
    docTitle: result.chunk.docTitle,
    index: index + 1
  }));

  const prompt = `${systemPrompt}

Context:
${contextSections}

Question: ${query}
Answer:`;

  const promptTokens = estimateTokenCount(prompt);
  const responseTokens = Math.max(120, Math.round(promptTokens * 0.35));
  const estimatedLatencyMs = 1200 + (promptTokens + responseTokens) * 3;
  const estimatedCostUsd = ((promptTokens + responseTokens) / 1000) * 0.00095;

  const answerSections = selectedChunks.map((result, index) => {
    const snippet = result.chunk.text.split('.').slice(0, 2).join('.').trim();
    return `- ${result.chunk.docTitle}: ${snippet}${snippet.endsWith('.') ? '' : '.'} [${index + 1}]`;
  });

  const answer = `Here is what the knowledge base confirms:
${answerSections.join('\n')}

Next best step: combine these grounded snippets into your runbook or response, keeping citations like [1] so stakeholders can audit the source quickly.`;

  const citations = selectedChunks.map((result, index) => ({
    title: result.chunk.docTitle,
    chunkId: result.chunk.id,
    docId: result.chunk.docId,
    snippet: result.chunk.text.slice(0, 220) + (result.chunk.text.length > 220 ? '...' : ''),
    label: `Source ${index + 1}`
  }));

  return {
    prompt,
    promptParts: {
      systemPrompt,
      contextSections: contextParts,
      userQuery: query
    },
    promptTokens,
    responseTokens,
    estimatedLatencyMs,
    estimatedCostUsd,
    answer,
    citations
  };
}
