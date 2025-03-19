"use client"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Technology {
  name: string
  category: string
  icon: string
}

const technologies = [
  // Frontend
  { name: "Next.js", category: "frontend", icon: "⚛️" },
  { name: "React", category: "frontend", icon: "⚛️" },
  { name: "TypeScript", category: "frontend", icon: "𝓣" },
  { name: "Tailwind CSS", category: "frontend", icon: "🌊" },
  { name: "Shadcn UI", category: "frontend", icon: "⬛" },
  
  // AI & ML
  { name: "OpenAI API", category: "ai", icon: "🧠" },
  { name: "Vercel AI SDK", category: "ai", icon: "▲" },
  { name: "Langchain", category: "ai", icon: "🔗" },
  { name: "Hugging Face", category: "ai", icon: "🤗" },
  { name: "Embeddings", category: "ai", icon: "📊" },
  { name: "RAG Architecture", category: "ai", icon: "📚" },
  
  // Vector Databases
  { name: "Pinecone", category: "vector", icon: "🌲" },
  { name: "Weaviate", category: "vector", icon: "🕸️" },
  { name: "ChromaDB", category: "vector", icon: "🔷" },
  { name: "Milvus", category: "vector", icon: "📊" },
  { name: "Qdrant", category: "vector", icon: "📈" },
  
  // Backend & Infrastructure
  { name: "Node.js", category: "backend", icon: "🟢" },
  { name: "AWS", category: "backend", icon: "☁️" },
  { name: "Terraform", category: "backend", icon: "🏗️" },
  { name: "PostgreSQL", category: "backend", icon: "🐘" },
  { name: "Prisma", category: "backend", icon: "▲" },
  { name: "Docker", category: "backend", icon: "🐳" },
  { name: "Kubernetes", category: "backend", icon: "☸️" },
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
      
      <div
        key={selectedCategory}
        className="space-y-8 transition-all duration-300"
      >
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-foreground">
            Expert Technologies & Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {filteredTechnologies.map((tech) => (
              <Badge
                key={tech.name}
                className="px-3 py-2 text-base bg-background border border-primary/30 hover:bg-primary/5"
              >
                <span className="mr-2">{tech.icon}</span>
                {tech.name}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground mt-4">
            Working extensively with these technologies, I develop production-grade applications with full expertise across the entire stack.
          </p>
        </div>
      </div>
    </div>
  )
} 