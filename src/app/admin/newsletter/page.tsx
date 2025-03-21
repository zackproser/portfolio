import { redirect } from 'next/navigation'
import NewsletterBuilder from "@/components/newsletter-admin/newsletter-builder"
import { auth } from '../../../../auth'

export default async function NewsletterAdminPage() {
  const session = await auth()
  
  // Check if user is authenticated and has the correct email
  if (!session || session.user?.email !== 'zackproser@gmail.com') {
    redirect('/auth/login?callbackUrl=/admin/newsletter')
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-12 text-white">
        <h1 className="text-5xl font-bold mb-4">Newsletter Builder</h1>
        <p className="text-xl opacity-80">Create and send your newsletter with ease.</p>
      </div>
      <NewsletterBuilder />
    </div>
  )
} 