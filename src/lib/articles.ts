import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'

export async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`../app/blog/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...metadata,
  }
}

export async function importArticleMetadata(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  const { metadata } = await import(`../app/blog/${articleFilename}`) as {
    metadata: Article;
  };

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...metadata,
  };
}

// Extend getAllArticles to accept an optional array of slugs
export async function getAllArticles(matchingSlugs?: string[]) {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/blog',
  });

  let articles = await Promise.all(articleFilenames.map(importArticle));

  // Filter articles to include only those whose slug is in matchingSlugs
  if (matchingSlugs && matchingSlugs.length > 0) {
    articles = articles.filter(article => matchingSlugs.includes(article.slug));
  }

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}
