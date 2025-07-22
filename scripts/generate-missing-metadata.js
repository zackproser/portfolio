#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

// Blog posts that are missing metadata
const missingMetadataPosts = [
  'glossary-of-tech-phrases',
  'how-do-you-write-so-fast',
  'programmer-emotions',
  'the-best-thing-about-being-a-developer',
  'trace-the-system-in-your-head',
  'vibe-coding-mastery',
  'warp-ai-terminal-review'
];

function generateMetadata(slug) {
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: title,
    description: `A blog post about ${title.toLowerCase()}`,
    date: new Date().toISOString().split('T')[0],
    author: 'Zack Proser',
    tags: ['blog'],
    image: '/images/default-blog-image.webp',
    type: 'blog',
    slug: slug,
    landing: {
      subtitle: `A blog post about ${title.toLowerCase()}`,
      features: [],
      testimonials: []
    },
    commerce: {
      isPaid: false,
      price: 0
    }
  };
}

function createMetadataFile(slug) {
  console.log(`📁 Creating metadata for: ${slug}`);
  
  try {
    const metadata = generateMetadata(slug);
    const metadataPath = path.join('src/content/blog', slug, 'metadata.json');
    
    // Ensure directory exists
    const dir = path.dirname(metadataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    console.log(`  ✅ Created: ${metadataPath}`);
    
  } catch (error) {
    console.error(`  ❌ Error creating metadata for ${slug}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Generating Missing Metadata Files\n');
  
  for (const slug of missingMetadataPosts) {
    createMetadataFile(slug);
  }
  
  console.log('\n✅ Generation completed!');
}

main().catch(console.error); 