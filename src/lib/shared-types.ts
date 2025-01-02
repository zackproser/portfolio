import { StaticImageData } from 'next/image'

export interface Article {
  title: string
  description: string
  author: string
  date: string
  type?: string
  image?: string
  status?: string
}

export interface PaidArticle extends Article {
  isPaid: boolean
  price?: number
  previewLength?: number
  paywallHeader?: string
  paywallBody?: string
  buttonText?: string
}

// Base article with slug, without paid properties
export interface BaseArticleWithSlug {
  slug: string
  title: string
  description: string
  author: string
  date: string
  image?: string | StaticImageData
  type?: string
}

// For blog posts that can be paid
export interface ArticleWithSlug extends PaidArticle {
  slug: string
}

// For demos, which don't need paid properties
export interface DemoArticle extends BaseArticleWithSlug {
  type: 'demo'
}

// For courses, which use Stripe Price IDs
export interface CourseContent {
  title: string
  description: string
  slug: string
  type: 'course'
  price_id: string
}

// Union type for purchasable content
export type Content = ArticleWithSlug | CourseContent;

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