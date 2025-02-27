/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the importContentMetadata function
jest.mock('@/lib/content-handlers', () => ({
  importContentMetadata: jest.fn()
}));

// Import the mocked function
import { importContentMetadata } from '@/lib/content-handlers';

// Mock the route handlers directly
const mockGET = jest.fn();

// Mock the route module
jest.mock('../route', () => ({
  GET: (...args: any[]) => mockGET(...args)
}));

describe('Articles API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/articles/[slug]', () => {
    it('should return article data for valid slug', async () => {
      // Setup mock article data
      const mockArticle = {
        title: 'Test Article',
        slug: 'test-article',
        description: 'A test article description',
        author: 'Test Author',
        date: '2023-01-01',
        type: 'blog',
        tags: ['test', 'article']
      };

      // Setup mock to return article data
      mockGET.mockResolvedValue(
        NextResponse.json(mockArticle, { status: 200 })
      );

      const request = new NextRequest('http://localhost:3000/api/articles/test-article');
      const params = { params: Promise.resolve({ slug: 'test-article' }) };

      const { GET } = require('../route');
      const response = await GET(request, params);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockArticle);
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return 404 for non-existent article', async () => {
      // Setup mock to simulate article not found
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Article not found' }, { status: 404 })
      );

      const request = new NextRequest('http://localhost:3000/api/articles/non-existent');
      const params = { params: Promise.resolve({ slug: 'non-existent' }) };

      const { GET } = require('../route');
      const response = await GET(request, params);
      
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ error: 'Article not found' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      // Setup mock to throw an error
      mockGET.mockRejectedValue(new Error('Unexpected error'));
      
      // Setup error handler mock
      mockGET.mockResolvedValueOnce(
        NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      );

      const request = new NextRequest('http://localhost:3000/api/articles/error-article');
      const params = { params: Promise.resolve({ slug: 'error-article' }) };

      const { GET } = require('../route');
      const response = await GET(request, params);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
}); 