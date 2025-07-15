import { ArticleWithSlug } from '@/types/content';
import { ProductContent } from '@/types';
import { StaticImageData } from 'next/image';

function getImageUrl(image: string | StaticImageData | { src: string } | undefined): string | undefined {
  if (!image) return undefined;
  if (typeof image === 'string') return image;
  return image.src;
}

export function generateProductFromArticle(article: ArticleWithSlug): ProductContent {
  if (!article.commerce?.isPaid) {
    throw new Error('Cannot generate product from non-purchasable article');
  }

  return {
    title: article.title,
    subtitle: article.description,
    description: article.description,
    heroImage: getImageUrl(article.image),
    type: 'article',
    slug: article.slug,
    isPaid: article.commerce.isPaid,
    previewLength: article.commerce.previewLength,
    features: [
      {
        title: 'Complete Article Access',
        description: 'Get full access to this in-depth article with all code examples and explanations'
      },
      {
        title: 'Source Code Included',
        description: 'Access all accompanying source code and examples'
      },
      {
        title: 'Future Updates',
        description: 'Receive all future updates and improvements to the article'
      }
    ],
    pricing: {
      price: article.commerce.price,
      currency: '$',
      features: [
        'Full article access',
        'Complete source code',
        'Code examples',
        'Future updates',
        'Community support'
      ]
    },
    callToAction: {
      text: 'Get Full Access',
      href: `/checkout?product=${article.slug}&type=blog`
    }
  };
} 