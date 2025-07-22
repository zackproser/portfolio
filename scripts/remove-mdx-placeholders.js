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

// Function to remove placeholder from a file
function removePlaceholder(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Remove the placeholder export default function
  const placeholderRegex = /export default function Page\(\) \{[\s\S]*?return <div dangerouslySetInnerHTML=\{\{ __html: "" \}\} \/>[\s\S]*?\}/g;
  
  if (placeholderRegex.test(content)) {
    content = content.replace(placeholderRegex, '');
    updated = true;
    console.log(`✅ Removed placeholder from: ${filePath}`);
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return updated;
}

// Main execution
console.log('🔍 Finding all MDX files...');
const mdxFiles = findMdxFiles('./src/content');
console.log(`Found ${mdxFiles.length} MDX files`);

let updatedCount = 0;
mdxFiles.forEach(filePath => {
  if (removePlaceholder(filePath)) {
    updatedCount++;
  }
});

console.log(`\n🎉 Updated ${updatedCount} files`);
console.log('✅ All placeholder export default functions removed!'); 