# OpenGraph Image Generation System

This document explains how the OG image generation system works and how to operate it.

## Overview

The OG system generates social media preview images for all blog posts, videos, and other content. It was designed with two critical goals:

1. **⚡ Performance** - OG images must be served extremely fast from filesystem cache
2. **🎨 Quality & Uniformity** - Every page needs excellent, consistent OG images for maximum click-through rates

The system uses a **two-step build-time process** to achieve these goals:

1. **Metadata Extraction** → Extracts metadata from all MDX files to JSON cache
2. **Image Generation** → Reads cache and generates OG images via API

## Design Goals

### 🚀 Ultra-Fast Serving
- **Static file serving** - OG images are pre-generated and served from filesystem
- **No runtime generation** - Zero API calls or processing when users share links
- **CDN-optimized** - Images can be cached at edge locations for global speed
- **Build-time validation** - Broken images caught before deployment

### 🎯 Maximum Engagement
- **Consistent branding** - All OG images use the same template and styling
- **Rich content** - Images include title, description, and relevant visuals
- **Social platform optimized** - Proper dimensions and formats for Twitter, LinkedIn, etc.
- **Quality control** - Every page is guaranteed to have a beautiful OG image

### 📈 Click-Through Impact
Well-designed OG images are crucial for:
- **Social media engagement** - Users stop scrolling when they see compelling previews
- **Professional appearance** - Consistent branding builds trust and authority  
- **Content discovery** - Rich previews help users understand what they're clicking
- **SEO benefits** - Social signals from shares improve search rankings

## Architecture

```
MDX Files → extract-metadata.js → metadata-cache.json → og-image-generator.js → Static OG Images → Fast Serving
```

### Files

- `scripts/extract-metadata.js` - Extracts metadata from all MDX files
- `scripts/og-image-generator.js` - Generates OG images from metadata cache  
- `metadata-cache.json` - JSON cache of all content metadata (gitignored)
- `public/og-images/` - Generated OG image files (served statically)

## How It Works

### 1. Metadata Extraction

Parses all MDX files in `src/content/` and extracts metadata from `createMetadata()` calls:

```bash
node scripts/extract-metadata.js
```

**What it extracts:**
- Title, description, author, date
- Image references and resolves import paths
- Content type and slug

**Output:** `metadata-cache.json` with all content metadata

### 2. OG Image Generation

Reads the metadata cache and generates images via the Next.js OG API:

```bash
# Generate all OG images
npm run og:generate

# Generate specific image
npm run og:generate-for <slug>

# With verbose logging
npm run og:generate-for <slug> --verbose
```

## Build Integration

The system is integrated into the build process:

```json
{
  "prebuild": "node scripts/extract-metadata.js && node scripts/check-metadata.js && node scripts/generate-collections.js"
}
```

**Build flow:**
1. `extract-metadata.js` creates fresh metadata cache
2. OG images are generated as needed during build
3. Images are cached and only regenerated if missing

## Manual Operations

### Regenerate All Metadata
```bash
node scripts/extract-metadata.js
```

### Regenerate All OG Images
```bash
npm run og:clean
npm run og:generate
```

### Generate Single OG Image
```bash
npm run og:generate-for your-blog-post-slug
```

### Debug Metadata Extraction
```bash
# View extracted metadata for specific post
cat metadata-cache.json | grep -A 10 "your-blog-post-slug"
```

## Troubleshooting

### "Wrong description in OG image"
**Problem:** OG image shows text from code samples instead of actual metadata.

**Solution:** The metadata extraction targets `createMetadata()` calls specifically. Regenerate the cache:
```bash
node scripts/extract-metadata.js
rm public/og-images/problematic-slug.png
npm run og:generate-for problematic-slug
```

### "No metadata found in cache"
**Problem:** Post exists but not in metadata cache.

**Check:**
1. Does the MDX file have `export const metadata = createMetadata({...})`?
2. Is the metadata cache up to date?

**Fix:**
```bash
node scripts/extract-metadata.js
```

### "Metadata cache not found"
**Problem:** OG generation fails because cache doesn't exist.

**Fix:**
```bash
node scripts/extract-metadata.js
```

### "OG generation fails"
**Problem:** API errors when generating images.

**Debug:**
```bash
# Check if dev server is running
npm run og:generate-for <slug> --verbose
```

## Development Notes

- **Metadata cache is gitignored** - regenerated on each build
- **Images are cached** - only regenerated if missing or forced
- **Regex parsing is targeted** - only looks within `createMetadata()` calls
- **Build-time validation** - metadata issues caught early

## Performance

The system is optimized for both build-time efficiency and runtime speed:

### Build Performance
- Metadata extraction: ~200ms for 130+ posts
- OG generation: ~2-3s per image (cached after first generation)
- Total build impact: minimal (only runs once per build)

### Runtime Performance 
- **Zero server load** - All OG images served as static files
- **Instant response** - No API calls or processing when pages are shared
- **CDN-friendly** - Images cached globally for maximum speed
- **SEO optimized** - Fast loading improves social platform crawling

### Business Impact
- **Higher engagement** - Fast-loading, beautiful previews increase click-through rates
- **Better SEO** - Social shares with rich previews boost search rankings  
- **Professional brand** - Consistent, high-quality images build trust and authority
- **Reduced bounce** - Users know what to expect before clicking, leading to better engagement 