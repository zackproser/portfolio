import { z } from "zod";

// Company info schema
export const companyInfoSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  founded: z.number().int().min(1900).max(new Date().getFullYear()),
  funding: z.string(),
  employees: z.number().int().min(0),
});

// Features schema
export const featuresSchema = z.object({
  cloudNative: z.boolean(),
  serverless: z.boolean(),
  hybridSearch: z.boolean(),
  metadataFiltering: z.boolean(),
  batchOperations: z.boolean(),
});

// Performance schema with validation
export const performanceSchema = z.object({
  latency: z.string(),
  throughput: z.string(),
  scalability: z.string(),
  queryLatencyMs: z.number().int().min(0).max(10000),
  indexingSpeedVectorsPerSec: z.number().int().min(0),
  memoryUsageMb: z.number().int().min(0),
  scalabilityScore: z.number().int().min(0).max(100),
  accuracyScore: z.number().int().min(0).max(100),
});

// Security schema
export const securitySchema = z.object({
  encryption: z.boolean(),
  authentication: z.boolean(),
  access_control: z.boolean().optional(),
  audit_logging: z.boolean().optional(),
});

// Algorithms schema
export const algorithmsSchema = z.object({
  hnsw: z.boolean(),
  ivf: z.boolean(),
  lsh: z.boolean(),
  quantization: z.boolean(),
});

// Search capabilities schema
export const searchCapabilitiesSchema = z.object({
  similaritySearch: z.boolean(),
  hybridSearch: z.boolean(),
  filtering: z.boolean(),
  pagination: z.boolean(),
});

// AI capabilities schema
export const aiCapabilitiesSchema = z.object({
  features: z.object({
    embeddingGeneration: z.boolean(),
    llmIntegration: z.boolean(),
    ragSupport: z.boolean(),
    semanticCaching: z.boolean().optional(),
    modelHosting: z.boolean().optional(),
    fineTuning: z.boolean().optional(),
  }),
  scores: z.object({
    llmIntegration: z.number().int().min(0).max(10),
    embeddingGeneration: z.number().int().min(0).max(10),
    ragSupport: z.number().int().min(0).max(10),
    fineTuning: z.number().int().min(0).max(10),
    modelHosting: z.number().int().min(0).max(10),
  }),
  supportedModels: z.object({
    openai: z.boolean(),
    huggingface: z.boolean(),
    pytorch: z.boolean(),
    tensorflow: z.boolean(),
    langchain: z.boolean(),
    llamaindex: z.boolean(),
  }).optional(),
  ragFeatures: z.array(z.string()).optional(),
  ragLimitations: z.array(z.string()).optional(),
});

// Complete database form schema
export const vectorDatabaseFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  logoId: z.string().min(1, "Logo ID is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  company: companyInfoSchema,
  features: featuresSchema,
  performance: performanceSchema,
  security: securitySchema,
  algorithms: algorithmsSchema,
  searchCapabilities: searchCapabilitiesSchema,
  aiCapabilities: aiCapabilitiesSchema,
});

// Metadata schema for individual fields
export const metricMetadataSchema = z.object({
  fieldName: z.string(),
  isEstimate: z.boolean().default(true),
  confidence: z.number().min(0).max(1).optional(),
  sourceUrl: z.string().url().optional().nullable(),
  sourceType: z.enum(["official", "api", "community", "estimate"]),
  verifiedBy: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Source types for data provenance
export const dataSourceSchema = z.object({
  name: z.string(),
  url: z.string().url().optional().nullable(),
  type: z.enum(["official", "api", "community", "estimate"]),
});

export type VectorDatabaseFormValues = z.infer<typeof vectorDatabaseFormSchema>;
export type MetricMetadata = z.infer<typeof metricMetadataSchema>;
export type DataSourceValues = z.infer<typeof dataSourceSchema>;

// Helper to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
