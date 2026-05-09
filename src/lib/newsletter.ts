import { logger } from '@/utils/logger'
import { isKitSubscriber } from '@/lib/kit-subscribe'

/**
 * Check if an email address is an active subscriber on the Kit list.
 * Used by gated-content modal logic to short-circuit when the visitor is
 * already on the list (no point re-prompting them to subscribe).
 *
 * Returns false on any lookup error so the UX defaults to "show the signup
 * form" rather than gating content incorrectly. Re-subscribing is idempotent
 * in Kit, so a false negative is harmless.
 */
export async function isEmailSubscribed(
  email: string | null | undefined,
): Promise<boolean> {
  if (!email) return false
  try {
    return await isKitSubscriber(email)
  } catch (err) {
    logger.error('Failed to check Kit subscription', err)
    return false
  }
}
