import { Content } from '@/lib/content/base';

interface MDXContent {
  metadata: Record<string, any>;
  content: string;
}

const mdxStore = new Map<string, MDXContent>();
let currentMDXPath: string | null = null;

export function registerMockMdx(path: string, metadata: Record<string, any>, content: string = '') {
  console.log('registerMockMdx input:', { path, metadata });
  
  // Process metadata
  const processedMetadata = {
    ...metadata,
    // Ensure required fields have defaults
    title: metadata.title || 'Untitled',
    description: metadata.description || '',
    author: metadata.author || 'Unknown',
    date: metadata.date || new Date().toISOString(),
    tags: metadata.tags || [],
    commerce: metadata.commerce,
    landing: metadata.landing
  };

  console.log('registerMockMdx processed metadata:', processedMetadata);

  // Normalize the path
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  mdxStore.set(normalizedPath, {
    metadata: processedMetadata,
    content
  });
}

export function clearMockMdx() {
  mdxStore.clear();
  currentMDXPath = null;
}

// Mock dynamic import for MDX files
export async function mockDynamicImport(path: string) {
  // Normalize the path to match the registered paths
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  console.log('mockDynamicImport called with path:', normalizedPath);
  
  const content = mdxStore.get(normalizedPath);
  if (!content) {
    throw new Error(`No content registered for path: ${path}`);
  }

  console.log('mockDynamicImport returning metadata:', content.metadata);

  // Return the metadata in the correct format that Next.js MDX loader would use
  return {
    metadata: content.metadata,
    default: () => null,
    __esModule: true
  };
}

// Get metadata for a specific path
export function getMetadataForPath(path: string) {
  const content = mdxStore.get(path);
  return content?.metadata || {};
}

// Helper to get current MDX path
export function getCurrentMDXPath() {
  return currentMDXPath;
}

// Create a proxy to always return fresh metadata
export const metadata = new Proxy({}, {
  get: (target, prop: string) => {
    const path = getCurrentMDXPath();
    if (path) {
      const metadata = getMetadataForPath(path);
      return metadata[prop];
    }
    return undefined;
  }
});

// Export a function to check if a path has registered content
export function hasRegisteredContent(path: string): boolean {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return mdxStore.has(normalizedPath);
}

export default () => null; 