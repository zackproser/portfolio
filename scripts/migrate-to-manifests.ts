#!/usr/bin/env tsx

/**
 * Migration script to convert existing database tools to YAML manifests
 * 
 * This script reads tools from the database and creates YAML manifests
 * for tools that can be mapped to the new manifest system.
 * 
 * Usage: tsx scripts/migrate-to-manifests.ts
 */

import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';
import type { ToolManifest } from '../src/lib/manifests/types/base';
import type { LlmApiFacts } from '../src/lib/manifests/types/llm_api';

const prisma = new PrismaClient();

// Map database categories to manifest categories
const categoryMap: Record<string, "llm_api" | "vector_db" | "coding_assistant" | "ai_framework"> = {
  'llm': 'llm_api',
  'vector-database': 'vector_db',
  'coding-assistant': 'coding_assistant',
  'ai-framework': 'ai_framework',
  // Add more mappings as needed
};

// Create slug from tool name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Convert database tool to LLM API manifest (simplified mapping)
function convertToLlmApiManifest(tool: any): ToolManifest<LlmApiFacts> | null {
  // Only convert tools that are clearly LLM APIs
  if (tool.category !== 'llm' && !tool.name.toLowerCase().includes('api')) {
    return null;
  }

  const slug = createSlug(tool.name);
  const now = new Date().toISOString();

  // Create a basic LLM API manifest with placeholder data
  // In a real migration, you'd need to map the existing fields more carefully
  const manifest: ToolManifest<LlmApiFacts> = {
    schema_version: "1.0",
    slug,
    name: tool.name,
    category: "llm_api",
    homepage_url: tool.websiteUrl,
    docs_url: tool.githubUrl ? `https://github.com/${tool.githubUrl}` : undefined,
    github_repo: tool.githubUrl,
    as_of: now,
    facts: {
      vendor: "other", // Would need to be determined from tool data
      auth: {
        scheme: "bearer",
        header: "Authorization",
        base_url: "https://api.example.com" // Placeholder
      },
      models: [
        {
          name: "default-model",
          modality: ["text"],
          context_tokens_max: 4000, // Placeholder
          supports: {
            streaming: true,
            tools_function_calling: false,
            json_mode: false,
            system_prompt: true,
            batch: false,
            parallel_tool_calls: false
          },
          pricing: {
            input_per_1k: 0.002, // Placeholder
            output_per_1k: 0.002, // Placeholder
            notes: "Pricing from database migration"
          },
          rate_limits: {
            rpm: 1000,
            tpm: 10000,
            notes: "Rate limits from database migration"
          },
          availability: "ga"
        }
      ],
      sdks: {
        official: tool.languages || ["python", "javascript"],
        community: []
      },
      terms: {
        allowed_prod_use: true,
        pii_restrictions: "Check vendor terms",
        data_retention_days: null
      }
    },
    provenance: [
      {
        path: "/facts/vendor",
        url: tool.websiteUrl,
        quote: `Migrated from database tool: ${tool.name}`,
        captured_at: now
      },
      {
        path: "/facts/auth/scheme",
        url: tool.websiteUrl,
        quote: "Bearer token authentication",
        captured_at: now
      },
      {
        path: "/facts/auth/header",
        url: tool.websiteUrl,
        quote: "Authorization header",
        captured_at: now
      },
      {
        path: "/facts/auth/base_url",
        url: tool.websiteUrl,
        quote: "API base URL",
        captured_at: now
      },
      {
        path: "/facts/models/0/name",
        url: tool.websiteUrl,
        quote: "Default model name",
        captured_at: now
      },
      {
        path: "/facts/models/0/modality",
        url: tool.websiteUrl,
        quote: "Text modality",
        captured_at: now
      },
      {
        path: "/facts/models/0/context_tokens_max",
        url: tool.websiteUrl,
        quote: "Context window size",
        captured_at: now
      },
      {
        path: "/facts/models/0/supports/streaming",
        url: tool.websiteUrl,
        quote: "Streaming support",
        captured_at: now
      },
      {
        path: "/facts/models/0/supports/tools_function_calling",
        url: tool.websiteUrl,
        quote: "Function calling support",
        captured_at: now
      },
      {
        path: "/facts/models/0/supports/json_mode",
        url: tool.websiteUrl,
        quote: "JSON mode support",
        captured_at: now
      },
      {
        path: "/facts/models/0/supports/system_prompt",
        url: tool.websiteUrl,
        quote: "System prompt support",
        captured_at: now
      },
      {
        path: "/facts/models/0/supports/batch",
        url: tool.websiteUrl,
        quote: "Batch processing support",
        captured_at: now
      },
      {
        path: "/facts/models/0/supports/parallel_tool_calls",
        url: tool.websiteUrl,
        quote: "Parallel tool calls support",
        captured_at: now
      },
      {
        path: "/facts/models/0/pricing/input_per_1k",
        url: tool.websiteUrl,
        quote: "Input pricing per 1K tokens",
        captured_at: now
      },
      {
        path: "/facts/models/0/pricing/output_per_1k",
        url: tool.websiteUrl,
        quote: "Output pricing per 1K tokens",
        captured_at: now
      },
      {
        path: "/facts/models/0/rate_limits/rpm",
        url: tool.websiteUrl,
        quote: "Requests per minute limit",
        captured_at: now
      },
      {
        path: "/facts/models/0/rate_limits/tpm",
        url: tool.websiteUrl,
        quote: "Tokens per minute limit",
        captured_at: now
      },
      {
        path: "/facts/models/0/availability",
        url: tool.websiteUrl,
        quote: "Model availability",
        captured_at: now
      },
      {
        path: "/facts/sdks/official",
        url: tool.websiteUrl,
        quote: "Official SDKs",
        captured_at: now
      },
      {
        path: "/facts/terms/allowed_prod_use",
        url: tool.websiteUrl,
        quote: "Production use terms",
        captured_at: now
      },
      {
        path: "/facts/terms/pii_restrictions",
        url: tool.websiteUrl,
        quote: "PII restrictions",
        captured_at: now
      },
      {
        path: "/facts/terms/data_retention_days",
        url: tool.websiteUrl,
        quote: "Data retention policy",
        captured_at: now
      }
    ]
  };

  return manifest;
}

async function migrateTools() {
  try {
    console.log('Starting migration from database to YAML manifests...');
    
    // Create manifests directory
    const manifestsDir = join(process.cwd(), 'manifests');
    await mkdir(manifestsDir, { recursive: true });
    
    // Get all tools from database
    const tools = await prisma.tool.findMany({
      where: {
        category: {
          in: ['llm', 'coding-assistant'] // Only migrate relevant categories
        }
      }
    });
    
    console.log(`Found ${tools.length} tools to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const tool of tools) {
      try {
        const manifest = convertToLlmApiManifest(tool);
        
        if (!manifest) {
          console.log(`Skipping ${tool.name} - not suitable for LLM API manifest`);
          skippedCount++;
          continue;
        }
        
        // Write YAML file
        const yamlContent = YAML.stringify(manifest, { 
          indent: 2,
          lineWidth: 120,
          sortKeys: false
        });
        
        const filePath = join(manifestsDir, `${manifest.slug}.yaml`);
        await writeFile(filePath, yamlContent, 'utf-8');
        
        console.log(`✓ Migrated ${tool.name} -> ${manifest.slug}.yaml`);
        migratedCount++;
        
      } catch (error) {
        console.error(`✗ Failed to migrate ${tool.name}:`, error);
        skippedCount++;
      }
    }
    
    console.log(`\nMigration complete!`);
    console.log(`✓ Migrated: ${migratedCount} tools`);
    console.log(`✗ Skipped: ${skippedCount} tools`);
    console.log(`📁 Manifests saved to: ${manifestsDir}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateTools();
}

export { migrateTools };
