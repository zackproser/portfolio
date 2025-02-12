import { Content, ContentMetadata } from '../base';
import path from 'path';
import glob from 'fast-glob';

interface ArticleMetadata extends ContentMetadata {
  commerce?: {
    isPaid: true;
    price: number;
    stripe_price_id?: string;
    previewLength?: number;
    paywallHeader?: string;
    paywallBody?: string;
    buttonText?: string;
  };
  landing?: {
    subtitle?: string;
    features?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
}

export class Article extends Content {
  commerce?: {
    isPaid: true;
    price: number;
    stripe_price_id?: string;
    previewLength?: number;
    paywallHeader?: string;
    paywallBody?: string;
    buttonText?: string;
  };

  landing?: {
    subtitle?: string;
    features?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };

  constructor(metadata: ArticleMetadata) {
    super(metadata);
    this.commerce = metadata.commerce;
    this.landing = metadata.landing;
  }

  getUrl(): string {
    return `/blog/${this.slug}`;
  }

  getSourcePath(): string {
    return path.join(Content.getWorkspacePath(), 'src/app/blog', this.slug, 'page.mdx');
  }

  static async fromSlug(slug: string): Promise<Article> {
    const { metadata } = await import(`@/app/blog/${slug}/page.mdx`);
    return new Article({
      ...metadata,
      slug,
      type: 'blog'
    });
  }

  static async getAllArticles(): Promise<Article[]> {
    const files = await glob('*/page.mdx', {
      cwd: path.join(Content.getWorkspacePath(), 'src/app/blog')
    });

    const articles = await Promise.all(
      files.map(async (file) => {
        const slug = path.dirname(file);
        return Article.fromSlug(slug);
      })
    );

    return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
  }
} 