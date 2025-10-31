import { Metadata } from 'next'
import { createMetadata } from '@/utils/createMetadata'
import HeroSection from '@/components/applied-ai/HeroSection'
import { StatsBar } from '@/components/applied-ai/StatsBar'
import SpeakingHighlights from '@/components/applied-ai/SpeakingHighlights'
import FeaturedProjects from '@/components/applied-ai/FeaturedProjects'
import PremierProject from '@/components/applied-ai/PremierProject'
import ExperienceTimeline from '@/components/applied-ai/ExperienceTimeline'
import SkillsMatrix from '@/components/applied-ai/SkillsMatrix'
import TestimonialsSection from '@/components/applied-ai/TestimonialsSection'
import { ContactSection } from '@/components/applied-ai/ContactSection'
import { ResourcesNavigation } from '@/components/applied-ai/ResourcesNavigation'
import PersonSchema from '@/components/applied-ai/PersonSchema'

// All components now fetch their own data internally

export const metadata: Metadata = createMetadata({
  title: "Zack Proser - Full-Stack AI Engineer | Enterprise AI Solutions",
  description: "Staff-level Full-Stack AI Engineer with 13+ years experience building scalable systems and 3+ years specializing in AI/LLM solutions. From fine-tuning models to enterprise RAG systems.",
  author: "Zachary Proser",
  keywords: [
    "Staff AI Engineer",
    "Staff Applied AI Engineer",
    "Applied AI Engineer",
    "LLM Engineer", 
    "Senior AI Engineer",
    "AI Engineering Lead",
    "RAG Systems",
    "Vector Databases",
    "Enterprise AI",
    "Machine Learning",
    "AI Architecture",
    "AI Software Architect",
    "Production AI Systems",
    "AI Infrastructure Engineer",
    "TypeScript AI Development",
    "Python AI Engineer",
    "AI Consultant",
    "AI Training Specialist"
  ],
})

export default function AppliedAiEngineerPage() {
  return (
    <main className="min-h-screen">
      {/* Structured Data for SEO */}
      <PersonSchema />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Bar */}
      <StatsBar stats={[
        { number: "50,000+", label: "Yearly Blog Readers" },
        { number: "3,000+", label: "Newsletter Subscribers" },
        { number: "3+ Years", label: "AI Infrastructure Experience" },
        { number: "13+ Years", label: "Total Engineering Experience" }
      ]} />
      
      {/* Resources Navigation */}
      <ResourcesNavigation />
      
      {/* Speaking Highlights */}
      <SpeakingHighlights />
      
      {/* Premier Project */}
      <PremierProject />

      {/* Featured Projects */}
      <FeaturedProjects />
      
      {/* Experience Timeline */}
      <ExperienceTimeline />
      
      {/* Skills Matrix */}
      <SkillsMatrix />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10 border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Let’s build applied AI that matters</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">If you’re exploring roles in Growth Engineering, Developer Relations, or Applied AI product work, I’m ready to contribute.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="mailto:zackproser@gmail.com" className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">Email me</a>
            <a href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">GitHub</a>
            <a href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">LinkedIn</a>
          </div>
        </div>
      </section>
    </main>
  )
} 