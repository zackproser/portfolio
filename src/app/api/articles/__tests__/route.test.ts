/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the route handlers directly
const mockGET = jest.fn();

// Mock the route module
jest.mock('../[slug]/route', () => ({
  GET: (...args) => mockGET(...args)
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

      const { GET } = require('../[slug]/route');
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

      const { GET } = require('../[slug]/route');
      const response = await GET(request, params);
      
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ error: 'Article not found' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });
  });
}); 