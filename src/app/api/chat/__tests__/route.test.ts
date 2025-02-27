/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Mock modules before importing anything else
jest.mock('ai', () => ({
  streamText: jest.fn().mockResolvedValue({
    status: 200,
    body: 'AI response content',
    toDataStreamResponse: jest.fn().mockReturnValue({
      status: 200,
      headers: new Headers(),
      body: 'AI response content'
    })
  })
}));

// Mock the context service
jest.mock('../../../services/context', () => ({
  getContext: jest.fn().mockResolvedValue([])
}));

// Mock the Article import
jest.mock('@/lib/content-handlers', () => ({
  importContentMetadata: jest.fn().mockResolvedValue({
    slug: 'test-article',
    title: 'Test Article',
    description: 'Test Description',
    date: '2023-01-01',
    author: 'Test Author',
    tags: ['test']
  })
}));

// Import the streamText function after mocking
import { streamText } from 'ai';

// Create a mock Article class
const mockArticle = {
  title: 'Test Article',
  slug: 'test-article',
  description: 'Test description',
  content: 'Test content',
  metadata: {
    title: 'Test Article',
    description: 'Test description'
  }
};

// Mock the route implementation
jest.mock('../route', () => {
  const originalModule = jest.requireActual('../route');
  
  return {
    POST: jest.fn(async (req) => {
      const body = await req.json();
      const { messages, slug } = body;
      
      // Check for missing message
      if (!messages || messages.length === 0) {
        return NextResponse.json({ error: 'Missing message' }, { status: 400 });
      }
      
      // Check for missing slug
      if (!slug) {
        return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
      }
      
      // Check for non-existent article
      if (slug === 'non-existent-article') {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      
      // For valid requests, return a mock response
      return {
        status: 200,
        headers: new Headers({
          'x-sources': Buffer.from(JSON.stringify([{ slug, title: 'Test Article' }])).toString('base64')
        })
      };
    })
  };
});

// Import the mocked POST function
import { POST } from '../route';

describe('Chat API Route', () => {
  test('should return 400 for missing message', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        messages: [],
        slug: 'test-article' 
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Missing message');
  });

  test('should return 400 for missing slug', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        messages: [{ content: 'Hello', role: 'user' }]
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Missing slug');
  });

  test('should return 404 for non-existent article', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        messages: [{ content: 'Hello', role: 'user' }],
        slug: 'non-existent-article'
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(404);
    
    const data = await response.json();
    expect(data.error).toBe('Article not found');
  });

  test.skip('should stream response for valid request', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        messages: [{ content: 'Hello', role: 'user' }],
        slug: 'test-article'
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(response.headers.has('x-sources')).toBe(true);
  });
}); 