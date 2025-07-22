#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

// Files to process
const filePatterns = [
  'src/content/**/*.mdx',
  'src/app/**/*.mdx'
];

function cleanupMdxFile(filePath) {
  console.log(`📁 Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let updated = false;
    
    // Remove import statements
    const importRegex = /import\s+.*?from\s+['"`].*?['"`]\s*;?\s*\n?/g;
    const newContent = content.replace(importRegex, (match) => {
      updated = true;
      console.log(`  🗑️  Removed import: ${match.trim()}`);
      return '';
    });
    
    // Remove export const metadata statements
    const exportMetadataRegex = /export\s+const\s+metadata\s*=\s*.*?;?\s*\n?/g;
    const finalContent = newContent.replace(exportMetadataRegex, (match) => {
      updated = true;
      console.log(`  🗑️  Removed export: ${match.trim()}`);
      return '';
    });
    
    if (updated) {
      fs.writeFileSync(filePath, finalContent);
      console.log(`  ✅ Updated: ${filePath}`);
    } else {
      console.log(`  ⏭️  No changes needed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}: ${error.message}`);
  }
}

async function main() {
  console.log('🧹 Cleaning up MDX import/export statements...\n');
  
  const files = await glob(filePatterns);
  console.log(`Found ${files.length} MDX files to process\n`);
  
  for (const file of files) {
    cleanupMdxFile(file);
  }
  
  console.log('\n🎉 MDX cleanup complete!');
}

main().catch(console.error); 