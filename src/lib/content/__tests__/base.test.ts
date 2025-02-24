import { Content, ContentMetadata } from '../base'
import { jest } from '@jest/globals'

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
      static fromSlug = jest.fn().mockResolvedValue({
        slug: 'test-blog',
        description: 'Test Blog',
        author: 'Test Author',
        date: '2024-01-01',
        type: 'blog'
      })
    }
  }
})

describe('Content Base Class', () => {
  describe('Constructor', () => {
    it('should initialize with required metadata', () => {
      const metadata: ContentMetadata = {
        slug: 'test',
        description: 'Test Description',
        author: 'Test Author',
        date: '2024-02-24',
        type: 'blog'
      }

      const content = new TestContent(metadata)

      expect(content.slug).toBe('test')
      expect(content.description).toBe('Test Description')
      expect(content.author).toBe('Test Author')
      expect(content.date).toBe('2024-02-24')
      expect(content.type).toBe('blog')
      expect(content.tags).toEqual([])
    })

    it('should handle optional metadata fields', () => {
      const metadata: ContentMetadata = {
        slug: 'test',
        description: 'Test Description',
        author: 'Test Author',
        date: '2024-02-24',
        type: 'blog',
        image: '/test.jpg',
        tags: ['test', 'example']
      }

      const content = new TestContent(metadata)

      expect(content.image).toBe('/test.jpg')
      expect(content.tags).toEqual(['test', 'example'])
    })
  })

  describe('Static Methods', () => {
    it('should get workspace path', () => {
      const path = (TestContent as any).getWorkspacePath()
      expect(path).toBe(process.cwd())
    })

    it('should load content by type and slug', async () => {
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
      const content = new TestContent({
        slug: 'test',
        description: 'Test Description',
        author: 'Test Author',
        date: '2024-02-24',
        type: 'blog'
      })

      expect(content.getUrl()).toBe('/test/test')
    })

    it('should implement getSourcePath', () => {
      const content = new TestContent({
        slug: 'test',
        description: 'Test Description',
        author: 'Test Author',
        date: '2024-02-24',
        type: 'blog'
      })

      expect(content.getSourcePath()).toBe('test/test/page.mdx')
    })
  })
}) 