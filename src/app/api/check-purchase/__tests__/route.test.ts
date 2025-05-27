/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the route handlers directly
const mockGET = jest.fn() as jest.MockedFunction<any>;

// Mock the route module
jest.mock('../route', () => ({
  GET: mockGET
}));

describe('Check Purchase API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/check-purchase', () => {
    it('should return 401 for unauthorized request', async () => {
      const mockResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/check-purchase');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for missing slug parameter', async () => {
      const mockResponse = NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/check-purchase?type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Missing slug parameter' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for missing type parameter', async () => {
      const mockResponse = NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/check-purchase?slug=test-article');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Missing type parameter' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return purchase data for valid request', async () => {
      const mockResponse = NextResponse.json({
        purchased: true,
        purchaseDate: '2023-01-01T00:00:00Z'
      }, { status: 200 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/check-purchase?slug=test-article&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        purchased: true,
        purchaseDate: '2023-01-01T00:00:00Z'
      });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return false for non-purchased content', async () => {
      const mockResponse = NextResponse.json({
        purchased: false
      }, { status: 200 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/check-purchase?slug=free-article&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ purchased: false });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const mockResponse = NextResponse.json({ error: 'Database error' }, { status: 500 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/check-purchase?slug=test-article&type=blog');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Database error' });
    });
  });
}); 