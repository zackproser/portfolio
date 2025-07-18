#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Specific files that still have import statements
const filesToFix = [
  'src/content/blog/openai-codex-review/page.mdx',
  'src/content/blog/top-ai-dev-tools-bugs/page.mdx'
];

function fixMdxFile(filePath) {
  console.log(`📁 Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let updated = false;
    
    // Remove import statements at the beginning of the file
    content = content.replace(/^import\s+.*?from\s+['"`].*?['"`]\s*;?\s*\n?/gm, (match) => {
      updated = true;
      console.log(`  🗑️  Removed import: ${match.trim()}`);
      return '';
    });
    
    // Remove any remaining import statements anywhere in the file
    content = content.replace(/import\s+.*?from\s+['"`].*?['"`]\s*;?\s*\n?/g, (match) => {
      updated = true;
      console.log(`  🗑️  Removed import: ${match.trim()}`);
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
  console.log('🔧 Fixing Final Import Statements\n');
  
  for (const file of filesToFix) {
    fixMdxFile(file);
  }
  
  console.log('\n✅ Fix completed!');
}

main().catch(console.error); 