#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const http = require('http');
const https = require('https');

// Constants
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og-images');
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const IMAGES_DIR = path.join(process.cwd(), 'src', 'images');
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Parse arguments
const args = process.argv.slice(2);
let singleSlug = null;

// Find the actual slug value
for (let i = 0; i < args.length; i++) {
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

// Add verbose mode flag - only log detailed information when this is enabled
const isVerbose = args.includes('--verbose');
const log = (message, ...args) => {
  if (isVerbose) {
    console.log(message, ...args);
  }
};

// Function to make HTTP/HTTPS requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    // Do NOT encode the URL as it's already properly formatted
    const protocol = url.startsWith('https:') ? https : http;
    
    log(`Making request to: ${url}`);
    
    const req = protocol.get(url, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Check if we received an error response in JSON format
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            try {
              const jsonData = JSON.parse(Buffer.concat(chunks).toString());
              if (jsonData.error) {
                reject(new Error(`API error: ${jsonData.error}`));
                return;
              }
            } catch (e) {
              // Not a valid JSON or not an error response, continue
            }
          }
          
          resolve({
            ok: true,
            status: res.statusCode,
            statusText: res.statusMessage,
            buffer: () => Promise.resolve(Buffer.concat(chunks))
          });
        } else if (res.statusCode === 302 || res.statusCode === 301) {
          // Handle redirects by following the location header
          const location = res.headers.location;
          if (location) {
            log(`Following redirect to: ${location}`);
            resolve(makeRequest(location.startsWith('http') ? location : new URL(location, url).toString()));
          } else {
            reject(new Error(`Redirect without location header: ${res.statusCode}`));
          }
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.end();
  });
}

/**
 * Get content slugs from filesystem
 * @param {string} contentType 
 * @returns {Promise<string[]>}
 */
async function getContentSlugs(contentType) {
  const contentDir = path.join(CONTENT_DIR, contentType);
  
  try {
    const entries = await fsPromises.readdir(contentDir, { withFileTypes: true });
    const slugs = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    log(`Found ${slugs.length} slugs for ${contentType}`);
    return slugs;
  } catch (error) {
    log(`Content directory not found: ${contentDir}`);
    return [];
  }
}

/**
 * Get metadata from MDX frontmatter
 * @param {string} contentType 
 * @param {string} slug 
 * @returns {Promise<{title: string, description: string, slug: string, type: string, image: string|null}|null>}
 */
async function getContentMetadata(contentType, slug) {
  try {
    const mdxPath = path.join(CONTENT_DIR, contentType, slug, 'page.mdx');
    
    try {
      // Read the file but don't try to import it
      const content = await fsPromises.readFile(mdxPath, 'utf-8');
      
      // First look for image imports at the top of the file
      const importMap = {};
      const importRegex = /import\s+(\w+)\s+from\s+['"]@\/images\/([^'"]+)['"]/g;
      let importMatch;
      
      while ((importMatch = importRegex.exec(content)) !== null) {
        const variableName = importMatch[1];
        const imagePath = importMatch[2];
        importMap[variableName] = imagePath;
        log(`Found import: ${variableName} -> ${imagePath}`);
      }
      
      // Simple frontmatter extraction
      const titleMatch = content.match(/title:\s*['"](.+?)['"]/);
      
      // Use a more robust regex for description that can handle apostrophes
      // First try to match backtick style, then double quotes, then single quotes
      let descriptionMatch = content.match(/description:\s*`([\s\S]*?)`/);
      if (!descriptionMatch) {
        descriptionMatch = content.match(/description:\s*"((?:[^"\\]|\\.)*)"/);
      }
      if (!descriptionMatch) {
        descriptionMatch = content.match(/description:\s*'((?:[^'\\]|\\.)*?)'/);
      }
      
      const typeMatch = content.match(/type:\s*['"](.+?)['"]/);
      
      // Try to extract image information from frontmatter
      // Look for patterns like: image: bloggingPeacefully,
      let imageMatch = content.match(/image:\s*(.+?)(?:,|\n|\})/);
      let image = null;
      
      if (imageMatch && imageMatch[1]) {
        // Clean up the image path
        let imagePath = imageMatch[1].trim();
        log(`Found raw image path: "${imagePath}"`);
        
        // Case 1: Direct import reference like 'image: bloggingPeacefully,'
        if (importMap[imagePath]) {
          // This is a variable that was imported, use its path
          const importedImagePath = importMap[imagePath];
          // Format as Next.js image path
          const imagePathWithoutExt = importedImagePath.split('.')[0];
          image = `/_next/static/media/${imagePathWithoutExt}.webp`;
          log(`Resolved imported image variable: ${imagePath} -> ${image}`);
        }
        // Case 2: Direct path like '@/images/example.png'
        else if (imagePath.includes('@/images/')) {
          // Extract just the filename part from something like @/images/example.png
          // or @/images/subdirectory/example.png
          imagePath = imagePath.replace(/['"]/g, ''); // Remove quotes if any
          const srcPath = imagePath.split('@/images/')[1];
          
          // If it includes a directory path, keep it
          const imagePathWithoutExt = srcPath.split('.')[0];
          image = `/_next/static/media/${imagePathWithoutExt}.webp`;
          log(`Converted to Next.js image path: "${image}"`);
        } 
        // Case 3: Quoted string like 'image: "example.png",'
        else if (imagePath.includes("'") || imagePath.includes('"')) {
          // Extract from quoted string
          const quotedMatch = imagePath.match(/['"](.+?)['"]/);
          if (quotedMatch) {
            const imageFilename = quotedMatch[1];
            // Format as Next.js image path
            const filenameWithoutExt = imageFilename.split('.')[0];
            image = `/_next/static/media/${filenameWithoutExt}.webp`;
          }
        }
      }
      
      const title = titleMatch ? titleMatch[1] : slug;
      
      // Extract description from match and handle special characters
      let description = '';
      if (descriptionMatch && descriptionMatch[1]) {
        description = descriptionMatch[1];
        log(`[DEBUG] Found description: "${description}"`);
      }
      
      // Log the raw description to verify it's being extracted correctly
      let hasSpecialChars = false;
      if (description.includes("'") || description.includes('"') || description.includes('&') || 
          description.includes('<') || description.includes('>')) {
        hasSpecialChars = true;
        log(`[WARN] Description contains special characters that need escaping for ${contentType}/${slug}`);
      }
      
      if (isVerbose) {
        log(`[DEBUG] Raw description for ${contentType}/${slug}: "${description}"`);
        if (hasSpecialChars) {
          log(`[DEBUG] JSON stringified description: ${JSON.stringify(description)}`);
        }
      }
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
      if (isVerbose) {
        console.error(`Error reading MDX file for ${contentType}/${slug}:`, error);
      }
      
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
    if (isVerbose) {
      console.error(`Error getting metadata for ${contentType}/${slug}:`, error);
    }
    return null;
  }
}

/**
 * Generate an OG image for the given content
 * @param {Object} content 
 * @returns {Promise<boolean>}
 */
async function generateOGImage(content) {
  // Extract the last part of the slug for filename
  const slugParts = content.slug.split('/');
  const filename = slugParts[slugParts.length - 1];
  const outputPath = path.join(OUTPUT_DIR, `${filename}.png`);

  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`✓ [Cached] ${filename}.png`);
    return false;
  }

  // Generate new image
  const start = Date.now();
  try {
    // Construct API URL with parameters
    const urlParams = new URLSearchParams();
    
    // Ensure we have valid title and description
    const safeTitle = content.title || 'Untitled';
    urlParams.append('title', safeTitle);
    
    // Ensure we have a description and properly handle special characters
    // We want to decode HTML entities first, then encode for URL parameters
    let safeDescription = '';
    if (content.description) {
      // First decode any HTML entities
      safeDescription = content.description
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      // Log the description processing
      if (isVerbose) {
        log(`[DEBUG] Original description: "${content.description}"`);
        log(`[DEBUG] Decoded description: "${safeDescription}"`);
        
        if (safeDescription.includes("'") || safeDescription.includes('"') || 
            safeDescription.includes('&') || safeDescription.includes('<') || 
            safeDescription.includes('>')) {
          log(`[WARN] Description contains special characters that might need escaping`);
          log(`[DEBUG] Description JSON: ${JSON.stringify(safeDescription)}`);
        }
      }
    }
    
    // The URLSearchParams will handle the proper encoding for us
    urlParams.append('description', safeDescription);
    
    if (content.image) {
      urlParams.append('imageSrc', content.image);
    } else {
      // Try to find a default image in the images directory based on the content type
      let defaultImage = null;
      if (content.type === 'blog') {
        defaultImage = '/_next/static/media/modern-coding-og-background.webp';
      } else if (content.type === 'video') {
        defaultImage = '/_next/static/media/ai-engineering-og-background.webp';
      }
      
      if (defaultImage) {
        log(`Using default image for ${content.slug}: ${defaultImage}`);
        urlParams.append('imageSrc', defaultImage);
      }
    }
    
    const apiEndpoint = `${API_URL}/api/og/generate?${urlParams.toString()}`;
    log(`Fetching from API: ${apiEndpoint}`);
    
    // Add a debug option to see what's happening
    const debugEnabled = process.env.DEBUG_OG === 'true' || args.includes('--debug');
    if (debugEnabled && isVerbose) {
      // First check if the API is running and supports the debug mode
      const debugUrl = new URL(apiEndpoint);
      debugUrl.searchParams.append('debug', 'true');
      log(`Debug URL: ${debugUrl.toString()}`);
      
      try {
        const debugResponse = await makeRequest(debugUrl.toString());
        if (debugResponse.ok) {
          const debugBuffer = await debugResponse.buffer();
          const debugData = JSON.parse(debugBuffer.toString());
          log('Debug data:', JSON.stringify(debugData, null, 2));
          
          // Check if our image path is properly understood by the API
          if (debugData.imageSrcProvided && debugData.imageFiles && debugData.imageFiles.length > 0) {
            log('API successfully recognized our image path.');
          } else {
            log('⚠️ Warning: API could not find the image. Will try to generate anyway.');
          }
        }
      } catch (error) {
        log('Debug request failed, continuing with normal request:', error.message);
      }
    }
    
    // Call the API
    const response = await makeRequest(apiEndpoint);
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}: ${response.statusText}`);
    }
    
    // Get the image as buffer
    const imageBuffer = await response.buffer();
    
    // Save to file
    await fsPromises.writeFile(outputPath, imageBuffer);
    
    console.log(`⚡ [Generated] ${filename}.png (${Date.now() - start}ms)`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating OG image for ${filename}:`, error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Test the OG image API directly with a debug call
  if (args.includes('--test-api')) {
    console.log('Testing OG image API endpoint...');
    try {
      const testParams = new URLSearchParams();
      testParams.append('title', 'Test OG Image');
      testParams.append('description', 'This is a test of the OG image generator API.');
      testParams.append('debug', 'true');
      testParams.append('imageSrc', '/_next/static/media/modern-coding-og-background.webp');
      
      const testUrl = `${API_URL}/api/og/generate?${testParams.toString()}`;
      log(`Making test request to: ${testUrl}`);
      
      const response = await makeRequest(testUrl);
      if (isVerbose) {
        const data = JSON.parse(await response.buffer().then(b => b.toString()));
        console.log('API Response:', JSON.stringify(data, null, 2));
      }
      
      console.log('API test complete');
      return;
    } catch (error) {
      console.error('API test failed:', error);
      process.exit(1);
    }
  }

  // Single slug mode
  if (singleSlug) {
    log(`Generating OG image for slug: ${singleSlug}`);
    
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
      console.log(`Content not found for slug "${singleSlug}", using fallback data`);
    }
    
    await generateOGImage(content);
    console.log('Done!');
    return;
  }

  // Full generation mode
  console.log('Generating OG images...');
  
  // Get content from different types
  const contentTypes = ['blog', 'videos', 'learn/courses'];
  const allContent = [];
  
  for (const contentType of contentTypes) {
    const slugs = await getContentSlugs(contentType);
    
    for (const slug of slugs) {
      const content = await getContentMetadata(contentType, slug);
      if (content) {
        allContent.push(content);
      }
    }
  }
  
  log(`Found ${allContent.length} content items to process`);
  
  // Process in batches to avoid overwhelming the system
  const BATCH_SIZE = 5;
  const totalBatches = Math.ceil(allContent.length / BATCH_SIZE);
  let generated = 0;
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const batchStart = batchIndex * BATCH_SIZE;
    const batchEnd = Math.min(batchStart + BATCH_SIZE, allContent.length);
    const batch = allContent.slice(batchStart, batchEnd);
    
    log(`Processing batch ${batchIndex + 1}/${totalBatches} (${batch.length} items)`);
    
    // Process batch concurrently
    const results = await Promise.all(
      batch.map(content => generateOGImage(content))
    );
    
    // Count generated images
    const batchGenerated = results.filter(Boolean).length;
    generated += batchGenerated;
  }
  
  console.log(`Done! Generated ${generated} new images (${allContent.length - generated} cached)`);
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 