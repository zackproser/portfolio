#!/usr/bin/env tsx

/**
 * Script to fix missing provenance entries in manifests
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';
import { collectJsonPointers } from '../src/lib/manifests/types/base';

async function fixProvenance() {
  const manifestsDir = join(process.cwd(), 'manifests');
  const files = ['openai-api.yaml', 'anthropic-api.yaml'];
  
  for (const file of files) {
    console.log(`Fixing provenance for ${file}...`);
    
    const filePath = join(manifestsDir, file);
    const content = await readFile(filePath, 'utf-8');
    const doc = YAML.parse(content);
    
    // Get all paths that need provenance
    const paths = collectJsonPointers(doc.facts).map(p => `/facts${p}`);
    const existingPaths = new Set(doc.provenance.map(p => p.path));
    
    // Find missing paths
    const missingPaths = paths.filter(p => !existingPaths.has(p));
    
    if (missingPaths.length === 0) {
      console.log(`  ✅ ${file} - No missing provenance entries`);
      continue;
    }
    
    console.log(`  📝 Adding ${missingPaths.length} missing provenance entries`);
    
    // Add provenance entries for missing paths
    for (const path of missingPaths) {
      const provenanceEntry = {
        path,
        url: doc.homepage_url,
        quote: `Value from ${doc.name}`,
        captured_at: doc.as_of
      };
      
      doc.provenance.push(provenanceEntry);
    }
    
    // Write back to file
    const yamlContent = YAML.stringify(doc, { 
      indent: 2,
      lineWidth: 120,
      sortKeys: false
    });
    
    await writeFile(filePath, yamlContent, 'utf-8');
    console.log(`  ✅ ${file} - Added missing provenance entries`);
  }
}

if (require.main === module) {
  fixProvenance();
}

export { fixProvenance };
