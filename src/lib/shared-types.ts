import { StaticImageData } from 'next/image'
import { Metadata } from 'next'

// Database interface for vector database comparisons
export interface Database {
  name: string;
  logoId: string;
  description: string;
  deployment?: {
    local?: boolean;
    cloud?: boolean;
    on_premises?: boolean;
  };
  scalability?: {
    horizontal?: boolean;
    vertical?: boolean;
    distributed?: boolean;
  };
  data_management?: {
    import?: boolean;
    update_deletion?: boolean;
    backup_restore?: boolean;
  };
  vector_similarity_search?: {
    distance_metrics?: string[];
    ann_algorithms?: string[];
    filtering?: boolean;
    post_processing?: boolean;
  };
  integration_api?: {
    sdks?: string[];
    rest_api?: boolean;
    graphql_api?: boolean;
    grpc_api?: boolean;
  };
  security?: {
    authentication?: boolean;
    encryption?: boolean;
    access_control?: boolean;
  };
  community_ecosystem?: {
    open_source?: boolean;
    community_support?: boolean;
    integration_frameworks?: string[];
  };
  pricing?: {
    free_tier?: boolean;
    pay_as_you_go?: boolean;
    enterprise_plans?: boolean;
  };
  additional_features?: {
    metadata_support?: boolean;
    batch_processing?: boolean;
    monitoring_logging?: boolean;
  };
  specific_details?: {
    unique_feature?: string;
    performance_metric?: string;
  };
  business_info: {
    company_name?: string;
    founded?: number;
    headquarters?: string;
    total_funding?: string;
    latest_valuation: string;
    funding_rounds: Array<{ date: string; amount: string; series: string }>;
    key_people: Array<{ name: string; position: string }>;
    employee_count: string;
    [key: string]: any;
  };
  [category: string]: { [feature: string]: any } | any;
}

// Base metadata interface that extends Next.js Metadata
export interface ExtendedMetadata extends Metadata {
  title: string
  author: string
  date: string
  description: string
  image?: string | StaticImageData | { src: string }
  type: 'blog' | 'course' | 'video' | 'demo'
  slug: string
  tags?: string[]
  _id?: string  // Internal unique identifier to prevent duplicate key issues
  commerce?: {
    isPaid: boolean
    price: number
    stripe_price_id?: string
    previewLength?: number
    previewElements?: number
    paywallHeader?: string
    paywallBody?: string
    buttonText?: string
    miniPaywallTitle?: string
    miniPaywallDescription?: string
    paywallImage?: string | StaticImageData
    paywallImageAlt?: string
  }
  landing?: {
    subtitle?: string
    features?: Array<{
      title: string
      description: string
      icon?: string
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
}

// Base content type for anything on the site
export interface Content extends ExtendedMetadata {
  tags?: string[]
}

// For blog posts and courses
export interface Blog extends Content {
  type: 'blog' | 'course' | 'video' | 'demo'
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

// Type guard to check if content is purchasable
export function isPurchasable(content: Content): content is Purchasable {
  return content.type !== 'demo' && 'commerce' in content && (content as any).commerce?.isPaid === true;
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
    ...blog.landing
  };
}

// Export both BlogWithSlug and ArticleWithSlug (for backward compatibility)
export type BlogWithSlug = Blog;
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