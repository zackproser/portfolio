/**
 * Vector Database Service
 *
 * Fetches vector database data from Prisma with metadata tracking.
 * This replaces the static data imports for database-backed data management.
 */

import { PrismaClient } from '@prisma/client';
import type { Database } from '@/types/database';

// Use singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Type for the raw Prisma model
type PrismaVectorDatabase = Awaited<ReturnType<typeof prisma.vectorDatabase.findFirst>>;

// Type for metric data
export interface FieldMetric {
  fieldName: string;
  isEstimate: boolean;
  confidence: number | null;
  source: { name: string; type: string } | null;
  verifiedAt: Date | null;
  notes: string | null;
}

// Type for database with metadata
export interface DatabaseWithMetrics extends Database {
  _meta: {
    id: string;
    slug: string | null;
    createdAt: Date;
    updatedAt: Date;
    dataLastVerified: Date | null;
    metrics: FieldMetric[];
  };
}

/**
 * Transform Prisma VectorDatabase to Database type
 */
function transformToDatabase(db: NonNullable<PrismaVectorDatabase>): Database {
  return {
    id: db.slug || db.id,
    name: db.name,
    logoId: db.logoId,
    description: db.description,
    company: {
      name: db.companyName,
      founded: db.companyFounded,
      funding: db.companyFunding,
      employees: db.companyEmployees,
    },
    performance: {
      latency: db.performanceLatency,
      throughput: db.performanceThroughput,
      scalability: db.performanceScalability,
      queryLatencyMs: db.queryLatencyMs,
      indexingSpeedVectorsPerSec: db.indexingSpeed,
      memoryUsageMb: db.memoryUsageMb,
      scalabilityScore: db.scalabilityScore,
      accuracyScore: db.accuracyScore,
    },
    features: db.features as Database['features'],
    security: db.security as Database['security'],
    algorithms: db.algorithms as Database['algorithms'],
    searchCapabilities: db.searchCapabilities as Database['searchCapabilities'],
    aiCapabilities: db.aiCapabilities as Database['aiCapabilities'],
    // Optional fields from JSON
    deployment: db.deployment as Database['deployment'],
    scalability: db.scalabilityInfo as Database['scalability'],
    data_management: db.dataManagement as Database['data_management'],
    vector_similarity_search: db.vectorSimilaritySearch as Database['vector_similarity_search'],
    integration_api: db.integrationApi as Database['integration_api'],
    community_ecosystem: db.communityEcosystem as Database['community_ecosystem'],
    pricing: db.pricing as Database['pricing'],
    additional_features: db.additionalFeatures as Database['additional_features'],
    specific_details: db.specificDetails as Database['specific_details'],
    business_info: db.businessInfo as Database['business_info'],
  };
}

/**
 * Fetch all vector databases from Prisma
 */
export async function getVectorDatabasesFromDb(): Promise<Database[]> {
  const databases = await prisma.vectorDatabase.findMany({
    orderBy: { name: 'asc' },
  });

  return databases.map(transformToDatabase);
}

/**
 * Fetch all vector databases with their field metrics
 */
export async function getVectorDatabasesWithMetrics(): Promise<DatabaseWithMetrics[]> {
  const databases = await prisma.vectorDatabase.findMany({
    include: {
      metrics: {
        include: {
          source: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return databases.map(db => ({
    ...transformToDatabase(db),
    _meta: {
      id: db.id,
      slug: db.slug,
      createdAt: db.createdAt,
      updatedAt: db.updatedAt,
      dataLastVerified: db.dataLastVerified,
      metrics: db.metrics.map(m => ({
        fieldName: m.fieldName,
        isEstimate: m.isEstimate,
        confidence: m.confidence,
        source: m.source ? { name: m.source.name, type: m.source.type } : null,
        verifiedAt: m.verifiedAt,
        notes: m.notes,
      })),
    },
  }));
}

/**
 * Fetch a single vector database by slug or name
 */
export async function getVectorDatabaseBySlug(slug: string): Promise<Database | null> {
  const db = await prisma.vectorDatabase.findFirst({
    where: {
      OR: [
        { slug },
        { name: { equals: slug, mode: 'insensitive' } },
      ],
    },
  });

  return db ? transformToDatabase(db) : null;
}

/**
 * Get data quality summary from actual database metrics
 */
export async function getDataQualitySummaryFromDb() {
  const [totalDatabases, estimateMetrics, verifiedMetrics, lastUpdate] = await Promise.all([
    prisma.vectorDatabase.count(),
    prisma.vectorDatabaseMetric.count({ where: { isEstimate: true } }),
    prisma.vectorDatabaseMetric.count({ where: { isEstimate: false } }),
    prisma.vectorDatabase.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    }),
  ]);

  const totalMetrics = estimateMetrics + verifiedMetrics;
  const verifiedPercentage = totalMetrics > 0
    ? Math.round((verifiedMetrics / totalMetrics) * 100)
    : 0;

  return {
    totalDatabases,
    totalMetrics,
    estimatedMetrics: estimateMetrics,
    verifiedMetrics,
    verifiedPercentage,
    lastUpdate: lastUpdate?.updatedAt || null,
    canRemoveBetaBanner: verifiedPercentage >= 80, // Threshold for removing banner
  };
}

/**
 * Update a field's verification status
 */
export async function verifyDatabaseField(
  databaseId: string,
  fieldName: string,
  sourceId: string,
  verifiedBy: string,
  notes?: string
) {
  return prisma.vectorDatabaseMetric.upsert({
    where: {
      databaseId_fieldName: { databaseId, fieldName },
    },
    update: {
      isEstimate: false,
      sourceId,
      verifiedBy,
      verifiedAt: new Date(),
      notes,
      confidence: 1.0,
    },
    create: {
      databaseId,
      fieldName,
      isEstimate: false,
      sourceId,
      verifiedBy,
      verifiedAt: new Date(),
      notes,
      confidence: 1.0,
    },
  });
}

/**
 * Get all data sources for selection in admin
 */
export async function getDataSources() {
  return prisma.dataSource.findMany({
    orderBy: { name: 'asc' },
  });
}
