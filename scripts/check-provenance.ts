#!/usr/bin/env tsx

/**
 * Provenance coverage checker for tool manifests
 * 
 * This script ensures that every non-null fact in manifests has
 * corresponding provenance entries.
 * 
 * Usage: tsx scripts/check-provenance.ts
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';
import { collectJsonPointers, enforceProvenanceCoverage } from '../src/lib/manifests/types/base';

async function checkProvenance() {
  try {
    console.log('🔍 Checking provenance coverage...\n');
    
    const manifestsDir = join(process.cwd(), 'manifests');
    const files = await readdir(manifestsDir);
    const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    
    if (yamlFiles.length === 0) {
      console.log('⚠️  No YAML manifest files found in manifests/ directory');
      return;
    }
    
    console.log(`Found ${yamlFiles.length} manifest files to check\n`);
    
    let validCount = 0;
    let invalidCount = 0;
    const errors: string[] = [];
    
    for (const file of yamlFiles) {
      try {
        console.log(`📄 Checking provenance in ${file}...`);
        
        const filePath = join(manifestsDir, file);
        const content = await readFile(filePath, 'utf-8');
        const doc = YAML.parse(content);
        
        // Check provenance coverage
        try {
          enforceProvenanceCoverage(doc);
          console.log(`  ✅ ${file} - Provenance coverage complete`);
          validCount++;
        } catch (error) {
          errors.push(`${file}: ${error}`);
          invalidCount++;
        }
        
      } catch (error) {
        errors.push(`${file}: Parse error - ${error}`);
        invalidCount++;
      }
    }
    
    console.log(`\n📊 Provenance Coverage Results:`);
    console.log(`  ✅ Complete: ${validCount}`);
    console.log(`  ❌ Incomplete: ${invalidCount}`);
    
    if (errors.length > 0) {
      console.log(`\n❌ Provenance Issues:`);
      errors.forEach(error => console.log(`  • ${error}`));
      process.exit(1);
    } else {
      console.log(`\n🎉 All manifests have complete provenance coverage!`);
    }
    
  } catch (error) {
    console.error('❌ Provenance check failed:', error);
    process.exit(1);
  }
}

// Run check if called directly
if (require.main === module) {
  checkProvenance();
}

export { checkProvenance };
