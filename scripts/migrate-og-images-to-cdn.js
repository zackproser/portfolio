#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OG_IMAGES_DIR = path.join(process.cwd(), 'public', 'og-images');
const CDN_BASE_URL = 'https://zackproser.b-cdn.net';

console.log('🔄 OG Image Migration to Bunny CDN');
console.log('=====================================');
console.log(`📁 Local OG images directory: ${OG_IMAGES_DIR}`);
console.log(`📡 CDN Base URL: ${CDN_BASE_URL}/images/og-images/`);
console.log('');

// Check if the directory exists
if (!fs.existsSync(OG_IMAGES_DIR)) {
  console.log('❌ OG images directory not found. Nothing to migrate.');
  process.exit(0);
}

// Get all PNG files in the directory
const files = fs.readdirSync(OG_IMAGES_DIR)
  .filter(file => file.endsWith('.png'))
  .sort();

if (files.length === 0) {
  console.log('❌ No PNG files found in og-images directory.');
  process.exit(0);
}

console.log(`📊 Found ${files.length} OG images to migrate:`);
console.log('');

// Calculate total size
let totalSize = 0;
files.forEach(file => {
  const filePath = path.join(OG_IMAGES_DIR, file);
  const stats = fs.statSync(filePath);
  totalSize += stats.size;
});

console.log(`📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('');

// List all files with their CDN URLs
files.forEach((file, index) => {
  const filePath = path.join(OG_IMAGES_DIR, file);
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  const cdnUrl = `${CDN_BASE_URL}/images/og-images/${file}`;
  
  console.log(`${index + 1}. ${file} (${sizeKB} KB)`);
  console.log(`   CDN URL: ${cdnUrl}`);
  console.log('');
});

console.log('📝 Migration Instructions:');
console.log('==========================');
console.log('');
console.log('1. Upload all PNG files to Bunny CDN:');
console.log(`   - Source: ${OG_IMAGES_DIR}`);
console.log(`   - Destination: ${CDN_BASE_URL}/images/og-images/`);
console.log('');
console.log('2. After uploading, update the OG route to use CDN:');
console.log('   - The route has been updated to check CDN first');
console.log('   - It will redirect to CDN URLs for existing images');
console.log('');
console.log('3. Test the migration:');
console.log('   - Run: npm run og:generate -- --slug <test-slug>');
console.log('   - Check that images are served from CDN');
console.log('');
console.log('4. Remove local og-images directory:');
console.log('   - Delete: public/og-images/');
console.log('   - This will significantly reduce repo size');
console.log('');
console.log('5. Update .gitignore (if needed):');
console.log('   - Add: public/og-images/');
console.log('   - This prevents accidental commits of generated images');
console.log('');

// Check for large files that might be problematic
const largeFiles = files.filter(file => {
  const filePath = path.join(OG_IMAGES_DIR, file);
  const stats = fs.statSync(filePath);
  return stats.size > 500 * 1024; // 500KB
});

if (largeFiles.length > 0) {
  console.log('⚠️  Large files detected (>500KB):');
  largeFiles.forEach(file => {
    const filePath = path.join(OG_IMAGES_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   - ${file} (${sizeKB} KB)`);
  });
  console.log('');
  console.log('💡 Consider optimizing these images before uploading to CDN.');
  console.log('');
}

console.log('✅ Migration analysis complete!');
console.log('');
console.log('🚀 Next steps:');
console.log('   1. Upload images to Bunny CDN');
console.log('   2. Test OG image serving');
console.log('   3. Remove local og-images directory');
console.log('   4. Commit the changes'); 