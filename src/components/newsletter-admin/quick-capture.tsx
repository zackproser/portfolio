"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { LinkIcon, PlusCircle, Clipboard, Share2 } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

interface QuickCaptureProps {
  onLinkAdd: (url: string) => Promise<void>
  onNoteAdd: (note: string) => void
}

export default function QuickCapture({ onLinkAdd, onNoteAdd }: QuickCaptureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [captureType, setCaptureType] = useState<"link" | "note">("link")
  const [url, setUrl] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLinkSubmit = async () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to add",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await onLinkAdd(url)
      setUrl("")
      setIsOpen(false)
      toast({
        title: "Link captured",
        description: "Link has been added to your newsletter",
      })
    } catch (error) {
      toast({
        title: "Error adding link",
        description: "An error occurred while adding the link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNoteSubmit = () => {
    if (!note.trim()) {
      toast({
        title: "Note required",
        description: "Please enter a note to add",
        variant: "destructive",
      })
      return
    }

    onNoteAdd(note)
    setNote("")
    setIsOpen(false)
    toast({
      title: "Note captured",
      description: "Note has been added to your newsletter",
    })
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      if (captureType === "link" && clipboardText.trim()) {
        setUrl(clipboardText)
      } else if (captureType === "note" && clipboardText.trim()) {
        setNote(clipboardText)
      }
    } catch (error) {
      toast({
        title: "Clipboard access denied",
        description: "Please grant clipboard access or enter text manually",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Add to Newsletter",
          text: "Add this to my newsletter",
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Web Share API is not supported in your browser",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-8 w-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-blue-900 text-white border-blue-700 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Quick Capture</DialogTitle>
            </DialogHeader>

            <div className="flex border border-blue-700 rounded-md overflow-hidden mb-4">
              <button
                className={`flex-1 py-2 text-center ${captureType === "link" ? "bg-blue-700" : "bg-transparent"}`}
                onClick={() => setCaptureType("link")}
              >
                <LinkIcon className="h-4 w-4 inline-block mr-2" />
                Link
              </button>
              <button
                className={`flex-1 py-2 text-center ${captureType === "note" ? "bg-blue-700" : "bg-transparent"}`}
                onClick={() => setCaptureType("note")}
              >
                <Clipboard className="h-4 w-4 inline-block mr-2" />
                Note
              </button>
            </div>

            {captureType === "link" ? (
              <div className="space-y-4">
                <Input
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-blue-800/50 border-blue-700 text-white placeholder:text-blue-300/50"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handlePaste}
                    variant="outline"
                    className="flex-1 border-blue-700 text-white hover:bg-blue-800"
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Paste
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex-1 border-blue-700 text-white hover:bg-blue-800"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter a quick note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px] bg-blue-800/50 border-blue-700 text-white placeholder:text-blue-300/50"
                />
                <Button
                  onClick={handlePaste}
                  variant="outline"
                  className="w-full border-blue-700 text-white hover:bg-blue-800"
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Paste from Clipboard
                </Button>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setIsOpen(false)} variant="ghost" className="text-white hover:bg-blue-800">
                Cancel
              </Button>
              <Button
                onClick={captureType === "link" ? handleLinkSubmit : handleNoteSubmit}
                disabled={isLoading || (captureType === "link" ? !url.trim() : !note.trim())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    Processing...
                  </>
                ) : (
                  "Add to Newsletter"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

