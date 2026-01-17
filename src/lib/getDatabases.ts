import { Database } from '@/types/database';
import { databases } from '../data/databases';
import { dbLogger as logger } from '@/utils/logger';

// Type for metric metadata
export interface MetricInfo {
  fieldName: string;
  isEstimate: boolean;
  confidence: number | null;
  source: string | null;
  verifiedAt: Date | null;
  notes: string | null;
}

// Type for database with metadata
export interface DatabaseWithMetadata extends Database {
  _metadata?: {
    lastUpdated: Date;
    dataLastVerified: Date | null;
    metrics: MetricInfo[];
  };
}

// Fields that are known estimates (not verified from official sources)
const ESTIMATE_FIELDS = new Set([
  'queryLatencyMs',
  'indexingSpeedVectorsPerSec',
  'memoryUsageMb',
  'scalabilityScore',
  'accuracyScore',
  'employees', // Company employee count often estimated
]);

// Default metadata for static data
function getDefaultMetadata(): DatabaseWithMetadata['_metadata'] {
  return {
    lastUpdated: new Date('2024-01-15'), // When static data was last updated
    dataLastVerified: null, // Never officially verified
    metrics: [
      { fieldName: 'queryLatencyMs', isEstimate: true, confidence: 0.5, source: 'Estimated based on documentation', verifiedAt: null, notes: 'Needs verification from benchmarks' },
      { fieldName: 'indexingSpeedVectorsPerSec', isEstimate: true, confidence: 0.5, source: 'Estimated based on documentation', verifiedAt: null, notes: 'Needs verification from benchmarks' },
      { fieldName: 'memoryUsageMb', isEstimate: true, confidence: 0.4, source: 'Estimated', verifiedAt: null, notes: 'Varies significantly by use case' },
      { fieldName: 'scalabilityScore', isEstimate: true, confidence: 0.6, source: 'Calculated from features', verifiedAt: null, notes: 'Subjective score' },
      { fieldName: 'accuracyScore', isEstimate: true, confidence: 0.6, source: 'Calculated from features', verifiedAt: null, notes: 'Subjective score' },
    ],
  };
}

export const getDatabases = (): Database[] => {
  logger.info('Starting database retrieval and validation...');
  const seenIds = new Set<string>();
  const uniqueDatabases: Database[] = [];

  const validatedDatabases = databases.map((db, index) => {
    if (!db.id) {
      logger.warn(`Database at index ${index} (${db.name}) has no ID, generating one from name.`);
      return {
        ...db,
        id: db.name.toLowerCase().replace(/\s+/g, '-')
      };
    }
    return db;
  });

  validatedDatabases.forEach((db, index) => {
    const id = typeof db.id === 'string' ? db.id.trim() : String(db.id).trim();
    const finalId = id || db.name.toLowerCase().replace(/\s+/g, '-');
    const validatedDb = { ...db, id: finalId };

    logger.debug(`Processing database[${index}]: ${validatedDb.name} (ID: ${validatedDb.id})`);

    if (seenIds.has(validatedDb.id)) {
      logger.warn(`Duplicate database entry skipped: ${validatedDb.name} with ID ${validatedDb.id}`);
    } else {
      seenIds.add(validatedDb.id);
      uniqueDatabases.push(validatedDb);
    }
  });

  logger.info(`Unique databases count: ${uniqueDatabases.length}`);
  return uniqueDatabases;
};

// Get databases with metadata about data quality
export const getDatabasesWithMetadata = (): DatabaseWithMetadata[] => {
  const dbs = getDatabases();
  return dbs.map(db => ({
    ...db,
    _metadata: getDefaultMetadata(),
  }));
};

export const getDatabaseByName = (name: string): Database | undefined => {
  return getDatabases().find(db => db.name.toLowerCase() === name.toLowerCase());
};

export const getDatabaseById = (id: string): Database | undefined => {
  return getDatabases().find(db => db.id === id);
};

// Check if a specific field is an estimate
export const isFieldEstimate = (fieldName: string): boolean => {
  return ESTIMATE_FIELDS.has(fieldName);
};

// Get all estimate fields
export const getEstimateFields = (): string[] => {
  return Array.from(ESTIMATE_FIELDS);
};

// Get categories for database comparison
export const getCategories = () => {
  return {
    company: {
      description: "Company Information",
      importance: "Provides background on the company behind the database",
      hasEstimates: false,
    },
    features: {
      description: "Core Features",
      importance: "Essential functionalities offered by the database",
      hasEstimates: false,
    },
    performance: {
      description: "Performance Metrics",
      importance: "How well the database performs under various conditions",
      hasEstimates: true, // Most performance data is estimated
      estimateNote: "Performance metrics are estimates based on documentation. Actual performance varies by use case and configuration.",
    },
    security: {
      description: "Security Features",
      importance: "Security measures and capabilities",
      hasEstimates: false,
    },
    algorithms: {
      description: "Supported Algorithms",
      importance: "Vector search algorithms implemented",
      hasEstimates: false,
    },
    searchCapabilities: {
      description: "Search Capabilities",
      importance: "Types of search operations supported",
      hasEstimates: false,
    },
    aiCapabilities: {
      description: "AI Features",
      importance: "AI and machine learning integration capabilities",
      hasEstimates: true,
      estimateNote: "AI capability scores are calculated based on feature availability, not official benchmarks.",
    }
  };
};

// Get features for database comparison
export const getFeatures = () => {
  return {
    cloudNative: {
      description: "Designed to run in cloud environments"
    },
    serverless: {
      description: "Can be deployed without managing servers"
    },
    hybridSearch: {
      description: "Combines vector search with keyword or filter-based search"
    },
    metadataFiltering: {
      description: "Ability to filter search results by metadata"
    },
    batchOperations: {
      description: "Support for processing multiple items in a single operation"
    }
  };
};

// Data quality summary for UI display
export const getDataQualitySummary = () => {
  return {
    lastFullUpdate: '2024-01-15',
    totalDatabases: getDatabases().length,
    verifiedFields: ['name', 'description', 'company.name', 'company.founded', 'features'],
    estimatedFields: Array.from(ESTIMATE_FIELDS),
    disclaimer: 'Performance metrics and scores are estimates based on available documentation and may not reflect actual benchmark results. For production decisions, please verify with official sources and run your own benchmarks.',
  };
};
