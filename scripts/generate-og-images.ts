#!/usr/bin/env node
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import React from 'react';
import { dirname } from 'path';

// Get the current file's directory using __dirname approach instead of import.meta
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup paths
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og-images');
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

// Parse arguments - use a more robust approach
const args = process.argv.slice(2);
let singleSlug: string | null = null;

// Find the actual slug value, handling various ways arguments might be passed
for (let i = 0; i < args.length; i++) {
  // Check for the slug after any --slug flag, skipping any -- separators
  if (args[i] === '--slug') {
    // Try to find the first non-flag argument after --slug
    for (let j = i + 1; j < args.length; j++) {
      if (!args[j].startsWith('--')) {
        singleSlug = args[j];
        break;
      }
    }
    break;
  }
}

console.log('Args:', args);
console.log('Using slug:', singleSlug);

// Image settings
const WIDTH = 1200;
const HEIGHT = 630;
const BLUE_BG = '#15346e';
const FONT_COLOR = '#ffffff';

// Helper types
interface Content {
  title: string;
  description: string;
  slug: string;
  type: string;
  image?: string | null;
}

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

// Get metadata from MDX frontmatter
async function getContentMetadata(contentType: string, slug: string): Promise<Content | null> {
  try {
    const mdxPath = path.join(CONTENT_DIR, contentType, slug, 'page.mdx');
    
    try {
      // Read the file but don't try to import it
      const content = await fs.readFile(mdxPath, 'utf-8');
      
      // Simple frontmatter extraction (very basic)
      const titleMatch = content.match(/title:\s*['"](.+?)['"]/);
      const descriptionMatch = content.match(/description:\s*['"](.+?)['"]/);
      const typeMatch = content.match(/type:\s*['"](.+?)['"]/);
      
      // Try to extract image information
      const imageMatch = content.match(/image:\s*([^\n,]+)/);
      let image = null;
      
      if (imageMatch && imageMatch[1]) {
        // Clean up the image path
        const imagePath = imageMatch[1].trim();
        if (imagePath.includes('@/images/')) {
          // Extract just the filename part from something like @/images/example.png
          const imageParts = imagePath.split('/');
          image = imageParts[imageParts.length - 1];
        } else if (imagePath.includes("'") || imagePath.includes('"')) {
          // Extract from quoted string
          const quotedMatch = imagePath.match(/['"](.+?)['"]/);
          if (quotedMatch) {
            image = quotedMatch[1];
          }
        }
      }
      
      const title = titleMatch ? titleMatch[1] : slug;
      const description = descriptionMatch ? descriptionMatch[1] : '';
      const type = typeMatch ? typeMatch[1] : contentType === 'blog' ? 'blog' : 
                              contentType === 'videos' ? 'video' : 'content';
      
      return {
        title,
        description,
        slug: `/${contentType}/${slug}`,
        type,
        image
      };
    } catch (error) {
      console.error(`Error reading MDX file for ${contentType}/${slug}:`, error);
      
      // Fallback with basic info
      return {
        title: slug.replace(/-/g, ' '),
        description: `${contentType} content`,
        slug: `/${contentType}/${slug}`,
        type: contentType === 'blog' ? 'blog' : 
              contentType === 'videos' ? 'video' : 'content'
      };
    }
  } catch (error) {
    console.error(`Error getting metadata for ${contentType}/${slug}:`, error);
    return null;
  }
}

async function generateOGImage(content: Content): Promise<boolean> {
  // Extract the last part of the slug for filename
  const slugParts = content.slug.split('/');
  const filename = slugParts[slugParts.length - 1];
  const outputPath = path.join(OUTPUT_DIR, `${filename}.png`);

  // Skip if file already exists
  try {
    await fs.access(outputPath);
    console.log(`✓ [Cached] ${filename}.png`);
    return false;
  } catch {
    // File doesn't exist, continue with generation
  }

  // Generate new image
  const start = Date.now();
  try {
    const title = content.title || 'Untitled';
    const description = content.description || '';
    
    // Load image - either hero image or default background
    let imageData;
    let rawImageData;
    
    if (content.image) {
      // Try to load the post's hero image
      const heroImagePath = path.join(process.cwd(), 'src', 'images', content.image);
      console.log(`Attempting to load hero image: ${heroImagePath}`);
      try {
        rawImageData = await fs.readFile(heroImagePath);
        console.log(`✅ Successfully loaded hero image: ${content.image}`);
      } catch (error: any) {
        console.error(`❌ Failed to load hero image: ${heroImagePath}`, error.code);
        // Fall back to default
        const defaultPath = path.join(process.cwd(), 'public', 'modern-coding-og-background.png');
        rawImageData = await fs.readFile(defaultPath);
        console.log('Using default fallback image');
      }
    } else {
      // Use default background
      const defaultPath = path.join(process.cwd(), 'public', 'modern-coding-og-background.png');
      rawImageData = await fs.readFile(defaultPath);
      console.log('No hero image specified, using default');
    }

    // Convert any image format to PNG
    imageData = await sharp(rawImageData)
      .png()
      .toBuffer();
    
    // Create base64 encoding
    const base64Image = imageData.toString('base64');
    
    // Image dimensions
    const imageWidth = 600;
    const imageHeight = 600;

    // Generate the image using HTML string
    const { ImageResponse } = await import('@vercel/og');
    
    const titleTruncated = title.length > 80 ? `${title.substring(0, 80)}...` : title;
    const descriptionTruncated = description.length > 160 ? 
      `${description.substring(0, 160)}...` : description;
      
    const html = `<div
      style="display:flex;flex-direction:column;height:100%;width:100%;position:relative;overflow:hidden"
    >
      <!-- Main background with blueprint effect -->
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-color:#1f4898;background-image:linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px);background-size:100px 100px,100px 100px;z-index:1"></div>
      
      <!-- Intermediary border with lighter blue -->
      <div style="position:absolute;top:15px;left:15px;right:15px;bottom:15px;border-radius:8px;border:2px solid rgba(255,255,255,0.6);background:#2753a9;box-shadow:0 0 10px rgba(255,255,255,0.3);z-index:2"></div>
      
      <!-- Inner content area -->
      <div style="position:absolute;top:19px;left:19px;right:19px;bottom:19px;border-radius:5px;background-color:#15346e;background-image:linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px),radial-gradient(circle at 40px 40px,rgba(120,180,255,0.15) 6px,transparent 8px),radial-gradient(circle at 120px 120px,rgba(120,180,255,0.15) 6px,transparent 8px);background-size:100px 100px,100px 100px,20px 20px,20px 20px,200px 200px,200px 200px;padding:24px;z-index:3;box-shadow:inset 0 0 0 2px rgba(255,255,255,0.4);display:flex">
        <!-- Main layout - side by side containers -->
        <div style="display:flex;height:100%;width:100%;position:relative;z-index:5">
          <!-- Left text column - fixed width to prevent overlap -->
          <div style="display:flex;flex-direction:column;width:50%;height:100%;justify-content:space-between;padding-top:8px;padding-bottom:8px;padding-left:8px;padding-right:12px;z-index:10">
            <!-- Top text content -->
            <div style="display:flex;flex-direction:column;justify-content:space-between;height:100%">
              <!-- Site name -->
              <div style="font-size:36px;font-weight:bold;color:white;line-height:1.2;margin-bottom:16px;max-width:100%;word-wrap:break-word">
                Modern Coding
              </div>
              
              <!-- Center content - title and description -->
              <div style="display:flex;flex-direction:column">
                <div style="font-size:46px;font-weight:bold;color:white;line-height:1.2;margin-bottom:24px;max-width:100%;max-height:220px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;word-wrap:break-word">
                  ${titleTruncated}
                </div>
                
                <div style="font-size:28px;color:#dbeafe;margin-bottom:16px;max-width:100%;max-height:112px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;word-wrap:break-word">
                  ${descriptionTruncated}
                </div>
              </div>
              
              <!-- Bottom footer area -->
              <div style="display:flex;flex-direction:row;align-items:center;justify-content:flex-start;max-width:100%">
                <div style="font-size:24px;font-weight:bold;color:white;opacity:0.9;margin-right:16px">
                  zackproser.com
                </div>
                <div style="font-size:18px;color:white;opacity:1;text-align:center">
                  🔥 AI Engineering Mastery 
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right image column - fixed width container -->
          <div style="display:flex;justify-content:center;align-items:center;width:50%;height:100%;z-index:5">
            <div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;overflow:hidden;filter:drop-shadow(0 0 8px rgba(255,255,255,0.5));padding:5px">
              <img 
                src="data:image/png;base64,${base64Image}"
                alt="Page hero image"
                width="${imageWidth}"
                height="${imageHeight}"
                style="width:110%;height:110%;object-fit:contain;object-position:center;filter:brightness(1.2) contrast(1.1);mix-blend-mode:screen"
              />
            </div>
          </div>
        </div>
      </div>
    </div>`;

    // Generate the image using HTML string
    // @ts-ignore - The ImageResponse can actually accept HTML strings but TypeScript doesn't know that
    const imageResponse = new ImageResponse(html, {
      width: WIDTH,
      height: HEIGHT,
    });

    // Convert the response to a buffer and save it
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(outputPath, buffer);
    
    console.log(`⚡ [Generated] ${filename}.png (${Date.now() - start}ms)`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating OG image for ${filename}:`, error);
    return false;
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

async function main() {
  // Create output directory if it doesn't exist
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Single slug mode
  if (singleSlug) {
    console.log(`Generating OG image for slug: ${singleSlug}`);
    
    // Try to find content in different content types
    const contentTypes = ['blog', 'videos', 'learn/courses'];
    let content = null;
    
    for (const contentType of contentTypes) {
      content = await getContentMetadata(contentType, singleSlug);
      if (content) break;
    }
    
    if (!content) {
      // Fallback to a basic one if not found
      content = {
        title: singleSlug.replace(/-/g, ' '),
        description: 'Content description',
        slug: `/blog/${singleSlug}`,
        type: 'blog'
      };
      console.log(`⚠️ Content not found for slug "${singleSlug}", using fallback data`);
    }
    
    await generateOGImage(content);
    console.log('✅ Done!');
    return;
  }

  // Full generation mode
  console.log('Generating OG images for all content...');
  
  // Get content from different types
  const contentTypes = ['blog', 'videos', 'learn/courses'];
  const allContent: Content[] = [];
  
  for (const contentType of contentTypes) {
    const slugs = await getContentSlugs(contentType);
    
    for (const slug of slugs) {
      const content = await getContentMetadata(contentType, slug);
      if (content) {
        allContent.push(content);
      }
    }
  }
  
  console.log(`Found ${allContent.length} content items to process`);
  
  // Generate images
  let generatedCount = 0;
  let errorCount = 0;
  
  for (const content of allContent) {
    try {
      if (await generateOGImage(content)) {
        generatedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${content.slug}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Done! Generated ${generatedCount} new images (${allContent.length - generatedCount} cached, ${errorCount} errors)`);
}

main().catch(console.error);