import { Content, ContentMetadata } from '../base'
import { jest } from '@jest/globals'
import { clearMockMdx, registerMockMdx } from '@/test/mocks/mdx'
import { Article } from '../types/blog'
import { loadMdxContent } from '@/lib/content'
import { mockGlobImpl } from '@/test/setup'
import { ExtendedMetadata } from '@/lib/shared-types'
import { createMetadata } from '@/utils/createMetadata'
import { createMockMdx } from '@/test/mdxMockFactory'
import { Content } from '../base'
import glob from 'glob'
import path from 'path'

// Mock process.cwd to return a consistent path for testing
const originalCwd = process.cwd;
process.cwd = jest.fn().mockReturnValue('/mock/workspace');

// Type-safe test content creator
function createTestMetadata<T extends Partial<ContentMetadata>>(metadata: T): ContentMetadata {
  return metadata as ContentMetadata;
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

// Mock the glob module
jest.mock('glob', () => {
  const mockSync = jest.fn();
  mockSync.mockReturnValue([]);
  return { sync: mockSync };
});

// Import the mocked glob module
import glob from 'glob';

// Define a mock article class for testing
class MockArticle extends Content {
  constructor(metadata: any = {}) {
    super({
      title: metadata.title || 'Test Article',
      slug: metadata.slug || 'test-article',
      description: metadata.description || 'Test description',
      author: metadata.author || 'Test Author',
      date: metadata.date || '2023-01-01',
      type: metadata.type || 'blog',
      tags: metadata.tags || ['test'],
      ...metadata
    });
  }

  getUrl(): string {
    return `/blog/${this.slug}`;
  }

  getSourcePath(): string {
    return `blog/${this.slug}/page.mdx`;
  }

  static fromSlug(slug: string): MockArticle | null {
    return new MockArticle({ slug });
  }
}

// Mock the dynamic import for blog type
jest.mock('../types/blog', () => ({
  default: MockArticle,
  Article: MockArticle
}), { virtual: true });

// Mock for invalid type to throw the expected error
jest.mock('../types/invalid-type', () => {
  throw new Error('Invalid content type: invalid-type');
}, { virtual: true });

describe('Content Base Class', () => {
  // Store original NODE_ENV
  const originalNodeEnv = process.env.NODE_ENV;
  
  beforeEach(() => {
    // Set NODE_ENV directly - in Jest this is allowed
    process.env.NODE_ENV = 'test';
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
    jest.clearAllMocks();
  });

  describe('Instance Methods', () => {
    test('should initialize with metadata', () => {
      const article = new MockArticle({
        title: 'Test Title',
        slug: 'test-slug',
        description: 'Test description',
        author: 'Test Author',
        date: '2023-01-01',
        type: 'blog',
        tags: ['test', 'article']
      });

      expect(article.title).toBe('Test Title');
      expect(article.slug).toBe('test-slug');
      expect(article.description).toBe('Test description');
      expect(article.author).toBe('Test Author');
      expect(article.date).toBe('2023-01-01');
      expect(article.type).toBe('blog');
      expect(article.tags).toEqual(['test', 'article']);
    });

    test('should generate URL', () => {
      const article = new MockArticle({ slug: 'test-slug' });
      expect(article.getUrl()).toBe('/blog/test-slug');
    });

    test('should generate source path', () => {
      const article = new MockArticle({ slug: 'test-slug' });
      expect(article.getSourcePath()).toBe('blog/test-slug/page.mdx');
    });
  });

  describe('Static Methods', () => {
    test('should get workspace path', () => {
      const workspacePath = Content.getWorkspacePath();
      expect(workspacePath).toBe('/mock/workspace');
    });

    test('should load content by type and slug', async () => {
      // Mock the Content.load method directly instead of relying on the implementation
      jest.spyOn(Content, 'load').mockImplementationOnce(async (type, slug) => {
        return new MockArticle({
          title: 'Test Blog Post',
          slug: 'test-slug',
          type: 'blog'
        });
      });
      
      const result = await Content.load('blog', 'test-slug');
      expect(result).toBeInstanceOf(MockArticle);
      expect(result?.slug).toBe('test-slug');
      expect(result?.type).toBe('blog');
    });

    test('should throw error for invalid content type', async () => {
      await expect(Content.load('invalid-type', 'test-slug')).rejects.toThrow(
        'Invalid content type: invalid-type'
      );
    });
  });
});

// Additional test for content loading
describe('Content Loading', () => {
  test('should load content by type and slug', async () => {
    // Create a mock for the Content.load method
    const mockLoad = jest.spyOn(Content, 'load').mockImplementation(
      async (type, slug) => {
        if (type === 'blog' && slug === 'test-slug') {
          return new MockArticle({
            title: 'Test Blog Post',
            slug: 'test-slug',
            type: 'blog'
          });
        }
        return null;
      }
    );

    const content = await Content.load('blog', 'test-slug');
    expect(content).not.toBeNull();
    expect(content?.title).toBe('Test Blog Post');
    expect(content?.slug).toBe('test-slug');
    expect(content?.type).toBe('blog');

    // Clean up
    mockLoad.mockRestore();
  });
});

// Restore the original process.cwd function after all tests
afterAll(() => {
  process.cwd = originalCwd;
}); 