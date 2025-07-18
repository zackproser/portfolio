#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript and JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to update image imports in a file
function updateImageImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update import statements from @/images/ to CDN URLs
  const importRegex = /import\s+(\w+)\s+from\s+['"]@\/images\/([^'"]+)['"]/g;
  content = content.replace(importRegex, (match, varName, imagePath) => {
    updated = true;
    return `const ${varName} = 'https://zackproser.b-cdn.net/images/${imagePath}'`;
  });

  // Update import statements from /public/images/ to CDN URLs
  const publicImportRegex = /import\s+(\w+)\s+from\s+['"]\/public\/images\/([^'"]+)['"]/g;
  content = content.replace(publicImportRegex, (match, varName, imagePath) => {
    updated = true;
    return `const ${varName} = 'https://zackproser.b-cdn.net/images/${imagePath}'`;
  });

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// Find all TypeScript and JavaScript files
const files = findFiles('src');

console.log('Updating image imports to use Bunny CDN...');

files.forEach(file => {
  try {
    updateImageImports(file);
  } catch (error) {
    console.error(`Error updating ${file}:`, error.message);
  }
});

console.log('Done!'); 