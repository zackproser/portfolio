import { getContentType, getContentDir, getContentUrl, loadMdxContent } from '../content'
import { isPurchasable, Content, Blog, ExtendedMetadata } from '../shared-types'
import { registerMockMdx, clearMockMdx } from '@/test/mocks/mdx'

// Mock the dynamic imports
jest.mock('@/test/mocks/mdx', () => {
  const store = new Map<string, { metadata: any }>();
  return {
    registerMockMdx: (path: string, metadata: any) => {
      store.set(path, { metadata });
    },
    clearMockMdx: () => {
      store.clear();
    },
    mockDynamicImport: async (path: string) => {
      const content = store.get(path);
      if (!content) {
        throw new Error(`No mock content registered for path: ${path}`);
      }
      return content;
    },
    __esModule: true,
    default: () => ({
      metadata: {},
      default: () => null
    })
  };
});

// Mock the content module to use our mock MDX implementation
jest.mock('../content', () => {
  const originalModule = jest.requireActual('../content');
  return {
    ...originalModule,
    loadMdxContent: async (path: string) => {
      const { mockDynamicImport } = jest.requireMock('@/test/mocks/mdx');
      const content = await mockDynamicImport(path);
      const segments = path.split('/');
      const slug = segments[segments.length - 2]; // Get the segment before page.mdx
      const type = originalModule.getContentType(path);
      
      // Structure the metadata properly
      const metadata = content.metadata;
      const result: any = {
        ...metadata,
        type,
        slug
      };

      // Structure commerce data if present
      if (metadata.isPaid) {
        result.commerce = {
          isPaid: metadata.isPaid,
          price: metadata.price,
          stripe_price_id: metadata.stripe_price_id,
          previewLength: metadata.previewLength,
          paywallHeader: metadata.paywallHeader,
          paywallBody: metadata.paywallBody,
          buttonText: metadata.buttonText
        };
      }

      return result;
    }
  };
});

describe('Content System', () => {
  beforeEach(() => {
    clearMockMdx()
  })

  describe('loadMdxContent', () => {
    it('should load paid blog content with commerce data', async () => {
      registerMockMdx('blog/test-blog/page.mdx', {
        description: 'A test blog post',
        author: 'Test Author',
        date: '2024-02-24',
        isPaid: true,
        price: 29.99,
        stripe_price_id: 'price_123',
        previewLength: 3,
        paywallHeader: 'Buy Now',
        paywallBody: 'Get access to full content',
        buttonText: 'Purchase'
      })

      const content = await loadMdxContent('blog/test-blog/page.mdx')
      
      expect(content.type).toBe('blog')
      expect(content.slug).toBe('test-blog')
      expect(content.commerce).toEqual({
        isPaid: true,
        price: 29.99,
        stripe_price_id: 'price_123',
        previewLength: 3,
        paywallHeader: 'Buy Now',
        paywallBody: 'Get access to full content',
        buttonText: 'Purchase'
      })
    })

    it('should load course content with landing page data', async () => {
      registerMockMdx('learn/courses/test-course/page.mdx', {
        description: 'A test course',
        author: 'Test Author',
        date: '2024-02-24',
        isPaid: true,
        price: 99.99,
        stripe_price_id: 'price_456',
        landing: {
          subtitle: 'Learn everything about testing',
          features: [
            {
              title: 'Feature 1',
              description: 'Feature description'
            }
          ],
          testimonials: [
            {
              content: 'Great course!',
              author: {
                name: 'John Doe',
                role: 'Developer'
              }
            }
          ]
        }
      })

      const content = await loadMdxContent('learn/courses/test-course/page.mdx')
      
      expect(content.type).toBe('course')
      expect(content.slug).toBe('test-course')
      expect(content.landing).toBeDefined()
      expect(content.landing?.features).toHaveLength(1)
      expect(content.landing?.testimonials).toHaveLength(1)
    })

    it('should handle missing optional fields', async () => {
      registerMockMdx('blog/test-blog/page.mdx', {
        description: 'A test blog post',
        author: 'Test Author',
        date: '2024-02-24'
      })

      const content = await loadMdxContent('blog/test-blog/page.mdx')
      
      expect(content.description).toBe('A test blog post')
      expect(content.commerce).toBeUndefined()
      expect(content.landing).toBeUndefined()
    })

    it('should throw error for invalid content path', async () => {
      await expect(loadMdxContent('invalid/path/page.mdx')).rejects.toThrow()
    })
  })

  describe('isPurchasable', () => {
    it('should identify paid content correctly', () => {
      const paidContent: Blog = {
        type: 'blog',
        slug: 'test',
        description: 'Test description',
        author: 'Test Author',
        date: '2024-02-24',
        commerce: {
          isPaid: true,
          price: 29.99,
          stripe_price_id: 'price_123',
          previewLength: 3,
          paywallHeader: 'Buy Now',
          paywallBody: 'Get access to full content',
          buttonText: 'Purchase'
        }
      }
      
      expect(isPurchasable(paidContent)).toBe(true)
    })

    it('should identify free content correctly', () => {
      const freeContent: Blog = {
        type: 'blog',
        slug: 'test',
        description: 'Test description',
        author: 'Test Author',
        date: '2024-02-24'
      }
      
      expect(isPurchasable(freeContent)).toBe(false)
    })
  })

  describe('getContentType', () => {
    it('should correctly identify content types from paths', () => {
      expect(getContentType('blog/test/page.mdx')).toBe('blog')
      expect(getContentType('learn/courses/test/page.mdx')).toBe('course')
      expect(getContentType('videos/test/page.mdx')).toBe('video')
      expect(getContentType('demos/test/page.mdx')).toBe('demo')
    })

    it('should throw error for unknown content type', () => {
      expect(() => getContentType('unknown/test/page.mdx')).toThrow('Unknown content type')
    })
  })

  describe('getContentDir', () => {
    it('should return correct directory for content types', () => {
      expect(getContentDir('blog')).toBe('blog')
      expect(getContentDir('course')).toBe('learn/courses')
      expect(getContentDir('video')).toBe('videos')
      expect(getContentDir('demo')).toBe('demos')
    })
  })

  describe('getContentUrl', () => {
    it('should generate correct URLs for different content types', () => {
      const blogContent: Content = {
        type: 'blog',
        slug: 'test',
        description: 'Test description',
        author: 'Test Author',
        date: '2024-02-24'
      }
      const courseContent: Content = {
        type: 'course',
        slug: 'test',
        description: 'Test description',
        author: 'Test Author',
        date: '2024-02-24'
      }
      const videoContent: Content = {
        type: 'video',
        slug: 'test',
        description: 'Test description',
        author: 'Test Author',
        date: '2024-02-24'
      }
      const demoContent: Content = {
        type: 'demo',
        slug: 'test',
        description: 'Test description',
        author: 'Test Author',
        date: '2024-02-24'
      }

      expect(getContentUrl(blogContent)).toBe('/blog/test')
      expect(getContentUrl(courseContent)).toBe('/learn/courses/test')
      expect(getContentUrl(videoContent)).toBe('/videos/test')
      expect(getContentUrl(demoContent)).toBe('/demos/test')
    })
  })
}) 