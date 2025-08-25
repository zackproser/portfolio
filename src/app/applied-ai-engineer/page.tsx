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
        { number: "1,800+", label: "Newsletter Subscribers" },
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
      
      {/* Contact Section */}
      <div id="contact">
        <ContactSection />
      </div>
    </main>
  )
} 