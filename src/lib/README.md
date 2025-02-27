# Content System Documentation

## Overview

This document describes the standardized content system for handling MDX-based content in the application. The system leverages Next.js file-based routing and MDX for content management.

## Key Files

- `content-handlers.ts`: The main file containing all content-related functionality
- `getAllBlogMetadata.ts`: Simplified wrapper around content-handlers.ts for blog content
- `getAllContentMetadata.ts`: Generic metadata retrieval for any content type

## Standard Content Structure

All content follows this file structure:

```
src/app/[content-type]/[slug]/page.mdx
```

Where:
- `[content-type]` is one of: `blog`, `videos`, `learn/courses`, etc.
- `[slug]` is the unique identifier for the content item
- `page.mdx` contains the content and its metadata

## Using the Content System

### Importing Content

```typescript
import { importContent, getContentBySlug } from '@/lib/content-handlers';

// Import content by slug and content type
const content = await importContent('my-article-slug', 'blog');

// Or use getContentBySlug which handles errors and returns null if not found
const content = await getContentBySlug('my-article-slug', 'blog');
```

### Getting All Content of a Type

```typescript
import { getAllContent } from '@/lib/content-handlers';

// Get all blog posts
const allBlogPosts = await getAllContent('blog');

// Get all videos
const allVideos = await getAllContent('videos');
```

### Loading Content with MDX Component

```typescript
import { loadContent } from '@/lib/content-handlers';

// Load content with its MDX component
const { MdxContent, metadata } = await loadContent('blog', 'my-article-slug');

// Use in a component
return <MdxContent />;
```

### Generating Static Params for Next.js

```typescript
import { generateContentStaticParams } from '@/lib/content-handlers';

// In your page.tsx file
export async function generateStaticParams() {
  return generateContentStaticParams('blog');
}
```

### Generating Metadata for Next.js

```typescript
import { generateContentMetadata } from '@/lib/content-handlers';

// In your page.tsx file
export async function generateMetadata({ params }) {
  return generateContentMetadata('blog', params.slug);
}
```

## Migration Complete

The migration from the old article-specific functions to the new standardized content system is now complete. All code now uses the following functions from `content-handlers.ts`:

| Function | Purpose |
|--------------|--------------|
| `importContent` | Import content and metadata from MDX files |
| `importContentMetadata` | Import only metadata from MDX files |
| `getContentBySlug` | Get content by slug with error handling |
| `getAllContent` | Get all content of a specific type |

The new functions are more flexible and support all content types, not just blog articles.

## Best Practices

1. Always use `content-handlers.ts` functions for content management
2. Use the appropriate content type parameter instead of hardcoding 'blog'
3. Handle errors appropriately when loading content
4. Use the `loadContent` function when you need both the MDX component and metadata 