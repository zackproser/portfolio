// import 'server-only'; // Ensure this utility runs only on the server -- REMOVED to allow usage in shared components/client

/**
 * Logger utility for consistent logging across the application
 * Provides environment-aware logging that can be disabled during build or production
 */

// --- Configuration ---

// Flag to determine if we're in a Next.js build environment
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Check if we're running in development mode
const isDev = process.env.NODE_ENV === 'development';

// Define log levels (can be controlled globally)
const LOG_LEVELS = {
  SILENT: 0, // No logs (except errors forced)
  BASIC: 1, // Basic info, warnings, errors
  VERBOSE: 2 // All logs (info, debug, warnings, errors)
};

// Get global log level from environment variable (defaults to BASIC in prod, VERBOSE in dev)
const getGlobalLogLevel = () => {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (envLevel === 'verbose') return LOG_LEVELS.VERBOSE;
  if (envLevel === 'silent') return LOG_LEVELS.SILENT;
  // Default: verbose in dev, basic in prod/build
  return isDev ? LOG_LEVELS.VERBOSE : LOG_LEVELS.BASIC;
};
const globalLogLevel = getGlobalLogLevel();

// Define log categories and their corresponding debug environment variables
const DEBUG_CATEGORIES = {
  og: process.env.DEBUG_OG === 'true',
  metadata: process.env.DEBUG_METADATA === 'true',
  content: process.env.DEBUG_CONTENT === 'true',
  purchases: process.env.DEBUG_PURCHASES === 'true',
  stripe: process.env.DEBUG_STRIPE === 'true', // Example for Stripe webhooks
  email: process.env.DEBUG_EMAIL === 'true', // Example for Postmark/email
  db: process.env.DEBUG_DB === 'true',       // Example for database interactions
  api: process.env.DEBUG_API === 'true',       // General API routes
  general: process.env.DEBUG === 'true',     // General debug flag (fallback)
  all: process.env.DEBUG_ALL === 'true'      // Overrides everything
};
type LogCategory = keyof typeof DEBUG_CATEGORIES | 'system'; // Add 'system' for uncategorized logs

// Log levels for individual message types
type LogLevel = 'info' | 'warn' | 'error' | 'debug'; // 'debug' maps to 'verbose'

// --- Helper Functions ---

/**
 * Determine if a log message should be shown based on global level, category flags, and environment.
 */
function shouldLog(level: LogLevel, category: LogCategory | null = null): boolean {
  // 1. Global silent check
  if (globalLogLevel === LOG_LEVELS.SILENT && level !== 'error') {
    return false; // Only errors allowed if globally silent
  }

  // 2. Build time suppression (allow only errors unless DEBUG_ALL or specific category is true)
  if (isBuildTime && level !== 'error') {
    if (DEBUG_CATEGORIES.all) return true;
    if (category && category !== 'system' && DEBUG_CATEGORIES[category as keyof typeof DEBUG_CATEGORIES]) return true;
    return false; // Suppress non-errors during build by default
  }

  // 3. Production environment checks
  if (!isDev) {
    // Allow errors and warnings by default in production if global level is at least BASIC
    if (globalLogLevel >= LOG_LEVELS.BASIC && (level === 'error' || level === 'warn')) {
      return true;
    }
    // Allow specific category debug/info logs if explicitly enabled
    if (DEBUG_CATEGORIES.all) return true; // Allow if global override is set
    if (category && category !== 'system' && DEBUG_CATEGORIES[category as keyof typeof DEBUG_CATEGORIES]) {
       // Only allow info/debug if global level is VERBOSE or category is explicitly enabled
       return globalLogLevel >= LOG_LEVELS.VERBOSE || level === 'debug' || level === 'info';
    }
    // Otherwise, suppress info/debug in production by default
    return false;
  }

  // 4. Development environment checks (more permissive)
  if (isDev) {
    // Respect global log level
    if (level === 'info' && globalLogLevel < LOG_LEVELS.BASIC) return false;
    if (level === 'debug' && globalLogLevel < LOG_LEVELS.VERBOSE) return false;

    // Allow specific category debug/info logs if explicitly enabled, even if global level is lower
     if (category && category !== 'system' && DEBUG_CATEGORIES[category as keyof typeof DEBUG_CATEGORIES]) {
       return true; // Category flag enables its logs in dev
     }

     // Allow all if global debug is on
     if (DEBUG_CATEGORIES.all || DEBUG_CATEGORIES.general) {
        return true;
     }

     // Default: Show info/warn/error in dev if global level allows, debug only if verbose
     if (level === 'debug') return globalLogLevel >= LOG_LEVELS.VERBOSE;
     return globalLogLevel >= LOG_LEVELS.BASIC; // Basic includes info, warn, error
  }

  // Fallback (shouldn't be reached)
  return false;
}


// --- Logger Implementation ---

// Base console logging functions with prefixes
const logError = (prefix: string, message: string, ...args: any[]) => console.error(`${prefix} ${message}`, ...args);
const logWarn = (prefix: string, message: string, ...args: any[]) => console.warn(`${prefix} ${message}`, ...args);
const logInfo = (prefix: string, message: string, ...args: any[]) => console.log(`${prefix} ${message}`, ...args);
const logDebug = (prefix: string, message: string, ...args: any[]) => console.log(`${prefix} ${message}`, ...args); // Use console.log for debug too

/**
 * Centralized logger object.
 */
export const logger = {
  /** Log an info message (BASIC level). */
  info: (message: string, ...args: any[]) => {
    if (shouldLog('info', 'system')) { // Default to 'system' if no category specified
      logInfo('[INFO]', message, ...args);
    }
  },
  /** Log a debug message (VERBOSE level). */
  debug: (message: string, ...args: any[]) => {
    if (shouldLog('debug', 'system')) {
      logDebug('[DEBUG]', message, ...args);
    }
  },
  /** Log a warning message (BASIC level). */
  warn: (message: string, ...args: any[]) => {
    if (shouldLog('warn', 'system')) {
      logWarn('[WARN]', message, ...args);
    }
  },
  /** Log an error message (always shown unless SILENT). */
  error: (message: string, ...args: any[]) => {
    // Errors bypass most checks but still respect SILENT unless forced?
    // Let's always show errors unless explicitly SILENT globally.
    if (globalLogLevel !== LOG_LEVELS.SILENT) {
       logError('[ERROR]', message, ...args);
    }
    // Optionally: Always log errors regardless of level: logError('[ERROR]', message, ...args);
  },

  /** Create a scoped logger for a specific category. */
  forCategory: (category: LogCategory) => {
    const prefix = `[${category.toUpperCase()}]`;
    return {
      info: (message: string, ...args: any[]) => {
        if (shouldLog('info', category)) {
          logInfo(prefix, message, ...args);
        }
      },
      debug: (message: string, ...args: any[]) => {
        if (shouldLog('debug', category)) {
          logDebug(`${prefix}[DEBUG]`, message, ...args); // Add [DEBUG] for clarity
        }
      },
      warn: (message: string, ...args: any[]) => {
        if (shouldLog('warn', category)) {
          logWarn(`${prefix}[WARN]`, message, ...args); // Add [WARN] for clarity
        }
      },
      error: (message: string, ...args: any[]) => {
         // Errors generally bypass category checks but respect global SILENT
         if (globalLogLevel !== LOG_LEVELS.SILENT) {
            logError(`${prefix}[ERROR]`, message, ...args); // Add [ERROR] for clarity
         }
      },
    };
  },
};

// --- Pre-scoped Loggers ---

export const ogLogger = logger.forCategory('og');
export const metadataLogger = logger.forCategory('metadata');
export const contentLogger = logger.forCategory('content');
export const purchaseLogger = logger.forCategory('purchases');
export const stripeLogger = logger.forCategory('stripe');
export const emailLogger = logger.forCategory('email');
export const dbLogger = logger.forCategory('db');
export const apiLogger = logger.forCategory('api');
// Use logger.info/debug/warn/error directly for general/system logs 