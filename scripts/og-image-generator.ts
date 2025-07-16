import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as http from 'http';
import * as https from 'https';
import { put, head } from '@vercel/blob';
import * as dotenv from 'dotenv';
import { getContentMetadataByDirectorySlug } from '../src/lib/content-metadata-helpers';

dotenv.config();
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!BLOB_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN in environment.');
}

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og-images');
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const args = process.argv.slice(2);
const overwrite = args.includes('--overwrite');
const verbose = args.includes('--verbose');

// Helper to parse --slug argument
function getArgValue(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
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

async function generateOGImage(content: any) {
  // ... OG image generation logic ...
  // This is a placeholder for your actual OG image generation code
  // For now, just simulate a buffer
  const imageBuffer = Buffer.from('fake-image');
  const filename = content.slug.split('/').pop();
  const blobName = `og-images/${filename}.png`;

  // Check if blob already exists
  if (!overwrite) {
    try {
      const existing = await head(blobName, { token: BLOB_TOKEN });
      if (existing) {
        if (verbose) console.log(`OG image already exists in blob storage: ${blobName}`);
        return;
      }
    } catch (err) {
      // Not found is expected if it doesn't exist
    }
  }

  // Upload to Vercel Blob
  try {
    const blobResult = await put(blobName, imageBuffer, {
      access: 'public',
      token: BLOB_TOKEN,
      contentType: 'image/png',
    });
    if (verbose) console.log(`☁️  Uploaded to Vercel Blob: ${blobResult.url}`);
  } catch (err) {
    console.error(`Failed to upload OG image for ${content.slug}:`, err);
  }
}

async function main() {
  let targets;
  if (slugArg) {
    // If a slug is provided, guess type as blog for demo
    targets = [{ type: 'blog', slug: slugArg }];
  } else {
    targets = testSlugs;
  }

  for (const { type, slug } of targets) {
    const meta = await getContentMetadata(type, slug);
    if (verbose) console.log(`Generating OG image for:`, meta);
    await generateOGImage(meta);
  }
}

main(); 