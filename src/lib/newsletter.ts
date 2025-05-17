import { logger } from '@/utils/logger'

/**
 * Check if an email address is subscribed to the main EmailOctopus list.
 * Returns true when the contact exists and has status 'SUBSCRIBED'.
 */
export async function isEmailSubscribed(email: string | null | undefined): Promise<boolean> {
  if (!email) return false

  try {
    const apiKey = process.env.EMAIL_OCTOPUS_API_KEY
    const listId = process.env.EMAIL_OCTOPUS_LIST_ID
    if (!apiKey || !listId) return false

    const endpoint = `https://emailoctopus.com/api/1.6/lists/${listId}/contacts/${encodeURIComponent(email)}?api_key=${apiKey}`
    const res = await fetch(endpoint)
    if (!res.ok) {
      logger.warn(`EmailOctopus lookup failed for ${email}: ${res.status}`)
      return false
    }

    const data = await res.json()
    return data.status === 'SUBSCRIBED'
  } catch (err) {
    logger.error('Failed to check email subscription', err)
    return false
  }
}
