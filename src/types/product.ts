export interface ProductFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface ProductTestimonial {
  content: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
}

export interface ProductPricing {
  price: number;
  currency: string;
  interval?: string;
  features: string[];
  stripe_price_id?: string;
}

export interface ProductContent {
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  features: ProductFeature[];
  testimonials?: ProductTestimonial[];
  pricing: ProductPricing;
  chapters?: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  callToAction: {
    text: string;
    href: string;
  };
  type: 'article' | 'course';
  slug: string;
  isPaid: boolean;
  previewLength?: number;
} 