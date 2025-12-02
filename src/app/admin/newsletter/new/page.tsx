"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { NewsletterEditor } from "@/components/admin/newsletter-editor"

export default function NewNewsletterPage() {
  const router = useRouter()

  async function handleSave(data: {
    slug: string
    metadata: { title: string; description: string; date: string; author: string; image?: string }
    content: string
  }) {
    const response = await fetch("/api/admin/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metadata: data.metadata,
        content: data.content,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create episode")
    }

    // Navigate to the new episode's edit page
    router.push(`/admin/newsletter/${data.metadata.date}/edit`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" asChild className="mr-4 bg-white dark:bg-gray-900">
          <Link href="/admin/newsletter">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          New Newsletter Episode
        </h1>
      </div>

      <NewsletterEditor isNew onSave={handleSave} />
    </div>
  )
}




