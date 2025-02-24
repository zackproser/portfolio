import { render, screen } from '@testing-library/react'
import { ProductLanding } from '../ProductLanding'
import { Blog } from '@/lib/shared-types'

// Create mock functions for child components
const mockHero = jest.fn()
const mockIntroduction = jest.fn()
const mockPricing = jest.fn()
const mockAuthor = jest.fn()

// Mock the components used in ProductLanding
jest.mock('@/components/Author', () => ({
  Author: (props: any) => {
    mockAuthor(props)
    return <div data-testid="mock-author">Author Component</div>
  }
}))

jest.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Footer Component</div>
}))

jest.mock('@/components/FreeChapters', () => ({
  FreeChapters: (props: any) => <div data-testid="mock-free-chapters">Free Chapters Component</div>
}))

jest.mock('@/components/Hero', () => ({
  Hero: (props: any) => {
    mockHero(props)
    return <div data-testid="mock-hero">Hero Component</div>
  }
}))

jest.mock('@/components/Introduction', () => ({
  Introduction: (props: any) => {
    mockIntroduction(props)
    return <div data-testid="mock-introduction">Introduction Component</div>
  }
}))

jest.mock('@/components/NavBar', () => ({
  NavBar: () => <div data-testid="mock-navbar">NavBar Component</div>
}))

jest.mock('@/components/Pricing', () => ({
  Pricing: (props: any) => {
    mockPricing(props)
    return <div data-testid="mock-pricing">Pricing Component</div>
  }
}))

jest.mock('@/components/TableOfContents', () => ({
  TableOfContents: () => <div data-testid="mock-toc">Table of Contents Component</div>
}))

jest.mock('@/components/CanvasPattern', () => ({
  CanvasPattern: () => <div data-testid="mock-canvas">Canvas Pattern</div>
}))

describe('ProductLanding', () => {
  const mockPaidContent: Blog = {
    type: 'blog',
    slug: 'test-blog',
    description: 'Test Blog Description',
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
    },
    landing: {
      subtitle: 'Test Subtitle',
      features: [
        {
          title: 'Feature 1',
          description: 'Feature 1 Description'
        }
      ],
      testimonials: [
        {
          content: 'Great product!',
          author: {
            name: 'John Doe',
            role: 'Developer'
          }
        }
      ]
    }
  }

  const mockFreeContent: Blog = {
    type: 'blog',
    slug: 'free-blog',
    description: 'Free Blog Description',
    author: 'Test Author',
    date: '2024-02-24'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render the product landing page for paid content', () => {
      render(<ProductLanding content={mockPaidContent} />)
      
      // Check that all components are rendered
      expect(screen.getByTestId('mock-canvas')).toBeInTheDocument()
      expect(screen.getByTestId('mock-hero')).toBeInTheDocument()
      expect(screen.getByTestId('mock-introduction')).toBeInTheDocument()
      expect(screen.getByTestId('mock-navbar')).toBeInTheDocument()
      expect(screen.getByTestId('mock-toc')).toBeInTheDocument()
      expect(screen.getByTestId('mock-free-chapters')).toBeInTheDocument()
      expect(screen.getByTestId('mock-pricing')).toBeInTheDocument()
      expect(screen.getByTestId('mock-author')).toBeInTheDocument()
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument()
    })

    it('should not render anything for free content', () => {
      const { container } = render(<ProductLanding content={mockFreeContent} />)
      expect(container.firstChild).toBeNull()
    })

    it('should not render anything when content is null', () => {
      // @ts-ignore - Testing null case
      const { container } = render(<ProductLanding content={null} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Props Passing', () => {
    it('should pass correct props to Hero component', () => {
      render(<ProductLanding content={mockPaidContent} />)
      
      expect(mockHero).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockPaidContent.description,
          description: mockPaidContent.description,
          testimonial: mockPaidContent.landing?.testimonials?.[0]
        })
      )
    })

    it('should pass correct props to Introduction component', () => {
      render(<ProductLanding content={mockPaidContent} />)
      
      expect(mockIntroduction).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockPaidContent.landing?.subtitle,
          description: mockPaidContent.description,
          features: mockPaidContent.landing?.features
        })
      )
    })

    it('should pass correct props to Pricing component', () => {
      render(<ProductLanding content={mockPaidContent} />)
      
      expect(mockPricing).toHaveBeenCalledWith(
        expect.objectContaining({
          price: mockPaidContent.commerce?.price,
          title: mockPaidContent.description,
          description: mockPaidContent.commerce?.paywallBody,
          checkoutUrl: `/checkout?product=${mockPaidContent.slug}&type=${mockPaidContent.type}`
        })
      )
    })

    it('should pass correct props to Author component', () => {
      render(<ProductLanding content={mockPaidContent} />)
      
      expect(mockAuthor).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockPaidContent.author,
          bio: expect.any(String)
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle missing landing data gracefully', () => {
      const contentWithoutLanding: Blog = {
        ...mockPaidContent,
        landing: undefined
      }
      
      const { container } = render(<ProductLanding content={contentWithoutLanding} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle missing commerce data gracefully', () => {
      const contentWithoutCommerce: Blog = {
        ...mockPaidContent,
        commerce: undefined
      }
      
      const { container } = render(<ProductLanding content={contentWithoutCommerce} />)
      expect(container.firstChild).toBeNull()
    })
  })
}) 