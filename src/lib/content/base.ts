import { StaticImageData } from 'next/image';
import { ExtendedMetadata } from '@/lib/shared-types';
import path from 'path';

// Content class directly implements ExtendedMetadata and adds methods
export abstract class Content implements ExtendedMetadata {
  // ExtendedMetadata fields
  title: string;
  slug: string;
  description: string;
  author: string;
  date: string;
  image?: string | StaticImageData | { src: string };
  type: 'blog' | 'course' | 'video' | 'demo';
  tags: string[] = [];
  url?: string;
  commerce?: ExtendedMetadata['commerce'];
  landing?: ExtendedMetadata['landing'];
  openGraph?: ExtendedMetadata['openGraph'];
  twitter?: ExtendedMetadata['twitter'];

  // Shared type mapping for consistent path/URL generation
  static readonly TYPE_PATHS: Record<string, string> = {
    'blog': 'blog',
    'course': 'learn/courses',
    'video': 'videos',
    'demo': 'demos',
    'newsletter': 'newsletter',
    'comparison': 'comparisons',
    'tool': 'tools'
  };

  constructor(metadata: ExtendedMetadata) {
    // Copy all metadata fields to this instance
    Object.assign(this, metadata);
    this.tags = metadata.tags || [];
  }

  // Content methods
  getUrl(): string {
    return Content.getUrlForContent(this.type, this.slug);
  }

  getSourcePath(): string {
    return Content.getSourcePathForContent(this.type, this.slug);
  }

  /**
   * Get the base path for a content type
   * @param type Content type
   * @returns Base path for the content type
   */
  static getBasePathForType(type: string): string {
    return Content.TYPE_PATHS[type] || type;
  }

  /**
   * Generate a URL for any content type and slug
   * @param type Content type
   * @param slug Content slug
   * @returns Full URL path
   */
  static getUrlForContent(type: string, slug: string): string {
    const baseDir = Content.TYPE_PATHS[type];

    if (!baseDir) {
      return `/${type}/${slug}`;
    }
    
    return `/${baseDir}/${slug}`;
  }

  /**
   * Generate a source path for any content type and slug
   * @param type Content type
   * @param slug Content slug
   * @returns Full source path
   */
  static getSourcePathForContent(type: string, slug: string): string {
    const baseDir = Content.TYPE_PATHS[type];

    if (!baseDir) {
      throw new Error(`Invalid content type: ${type}`);
    }

    return path.join(Content.getWorkspacePath(), 'src/app', baseDir, slug, 'page.mdx');
  }

  /**
   * Extract a slug from a file path
   * @param filePath The file path (usually __filename in MDX)
   * @returns A properly formatted slug
   */
  static getSlugFromPath(filePath: string): string {
    if (!filePath) return '';
    
    // Extract the path segments
    const segments = filePath.split('/');
    
    // Find the app directory index
    const appIndex = segments.findIndex(s => s === 'app');
    if (appIndex === -1) return '';
    
    // Get relevant path segments after 'app'
    const relevantSegments = segments.slice(appIndex + 1);
    
    // We need at least two segments: content type and slug
    if (relevantSegments.length < 2) return '';
    
    // Remove 'page.mdx' or similar from the path if it's the last segment
    if (relevantSegments[relevantSegments.length - 1].startsWith('page.')) {
      // The slug is the directory name (second-to-last segment)
      return relevantSegments[relevantSegments.length - 2];
    }
    
    // If we're dealing with a directory path
    return relevantSegments[relevantSegments.length - 1].replace('/page.mdx', '');
  }

  /**
   * Get the content type from a file path
   * @param filePath The file path (usually __filename in MDX)
   * @returns The content type
   */
  static getTypeFromPath(filePath: string): string {
    if (!filePath) return 'blog'; // Default to blog
    
    // Extract the path segments
    const segments = filePath.split('/');
    
    // Find the app directory index
    const appIndex = segments.findIndex(s => s === 'app');
    if (appIndex === -1) return 'blog';
    
    // Get relevant path segments after 'app'
    const relevantSegments = segments.slice(appIndex + 1);
    
    // We need at least one segment for the content type
    if (relevantSegments.length < 1) return 'blog';
    
    // The first segment after 'app' is the content type
    const typeSegment = relevantSegments[0];
    
    // Create a reverse mapping from paths to types
    const pathToType: Record<string, string> = {};
    Object.entries(Content.TYPE_PATHS).forEach(([type, path]) => {
      pathToType[path] = type;
    });
    
    // Check if the segment starts with 'learn/'
    if (typeSegment.startsWith('learn/')) {
      return 'course';
    }
    
    return pathToType[typeSegment] || 'blog';
  }

  /**
   * Load content by type and slug
   * @param type Content type
   * @param slug Content slug
   * @returns Content instance
   */
  static async load(type: string, slug: string): Promise<Content> {
    // Validate content type first
    if (!Object.keys(Content.TYPE_PATHS).includes(type)) {
      throw new Error(`Invalid content type: ${type}`);
    }
    
    try {
      const basePath = Content.getBasePathForType(type);
      
      // Use dynamic import to directly access the exported metadata
      const mdxModule = await import(`@/app/${basePath}/${slug}/page.mdx`);
      
      if (!mdxModule.metadata) {
        console.error(`No metadata found in MDX for ${slug}`);
        throw new Error(`No metadata found for ${slug}`);
      }
      
      // Create a ContentItem with the metadata
      return new ContentItem({
        ...mdxModule.metadata,
        slug,
        type
      });
    } catch (error) {
      console.error(`Error loading content ${type}/${slug}:`, error);
      throw error;
    }
  }

  static getWorkspacePath(): string {
    if (process.env.NODE_ENV === 'test') {
      return '/mock/workspace';
    }
    // In development or production, use the actual workspace path
    return process.env.WORKSPACE_PATH || process.cwd();
  }
}

// A concrete implementation of Content for all content types
export class ContentItem extends Content {
  constructor(metadata: ExtendedMetadata) {
    super(metadata);
  }

  // Add any specialized methods here
  // For example, commerce-related methods
  async createCheckoutSession(userId: string): Promise<string> {
    if (!this.commerce?.isPaid) {
      throw new Error('Content is not purchasable');
    }
    
    // Implementation...
    throw new Error('Not implemented');
  }

  async verifyPurchase(userId: string): Promise<boolean> {
    if (!this.commerce?.isPaid) return true;
    
    // Implementation...
    throw new Error('Not implemented');
  }
} 