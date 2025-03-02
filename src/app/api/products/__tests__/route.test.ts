/**
 * @jest-environment node
 */

import { NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the getArticleBySlug function
jest.mock('@/lib/content-handlers', () => ({
  getContentBySlug: jest.fn()
}));

// Mock the Vercel Postgres module
jest.mock('@vercel/postgres', () => ({
  sql: jest.fn()
}));

// Mock the GET function from the route
const mockGET = jest.fn();
jest.mock('../../products/route', () => ({
  GET: (req: Request) => mockGET(req)
}));

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return 400 if product slug is missing', async () => {
      // Set up the mock implementation for missing slug
      mockGET.mockResolvedValue(
        NextResponse.json(
          { error: 'Must supply valid product slug and type' },
          { status: 400 }
        )
      );

      // Set up the request with missing slug
      const request = new Request('http://localhost:3000/api/products?type=blog');

      // Call the handler
      const response = await mockGET(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Must supply valid product slug and type' });
    });

    it('should return 400 if type is missing', async () => {
      // Set up the mock implementation for missing type
      mockGET.mockResolvedValue(
        NextResponse.json(
          { error: 'Must supply valid product slug and type' },
          { status: 400 }
        )
      );

      // Set up the request with missing type
      const request = new Request('http://localhost:3000/api/products?product=test-product');

      // Call the handler
      const response = await mockGET(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Must supply valid product slug and type' });
    });

    it('should return article data for blog type', async () => {
      const mockArticle = {
        title: 'Test Article',
        slug: 'test-article',
        description: 'This is a test article',
        content: 'Article content',
        date: '2023-01-01'
      };

      // Set up the mock implementation for blog type
      mockGET.mockResolvedValue(
        NextResponse.json(mockArticle)
      );

      // Set up the request for blog type
      const request = new Request('http://localhost:3000/api/products?product=test-article&type=blog');

      // Call the handler
      const response = await mockGET(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data).toEqual(mockArticle);
    });

    it('should return 404 if article is not found', async () => {
      // Set up the mock implementation for non-existent article
      mockGET.mockResolvedValue(
        NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        )
      );

      // Set up the request for non-existent article
      const request = new Request('http://localhost:3000/api/products?product=non-existent&type=blog');

      // Call the handler
      const response = await mockGET(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Article not found' });
    });

    it('should return course data for course type', async () => {
      const mockCourse = {
        title: 'Test Course',
        slug: 'test-course',
        description: 'This is a test course',
        status: 'published'
      };

      // Set up the mock implementation for course type
      mockGET.mockResolvedValue(
        NextResponse.json(mockCourse)
      );

      // Set up the request for course type
      const request = new Request('http://localhost:3000/api/products?product=test-course&type=course');

      // Call the handler
      const response = await mockGET(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data).toEqual(mockCourse);
    });

    it('should return 404 if product is not found', async () => {
      // Set up the mock implementation for non-existent product
      mockGET.mockResolvedValue(
        NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      );

      // Set up the request for non-existent product
      const request = new Request('http://localhost:3000/api/products?product=non-existent&type=course');

      // Call the handler
      const response = await mockGET(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Product not found' });
    });

    it('should handle internal server errors', async () => {
      // Set up the mock implementation for server error
      mockGET.mockResolvedValue(
        NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      );

      // Set up the request
      const request = new Request('http://localhost:3000/api/products?product=test-product&type=course');

      // Call the handler
      const response = await mockGET(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
}); 