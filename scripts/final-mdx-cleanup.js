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
    
    // Remove Image components with empty src
    content = content.replace(
      /<Image[^>]*src=\{\}[^>]*\/?>/g,
      (match) => {
        updated = true;
        console.log(`  🗑️  Removed Image with empty src: ${match.trim()}`);
        return '';
      }
    );
    
    // Remove Image components with empty expressions like src={}
    content = content.replace(
      /<Image[^>]*src=\{\s*\}[^>]*\/?>/g,
      (match) => {
        updated = true;
        console.log(`  🗑️  Removed Image with empty expression: ${match.trim()}`);
        return '';
      }
    );
    
    // Remove any remaining problematic expressions
    content = content.replace(
      /\{\s*\}/g,
      (match) => {
        updated = true;
        console.log(`  🗑️  Removed empty expression: ${match}`);
        return '';
      }
    );
    
    // Remove any malformed JSX expressions
    content = content.replace(
      /\{[^}]*\s*\}/g,
      (match) => {
        if (match.trim() === '{}' || match.trim() === '{ }') {
          updated = true;
          console.log(`  🗑️  Removed malformed expression: ${match}`);
          return '';
        }
        return match;
      }
    );
    
    // Ensure there's a proper export default at the end
    if (!content.includes('export default')) {
      content += '\n\nexport default function Page() {\n  return <div dangerouslySetInnerHTML={{ __html: "" }} />\n}\n';
      updated = true;
      console.log(`  ➕ Added export default`);
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ Updated: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🧹 Final MDX Cleanup - Fixing Empty Expressions\n');
  
  const files = await glob(filePatterns);
  console.log(`Found ${files.length} MDX files to process\n`);
  
  for (const file of files) {
    cleanupMdxFile(file);
  }
  
  console.log('\n✅ Final cleanup completed!');
}

main().catch(console.error); 