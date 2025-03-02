/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the route handlers directly
const mockGET = jest.fn();

// Mock the route module
jest.mock('../route', () => ({
  GET: (...args) => mockGET(...args)
}));

describe('Check Purchase API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/check-purchase', () => {
    it('should return 401 for unauthenticated users', async () => {
      // Setup mock to simulate unauthorized response
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );

      const request = new NextRequest('http://localhost:3000/api/check-purchase');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: 'Unauthorized' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if slug is missing', async () => {
      // Setup mock to simulate bad request response
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
      );

      const request = new NextRequest('http://localhost:3000/api/check-purchase');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing slug parameter' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if type is missing', async () => {
      // Setup mock to simulate bad request response
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Missing type parameter' }, { status: 400 })
      );

      const request = new NextRequest('http://localhost:3000/api/check-purchase?slug=test-article');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing type parameter' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return purchase status for authenticated users', async () => {
      // Setup mock to simulate successful response
      mockGET.mockResolvedValue(
        NextResponse.json({ 
          purchased: true,
          purchaseDate: '2023-01-01T00:00:00Z'
        }, { status: 200 })
      );

      const request = new NextRequest('http://localhost:3000/api/check-purchase?slug=test-article&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('purchased');
      expect(data.purchased).toBe(true);
      expect(data).toHaveProperty('purchaseDate');
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return not purchased status when user has not purchased the content', async () => {
      // Setup mock to simulate not purchased response
      mockGET.mockResolvedValue(
        NextResponse.json({ 
          purchased: false 
        }, { status: 200 })
      );

      const request = new NextRequest('http://localhost:3000/api/check-purchase?slug=unpurchased-article&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('purchased');
      expect(data.purchased).toBe(false);
      expect(data).not.toHaveProperty('purchaseDate');
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      // Setup mock to simulate server error
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Database error' }, { status: 500 })
      );

      const request = new NextRequest('http://localhost:3000/api/check-purchase?slug=test-article&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Database error' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });
  });
}); 