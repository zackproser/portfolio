export async function requireAdmin(callbackUrl: string = '/admin') {
  const { auth } = await import('../../auth')
  const { redirect } = await import('next/navigation')

  const session = await auth()
  const adminEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()).filter(Boolean)
    : []

  if (!session || !adminEmails.includes(session.user?.email || '')) {
    redirect(`/auth/login?callbackUrl=${callbackUrl}`)
  }

  return session
}
