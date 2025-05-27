/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the route handlers directly
const mockPOST = jest.fn() as jest.MockedFunction<any>;
const mockGET = jest.fn() as jest.MockedFunction<any>;

// Mock the route module
jest.mock('../route', () => ({
  POST: mockPOST,
  GET: mockGET
}));

describe('Checkout Sessions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/checkout-sessions', () => {
    it('should return 401 for unauthorized request', async () => {
      const mockResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      mockPOST.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({})
      });

      const { POST } = require('../route');
      const response = await POST(request);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 400 for missing parameters', async () => {
      const mockResponse = NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
      mockPOST.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({})
      });

      const { POST } = require('../route');
      const response = await POST(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Missing required parameters' });
    });

    it('should return 400 for unavailable content', async () => {
      const mockResponse = NextResponse.json({ error: 'Content not available for purchase' }, { status: 400 });
      mockPOST.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({
          contentSlug: 'unavailable-content',
          contentType: 'blog'
        })
      });

      const { POST } = require('../route');
      const response = await POST(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Content not available for purchase' });
    });

    it('should create checkout session successfully', async () => {
      const mockResponse = NextResponse.json({
        url: 'https://checkout.stripe.com/test_session_id'
      }, { status: 200 });
      mockPOST.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({
          contentSlug: 'test-content',
          contentType: 'blog'
        })
      });

      const { POST } = require('../route');
      const response = await POST(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        url: 'https://checkout.stripe.com/test_session_id'
      });
    });
  });

  describe('GET /api/checkout-sessions', () => {
    it('should return 401 for unauthorized request', async () => {
      const mockResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 400 for missing session_id', async () => {
      const mockResponse = NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Missing session_id parameter' });
    });

    it('should return 400 for incomplete payment', async () => {
      const mockResponse = NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions?session_id=incomplete_session');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Payment not completed' });
    });

    it('should return session data for completed payment', async () => {
      const mockResponse = NextResponse.json({
        id: 'test_session_id',
        payment_status: 'paid',
        product: {
          id: 'test_product',
          name: 'Test Product'
        }
      }, { status: 200 });
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions?session_id=completed_session');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        id: 'test_session_id',
        payment_status: 'paid',
        product: {
          id: 'test_product',
          name: 'Test Product'
        }
      });
    });
  });
}); 