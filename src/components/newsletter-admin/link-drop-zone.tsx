"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDrop } from "react-dnd"
import { NotepadText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LinkDropZoneProps {
  onLinkAdd: (url: string) => Promise<void>
  isLoading: boolean
}

export default function LinkDropZone({ onLinkAdd, isLoading }: LinkDropZoneProps) {
  const [url, setUrl] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const [{ isOver }, drop] = useDrop({
    accept: "text/uri-list",
    drop: (item: { urls: string[] }) => {
      if (item.urls && item.urls.length > 0) {
        onLinkAdd(item.urls[0])
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      await onLinkAdd(url)
      setUrl("")
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text")
    if (pastedText.trim() && isValidUrl(pastedText)) {
      e.preventDefault()
      await onLinkAdd(pastedText)
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      // If it doesn't have a protocol, try adding https://
      try {
        new URL(`https://${string}`)
        return true
      } catch (_) {
        return false
      }
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      // Handle dropped text
      const text = e.dataTransfer.getData("text")
      if (text && isValidUrl(text)) {
        onLinkAdd(text)
        return
      }

      // Handle dropped URL from browser
      if (e.dataTransfer.types.includes("text/uri-list")) {
        const url = e.dataTransfer.getData("text/uri-list")
        if (url) {
          onLinkAdd(url)
        }
      }
    },
    [onLinkAdd],
  )

  return (
    <Card
      ref={drop}
      className={`border-2 border-dashed transition-colors ${
        isOver || isDragging ? "border-blue-400 bg-blue-900/30" : "border-white/20 bg-white/10"
      } backdrop-blur-sm text-white`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center">
        <div className="text-center mb-4">
          <NotepadText className="h-12 w-12 text-blue-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-white">Add links to your newsletter</h3>
          <p className="text-sm text-blue-200">Drag and drop links here, paste a URL, or enter it manually</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex space-x-2">
          <Input
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={handlePaste}
            className="flex-1 bg-white/20 border-white/20 placeholder:text-white/50 text-white"
          />
          <Button type="submit" disabled={isLoading || !url.trim()} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <LoadingSpinner size={16} className="mr-2" />
                Adding...
              </>
            ) : (
              "Add Link"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

