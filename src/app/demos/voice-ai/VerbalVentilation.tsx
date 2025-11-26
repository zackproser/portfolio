'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Mic, 
  Sparkles, 
  Play, 
  RotateCcw,
  Ticket,
  MessageSquare,
  Calendar,
  FileText,
  ArrowRight,
  Loader2,
  ExternalLink
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CHAOTIC_THOUGHTS, ORGANIZED_OUTPUTS, type ThoughtFragment, type OrganizedOutput } from './data'

// Background nervous typing fragments
const NERVOUS_TYPING_FRAGMENTS = [
  "why does everything feel",
  "i can't remember if",
  "wait did I already",
  "oh god the deadline",
  "where was that file",
  "need to respond to",
  "when is that meeting",
  "forgot to check the",
  "what was I doing",
  "too many tabs open",
  "brain won't stop",
  "can't focus on",
  "everything at once",
  "drowning in tasks"
]

type DemoPhase = 'idle' | 'dumping' | 'processing' | 'organized'

const CATEGORY_COLORS: Record<ThoughtFragment['category'], string> = {
  frustration: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  idea: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  task: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  question: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  blocker: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  internal: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
}

const OUTPUT_ICONS: Record<OrganizedOutput['type'], typeof Ticket> = {
  ticket: Ticket,
  slack: MessageSquare,
  calendar: Calendar,
  note: FileText
}

const OUTPUT_COLORS: Record<OrganizedOutput['type'], string> = {
  ticket: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  slack: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
  calendar: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  note: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
}

// Nervous typing background component
function NervousTyping({ active }: { active: boolean }) {
  const [typingLines, setTypingLines] = useState<{ id: number; text: string; x: number; y: number }[]>([])
  
  useEffect(() => {
    if (!active) {
      setTypingLines([])
      return
    }
    
    let lineId = 0
    const addLine = () => {
      const fragment = NERVOUS_TYPING_FRAGMENTS[Math.floor(Math.random() * NERVOUS_TYPING_FRAGMENTS.length)]
      const newLine = {
        id: lineId++,
        text: fragment,
        x: Math.random() * 80,
        y: Math.random() * 80
      }
      setTypingLines(prev => [...prev.slice(-12), newLine]) // Keep max 12 lines
    }
    
    // Add lines rapidly
    const interval = setInterval(addLine, 300)
    addLine() // Start immediately
    
    return () => clearInterval(interval)
  }, [active])
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {typingLines.map(line => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute text-[10px] font-mono text-zinc-500 dark:text-zinc-600 whitespace-nowrap"
            style={{ left: `${line.x}%`, top: `${line.y}%` }}
          >
            {line.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface VerbalVentilationProps {
  autoPlay?: boolean
}

export default function VerbalVentilation({ autoPlay = false }: VerbalVentilationProps) {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const [visibleThoughts, setVisibleThoughts] = useState<number[]>([])
  const [visibleOutputs, setVisibleOutputs] = useState<number[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)

  // Animation sequence
  useEffect(() => {
    if (phase !== 'dumping') return

    // Reveal thoughts one by one using a ref-based approach to avoid closure issues
    let thoughtIndex = 0
    let intervalId: NodeJS.Timeout | null = null
    
    const revealNextThought = () => {
      if (thoughtIndex < CHAOTIC_THOUGHTS.length) {
        const thought = CHAOTIC_THOUGHTS[thoughtIndex]
        if (thought) {
          setVisibleThoughts(prev => [...prev, thought.id])
        }
        thoughtIndex++
      } else {
        if (intervalId) clearInterval(intervalId)
        // Move to processing phase after all thoughts visible
        setTimeout(() => setPhase('processing'), 500)
      }
    }
    
    intervalId = setInterval(revealNextThought, 400)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [phase])

  // Processing animation
  useEffect(() => {
    if (phase !== 'processing') return

    const duration = 2000
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / duration) * 100)
      setProcessingProgress(progress)
      
      if (progress < 100) {
        requestAnimationFrame(animate)
      } else {
        setPhase('organized')
      }
    }
    
    animate()
  }, [phase])

  // Reveal organized outputs
  useEffect(() => {
    if (phase !== 'organized') return

    let outputIndex = 0
    const outputInterval = setInterval(() => {
      if (outputIndex < ORGANIZED_OUTPUTS.length) {
        setVisibleOutputs(prev => [...prev, outputIndex])
        outputIndex++
      } else {
        clearInterval(outputInterval)
      }
    }, 300)

    return () => clearInterval(outputInterval)
  }, [phase])

  // Auto-play when triggered by scroll
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed && phase === 'idle') {
      setHasAutoPlayed(true)
      setPhase('dumping')
      setVisibleThoughts([])
      setVisibleOutputs([])
      setProcessingProgress(0)
    }
  }, [autoPlay, hasAutoPlayed, phase])

  const handlePlay = useCallback(() => {
    setPhase('dumping')
    setVisibleThoughts([])
    setVisibleOutputs([])
    setProcessingProgress(0)
  }, [])

  const handleReset = useCallback(() => {
    setPhase('idle')
    setVisibleThoughts([])
    setVisibleOutputs([])
    setProcessingProgress(0)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Verbal Ventilation Pattern
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Dump everything in your head out loud. The LLM sorts it, connects it to your tools, 
          and reflects organized thoughts back. Especially powerful for ADHD and neurodivergent thinkers.
        </p>
      </div>

      {/* Full-width hero image */}
      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-800 shadow-lg">
        <Image
          src="https://zackproser.b-cdn.net/images/claude-really-ventilate.webp"
          alt="Verbally ventilating to Claude - externalizing thoughts through voice"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <p className="text-white text-sm sm:text-base font-medium drop-shadow-lg">
            Walking in the woods, speaking thoughts aloud to Claude, letting AI help organize the chaos
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/blog/walking-and-talking-with-ai" className="inline-flex items-center gap-1 text-xs text-purple-200 hover:text-white transition-colors">
              Walking & Talking with AI <ExternalLink className="h-3 w-3" />
            </Link>
            <Link href="/blog/claude-external-brain-adhd-autistic" className="inline-flex items-center gap-1 text-xs text-purple-200 hover:text-white transition-colors">
              Claude as External Brain <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main visualization - stacked layout for less dead space */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-4 sm:p-6 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        
        {/* Top: Chaotic thoughts with nervous typing background */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
            <Brain className="h-4 w-4 text-red-500" />
            Your Brain (Chaotic)
            {phase === 'dumping' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-auto flex items-center gap-2 bg-red-100 dark:bg-red-900/30 rounded-full px-3 py-1"
              >
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <Mic className="h-3 w-3 text-red-600 dark:text-red-400" />
                <span className="text-xs text-red-600 dark:text-red-400">Speaking...</span>
              </motion.div>
            )}
          </div>
          
          <div className="relative min-h-[180px] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 p-3 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-amber-50/30 to-purple-50/50 dark:from-red-900/10 dark:via-amber-900/10 dark:to-purple-900/10" />
            
            {/* Nervous typing background during dumping */}
            <NervousTyping active={phase === 'dumping'} />
            
            {/* Thought fragments */}
            <div className="relative flex flex-wrap gap-1.5">
              <AnimatePresence>
                {CHAOTIC_THOUGHTS.map((thought) => {
                  const isVisible = visibleThoughts.includes(thought.id)
                  const rotation = ((thought.id * 7) % 11) - 5
                  const yOffset = ((thought.id * 13) % 7) - 3
                  
                  return (
                    <motion.div
                      key={thought.id}
                      initial={{ opacity: 0, scale: 0.5, rotate: rotation * 2 }}
                      animate={isVisible ? { 
                        opacity: 1, 
                        scale: 1, 
                        rotate: rotation,
                        y: yOffset
                      } : { opacity: 0, scale: 0.5 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
                      className={`
                        px-2 py-1 rounded-md text-[11px] font-medium
                        ${CATEGORY_COLORS[thought.category]}
                        ${phase === 'processing' ? 'animate-pulse' : ''}
                      `}
                    >
                      {thought.text}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Idle state */}
            {phase === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-zinc-400 dark:text-zinc-500">
                  <Brain className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Start the demo to see chaotic thoughts appear</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Processing indicator */}
        <div className="flex items-center justify-center gap-4 py-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent" />
          
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}>
                <ArrowRight className="h-5 w-5 text-zinc-400 rotate-90" />
              </motion.div>
            )}
            {phase === 'dumping' && (
              <motion.div key="dumping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Mic className="h-6 w-6 text-purple-500 animate-pulse" />
                <span className="text-xs text-purple-600 dark:text-purple-400">Capturing everything...</span>
              </motion.div>
            )}
            {phase === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">AI organizing your thoughts...</p>
                  <div className="w-24 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1 overflow-hidden">
                    <motion.div className="h-full bg-indigo-500 rounded-full" style={{ width: `${processingProgress}%` }} />
                  </div>
                </div>
              </motion.div>
            )}
            {phase === 'organized' && (
              <motion.div key="organized" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Organized!</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent" />
        </div>

        {/* Bottom: Organized outputs - compact grid */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
            <Sparkles className="h-4 w-4 text-green-500" />
            Organized Output
          </div>
          
          <div className="min-h-[140px]">
            {phase === 'idle' && (
              <div className="flex items-center justify-center text-center text-zinc-400 dark:text-zinc-500 py-10">
                <div>
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Organized outputs will appear here</p>
                </div>
              </div>
            )}
            
            <div className="grid sm:grid-cols-2 gap-2">
              <AnimatePresence>
                {ORGANIZED_OUTPUTS.map((output, idx) => {
                  const Icon = OUTPUT_ICONS[output.type]
                  const isVisible = visibleOutputs.includes(idx)
                  
                  return isVisible && (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', bounce: 0.3 }}
                      className={`rounded-lg border-l-4 p-2.5 ${OUTPUT_COLORS[output.type]}`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
                            {output.title}
                          </p>
                          <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-2">
                            {output.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={handlePlay}
            disabled={phase !== 'idle' && phase !== 'organized'}
            className={`
              inline-flex items-center gap-2 rounded-lg px-5 py-2
              text-sm font-semibold text-white shadow-md transition-all
              ${phase !== 'idle' && phase !== 'organized'
                ? 'bg-zinc-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:scale-105'
              }
            `}
          >
            <Play className="h-4 w-4" />
            {phase === 'idle' ? 'Start Brain Dump' : 'Run Again'}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 p-4">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Why This Pattern Works (Especially for ADHD/Autistic Brains)
        </h3>
        <p className="text-sm text-purple-800 dark:text-purple-200">
          Many neurodivergent people benefit from externalizing their thoughts. Speaking everything 
          out loud—frustrations, ideas, blockers, random tangents—and having an AI reflect it back 
          organized creates the cognitive relief of &ldquo;getting it out of your head&rdquo; while also 
          producing actionable artifacts. It&apos;s like having a patient assistant who never judges 
          the chaos, just helps structure it.
        </p>
      </div>
    </div>
  )
}

