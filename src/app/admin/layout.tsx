import { requireAdmin } from '@/lib/require-admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin('/admin')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900">
      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  )
} 