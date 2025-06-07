#!/usr/bin/env node

/**
 * Extract metadata from all MDX files and save to JSON
 * This runs during the build process to avoid runtime MDX parsing
 */

const path = require('path');
const fs = require('fs');

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const OUTPUT_FILE = path.join(process.cwd(), 'metadata-cache.json');

// Simple regex-based extraction that's more targeted
function extractMetadataFromCreateMetadata(content) {
  // Find the createMetadata call specifically
  const createMetadataMatch = content.match(/export\s+const\s+metadata\s*=\s*createMetadata\s*\(\s*\{([\s\S]*?)\}\s*\)/);
  
  if (!createMetadataMatch) {
    return null;
  }
  
  const metadataContent = createMetadataMatch[1];
  const metadata = {};
  
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

async function extractAllMetadata() {
  const allMetadata = {};
  
  // Find all content types
  const contentTypes = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log(`Found content types: ${contentTypes.join(', ')}`);
  
  for (const contentType of contentTypes) {
    const contentTypeDir = path.join(CONTENT_DIR, contentType);
    
    // Find all slugs for this content type
    const slugs = fs.readdirSync(contentTypeDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`Found ${slugs.length} items in ${contentType}`);
    
    for (const slug of slugs) {
      const mdxPath = path.join(contentTypeDir, slug, 'page.mdx');
      
      if (fs.existsSync(mdxPath)) {
        try {
          const content = fs.readFileSync(mdxPath, 'utf-8');
          const metadata = extractMetadataFromCreateMetadata(content);
          
          if (metadata) {
            const key = `${contentType}/${slug}`;
            allMetadata[key] = {
              ...metadata,
              slug: `/${contentType}/${slug}`,
              type: metadata.type || contentType
            };
            console.log(`✓ Extracted metadata for ${key}: "${metadata.title}"`);
          } else {
            console.log(`⚠ No createMetadata found in ${contentType}/${slug}`);
          }
        } catch (error) {
          console.error(`✗ Error processing ${contentType}/${slug}:`, error.message);
        }
      }
    }
  }
  
  // Write to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allMetadata, null, 2));
  console.log(`\n✓ Extracted metadata for ${Object.keys(allMetadata).length} items to ${OUTPUT_FILE}`);
  
  return allMetadata;
}

// Run if called directly
if (require.main === module) {
  extractAllMetadata().catch(console.error);
}

module.exports = { extractAllMetadata }; 