'use client'

import { useState } from 'react'
import { appliedAiProjects } from '@/data/applied-ai-projects'
import Image from 'next/image'
import { ExternalLink, Code, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Import hero images from blog posts
import fineTuneLlama from '@/images/fine-tune-llama.webp'
import customRagChat from '@/images/custom-rag-chat-screenshot.webp'
import pineconeRefArch from '@/images/pinecone-refarch-logo.webp'
import mnistMindMapper from '@/images/mnist-mind-mapper-splash.webp'
import mastraWorkshopHero from '@/images/mastra-workshop-hero.webp'
import officeOracle2 from '@/images/michael-scott-oracle-2.webp'
import cloudGpuServices from '@/images/cloud-gpu-services-reviewed.webp'
import aiAssistedDevTools from '@/images/ai-assisted-dev-tools.webp'

// Map project titles to their corresponding hero images
const heroImageMap: Record<string, any> = {
  "Llama 3.1 Fine-tuning with Torchtune": fineTuneLlama,
  "RAG Pipeline with LangChain & Pinecone": customRagChat,
  "AI Pipelines & Agents Workshop with Mastra.ai": mastraWorkshopHero,
  "MNIST Neural Network & Digit Recognizer": mnistMindMapper,
  "Pinecone AWS Reference Architecture": pineconeRefArch,
  "Office Oracle AI Chatbot": officeOracle2,
  "Cloud GPU Services Comparison": cloudGpuServices,
  "AI-Assisted Developer Tools Analysis": aiAssistedDevTools
}

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const heroImage = heroImageMap[project.title] || fineTuneLlama

  return (
    <div className="group flex-shrink-0 w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
        {/* Project hero image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={heroImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <div className="p-8">
          {/* Project header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.links.demo && (
              <Link
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </Link>
            )}
            {project.links.article && (
              <Link 
                href={project.links.article}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Read Article
              </Link>
            )}
            {project.links.code && (
              <Link
                href={project.links.code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <Code className="w-4 h-4" />
                View Code
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProjects() {
  const featuredProjects = appliedAiProjects.filter(project => project.featured)
  const itemsPerView = 3 // Show 3 cards at a time
  const totalSlides = Math.ceil(featuredProjects.length / itemsPerView)
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const currentProjects = featuredProjects.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  )

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Featured AI Projects
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real-world implementations showcasing advanced AI techniques, from neural networks and fine-tuning 
            to production RAG systems and enterprise infrastructure.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Projects Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 min-h-[600px]">
            {currentProjects.map((project, index) => (
              <ProjectCard key={`${currentIndex}-${project.title}`} project={project} index={index} />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={prevSlide}
              disabled={totalSlides <= 1}
              className="border-blue-400 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 backdrop-blur-sm disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
          
            <Button
              variant="outline"
              size="lg"
              onClick={nextSlide}
              disabled={totalSlides <= 1}
              className="border-blue-400 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 backdrop-blur-sm disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-blue-200 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Project Counter */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {currentIndex * itemsPerView + 1}-{Math.min((currentIndex + 1) * itemsPerView, featuredProjects.length)} of {featuredProjects.length} projects
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 