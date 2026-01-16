/**
 * Tool Service
 *
 * Provides data quality metrics for dev tools.
 */

import { PrismaClient } from '@prisma/client';

// Use singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Get data quality summary for tools
 */
export async function getToolsDataQualitySummary() {
  const [totalTools, estimateMetrics, verifiedMetrics, lastUpdate] = await Promise.all([
    prisma.tool.count(),
    prisma.toolMetric.count({ where: { isEstimate: true } }),
    prisma.toolMetric.count({ where: { isEstimate: false } }),
    prisma.tool.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    }),
  ]);

  const totalMetrics = estimateMetrics + verifiedMetrics;
  const verifiedPercentage = totalMetrics > 0
    ? Math.round((verifiedMetrics / totalMetrics) * 100)
    : 0;

  return {
    totalTools,
    totalMetrics,
    estimatedMetrics: estimateMetrics,
    verifiedMetrics,
    verifiedPercentage,
    lastUpdate: lastUpdate?.updatedAt || null,
    canRemoveBetaBanner: verifiedPercentage >= 80, // Threshold for removing banner
  };
}

/**
 * Update a tool field's verification status
 */
export async function verifyToolField(
  toolId: string,
  fieldName: string,
  sourceId: string,
  verifiedBy: string,
  notes?: string
) {
  return prisma.toolMetric.upsert({
    where: {
      toolId_fieldName: { toolId, fieldName },
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
      toolId,
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
