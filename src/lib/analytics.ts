import { track as vercelClientTrack } from '@vercel/analytics';
import { track as vercelServerTrack } from '@vercel/analytics/server';

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Use the appropriate track function based on environment
const vercelTrack = isBrowser ? vercelClientTrack : vercelServerTrack;

export function trackPurchase(purchaseData: {
    transactionId: string
    value: number
    itemName: string
  }) {
    if (isBrowser && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-1009082087/lDmiCNPQ8ZYZEOe9leED',
        'value': purchaseData.value,
        'currency': 'USD',
        'transaction_id': purchaseData.transactionId,
        'items': [{
          'name': purchaseData.itemName
        }]
      });
    }
}

/**
 * Track user interactions with the vectordatabases tool
 */
export function trackVectorDatabaseInteraction(eventData: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}) {
  // Track with Vercel Analytics - works both server-side and client-side
  vercelTrack(eventData.action, {
    category: eventData.category || 'vectordatabases',
    ...eventData
  });
  
  // Only track with Google Analytics on the client side
  if (isBrowser && (window as any).gtag) {
    (window as any).gtag('event', eventData.action, {
      'event_category': eventData.category || 'vectordatabases',
      'event_label': eventData.label,
      'value': eventData.value,
      ...eventData
    });
  }
}

/**
 * Track chat interactions
 */
export function trackChatInteraction(eventData: {
  action: string;
  chatSessionId?: string;
  messageCount?: number;
  userMessageLength?: number;
  responseTime?: number;
  [key: string]: any;
}) {
  // Track with Vercel Analytics
  vercelTrack(eventData.action, {
    category: 'chat',
    ...eventData
  });
  
  // Only track with Google Analytics on the client side
  if (isBrowser && (window as any).gtag) {
    (window as any).gtag('event', eventData.action, {
      'event_category': 'chat',
      ...eventData
    });
  }
}

/**
 * Track a database comparison selection
 */
export function trackDatabaseComparison(eventData: {
  databases: string[];
  count: number;
  [key: string]: any;
}) {
  // Convert the array to a string for Vercel Analytics
  const databasesString = eventData.databases.join(',');
  
  vercelTrack('database_comparison', {
    category: 'vectordatabases',
    databasesString,
    databaseCount: eventData.count,
    action: eventData.action || 'comparison'
  });
}