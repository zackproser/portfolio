#!/usr/bin/env node
/*
 * Vector Database Migration Script
 * -------------------------------
 * This script migrates the vector database data from the JSON format to TypeScript.
 * 
 * Run with:
 *   ts-node scripts/migrate-vector-databases.ts
 * 
 * Or add a script to package.json:
 *   "scripts": {
 *     "migrate-databases": "ts-node scripts/migrate-vector-databases.ts"
 *   }
 *
 * And run with:
 *   npm run migrate-databases
 */

import fs from 'fs';
import path from 'path';

// Read the JSON file
const vectorDatabasesJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'schema/data/vectordatabases.json'), 'utf8')
);

// Read the existing TypeScript file
let databasesTs = fs.readFileSync(
  path.join(process.cwd(), 'src/data/databases.ts'), 
  'utf8'
);

// Extract the existing databases array
const existingDatabaseIds = databasesTs.match(/id: "([^"]+)"/g)?.map(
  match => match.replace('id: "', '').replace('"', '')
) || [];

// Process each database from the JSON file
vectorDatabasesJson.databases.forEach((db: any) => {
  // Skip if the database is already in the TypeScript file
  if (existingDatabaseIds.includes(db.name.toLowerCase())) {
    console.log(`Skipping ${db.name} - already exists`);
    return;
  }

  // Create an ID from the name
  const id = db.name.toLowerCase();
  
  // Extract integration frameworks if they exist
  const integrationFrameworks = db.community_ecosystem?.integration_frameworks || [];

  // Transform the JSON database to match the TypeScript type
  const transformedDb = {
    id,
    name: db.name,
    logoId: db.logoId,
    description: db.description,
    company: {
      name: db.business_info?.company_name || '',
      founded: db.business_info?.founded || 0,
      funding: db.business_info?.total_funding || '$0',
      employees: typeof db.business_info?.employee_count === 'string' 
        ? parseInt(db.business_info.employee_count) || 0 
        : 0,
    },
    features: {
      cloudNative: db.deployment?.cloud || false,
      serverless: false, // Default, adjust as needed
      hybridSearch: db.vector_similarity_search?.filtering || false,
      metadataFiltering: db.additional_features?.metadata_support || false,
      batchOperations: db.additional_features?.batch_processing || false,
    },
    performance: {
      latency: "25ms", // Default, adjust as needed
      throughput: "10k qps", // Default, adjust as needed
      scalability: db.scalability?.horizontal ? "auto" : "manual",
      queryLatencyMs: 25, // Default, adjust as needed
      indexingSpeedVectorsPerSec: 10000, // Default, adjust as needed
      memoryUsageMb: 500, // Default, adjust as needed
      scalabilityScore: db.scalability?.horizontal && db.scalability?.distributed ? 85 : 70,
      accuracyScore: 80, // Default, adjust as needed
    },
    security: {
      encryption: db.security?.encryption || false,
      authentication: db.security?.authentication || false,
      access_control: db.security?.access_control || false,
      auditLogging: db.security?.audit_logging || false,
    },
    algorithms: {
      hnsw: db.vector_similarity_search?.ann_algorithms?.includes('HNSW') || false,
      ivf: db.vector_similarity_search?.ann_algorithms?.includes('IVF') || 
           db.vector_similarity_search?.ann_algorithms?.includes('IVF_FLAT') || false,
      lsh: db.vector_similarity_search?.ann_algorithms?.includes('LSH') || false,
      quantization: db.vector_similarity_search?.ann_algorithms?.includes('PQ') || false,
    },
    searchCapabilities: {
      similaritySearch: true, // Default for vector DBs
      hybridSearch: db.vector_similarity_search?.filtering || false,
      filtering: db.vector_similarity_search?.filtering || false,
      pagination: true, // Default, adjust as needed
    },
    aiCapabilities: {
      features: {
        embeddingGeneration: false, // Default, adjust if known
        llmIntegration: integrationFrameworks.includes('LangChain') || 
                        integrationFrameworks.includes('LlamaIndex') || false,
        ragSupport: integrationFrameworks.includes('LangChain') || 
                    integrationFrameworks.includes('LlamaIndex') || false,
        semanticCaching: false, // Default, adjust if known
        modelHosting: false, // Default, adjust if known
        fineTuning: false, // Default, adjust if known
      },
      scores: {
        llmIntegration: integrationFrameworks.includes('LangChain') || 
                        integrationFrameworks.includes('LlamaIndex') ? 7 : 3,
        embeddingGeneration: 5, // Default, adjust as needed
        ragSupport: integrationFrameworks.includes('LangChain') || 
                    integrationFrameworks.includes('LlamaIndex') ? 7 : 3,
        fineTuning: 3, // Default, adjust as needed
        modelHosting: 3, // Default, adjust as needed
      },
      supportedModels: {
        openai: integrationFrameworks.includes('LangChain') || false,
        huggingface: integrationFrameworks.includes('LangChain') || false,
        pytorch: false, // Default, adjust if known
        tensorflow: false, // Default, adjust if known
        langchain: integrationFrameworks.includes('LangChain') || false,
        llamaindex: integrationFrameworks.includes('LlamaIndex') || false,
      },
      ragFeatures: [
        "Semantic search",
        ...(db.vector_similarity_search?.filtering ? ["Metadata filtering"] : []),
        ...(db.vector_similarity_search?.filtering ? ["Hybrid search"] : []),
        "Real-time updates",
        ...(db.additional_features?.batch_processing ? ["Batch operations"] : []),
      ],
      ragLimitations: [
        "No built-in fine-tuning",
        "Limited model hosting",
        "No built-in caching",
      ], // Default, adjust as needed
    },
  };

  // Format the database object as a string
  const dbString = `  {
    id: "${transformedDb.id}",
    name: "${transformedDb.name}",
    logoId: "${transformedDb.logoId}",
    description: "${transformedDb.description}",
    company: {
      name: "${transformedDb.company.name}",
      founded: ${transformedDb.company.founded},
      funding: "${transformedDb.company.funding}",
      employees: ${transformedDb.company.employees},
    },
    features: {
      cloudNative: ${transformedDb.features.cloudNative},
      serverless: ${transformedDb.features.serverless},
      hybridSearch: ${transformedDb.features.hybridSearch},
      metadataFiltering: ${transformedDb.features.metadataFiltering},
      batchOperations: ${transformedDb.features.batchOperations},
    },
    performance: {
      latency: "${transformedDb.performance.latency}",
      throughput: "${transformedDb.performance.throughput}",
      scalability: "${transformedDb.performance.scalability}",
      queryLatencyMs: ${transformedDb.performance.queryLatencyMs},
      indexingSpeedVectorsPerSec: ${transformedDb.performance.indexingSpeedVectorsPerSec},
      memoryUsageMb: ${transformedDb.performance.memoryUsageMb},
      scalabilityScore: ${transformedDb.performance.scalabilityScore},
      accuracyScore: ${transformedDb.performance.accuracyScore}
    },
    security: {
      encryption: ${transformedDb.security.encryption},
      authentication: ${transformedDb.security.authentication},
      access_control: ${transformedDb.security.access_control},
      auditLogging: ${transformedDb.security.auditLogging},
    },
    algorithms: {
      hnsw: ${transformedDb.algorithms.hnsw},
      ivf: ${transformedDb.algorithms.ivf},
      lsh: ${transformedDb.algorithms.lsh},
      quantization: ${transformedDb.algorithms.quantization},
    },
    searchCapabilities: {
      similaritySearch: ${transformedDb.searchCapabilities.similaritySearch},
      hybridSearch: ${transformedDb.searchCapabilities.hybridSearch},
      filtering: ${transformedDb.searchCapabilities.filtering},
      pagination: ${transformedDb.searchCapabilities.pagination},
    },
    aiCapabilities: {
      features: {
        embeddingGeneration: ${transformedDb.aiCapabilities.features.embeddingGeneration},
        llmIntegration: ${transformedDb.aiCapabilities.features.llmIntegration},
        ragSupport: ${transformedDb.aiCapabilities.features.ragSupport},
        semanticCaching: ${transformedDb.aiCapabilities.features.semanticCaching},
        modelHosting: ${transformedDb.aiCapabilities.features.modelHosting},
        fineTuning: ${transformedDb.aiCapabilities.features.fineTuning},
      },
      scores: {
        llmIntegration: ${transformedDb.aiCapabilities.scores.llmIntegration},
        embeddingGeneration: ${transformedDb.aiCapabilities.scores.embeddingGeneration},
        ragSupport: ${transformedDb.aiCapabilities.scores.ragSupport},
        fineTuning: ${transformedDb.aiCapabilities.scores.fineTuning},
        modelHosting: ${transformedDb.aiCapabilities.scores.modelHosting},
      },
      supportedModels: {
        openai: ${transformedDb.aiCapabilities.supportedModels.openai},
        huggingface: ${transformedDb.aiCapabilities.supportedModels.huggingface},
        pytorch: ${transformedDb.aiCapabilities.supportedModels.pytorch},
        tensorflow: ${transformedDb.aiCapabilities.supportedModels.tensorflow},
        langchain: ${transformedDb.aiCapabilities.supportedModels.langchain},
        llamaindex: ${transformedDb.aiCapabilities.supportedModels.llamaindex},
      },
      ragFeatures: ${JSON.stringify(transformedDb.aiCapabilities.ragFeatures)},
      ragLimitations: ${JSON.stringify(transformedDb.aiCapabilities.ragLimitations)},
    },
  },`;

  // Insert the new database into the TypeScript file
  const lastBracketIndex = databasesTs.lastIndexOf(']');
  databasesTs = databasesTs.substring(0, lastBracketIndex) + dbString + "\n" + databasesTs.substring(lastBracketIndex);

  console.log(`Added ${db.name}`);
});

// Write the updated TypeScript file
fs.writeFileSync(path.join(process.cwd(), 'src/data/databases.ts'), databasesTs);

console.log('Migration completed!'); 