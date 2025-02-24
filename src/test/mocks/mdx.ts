import { ExtendedMetadata } from '@/lib/shared-types';
import { createTestMetadata } from '@/utils/createMetadata';

interface ContentEntry {
  metadata: ExtendedMetadata;
  content: string;
}

const contentRegistry = new Map<string, ContentEntry>();

export function registerMockMdx(path: string, metadata: ExtendedMetadata, content: string = '') {
  console.log('registerMockMdx input:', { path, metadata });
  
  // Store the metadata exactly as provided
  contentRegistry.set(path, {
    metadata,
    content
  });
  
  console.log('registerMockMdx processed metadata:', metadata);
}

export function clearMockMdx() {
  contentRegistry.clear();
}

// Helper to check if content exists
export function hasRegisteredContent(path: string): boolean {
  return contentRegistry.has(path);
}

// Get metadata for a specific path
export function getMetadataForPath(path: string): ExtendedMetadata | null {
  console.log('getMetadataForPath called with path:', path);
  const content = contentRegistry.get(path);
  console.log('getMetadataForPath found content:', content);
  return content?.metadata || null;
}

// Get mock implementation for a path
export function getMockImplementation(path: string) {
  console.log('getMockImplementation called with path:', path);
  const content = contentRegistry.get(path);
  console.log('getMockImplementation found content:', content);
  
  if (!content) {
    // Return default test metadata if no specific mock is registered
    const defaultMetadata = createTestMetadata({
      type: 'blog',
      slug: 'test-blog',
      description: 'Test Blog',
      author: 'Test Author',
      date: '2024-01-01',
      title: 'Test Blog',
      commerce: {
        isPaid: true,
        price: 29.99,
        stripe_price_id: 'price_123',
        previewLength: 3,
        paywallHeader: 'Buy Now',
        paywallBody: 'Get access to full content',
        buttonText: 'Purchase'
      },
      landing: {
        subtitle: 'Test Subtitle',
        features: [{ title: 'Feature 1', description: 'Description 1' }],
        testimonials: [{ name: 'Person 1', text: 'Great product!' }]
      },
      tags: ['test']
    });

    return {
      metadata: defaultMetadata,
      content: ''
    };
  }
  
  // Return the exact metadata without modification
  return content;
}

// Return metadata from the registry when the module is imported
export default function mockMdxModule() {
  console.log('mockMdxModule called');
  return {
    metadata: null,
    default: () => null
  };
} 