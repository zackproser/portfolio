import NewsletterBuilder from "@/components/newsletter-admin/newsletter-builder"
import { requireAdmin } from '@/lib/require-admin'

export default async function NewsletterAdminPage() {
  await requireAdmin('/admin/newsletter')

  return (
    <div className="w-full p-0">
      <div className="mb-8 text-white px-4">
        <h1 className="text-5xl font-bold mb-4">Newsletter Builder</h1>
      </div>
      <NewsletterBuilder />
    </div>
  )
} 