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
    content = content.replace(importRegex, (match) => {
      updated = true;
      console.log(`  🗑️  Removed import: ${match.trim()}`);
      return '';
    });
    
    // Remove export const metadata statements
    const exportMetadataRegex = /export\s+const\s+metadata\s*=\s*.*?;?\s*\n?/g;
    content = content.replace(exportMetadataRegex, (match) => {
      updated = true;
      console.log(`  🗑️  Removed export metadata: ${match.trim()}`);
      return '';
    });
    
    // Remove createMetadata() calls
    const createMetadataRegex = /createMetadata\s*\(\s*\{[\s\S]*?\}\s*\)\s*;?\s*\n?/g;
    content = content.replace(createMetadataRegex, (match) => {
      updated = true;
      console.log(`  🗑️  Removed createMetadata call`);
      return '';
    });
    
    // Remove standalone metadata objects (like the one in descript/page.mdx)
    const standaloneMetadataRegex = /^\s*\{\s*[\s\S]*?\}\s*$/gm;
    content = content.replace(standaloneMetadataRegex, (match) => {
      // Only remove if it looks like a metadata object (has title, author, etc.)
      if (match.includes('title:') || match.includes('author:') || match.includes('date:')) {
        updated = true;
        console.log(`  🗑️  Removed standalone metadata object`);
        return '';
      }
      return match;
    });
    
    // Remove references to undefined variables like metadata, aiAssistedDevTools, etc.
    const undefinedVarRegex = /(metadata|aiAssistedDevTools|comingOutOfYourShell|comingOutOfYourShell2)\s*\.\s*\w+/g;
    content = content.replace(undefinedVarRegex, (match, varName) => {
      updated = true;
      console.log(`  🗑️  Removed undefined variable reference: ${match}`);
      return '';
    });
    
    // Remove Image components with undefined variables
    const imageWithVarRegex = /<Image[^>]*src\s*=\s*\{[^}]+\}[^>]*\/?>/g;
    content = content.replace(imageWithVarRegex, (match) => {
      updated = true;
      console.log(`  🗑️  Removed Image with undefined variable: ${match.trim()}`);
      return '';
    });
    
    // Remove Button components with template literals
    const buttonWithTemplateRegex = /<Button[^>]*href\s*=\s*\{`[^`]+`\}[^>]*>[\s\S]*?<\/Button>/g;
    content = content.replace(buttonWithTemplateRegex, (match) => {
      updated = true;
      console.log(`  🗑️  Removed Button with template literal`);
      return '';
    });
    
    // Clean up any remaining references to metadata in ArticleLayout
    content = content.replace(/<ArticleLayout\s+metadata\s*=\s*\{[^}]+\}/g, '<ArticleLayout');
    
    // Remove any remaining export default statements that reference undefined variables
    const exportDefaultRegex = /export\s+default\s*\([^)]*\)\s*=>\s*<ArticleLayout[^>]*\/?>/g;
    content = content.replace(exportDefaultRegex, (match) => {
      updated = true;
      console.log(`  🗑️  Removed problematic export default`);
      return '';
    });
    
    // Add a simple export default if none exists
    if (!content.includes('export default')) {
      content = content + '\n\nexport default function Page() {\n  return <div dangerouslySetInnerHTML={{ __html: "" }} />\n}\n';
      updated = true;
      console.log(`  ➕ Added simple export default`);
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
  console.log('🧹 Starting comprehensive MDX cleanup...\n');
  
  const files = await glob(filePatterns);
  console.log(`Found ${files.length} MDX files to process\n`);
  
  let processedCount = 0;
  for (const file of files) {
    cleanupMdxFile(file);
    processedCount++;
  }
  
  console.log(`\n✅ Completed! Processed ${processedCount} files.`);
}

main().catch(console.error); 