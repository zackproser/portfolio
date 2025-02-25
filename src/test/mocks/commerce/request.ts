/**
 * Request helper utility for testing API routes
 */

import { NextRequest } from 'next/server';

/**
 * Creates a NextRequest object for testing API routes
 */
export const createApiRequest = (options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
}) => {
  const {
    method = 'GET',
    url = 'http://localhost:3000',
    body,
    headers = {},
    searchParams = {}
  } = options;
  
  // Create URL with search params
  const urlWithParams = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    urlWithParams.searchParams.append(key, value);
  });
  
  // Create request init
  const requestInit: RequestInit = {
    method,
    headers: new Headers(headers)
  };
  
  // Add body if provided
  if (body) {
    requestInit.body = JSON.stringify(body);
  }
  
  return new NextRequest(urlWithParams, requestInit);
}; 