import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`../app/collections/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.jsx$/, ''),
    type: 'collection',
    ...metadata,
  }
}

export async function getAllCollections(matchingSlugs?: string[]) {
  let articleFilenames = await glob('*/page.jsx', {
    cwd: './src/app/collections',
  });

  let articles = await Promise.all(articleFilenames.map(importArticle));

  // Filter collections to include only those whose slug is in matchingSlugs
  if (matchingSlugs && matchingSlugs.length > 0) {
    articles = articles.filter(article => matchingSlugs.includes(article.slug));
  }

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}
