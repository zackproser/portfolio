'use client'

export interface ProductReviewSchemaProps {
  product: {
    name: string
    description: string
    image: string
    url: string
    brand?: string
    category?: string
    offers?: {
      price?: string
      priceCurrency?: string
      availability?: string
      url?: string
    }
  }
  review: {
    author: string
    datePublished: string
    dateModified?: string
    reviewBody: string
    ratingValue: number // 1-5
    bestRating?: number
    worstRating?: number
  }
  faqs?: Array<{
    question: string
    answer: string
  }>
  affiliateDisclosure?: boolean
}

export default function ReviewSchema({
  product,
  review,
  faqs,
  affiliateDisclosure = true
}: ProductReviewSchemaProps) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "url": product.url,
    ...(product.brand && {
      "brand": {
        "@type": "Brand",
        "name": product.brand
      }
    }),
    ...(product.category && { "category": product.category }),
    ...(product.offers && {
      "offers": {
        "@type": "Offer",
        ...(product.offers.price && { "price": product.offers.price }),
        ...(product.offers.priceCurrency && { "priceCurrency": product.offers.priceCurrency }),
        ...(product.offers.availability && { "availability": `https://schema.org/${product.offers.availability}` }),
        ...(product.offers.url && { "url": product.offers.url })
      }
    }),
    "review": {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author,
        "url": "https://zackproser.com"
      },
      "datePublished": review.datePublished,
      ...(review.dateModified && { "dateModified": review.dateModified }),
      "reviewBody": review.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.ratingValue,
        "bestRating": review.bestRating || 5,
        "worstRating": review.worstRating || 1
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": review.ratingValue,
      "bestRating": review.bestRating || 5,
      "worstRating": review.worstRating || 1,
      "ratingCount": 1,
      "reviewCount": 1
    }
  }

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  // Article schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "headline": `${product.name} Review`,
    "author": {
      "@type": "Person",
      "name": review.author,
      "url": "https://zackproser.com"
    },
    "datePublished": review.datePublished,
    ...(review.dateModified && { "dateModified": review.dateModified }),
    "publisher": {
      "@type": "Person",
      "name": "Zachary Proser",
      "url": "https://zackproser.com"
    },
    "itemReviewed": {
      "@type": "Product",
      "name": product.name,
      "image": product.image
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.ratingValue,
      "bestRating": review.bestRating || 5
    },
    ...(affiliateDisclosure && {
      "description": `Honest review of ${product.name}. This post contains affiliate links.`
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema, null, 2)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema, null, 2)
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema, null, 2)
          }}
        />
      )}
    </>
  )
}

// Convenience component for comparison pages
export interface ComparisonSchemaProps {
  products: Array<{
    name: string
    description: string
    image: string
    url: string
  }>
  article: {
    headline: string
    description: string
    datePublished: string
    dateModified?: string
    author: string
  }
}

export function ComparisonSchema({ products, article }: ComparisonSchemaProps) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": article.headline,
    "description": article.description,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "url": product.url
      }
    }))
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "description": article.description,
    "datePublished": article.datePublished,
    ...(article.dateModified && { "dateModified": article.dateModified }),
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": "https://zackproser.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "Zachary Proser",
      "url": "https://zackproser.com"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema, null, 2)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema, null, 2)
        }}
      />
    </>
  )
}

// FAQ-only component for adding to existing pages
export interface FAQSchemaProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}

