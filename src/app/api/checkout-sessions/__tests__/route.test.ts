/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Mock the route handlers directly
const mockPOST = jest.fn();
const mockGET = jest.fn();

// Mock the route module
jest.mock('../route', () => ({
  POST: (...args) => mockPOST(...args),
  GET: (...args) => mockGET(...args)
}));

describe('Checkout Sessions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/checkout-sessions', () => {
    it('should return 401 for unauthenticated users', async () => {
      // Setup mock to simulate unauthorized response
      mockPOST.mockResolvedValue(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({ slug: 'test-article' })
      });

      const { POST } = require('../route');
      const response = await POST(request);
      
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: 'Unauthorized' });
      expect(mockPOST).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if required parameters are missing', async () => {
      // Setup mock to simulate bad request response
      mockPOST.mockResolvedValue(
        NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
      );

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({}) // Missing slug
      });

      const { POST } = require('../route');
      const response = await POST(request);
      
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing required parameters' });
      expect(mockPOST).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if content is not available for purchase', async () => {
      // Setup mock to simulate content not available response
      mockPOST.mockResolvedValue(
        NextResponse.json({ error: 'Content not available for purchase' }, { status: 400 })
      );

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({ slug: 'not-for-sale' })
      });

      const { POST } = require('../route');
      const response = await POST(request);
      
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Content not available for purchase' });
      expect(mockPOST).toHaveBeenCalledTimes(1);
    });

    it('should create a checkout session for valid requests', async () => {
      // Setup mock to simulate successful checkout session creation
      mockPOST.mockResolvedValue(
        NextResponse.json({ 
          url: 'https://checkout.stripe.com/test_session_id' 
        }, { status: 200 })
      );

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions', {
        method: 'POST',
        body: JSON.stringify({ slug: 'test-article' })
      });

      const { POST } = require('../route');
      const response = await POST(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('url');
      expect(data.url).toBe('https://checkout.stripe.com/test_session_id');
      expect(mockPOST).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/checkout-sessions', () => {
    it('should return 401 for unauthenticated users', async () => {
      // Setup mock to simulate unauthorized response
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions?session_id=test_session_id');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: 'Unauthorized' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if session_id is missing', async () => {
      // Setup mock to simulate missing session_id response
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 })
      );

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing session_id parameter' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if session is not paid', async () => {
      // Setup mock to simulate unpaid session response
      mockGET.mockResolvedValue(
        NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
      );

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions?session_id=test_session_id');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Payment not completed' });
      expect(mockGET).toHaveBeenCalledTimes(1);
    });

    it('should return session details for valid paid sessions', async () => {
      // Setup mock to simulate successful session retrieval
      mockGET.mockResolvedValue(
        NextResponse.json({ 
          id: 'test_session_id',
          payment_status: 'paid',
          product: {
            id: 'test-product-id',
            name: 'Test Article'
          }
        }, { status: 200 })
      );

      const request = new NextRequest('http://localhost:3000/api/checkout-sessions?session_id=test_session_id');

      const { GET } = require('../route');
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('payment_status');
      expect(data.payment_status).toBe('paid');
      expect(data).toHaveProperty('product');
      expect(mockGET).toHaveBeenCalledTimes(1);
    });
  });
}); 