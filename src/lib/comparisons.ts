import { ArticleWithSlug } from '@/types/content'
import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'

async function importComparison(comparisonFilename: string): Promise<ArticleWithSlug | null> {
  const dir = path.dirname(comparisonFilename);
  const metadataJsonPath = path.join(process.cwd(), 'src/app/comparisons', dir, 'metadata.json');
  let metadata: any = undefined;
  let metadataJsonError: Error | undefined = undefined;

  // 1. Try metadata.json first
  if (fs.existsSync(metadataJsonPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metadataJsonPath, 'utf-8'));
    } catch (err: any) {
      metadataJsonError = err;
      console.warn(`Failed to parse metadata.json for comparisons/${dir}: ${err.message}`);
    }
  }

  let mdxModule: any = undefined;
  // 2. Fallback to MDX export if metadata.json missing or malformed
  if (!metadata) {
    try {
      mdxModule = await import(`@/app/comparisons/${comparisonFilename}`);
      metadata = mdxModule.metadata;
      if (!metadata) {
        console.error(`No metadata found for comparisons/${dir} (neither metadata.json nor MDX export)`);
        return null;
      }
    } catch (err: any) {
      console.error(`Failed to import MDX for comparisons/${dir}: ${err.message}`);
      return null;
    }
  }

  // Always require a default export for the content component
  if (!mdxModule) {
    try {
      mdxModule = await import(`@/app/comparisons/${comparisonFilename}`);
    } catch (err: any) {
      console.error(`Failed to import MDX for comparisons/${dir}: ${err.message}`);
      return null;
    }
  }
  if (!mdxModule.default) {
    console.error(`No default export found in MDX for comparisons/${dir}`);
    return null;
  }

  return {
    ...metadata,
    type: 'comparison',
    slug: dir,
  }
}

export async function getAllComparisons(): Promise<ArticleWithSlug[]> {
  const files: string[] = await glob('**/page.mdx', {
    cwd: path.join(process.cwd(), 'src/app/comparisons')
  })

  const comparisons = await Promise.all(
    files.map((filename: string) => importComparison(filename))
  )

  // Filter out any nulls (failed loads)
  return (comparisons.filter(Boolean) as ArticleWithSlug[]).sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

export async function getComparisonsForProduct(productSlug: string): Promise<ArticleWithSlug[]> {
  const comparisons = await getAllComparisons()
  return comparisons.filter(comparison => 
    comparison.slug.includes(productSlug)
  )
}