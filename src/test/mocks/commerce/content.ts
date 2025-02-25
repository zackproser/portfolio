/**
 * Content mock utility for testing
 */

import { jest } from '@jest/globals';
import { Content } from '@/lib/shared-types';

/**
 * Creates mock content with configurable properties
 */
export const createMockContent = (customContent = {}) => {
  const defaultContent = {
    title: 'Test Content',
    description: 'Test description',
    slug: 'test-content',
    type: 'blog' as Content['type'],
    author: 'Test Author',
    date: '2023-01-01',
    commerce: {
      isPaid: true,
      price: 9.99,
      stripe_price_id: 'price_test123',
      paywallHeader: 'Get Access',
      paywallBody: 'Purchase to read the full content'
    }
  };

  return { ...defaultContent, ...customContent };
};

/**
 * Mocks the article metadata import function
 */
export const mockArticleMetadata = (content = {}) => {
  const mockContent = createMockContent(content);
  
  // Mock the importArticleMetadata function
  jest.mock('@/lib/articles', () => ({
    importArticleMetadata: jest.fn().mockResolvedValue(mockContent)
  }));
  
  return mockContent;
}; 