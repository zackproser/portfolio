"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Sparkles } from "lucide-react"

interface QuickNotesProps {
  onAddToBulletPoints: (expandedNote: string) => void
}

export default function QuickNotes({ onAddToBulletPoints }: QuickNotesProps) {
  const [note, setNote] = useState("")
  const [expandedNote, setExpandedNote] = useState("")
  const [isExpanding, setIsExpanding] = useState(false)
  const { toast } = useToast()

  const handleExpandNote = async () => {
    if (!note.trim()) {
      toast({
        title: "Note required",
        description: "Please enter a note to expand",
        variant: "destructive",
      })
      return
    }

    try {
      setIsExpanding(true)
      const response = await fetch("/api/expand-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      })

      if (!response.ok) {
        throw new Error("Failed to expand note")
      }

      const data = await response.json()
      setExpandedNote(data.expandedNote)
    } catch (error) {
      toast({
        title: "Error expanding note",
        description: "An error occurred while expanding the note",
        variant: "destructive",
      })
    } finally {
      setIsExpanding(false)
    }
  }

  const handleAddToBulletPoints = () => {
    if (expandedNote) {
      onAddToBulletPoints(expandedNote)
      toast({
        title: "Note added",
        description: "Expanded note has been added to bullet points",
      })
      setNote("")
      setExpandedNote("")
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full flex flex-col">
      <CardHeader className="pb-1 pt-2 px-3 flex-shrink-0">
        <CardTitle className="flex items-center text-base">
          <Sparkles className="h-4 w-4 mr-1 text-yellow-400" />
          AI Quick Notes
        </CardTitle>
        <CardDescription className="text-blue-100 text-xs">
          Jot down quick notes and let AI expand them into well-written content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-3 py-1 flex-grow overflow-auto">
        <div>
          <Textarea
            placeholder="Enter a brief note or bullet point..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[60px] bg-white/20 border-white/20 placeholder:text-white/50 text-white text-sm"
          />
        </div>
        {expandedNote && (
          <div className="p-2 bg-white/20 rounded-md border border-white/20 overflow-auto">
            <h4 className="text-xs font-medium mb-1 text-blue-100">Expanded Content:</h4>
            <p className="text-white text-sm">{expandedNote}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-1 pb-2 px-3 flex-shrink-0">
        <Button
          onClick={handleExpandNote}
          disabled={isExpanding || !note.trim()}
          className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs h-8"
        >
          {isExpanding ? (
            <>
              <LoadingSpinner size={12} className="mr-1" />
              Expanding...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              Expand with AI
            </>
          )}
        </Button>
        <Button
          onClick={handleAddToBulletPoints}
          disabled={!expandedNote}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/20 text-xs h-8"
        >
          Add to Bullet Points
        </Button>
      </CardFooter>
    </Card>
  )
}

