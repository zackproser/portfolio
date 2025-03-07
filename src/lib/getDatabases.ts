import { Database } from '@/types/database';
import vectorDatabases from '../../schema/data/vectordatabases.json' assert { type: 'json' };

interface RawDatabase {
  name: string;
  logoId: string;
  description: string;
  business_info?: {
    company_name?: string;
    founded?: number;
    total_funding?: string;
    employee_count?: string;
    headquarters?: string;
    funding_rounds?: Array<{ date: string; amount: string; series: string }>;
    key_people?: Array<{ name: string; position: string }>;
  };
  deployment?: {
    cloud?: boolean;
    on_premises?: boolean;
  };
  vector_similarity_search?: {
    filtering?: boolean;
    ann_algorithms?: string[];
  };
  additional_features?: {
    metadata_support?: boolean;
    batch_processing?: boolean;
  };
  scalability?: {
    distributed?: boolean;
  };
  security?: {
    encryption?: boolean;
    authentication?: boolean;
    access_control?: boolean;
  };
  community_ecosystem?: {
    integration_frameworks?: string[];
  };
  specific_details?: {
    performance_metric?: string;
  };
}

// Helper functions
function parseEmployeeCount(count: string | undefined): number {
  if (!count) return 0;
  const match = count.match(/\d+/g);
  if (!match) return 0;
  // If range (e.g., "11-50"), take the upper bound
  return parseInt(match[match.length - 1]);
}

function formatFunding(funding: string | undefined): string {
  if (!funding || funding === "N/A") return "Not disclosed";
  // Ensure proper formatting of funding amounts
  if (funding.startsWith('$')) {
    return funding;
  }
  return `$${funding}`;
}

function getHeadquarters(headquarters: string | undefined): string {
  if (!headquarters || headquarters === "N/A") return "Not disclosed";
  return headquarters;
}

// Transform a single database entry
function transformToDatabase(db: RawDatabase): Database {
  const businessInfo = db.business_info || {};
  
  // Ensure proper company name
  const companyName = businessInfo.company_name || db.name;
  
  // Format headquarters
  const headquarters = getHeadquarters(businessInfo.headquarters);
  
  // Format funding
  const funding = formatFunding(businessInfo.total_funding);
  
  // Parse employee count
  const employeeCount = businessInfo.employee_count || "Not disclosed";
  const numericEmployeeCount = parseEmployeeCount(employeeCount);

  // Ensure we have a valid ID
  const id = db.logoId || db.name.toLowerCase().replace(/\s+/g, '-');
  
  return {
    id,
    name: db.name,
    logoId: db.logoId || id,
    description: db.description,
    company: {
      name: companyName,
      founded: businessInfo.founded || 0,
      funding,
      employees: numericEmployeeCount,
    },
    business_info: {
      company_name: companyName,
      founded: businessInfo.founded || 0,
      headquarters,
      total_funding: funding,
      latest_valuation: businessInfo.latest_valuation || "Not disclosed",
      funding_rounds: businessInfo.funding_rounds || [],
      key_people: businessInfo.key_people || [],
      employee_count: employeeCount,
    },
    features: {
      cloudNative: db.deployment?.cloud ?? false,
      serverless: (db.deployment?.cloud && !db.deployment?.on_premises) ?? false,
      hybridSearch: db.vector_similarity_search?.filtering ?? false,
      metadataFiltering: db.additional_features?.metadata_support ?? false,
      batchOperations: db.additional_features?.batch_processing ?? false,
    },
    performance: {
      latency: db.specific_details?.performance_metric ?? 'Not specified',
      throughput: 'Varies by deployment',
      scalability: db.scalability?.distributed ? 'auto' : 'manual',
      queryLatencyMs: 20, // TODO: Replace with actual data
      indexingSpeedVectorsPerSec: 50000, // TODO: Replace with actual data
      memoryUsageMb: 250, // TODO: Replace with actual data
      scalabilityScore: db.scalability?.distributed ? 90 : 70,
      accuracyScore: 85, // TODO: Replace with actual data
    },
    security: {
      encryption: db.security?.encryption ?? false,
      authentication: db.security?.authentication ?? false,
      access_control: db.security?.access_control ?? false,
      auditLogging: true, // TODO: Get from actual data
    },
    algorithms: {
      hnsw: db.vector_similarity_search?.ann_algorithms?.includes('HNSW') ?? false,
      ivf: db.vector_similarity_search?.ann_algorithms?.includes('IVF') ?? false,
      lsh: false,
      quantization: db.vector_similarity_search?.ann_algorithms?.includes('PQ') ?? false,
    },
    searchCapabilities: {
      similaritySearch: true,
      hybridSearch: db.vector_similarity_search?.filtering ?? false,
      filtering: db.vector_similarity_search?.filtering ?? false,
      pagination: true,
    },
    aiCapabilities: {
      features: {
        embeddingGeneration: true,
        llmIntegration: db.community_ecosystem?.integration_frameworks?.some(f => 
          ['LangChain', 'LlamaIndex'].includes(f)) ?? false,
        ragSupport: db.community_ecosystem?.integration_frameworks?.some(f => 
          ['LangChain', 'LlamaIndex'].includes(f)) ?? false,
        semanticCaching: false,
        modelHosting: false,
        fineTuning: false,
      },
      scores: {
        llmIntegration: 8,
        embeddingGeneration: 8,
        ragSupport: 8,
        fineTuning: 5,
        modelHosting: 5,
      },
      supportedModels: {
        openai: true,
        huggingface: true,
        pytorch: true,
        tensorflow: true,
        langchain: db.community_ecosystem?.integration_frameworks?.includes('LangChain') ?? false,
        llamaindex: db.community_ecosystem?.integration_frameworks?.includes('LlamaIndex') ?? false,
      },
      ragFeatures: [
        'Semantic search',
        'Metadata filtering',
        'Hybrid search',
        'Real-time updates',
        'Batch operations',
      ],
      ragLimitations: [
        'No built-in fine-tuning',
        'Limited model hosting',
        'No built-in caching',
      ],
    },
  };
}

// Public exports
export const getDatabases = () => {
  // Create a Map to store unique databases by ID
  const uniqueDatabases = new Map();
  
  // Process each database and only keep unique entries
  vectorDatabases.databases.forEach((db) => {
    if (!uniqueDatabases.has(db.logoId)) {
      uniqueDatabases.set(db.logoId, transformToDatabase(db));
    }
  });
  
  // Convert Map back to array
  return Array.from(uniqueDatabases.values());
};

export const getCategories = () => {
  return vectorDatabases.categories;
};

export const getFeatures = () => {
  return vectorDatabases.features;
};

export const getDatabaseByName = (name: string): Database | undefined => {
  return getDatabases().find(db => db.name.toLowerCase() === name.toLowerCase());
}; 