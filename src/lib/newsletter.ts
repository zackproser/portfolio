import { isKitSubscriber } from '@/lib/kit-subscribe'

/**
 * Check if an email address is an active subscriber on the Kit list.
 * Used by gated-content modal logic to short-circuit when the visitor is
 * already on the list (no point re-prompting them to subscribe).
 *
 * Failures are logged inside `isKitSubscriber` and surfaced as `false` —
 * a false negative is harmless because re-subscribing is idempotent.
 */
export async function isEmailSubscribed(
  email: string | null | undefined,
): Promise<boolean> {
  return isKitSubscriber(email)
}
