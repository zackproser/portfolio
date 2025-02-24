import { render, screen } from '@testing-library/react'
import { ProductLanding } from '../ProductLanding'
import { Blog } from '@/lib/shared-types'

// Mock the components used in ProductLanding
jest.mock('@/components/Author', () => ({
  Author: () => <div data-testid="mock-author">Author Component</div>
}))

jest.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Footer Component</div>
}))

jest.mock('@/components/FreeChapters', () => ({
  FreeChapters: () => <div data-testid="mock-free-chapters">Free Chapters Component</div>
}))

jest.mock('@/components/Hero', () => ({
  Hero: () => <div data-testid="mock-hero">Hero Component</div>
}))

jest.mock('@/components/Introduction', () => ({
  Introduction: () => <div data-testid="mock-introduction">Introduction Component</div>
}))

jest.mock('@/components/NavBar', () => ({
  NavBar: () => <div data-testid="mock-navbar">NavBar Component</div>
}))

jest.mock('@/components/Pricing', () => ({
  Pricing: () => <div data-testid="mock-pricing">Pricing Component</div>
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