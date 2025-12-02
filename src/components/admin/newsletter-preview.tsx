"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Copy, 
  Check, 
  Download, 
  ExternalLink,
  Monitor,
  Smartphone,
  Loader2,
  FileText,
  FileCode
} from "lucide-react"

interface NewsletterPreviewProps {
  slug: string
  onClose?: () => void
}

type ViewMode = "desktop" | "mobile"
type CopyType = "full" | "body" | null

export function NewsletterPreview({ slug, onClose }: NewsletterPreviewProps) {
  const [html, setHtml] = useState<string>("")
  const [bodyHtml, setBodyHtml] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<CopyType>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("desktop")

  useEffect(() => {
    async function fetchHtml() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch full HTML
        const fullResponse = await fetch(`/api/admin/newsletter/export?slug=${encodeURIComponent(slug)}`)
        if (!fullResponse.ok) {
          throw new Error("Failed to generate preview")
        }
        const htmlContent = await fullResponse.text()
        setHtml(htmlContent)
        
        // Fetch body-only HTML
        const bodyResponse = await fetch(`/api/admin/newsletter/export?slug=${encodeURIComponent(slug)}&format=body`)
        if (bodyResponse.ok) {
          const bodyData = await bodyResponse.json()
          setBodyHtml(bodyData.html || "")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHtml()
  }, [slug])

  async function copyFullHtml() {
    await navigator.clipboard.writeText(html)
    setCopied("full")
    setTimeout(() => setCopied(null), 2000)
  }

  async function copyBodyHtml() {
    await navigator.clipboard.writeText(bodyHtml)
    setCopied("body")
    setTimeout(() => setCopied(null), 2000)
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-${slug}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function openInNewTab() {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-slate-600">Generating preview...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="flex bg-white dark:bg-gray-900 rounded-md p-1">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-2 rounded ${
                viewMode === "desktop"
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-2 rounded ${
                viewMode === "mobile"
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {viewMode === "desktop" ? "Desktop (600px)" : "Mobile (375px)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openInNewTab}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Open
          </Button>
          <Button variant="outline" size="sm" onClick={downloadHtml}>
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyBodyHtml}
            title="Copy just the content body - useful for pasting into an existing EmailOctopus template"
          >
            {copied === "body" ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-1" />
                Copy Body
              </>
            )}
          </Button>
          <Button size="sm" onClick={copyFullHtml} className="bg-gradient-to-r from-emerald-600 to-teal-600">
            {copied === "full" ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4 mr-1" />
                Copy Full HTML
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="bg-slate-200 dark:bg-gray-700 rounded-lg p-4 flex justify-center overflow-auto">
        <div
          className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300"
          style={{ width: viewMode === "desktop" ? "600px" : "375px" }}
        >
          <iframe
            srcDoc={html}
            title="Newsletter Preview"
            className="w-full border-0"
            style={{ height: "600px" }}
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">
          EmailOctopus Ready
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
          This HTML includes all merge tags (<code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{"{{EmailAddress}}"}</code>, 
          <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{"{{UnsubscribeURL}}"}</code>) and 
          tracked links via <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">/api/click</code>.
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-blue-100 dark:bg-blue-800/50 rounded p-2">
            <strong className="text-blue-800 dark:text-blue-200">Copy Body</strong>
            <p className="text-blue-600 dark:text-blue-300 mt-0.5">
              Just the content - paste into your existing EmailOctopus template
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-800/50 rounded p-2">
            <strong className="text-blue-800 dark:text-blue-200">Copy Full HTML</strong>
            <p className="text-blue-600 dark:text-blue-300 mt-0.5">
              Complete email with header, footer, and styling
            </p>
          </div>
        </div>
      </div>

      {/* Raw HTML (collapsible) */}
      <details className="bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
        <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg">
          View Raw HTML
        </summary>
        <pre className="p-4 text-xs text-slate-600 dark:text-slate-400 overflow-auto max-h-[300px] border-t border-slate-200 dark:border-gray-700">
          {html}
        </pre>
      </details>
    </div>
  )
}



