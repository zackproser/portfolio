#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all MDX files
function findMdxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
        results = results.concat(findMdxFiles(filePath));
      }
    } else if (file.endsWith('.mdx')) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to check if file is essentially empty
function isEmptyOrInvalid(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const trimmed = content.trim();
  
  // Check if file is empty, only whitespace, or just has a button/link
  if (trimmed === '' || 
      trimmed === '---' || 
      trimmed === '<Button href="#">Read the article</Button>' ||
      trimmed.length < 50) {
    return true;
  }
  
  return false;
}

// Function to add minimal content to empty files
function fixEmptyFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const trimmed = content.trim();
  
  // If it's just a button, replace with a proper article
  if (trimmed === '<Button href="#">Read the article</Button>') {
    const newContent = `# Article Coming Soon

This article is currently being written. Please check back soon!

## What to expect

This article will provide valuable insights and practical guidance on the topic.

---

*This is a placeholder while the full article is being prepared.*`;
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Fixed button-only content in: ${filePath}`);
    return true;
  }
  
  // If it's empty or just dashes, add minimal content
  if (trimmed === '' || trimmed === '---') {
    const newContent = `# Article Coming Soon

This article is currently being written. Please check back soon!

---

*This is a placeholder while the full article is being prepared.*`;
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added minimal content to: ${filePath}`);
    return true;
  }
  
  // If it's very short, add a note
  if (trimmed.length < 50) {
    const newContent = `${content.trim()}

---

*This article is currently being expanded. Please check back soon for the full content.*`;
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Enhanced short content in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔍 Finding all MDX files...');
const mdxFiles = findMdxFiles('./src/content');
console.log(`Found ${mdxFiles.length} MDX files`);

let fixedCount = 0;
mdxFiles.forEach(filePath => {
  if (isEmptyOrInvalid(filePath)) {
    if (fixEmptyFile(filePath)) {
      fixedCount++;
    }
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files`);
console.log('✅ All empty/invalid MDX files have been fixed!'); 