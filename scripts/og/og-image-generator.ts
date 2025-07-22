import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as http from 'http';
import * as https from 'https';
import * as dotenv from 'dotenv';
import { getContentMetadataByDirectorySlug } from '../../src/lib/content-metadata-helpers';

dotenv.config();

// Bunny CDN configuration
const CDN_BASE_URL = 'https://zackproser.b-cdn.net';
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const args = process.argv.slice(2);
const overwrite = args.includes('--overwrite');
const verbose = args.includes('--verbose');

// Helper to parse --slug argument
function getArgValue(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return undefined;
}

const slugArg = getArgValue('--slug');

// Example content types and slugs for testing
const testSlugs = [
  { type: 'blog', slug: 'open-sourced-article-optimizer' },
  { type: 'videos', slug: 'video-reviewing-github-prs-in-terminal' },
  { type: 'videos', slug: 'what-is-a-vector-database' },
];

async function getContentMetadata(contentType: string, slug: string) {
  try {
    const metadata = await getContentMetadataByDirectorySlug(contentType, slug);
    if (!metadata) {
      if (verbose) console.log(`No metadata found for ${contentType}/${slug}`);
      return {
        title: slug.replace(/-/g, ' '),
        description: `${contentType} content`,
        slug: `/${contentType}/${slug}`,
        type: contentType === 'blog' ? 'blog' : contentType === 'videos' ? 'video' : 'content',
        image: null,
      };
    }
    return {
      title: metadata.title,
      description: metadata.description,
      slug: `/${contentType}/${slug}`,
      type: contentType === 'blog' ? 'blog' : contentType === 'videos' ? 'video' : 'content',
      image: metadata.image || null,
    };
  } catch (err) {
    if (verbose) console.error(`Error loading metadata for ${contentType}/${slug}:`, err);
    return {
      title: slug.replace(/-/g, ' '),
      description: `${contentType} content`,
      slug: `/${contentType}/${slug}`,
      type: contentType === 'blog' ? 'blog' : contentType === 'videos' ? 'video' : 'content',
      image: null,
    };
  }
}

// Function to make HTTP/HTTPS requests
function makeRequest(url: string): Promise<{ ok: boolean; status: number; statusText: string; buffer: () => Promise<Buffer> }> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    if (verbose) console.log(`Making request to: ${url}`);
    
    const req = protocol.get(url, (res) => {
      const chunks: Buffer[] = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            ok: true,
            status: res.statusCode!,
            statusText: res.statusMessage!,
            buffer: () => Promise.resolve(Buffer.concat(chunks))
          });
        } else if (res.statusCode === 302 || res.statusCode === 301) {
          // Handle redirects by following the location header
          const location = res.headers.location;
          if (location) {
            if (verbose) console.log(`Following redirect to: ${location}`);
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

async function generateOGImage(content: any) {
  const filename = content.slug.split('/').pop();
  const cdnImageUrl = `${CDN_BASE_URL}/images/og-images/${filename}.png`;

  // Check if image already exists on Bunny CDN
  if (!overwrite) {
    try {
      const response = await fetch(cdnImageUrl, { method: 'HEAD' });
      if (response.ok) {
        if (verbose) console.log(`OG image already exists on Bunny CDN: ${cdnImageUrl}`);
        return false; // Already exists, skip generation
      }
    } catch (err) {
      // Not found is expected if it doesn't exist
    }
  }

  // Generate new image via the API
  const start = Date.now();
  try {
    // Construct API URL with parameters
    const urlParams = new URLSearchParams();
    
    // Ensure we have valid title and description
    const safeTitle = content.title || 'Untitled';
    urlParams.append('title', safeTitle);
    
    // Ensure we have a description and properly handle special characters
    let safeDescription = '';
    if (content.description) {
      // First decode any HTML entities
      safeDescription = content.description
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }
    
    urlParams.append('description', safeDescription);
    
    if (content.image) {
      urlParams.append('imageSrc', content.image);
    } else {
      // Try to find a default image based on the content type
      let defaultImage = null;
      if (content.type === 'blog') {
        defaultImage = 'https://zackproser.b-cdn.net/images/modern-coding-og-background.webp';
      } else if (content.type === 'video') {
        defaultImage = 'https://zackproser.b-cdn.net/images/ai-engineering-og-background.webp';
      }
      
      if (defaultImage) {
        if (verbose) console.log(`Using default image for ${content.slug}: ${defaultImage}`);
        urlParams.append('imageSrc', defaultImage);
      }
    }
    
    const apiEndpoint = `${API_URL}/api/og/generate?${urlParams.toString()}`;
    if (verbose) console.log(`Fetching from API: ${apiEndpoint}`);
    
    // Call the API
    const response = await makeRequest(apiEndpoint);
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}: ${response.statusText}`);
    }
    
    // Get the image as buffer
    const imageBuffer = await response.buffer();
    
    // For now, we'll save to local file system as a temporary step
    // In production, you would upload directly to Bunny CDN via their API
    const localOutputDir = path.join(process.cwd(), 'public', 'og-images');
    if (!fs.existsSync(localOutputDir)) {
      fs.mkdirSync(localOutputDir, { recursive: true });
    }
    
    const localOutputPath = path.join(localOutputDir, `${filename}.png`);
    await fsPromises.writeFile(localOutputPath, imageBuffer);
    
    console.log(`⚡ [Generated] ${filename}.png (${Date.now() - start}ms) - Saved locally`);
    console.log(`📝 Note: Upload to Bunny CDN manually or implement CDN upload API`);
    console.log(`🔗 Expected CDN URL: ${cdnImageUrl}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error generating OG image for ${filename}:`, error);
    return false;
  }
}

async function main() {
  let targets;
  if (slugArg) {
    // If a slug is provided, try to find it in different content types
    const contentTypes = ['blog', 'videos', 'learn/courses'];
    let found = false;
    
    for (const contentType of contentTypes) {
      try {
        const metadata = await getContentMetadata(contentType, slugArg);
        if (metadata && metadata.title !== slugArg.replace(/-/g, ' ')) {
          targets = [{ type: contentType, slug: slugArg }];
          found = true;
          break;
        }
      } catch (err) {
        // Continue to next content type
      }
    }
    
    if (!found) {
      // Fallback to blog type
      targets = [{ type: 'blog', slug: slugArg }];
    }
  } else {
    targets = testSlugs;
  }

  console.log('🚀 Starting OG image generation for Bunny CDN...');
  console.log(`📡 CDN Base URL: ${CDN_BASE_URL}`);
  console.log(`🔗 API URL: ${API_URL}`);
  console.log('');

  let generated = 0;
  let skipped = 0;

  for (const { type, slug } of targets) {
    const meta = await getContentMetadata(type, slug);
    if (verbose) console.log(`Processing:`, meta);
    
    const result = await generateOGImage(meta);
    if (result) {
      generated++;
    } else {
      skipped++;
    }
  }

  console.log('');
  console.log('🎉 Generation complete!');
  console.log(`📊 Summary:`);
  console.log(`   • Generated: ${generated}`);
  console.log(`   • Skipped (already exist): ${skipped}`);
  console.log(`   • Total processed: ${targets.length}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Upload generated images to Bunny CDN');
  console.log('   2. Remove local og-images directory from repo');
  console.log('   3. Test OG image serving via CDN');
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 