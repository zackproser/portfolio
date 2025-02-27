# Simplified Content System

This document explains the simplified MDX-based content system implemented in the portfolio site.

## Overview

The simplified content system leverages Next.js App Router's file-based routing to automatically handle content organization. Each content type has its own directory under `app/`, and each piece of content is a directory with a `page.mdx` file.

## Directory Structure

```
src/app/
├── blog/
│   ├── [slug]/
│   │   └── page.tsx       # Dynamic route handler for blog posts
│   ├── page.tsx           # Blog index page
│   └── my-blog-post/      # Example blog post
│       └── page.mdx       # MDX content with metadata
├── videos/
│   ├── [slug]/
│   │   └── page.tsx       # Dynamic route handler for videos
│   ├── page.tsx           # Videos index page
│   └── my-video/          # Example video
│       └── page.mdx       # MDX content with metadata
└── learn/
    └── courses/
        ├── [slug]/
        │   └── page.tsx   # Dynamic route handler for courses
        ├── page.tsx       # Courses index page
        └── my-course/     # Example course
            └── page.mdx   # MDX content with metadata
```

## Creating Content

To create a new piece of content:

1. Create a new directory under the appropriate content type directory (e.g., `src/app/blog/my-new-post/`)
2. Create a `page.mdx` file in that directory
3. Add the required metadata and content to the MDX file

### Example MDX File

```mdx
import { createMetadata } from '@/utils/createMetadata'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleLayout } from '@/components/ArticleLayout'
import Newsletter from '@/components/NewsletterWrapper'
import ConsultingCTA from '@/components/ConsultingCTA'
import Callout from '@/components/Callout'

export const metadata = createMetadata({
  author: "Author Name",
  date: "2024-06-01",
  title: "My Content Title",
  description: "Description of the content",
  type: "blog",
  slug: "my-content-slug",
  commerce: {
    isPaid: true,
    price: 9.99,
    stripe_price_id: "price_123",
    previewLength: 3,
    paywallHeader: "Get Access to the Full Content",
    paywallBody: "This is premium content.",
    buttonText: "Purchase Now",
  }
})

// Use the ArticleLayout component to render the content
export default (props) => <ArticleLayout metadata={metadata} {...props} />

# My Content Title

Content goes here...

<Newsletter />

## Premium Content Section

This section would only be visible to users who have purchased access.

<ConsultingCTA />
```

## Metadata

Content metadata is created using the `createMetadata` function, which ensures consistent metadata across all content types.

### Required Metadata Fields

- `author`: The content author
- `date`: Publication date
- `title`: Content title
- `description`: Brief description
- `type`: Content type ('blog', 'video', 'course', 'demo')

### Optional Metadata Fields

- `image`: Featured image
- `slug`: Custom URL slug (defaults to directory name)
- `commerce`: Commerce-related settings for paid content
  - `isPaid`: Whether the content is paid
  - `price`: The price of the content
  - `stripe_price_id`: Stripe price ID
  - `previewLength`: Number of sections to show in preview
  - `paywallHeader`: Header text for the paywall
  - `paywallBody`: Body text for the paywall
  - `buttonText`: Text for the purchase button

## Dynamic Routing

Each content type has its own dynamic route handler in `[slug]/page.tsx` that:

1. Loads the MDX content based on the slug
2. Checks for user authentication
3. Verifies if the user has purchased the content (for paid content)
4. Renders the appropriate content with or without a paywall

## Helper Functions

The system includes several helper functions:

- `getAllContentMetadata(contentType)`: Gets metadata for all content of a specific type
- `createMetadata(params)`: Creates consistent metadata for content
- `getSlugFromPath(filePath)`: Extracts a slug from a file path
- `getTypeFromPath(filePath)`: Determines content type from a file path
- `getUrlForContent(type, slug)`: Generates a URL for any content type and slug

### Shared Content Handlers

To avoid code duplication, we've extracted common functionality into shared library functions in `src/lib/content-handlers.ts`:

- `generateContentStaticParams(contentType)`: Generates static params for a content type
- `generateContentMetadata(contentType, slug)`: Generates metadata for a content item
- `hasUserPurchased(userId, slug)`: Checks if a user has purchased a specific content
- `getDefaultPaywallText(contentType)`: Gets default paywall text for a content type
- `contentExists(contentType, slug)`: Checks if the MDX file exists for a content item
- `loadContent(contentType, slug)`: Loads content and handles authentication and paywall

These shared functions are used by all content type handlers to ensure consistent behavior and reduce code duplication.

## Benefits

- **Simpler Organization**: Content is organized by type and slug in a predictable way
- **Less Code**: No need for complex path handling or content loading logic
- **Better Performance**: Next.js can optimize and statically generate these pages
- **Easier Maintenance**: Adding new content is as simple as creating a new directory and MDX file 