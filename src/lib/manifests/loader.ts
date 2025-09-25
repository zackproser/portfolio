import type { ToolManifest } from "./types/base";
import type { LlmApiFacts } from "./types/llm_api";
import { enforceProvenanceCoverage } from "./types/base";
import YAML from "yaml";
import Ajv from "ajv";
import { join } from "path";

// Manifest provider interface for flexible storage
export interface ManifestProvider {
  list(category?: string): Promise<string[]>;             // slugs
  read(slug: string): Promise<string>;                    // YAML text
}

// Base manifest validation schema
const baseManifestSchema = {
  type: "object",
  properties: {
    schema_version: { type: "string", const: "1.0" },
    slug: { type: "string" },
    name: { type: "string" },
    category: { type: "string", enum: ["llm_api", "vector_db", "coding_assistant", "ai_framework"] },
    homepage_url: { type: "string" },
    docs_url: { type: "string" },
    github_repo: { type: "string" },
    as_of: { type: "string" },
    facts: { type: "object" },
    provenance: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          url: { type: "string" },
          quote: { type: "string" },
          captured_at: { type: "string" }
        },
        required: ["path", "url", "captured_at"],
        additionalProperties: false
      }
    }
  },
  required: ["schema_version", "slug", "name", "category", "homepage_url", "as_of", "facts", "provenance"],
  additionalProperties: false
};

// Initialize AJV validator
const ajv = new Ajv({ allErrors: true, strict: false });
const validateBase = ajv.compile(baseManifestSchema);

// Load and validate a manifest
export async function loadManifest<TFacts>(
  slug: string,
  provider: ManifestProvider,
  validateFacts: (x: unknown) => boolean
): Promise<ToolManifest<TFacts>> {
  try {
    const text = await provider.read(slug);
    const doc = YAML.parse(text);
    
    // Validate base schema
    if (!validateBase(doc)) {
      const errors = ajv.errorsText(validateBase.errors);
      throw new Error(`Base schema validation failed for ${slug}: ${errors}`);
    }
    
    // Validate facts schema
    if (!validateFacts(doc.facts)) {
      throw new Error(`Facts schema validation failed for ${slug}`);
    }
    
    // Enforce provenance coverage
    enforceProvenanceCoverage(doc as any);
    
    return doc as unknown as ToolManifest<TFacts>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load manifest ${slug}: ${error.message}`);
    }
    throw error;
  }
}

// Load LLM API manifest specifically
export async function loadLlmApiManifest(
  slug: string,
  provider: ManifestProvider
): Promise<ToolManifest<LlmApiFacts>> {
  const validateFacts = ajv.compile(require("./types/llm_api").llmApiFactsSchema);
  return loadManifest<LlmApiFacts>(slug, provider, validateFacts);
}

// File system provider for development
export class FileSystemProvider implements ManifestProvider {
  constructor(private basePath: string) {}
  
  async list(category?: string): Promise<string[]> {
    const fs = await import("fs/promises");
    const path = await import("path");
    
    try {
      const files = await fs.readdir(this.basePath);
      const yamlFiles = files
        .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
        .map(f => f.replace(/\.(yaml|yml)$/, ''));
      
      return yamlFiles;
    } catch (error) {
      console.error('Error listing manifest files:', error);
      return [];
    }
  }
  
  async read(slug: string): Promise<string> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(this.basePath, `${slug}.yaml`);
    return fs.readFile(filePath, "utf-8");
  }
}

// Environment-based provider selection
export function createManifestProvider(): ManifestProvider {
  const manifestPath = process.env.MANIFEST_PATH || join(process.cwd(), "manifests");
  return new FileSystemProvider(manifestPath);
}
