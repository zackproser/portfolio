import { auth } from "../../auth"

/**
 * Checks if the current user is an admin.
 * Only the email specified in ADMIN_EMAIL env var is considered an admin.
 */
export async function isAdmin() {
  const session = await auth()
  const adminEmail = process.env.ADMIN_EMAIL || "zackproser@gmail.com"
  
  if (!session || !session.user?.email) {
    return false
  }
  
  return session.user.email === adminEmail
} 