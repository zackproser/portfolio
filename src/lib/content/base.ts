import { StaticImageData } from 'next/image';

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

  protected static getWorkspacePath(): string {
    return process.cwd();
  }
} 