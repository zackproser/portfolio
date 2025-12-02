"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Save, 
  Loader2, 
  Eye, 
  EyeOff,
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Image as ImageIcon,
  Copy,
  Check,
  Sparkles,
  FileText,
  ChevronDown
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { AIDraftPanel } from "./ai-draft-panel"
import { NEWSLETTER_TEMPLATES, type NewsletterTemplateType } from "@/data/newsletter-templates"

interface NewsletterMetadata {
  title: string
  description: string
  date: string
  author: string
  image?: string
}

interface NewsletterEditorProps {
  initialMetadata?: NewsletterMetadata
  initialContent?: string
  slug?: string
  isNew?: boolean
  onSave?: (data: { slug: string; metadata: NewsletterMetadata; content: string }) => Promise<void>
}

export function NewsletterEditor({
  initialMetadata,
  initialContent = "",
  slug,
  isNew = false,
  onSave,
}: NewsletterEditorProps) {
  const [metadata, setMetadata] = useState<NewsletterMetadata>({
    title: initialMetadata?.title || "",
    description: initialMetadata?.description || "",
    date: initialMetadata?.date || new Date().toISOString().split("T")[0],
    author: initialMetadata?.author || "Zachary Proser",
    image: initialMetadata?.image || "",
  })
  const [content, setContent] = useState(initialContent)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)

  // Track changes
  useEffect(() => {
    if (initialMetadata || initialContent) {
      const metadataChanged = JSON.stringify(metadata) !== JSON.stringify(initialMetadata)
      const contentChanged = content !== initialContent
      setHasChanges(metadataChanged || contentChanged)
    } else {
      setHasChanges(metadata.title !== "" || content !== "")
    }
  }, [metadata, content, initialMetadata, initialContent])

  const handleSave = async () => {
    if (!metadata.title) {
      alert("Please enter a title")
      return
    }
    if (!metadata.date) {
      alert("Please enter a date")
      return
    }

    setIsSaving(true)
    try {
      if (onSave) {
        await onSave({
          slug: slug || metadata.date,
          metadata,
          content,
        })
      }
      setLastSaved(new Date())
      setHasChanges(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  const insertMarkdown = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = document.querySelector("textarea[name='content']") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newContent = 
      content.substring(0, start) + 
      prefix + textToInsert + suffix + 
      content.substring(end)

    setContent(newContent)

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length + textToInsert.length + suffix.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  function handleAIContentGenerated(generated: { title: string; description: string; content: string }) {
    if (generated.title) {
      setMetadata(prev => ({ ...prev, title: generated.title }))
    }
    if (generated.description) {
      setMetadata(prev => ({ ...prev, description: generated.description }))
    }
    if (generated.content) {
      setContent(generated.content)
    }
    setShowAIPanel(false)
  }

  function applyTemplate(templateKey: NewsletterTemplateType) {
    const template = NEWSLETTER_TEMPLATES[templateKey]
    if (template) {
      setContent(template.structure)
      setShowTemplateDropdown(false)
    }
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown("**", "**", "bold text"), title: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", "*", "italic text"), title: "Italic" },
    { icon: Link2, action: () => insertMarkdown("[", "](url)", "link text"), title: "Link" },
    { icon: Heading1, action: () => insertMarkdown("\n## ", "\n", "Heading"), title: "Heading 2" },
    { icon: Heading2, action: () => insertMarkdown("\n### ", "\n", "Heading"), title: "Heading 3" },
    { icon: Heading3, action: () => insertMarkdown("\n#### ", "\n", "Heading"), title: "Heading 4" },
    { icon: List, action: () => insertMarkdown("\n- ", "", "List item"), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertMarkdown("\n1. ", "", "List item"), title: "Numbered List" },
    { icon: Code, action: () => insertMarkdown("`", "`", "code"), title: "Inline Code" },
    { icon: Quote, action: () => insertMarkdown("\n> ", "\n", "Quote"), title: "Quote" },
    { icon: ImageIcon, action: () => insertMarkdown("![", "](image-url)", "alt text"), title: "Image" },
  ]

  return (
    <div className="space-y-6">
      {/* Metadata Form */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Episode Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              placeholder="Newsletter episode title"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              placeholder="Brief description for the episode"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date * {isNew && "(used as slug)"}
            </label>
            <input
              type="date"
              value={metadata.date}
              onChange={(e) => setMetadata({ ...metadata, date: e.target.value })}
              disabled={!isNew}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Author
            </label>
            <input
              type="text"
              value={metadata.author}
              onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
              placeholder="Author name"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Featured Image URL
            </label>
            <input
              type="text"
              value={metadata.image || ""}
              onChange={(e) => setMetadata({ ...metadata, image: e.target.value })}
              placeholder="https://example.com/image.webp"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* AI Quick Actions Bar */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowAIPanel(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
            
            {/* Template Selector */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="bg-white dark:bg-gray-800"
              >
                <FileText className="w-4 h-4 mr-2" />
                Use Template
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showTemplateDropdown ? "rotate-180" : ""}`} />
              </Button>
              
              {showTemplateDropdown && (
                <div className="absolute z-20 top-full left-0 mt-1 w-72 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                  {Object.entries(NEWSLETTER_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => applyTemplate(key as NewsletterTemplateType)}
                      className="w-full flex flex-col items-start p-3 text-left hover:bg-slate-50 dark:hover:bg-gray-700 border-b border-slate-100 dark:border-gray-700 last:border-b-0"
                    >
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {template.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {template.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <span className="text-sm text-purple-700 dark:text-purple-300">
            AI-assisted drafting • Choose a template or generate fresh
          </span>
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-1">
            {toolbarButtons.map((btn, index) => (
              <button
                key={index}
                type="button"
                onClick={btn.action}
                title={btn.title}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <btn.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </>
            )}
          </Button>
        </div>

        <div className="p-4">
          {showPreview ? (
            <div className="prose dark:prose-invert max-w-none min-h-[400px]">
              <ReactMarkdown>{content || "*No content yet*"}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your newsletter content in Markdown...

## Table of contents

## Main Section

Your content here..."
              rows={20}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y min-h-[400px]"
            />
          )}
        </div>
      </div>

      {/* Save Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800 p-4 sticky bottom-4">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {lastSaved && (
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {hasChanges && !isSaving && (
            <span className="text-amber-600 dark:text-amber-400">Unsaved changes</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-emerald-600 to-teal-600"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isNew ? "Create Episode" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Draft Panel */}
      <AIDraftPanel
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
        onContentGenerated={handleAIContentGenerated}
      />
    </div>
  )
}



