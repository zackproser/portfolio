import '@testing-library/jest-dom'

// Extend expect
import { expect } from '@jest/globals'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import { jest } from '@jest/globals'
import mockMdxModule, { getMockImplementation } from './mocks/mdx'

declare global {
  namespace jest {
    interface Matchers<R = void> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}

// Polyfill setImmediate
if (!global.setImmediate) {
  const customSetImmediate = (callback: Function, ...args: any[]) => {
    return setTimeout(() => callback(...args), 0);
  };
  
  // Add promisify without type issues
  Object.defineProperty(customSetImmediate, '__promisify__', {
    value: function<T = void>(): Promise<T> {
      return new Promise<T>((resolve) => {
        customSetImmediate(() => resolve({} as T));
      });
    }
  });
  
  // Cast to unknown first to avoid type issues
  global.setImmediate = customSetImmediate as unknown as typeof global.setImmediate;
}

// Mock path.join to return predictable strings
jest.mock('path', () => ({
  join: (...args: string[]) => args.join('/'),
  __esModule: true,
}));

// Mock glob to return paths we control
export const mockGlobImpl = jest.fn();
jest.mock('glob', () => ({
  glob: mockGlobImpl,
}));

// Mock MDX imports
jest.mock('@/content/**/*.mdx', () => {
  const mockCache = new Map<string, any>();
  let mockImpl: any = null;

  return new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop !== 'string') return undefined;
      
      // Handle special properties
      if (prop === '__esModule') return true;
      if (prop === 'then') return undefined;
      
      if (mockCache.has(prop)) {
        return mockCache.get(prop);
      }

      if (!mockImpl) {
        mockImpl = require('./mocks/mdx').getMockImplementation;
      }
      
      const result = mockImpl(prop);
      // Create a new object with just the necessary properties to prevent circular references
      const safeResult = {
        metadata: result.metadata ? { ...result.metadata } : null,
        content: result.content || '',
        default: () => null
      };
      mockCache.set(prop, safeResult);
      return safeResult;
    }
  });
}, { virtual: true });

// Mock process.cwd()
jest.spyOn(process, 'cwd').mockReturnValue('/mock/workspace')

// Export test utilities
export * from './mocks/mdx'; 