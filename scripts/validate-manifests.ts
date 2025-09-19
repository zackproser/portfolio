#!/usr/bin/env tsx

/**
 * Validation script for tool manifests
 * 
 * This script validates all YAML manifests against their JSON schemas
 * and checks for common issues.
 * 
 * Usage: tsx scripts/validate-manifests.ts
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';
import Ajv from 'ajv';
import { loadLlmApiManifest, createManifestProvider } from '../src/lib/manifests/loader';

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

const ajv = new Ajv({ allErrors: true, strict: false });
const validateBase = ajv.compile(baseManifestSchema);

async function validateManifests() {
  try {
    console.log('🔍 Validating tool manifests...\n');
    
    const manifestsDir = join(process.cwd(), 'manifests');
    const files = await readdir(manifestsDir);
    const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    
    if (yamlFiles.length === 0) {
      console.log('⚠️  No YAML manifest files found in manifests/ directory');
      return;
    }
    
    console.log(`Found ${yamlFiles.length} manifest files to validate\n`);
    
    let validCount = 0;
    let invalidCount = 0;
    const errors: string[] = [];
    
    for (const file of yamlFiles) {
      try {
        console.log(`📄 Validating ${file}...`);
        
        const filePath = join(manifestsDir, file);
        const content = await readFile(filePath, 'utf-8');
        const doc = YAML.parse(content);
        
        // Validate base schema
        if (!validateBase(doc)) {
          const errorText = ajv.errorsText(validateBase.errors);
          errors.push(`${file}: Base schema validation failed - ${errorText}`);
          invalidCount++;
          continue;
        }
        
        // Validate category-specific schema
        if (doc.category === 'llm_api') {
          try {
            const provider = createManifestProvider();
            await loadLlmApiManifest(doc.slug, provider);
            console.log(`  ✅ ${file} - Valid`);
            validCount++;
          } catch (error) {
            errors.push(`${file}: LLM API schema validation failed - ${error}`);
            invalidCount++;
          }
        } else {
          console.log(`  ⚠️  ${file} - Category ${doc.category} validation not implemented yet`);
          validCount++;
        }
        
      } catch (error) {
        errors.push(`${file}: Parse error - ${error}`);
        invalidCount++;
      }
    }
    
    console.log(`\n📊 Validation Results:`);
    console.log(`  ✅ Valid: ${validCount}`);
    console.log(`  ❌ Invalid: ${invalidCount}`);
    
    if (errors.length > 0) {
      console.log(`\n❌ Validation Errors:`);
      errors.forEach(error => console.log(`  • ${error}`));
      process.exit(1);
    } else {
      console.log(`\n🎉 All manifests are valid!`);
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run validation if called directly
if (require.main === module) {
  validateManifests();
}

export { validateManifests };
