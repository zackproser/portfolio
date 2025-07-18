#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

const CDN_BASE_URL = 'https://zackproser.b-cdn.net';
const LOCAL_IMAGE_PATH = '/images/';

// Files to process
const filePatterns = [
  'src/content/**/*.mdx',
  'src/content/**/*.json',
  'src/app/**/*.mdx',
  'src/app/**/*.json',
  'src/components/**/*.tsx',
  'src/components/**/*.jsx'
];

function updateImagePaths(content, filePath) {
  let updated = false;
  let newContent = content;

  // Update Next.js Image components
  newContent = newContent.replace(
    /src=["']\/images\/([^"']+)["']/g,
    (match, imagePath) => {
      updated = true;
      console.log(`  📸 Updated Image src: /images/${imagePath} → ${CDN_BASE_URL}/images/${imagePath}`);
      return `src="${CDN_BASE_URL}/images/${imagePath}"`;
    }
  );

  // Update markdown image syntax
  newContent = newContent.replace(
    /!\[([^\]]*)\]\(\/images\/([^)]+)\)/g,
    (match, altText, imagePath) => {
      updated = true;
      console.log(`  📸 Updated markdown image: /images/${imagePath} → ${CDN_BASE_URL}/images/${imagePath}`);
      return `![${altText}](${CDN_BASE_URL}/images/${imagePath})`;
    }
  );

  // Update HTML img tags
  newContent = newContent.replace(
    /<img[^>]*src=["']\/images\/([^"']+)["'][^>]*>/g,
    (match, imagePath) => {
      updated = true;
      console.log(`  📸 Updated HTML img: /images/${imagePath} → ${CDN_BASE_URL}/images/${imagePath}`);
      return match.replace(`/images/${imagePath}`, `${CDN_BASE_URL}/images/${imagePath}`);
    }
  );

  // Update metadata.json image references
  if (filePath.endsWith('metadata.json')) {
    newContent = newContent.replace(
      /"image":\s*"\/images\/([^"]+)"/g,
      (match, imagePath) => {
        updated = true;
        console.log(`  📸 Updated metadata image: /images/${imagePath} → ${CDN_BASE_URL}/images/${imagePath}`);
        return `"image": "${CDN_BASE_URL}/images/${imagePath}"`;
      }
    );
  }

  return { content: newContent, updated };
}

async function main() {
  console.log('🔄 Starting image path migration to Bunny CDN...');
  console.log(`📡 CDN Base URL: ${CDN_BASE_URL}`);
  console.log('');

  let totalFiles = 0;
  let updatedFiles = 0;

  for (const pattern of filePatterns) {
    const files = await glob(pattern, { ignore: ['node_modules/**', '.next/**'] });
    
    for (const filePath of files) {
      totalFiles++;
      console.log(`📁 Processing: ${filePath}`);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { content: newContent, updated } = updateImagePaths(content, filePath);
        
        if (updated) {
          fs.writeFileSync(filePath, newContent);
          updatedFiles++;
          console.log(`  ✅ Updated: ${filePath}`);
        } else {
          console.log(`  ⏭️  No changes needed: ${filePath}`);
        }
      } catch (error) {
        console.error(`  ❌ Error processing ${filePath}:`, error.message);
      }
      
      console.log('');
    }
  }

  console.log('🎉 Migration complete!');
  console.log(`📊 Summary:`);
  console.log(`   • Total files processed: ${totalFiles}`);
  console.log(`   • Files updated: ${updatedFiles}`);
  console.log(`   • Files unchanged: ${totalFiles - updatedFiles}`);
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Run "npm run build" to test locally');
  console.log('   2. Run "npm run dev" to test in development');
  console.log('   3. Deploy to Vercel for production testing');
}

main().catch(console.error); 