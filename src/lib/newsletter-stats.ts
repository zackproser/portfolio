import { logger } from '@/utils/logger'

interface NewsletterStats {
  subscriberCount: number
  lastUpdated: Date
}

// In-memory cache with timestamp
let statsCache: NewsletterStats | null = null
const CACHE_DURATION_MS = 2 * 60 * 60 * 1000 // 2 hours

/**
 * Get newsletter subscriber count from EmailOctopus API
 * Cached for 2 hours to avoid hitting rate limits
 */
export async function getNewsletterStats(): Promise<NewsletterStats> {
  // Return cached data if still valid
  if (statsCache && Date.now() - statsCache.lastUpdated.getTime() < CACHE_DURATION_MS) {
    logger.info('[getNewsletterStats] Returning cached subscriber count:', statsCache.subscriberCount)
    return statsCache
  }

  logger.info('[getNewsletterStats] Cache miss or expired, fetching fresh data')

  const apiKey = process.env.EMAIL_OCTOPUS_API_KEY
  const listId = process.env.EMAIL_OCTOPUS_LIST_ID

  if (!apiKey || !listId) {
    logger.warn('[getNewsletterStats] Missing EMAIL_OCTOPUS_API_KEY or EMAIL_OCTOPUS_LIST_ID, returning default')
    // Return current subscriber count if API credentials not configured
    return {
      subscriberCount: 2700,
      lastUpdated: new Date()
    }
  }

  try {
    const endpoint = `https://emailoctopus.com/api/1.6/lists/${listId}?api_key=${apiKey}`
    const res = await fetch(endpoint, {
      // Revalidate every 2 hours
      next: { revalidate: 7200 }
    })

    if (!res.ok) {
      const errorText = await res.text()
      logger.warn(`[getNewsletterStats] EmailOctopus API error: ${res.status} - ${errorText}`)
      throw new Error(`EmailOctopus API returned ${res.status}`)
    }

    const data = await res.json()

    // EmailOctopus returns a counts object with subscribed, pending, unsubscribed
    const subscriberCount = data.counts?.subscribed || 2700

    // Update cache
    statsCache = {
      subscriberCount,
      lastUpdated: new Date()
    }

    logger.info(`[getNewsletterStats] Fetched live subscriber count: ${subscriberCount}`)
    return statsCache

  } catch (error) {
    logger.error('[getNewsletterStats] Failed to fetch subscriber count:', error)

    // Return cached data if available, even if expired
    if (statsCache) {
      logger.debug('[getNewsletterStats] Returning stale cached data due to error')
      return statsCache
    }

    // Fallback to current subscriber count
    return {
      subscriberCount: 2700,
      lastUpdated: new Date()
    }
  }
}

/**
 * Format subscriber count for display (e.g., 2,700+)
 */
export function formatSubscriberCount(count: number): string {
  logger.info('[formatSubscriberCount] Formatting count:', count)
  // Round to nearest 100 for nice display
  const rounded = Math.floor(count / 100) * 100
  const formatted = `${rounded.toLocaleString()}+`
  logger.info('[formatSubscriberCount] Formatted result:', formatted)
  return formatted
}
