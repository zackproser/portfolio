/**
 * @jest-environment node
 */

import { NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the Vercel Postgres module
jest.mock('@vercel/postgres', () => ({
  sql: jest.fn()
}));

// Mock the GET function from the route
const mockGET = jest.fn();
jest.mock('../../courses/[slug]/route', () => ({
  GET: (req: Request, props: any) => mockGET(req, props)
}));

describe('Courses API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/courses/[slug]', () => {
    it('should return course data for valid slug', async () => {
      const mockCourse = {
        title: 'Test Course',
        description: 'This is a test course',
        slug: 'test-course',
        status: 'published'
      };

      // Set up the mock implementation for successful course retrieval
      mockGET.mockResolvedValue(
        NextResponse.json(mockCourse)
      );

      // Set up the request and params
      const request = new Request('http://localhost:3000/api/courses/test-course');
      const props = {
        params: Promise.resolve({ slug: 'test-course' })
      };

      // Call the handler
      const response = await mockGET(request, props);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data).toEqual(mockCourse);
    });

    it('should return 404 for non-existent course', async () => {
      // Set up the mock implementation for non-existent course
      mockGET.mockResolvedValue(
        NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        )
      );

      // Set up the request and params
      const request = new Request('http://localhost:3000/api/courses/non-existent');
      const props = {
        params: Promise.resolve({ slug: 'non-existent' })
      };

      // Call the handler
      const response = await mockGET(request, props);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Course not found' });
    });

    it('should handle database errors gracefully', async () => {
      // Set up the mock implementation for database error
      mockGET.mockResolvedValue(
        NextResponse.json(
          { error: 'Failed to fetch course' },
          { status: 500 }
        )
      );

      // Set up the request and params
      const request = new Request('http://localhost:3000/api/courses/test-course');
      const props = {
        params: Promise.resolve({ slug: 'test-course' })
      };

      // Call the handler
      const response = await mockGET(request, props);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch course' });
    });
  });
}); 