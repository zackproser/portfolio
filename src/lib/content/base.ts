import { StaticImageData } from 'next/image';
import { ExtendedMetadata } from '@/lib/shared-types';
import path from 'path';

interface ContentEntry {
  metadata: ExtendedMetadata;
  content: string;
}

class ContentRegistry {
  private static instance: ContentRegistry;
  private contentMap: Map<string, ContentEntry> = new Map();

  private constructor() {}

  static getInstance(): ContentRegistry {
    if (!ContentRegistry.instance) {
      ContentRegistry.instance = new ContentRegistry();
    }
    return ContentRegistry.instance;
  }

  register(path: string, metadata: ExtendedMetadata, content: string = '') {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    this.contentMap.set(normalizedPath, { metadata, content });
  }

  get(path: string): ContentEntry | undefined {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return this.contentMap.get(normalizedPath);
  }

  has(path: string): boolean {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return this.contentMap.has(normalizedPath);
  }

  clear() {
    this.contentMap.clear();
  }

  getAllPaths(): string[] {
    return Array.from(this.contentMap.keys());
  }

  getByType(type: string): ContentEntry[] {
    return Array.from(this.contentMap.entries())
      .filter(([_, entry]) => entry.metadata.type === type)
      .map(([_, entry]) => entry);
  }
}

export const contentRegistry = ContentRegistry.getInstance();

// Use ExtendedMetadata directly instead of redefining ContentMetadata
export type ContentMetadata = ExtendedMetadata;

// Define the interface for the abstract class methods
export interface ContentMethods {
  getUrl(): string;
  getSourcePath(): string;
}

// Combine the metadata and methods interfaces
export interface Content extends ContentMetadata, ContentMethods {}

export abstract class Content implements ContentMetadata {
  // Include all ExtendedMetadata fields
  title: string;
  slug: string;
  description: string;
  author: string;
  date: string;
  image?: string | StaticImageData | { src: string };
  type: 'blog' | 'course' | 'video' | 'demo';
  tags: string[];
  url?: string;
  commerce?: ExtendedMetadata['commerce'];
  landing?: ExtendedMetadata['landing'];
  // Next.js metadata fields are optional in the class
  openGraph?: ExtendedMetadata['openGraph'];
  twitter?: ExtendedMetadata['twitter'];

  // Shared type mapping for consistent path/URL generation across all methods
  static readonly TYPE_PATHS: Record<string, string> = {
    'blog': 'blog',
    'course': 'learn/courses',
    'video': 'videos',
    'demo': 'demos',
    'newsletter': 'newsletter',
    'comparison': 'comparisons',
    'tool': 'tools'
  };

  constructor(metadata: ContentMetadata) {
    this.title = metadata.title;
    this.slug = metadata.slug;
    this.description = metadata.description;
    this.author = metadata.author;
    this.date = metadata.date;
    this.image = metadata.image;
    this.type = metadata.type;
    this.tags = metadata.tags || [];
    this.url = metadata.url;
    this.commerce = metadata.commerce;
    this.landing = metadata.landing;
    this.openGraph = metadata.openGraph;
    this.twitter = metadata.twitter;
  }

  abstract getUrl(): string;
  abstract getSourcePath(): string;

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
   * Standard method to load any content type from a slug
   * This ensures consistent behavior across all content types
   */
  static async load(type: string, slug: string): Promise<Content> {
    try {
      const basePath = Content.getBasePathForType(type);
      
      // Use dynamic import to directly access the exported metadata
      const mdxModule = await import(`@/app/${basePath}/${slug}/page.mdx`);
      
      if (!mdxModule.metadata) {
        console.error(`No metadata found in MDX for ${slug}`);
        throw new Error(`No metadata found for ${slug}`);
      }
      
      // Factory method to load the right type of content
      const { default: ContentType } = await import(`./types/${type}`);
      
      // Create content from the exported metadata
      return new ContentType({
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