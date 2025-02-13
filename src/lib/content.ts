import { Content, Blog, Demo, isPurchasable, getDefaultLanding } from './shared-types';
import path from 'path';
import glob from 'fast-glob';

// Load content from an MDX file
export async function loadMdxContent(contentPath: string): Promise<Content> {
  const { metadata } = await import(`@/app/${contentPath}`);
  
  // Get the content type based on the path
  const type = getContentType(contentPath);
  
  // Get the slug from the path
  const slug = contentPath
    .replace(/^(blog|learn\/courses|videos|demos)\//, '') // Remove root directory
    .replace(/(\/page)?\.mdx$/, ''); // Remove page.mdx
    
  // Normalize the metadata
  const content = {
    ...metadata,
    slug,
    type,
    // Ensure required fields
    title: metadata.title || 'Untitled',
    description: metadata.description || '',
    author: metadata.author || 'Anonymous',
    date: metadata.date || new Date().toISOString().split('T')[0],
    // Optional fields
    image: metadata.image,
    // Commerce fields if present
    ...(metadata.isPaid && {
      commerce: {
        isPaid: true,
        price: metadata.price || 0,
        stripe_price_id: metadata.stripe_price_id,
        previewLength: metadata.previewLength,
        paywallHeader: metadata.paywallHeader,
        paywallBody: metadata.paywallBody,
        buttonText: metadata.buttonText,
      }
    }),
    // Landing page fields if present
    ...(metadata.landing && {
      landing: metadata.landing
    })
  } as Blog | Demo;

  return content;
}

// Get the content type from a path
export function getContentType(path: string): Content['type'] {
  if (path.startsWith('blog/')) return 'blog';
  if (path.startsWith('learn/courses/')) return 'course';
  if (path.startsWith('videos/')) return 'video';
  if (path.startsWith('demos/')) return 'demo';
  throw new Error(`Unknown content type for path: ${path}`);
}

// Get the directory for a content type
export function getContentDir(type: Content['type']): string {
  return type === 'blog' ? 'blog' :
    type === 'course' ? 'learn/courses' :
    type === 'video' ? 'videos' : 'demos';
}

// Get all content of a specific type
export async function getContentByType(type: Content['type']): Promise<Content[]> {
  const rootDir = getContentDir(type);
  const contentPaths = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', rootDir)
  });
  
  const contents = await Promise.all(
    contentPaths.map(contentPath => 
      loadMdxContent(`${rootDir}/${contentPath}`)
    )
  );
  
  return contents.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}

// Get all purchasable content
export async function getAllPurchasableContent(): Promise<Blog[]> {
  const allContent = await Promise.all([
    getContentByType('blog'),
    getContentByType('course'),
    getContentByType('video'),
    getContentByType('demo')
  ]).then(results => results.flat());
  
  return allContent
    .filter((content): content is Blog => 
      content.type !== 'demo' && isPurchasable(content)
    );
}

// Get landing page content for a purchasable item
export function getLandingContent(article: Blog) {
  if (!isPurchasable(article)) {
    throw new Error('Cannot get landing page for non-purchasable content');
  }
  
  return {
    ...article,
    landing: article.landing || getDefaultLanding(article)
  };
}

// Get the URL for a piece of content
export function getContentUrl(content: Content): string {
  switch (content.type) {
    case 'blog':
      return `/blog/${content.slug}`;
    case 'course':
      return `/learn/courses/${content.slug}`;
    case 'video':
      return `/videos/${content.slug}`;
    case 'demo':
      return `/demos/${content.slug}`;
    default:
      throw new Error(`Unknown content type: ${content.type}`);
  }
} 