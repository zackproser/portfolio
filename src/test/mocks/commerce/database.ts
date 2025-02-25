/**
 * Database mock utility for testing
 */

import { jest } from '@jest/globals';

/**
 * Mocks the Vercel Postgres SQL client
 */
export const mockDatabase = (customResults = {}) => {
  const defaultResults = {
    users: [
      { 
        id: 123, 
        email: 'test@example.com', 
        name: 'Test User' 
      }
    ],
    purchases: [
      {
        id: 'purchase_123',
        user_id: 123,
        product_id: 'prod_123',
        status: 'completed',
        created_at: '2023-01-01T00:00:00Z'
      }
    ]
  };

  const results = { ...defaultResults, ...customResults };

  // Mock the SQL function to return different results based on the query
  const mockSql = jest.fn().mockImplementation((query, ...params) => {
    // Simple query matching based on string content
    const queryStr = query.toString();
    
    if (queryStr.includes('FROM users')) {
      return { rows: results.users };
    }
    
    if (queryStr.includes('FROM purchases')) {
      return { rows: results.purchases };
    }
    
    // Default empty result
    return { rows: [] };
  });

  // Mock the Vercel Postgres module
  jest.mock('@vercel/postgres', () => ({
    sql: mockSql
  }));

  return mockSql;
}; 