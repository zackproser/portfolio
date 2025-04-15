"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Wrench, 
  Tags, 
  LogOut
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const adminEmail = "zackproser@gmail.com"
  
  useEffect(() => {
    // Wait until authentication completes
    if (status === "loading") return
    
    // Redirect if not authenticated or not the admin
    if (status === "unauthenticated" || session?.user?.email !== adminEmail) {
      router.push("/")
    }
  }, [status, session, router])
  
  // Show loading during authentication or redirect
  if (status === "loading" || status === "unauthenticated" || session?.user?.email !== adminEmail) {
    return <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Checking authentication...</p>
    </div>
  }
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard
    },
    {
      title: "Tools",
      href: "/admin/tools",
      icon: Wrench
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: Tags
    }
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 hidden md:block">
        <div className="p-6 border-b border-slate-200 dark:border-gray-800">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">Admin</span>
          </Link>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Protected area - Admin only
          </div>
          <div className="mt-1 text-xs text-green-500">
            Logged in as: {session?.user?.email}
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-gray-800">
            <Link
              href="/"
              className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Return to Site
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden w-full bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-bold text-lg text-blue-600 dark:text-blue-400">
            Admin Panel
          </Link>
          <div className="flex items-center space-x-2">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-50 dark:bg-gray-950">
        {children}
      </main>
    </div>
  )
} 