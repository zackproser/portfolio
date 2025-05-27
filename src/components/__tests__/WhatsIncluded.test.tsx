import { render, screen } from '@testing-library/react'
import { WhatsIncluded } from '../WhatsIncluded'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

describe('WhatsIncluded', () => {
  const mockItems = [
    {
      title: 'Interactive Jupyter Notebook',
      description: 'A complete, ready-to-run notebook that walks you through data processing.',
      image: '/images/test-notebook.webp',
      imageAlt: 'Jupyter Notebook interface'
    },
    {
      title: 'Next.js Application',
      description: 'Full source code for a modern web application.',
      image: '/images/test-app.webp',
      imageAlt: 'Next.js application'
    }
  ]

  it('renders nothing when no items provided', () => {
    const { container } = render(<WhatsIncluded items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders section title and subtitle', () => {
    render(<WhatsIncluded items={mockItems} />)
    
    expect(screen.getByText("What's Included")).toBeInTheDocument()
    expect(screen.getByText("Everything you need to build production-ready solutions")).toBeInTheDocument()
  })

  it('renders custom section title and subtitle', () => {
    render(
      <WhatsIncluded 
        items={mockItems} 
        sectionTitle="Custom Title"
        sectionSubtitle="Custom subtitle"
      />
    )
    
    expect(screen.getByText("Custom Title")).toBeInTheDocument()
    expect(screen.getByText("Custom subtitle")).toBeInTheDocument()
  })

  it('renders all items with correct content', () => {
    render(<WhatsIncluded items={mockItems} />)
    
    // Check first item
    expect(screen.getByText('Interactive Jupyter Notebook')).toBeInTheDocument()
    expect(screen.getByText('A complete, ready-to-run notebook that walks you through data processing.')).toBeInTheDocument()
    
    // Check second item
    expect(screen.getByText('Next.js Application')).toBeInTheDocument()
    expect(screen.getByText('Full source code for a modern web application.')).toBeInTheDocument()
  })

  it('renders images with correct alt text', () => {
    render(<WhatsIncluded items={mockItems} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    
    expect(screen.getByAltText('Jupyter Notebook interface')).toBeInTheDocument()
    expect(screen.getByAltText('Next.js application')).toBeInTheDocument()
  })

  it('uses title as alt text when imageAlt is not provided', () => {
    const itemsWithoutAlt = [
      {
        title: 'Test Item',
        description: 'Test description',
        image: '/images/test.webp'
      }
    ]
    
    render(<WhatsIncluded items={itemsWithoutAlt} />)
    
    expect(screen.getByAltText('Test Item')).toBeInTheDocument()
  })

  it('applies alternating layout classes correctly', () => {
    render(<WhatsIncluded items={mockItems} />)
    
    const itemContainers = screen.getAllByText(/Interactive Jupyter Notebook|Next.js Application/).map(
      el => el.closest('.flex')
    )
    
    // First item should have lg:flex-row
    expect(itemContainers[0]).toHaveClass('lg:flex-row')
    
    // Second item should have lg:flex-row-reverse  
    expect(itemContainers[1]).toHaveClass('lg:flex-row-reverse')
  })
}) 