"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Database, Sparkles } from "lucide-react"

interface LearningPathSuggestionProps {
  completedTopics: string[]
  allTopics: any[]
}

export default function LearningPathSuggestion({ completedTopics, allTopics }: LearningPathSuggestionProps) {
  const [nextTopic, setNextTopic] = useState<any | null>(null)

  useEffect(() => {
    // Find the next recommended topic based on completed topics
    const accessibleTopics = allTopics.filter((topic) => {
      if (completedTopics.includes(topic.id)) return false
      if (!topic.dependencies) return true
      return topic.dependencies.every((dep) => completedTopics.includes(dep))
    })

    // Sort by difficulty (beginner first)
    const sortedTopics = [...accessibleTopics].sort((a, b) => {
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    })

    setNextTopic(sortedTopics[0] || null)
  }, [completedTopics, allTopics])

  if (!nextTopic) return null

  const getTopicIcon = () => {
    switch (nextTopic.id) {
      case "embeddings-basics":
      case "vector-databases":
        return <Database className="h-6 w-6" />
      case "llm-fundamentals":
      case "fine-tuning":
        return <Brain className="h-6 w-6" />
      default:
        return <Sparkles className="h-6 w-6" />
    }
  }

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-800">Recommended Next Step</CardTitle>
        <CardDescription>Based on your learning progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-2">
          {getTopicIcon()}
          <div>
            <h3 className="font-semibold">{nextTopic.title}</h3>
            <Badge
              variant={
                nextTopic.difficulty === "beginner"
                  ? "default"
                  : nextTopic.difficulty === "intermediate"
                    ? "secondary"
                    : "destructive"
              }
            >
              {nextTopic.difficulty}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{nextTopic.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700">
          Start Learning <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 