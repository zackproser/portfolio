/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the content-handlers functions
jest.mock('@/lib/content-handlers', () => ({
  getContentItemByDirectorySlug: jest.fn()
}));

// Import the mocked function
import { getContentItemByDirectorySlug } from '@/lib/content-handlers';

// Mock the route module
const mockGET = jest.fn() as jest.MockedFunction<any>;
jest.mock('../route', () => ({
  GET: mockGET
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

      const mockResponse = NextResponse.json(mockArticle, { status: 200 });
      mockGET.mockResolvedValue(mockResponse);

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
      const mockResponse = NextResponse.json({ error: 'Article not found' }, { status: 404 });
      mockGET.mockResolvedValue(mockResponse);

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
      const mockResponse = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      mockGET.mockResolvedValue(mockResponse);

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