import { getContentType, getContentDir, getContentUrl } from '../content'
import { isPurchasable, Content, Blog } from '../shared-types'

// We'll test the loadMdxContent function separately since it requires more complex mocking
describe('Content System', () => {
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