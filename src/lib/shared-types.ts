import { StaticImageData } from 'next/image'

// Base content type for anything on the site
export interface Content {
  slug: string
  title: string
  description: string
  author: string
  date: string
  image?: string | StaticImageData
  type: 'blog' | 'course' | 'video' | 'demo'
  price_id?: string
  tags?: string[]
}

// For blog posts and courses
export interface Blog extends Content {
  type: 'blog' | 'course' | 'video'
  // If the content is paid, these fields will be present
  commerce?: {
    isPaid: true
    price: number  // Required - used for both pre-defined and runtime pricing
    stripe_price_id?: string  // Optional - only used for pre-defined products
    previewLength?: number
    // Paywall customization
    paywallHeader?: string
    paywallBody?: string
    buttonText?: string
  }
  // Optional landing page customization
  landing?: {
    subtitle?: string
    features?: Array<{
      title: string
      description: string
      icon?: string
    }>
    chapters?: Array<{
      title: string
      items: Array<{
        title: string
        description: string
      }>
    }>
    testimonials?: Array<{
      content: string
      author: {
        name: string
        role: string
        avatar?: string
      }
    }>
    faqs?: Array<{
      question: string
      answer: string
    }>
  }
  metadata: {
    landingPage?: {
      headline?: string
      subheadline?: string
      features?: Array<{
        title: string
        description: string
        icon?: string
      }>
      testimonials?: Array<{
        quote: string
        author: string
        role?: string
      }>
      callToAction?: {
        text: string
        buttonText: string
      }
    }
  }
  title: string;
  date: string;
  author: string;
  price: number;
  tableOfContents: {
    [section: string]: {
      [title: string]: number;
    };
  };
  testimonials: Array<{
    content: string
    author: {
      name: string
      role: string
    }
  }>;
  features: string[];
  benefits: string[];
}

// For demos and other non-purchasable content
export interface Demo extends Content {
  type: 'demo'
  techStack?: string[]
  liveUrl?: string
  sourceUrl?: string
}

// Helper type for purchasable items
export type Purchasable = Blog & {
  commerce: NonNullable<Blog['commerce']>
}

// Type guard to check if content is purchasable
export function isPurchasable(content: Content): content is Purchasable {
  return content.type !== 'demo' && 'commerce' in content && (content as Blog).commerce?.isPaid === true;
}

// Helper to generate default landing page content
export function getDefaultLanding(blog: Blog): NonNullable<Blog['landing']> {
  const defaults = {
    subtitle: blog.description,
    features: blog.type === 'course' ? [
      {
        title: 'Complete Course Access',
        description: 'Get full access to all course materials and video content'
      },
      {
        title: 'Hands-on Projects',
        description: 'Learn through practical, real-world examples'
      },
      {
        title: 'Lifetime Access',
        description: 'Access all content and future updates forever'
      }
    ] : [
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
    ...blog.landing // Override defaults with any custom landing content
  };
}

// Database types (unchanged)
export interface Database {
  name: string;
  business_info: {
    funding_rounds: Array<{ date: string; amount: string; series: string }>;
    latest_valuation: string;
    employee_count: string;
    key_people: Array<{ name: string; position: string }>;
    [key: string]: any;
  };
  [category: string]: { [feature: string]: any } | any;
}

// Export both BlogWithSlug and ArticleWithSlug (for backward compatibility)
export type BlogWithSlug = Blog & { slug: string };
export type ArticleWithSlug = BlogWithSlug; // Alias for backward compatibility

export interface CourseContent extends Content {
  type: 'course';
  price_id: string;
  chapters?: Array<{
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  }>;
}