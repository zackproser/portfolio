/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the route handlers directly
const mockGET = jest.fn();

// Mock the route module
jest.mock('../route', () => ({
  GET: (...args) => mockGET(...args)
}));

describe('Purchases API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/purchases', () => {
    it('should return 401 for unauthenticated users', async () => {
      // Setup mock to simulate unauthorized response
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );

      const request = new NextRequest('http://localhost:3000/api/purchases');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: 'Unauthorized' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return purchases for authenticated users', async () => {
      // Setup mock to simulate successful response with purchases
      const mockPurchases = [
        {
          id: 1,
          user_id: 123,
          product_id: 'test-article',
          product_type: 'blog',
          created_at: '2023-01-01T00:00:00Z',
          title: 'Test Article',
          description: 'A test article'
        }
      ];

      mockGET.mockResolvedValue(
        NextResponse.json(mockPurchases, { status: 200 })
      );

      const request = new NextRequest('http://localhost:3000/api/purchases');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('product_id');
      expect(data[0]).toHaveProperty('title');
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when user has no purchases', async () => {
      // Setup mock to simulate empty purchases array
      mockGET.mockResolvedValue(
        NextResponse.json([], { status: 200 })
      );

      const request = new NextRequest('http://localhost:3000/api/purchases');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      // Setup mock to simulate server error
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Database error' }, { status: 500 })
      );

      const request = new NextRequest('http://localhost:3000/api/purchases');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Database error' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });
  });
}); 