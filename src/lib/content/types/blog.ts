import { Content, ContentMetadata } from '../base';
import path from 'path';
import glob from 'fast-glob';

interface ArticleMetadata extends ContentMetadata {
  commerce?: {
    isPaid: true;
    price: number;  // Required - used for both pre-defined and runtime pricing
    stripe_price_id?: string;  // Optional - only used for pre-defined products
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
  type: 'blog' | 'course' | 'video';
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
    const baseDir = {
      blog: 'blog',
      course: 'learn/courses',
      video: 'videos'
    }[this.type as 'blog' | 'course' | 'video'];

    if (!baseDir) {
      throw new Error(`Invalid content type: ${this.type}`);
    }

    return `/${baseDir}/${this.slug}`;
  }

  getSourcePath(): string {
    const baseDir = {
      blog: 'blog',
      course: 'learn/courses',
      video: 'videos'
    }[this.type as 'blog' | 'course' | 'video'];
    
    if (!baseDir) {
      throw new Error(`Invalid content type: ${this.type}`);
    }

    return path.join(Content.getWorkspacePath(), 'src/app', baseDir, this.slug, 'page.mdx');
  }

  // Commerce-specific methods
  async createCheckoutSession(userId: string): Promise<string> {
    if (!this.commerce?.isPaid) {
      throw new Error('Content is not purchasable');
    }
    
    // Handle both pre-defined and runtime pricing
    const priceData = this.commerce.stripe_price_id 
      ? { price: this.commerce.stripe_price_id }  // Use pre-defined price
      : {  // Create price at runtime
          unit_amount: this.commerce.price * 100, // Convert to cents
          currency: 'usd',
          product_data: {
            name: this.title,
            description: this.description
          }
        };
    
    // TODO: Implement actual Stripe checkout session creation
    // This will be implemented in the next phase
    throw new Error('Not implemented');
  }

  async verifyPurchase(userId: string): Promise<boolean> {
    if (!this.commerce?.isPaid) return true; // Free content is always accessible
    
    // TODO: Implement purchase verification
    // This will be implemented in the next phase
    throw new Error('Not implemented');
  }

  static async fromSlug(slug: string, type: 'blog' | 'course' | 'video' = 'blog'): Promise<Article> {
    const baseDir = {
      blog: 'blog',
      course: 'learn/courses',
      video: 'videos'
    }[type];

    if (!baseDir) {
      throw new Error(`Invalid content type: ${type}`);
    }

    const { metadata } = await import(`@/app/${baseDir}/${slug}/page.mdx`);
    return new Article({
      ...metadata,
      slug,
      type
    });
  }

  static async getAllArticles(type: 'blog' | 'course' | 'video' = 'blog'): Promise<Article[]> {
    const baseDir = {
      blog: 'blog',
      course: 'learn/courses',
      video: 'videos'
    }[type];

    if (!baseDir) {
      throw new Error(`Invalid content type: ${type}`);
    }

    const files = await glob('*/page.mdx', {
      cwd: path.join(Content.getWorkspacePath(), 'src/app', baseDir)
    });

    const articles = await Promise.all(
      files.map(async (file) => {
        const slug = path.dirname(file);
        return Article.fromSlug(slug, type);
      })
    );

    return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
  }
} 