import { logger } from '@/utils/logger'
import { prisma } from '@/lib/prisma'

/**
 * Check if an email address is subscribed to the newsletter.
 * First checks the local database (fast), then falls back to EmailOctopus API.
 * Returns true when the contact exists and has status 'SUBSCRIBED'.
 */
export async function isEmailSubscribed(email: string | null | undefined): Promise<boolean> {
  if (!email) {
    logger.debug('[isEmailSubscribed] No email provided')
    return false
  }

  try {
    // First, check local database (fast and reliable)
    logger.debug(`[isEmailSubscribed] Checking database for: ${email}`)
    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
      select: { status: true, lastSyncedAt: true }
    })

    if (subscription) {
      const isSubscribed = subscription.status === 'SUBSCRIBED'
      logger.debug(`[isEmailSubscribed] Database result for ${email}: status=${subscription.status}`)
      return isSubscribed
    }

    // Fallback to EmailOctopus API for users not in database yet
    logger.debug(`[isEmailSubscribed] Not in database, checking EmailOctopus API for: ${email}`)
    const apiKey = process.env.EMAIL_OCTOPUS_API_KEY
    const listId = process.env.EMAIL_OCTOPUS_LIST_ID

    if (!apiKey || !listId) {
      logger.warn('[isEmailSubscribed] Missing EMAIL_OCTOPUS_API_KEY or EMAIL_OCTOPUS_LIST_ID')
      return false
    }

    const endpoint = `https://emailoctopus.com/api/1.6/lists/${listId}/contacts/${encodeURIComponent(email)}?api_key=${apiKey}`
    const res = await fetch(endpoint)

    if (!res.ok) {
      const errorText = await res.text()
      logger.warn(`[isEmailSubscribed] EmailOctopus lookup failed for ${email}: ${res.status} - ${errorText}`)
      return false
    }

    const data = await res.json()
    const isSubscribed = data.status === 'SUBSCRIBED'
    logger.debug(`[isEmailSubscribed] EmailOctopus API result for ${email}: status=${data.status}`)

    // Cache the result in database for future fast lookups
    await prisma.newsletterSubscription.upsert({
      where: { email },
      create: {
        email,
        status: data.status,
        source: 'emailoctopus_sync',
        emailoctopusId: data.id,
        subscribedAt: data.status === 'SUBSCRIBED' ? new Date(data.created_at || Date.now()) : null,
        lastSyncedAt: new Date()
      },
      update: {
        status: data.status,
        emailoctopusId: data.id,
        lastSyncedAt: new Date()
      }
    })

    return isSubscribed
  } catch (err) {
    logger.error('[isEmailSubscribed] Failed to check email subscription', err)
    return false
  }
}
