# OpenGraph Image Generation System

This system provides an optimized approach for generating OpenGraph images for your content, with the following key features:

- 🚀 **No Build-time Overhead** - Images are generated manually, not during site builds
- ⚡ **Performance Optimized** - Pre-generates images that are served statically
- 🔍 **Smart Caching** - Only generates images that don't already exist
- 🎯 **Targeted Generation** - Generate images for specific content when needed

## How It Works

The system has two main components:

1. **Pre-generated Static Images** - Images are generated ahead of time and stored in `/public/og-images/`
2. **Dynamic Fallback** - The OG route falls back to dynamic generation if a pre-generated image doesn't exist

## Usage

### Initial Setup

Generate images for all content:

```bash
npm run og:generate
```

This will create all missing OpenGraph images in the `public/og-images/` directory.

### Generate Images for New Content

When you create new content, generate its OG image:

```bash
npm run og:generate-for -- --slug your-new-content-slug
```

Replace `your-new-content-slug` with the slug of your new content (just the final part of the path).

### Maintenance

#### Clean All Images

To remove all generated images:

```bash
npm run og:clean
```

#### Clean Orphaned Images

To remove images that don't correspond to any content:

```bash
npm run og:clean-orphans
```

## Technical Details

### Script Locations

- `scripts/generate-og-images.js` - Main generation script
- `scripts/clean-og-images.js` - Script to clean orphaned images

### API Endpoint

The `/api/og` route now checks for pre-generated images before attempting dynamic generation.

### Image Format

All images are generated at 1200x630 pixels in PNG format, optimized for social media sharing.

## Performance Benefits

- ⏱️ **Faster Builds** - OG image generation no longer slows down your site builds
- ⚡ **Faster Page Loads** - Pre-generated static images are served immediately
- 🌐 **Reduced Server Load** - No on-demand image generation for most requests

## CI/CD Integration (Optional)

For automated image generation in CI/CD pipelines, add the following to your workflow:

```yaml
# In your workflow file
- name: Generate OG Images
  run: npm run og:generate
```

## Troubleshooting

If images aren't being generated correctly:

1. Check the console output for error messages
2. Verify that the content exists and is properly indexed
3. Run with `--slug` to target a specific piece of content for debugging 