export interface Article {
  title: string
  description: string
  author: string
  date: string
  type?: string
  image?: string
}

export interface ArticleWithSlug extends Article {
  slug: string
}
