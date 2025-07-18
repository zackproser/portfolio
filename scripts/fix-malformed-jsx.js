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
    
    // Fix malformed Button elements with missing href values
    content = content.replace(/<Button\s+href=>([^<]*)<\/Button>/g, (match, text) => {
      updated = true;
      console.log(`  🔧 Fixed malformed Button: ${match.trim()}`);
      return `<Button href="#">${text}</Button>`;
    });
    
    // Fix malformed Button elements with missing href values (self-closing)
    content = content.replace(/<Button\s+href=\s*\/?>/g, (match) => {
      updated = true;
      console.log(`  🔧 Fixed malformed self-closing Button: ${match.trim()}`);
      return `<Button href="#" />`;
    });
    
    // Fix any other malformed JSX elements with missing attribute values
    content = content.replace(/<(\w+)\s+(\w+)=>\s*([^<]*)<\/\1>/g, (match, tag, attr, text) => {
      updated = true;
      console.log(`  🔧 Fixed malformed ${tag} with missing ${attr}: ${match.trim()}`);
      return `<${tag} ${attr}="#">${text}</${tag}>`;
    });
    
    // Fix any other malformed JSX elements with missing attribute values (self-closing)
    content = content.replace(/<(\w+)\s+(\w+)=\s*\/?>/g, (match, tag, attr) => {
      updated = true;
      console.log(`  🔧 Fixed malformed self-closing ${tag} with missing ${attr}: ${match.trim()}`);
      return `<${tag} ${attr}="#" />`;
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
  console.log('🔧 Fixing Malformed JSX Elements\n');
  
  const files = await glob(filePatterns);
  console.log(`Found ${files.length} MDX files to process\n`);
  
  for (const file of files) {
    fixMdxFile(file);
  }
  
  console.log('\n✅ Fix completed!');
}

main().catch(console.error); 