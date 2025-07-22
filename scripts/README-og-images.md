# OpenGraph Image Generation System

This system provides an optimized approach for generating OpenGraph images for your content, with the following key features:

- 🚀 **No Build-time Overhead** - Images are generated manually, not during site builds
- ⚡ **Performance Optimized** - Pre-generates images that are served from Bunny CDN
- 🔍 **Smart Caching** - Only generates images that don't already exist on CDN
- 🎯 **Targeted Generation** - Generate images for specific content when needed
- 🌐 **CDN-First Architecture** - All images served from Bunny CDN for optimal performance

## How It Works

The system has two main components:

1. **Pre-generated Static Images** - Images are generated ahead of time and stored on Bunny CDN at `https://zackproser.b-cdn.net/og-images/`
2. **Dynamic Fallback** - The OG route falls back to dynamic generation if a pre-generated image doesn't exist on CDN

## Architecture

```
Request → /api/og?slug=article-slug
    ↓
Check Bunny CDN: https://zackproser.b-cdn.net/og-images/article-slug.png
    ↓
If exists: Redirect to CDN URL (fastest)
    ↓
If not exists: Redirect to /api/og/generate (dynamic generation)
    ↓
Generate with title/description + default background from CDN
```

## Usage

### Initial Setup

Generate images for all content:

```bash
npm run og:generate
```

This will create all missing OpenGraph images and save them locally (ready for CDN upload).

### Generate Images for New Content

When you create new content, generate its OG image:

```bash
npm run og:generate-for -- --slug your-new-content-slug
```

Replace `your-new-content-slug` with the slug of your new content (just the final part of the path).

### Migration to CDN

To analyze and migrate existing OG images to Bunny CDN:

```bash
npm run og:migrate
```

This script will:
- List all existing OG images with their sizes
- Show the target CDN URLs
- Provide migration instructions
- Calculate total size savings

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

## Overwriting Existing OG Images

- By default, running the script will **skip generating an OG image if it already exists on Bunny CDN** for that slug.
- To force regeneration and overwrite existing OG images, use the `--overwrite` flag:
  ```sh
  npm run og:generate -- --overwrite
  ```
- This is useful if you update a post's hero image, title, or description and want to refresh the OG image.

## Technical Details

### Script Locations

- `scripts/og-image-generator.ts` - Main generation script (updated for CDN)
- `scripts/migrate-og-images-to-cdn.js` - Migration analysis script
- `scripts/clean-og-images.ts` - Script to clean orphaned images

### API Endpoints

- `/api/og` - Main route that checks CDN first, then falls back to generator
- `/api/og/generate` - Dynamic image generation with CDN fallbacks

### Image Sources

The system now prioritizes Bunny CDN for all image sources:
- **Hero Images**: Fetched from `https://zackproser.b-cdn.net/images/`
- **Default Backgrounds**: Served from CDN
- **Generated OG Images**: Stored on CDN at `https://zackproser.b-cdn.net/og-images/`

### Image Format

All images are generated at 1200x630 pixels in PNG format, optimized for social media sharing.

## Performance Benefits

- ⏱️ **Faster Builds** - OG image generation no longer slows down your site builds
- ⚡ **Faster Page Loads** - Pre-generated static images are served from CDN
- 🌐 **Reduced Server Load** - No on-demand image generation for most requests
- 📦 **Smaller Repo Size** - Large static assets moved to CDN
- 🚀 **Global CDN** - Images served from edge locations worldwide

## Migration from Local Storage

If you're migrating from the old local storage system:

1. **Run migration analysis**:
   ```bash
   npm run og:migrate
   ```

2. **Upload existing images to Bunny CDN**:
   - Upload all files from `public/og-images/` to `https://zackproser.b-cdn.net/og-images/`

3. **Test the new system**:
   ```bash
   npm run og:generate-for -- --slug test-slug
   ```

4. **Remove local directory**:
   ```bash
   rm -rf public/og-images/
   ```

5. **Update .gitignore** (optional):
   ```
   public/og-images/
   ```

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
4. Check that Bunny CDN is accessible and properly configured
5. Verify that default background images exist on CDN

## CDN Configuration

The system uses the following CDN configuration:
- **Base URL**: `https://zackproser.b-cdn.net`
- **Images Path**: `/images/`
- **OG Images Path**: `/og-images/`
- **Default Backgrounds**: Available at `/images/modern-coding-og-background.webp` and `/images/ai-engineering-og-background.webp` 