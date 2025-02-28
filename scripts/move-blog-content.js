#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories
const sourceDir = path.join(process.cwd(), 'src/app/blog');
const targetDir = path.join(process.cwd(), 'src/content/blog');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  console.log(`Creating target directory: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
}

// Get all directories in the source folder
const items = fs.readdirSync(sourceDir);

// Filter out non-directories and special directories
const slugDirs = items.filter(item => {
  const itemPath = path.join(sourceDir, item);
  return fs.statSync(itemPath).isDirectory() && 
         item !== '[slug]' && 
         !item.startsWith('test-');
});

console.log(`Found ${slugDirs.length} blog directories to move`);

// Move each directory
let successCount = 0;
let skipCount = 0;
let errorCount = 0;

for (const slug of slugDirs) {
  const sourcePath = path.join(sourceDir, slug);
  const targetPath = path.join(targetDir, slug);
  
  // Check if target already exists
  if (fs.existsSync(targetPath)) {
    console.log(`⚠️ Skipping ${slug} - already exists in target directory`);
    skipCount++;
    continue;
  }
  
  try {
    // Check if the directory has a page.mdx file
    const mdxPath = path.join(sourcePath, 'page.mdx');
    if (!fs.existsSync(mdxPath)) {
      console.log(`⚠️ Skipping ${slug} - no page.mdx file found`);
      skipCount++;
      continue;
    }
    
    // Create target directory
    fs.mkdirSync(targetPath, { recursive: true });
    
    // Copy all files from source to target
    const files = fs.readdirSync(sourcePath);
    for (const file of files) {
      const sourceFilePath = path.join(sourcePath, file);
      const targetFilePath = path.join(targetPath, file);
      
      // Only copy files, not directories
      if (fs.statSync(sourceFilePath).isFile()) {
        fs.copyFileSync(sourceFilePath, targetFilePath);
      }
    }
    
    console.log(`✅ Successfully moved ${slug}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Error moving ${slug}:`, error.message);
    errorCount++;
  }
}

console.log('\nSummary:');
console.log(`Total directories: ${slugDirs.length}`);
console.log(`Successfully moved: ${successCount}`);
console.log(`Skipped: ${skipCount}`);
console.log(`Errors: ${errorCount}`);
console.log('\nNext steps:');
console.log('1. Verify that the content loads correctly from the new location');
console.log('2. Once verified, you can safely delete the original directories from src/app/blog/');
console.log('   (This script only copies files, it does not delete the originals for safety)'); 