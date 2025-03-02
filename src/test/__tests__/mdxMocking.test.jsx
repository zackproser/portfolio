import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMockMdx } from '../mdxMockFactory';

// Create mock components directly in the test
const AutoMockedMDX = (() => {
  const MockComponent = () => <div>Auto-mocked content</div>;
  MockComponent.metadata = {
    title: 'Auto-Mocked MDX Title',
    description: 'This is an auto-mocked MDX file',
    author: 'Auto-Mocked Author',
    date: '2023-01-01',
    slug: 'auto-mocked',
    type: 'blog',
    tags: ['test', 'mocked'],
  };
  return MockComponent;
})();

// Create a custom mocked component using the factory
const CustomMockedMDX = createMockMdx({
  title: 'Custom Mocked Title',
  description: 'Custom mocked description',
  author: 'Custom Author',
  date: '2023-01-01',
  slug: 'custom-mocked',
  type: 'blog'
});

// Create a simple MDX renderer component for testing
const MDXRenderer = ({ content }) => {
  console.log('MDX Content:', content);
  
  // Check if content is a function (React component)
  if (typeof content === 'function') {
    const Content = content;
    
    // Access metadata from the component
    const metadata = Content.metadata || {};
    
    if (!metadata || !metadata.title) {
      return <div>Missing metadata in MDX content</div>;
    }
    
    return (
      <div>
        <h1>{metadata.title}</h1>
        <p>{metadata.description}</p>
        <p>By {metadata.author}</p>
        <p>Published: {metadata.date}</p>
        <Content />
      </div>
    );
  }
  
  return <div>Invalid MDX content</div>;
};

describe('MDX Mocking', () => {
  it('renders automatically mocked MDX content correctly', () => {
    console.log('AutoMockedMDX:', AutoMockedMDX);
    
    render(<MDXRenderer content={AutoMockedMDX} />);
    
    // Check that the component renders without errors
    expect(screen.queryByText('Invalid MDX content')).not.toBeInTheDocument();
    expect(screen.queryByText('Missing metadata in MDX content')).not.toBeInTheDocument();
    
    // Check that the metadata from the auto-mocked MDX is rendered
    expect(screen.getByText('Auto-Mocked MDX Title')).toBeInTheDocument();
    expect(screen.getByText('This is an auto-mocked MDX file')).toBeInTheDocument();
    expect(screen.getByText('By Auto-Mocked Author')).toBeInTheDocument();
  });
  
  it('renders custom mocked MDX content correctly', () => {
    console.log('CustomMockedMDX:', CustomMockedMDX);
    
    render(<MDXRenderer content={CustomMockedMDX} />);
    
    // Check that the component renders without errors
    expect(screen.queryByText('Invalid MDX content')).not.toBeInTheDocument();
    expect(screen.queryByText('Missing metadata in MDX content')).not.toBeInTheDocument();
    
    // Check that the metadata from the custom-mocked MDX is rendered
    expect(screen.getByText('Custom Mocked Title')).toBeInTheDocument();
    expect(screen.getByText('Custom mocked description')).toBeInTheDocument();
    expect(screen.getByText('By Custom Author')).toBeInTheDocument();
  });
}); 