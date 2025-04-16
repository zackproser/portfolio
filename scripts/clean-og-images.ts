#!/usr/bin/env node
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og-images');
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

// Access environment variables
const COURSES_DISABLED = process.env.COURSES_DISABLED === 'true';

// Get slugs from filesystem
async function getContentSlugs(contentType: string): Promise<string[]> {
  const contentDir = path.join(CONTENT_DIR, contentType);
  
  try {
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    const slugs = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    console.log(`Found ${slugs.length} slugs for ${contentType}`);
    return slugs;
  } catch (error) {
    console.log(`Content directory not found: ${contentDir}`);
    return [];
  }
}

async function cleanOrphanedImages() {
  console.log('Starting cleanup of orphaned OG images...');

  // Get all valid content slugs from different content types
  const contentTypes = ['blog', 'videos'];
  if (!COURSES_DISABLED) {
    contentTypes.push('learn/courses');
  }

  // Get all valid slugs
  const validSlugs = (await Promise.all(
    contentTypes.map(contentType => getContentSlugs(contentType))
  )).flat();

  console.log(`Found ${validSlugs.length} valid content slugs`);

  // Check if output directory exists
  try {
    await fs.access(OUTPUT_DIR);
  } catch (error) {
    console.log(`Output directory does not exist: ${OUTPUT_DIR}`);
    return;
  }

  // Get all image files in the OG images directory
  const files = await fs.readdir(OUTPUT_DIR);
  console.log(`Found ${files.length} OG image files in ${OUTPUT_DIR}`);
  
  let deleted = 0;

  // Check each file against valid slugs
  await Promise.all(files.map(async (file) => {
    if (!file.endsWith('.png')) return; // Skip non-PNG files

    const slug = file.replace(/\.png$/, '');
    
    // Check if this file's slug exists in our valid slugs
    if (!validSlugs.includes(slug)) {
      const filePath = path.join(OUTPUT_DIR, file);
      try {
        await fs.unlink(filePath);
        deleted++;
        console.log(`🗑️ Deleted orphaned: ${file}`);
      } catch (error) {
        console.error(`Error deleting file ${file}:`, error);
      }
    }
  }));

  console.log(`\n🧹 Cleaned ${deleted} orphaned OG images`);
}

cleanOrphanedImages().catch(console.error); 