import { redirect } from 'next/navigation'
import { auth } from '../../../auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Check if user is authenticated and has the correct email
  if (!session || session.user?.email !== 'zackproser@gmail.com') {
    redirect('/auth/login?callbackUrl=/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900">
      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  )
} 