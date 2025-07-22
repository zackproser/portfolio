import { ArticleWithSlug } from '@/types/content'
import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'

async function importTool(toolPath: string): Promise<ArticleWithSlug | null> {
  const dir = path.dirname(toolPath);
  const metadataJsonPath = path.join(process.cwd(), 'src/app/tools', dir, 'metadata.json');
  let metadata: any = undefined;
  let metadataJsonError: Error | undefined = undefined;

  // 1. Try metadata.json first
  if (fs.existsSync(metadataJsonPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metadataJsonPath, 'utf-8'));
    } catch (err: any) {
      metadataJsonError = err;
      console.warn(`Failed to parse metadata.json for tools/${dir}: ${err.message}`);
    }
  }

  let mdxModule: any = undefined;
  // 2. Fallback to MDX export if metadata.json missing or malformed
  if (!metadata) {
    try {
      mdxModule = await import(`@/app/tools/${toolPath}`);
      metadata = mdxModule.metadata;
      if (!metadata) {
        console.error(`No metadata found for tools/${dir} (neither metadata.json nor MDX export)`);
        return null;
      }
    } catch (err: any) {
      console.error(`Failed to import MDX for tools/${dir}: ${err.message}`);
      return null;
    }
  }

  // Always require a default export for the content component
  if (!mdxModule) {
    try {
      mdxModule = await import(`@/app/tools/${toolPath}`);
    } catch (err: any) {
      console.error(`Failed to import MDX for tools/${dir}: ${err.message}`);
      return null;
    }
  }
  if (!mdxModule.default) {
    console.error(`No default export found in MDX for tools/${dir}`);
    return null;
  }

  return {
    ...metadata,
    type: 'tool',
    slug: path.basename(dir),
  }
}

export async function getAllTools() {
  let toolFilenames: string[] = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'tools'),
  })

  let tools = await Promise.all(toolFilenames.map((filename: string) => importTool(filename)))

  // Filter out any nulls (failed loads)
  return (tools.filter(Boolean) as ArticleWithSlug[]).sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
