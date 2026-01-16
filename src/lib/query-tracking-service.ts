/**
 * Query Tracking Service
 *
 * Tracks user searches across lead-gen tools to identify content opportunities.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Common categories for auto-classification
const CATEGORY_PATTERNS: [RegExp, string][] = [
  // Vector database specific
  [/pinecone|weaviate|milvus|qdrant|chroma|pgvector|faiss/i, 'specific-database'],
  [/embed|embedding|vector/i, 'embeddings'],
  [/rag|retrieval|augmented/i, 'rag'],
  [/performance|latency|speed|fast/i, 'performance'],
  [/price|pricing|cost|free|cheap/i, 'pricing'],
  [/scale|scalab|enterprise|production/i, 'scalability'],
  [/open.?source|self.?host/i, 'open-source'],
  [/secur|encrypt|auth/i, 'security'],
  // Dev tools specific
  [/copilot|cursor|codeium|tabnine/i, 'specific-tool'],
  [/code.?complet|autocomplete|suggest/i, 'code-completion'],
  [/debug|fix|error/i, 'debugging'],
  [/refactor|clean|improve/i, 'refactoring'],
  [/test|testing|unit/i, 'testing'],
  [/document|comment|explain/i, 'documentation'],
  // General
  [/compar|vs|versus|differ|better/i, 'comparison'],
  [/how.?to|tutorial|guide|learn/i, 'learning'],
  [/best|recommend|should.?i/i, 'recommendation'],
  [/integrat|connect|setup/i, 'integration'],
];

// Intent classification
const INTENT_PATTERNS: [RegExp, string][] = [
  [/compar|vs|versus|differ|which/i, 'comparison'],
  [/how.?to|can.?i|tutorial|guide/i, 'learning'],
  [/best|recommend|should|choose/i, 'evaluation'],
  [/error|fix|debug|issue|problem|not.?work/i, 'troubleshooting'],
  [/price|cost|free/i, 'pricing'],
  [/what.?is|explain|understand/i, 'understanding'],
];

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

function classifyCategory(query: string): string | null {
  const normalized = query.toLowerCase();
  for (const [pattern, category] of CATEGORY_PATTERNS) {
    if (pattern.test(normalized)) {
      return category;
    }
  }
  return null;
}

function classifyIntent(query: string): string | null {
  const normalized = query.toLowerCase();
  for (const [pattern, intent] of INTENT_PATTERNS) {
    if (pattern.test(normalized)) {
      return intent;
    }
  }
  return null;
}

export interface TrackQueryParams {
  query: string;
  source: 'vectordatabases' | 'devtools' | 'chat';
  resultCount?: number;
  clicked?: boolean;
  userId?: string;
  sessionId?: string;
}

/**
 * Track a search query
 */
export async function trackQuery(params: TrackQueryParams) {
  const { query, source, resultCount, clicked, userId, sessionId } = params;

  const normalized = normalizeQuery(query);
  const category = classifyCategory(query);
  const intent = classifyIntent(query);

  // Record the individual query
  const searchQuery = await prisma.searchQuery.create({
    data: {
      query,
      normalized,
      source,
      category,
      intent,
      resultCount,
      clicked: clicked || false,
      userId,
      sessionId,
    },
  });

  // Update or create the aggregated insight
  await prisma.queryInsight.upsert({
    where: { normalizedQuery: normalized },
    update: {
      totalCount: { increment: 1 },
      lastSeen: new Date(),
      // Update category/intent if not set
      category: category || undefined,
      intent: intent || undefined,
    },
    create: {
      normalizedQuery: normalized,
      totalCount: 1,
      uniqueSessions: 1,
      category,
      intent,
      lastSeen: new Date(),
      firstSeen: new Date(),
    },
  });

  return searchQuery;
}

/**
 * Mark that a search result was clicked
 */
export async function trackQueryClick(queryId: string) {
  return prisma.searchQuery.update({
    where: { id: queryId },
    data: { clicked: true },
  });
}

/**
 * Get top queries for content insights
 */
export async function getTopQueries(options: {
  source?: string;
  category?: string;
  limit?: number;
  days?: number;
  onlyWithoutContent?: boolean;
} = {}) {
  const { source, category, limit = 20, days = 30, onlyWithoutContent = false } = options;

  const since = new Date();
  since.setDate(since.getDate() - days);

  return prisma.queryInsight.findMany({
    where: {
      lastSeen: { gte: since },
      ...(source && { normalizedQuery: { contains: source } }), // Rough filter
      ...(category && { category }),
      ...(onlyWithoutContent && { contentCreated: false }),
    },
    orderBy: { totalCount: 'desc' },
    take: limit,
  });
}

/**
 * Get query trends (queries spiking recently)
 */
export async function getTrendingQueries(limit = 10) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get queries from last week
  const recentQueries = await prisma.searchQuery.groupBy({
    by: ['normalized'],
    where: { createdAt: { gte: weekAgo } },
    _count: true,
    orderBy: { _count: { normalized: 'desc' } },
    take: limit * 2,
  });

  // Get their historical counts
  const trending = [];
  for (const recent of recentQueries) {
    const historicalCount = await prisma.searchQuery.count({
      where: {
        normalized: recent.normalized,
        createdAt: { gte: monthAgo, lt: weekAgo },
      },
    });

    // Calculate growth rate
    const weeklyAvgBefore = historicalCount / 3; // 3 weeks before
    const currentWeek = recent._count;
    const growthRate = weeklyAvgBefore > 0
      ? (currentWeek - weeklyAvgBefore) / weeklyAvgBefore
      : currentWeek > 2 ? 1 : 0;

    if (growthRate > 0.5 || (historicalCount === 0 && currentWeek > 3)) {
      trending.push({
        query: recent.normalized,
        count: currentWeek,
        growthRate,
        isNew: historicalCount === 0,
      });
    }
  }

  return trending
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, limit);
}

/**
 * Get category distribution
 */
export async function getCategoryDistribution(source?: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const results = await prisma.searchQuery.groupBy({
    by: ['category'],
    where: {
      createdAt: { gte: since },
      ...(source && { source }),
      category: { not: null },
    },
    _count: true,
    orderBy: { _count: { category: 'desc' } },
  });

  return results.map(r => ({
    category: r.category,
    count: r._count,
  }));
}

/**
 * Get content suggestions based on query patterns
 */
export async function getContentSuggestions(limit = 10) {
  // Get high-volume queries without content
  const highVolume = await prisma.queryInsight.findMany({
    where: {
      contentCreated: false,
      totalCount: { gte: 5 },
    },
    orderBy: { totalCount: 'desc' },
    take: limit,
  });

  return highVolume.map(q => ({
    query: q.normalizedQuery,
    count: q.totalCount,
    category: q.category,
    intent: q.intent,
    suggestion: generateContentSuggestion(q.normalizedQuery, q.category, q.intent),
  }));
}

function generateContentSuggestion(query: string, category: string | null, intent: string | null): string {
  if (intent === 'comparison') {
    return `Create a detailed comparison article: "${query}"`;
  }
  if (intent === 'learning') {
    return `Write a tutorial or guide: "How to ${query}"`;
  }
  if (intent === 'troubleshooting') {
    return `Create a troubleshooting guide for: "${query}"`;
  }
  if (category === 'specific-database' || category === 'specific-tool') {
    return `Write an in-depth review or guide for the tool mentioned in: "${query}"`;
  }
  if (category === 'performance') {
    return `Create a benchmark comparison for: "${query}"`;
  }
  if (category === 'pricing') {
    return `Write a pricing comparison guide for: "${query}"`;
  }
  return `Consider creating content about: "${query}"`;
}

/**
 * Mark content as created for a query
 */
export async function markContentCreated(normalizedQuery: string, contentUrl?: string) {
  return prisma.queryInsight.update({
    where: { normalizedQuery },
    data: {
      contentCreated: true,
      suggestedContent: contentUrl || 'Content created',
    },
  });
}
