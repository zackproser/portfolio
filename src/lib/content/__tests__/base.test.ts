import { Content, ContentMetadata } from '../base'
import { jest } from '@jest/globals'
import { clearMockMdx, registerMockMdx } from '@/test/mocks/mdx'
import { Article } from '../types/blog'
import { loadMdxContent } from '@/lib/content'
import { mockGlobImpl } from '@/test/setup'
import { ExtendedMetadata } from '@/lib/shared-types'
import { createMetadata } from '@/utils/createMetadata'

// Type-safe test content creator
function createTestMetadata<T extends Partial<ExtendedMetadata>>(metadata: T): ExtendedMetadata {
  return createMetadata(metadata);
}

// Create a concrete implementation for testing
class TestContent extends Content {
  getUrl(): string {
    return `/test/${this.slug}`
  }

  getSourcePath(): string {
    return `test/${this.slug}/page.mdx`
  }
}

// Mock the content type module
jest.mock('../types/blog', () => {
  return {
    __esModule: true,
    default: class MockArticle {
      title: string;
      slug: string;
      description: string;
      author: string;
      date: string;
      type: 'blog' | 'course' | 'video';
      commerce?: any;
      landing?: any;
      tags: string[];

      constructor(metadata: any) {
        this.title = metadata.title;
        this.slug = metadata.slug;
        this.description = metadata.description;
        this.author = metadata.author;
        this.date = metadata.date;
        this.type = metadata.type;
        this.commerce = metadata.commerce;
        this.landing = metadata.landing;
        this.tags = metadata.tags || [];
      }

      getUrl() {
        return `/blog/${this.slug}`;
      }

      static fromSlug = jest.fn().mockImplementation((slug) => {
        return new MockArticle({
          slug,
          description: 'Test Blog',
          author: 'Test Author',
          date: '2024-01-01',
          type: 'blog'
        });
      });
    }
  }
})

describe('Content Base Class', () => {
  describe('Instance Methods', () => {
    const testMetadata = createTestMetadata({
      title: 'Test Content',
      slug: 'test-content',
      description: 'Test description',
      author: 'Test Author',
      date: '2024-01-01',
      type: 'blog'
    });

    let content: TestContent

    beforeEach(() => {
      content = new TestContent(testMetadata)
    })

    it('should initialize with metadata', () => {
      expect(content.title).toBe(testMetadata.title)
      expect(content.slug).toBe(testMetadata.slug)
      expect(content.description).toBe(testMetadata.description)
      expect(content.author).toBe(testMetadata.author)
      expect(content.date).toBe(testMetadata.date)
      expect(content.type).toBe(testMetadata.type)
    })

    it('should generate URL', () => {
      expect(content.getUrl()).toBe('/test/test-content')
    })

    it('should generate source path', () => {
      expect(content.getSourcePath()).toBe('test/test-content/page.mdx')
    })
  })

  describe('Static Methods', () => {
    const originalEnv = process.env.NODE_ENV

    beforeEach(() => {
      jest.replaceProperty(process, 'env', { ...process.env, NODE_ENV: 'test' })
    })

    afterEach(() => {
      jest.replaceProperty(process, 'env', { ...process.env, NODE_ENV: originalEnv })
    })

    it('should get workspace path', () => {
      expect(Content.getWorkspacePath()).toBe('/mock/workspace')

      // Test production environment
      jest.replaceProperty(process, 'env', { ...process.env, NODE_ENV: 'production' })
      expect(Content.getWorkspacePath()).toBe(process.cwd())
    })

    it.skip('should load content by type and slug', async () => {
      const content = await Content.load('blog', 'test-blog')
      expect(content).toEqual({
        slug: 'test-blog',
        description: 'Test Blog',
        author: 'Test Author',
        date: '2024-01-01',
        type: 'blog'
      })
    })

    it('should throw error for invalid content type', async () => {
      await expect(Content.load('invalid', 'test')).rejects.toThrow()
    })
  })

  describe('Abstract Methods', () => {
    it('should implement getUrl', () => {
      const content = new TestContent(createTestMetadata({
        title: 'Test Content',
        slug: 'test',
        description: 'Test Description',
        author: 'Test Author',
        date: '2024-02-24',
        type: 'blog'
      }));

      expect(content.getUrl()).toBe('/test/test')
    })

    it('should implement getSourcePath', () => {
      const content = new TestContent(createTestMetadata({
        title: 'Test Content',
        slug: 'test',
        description: 'Test Description',
        author: 'Test Author',
        date: '2024-02-24',
        type: 'blog'
      }));

      expect(content.getSourcePath()).toBe('test/test/page.mdx')
    })
  })
})

describe('Content Loading', () => {
  beforeEach(() => {
    clearMockMdx();
    mockGlobImpl.mockReset();
    mockGlobImpl.mockImplementation((pattern) => {
      if (pattern === '*/page.mdx') {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });
  });

  it.skip('loads paid blog content with commerce data', async () => {
    mockGlobImpl.mockImplementation((pattern) => {
      if (pattern === '*/page.mdx') {
        return Promise.resolve(['blog/test/page.mdx']);
      }
      return Promise.resolve([]);
    });

    const mockContent = createTestMetadata({
      title: 'Test Blog Post',
      description: 'A test blog post',
      author: 'Test Author',
      date: '2024-01-01',
      type: 'blog',
      slug: 'test',
      commerce: {
        isPaid: true,
        price: 10,
        stripe_price_id: 'price_test123',
        paywallHeader: 'Get Access',
        paywallBody: 'Purchase to read the full post'
      }
    });

    registerMockMdx('blog/test/page.mdx', mockContent);
    const content = await loadMdxContent('blog/test/page.mdx');

    expect(content).toBeInstanceOf(Article);
    expect(content).toMatchObject({
      title: mockContent.title,
      description: mockContent.description,
      author: mockContent.author,
      date: mockContent.date,
      commerce: mockContent.commerce,
      slug: 'test',
      type: 'blog'
    });
    expect(content.getUrl()).toBe('/blog/test');
  });

  // ... existing code with other skipped tests ...
}) 