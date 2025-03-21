"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { LinkItem } from "./newsletter-builder"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NewsletterPreviewProps {
  subject: string
  links: LinkItem[]
  html: string
}

export default function NewsletterPreview({ subject, links, html }: NewsletterPreviewProps) {
  const [view, setView] = useState<"rendered" | "html">("rendered")
  const { toast } = useToast()

  const copyHtml = () => {
    navigator.clipboard.writeText(html)
    toast({
      title: "HTML copied",
      description: "Newsletter HTML has been copied to clipboard",
    })
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12 border border-white/20 rounded-md bg-white/5 text-white">
        <p className="text-gray-300">No content to preview. Add links to see the newsletter preview.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={view} onValueChange={(v) => setView(v as "rendered" | "html")} className="bg-white/20 rounded-md">
          <TabsList className="bg-transparent">
            <TabsTrigger value="rendered" className="data-[state=active]:bg-blue-600 text-white">
              Preview
            </TabsTrigger>
            <TabsTrigger value="html" className="data-[state=active]:bg-blue-600 text-white">
              HTML
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {view === "html" && (
          <Button
            variant="outline"
            size="sm"
            onClick={copyHtml}
            className="border-white/20 text-white hover:bg-white/20"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy HTML
          </Button>
        )}
      </div>

      <div className="border border-white/20 rounded-md overflow-hidden bg-white">
        {view === "rendered" ? (
          <iframe srcDoc={html} title="Newsletter Preview" className="w-full min-h-[600px] border-0" />
        ) : (
          <pre className="p-4 bg-gray-900 text-gray-300 overflow-auto text-xs max-h-[600px]">{html}</pre>
        )}
      </div>
    </div>
  )
}

