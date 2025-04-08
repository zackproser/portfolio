"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"

interface ProgressTrackerProps {
  completedTopics: string[]
  totalTopics: number
}

export default function ProgressTracker({ completedTopics, totalTopics }: ProgressTrackerProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const percentage = (completedTopics.length / totalTopics) * 100
    setProgress(percentage)
  }, [completedTopics, totalTopics])

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-800">Your Learning Progress</h3>
        <span className="text-slate-700">
          {completedTopics.length}/{totalTopics} Topics
        </span>
      </div>
      <Progress value={progress} className="h-2 mb-2 bg-slate-100" />
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Beginner</span>
        <span>Intermediate</span>
        <span className="flex items-center gap-1">
          Advanced <Trophy className="h-4 w-4" />
        </span>
      </div>
    </div>
  )
} 