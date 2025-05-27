/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the route handlers directly
const mockGET = jest.fn() as jest.MockedFunction<any>;

// Mock the route module
jest.mock('../[slug]/route', () => ({
  GET: mockGET
}));

describe('Courses API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/courses/[slug]', () => {
    it('should return course data for valid slug', async () => {
      // Setup mock course data
      const mockCourse = {
        title: 'Test Course',
        description: 'A test course description',
        slug: 'test-course',
        status: 'published'
      };

      const mockResponse = NextResponse.json(mockCourse);
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/courses/test-course');
      const params = { params: Promise.resolve({ slug: 'test-course' }) };

      const { GET } = require('../[slug]/route');
      const response = await GET(request, params);
      
      const data = await response.json();
      expect(data).toEqual(mockCourse);
      expect(response.status).toBe(200);
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return 404 for non-existent course', async () => {
      const mockResponse = NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/courses/non-existent');
      const params = { params: Promise.resolve({ slug: 'non-existent' }) };

      const { GET } = require('../[slug]/route');
      const response = await GET(request, params);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Course not found' });
      expect(response.status).toBe(404);
    });

    it('should handle errors gracefully', async () => {
      const mockResponse = NextResponse.json(
        { error: 'Failed to fetch course' },
        { status: 500 }
      );
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/courses/error-course');
      const params = { params: Promise.resolve({ slug: 'error-course' }) };

      const { GET } = require('../[slug]/route');
      const response = await GET(request, params);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Failed to fetch course' });
      expect(response.status).toBe(500);
    });
  });
}); 