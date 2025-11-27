'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  Zap, 
  Brain, 
  Palette, 
  Calendar,
  ChevronDown,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import VoicePipelineVisualization from './VoicePipelineVisualization'
import MultiAgentOrchestration from './MultiAgentOrchestration'
import VerbalVentilation from './VerbalVentilation'
import ScenarioGallery from './ScenarioGallery'
import MeetingIntelligence from './MeetingIntelligence'
import AffiliateCard, { AffiliateDualCard } from './AffiliateCard'

// Related post card component for inline section posts
interface RelatedPostCardProps {
  slug: string
  title: string
  description: string
  image: string
  color: 'purple' | 'blue' | 'rose' | 'emerald' | 'teal'
}

function RelatedPostCard({ slug, title, description, image, color }: RelatedPostCardProps) {
  const borderColors = {
    purple: 'hover:border-purple-400 dark:hover:border-purple-500',
    blue: 'hover:border-blue-400 dark:hover:border-blue-500',
    rose: 'hover:border-rose-400 dark:hover:border-rose-500',
    emerald: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    teal: 'hover:border-teal-400 dark:hover:border-teal-500'
  }
  
  const textColors = {
    purple: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    blue: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    rose: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    emerald: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    teal: 'group-hover:text-teal-600 dark:group-hover:text-teal-400'
  }
  
  return (
    <Link
      href={`/blog/${slug}`}
      className={`group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 ${borderColors[color]} hover:shadow-lg transition-all`}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-3">
        <h4 className={`font-semibold text-sm text-zinc-900 dark:text-zinc-100 ${textColors[color]} transition-colors line-clamp-2`}>
          {title}
        </h4>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  )
}

// Custom hook for intersection observer
function useIntersectionObserver(
  threshold: number = 0.5
): [React.RefCallback<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const refCallback = useCallback((node: HTMLElement | null) => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (!node) return

    // Create new observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once when entering view
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          // Disconnect after triggering once
          observerRef.current?.disconnect()
        }
      },
      { threshold }
    )

    observerRef.current.observe(node)
  }, [threshold])

  return [refCallback, isIntersecting]
}

type SectionId = 'pipeline' | 'orchestration' | 'ventilation' | 'scenarios' | 'meetings'

interface Section {
  id: SectionId
  title: string
  description: string
  icon: typeof Mic
  color: string
}

const SECTIONS: Section[] = [
  {
    id: 'pipeline',
    title: 'Voice Pipeline',
    description: 'How voice becomes polished text',
    icon: Mic,
    color: 'purple'
  },
  {
    id: 'orchestration',
    title: 'Multi-Agent Orchestration',
    description: 'Voice speed enables parallelism',
    icon: Zap,
    color: 'blue'
  },
  {
    id: 'ventilation',
    title: 'Verbal Ventilation',
    description: 'Brain dump → organized output',
    icon: Brain,
    color: 'indigo'
  },
  {
    id: 'scenarios',
    title: 'Context-Aware Formatting',
    description: 'Different apps, different formats',
    icon: Palette,
    color: 'amber'
  },
  {
    id: 'meetings',
    title: 'Meeting Intelligence',
    description: 'AI notes without the bot',
    icon: Calendar,
    color: 'green'
  }
]

export default function VoiceAIDemoClient() {
  const [activeSection, setActiveSection] = useState<SectionId>('pipeline')
  
  // Intersection observers for auto-play
  const [pipelineRef, pipelineVisible] = useIntersectionObserver(0.4)
  const [orchestrationRef, orchestrationVisible] = useIntersectionObserver(0.4)
  const [ventilationRef, ventilationVisible] = useIntersectionObserver(0.4)

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
        >
          Voice-First AI in Action
        </motion.h1>
        
        {/* Intro text with affiliate links */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
        >
          See how{' '}
          <a 
            href="https://ref.wisprflow.ai/zack-proser" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            WisprFlow
          </a>
          {' '}and{' '}
          <a 
            href="https://go.granola.ai/zack-proser" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Granola
          </a>
          {' '}use voice to massively improve your productivity.
        </motion.p>

        {/* Personal story - theme-aware styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-3xl relative overflow-hidden rounded-2xl"
        >
          {/* Theme-aware gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-indigo-500/10 dark:from-purple-900/20 dark:via-transparent dark:to-indigo-900/20" />
          
          {/* Subtle corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-2xl" />
          
          {/* Content */}
          <div className="relative p-6 sm:p-8 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl">
            {/* Quote mark decoration */}
            <div className="absolute top-4 left-4 text-5xl text-zinc-300 dark:text-zinc-600/30 font-serif leading-none">&ldquo;</div>
            
            <div className="space-y-4 text-zinc-700 dark:text-zinc-200 pl-6 sm:pl-8">
              <p className="text-sm sm:text-base leading-relaxed">
                I taught myself to type <span className="font-semibold text-purple-600 dark:text-purple-400">90 WPM</span> playing 
                EverQuest as a kid—communicating complex raid actions and timing to teammates while 
                simultaneously casting spells and managing movement. Over the years my typing style 
                evolved into something that looks <span className="italic text-zinc-500 dark:text-zinc-400">&ldquo;incredibly strange&rdquo;</span> 
                according to everyone who&apos;s watched me.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                But here&apos;s the thing: with{' '}
                <a href="https://ref.wisprflow.ai/zack-proser" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">
                  WisprFlow
                </a>, 
                I&apos;m now hitting <span className="font-semibold text-green-600 dark:text-green-400">179 WPM</span>—essentially 
                a <span className="font-bold text-green-600 dark:text-green-400">2x increase</span> in how fast I can 
                output instructions to AI agents. That&apos;s not a marginal improvement.
              </p>
              <p className="text-base sm:text-lg font-medium text-zinc-900 dark:text-zinc-100 pt-2">
                That&apos;s a fundamentally different way of working.
              </p>
            </div>
            
            {/* Hero video */}
            <div className="mt-6 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto block bg-zinc-900"
                style={{ minHeight: '280px' }}
              >
                <source src="https://zackproser.b-cdn.net/images/drive-voice.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </motion.div>

        {/* Speed comparison stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-8"
        >
          <div className="text-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="text-lg font-mono font-bold text-zinc-500 dark:text-zinc-400">90</div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">WPM Typing</div>
          </div>
          <div className="flex items-center">
            <span className="text-2xl">→</span>
          </div>
          <div className="text-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200 dark:border-purple-700">
            <div className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">179</div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-wide">WPM Voice</div>
          </div>
          <div className="flex items-center">
            <span className="text-2xl">=</span>
          </div>
          <div className="text-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700">
            <div className="text-lg font-mono font-bold text-green-600 dark:text-green-400">2x</div>
            <div className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-wide">Faster</div>
          </div>
        </motion.div>
      </div>

      {/* Section Navigator */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="sticky top-4 z-40 mx-auto max-w-4xl"
      >
        <div className="rounded-xl border border-zinc-200 bg-white/80 backdrop-blur-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900/80 p-2">
          <div className="flex flex-wrap justify-center gap-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium
                    transition-all duration-200
                    ${isActive 
                      ? `bg-${section.color}-100 text-${section.color}-700 dark:bg-${section.color}-900/30 dark:text-${section.color}-300`
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }
                  `}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </motion.nav>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-zinc-400 dark:text-zinc-500"
        >
          <span className="text-xs mb-1">Scroll to explore</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Section 1: Voice Pipeline */}
      <section id="pipeline" className="scroll-mt-24" ref={pipelineRef}>
        <VoicePipelineVisualization autoPlay={pipelineVisible} />
        
        {/* Value Proposition */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <span className="font-semibold text-purple-700 dark:text-purple-400">The speed unlock is real.</span> At 179 WPM, 
            I&apos;m no longer bottlenecked by my typing speed. The limiting factor has shifted from mechanical input 
            to <em>my mind&apos;s capacity to track multiple workstreams</em>—which is exactly where it should be for 
            orchestrating AI agents.
          </p>
        </div>

        <div className="mt-6">
          <AffiliateCard product="wisprflow" context="pipeline-section" />
        </div>

        {/* Related Posts */}
        <div className="mt-6">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">Related Reading</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <RelatedPostCard
              slug="wisprflow-review"
              title="WisprFlow Review - 179WPM Voice-Driven Development"
              description="Transform voice into text at 4x typing speed, the ultimate tool for developers."
              image="https://zackproser.b-cdn.net/images/wisprflow.webp"
              color="purple"
            />
            <RelatedPostCard
              slug="wisprflow-high-leverage-workflow"
              title="WisprFlow: Highest-Leverage Dev Upgrade"
              description="How voice-first development transformed my agentic workflow and unlocked new velocity."
              image="https://zackproser.b-cdn.net/images/wisprflow-interface.webp"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Multi-Agent Orchestration */}
      <section id="orchestration" className="scroll-mt-24 pt-8" ref={orchestrationRef}>
        <MultiAgentOrchestration autoPlay={orchestrationVisible} />
        
        {/* Value Proposition */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <span className="font-semibold text-blue-700 dark:text-blue-400">This is the multiplexing advantage.</span> While 
            a keyboard user is still composing their first task, I&apos;ve already dispatched three. The agents work 
            in parallel—refactoring auth, adding tests, updating docs—all while I&apos;m already thinking about the 
            <em> next</em> set of instructions.
          </p>
        </div>

        <div className="mt-6">
          <AffiliateCard product="wisprflow" variant="compact" context="orchestration-section" />
        </div>

        {/* Related Posts */}
        <div className="mt-6">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">Related Reading</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <RelatedPostCard
              slug="cursor-agents-review"
              title="Cursor Agents Hands-on Review"
              description="I got hands-on with Cursor's new Agents feature. Here's what I thought..."
              image="https://zackproser.b-cdn.net/images/cursor-agents-hero.webp"
              color="blue"
            />
            <RelatedPostCard
              slug="orchestrator-pattern"
              title="The Orchestrator Pattern"
              description="How to effectively direct and coordinate multiple AI agents for complex tasks."
              image="https://zackproser.b-cdn.net/images/orchestrator-pattern.webp"
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Verbal Ventilation */}
      <section id="ventilation" className="scroll-mt-24 pt-8" ref={ventilationRef}>
        <VerbalVentilation autoPlay={ventilationVisible} />
        
        {/* Value Proposition */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border border-rose-200 dark:border-rose-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <span className="font-semibold text-rose-700 dark:text-rose-400">Your brain doesn&apos;t think in organized lists.</span> Neither 
            does mine—especially with ADHD. Speaking everything out loud and letting AI organize it creates the cognitive 
            relief of <em>&ldquo;getting it out of your head&rdquo;</em> while producing actionable artifacts. It&apos;s 
            like having a patient assistant who never judges the chaos.
          </p>
        </div>

        <div className="mt-6">
          <AffiliateCard product="wisprflow" variant="compact" context="ventilation-section" />
        </div>

        {/* Related Posts */}
        <div className="mt-6">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">Related Reading</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <RelatedPostCard
              slug="claude-external-brain-adhd-autistic"
              title="Claude as My External Brain: Autistic, ADHD, and Finally Supported"
              description="How I use Claude as an external brain combining voice, agents, and CI/CD to support neurodivergent processing."
              image="https://zackproser.b-cdn.net/images/claude.webp"
              color="rose"
            />
            <RelatedPostCard
              slug="training-claude-neurological-patterns"
              title="Training Claude to Compensate for My Neurological Patterns"
              description="How I'm teaching an AI system to compensate for specific ADHD/autism processing patterns."
              image="https://zackproser.b-cdn.net/images/claude-support.webp"
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Context-Aware Formatting */}
      <section id="scenarios" className="scroll-mt-24 pt-8">
        <ScenarioGallery />
        
        {/* Value Proposition */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Same voice, different outputs.</span> I 
            speak the same way whether I&apos;m writing code, composing an email, or chatting on Slack. WisprFlow 
            detects the context and formats accordingly—code with proper syntax, emails professionally, chat casually. 
            Zero mental overhead.
          </p>
        </div>

        <div className="mt-6">
          <AffiliateCard product="wisprflow" context="scenarios-section" />
        </div>

        {/* Related Post */}
        <div className="mt-6">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">Related Reading</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <RelatedPostCard
              slug="wisprflow-review"
              title="WisprFlow Review - Context-Aware Formatting Deep Dive"
              description="How WisprFlow detects context and formats output accordingly—code, email, chat."
              image="https://zackproser.b-cdn.net/images/wisprflow.webp"
              color="emerald"
            />
            <RelatedPostCard
              slug="best-ai-voice-tools-2025"
              title="Top 4 AI Voice Tools for 2025"
              description="WisprFlow, Granola, ElevenLabs, and Bland AI—the best voice tools for productivity."
              image="https://zackproser.b-cdn.net/images/top-voice-tools-2025.webp"
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Meeting Intelligence */}
      <section id="meetings" className="scroll-mt-24 pt-8">
        <MeetingIntelligence />
        
        {/* Value Proposition */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <span className="font-semibold text-teal-700 dark:text-teal-400">Be present, not transcribing.</span> The 
            best conversations happen when you&apos;re fully engaged—making eye contact, asking follow-ups, building 
            relationships. Granola captures everything locally while you focus on what matters. No awkward 
            &ldquo;Can I record this?&rdquo; because there&apos;s no bot joining.
          </p>
        </div>

        <div className="mt-6">
          <AffiliateCard product="granola" context="meetings-section" />
        </div>

        {/* Related Posts */}
        <div className="mt-6">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">Related Reading</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <RelatedPostCard
              slug="granola-ai-review"
              title="Granola AI Review: No More Note-Taking Anxiety"
              description="Honest review after months of daily use. Why it's become indispensable for meetings."
              image="https://zackproser.b-cdn.net/images/granola-hero.webp"
              color="teal"
            />
            <RelatedPostCard
              slug="best-ai-voice-tools-2025"
              title="Top 4 AI Voice Tools for 2025"
              description="WisprFlow, Granola, ElevenLabs, and Bland AI—the best voice tools for productivity."
              image="https://zackproser.b-cdn.net/images/top-voice-tools-2025.webp"
              color="teal"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="pt-12 pb-8">
        <div className="rounded-2xl bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 dark:from-purple-900/30 dark:via-indigo-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-800 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              Ready to Go Voice-First?
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              These are the exact tools I use every day. Voice-first development has transformed 
              how I work—and I think it will do the same for you.
            </p>
          </div>
          
          <AffiliateDualCard context="final-cta" />

          {/* Related content cards */}
          <div className="mt-8 pt-6 border-t border-purple-200 dark:border-purple-800">
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-6">
              Learn more about voice-first workflows
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* WisprFlow Review */}
              <Link
                href="/blog/wisprflow-review"
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src="https://zackproser.b-cdn.net/images/wisprflow.webp"
                    alt="WisprFlow voice-to-text interface"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    WisprFlow Review - 179WPM Voice-Driven Development
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    Transform voice into text at 4x typing speed, the ultimate tool for developers who think faster than they type
                  </p>
                </div>
              </Link>
              
              {/* Granola Review */}
              <Link
                href="/blog/granola-ai-review"
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src="https://zackproser.b-cdn.net/images/granola-hero.webp"
                    alt="Granola AI meeting intelligence"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                    Granola AI Review: No More Note-Taking Anxiety
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    Honest review after months of daily use across meetings and calls. Why it&apos;s become indispensable.
                  </p>
                </div>
              </Link>
              
              {/* Best Voice Tools 2025 */}
              <Link
                href="/blog/best-ai-voice-tools-2025"
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src="https://zackproser.b-cdn.net/images/top-voice-tools-2025.webp"
                    alt="Top AI voice tools for 2025"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    Top 4 AI Voice Tools for 2025
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    WisprFlow, Granola, ElevenLabs, and Bland AI—the best voice tools for productivity.
                  </p>
                </div>
              </Link>
              
              {/* High-Leverage Workflows */}
              <Link
                href="/blog/wisprflow-high-leverage-workflow"
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src="https://zackproser.b-cdn.net/images/wisprflow-interface.webp"
                    alt="WisprFlow high-leverage workflow"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                    WisprFlow: Highest-Leverage Dev Upgrade
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    How voice-first development transformed my agentic workflow and unlocked new velocity.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

