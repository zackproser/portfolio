import { createMetadata } from '@/utils/createMetadata';

// Helper function to create test metadata with type safety
function createTestMetadata(params: Parameters<typeof createMetadata>[0]) {
  const metadata = createMetadata(params);
  return metadata;
}

describe('Metadata Creation', () => {
  it('creates metadata with required fields', () => {
    const metadata = createTestMetadata({
      title: 'Test Title',
      description: 'Test Description',
      slug: 'test-slug',
      date: '2023-01-01',
      type: 'blog',
    });

    expect(metadata.title).toBe('Test Title');
    expect(metadata.description).toBe('Test Description');
    expect(metadata.slug).toBe('test-slug');
    expect(metadata.date).toBe('2023-01-01');
    expect(metadata.type).toBe('blog');
  });

  it('creates metadata with optional fields', () => {
    const metadata = createTestMetadata({
      title: 'Test Title',
      description: 'Test Description',
      slug: 'test-slug',
      date: '2023-01-01',
      type: 'blog',
      image: '/images/test.jpg',
    });

    expect(metadata.title).toBe('Test Title');
    expect(metadata.image).toBeDefined();
    expect(metadata.image?.src).toBe('/images/test.jpg');
  });

  it('creates metadata with commerce fields', () => {
    const metadata = createTestMetadata({
      title: 'Test Course',
      description: 'Test Course Description',
      slug: 'test-course',
      date: '2023-01-01',
      type: 'course',
      commerce: {
        isPaid: true,
        price: 29.99,
        stripe_price_id: 'price_123',
        previewLength: 3,
        paywallHeader: 'Buy Now',
        paywallBody: 'Get access to full content',
        buttonText: 'Purchase',
      },
    });

    expect(metadata.title).toBe('Test Course');
    expect(metadata.commerce).toBeDefined();
    expect(metadata.commerce?.isPaid).toBe(true);
    expect(metadata.commerce?.price).toBe(29.99);
    expect(metadata.commerce?.stripe_price_id).toBe('price_123');
  });
});

// Simple utility function to extract slug from path for testing
function extractSlugFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
}

describe('Path Utilities', () => {
  it('extracts slugs from paths correctly', () => {
    expect(extractSlugFromPath('blog/test-post/page.mdx')).toBe('page.mdx');
    expect(extractSlugFromPath('learn/courses/test-course')).toBe('test-course');
    expect(extractSlugFromPath('videos/test-video')).toBe('test-video');
  });

  it('handles paths with special characters', () => {
    expect(extractSlugFromPath('blog/test-post-with-123')).toBe('test-post-with-123');
    expect(extractSlugFromPath('blog/test_post_underscores')).toBe('test_post_underscores');
    expect(extractSlugFromPath('blog/test.post.dots')).toBe('test.post.dots');
  });

  it('handles nested paths correctly', () => {
    expect(extractSlugFromPath('blog/category/subcategory/post')).toBe('post');
    expect(extractSlugFromPath('learn/courses/module/lesson')).toBe('lesson');
  });
});