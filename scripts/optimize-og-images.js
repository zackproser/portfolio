#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Constants
const OG_IMAGES_DIR = path.join(process.cwd(), 'public', 'og-images');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og-images-optimized');

// Parse arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const quality = args.includes('--quality') 
  ? parseInt(args[args.indexOf('--quality') + 1], 10) 
  : 80; // Default quality is 80

console.log(`Optimizing OG images with quality: ${quality}${dryRun ? ' (DRY RUN)' : ''}`);

// Create output directory if it doesn't exist and we're not in dry run mode
if (!dryRun && !fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(filePath, outputPath) {
  try {
    const stats = fs.statSync(filePath);
    const originalSizeKB = Math.round(stats.size / 1024);
    
    // Process with sharp
    await sharp(filePath)
      .png({ quality, compressionLevel: 9 }) // Max compression
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSizeKB = Math.round(newStats.size / 1024);
    const savingsPercent = Math.round((1 - (newSizeKB / originalSizeKB)) * 100);
    
    console.log(`✅ ${path.basename(filePath)}: ${originalSizeKB}KB → ${newSizeKB}KB (${savingsPercent}% reduction)`);
    
    return {
      filename: path.basename(filePath),
      originalSize: originalSizeKB,
      newSize: newSizeKB,
      savingsPercent
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(OG_IMAGES_DIR)) {
    console.error(`❌ Error: OG images directory not found: ${OG_IMAGES_DIR}`);
    process.exit(1);
  }
  
  // Get all PNG files in the directory
  const files = fs.readdirSync(OG_IMAGES_DIR)
    .filter(file => file.toLowerCase().endsWith('.png'))
    .map(file => path.join(OG_IMAGES_DIR, file));
  
  console.log(`Found ${files.length} PNG files to optimize`);
  
  if (files.length === 0) {
    console.log('No files to process.');
    return;
  }
  
  const results = [];
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  
  // Process images in batches to avoid memory issues
  const BATCH_SIZE = 5;
  const batches = [];
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    batches.push(files.slice(i, i + BATCH_SIZE));
  }
  
  console.log(`Processing in ${batches.length} batches of up to ${BATCH_SIZE} images`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\nProcessing batch ${i + 1}/${batches.length} (${batch.length} images)`);
    
    const batchResults = await Promise.all(
      batch.map(filePath => {
        const outputPath = dryRun 
          ? '/dev/null' // On Unix systems, write to /dev/null in dry run mode
          : path.join(OUTPUT_DIR, path.basename(filePath));
        
        return optimizeImage(filePath, outputPath);
      })
    );
    
    // Add valid results to our tracking
    for (const result of batchResults) {
      if (result) {
        results.push(result);
        totalOriginalSize += result.originalSize;
        totalNewSize += result.newSize;
      }
    }
    
    // Small delay between batches
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  const totalSavingsPercent = Math.round((1 - (totalNewSize / totalOriginalSize)) * 100);
  
  console.log('\n===== OPTIMIZATION SUMMARY =====');
  console.log(`Processed ${results.length}/${files.length} images successfully`);
  console.log(`Total size reduction: ${totalOriginalSize}KB → ${totalNewSize}KB (${totalSavingsPercent}% reduction)`);
  
  if (!dryRun) {
    console.log('\nTo replace the original files with optimized versions:');
    console.log('1. Back up your original images (recommended)');
    console.log('2. Run: node scripts/optimize-og-images.js --replace');
  }
}

// If --replace flag is specified, replace original files with optimized ones
if (args.includes('--replace') && !dryRun) {
  console.log('⚠️ REPLACING ORIGINAL FILES WITH OPTIMIZED VERSIONS');
  
  // Make sure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error(`❌ Error: Optimized images directory not found: ${OUTPUT_DIR}`);
    console.log('Run the script without --replace first to generate optimized images');
    process.exit(1);
  }
  
  const optimizedFiles = fs.readdirSync(OUTPUT_DIR);
  
  for (const file of optimizedFiles) {
    const sourcePath = path.join(OUTPUT_DIR, file);
    const destPath = path.join(OG_IMAGES_DIR, file);
    
    try {
      // Copy optimized file over the original
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Replaced: ${file}`);
    } catch (error) {
      console.error(`❌ Error replacing ${file}:`, error.message);
    }
  }
  
  console.log('\n✅ Replacement complete');
  process.exit(0);
}

main().catch(error => {
  console.error('Error in main function:', error);
  process.exit(1);
}); 