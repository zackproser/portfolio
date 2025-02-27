import { Content, ContentMetadata } from '../base';
import path from 'path';
import glob from 'fast-glob';

interface ArticleMetadata extends ContentMetadata {
  author?: string;
  date?: string;
  title?: string;
  description?: string;
  image?: any;
  slug?: string;
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
    // Ensure all required fields are present before passing to super
    const processedMetadata = {
      title: metadata.title || metadata.description || 'Untitled',
      slug: metadata.slug || 'untitled-article',
      description: metadata.description || '',
      author: metadata.author || 'Unknown',
      date: metadata.date || new Date().toISOString(),
      image: typeof metadata.image === 'string' ? { src: metadata.image } : metadata.image,
      type: metadata.type || 'blog',
      tags: metadata.tags || []
    };

    super(processedMetadata);
    this.commerce = metadata.commerce;
    this.landing = metadata.landing;
  }

  getUrl(): string {
    return Content.getUrlForContent(this.type, this.slug);
  }

  getSourcePath(): string {
    return Content.getSourcePathForContent(this.type, this.slug);
  }

  toJSON() {
    return {
      title: this.title,
      slug: this.slug,
      description: this.description,
      author: this.author,
      date: this.date,
      image: this.image,
      type: this.type,
      tags: this.tags,
      commerce: this.commerce,
      landing: this.landing,
      url: this.getUrl()
    };
  }

  // Commerce-specific methods
  async createCheckoutSession(userId: string): Promise<string> {
    if (!this.commerce?.isPaid) {
      throw new Error('Content is not purchasable');
    }
    
    // Handle both pre-defined and runtime pricing
    const priceData = this.commerce.stripe_price_id 
      ? { price: this.commerce.stripe_price_id }
      : {
          unit_amount: this.commerce.price * 100,
          currency: 'usd',
          product_data: {
            name: this.title,
            description: this.description
          }
        };
    
    // TODO: Implement actual Stripe checkout session creation
    throw new Error('Not implemented');
  }

  async verifyPurchase(userId: string): Promise<boolean> {
    if (!this.commerce?.isPaid) return true;
    
    // TODO: Implement purchase verification
    throw new Error('Not implemented');
  }

  /**
   * Load an article from a slug
   * Uses Next.js dynamic import to get the metadata directly from the MDX file
   */
  static async fromSlug(slug: string, type: 'blog' | 'course' | 'video' = 'blog'): Promise<Article | null> {
    try {
      const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
      const basePath = Content.getBasePathForType(type);
      
      // Use dynamic import to directly access the exported metadata
      const mdxModule = await import(`@/app/${basePath}/${normalizedSlug}/page.mdx`);
      
      if (!mdxModule.metadata) {
        console.error(`No metadata found in MDX for ${slug}`);
        return null;
      }
      
      // Create article from the exported metadata
      return new Article({
        ...mdxModule.metadata,
        slug: normalizedSlug,
        type
      });
    } catch (error) {
      console.error(`Error loading article ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get all articles of a specific type
   * Uses glob to find MDX files and loads each one using fromSlug
   */
  static async getAllArticles(type: 'blog' | 'course' | 'video' = 'blog'): Promise<Article[]> {
    try {
      const basePath = Content.getBasePathForType(type);
      const contentDir = path.join(process.cwd(), 'src/app', basePath);
      
      // Find all MDX files
      const files = await glob('*/page.mdx', { cwd: contentDir });
      
      // Load each article
      const articles = await Promise.all(
        files.map(async (file) => {
          const slug = path.dirname(file);
          return await Article.fromSlug(slug, type);
        })
      );
      
      // Filter out nulls and sort by date
      const validArticles = articles.filter((article): article is Article => article !== null);
      return validArticles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
    } catch (error) {
      console.error(`Error getting all articles for ${type}:`, error);
      return [];
    }
  }
} 