import { ArticleWithSlug, PaidArticle } from './shared-types'
import glob from 'fast-glob'
import path from 'path'
import { Metadata } from 'next'
import { StaticImageData } from 'next/image'

export async function importArticle(
  articleFilename: string,
  rootPath: string = 'blog'
): Promise<ArticleWithSlug> {
  const importedData = await import(`@/app/${rootPath}/${articleFilename}`) as {
    metadata: Metadata & { 
      isPaid?: boolean; 
      price?: number; 
      previewLength?: number;
      date?: string;
      image?: string | { src: string } | StaticImageData;
      author?: string;
    }
  }

  const { metadata } = importedData;

  // Handle webpack-imported images
  let imageUrl: string | undefined;
  if (metadata.image) {
    if (typeof metadata.image === 'object' && 'src' in metadata.image) {
      imageUrl = metadata.image.src;
    } else if (typeof metadata.image === 'object' && 'default' in metadata.image) {
      imageUrl = (metadata.image as unknown as { default: { src: string } }).default.src;
    } else if (typeof metadata.image === 'string') {
      imageUrl = metadata.image.startsWith('/') ? metadata.image : `/images/${metadata.image}`;
    } else {
      imageUrl = (metadata.image as unknown as { src: string }).src;
    }
  }

  // Convert Next.js metadata to our Article type
  const normalizedMetadata: PaidArticle = {
    title: typeof metadata.title === 'string' ? metadata.title : 'Untitled',
    description: typeof metadata.description === 'string' ? metadata.description : '',
    author: metadata.author || 'Zachary Proser',
    date: metadata.date || new Date().toISOString().split('T')[0],
    image: imageUrl,
    // Commerce fields with defaults
    isPaid: metadata.isPaid || false,
    price: metadata.price,
    previewLength: metadata.previewLength
  };

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...normalizedMetadata,
  }
}

export async function importArticleMetadata(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  return importArticle(articleFilename);
}

export async function getAllArticles(matchingSlugs?: string[]) {
  // Get blog articles
  let blogFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'blog'),
  });

  // Get demo articles
  let demoFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'demos'),
  });

  // Map blog articles
  let blogArticles = await Promise.all(blogFilenames.map(filename => 
    importArticle(filename, 'blog')
  ));

  // Map demo articles
  let demoArticles = await Promise.all(demoFilenames.map(filename => 
    importArticle(filename, 'demos')
  ));

  let articles = [...blogArticles, ...demoArticles];

  // If we have specific slugs to match, filter by them
  if (matchingSlugs && matchingSlugs.length > 0) {
    articles = articles.filter(article => matchingSlugs.includes(article.slug));
  }

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}
