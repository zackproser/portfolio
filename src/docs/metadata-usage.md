# Using the createMetadata Function

The `createMetadata` function is a utility for creating consistent metadata objects for all content types in the portfolio site. This document explains how to use it effectively.

## Basic Usage

```typescript
import { createMetadata } from '@/utils/createMetadata'

export const metadata = createMetadata({
    author: "Your Name", 
    date: "2024-07-01",
    title: "Your Article Title",
    description: "A brief description of your content",
    image: yourImageImport,
    filePath: __filename  // Recommended: automatically generates the slug
});
```

## Parameters

The `createMetadata` function accepts the following parameters:

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `author` | string | The content author | Yes |
| `date` | string | Publication date | Yes |
| `title` | string | Content title | Yes |
| `description` | string | Brief description | Yes |
| `image` | StaticImageData or string | Featured image | No |
| `type` | 'blog' \| 'course' \| 'video' \| 'demo' | Content type | No (defaults to 'blog') |
| `commerce` | object | Commerce-related settings | No |
| `landing` | object | Landing page settings | No |
| `slug` | string | Custom URL slug | No (auto-generated if not provided) |
| `filePath` | string | File path (use `__filename`) | No (but recommended) |

## Slug Generation

The function generates slugs using the same logic as the `importArticle` function, ensuring consistency across your application. The priority order is:

1. Explicitly provided `slug` parameter
2. Generated from `filePath` (the directory name containing the MDX file)
3. Empty string as a last resort (will trigger a warning)

Using `filePath: __filename` is the recommended approach as it ensures the slug matches the file's location in the project structure.

## Example Usage

### Blog Post

```typescript
export const metadata = createMetadata({
    author: "Zachary Proser", 
    date: "2024-07-01",
    title: "How to Use Vector Databases",
    description: "A comprehensive guide to vector databases",
    image: featuredImage,
    filePath: __filename
});
```

### Course

```typescript
export const metadata = createMetadata({
    author: "Zachary Proser", 
    date: "2024-07-01",
    title: "Vector Database Mastery",
    description: "Master vector databases from scratch",
    image: courseImage,
    type: "course",
    filePath: __filename,
    commerce: {
        isPaid: true,
        price: 4900,  // $49.00
        previewLength: 3,  // Preview first 3 sections
    }
});
```

## Best Practices

1. Always use `filePath: __filename` to ensure correct slug generation
2. Only provide a custom `slug` if you need to override the default behavior
3. Always provide all required fields (author, date, title, description)
4. Use properly imported images rather than string paths when possible