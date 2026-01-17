/**
 * Migration Script: Static Vector Database Data → Prisma Database
 *
 * This script migrates data from src/data/databases.ts to the Prisma database
 * and marks performance metrics as estimates (since they weren't verified).
 *
 * Run with: npx tsx src/scripts/migrate-vector-databases.ts
 */

import { PrismaClient } from '@prisma/client';

// Import the static data
// Note: In actual run, you'd import from '../data/databases'
// For now, we define the migration logic

const prisma = new PrismaClient();

// Fields that are performance estimates (not verified from official sources)
const ESTIMATE_FIELDS = [
  'queryLatencyMs',
  'indexingSpeed',
  'memoryUsageMb',
  'scalabilityScore',
  'accuracyScore',
  'companyEmployees', // Often estimated
];

// Fields that are typically from official sources
const OFFICIAL_FIELDS = [
  'name',
  'description',
  'companyName',
  'companyFounded',
  'companyFunding',
];

interface StaticDatabase {
  id: string;
  name: string;
  logoId: string;
  description: string;
  company: {
    name: string;
    founded: number;
    funding: string;
    employees: number;
  };
  features: Record<string, boolean>;
  performance: {
    latency: string;
    throughput: string;
    scalability: string;
    queryLatencyMs: number;
    indexingSpeedVectorsPerSec: number;
    memoryUsageMb: number;
    scalabilityScore: number;
    accuracyScore: number;
  };
  security: Record<string, boolean | string>;
  algorithms: Record<string, boolean>;
  searchCapabilities: Record<string, boolean>;
  aiCapabilities: {
    features: Record<string, boolean>;
    scores: Record<string, number>;
    supportedModels?: Record<string, boolean>;
    ragFeatures?: string[];
    ragLimitations?: string[];
  };
  [key: string]: unknown;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createDefaultDataSources() {
  const sources = [
    { name: 'Official Website', type: 'official', url: null },
    { name: 'GitHub Repository', type: 'api', url: null },
    { name: 'Community Research', type: 'community', url: null },
    { name: 'Estimated/Calculated', type: 'estimate', url: null },
  ];

  const createdSources: Record<string, string> = {};

  for (const source of sources) {
    const created = await prisma.dataSource.upsert({
      where: { id: source.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: source.name.toLowerCase().replace(/\s+/g, '-'),
        name: source.name,
        type: source.type,
        url: source.url,
      },
    });
    createdSources[source.type] = created.id;
  }

  return createdSources;
}

async function migrateDatabase(db: StaticDatabase, dataSources: Record<string, string>) {
  const slug = db.id || generateSlug(db.name);

  console.log(`Migrating: ${db.name} (${slug})`);

  // Upsert the database record
  const created = await prisma.vectorDatabase.upsert({
    where: { slug },
    update: {
      name: db.name,
      logoId: db.logoId,
      description: db.description,
      companyName: db.company.name,
      companyFounded: db.company.founded,
      companyFunding: db.company.funding,
      companyEmployees: db.company.employees,
      performanceLatency: db.performance.latency,
      performanceThroughput: db.performance.throughput,
      performanceScalability: db.performance.scalability,
      queryLatencyMs: db.performance.queryLatencyMs,
      indexingSpeed: db.performance.indexingSpeedVectorsPerSec,
      memoryUsageMb: db.performance.memoryUsageMb,
      scalabilityScore: db.performance.scalabilityScore,
      accuracyScore: db.performance.accuracyScore,
      features: db.features,
      security: db.security,
      algorithms: db.algorithms,
      searchCapabilities: db.searchCapabilities,
      aiCapabilities: db.aiCapabilities,
      updatedAt: new Date(),
    },
    create: {
      name: db.name,
      slug,
      logoId: db.logoId,
      description: db.description,
      companyName: db.company.name,
      companyFounded: db.company.founded,
      companyFunding: db.company.funding,
      companyEmployees: db.company.employees,
      performanceLatency: db.performance.latency,
      performanceThroughput: db.performance.throughput,
      performanceScalability: db.performance.scalability,
      queryLatencyMs: db.performance.queryLatencyMs,
      indexingSpeed: db.performance.indexingSpeedVectorsPerSec,
      memoryUsageMb: db.performance.memoryUsageMb,
      scalabilityScore: db.performance.scalabilityScore,
      accuracyScore: db.performance.accuracyScore,
      features: db.features,
      security: db.security,
      algorithms: db.algorithms,
      searchCapabilities: db.searchCapabilities,
      aiCapabilities: db.aiCapabilities,
    },
  });

  // Create metric metadata for estimate fields
  for (const fieldName of ESTIMATE_FIELDS) {
    await prisma.vectorDatabaseMetric.upsert({
      where: {
        databaseId_fieldName: {
          databaseId: created.id,
          fieldName,
        },
      },
      update: {
        isEstimate: true,
        sourceId: dataSources['estimate'],
        notes: 'Migrated from static data - needs verification from official source',
      },
      create: {
        databaseId: created.id,
        fieldName,
        isEstimate: true,
        confidence: 0.5, // Medium confidence for estimates
        sourceId: dataSources['estimate'],
        notes: 'Migrated from static data - needs verification from official source',
      },
    });
  }

  // Create metric metadata for official fields
  for (const fieldName of OFFICIAL_FIELDS) {
    await prisma.vectorDatabaseMetric.upsert({
      where: {
        databaseId_fieldName: {
          databaseId: created.id,
          fieldName,
        },
      },
      update: {
        isEstimate: false,
        sourceId: dataSources['official'],
      },
      create: {
        databaseId: created.id,
        fieldName,
        isEstimate: false,
        confidence: 0.9, // High confidence for official data
        sourceId: dataSources['official'],
        notes: 'From official documentation or website',
      },
    });
  }

  return created;
}

async function main() {
  console.log('Starting vector database migration...\n');

  // Create default data sources
  console.log('Creating data sources...');
  const dataSources = await createDefaultDataSources();
  console.log('Data sources created.\n');

  // Import the static databases
  const { databases } = await import('../data/databases');

  console.log(`Found ${databases.length} databases to migrate\n`);

  // Migrate each database
  for (const db of databases) {
    try {
      await migrateDatabase(db as unknown as StaticDatabase, dataSources);
      console.log(`  ✓ Migrated ${db.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to migrate ${db.name}:`, error);
    }
  }

  console.log('\nMigration complete!');

  // Summary
  const count = await prisma.vectorDatabase.count();
  const metricsCount = await prisma.vectorDatabaseMetric.count();
  console.log(`\nDatabase now contains:`);
  console.log(`  - ${count} vector databases`);
  console.log(`  - ${metricsCount} field metrics`);
}

// Export for use as module
export { migrateDatabase, createDefaultDataSources, generateSlug };

// Run if executed directly
if (require.main === module) {
  main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
