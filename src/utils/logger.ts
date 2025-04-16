/**
 * Logger utility for consistent logging across the application
 * Provides environment-aware logging that can be disabled during build
 */

// Flag to determine if we're in a Next.js build environment
// This will be true during `next build` and false during runtime
// Unfortunately Next.js doesn't provide a clear way to detect build time,
// so we'll use NODE_ENV and an environment variable to control it
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Check if we're running in development or if debug is explicitly enabled
const isDev = process.env.NODE_ENV === 'development';
const isDebugEnabled = {
  og: process.env.DEBUG_OG === 'true',
  all: process.env.DEBUG === 'true',
};

/**
 * Log levels for different types of messages
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Log categories to group related logs
 */
type LogCategory = 'og' | 'metadata' | 'api' | 'system';

/**
 * Centralized logger that respects environment settings
 */
export const logger = {
  /**
   * Log an info message
   */
  info: (message: string, ...args: any[]) => {
    if (shouldLog('info')) {
      console.log(message, ...args);
    }
  },

  /**
   * Log a debug message
   */
  debug: (message: string, ...args: any[]) => {
    if (shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },

  /**
   * Log a warning message - these are shown even in production
   */
  warn: (message: string, ...args: any[]) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  /**
   * Log an error message - these are always shown
   */
  error: (message: string, ...args: any[]) => {
    // Errors are always logged
    console.error(`[ERROR] ${message}`, ...args);
  },

  /**
   * Log a message for a specific category
   * Only logs if that category's debug is enabled
   */
  category: (category: LogCategory, message: string, ...args: any[]) => {
    if (shouldLogCategory(category)) {
      console.log(`[${category.toUpperCase()}] ${message}`, ...args);
    }
  },

  /**
   * Create a scoped logger for a specific category
   */
  forCategory: (category: LogCategory) => ({
    info: (message: string, ...args: any[]) => {
      if (shouldLogCategory(category) && shouldLog('info')) {
        console.log(`[${category.toUpperCase()}] ${message}`, ...args);
      }
    },
    debug: (message: string, ...args: any[]) => {
      if (shouldLogCategory(category) && shouldLog('debug')) {
        console.log(`[${category.toUpperCase()}] [DEBUG] ${message}`, ...args);
      }
    },
    warn: (message: string, ...args: any[]) => {
      if (shouldLogCategory(category) && shouldLog('warn')) {
        console.warn(`[${category.toUpperCase()}] [WARN] ${message}`, ...args);
      }
    },
    error: (message: string, ...args: any[]) => {
      // Errors are always logged
      console.error(`[${category.toUpperCase()}] [ERROR] ${message}`, ...args);
    }
  })
};

/**
 * Create a specialized OG logger
 */
export const ogLogger = logger.forCategory('og');

/**
 * Determine if a log message should be shown based on level and environment
 */
function shouldLog(level: LogLevel): boolean {
  // During build, only show errors by default
  if (isBuildTime && level !== 'error') {
    return isDebugEnabled.all; // Only show if explicitly enabled
  }

  // In development, show all logs
  if (isDev) {
    return true;
  }

  // In production, show warnings and errors by default
  return level === 'error' || level === 'warn' || isDebugEnabled.all;
}

/**
 * Determine if a category-specific log should be shown
 */
function shouldLogCategory(category: LogCategory): boolean {
  // During build, suppress most logs
  if (isBuildTime) {
    // Only show logs if explicitly enabled for that category
    return isDebugEnabled[category as keyof typeof isDebugEnabled] === true;
  }

  // In development, show all logs
  if (isDev) {
    return true;
  }

  // In production, only show if specifically enabled
  return isDebugEnabled[category as keyof typeof isDebugEnabled] === true || isDebugEnabled.all;
} 