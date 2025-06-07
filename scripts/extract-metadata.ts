#!/usr/bin/env node

/**
 * Extract metadata from all MDX files and save to JSON
 * This runs during the build process to avoid runtime MDX parsing
 * Hybrid approach: uses content-handlers for directory discovery, regex for metadata parsing
 */

import path from 'path';
import fs from 'fs';
import { getContentSlugs } from '../src/lib/content-handlers.js';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const OUTPUT_FILE = path.join(process.cwd(), 'metadata-cache.json');

// Content types to process
const CONTENT_TYPES = ['blog', 'videos', 'learn/courses', 'comparisons'];

// Simple regex-based extraction that's more targeted (from original approach)
function extractMetadataFromCreateMetadata(content: string) {
  // Find the createMetadata call specifically
  const createMetadataMatch = content.match(/export\s+const\s+metadata\s*=\s*createMetadata\s*\(\s*\{([\s\S]*?)\}\s*\)/);
  
  if (!createMetadataMatch) {
    return null;
  }
  
  const metadataContent = createMetadataMatch[1];
  const metadata: Record<string, any> = {};
  
  // Extract title
  const titleMatch = metadataContent.match(/title:\s*['"`]([^'"`]*?)['"`]/);
  if (titleMatch) {
    metadata.title = titleMatch[1];
  }
  
  // Extract description - handle multiline and quotes carefully
  let descriptionMatch = metadataContent.match(/description:\s*['"`]([\s\S]*?)['"`]/);
  if (descriptionMatch) {
    metadata.description = descriptionMatch[1];
  }
  
  // Extract author
  const authorMatch = metadataContent.match(/author:\s*['"`]([^'"`]*?)['"`]/);
  if (authorMatch) {
    metadata.author = authorMatch[1];
  }
  
  // Extract date
  const dateMatch = metadataContent.match(/date:\s*['"`]([^'"`]*?)['"`]/);
  if (dateMatch) {
    metadata.date = dateMatch[1];
  }
  
  // Extract type
  const typeMatch = metadataContent.match(/type:\s*['"`]([^'"`]*?)['"`]/);
  if (typeMatch) {
    metadata.type = typeMatch[1];
  }
  
  // Extract image (this is an identifier, not a string)
  const imageMatch = metadataContent.match(/image:\s*([a-zA-Z_$][a-zA-Z0-9_$]*),?/);
  if (imageMatch) {
    metadata.imageRef = imageMatch[1];
    
    // Try to resolve the image import
    const importMatch = content.match(new RegExp(`import\\s+${imageMatch[1]}\\s+from\\s+['"\`]@/images/([^'"\`]+)['"\`]`));
    if (importMatch) {
      const imagePath = importMatch[1];
      const imagePathWithoutExt = imagePath.split('.')[0];
      metadata.image = `/_next/static/media/${imagePathWithoutExt}.webp`;
    }
  }
  
  return metadata;
}

/**
 * Extract metadata using hybrid approach: content-handlers for discovery, regex for parsing
 */
async function extractAllMetadata() {
  const allMetadata: Record<string, any> = {};
  let totalProcessed = 0;
  let totalFound = 0;

  console.log('Starting metadata extraction using hybrid approach...');
  console.log('Using content-handlers for directory discovery, regex for metadata parsing');

  for (const contentType of CONTENT_TYPES) {
    console.log(`\nProcessing content type: ${contentType}`);
    
    try {
      // Use content-handlers to get all directory slugs (more reliable than manual fs operations)
      const directorySlugs = getContentSlugs(contentType);
      console.log(`Found ${directorySlugs.length} items in ${contentType}`);

      for (const directorySlug of directorySlugs) {
        const mdxPath = path.join(CONTENT_DIR, contentType, directorySlug, 'page.mdx');
        
        if (fs.existsSync(mdxPath)) {
          try {
            const content = fs.readFileSync(mdxPath, 'utf-8');
            const metadata = extractMetadataFromCreateMetadata(content);
            
            if (metadata) {
              const key = `${contentType}/${directorySlug}`;
              allMetadata[key] = {
                ...metadata,
                slug: `/${contentType}/${directorySlug}`,
                type: metadata.type || contentType
              };
              console.log(`✓ Extracted metadata for ${key}: "${metadata.title}"`);
              totalFound++;
            } else {
              console.log(`⚠ No createMetadata found in ${contentType}/${directorySlug}`);
            }
            totalProcessed++;
          } catch (error: any) {
            console.error(`✗ Error processing ${contentType}/${directorySlug}:`, error.message);
            totalProcessed++;
          }
        }
      }
    } catch (error: any) {
      console.error(`✗ Error processing content type ${contentType}:`, error.message);
    }
  }

  // Write to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allMetadata, null, 2));
  console.log(`\n✓ Successfully extracted metadata for ${totalFound}/${totalProcessed} items to ${OUTPUT_FILE}`);
  console.log(`Cache contains ${Object.keys(allMetadata).length} entries`);
  
  return allMetadata;
}

// Run if called directly
if (require.main === module) {
  extractAllMetadata().catch(console.error);
}

export { extractAllMetadata }; 