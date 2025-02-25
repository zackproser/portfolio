import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPageClient from '../ChatPageClient';
import { createMockMdx } from '@/test/mdxMockFactory';
import React from 'react';

// Mock the useChat hook from the Vercel AI SDK
jest.mock('ai/react', () => ({
  useChat: () => ({
    messages: [
      { id: '1', role: 'user', content: 'What is RAG?' },
      { id: '2', role: 'assistant', content: 'RAG stands for Retrieval Augmented Generation. It is a technique that combines retrieval-based and generation-based approaches for AI systems.' }
    ],
    input: '',
    setInput: jest.fn(),
    handleSubmit: jest.fn(),
    handleInputChange: jest.fn(),
    isLoading: false,
    error: null
  })
}));

// Mock the track function from Vercel Analytics
jest.mock('@vercel/analytics', () => ({
  track: jest.fn()
}));

// Mock the RandomPortrait component
jest.mock('@/components/RandomPortrait', () => ({
  __esModule: true,
  default: () => <div data-testid="random-portrait">Mocked Portrait</div>
}));

// Mock the SearchForm component
jest.mock('@/components/SearchForm', () => ({
  __esModule: true,
  default: ({ onSearch, setIsLoading, suggestedSearches }) => (
    <div data-testid="search-form">
      <input 
        data-testid="search-input" 
        type="text" 
        placeholder="Ask a question"
        onChange={(e) => e.target.value}
      />
      <button 
        data-testid="search-button"
        onClick={() => {
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 100); // Simulate async operation
          onSearch('What is RAG?');
        }}
      >
        Search
      </button>
      <div data-testid="suggested-searches">
        {suggestedSearches.map((question, index) => (
          <button key={index} onClick={() => onSearch(question)}>
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}));

// Mock the BlogPostCard component
jest.mock('@/components/BlogPostCard', () => ({
  __esModule: true,
  BlogPostCard: ({ article }) => (
    <div data-testid={`blog-post-${article.slug}`}>
      <h3>{article.title}</h3>
      <p>{article.description}</p>
    </div>
  )
}));

// Mock the LoadingAnimation component
jest.mock('@/components/LoadingAnimation', () => ({
  __esModule: true,
  LoadingAnimation: () => <div data-testid="loading-animation">Loading...</div>
}));

// Mock the Container component
jest.mock('@/components/Container', () => ({
  __esModule: true,
  Container: ({ children }) => <div data-testid="container">{children}</div>
}));

// Mock the Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
}));

// Mock the blog post MDX files
jest.mock('@/app/blog/rag-pipeline-tutorial/page.mdx', () => 
  createMockMdx({
    title: 'Building a RAG Pipeline',
    description: 'Learn how to build a Retrieval Augmented Generation pipeline',
    slug: 'rag-pipeline-tutorial',
    type: 'blog',
    author: 'Zachary Proser',
    date: '2024-02-15'
  }),
  { virtual: true }
);

describe('ChatPageClient', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
    
    // Mock window.gtag
    Object.defineProperty(window, 'gtag', {
      writable: true,
      value: jest.fn()
    });

    // Mock location.reload
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() }
    });
  });

  it('renders the chat interface correctly', () => {
    render(<ChatPageClient />);
    
    // Check that the main components are rendered
    expect(screen.getByText('Chat with me')).toBeInTheDocument();
    expect(screen.getByTestId('random-portrait')).toBeInTheDocument();
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    
    // Check that the chat messages are displayed
    expect(screen.getByText(/You:/)).toBeInTheDocument();
    expect(screen.getByText(/What is RAG\?/)).toBeInTheDocument();
    expect(screen.getByText(/The Ghost of Zachary Proser's Writing:/)).toBeInTheDocument();
    expect(screen.getByText(/RAG stands for Retrieval Augmented Generation/)).toBeInTheDocument();
  });

  it('handles search form submission', async () => {
    render(<ChatPageClient />);
    
    // Click the search button
    fireEvent.click(screen.getByTestId('search-button'));
    
    // Check that loading state is triggered and then removed
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
    
    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('displays the clear chat button', () => {
    render(<ChatPageClient />);
    
    const clearButton = screen.getByText('Clear Chat');
    expect(clearButton).toBeInTheDocument();
    
    // Test the clear chat button click
    fireEvent.click(clearButton);
    expect(window.location.reload).toHaveBeenCalled();
  });
}); 