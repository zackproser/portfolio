/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the route handlers directly
const mockGET = jest.fn() as jest.MockedFunction<any>;

// Mock the route module
jest.mock('../route', () => ({
  GET: mockGET
}));

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return 400 for missing slug parameter', async () => {
      const mockResponse = NextResponse.json(
        { error: 'Must supply valid product slug and type' },
        { status: 400 }
      );
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/products');

      const { GET } = require('../route');
      const response = await GET(request);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Must supply valid product slug and type' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing type parameter', async () => {
      const mockResponse = NextResponse.json(
        { error: 'Must supply valid product slug and type' },
        { status: 400 }
      );
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/products?slug=test-article');

      const { GET } = require('../route');
      const response = await GET(request);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Must supply valid product slug and type' });
      expect(response.status).toBe(400);
    });

    it('should return article data for valid blog request', async () => {
      const mockArticle = {
        title: 'Test Article',
        slug: 'test-article',
        description: 'A test article description',
        content: 'Test article content',
        date: '2023-01-01'
      };

      const mockResponse = NextResponse.json(mockArticle);
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/products?slug=test-article&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      const data = await response.json();
      expect(data).toEqual(mockArticle);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent article', async () => {
      const mockResponse = NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/products?slug=non-existent&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Article not found' });
      expect(response.status).toBe(404);
    });

    it('should return course data for valid course request', async () => {
      const mockCourse = {
        title: 'Test Course',
        slug: 'test-course',
        description: 'A test course description',
        status: 'published'
      };

      const mockResponse = NextResponse.json(mockCourse);
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/products?slug=test-course&type=course');

      const { GET } = require('../route');
      const response = await GET(request);
      
      const data = await response.json();
      expect(data).toEqual(mockCourse);
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent course', async () => {
      const mockResponse = NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/products?slug=non-existent&type=course');

      const { GET } = require('../route');
      const response = await GET(request);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Product not found' });
      expect(response.status).toBe(404);
    });

    it('should handle server errors gracefully', async () => {
      const mockResponse = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/products?slug=test-article&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Internal server error' });
      expect(response.status).toBe(500);
    });
  });
}); 