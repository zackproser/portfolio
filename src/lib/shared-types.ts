export interface Article {
  title: string
  description: string
  author: string
  date: string
  type?: string
  image?: string
  status?: string
}

export interface ArticleWithSlug extends Article {
  slug: string
}

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