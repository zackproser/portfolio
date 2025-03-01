# Types Organization

This directory contains all the shared TypeScript types used throughout the application.

## Structure

- `index.ts`: Re-exports all types for easier imports
- `metadata.ts`: Base metadata types that extend Next.js Metadata
- `content.ts`: Content-related types (blogs, courses, demos)
- `product.ts`: Product-related types for e-commerce
- `commerce.ts`: Commerce and pricing related types
- `database.ts`: Database interface for vector database comparisons
- `Tool.ts`: Tool-related types
- `next-auth.d.ts`: Next-Auth type declarations

## Usage

Import types from the types directory:

```typescript
// Recommended approach - import from index
import { Blog, ProductContent, Database } from '@/types';

// Alternative - import directly from specific files
import { Blog } from '@/types/content';
import { ProductContent } from '@/types/product';
```

## Adding New Types

When adding new types:

1. Determine if they belong in an existing file or need a new file
2. If creating a new file, add it to the exports in `index.ts`
3. Follow the naming conventions established in existing files
4. Document complex types with comments 