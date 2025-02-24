import { StaticImageData } from 'next/image';
import { ExtendedMetadata } from '@/lib/shared-types';

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

export interface ContentMetadata {
  title: string;
  slug: string;
  description: string;
  author: string;
  date: string;
  image?: string | StaticImageData | { src: string };
  type: 'blog' | 'course' | 'video' | 'demo';
  tags?: string[];
}

// Define the interface for the abstract class methods
export interface ContentMethods {
  getUrl(): string;
  getSourcePath(): string;
}

// Combine the metadata and methods interfaces
export interface Content extends ContentMetadata, ContentMethods {}

export abstract class Content implements ContentMetadata {
  title: string;
  slug: string;
  description: string;
  author: string;
  date: string;
  image?: string | StaticImageData | { src: string };
  type: 'blog' | 'course' | 'video' | 'demo';
  tags: string[];

  constructor(metadata: ContentMetadata) {
    this.title = metadata.title;
    this.slug = metadata.slug;
    this.description = metadata.description;
    this.author = metadata.author;
    this.date = metadata.date;
    this.image = metadata.image;
    this.type = metadata.type;
    this.tags = metadata.tags || [];
  }

  abstract getUrl(): string;
  abstract getSourcePath(): string;

  static async load(type: string, slug: string): Promise<Content> {
    // Factory method to load the right type of content
    const { default: ContentType } = await import(`./types/${type}`);
    return ContentType.fromSlug(slug, type as 'blog' | 'course' | 'video');
  }

  static getWorkspacePath(): string {
    if (process.env.NODE_ENV === 'test') {
      return '/mock/workspace';
    }
    // In development or production, use the actual workspace path
    return process.env.WORKSPACE_PATH || process.cwd();
  }
} 