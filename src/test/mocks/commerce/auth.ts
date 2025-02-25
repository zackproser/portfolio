/**
 * Auth mock utility for testing
 */

import { jest } from '@jest/globals';

/**
 * Mock for authenticated user
 */
export const mockAuthenticatedUser = (customUser = {}) => {
  const defaultUser = {
    id: 'user_123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const user = { ...defaultUser, ...customUser };

  // Mock the auth function
  jest.mock('../../../../auth', () => ({
    auth: jest.fn().mockResolvedValue({
      user: user
    })
  }));

  return user;
};

/**
 * Mock for unauthenticated user (auth returns null)
 */
export const mockUnauthenticatedUser = () => {
  // Mock the auth function to return null (unauthenticated)
  jest.mock('../../../../auth', () => ({
    auth: jest.fn().mockResolvedValue(null)
  }));
}; 