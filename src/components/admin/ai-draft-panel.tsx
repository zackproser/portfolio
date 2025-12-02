"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  RefreshCw, 
  X, 
  FileText, 
  Lightbulb,
  Loader2,
  ChevronDown,
  Check
} from "lucide-react"
import { BlogSelector } from "./blog-selector"

interface AIDraftPanelProps {
  isOpen: boolean
  onClose: () => void
  onContentGenerated: (content: { title: string; description: string; content: string }) => void
}

type Mode = "topic" | "repurpose"
type TemplateType = "tool-review" | "roundup" | "tutorial" | "opinion" | "general"

const TEMPLATE_OPTIONS: { value: TemplateType; label: string; description: string }[] = [
  { value: "general", label: "General", description: "Flexible format for any topic" },
  { value: "tool-review", label: "Tool Review", description: "Deep-dive on a specific tool or product" },
  { value: "roundup", label: "Weekly Roundup", description: "Curated links with commentary" },
  { value: "tutorial", label: "Tutorial", description: "Step-by-step how-to guide" },
  { value: "opinion", label: "Opinion/Commentary", description: "Industry insights and hot takes" },
]

export function AIDraftPanel({ isOpen, onClose, onContentGenerated }: AIDraftPanelProps) {
  const [mode, setMode] = useState<Mode>("topic")
  const [topic, setTopic] = useState("")
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null)
  const [templateType, setTemplateType] = useState<TemplateType>("general")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamedContent, setStreamedContent] = useState("")
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)

  async function handleGenerate() {
    if (mode === "topic" && !topic.trim()) {
      setError("Please enter a topic")
      return
    }
    if (mode === "repurpose" && !selectedBlogSlug) {
      setError("Please select a blog post to repurpose")
      return
    }

    setIsGenerating(true)
    setError(null)
    setStreamedContent("")

    try {
      const response = await fetch("/api/admin/newsletter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          topic: mode === "topic" ? topic : undefined,
          blogSlug: mode === "repurpose" ? selectedBlogSlug : undefined,
          templateType: mode === "topic" ? templateType : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const decoder = new TextDecoder()
      let fullContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        // Parse the streamed data - Vercel AI SDK uses a specific format
        const lines = chunk.split("\n")
        for (const line of lines) {
          if (line.startsWith("0:")) {
            // Text delta from Vercel AI SDK
            try {
              const text = JSON.parse(line.slice(2))
              fullContent += text
              setStreamedContent(fullContent)
            } catch {
              // Skip malformed lines
            }
          }
        }
      }

      // Parse the final content
      const parsed = parseGeneratedContent(fullContent)
      if (parsed) {
        onContentGenerated(parsed)
      } else {
        // If parsing fails, just use the raw content
        onContentGenerated({
          title: "",
          description: "",
          content: fullContent,
        })
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  function parseGeneratedContent(raw: string): { title: string; description: string; content: string } | null {
    try {
      const titleMatch = raw.match(/TITLE:\s*(.+?)(?=\n|DESCRIPTION:)/s)
      const descMatch = raw.match(/DESCRIPTION:\s*(.+?)(?=\n|CONTENT:)/s)
      const contentMatch = raw.match(/CONTENT:\s*([\s\S]+)$/s)

      return {
        title: titleMatch?.[1]?.trim() || "",
        description: descMatch?.[1]?.trim() || "",
        content: contentMatch?.[1]?.trim() || raw,
      }
    } catch {
      return null
    }
  }

  function handleReset() {
    setTopic("")
    setSelectedBlogSlug(null)
    setStreamedContent("")
    setError(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative ml-auto w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">AI Draft Assistant</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate newsletter content with AI</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-200 dark:border-gray-800">
          <button
            onClick={() => setMode("topic")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              mode === "topic"
                ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Fresh Topic
          </button>
          <button
            onClick={() => setMode("repurpose")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              mode === "repurpose"
                ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            Repurpose Blog Post
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mode === "topic" ? (
            <>
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  What do you want to write about?
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Voice-driven development with WisprFlow and how it changed my coding workflow..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Template Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content Template
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-left"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {TEMPLATE_OPTIONS.find(t => t.value === templateType)?.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {TEMPLATE_OPTIONS.find(t => t.value === templateType)?.description}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showTemplateDropdown ? "rotate-180" : ""}`} />
                  </button>
                  
                  {showTemplateDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                      {TEMPLATE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setTemplateType(option.value)
                            setShowTemplateDropdown(false)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-gray-700 ${
                            templateType === option.value ? "bg-purple-50 dark:bg-purple-900/20" : ""
                          }`}
                        >
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {option.label}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {option.description}
                            </div>
                          </div>
                          {templateType === option.value && (
                            <Check className="w-4 h-4 text-purple-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Blog Post Selector */
            <BlogSelector
              selectedSlug={selectedBlogSlug}
              onSelect={setSelectedBlogSlug}
            />
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Streaming Preview */}
          {streamedContent && (
            <div className="border border-slate-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {isGenerating ? "Generating..." : "Generated Content Preview"}
                </span>
              </div>
              <div className="p-3 max-h-64 overflow-y-auto">
                <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
                  {streamedContent}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-gray-800 flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isGenerating}
            className="flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || (mode === "topic" && !topic.trim()) || (mode === "repurpose" && !selectedBlogSlug)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Draft
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}


