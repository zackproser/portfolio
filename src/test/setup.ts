import '@testing-library/jest-dom'

// Extend expect
import { expect } from '@jest/globals'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import { mockDynamicImport } from './mocks/mdx'
import { jest } from '@jest/globals'

declare global {
  namespace jest {
    interface Matchers<R = void> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}

// Polyfill setImmediate
if (!global.setImmediate) {
  const setImmediate = (callback: Function, ...args: any[]) => {
    return setTimeout(() => callback(...args), 0);
  };
  
  setImmediate.__promisify__ = function<T>(): Promise<T> {
    return new Promise((resolve) => {
      setImmediate(() => resolve());
    });
  };
  
  global.setImmediate = setImmediate as typeof global.setImmediate;
}

// Mock path.join to return predictable strings
jest.mock('path', () => ({
  join: (...args: string[]) => args.join('/'),
  __esModule: true,
}));

// Mock dynamic imports for MDX files
jest.mock('@/app/**/*.mdx', () => ({
  __esModule: true,
  metadata: null,
  default: async (path: string) => {
    const content = await mockDynamicImport(path);
    return {
      ...content,
      metadata: content.metadata,
      default: () => null
    };
  }
}), { virtual: true });

// Mock fast-glob
export const mockGlobImpl = jest.fn()
jest.mock('fast-glob', () => ({
  __esModule: true,
  default: (...args: any[]) => mockGlobImpl(...args),
  sync: (...args: any[]) => mockGlobImpl(...args),
}))

// Mock process.cwd()
jest.spyOn(process, 'cwd').mockReturnValue('/mock/workspace')

// Export test utilities
export * from './mocks/mdx'; 