import { StaticImageData } from 'next/image';
import path from 'path';

export interface ContentMetadata {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image?: string | StaticImageData;
  status?: 'draft' | 'published' | 'archived';
  type: 'blog' | 'tutorial' | 'course' | 'demo';
  tags?: string[];
}

export abstract class Content {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image?: string | StaticImageData;
  status: 'draft' | 'published' | 'archived';
  type: 'blog' | 'tutorial' | 'course' | 'demo';
  tags: string[];

  constructor(metadata: ContentMetadata) {
    this.slug = metadata.slug;
    this.title = metadata.title;
    this.description = metadata.description;
    this.author = metadata.author;
    this.date = metadata.date;
    this.image = metadata.image;
    this.status = metadata.status || 'published';
    this.type = metadata.type;
    this.tags = metadata.tags || [];
  }

  abstract getUrl(): string;
  abstract getSourcePath(): string;

  static async load(type: string, slug: string): Promise<Content> {
    // Factory method to load the right type of content
    const { default: ContentType } = await import(`./types/${type}`);
    return ContentType.fromSlug(slug);
  }

  protected static getWorkspacePath(): string {
    return process.cwd();
  }
} 