import { ExtendedMetadata } from './metadata'

// Base content type for anything on the site
export interface Content extends ExtendedMetadata {
  tags?: string[]
  directorySlug?: string  // The original directory name, used for reliable matching
}

// For blog posts and courses
export interface Blog extends Content {
  type: 'blog' | 'video' | 'demo'
}

// For demos and other non-purchasable content
export interface Demo extends Content {
  type: 'demo'
  techStack?: string[]
  liveUrl?: string
  sourceUrl?: string
}

// Helper type for purchasable items
export type Purchasable = Content & {
  commerce: NonNullable<Blog['commerce']> & { isPaid: true }
}

// Helper to generate default landing page content
export function getDefaultLanding(blog: Blog): NonNullable<Blog['landing']> {
  const defaults = {
    subtitle: blog.description,
    features: [
      {
        title: 'Complete Access',
        description: 'Get full access to this in-depth content with all code examples'
      },
      {
        title: 'Source Code Included',
        description: 'Access all accompanying source code and examples'
      },
      {
        title: 'Future Updates',
        description: 'Receive all future updates and improvements'
      }
    ]
  };
  return {
    ...defaults,
    ...blog.landing
  };
}

// Export both BlogWithSlug and ArticleWithSlug (for backward compatibility)
export type BlogWithSlug = Blog;
export type ArticleWithSlug = BlogWithSlug; // Alias for backward compatibility 