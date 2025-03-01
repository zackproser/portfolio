#!/usr/bin/env node

/**
 * This script updates import paths from @/lib/shared-types to @/types
 * Run with: node scripts/update-imports.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files that import from the old location
const findCommand = "grep -r \"from '@/lib/shared-types'\" --include='*.ts' --include='*.tsx' --include='*.mdx' src";
const files = execSync(findCommand).toString().split('\n');

// Process each file
files.forEach(line => {
  if (!line) return;
  
  // Extract file path
  const filePath = line.split(':')[0];
  if (!filePath || !fs.existsSync(filePath)) return;
  
  console.log(`Processing ${filePath}...`);
  
  // Read file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace import paths
  const updatedContent = content.replace(/from ['"]@\/lib\/shared-types['"]/g, "from '@/types'");
  
  // Write updated content back to file
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${filePath}`);
  }
});

console.log('Import paths updated successfully!'); 