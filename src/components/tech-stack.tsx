"use client"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { motion } from "framer-motion"

interface Technology {
  name: string
  category: string
  icon: string // This would be a path to icon or SVG representation
  level: 'expert' | 'advanced' | 'proficient'
}

const technologies: Technology[] = [
  // Frontend
  { name: "Next.js", category: "frontend", icon: "⚛️", level: "expert" },
  { name: "React", category: "frontend", icon: "⚛️", level: "expert" },
  { name: "TypeScript", category: "frontend", icon: "𝓣", level: "expert" },
  { name: "Tailwind CSS", category: "frontend", icon: "🌊", level: "expert" },
  { name: "Shadcn UI", category: "frontend", icon: "⬛", level: "expert" },
  { name: "Framer Motion", category: "frontend", icon: "🎞️", level: "advanced" },
  
  // AI & ML
  { name: "OpenAI API", category: "ai", icon: "🧠", level: "expert" },
  { name: "Vercel AI SDK", category: "ai", icon: "▲", level: "expert" },
  { name: "Langchain", category: "ai", icon: "🔗", level: "expert" },
  { name: "Hugging Face", category: "ai", icon: "🤗", level: "advanced" },
  { name: "Embeddings", category: "ai", icon: "📊", level: "expert" },
  { name: "RAG Architecture", category: "ai", icon: "📚", level: "expert" },
  
  // Vector Databases
  { name: "Pinecone", category: "vector", icon: "🌲", level: "expert" },
  { name: "Weaviate", category: "vector", icon: "🕸️", level: "advanced" },
  { name: "ChromaDB", category: "vector", icon: "🔷", level: "advanced" },
  { name: "Milvus", category: "vector", icon: "📊", level: "proficient" },
  { name: "Qdrant", category: "vector", icon: "📈", level: "proficient" },
  
  // Backend & Infrastructure
  { name: "Node.js", category: "backend", icon: "🟢", level: "expert" },
  { name: "AWS", category: "backend", icon: "☁️", level: "expert" },
  { name: "Terraform", category: "backend", icon: "🏗️", level: "advanced" },
  { name: "PostgreSQL", category: "backend", icon: "🐘", level: "expert" },
  { name: "Prisma", category: "backend", icon: "▲", level: "expert" },
  { name: "Docker", category: "backend", icon: "🐳", level: "advanced" },
  { name: "Kubernetes", category: "backend", icon: "☸️", level: "proficient" },
]

type Category = "all" | "frontend" | "ai" | "vector" | "backend"

export default function TechStack() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  
  const categories = [
    { id: "all", name: "All Technologies" },
    { id: "frontend", name: "Frontend" },
    { id: "ai", name: "AI & ML" },
    { id: "vector", name: "Vector Databases" },
    { id: "backend", name: "Backend & Infra" },
  ]
  
  const filteredTechnologies = selectedCategory === "all" 
    ? technologies 
    : technologies.filter(tech => tech.category === selectedCategory)

  // Group by expertise level
  const expertTech = filteredTechnologies.filter(tech => tech.level === 'expert')
  const advancedTech = filteredTechnologies.filter(tech => tech.level === 'advanced')
  const proficientTech = filteredTechnologies.filter(tech => tech.level === 'proficient')
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`px-3 py-1 cursor-pointer text-sm ${
              selectedCategory === category.id
                ? "bg-primary hover:bg-primary/90"
                : "hover:bg-primary/10 border-primary/30"
            }`}
            onClick={() => setSelectedCategory(category.id as Category)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
      
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {expertTech.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center">
              <span className="bg-primary/10 text-primary p-1 rounded-md mr-2">★★★</span>
              Expert Level
            </h3>
            <div className="flex flex-wrap gap-3">
              {expertTech.map((tech) => (
                <Badge
                  key={tech.name}
                  className="px-3 py-2 text-base bg-background border border-primary/30 hover:bg-primary/5"
                >
                  <span className="mr-2">{tech.icon}</span>
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {advancedTech.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center">
              <span className="bg-primary/10 text-primary p-1 rounded-md mr-2">★★☆</span>
              Advanced Level
            </h3>
            <div className="flex flex-wrap gap-3">
              {advancedTech.map((tech) => (
                <Badge
                  key={tech.name}
                  className="px-3 py-2 text-base bg-background border border-primary/20 hover:bg-primary/5"
                >
                  <span className="mr-2">{tech.icon}</span>
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {proficientTech.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center">
              <span className="bg-primary/10 text-primary p-1 rounded-md mr-2">★☆☆</span>
              Proficient Level
            </h3>
            <div className="flex flex-wrap gap-3">
              {proficientTech.map((tech) => (
                <Badge
                  key={tech.name}
                  className="px-3 py-2 text-base bg-background border border-primary/10 hover:bg-primary/5"
                >
                  <span className="mr-2">{tech.icon}</span>
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
} 