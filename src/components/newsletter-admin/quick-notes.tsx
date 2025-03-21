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
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
          AI Quick Notes
        </CardTitle>
        <CardDescription className="text-blue-100">
          Jot down quick notes and let AI expand them into well-written content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Enter a brief note or bullet point..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] bg-white/20 border-white/20 placeholder:text-white/50 text-white"
          />
        </div>
        {expandedNote && (
          <div className="p-4 bg-white/20 rounded-md border border-white/20">
            <h4 className="text-sm font-medium mb-2 text-blue-100">Expanded Content:</h4>
            <p className="text-white">{expandedNote}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleExpandNote}
          disabled={isExpanding || !note.trim()}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          {isExpanding ? (
            <>
              <LoadingSpinner size={16} className="mr-2" />
              Expanding...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Expand with AI
            </>
          )}
        </Button>
        <Button
          onClick={handleAddToBulletPoints}
          disabled={!expandedNote}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/20"
        >
          Add to Bullet Points
        </Button>
      </CardFooter>
    </Card>
  )
}

