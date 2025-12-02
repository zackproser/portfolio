"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Wrench, 
  Tags,
  Newspaper,
  Link2
} from "lucide-react"

export default function AdminDashboard() {
  const adminModules = [
    {
      title: "Newsletter Episodes",
      description: "Create, edit, and manage newsletter content with live preview",
      icon: Newspaper,
      href: "/admin/newsletter" as any,
      color: "from-emerald-600 to-teal-600"
    },
    {
      title: "Link Builder",
      description: "Generate tracked URLs with EmailOctopus merge tags for campaigns",
      icon: Link2,
      href: "/admin/newsletter/link-builder" as any,
      color: "from-orange-600 to-amber-600"
    },
    {
      title: "Tools Management",
      description: "Add, edit, and remove developer tools from the database",
      icon: Wrench,
      href: "/admin/tools" as any,
      color: "from-violet-600 to-purple-600"
    },
    {
      title: "Categories",
      description: "Manage tool categories and classifications",
      icon: Tags,
      href: "/admin/categories" as any,
      color: "from-blue-600 to-cyan-600"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <LayoutDashboard className="w-6 h-6 mr-2 text-violet-600" />
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Link 
            key={index} 
            href={module.href}
            className="block group"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 transition duration-200 hover:shadow-md hover:border-slate-300">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${module.color} mb-4`}>
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-violet-600 transition-colors">{module.title}</h2>
              <p className="text-slate-600">{module.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200">
        <Button asChild variant="outline">
          <Link href="/">
            Return to Site
          </Link>
        </Button>
      </div>
    </div>
  )
} 