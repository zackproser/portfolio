"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Plus, 
  X, 
  Link2, 
  ExternalLink,
  History,
  Trash2,
  Bookmark,
  DollarSign,
  Sparkles
} from "lucide-react"

interface GeneratedLink {
  id: string
  destinationUrl: string
  tags: string[]
  fullUrl: string
  createdAt: Date
}

const TAG_PRESETS = {
  intent: [
    { value: "intent:build", label: "Build", description: "User wants to build AI tools" },
    { value: "intent:strategy", label: "Strategy", description: "User interested in AI strategy" },
    { value: "intent:apply", label: "Apply", description: "User wants to apply AI" },
    { value: "intent:learn", label: "Learn", description: "User wants to learn AI concepts" },
  ],
  source: [
    { value: "source:newsletter", label: "Newsletter", description: "From newsletter campaign" },
    { value: "source:seg-email-1", label: "Segmentation Email 1", description: "First segmentation email" },
    { value: "source:seg-email-2", label: "Segmentation Email 2", description: "Second segmentation email" },
    { value: "source:welcome", label: "Welcome Email", description: "From welcome sequence" },
  ],
  content: [
    { value: "clicked:blog", label: "Blog", description: "Clicked blog link" },
    { value: "clicked:product", label: "Product", description: "Clicked product link" },
    { value: "clicked:tool", label: "Tool", description: "Clicked tool comparison" },
    { value: "clicked:course", label: "Course", description: "Clicked course link" },
  ],
}

const DESTINATION_PRESETS = [
  { url: "https://zackproser.com/blog", label: "Blog" },
  { url: "https://zackproser.com/newsletter", label: "Newsletter Page" },
  { url: "https://zackproser.com/products", label: "Products" },
  { url: "https://zackproser.com/vectordatabases", label: "Vector Databases" },
  { url: "https://zackproser.com/devtools", label: "Dev Tools" },
  { url: "https://zackproser.com/comparisons", label: "Comparisons" },
]

// Affiliate link presets for quick insertion
const AFFILIATE_PRESETS = [
  { 
    url: "https://ref.wisprflow.ai/zack-proser", 
    label: "WisprFlow", 
    description: "Voice-driven development",
    suggestedTags: ["affiliate:wisprflow", "clicked:tool"],
    color: "from-violet-500 to-purple-600"
  },
  { 
    url: "https://granola.so/?ref=zackproser", 
    label: "Granola", 
    description: "AI meeting notes",
    suggestedTags: ["affiliate:granola", "clicked:tool"],
    color: "from-amber-500 to-orange-600"
  },
  { 
    url: "https://cursor.com", 
    label: "Cursor", 
    description: "AI-powered code editor",
    suggestedTags: ["affiliate:cursor", "clicked:tool"],
    color: "from-blue-500 to-cyan-600"
  },
  { 
    url: "https://www.anthropic.com/claude", 
    label: "Claude", 
    description: "AI assistant",
    suggestedTags: ["affiliate:claude", "clicked:tool"],
    color: "from-orange-500 to-red-600"
  },
]

export default function LinkBuilderPage() {
  const [destinationUrl, setDestinationUrl] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<GeneratedLink[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("newsletter-link-history")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHistory(parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        })))
      } catch (e) {
        console.error("Failed to parse link history:", e)
      }
    }
  }, [])

  // Save history to localStorage
  function saveHistory(links: GeneratedLink[]) {
    localStorage.setItem("newsletter-link-history", JSON.stringify(links))
  }

  function generateUrl(): string {
    if (!destinationUrl) return ""
    
    const base = "https://zackproser.com/api/click"
    const params = new URLSearchParams()
    params.set("e", "{{EmailAddress}}")
    
    selectedTags.forEach(tag => {
      params.append("tag", tag)
    })
    
    params.set("r", destinationUrl)
    
    return `${base}?${params.toString()}`
  }

  const generatedUrl = generateUrl()

  async function copyUrl() {
    if (!generatedUrl) return
    
    await navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Add to history
    const newLink: GeneratedLink = {
      id: Date.now().toString(),
      destinationUrl,
      tags: [...selectedTags],
      fullUrl: generatedUrl,
      createdAt: new Date(),
    }
    const newHistory = [newLink, ...history].slice(0, 50) // Keep last 50
    setHistory(newHistory)
    saveHistory(newHistory)
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  function addCustomTag() {
    if (!customTag.trim()) return
    const formatted = customTag.trim().toLowerCase().replace(/\s+/g, "-")
    if (!selectedTags.includes(formatted)) {
      setSelectedTags([...selectedTags, formatted])
    }
    setCustomTag("")
  }

  function removeTag(tag: string) {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  function applyFromHistory(link: GeneratedLink) {
    setDestinationUrl(link.destinationUrl)
    setSelectedTags(link.tags)
    setShowHistory(false)
  }

  function applyAffiliatePreset(preset: typeof AFFILIATE_PRESETS[0]) {
    setDestinationUrl(preset.url)
    // Add suggested tags without duplicates
    setSelectedTags(prev => {
      const newTags = [...prev]
      preset.suggestedTags.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag)
        }
      })
      return newTags
    })
  }

  function deleteFromHistory(id: string) {
    const newHistory = history.filter(h => h.id !== id)
    setHistory(newHistory)
    saveHistory(newHistory)
  }

  function clearHistory() {
    if (confirm("Clear all link history? This cannot be undone.")) {
      setHistory([])
      localStorage.removeItem("newsletter-link-history")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="outline" asChild className="mr-4 bg-white dark:bg-gray-900">
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Link Builder
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
          className="relative"
        >
          <History className="w-4 h-4 mr-2" />
          History
          {history.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
              {history.length}
            </span>
          )}
        </Button>
      </div>

      {/* Affiliate Quick Links */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
            Affiliate Quick Links
          </h3>
          <span className="text-sm text-purple-600 dark:text-purple-400">
            One-click to set up tracked affiliate links
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AFFILIATE_PRESETS.map((preset) => (
            <button
              key={preset.url}
              onClick={() => applyAffiliatePreset(preset)}
              className={`group relative overflow-hidden rounded-lg p-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br ${preset.color}`}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-white/80" />
                  <span className="font-semibold text-white">{preset.label}</span>
                </div>
                <p className="text-xs text-white/80">{preset.description}</p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-purple-600 dark:text-purple-400">
          Clicking an affiliate link auto-fills the URL and adds tracking tags
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Builder */}
        <div className="space-y-6">
          {/* Destination URL */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Destination URL
            </h3>
            <input
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://zackproser.com/blog/my-post"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {DESTINATION_PRESETS.map(preset => (
                <button
                  key={preset.url}
                  onClick={() => setDestinationUrl(preset.url)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    destinationUrl === preset.url
                      ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                      : "border-slate-300 dark:border-gray-700 text-slate-600 dark:text-slate-400 hover:border-orange-300 dark:hover:border-orange-700"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Selection */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Select Tags
            </h3>

            {Object.entries(TAG_PRESETS).map(([category, tags]) => (
              <div key={category} className="mb-6">
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 capitalize">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.value}
                      onClick={() => toggleTag(tag.value)}
                      title={tag.description}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        selectedTags.includes(tag.value)
                          ? "bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-600 text-orange-700 dark:text-orange-300"
                          : "border-slate-300 dark:border-gray-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-gray-600"
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Custom Tag Input */}
            <div>
              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Custom Tag
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                  placeholder="e.g., campaign:summer-2024"
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Button onClick={addCustomTag} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-800">
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Selected Tags ({selectedTags.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-md"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-orange-900 dark:hover:text-orange-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="space-y-6">
          {/* Generated URL */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Generated URL
              </h3>
              {destinationUrl && (
                <Button onClick={copyUrl} className="bg-gradient-to-r from-orange-600 to-amber-600">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </>
                  )}
                </Button>
              )}
            </div>

            {destinationUrl ? (
              <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4 break-all">
                <code className="text-sm text-slate-700 dark:text-slate-300">
                  {generatedUrl}
                </code>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4 text-center text-slate-500 dark:text-slate-400">
                Enter a destination URL to generate a tracked link
              </div>
            )}

            {destinationUrl && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link2 className="w-4 h-4" />
                <span>Includes: <code className="bg-slate-100 dark:bg-gray-700 px-1 rounded">{"{{EmailAddress}}"}</code> merge tag</span>
              </div>
            )}
          </div>

          {/* Preview Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
              How It Works
            </h4>
            <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-decimal list-inside">
              <li>Subscriber clicks the link in your EmailOctopus campaign</li>
              <li><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">/api/click</code> captures their email and tags</li>
              <li>Tags are added to their EmailOctopus contact profile</li>
              <li>User is redirected to the destination URL</li>
            </ol>
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Example Usage in EmailOctopus:</h5>
              <code className="block text-xs bg-blue-100 dark:bg-blue-800 p-2 rounded overflow-auto">
                {`<a href="${generatedUrl || 'https://zackproser.com/api/click?e={{EmailAddress}}&tag=intent:build&r=https://zackproser.com/blog'}">Read More</a>`}
              </code>
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Link History
                </h3>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No links generated yet. Your history will appear here.
                </p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {history.map(link => (
                    <div
                      key={link.id}
                      className="p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <a
                          href={link.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate flex-1"
                        >
                          {link.destinationUrl}
                          <ExternalLink className="w-3 h-3 inline ml-1" />
                        </a>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => applyFromHistory(link)}
                            className="h-7 w-7 p-0"
                            title="Use this link"
                          >
                            <Bookmark className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFromHistory(link.id)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {link.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {link.createdAt.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



