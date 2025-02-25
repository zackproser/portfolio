/**
 * Stripe mock utility for testing
 */

import { jest } from '@jest/globals';

/**
 * Creates a mock Stripe instance with configurable behavior
 */
export const createMockStripe = (customConfig = {}) => {
  // Default mock implementation
  const defaultConfig = {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'cs_test_123',
          client_secret: 'cs_secret_test_123',
          payment_status: 'unpaid',
          url: 'https://checkout.stripe.com/test-session',
        }),
        retrieve: jest.fn().mockResolvedValue({
          id: 'cs_test_123',
          payment_status: 'paid',
          metadata: {
            userId: 'user_123',
            slug: 'test-article',
            type: 'blog'
          }
        }),
      }
    },
    // Add other Stripe objects/methods as needed
  };

  // Merge custom config with defaults
  const config = { ...defaultConfig };
  Object.keys(customConfig).forEach(key => {
    if (typeof customConfig[key] === 'object' && customConfig[key] !== null) {
      config[key] = { ...config[key], ...customConfig[key] };
    } else {
      config[key] = customConfig[key];
    }
  });

  return config;
};

/**
 * Sets up Stripe mocks for testing
 * @returns The mock Stripe instance for assertions
 */
export const mockStripe = (customConfig = {}) => {
  const stripeMock = createMockStripe(customConfig);
  
  // Mock the Stripe constructor
  jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => stripeMock);
  });
  
  return stripeMock;
}; 