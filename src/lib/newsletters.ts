import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import { ArticleWithSlug } from '@/types/content'

export interface Newsletter {
  title: string
  description: string
  author: string
  date: string
  slug: string
  type: 'newsletter'
  content: string
}

async function importNewsletter(articleFilename: string): Promise<ArticleWithSlug | null> {
  const dir = path.dirname(articleFilename);
  const metadataJsonPath = path.join(process.cwd(), 'src/app/newsletter', dir, 'metadata.json');
  let metadata: any = undefined;
  let metadataJsonError: Error | undefined = undefined;

  // 1. Try metadata.json first
  if (fs.existsSync(metadataJsonPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metadataJsonPath, 'utf-8'));
      // Optionally log success
    } catch (err: any) {
      metadataJsonError = err;
      console.warn(`Failed to parse metadata.json for newsletter/${dir}: ${err.message}`);
    }
  }

  let mdxModule: any = undefined;
  // 2. Fallback to MDX export if metadata.json missing or malformed
  if (!metadata) {
    try {
      mdxModule = await import(`@/app/newsletter/${articleFilename}`);
      metadata = mdxModule.metadata;
      if (!metadata) {
        console.error(`No metadata found for newsletter/${dir} (neither metadata.json nor MDX export)`);
        return null;
      }
    } catch (err: any) {
      console.error(`Failed to import MDX for newsletter/${dir}: ${err.message}`);
      return null;
    }
  }

  // Always require a default export for the content component
  if (!mdxModule) {
    try {
      mdxModule = await import(`@/app/newsletter/${articleFilename}`);
    } catch (err: any) {
      console.error(`Failed to import MDX for newsletter/${dir}: ${err.message}`);
      return null;
    }
  }
  if (!mdxModule.default) {
    console.error(`No default export found in MDX for newsletter/${dir}`);
    return null;
  }

  return {
    ...metadata,
    type: 'newsletter',
    slug: path.basename(dir),
    landing: {
      subtitle: metadata.description,
      features: [],
      testimonials: []
    },
    commerce: {
      isPaid: false,
      price: 0
    }
  }
}

export async function getAllNewsletters(): Promise<ArticleWithSlug[]> {
  const files: string[] = await glob('**/page.mdx', {
    cwd: path.join(process.cwd(), 'src/app/newsletter')
  })

  const newsletters = await Promise.all(
    files.map(async (filename: string) => {
      return importNewsletter(filename)
    })
  )

  // Filter out any nulls (failed loads) and cast to ArticleWithSlug[]
  return (newsletters.filter(Boolean) as ArticleWithSlug[]).sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
