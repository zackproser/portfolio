#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

// Files to process
const filePatterns = [
  'src/content/**/*.mdx',
  'src/app/**/*.mdx'
];

function fixMdxFile(filePath) {
  console.log(`📁 Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let updated = false;
    
    // Remove leftover import fragments
    content = content.replace(/assert\s*\{\s*type:\s*['"]json['"]\s*\}\s*;?\s*\n?/g, (match) => {
      updated = true;
      console.log(`  🗑️  Removed assert fragment: ${match.trim()}`);
      return '';
    });
    
    content = content.replace(/createMetadata\(rawMetadata\)\s*;?\s*\n?/g, (match) => {
      updated = true;
      console.log(`  🗑️  Removed createMetadata fragment: ${match.trim()}`);
      return '';
    });
    
    // Remove any remaining malformed JSX expressions
    content = content.replace(/^\s*\{\s*\}\s*$/gm, (match) => {
      updated = true;
      console.log(`  🗑️  Removed malformed expression: ${match}`);
      return '';
    });
    
    // Remove any remaining malformed JSX expressions with newlines
    content = content.replace(/^\s*\{\s*\n\s*\}\s*$/gm, (match) => {
      updated = true;
      console.log(`  🗑️  Removed malformed multi-line expression: ${match}`);
      return '';
    });
    
    // Remove any remaining malformed JSX expressions with content
    content = content.replace(/^\s*\{\s*[^}]*\s*\}\s*$/gm, (match) => {
      if (match.trim() === '{}' || match.trim() === '{ }' || match.trim().match(/^\{\s*\n\s*\}$/)) {
        updated = true;
        console.log(`  🗑️  Removed malformed expression: ${match}`);
        return '';
      }
      return match;
    });
    
    // Remove any remaining malformed JSX expressions at the start of lines
    content = content.replace(/^\s*\{\s*\}\s*/gm, (match) => {
      updated = true;
      console.log(`  🗑️  Removed malformed expression at line start: ${match}`);
      return '';
    });
    
    // Remove any remaining malformed JSX expressions with content at the start of lines
    content = content.replace(/^\s*\{\s*[^}]*\s*\}\s*/gm, (match) => {
      if (match.trim() === '{}' || match.trim() === '{ }' || match.trim().match(/^\{\s*\n\s*\}$/)) {
        updated = true;
        console.log(`  🗑️  Removed malformed expression at line start: ${match}`);
        return '';
      }
      return match;
    });
    
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
  console.log('🔧 Fixing Remaining MDX Issues\n');
  
  const files = await glob(filePatterns);
  console.log(`Found ${files.length} MDX files to process\n`);
  
  for (const file of files) {
    fixMdxFile(file);
  }
  
  console.log('\n✅ Fix completed!');
}

main().catch(console.error); 