// Mock MDX content store
const mdxStore = new Map<string, { metadata: any }>();

// Helper to register mock MDX content
export function registerMockMdx(path: string, metadata: any) {
  mdxStore.set(path, { metadata });
}

// Clear all registered mock MDX content
export function clearMockMdx() {
  mdxStore.clear();
}

// Mock dynamic import for MDX files
export async function mockDynamicImport(path: string) {
  const content = mdxStore.get(path);
  if (!content) {
    throw new Error(`No mock content registered for path: ${path}`);
  }
  return content;
}

// Default export for direct MDX imports
export default function() {
  return {
    metadata: {},
    default: () => null
  };
} 