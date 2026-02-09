'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Scale,
  Mail,
  ClipboardList,
  Phone,
  Calculator,
  ChevronDown,
  ArrowRight,
  Play,
  RotateCcw,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { getAffiliateLink } from '@/lib/affiliate'

import {
  DOCUMENT_PIPELINE,
  LAWYER_SCENARIOS,
  CLIENT_CONSULTATION,
  TIME_SAVINGS,
  SPEED_COMPARISON,
  type LawyerScenario
} from './data'

const CAMPAIGN = 'voice-ai-lawyer-demo'

function getLink(product: 'wisprflow' | 'granola', placement: string) {
  return getAffiliateLink({
    product,
    campaign: CAMPAIGN,
    medium: 'demo',
    placement: placement as any
  })
}

function trackClick(product: 'wisprflow' | 'granola', context: string) {
  track('affiliate_click', { product, context, campaign: CAMPAIGN })
}

function trackSection(section: string) {
  track('lawyer_demo_section_view', { section, campaign: CAMPAIGN })
}

// ─── Affiliate CTA Button ───────────────────────────────────────────────────
function AffiliateButton({
  product,
  context,
  size = 'default'
}: {
  product: 'wisprflow' | 'granola'
  context: string
  size?: 'default' | 'large'
}) {
  const config = {
    wisprflow: {
      name: 'WisprFlow',
      icon: Mic,
      gradient: 'from-purple-600 to-indigo-600',
      hover: 'hover:from-purple-500 hover:to-indigo-500'
    },
    granola: {
      name: 'Granola',
      icon: Phone,
      gradient: 'from-teal-600 to-cyan-600',
      hover: 'hover:from-teal-500 hover:to-cyan-500'
    }
  }
  const c = config[product]
  const Icon = c.icon
  const link = getLink(product, context)

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick(product, context)}
      className={`
        inline-flex items-center gap-2 rounded-xl font-semibold text-white
        bg-gradient-to-r ${c.gradient} ${c.hover}
        shadow-md hover:shadow-lg transition-all
        ${size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2.5 text-sm'}
      `}
    >
      <Icon className={size === 'large' ? 'h-5 w-5' : 'h-4 w-4'} />
      Try {c.name} Free
      <ArrowRight className={size === 'large' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
    </a>
  )
}

// ─── Section observer hook ──────────────────────────────────────────────────
function useInView(threshold = 0.3): [React.RefCallback<HTMLElement>, boolean] {
  const [visible, setVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) observerRef.current.disconnect()
    if (!node) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observerRef.current?.disconnect()
        }
      },
      { threshold }
    )
    observerRef.current.observe(node)
  }, [threshold])

  return [ref, visible]
}

// ─── Typewriter effect ──────────────────────────────────────────────────────
function Typewriter({ text, active, speed = 30 }: { text: string; active: boolean; speed?: number }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    // Only clear when starting fresh (text changed), not when active becomes false
    if (!active) return
    
    setDisplayed('') // Clear for new text
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed]) // Removed 'active' from deps - only react to text changes

  return <>{displayed}<span className={active ? "animate-pulse" : "opacity-0"}>|</span></>
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: Hero
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-200"
      >
        <Scale className="h-4 w-4" />
        Built for Legal Professionals
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
      >
        Draft Faster. Bill More. Win Cases.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
      >
        See how attorneys use{' '}
        <a
          href={getLink('wisprflow', 'hero-text')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('wisprflow', 'hero-text')}
          className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          WisprFlow
        </a>
        {' '}and{' '}
        <a
          href={getLink('granola', 'hero-text')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('granola', 'hero-text')}
          className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Granola
        </a>
        {' '}to save 12+ hours per week on legal documentation.
      </motion.p>

      {/* Speed comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap justify-center gap-3 sm:gap-6"
      >
        <div className="text-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <div className="text-lg font-mono font-bold text-zinc-400">{SPEED_COMPARISON.phone.wpm}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wide">Phone WPM</div>
        </div>
        <div className="text-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <div className="text-lg font-mono font-bold text-zinc-500">{SPEED_COMPARISON.laptop.wpm}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wide">Laptop WPM</div>
        </div>
        <div className="flex items-center"><span className="text-xl">&rarr;</span></div>
        <div className="text-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200 dark:border-purple-700">
          <div className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">{SPEED_COMPARISON.voice.wpm}</div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-wide">Voice WPM</div>
        </div>
        <div className="flex items-center"><span className="text-xl">=</span></div>
        <div className="text-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700">
          <div className="text-lg font-mono font-bold text-green-600 dark:text-green-400">3-4x</div>
          <div className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-wide">Faster</div>
        </div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: Document Drafting Pipeline
// ═══════════════════════════════════════════════════════════════════════════════
function DocumentPipelineSection() {
  const [step, setStep] = useState<'idle' | 'dictating' | 'enhancing' | 'done'>('idle')
  const [sectionRef, visible] = useInView(0.3)

  useEffect(() => {
    if (visible) trackSection('document-pipeline')
  }, [visible])

  const startDemo = () => {
    setStep('dictating')
    track('lawyer_demo_document_start', { campaign: CAMPAIGN })
    setTimeout(() => setStep('enhancing'), 5000)
    setTimeout(() => setStep('done'), 8000)
  }

  const reset = () => setStep('idle')

  const data = DOCUMENT_PIPELINE.dictation

  return (
    <section ref={sectionRef} className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-slate-600">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Document Drafting Pipeline
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Dictate your argument. Get polished legal prose.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Document type label */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Scale className="h-4 w-4 inline mr-1.5" />
            Drafting: <span className="font-semibold">{data.documentType}</span>
          </span>
          <div className="flex items-center gap-2">
            {step === 'idle' && (
              <button
                onClick={startDemo}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
              >
                <Play className="h-3 w-3" /> Start Demo
              </button>
            )}
            {step === 'done' && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-500 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Replay
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-700">
          {/* Raw dictation */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Mic className={`h-4 w-4 ${step === 'dictating' ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`} />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                You dictate ({data.stats.dictationTime})
              </span>
            </div>
            <div className="min-h-[160px] text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-mono">
              {(step === 'dictating' || step === 'enhancing' || step === 'done') ? (
                <Typewriter text={data.rawDictation} active={step === 'dictating'} speed={20} />
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500 italic">Click &ldquo;Start Demo&rdquo; to see voice dictation in action...</span>
              )}
            </div>
          </div>

          {/* Enhanced output */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className={`h-4 w-4 ${step === 'enhancing' ? 'text-blue-500 animate-pulse' : step === 'done' ? 'text-blue-500' : 'text-zinc-400'}`} />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Court-ready output
              </span>
            </div>
            <div className="min-h-[160px] text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed">
              {step === 'enhancing' || step === 'done' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="whitespace-pre-line"
                >
                  {data.enhanced}
                </motion.div>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500 italic">AI-polished legal prose appears here...</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <AnimatePresence>
          {step === 'done' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-zinc-200 dark:border-zinc-700 bg-green-50 dark:bg-green-900/20 px-6 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-green-700 dark:text-green-400 font-semibold">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {data.stats.dictationTime} voice vs {data.stats.typingTime} typing
                  </span>
                </div>
                <span className="text-green-700 dark:text-green-400 font-bold">
                  85%+ time saved
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AffiliateButton product="wisprflow" context="document-pipeline" />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: Scenario Gallery
// ═══════════════════════════════════════════════════════════════════════════════
function ScenarioGallerySection() {
  const [active, setActive] = useState(0)
  const [sectionRef, visible] = useInView(0.3)

  useEffect(() => {
    if (visible) trackSection('scenarios')
  }, [visible])

  const scenario = LAWYER_SCENARIOS[active]

  return (
    <section ref={sectionRef} className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
          <ClipboardList className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            One Voice, Every Legal Task
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">WisprFlow formats your dictation for each context automatically.</p>
        </div>
      </div>

      {/* Scenario tabs */}
      <div className="flex flex-wrap gap-2">
        {LAWYER_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              setActive(i)
              track('lawyer_demo_scenario_click', { scenario: s.id, campaign: CAMPAIGN })
            }}
            className={`
              flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all
              ${i === active
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }
            `}
          >
            <span>{s.icon}</span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Active scenario */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden"
        >
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {scenario.icon} {scenario.context}
            </span>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              {scenario.timeSaved}
            </span>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-700">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Mic className="h-4 w-4 text-red-400" />
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">You dictate</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-mono">
                &ldquo;{scenario.rawDictation}&rdquo;
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">WisprFlow outputs</span>
              </div>
              <div className="text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-line">
                {scenario.polishedOutput}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <AffiliateButton product="wisprflow" context="scenarios" />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: Client Meeting Capture (Granola)
// ═══════════════════════════════════════════════════════════════════════════════
function ClientMeetingSection() {
  const [showAfter, setShowAfter] = useState(false)
  const [sectionRef, visible] = useInView(0.3)

  useEffect(() => {
    if (visible) trackSection('client-meetings')
  }, [visible])

  const data = CLIENT_CONSULTATION

  return (
    <section ref={sectionRef} className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600">
          <Phone className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Capture Every Client Consultation
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Granola records meetings invisibly &mdash; no bot, no notification to clients.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Toggle */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setShowAfter(false)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              !showAfter
                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-b-2 border-teal-500'
                : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Phone className="h-4 w-4 inline mr-1.5" />
            During the Consultation
          </button>
          <button
            onClick={() => {
              setShowAfter(true)
              track('lawyer_demo_meeting_after', { campaign: CAMPAIGN })
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              showAfter
                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-b-2 border-teal-500'
                : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 inline mr-1.5" />
            After the Consultation
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showAfter ? (
            <motion.div
              key="during"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{data.during.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {data.during.participants.join(' + ')} &middot; {data.during.duration}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">{data.during.status}</span>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 p-4 text-sm text-zinc-600 dark:text-zinc-300 space-y-3">
                <p className="italic">&ldquo;I was walking into the shopping center and the floor was completely wet near the entrance. There were no signs or cones or anything...&rdquo;</p>
                <p className="italic">&ldquo;The doctor said I have a herniated disc and a fractured wrist. I&apos;ve been doing physical therapy twice a week since November...&rdquo;</p>
                <p className="italic">&ldquo;I missed six weeks of work. My medical bills are already over $47,000 and I&apos;m still in treatment...&rdquo;</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                <p className="text-sm text-teal-800 dark:text-teal-200">
                  <span className="font-semibold">You&apos;re fully present.</span> No scribbling notes. No &ldquo;Can you repeat that?&rdquo;
                  Granola captures everything while you focus on building trust with your client.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-5"
            >
              {/* Summary */}
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Case Summary</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{data.after.summary}</p>
              </div>

              {/* Case Facts */}
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Case Facts</h4>
                <div className="flex flex-wrap gap-2">
                  {data.after.caseFacts.map((fact, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs text-blue-700 dark:text-blue-300">
                      {fact}
                    </span>
                  ))}
                </div>
              </div>

              {/* Liability Analysis */}
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Liability Analysis</h4>
                <div className="space-y-2">
                  {data.after.liabilityAnalysis.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                      <Scale className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Action Items</h4>
                <div className="space-y-2">
                  {data.after.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 p-3">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-teal-500 shrink-0" />
                      <div className="flex-1 text-sm">
                        <span className="text-zinc-900 dark:text-zinc-100">{item.task}</span>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {item.owner} &middot; Due: {item.due}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Dates */}
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Key Dates</h4>
                <div className="flex flex-wrap gap-2">
                  {data.after.keyDates.map((date, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs text-slate-700 dark:text-slate-300">
                      <Clock className="h-3 w-3 mr-1.5" />
                      {date}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                <p className="text-sm text-teal-800 dark:text-teal-200">
                  <span className="font-semibold">45 minutes of consultation &rarr; structured case notes in seconds.</span> Copy
                  directly into your case management system. Never miss a critical fact again.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AffiliateButton product="granola" context="client-meetings" />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: Time Savings Calculator
// ═══════════════════════════════════════════════════════════════════════════════
function TimeSavingsSection() {
  const [casesPerMonth, setCasesPerMonth] = useState(15)
  const [sectionRef, visible] = useInView(0.3)

  useEffect(() => {
    if (visible) trackSection('time-savings')
  }, [visible])

  const totalTyping = TIME_SAVINGS.reduce((sum, t) => sum + t.typing, 0)
  const totalVoice = TIME_SAVINGS.reduce((sum, t) => sum + t.voice, 0)
  const totalSaved = totalTyping - totalVoice
  const scaledSaved = totalSaved * (casesPerMonth / 15) // baseline is 15 cases/month
  const billableRate = 300 // average attorney hourly rate
  const monthlyValue = scaledSaved * 4 * billableRate

  return (
    <section ref={sectionRef} className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Your Weekly Time Savings
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">See how much time and billable revenue you recover.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Slider */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Active cases per month: <span className="font-bold text-blue-600 dark:text-blue-400">{casesPerMonth}</span>
          </label>
          <input
            type="range"
            min={5}
            max={50}
            value={casesPerMonth}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              setCasesPerMonth(val)
              track('lawyer_demo_calculator', { cases_per_month: val, campaign: CAMPAIGN })
            }}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-1">
            <span>5</span>
            <span>25</span>
            <span>50</span>
          </div>
        </div>

        {/* Task breakdown */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {TIME_SAVINGS.map((item) => {
            const saved = item.typing - item.voice
            const pct = Math.round((saved / item.typing) * 100)
            return (
              <div key={item.task} className="px-6 py-3 flex items-center gap-4">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.task}</div>
                  <div className="mt-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">-{saved} hrs</div>
                  <div className="text-xs text-zinc-400">{pct}% saved</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                Weekly time saved ({casesPerMonth} cases/month)
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {scaledSaved.toFixed(1)} hours/week
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-500">Potential billable recovery</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-400">
                ${monthlyValue.toLocaleString()}/month
              </div>
              <div className="text-xs text-zinc-400">at $300/hr avg</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6: Final CTA
// ═══════════════════════════════════════════════════════════════════════════════
function FinalCTASection() {
  return (
    <section className="pt-12 pb-8">
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-blue-900/20 dark:via-slate-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-8">
        <div className="text-center mb-8 space-y-3">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Ready to Save 12+ Hours Every Week?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Top attorneys don&apos;t type faster &mdash; they don&apos;t type at all.
            Both tools have free trials. No credit card required.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* WisprFlow card */}
          <a
            href={getLink('wisprflow', 'final-cta')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('wisprflow', 'final-cta')}
            className="group relative overflow-hidden rounded-2xl border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20 blur-3xl" />
            <div className="relative space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <Mic className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">WisprFlow</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Dictate briefs, emails, time entries, and case notes at 160+ WPM. Works in every app on your Mac.
              </p>
              <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Motions and briefs in minutes</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Works with Clio, MyCase, and every app</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> AI-formatted legal output</li>
              </ul>
              <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                Try WisprFlow Free <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </a>

          {/* Granola card */}
          <a
            href={getLink('granola', 'final-cta')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('granola', 'final-cta')}
            className="group relative overflow-hidden rounded-2xl border-2 border-transparent hover:border-teal-300 dark:hover:border-teal-600 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 opacity-20 blur-3xl" />
            <div className="relative space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Granola</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Capture every client consultation and meeting invisibly. No bot joins. Structured notes with action items.
              </p>
              <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Invisible &mdash; no bot, no disclosure</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Auto-extracts case facts and action items</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Mac, Windows, and iOS</li>
              </ul>
              <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                Try Granola Free <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </a>
        </div>

        {/* Related content */}
        <div className="mt-8 pt-6 border-t border-blue-200 dark:border-blue-800">
          <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-4">
            Learn more about voice AI for legal professionals
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/blog/best-voice-tools-for-lawyers-2026', label: 'Best Voice Tools for Lawyers 2026' },
              { href: '/blog/ai-dictation-for-legal-documents', label: 'AI Dictation for Legal Documents' },
              { href: '/blog/voice-notes-for-client-meetings-lawyers', label: 'Voice Notes for Client Meetings' },
              { href: '/blog/ai-tools-for-lawyers', label: 'AI Tools for Lawyers' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type SectionId = 'documents' | 'scenarios' | 'meetings' | 'savings'

const NAV_SECTIONS = [
  { id: 'documents' as SectionId, title: 'Document Pipeline', icon: FileText },
  { id: 'scenarios' as SectionId, title: 'Every Task', icon: ClipboardList },
  { id: 'meetings' as SectionId, title: 'Client Meetings', icon: Phone },
  { id: 'savings' as SectionId, title: 'Time Savings', icon: Calculator },
]

export default function LawyerDemoClient() {
  const [activeSection, setActiveSection] = useState<SectionId>('documents')

  useEffect(() => {
    track('lawyer_demo_view', { campaign: CAMPAIGN })
  }, [])

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="space-y-12">
      <HeroSection />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="sticky top-4 z-40 mx-auto max-w-3xl"
      >
        <div className="rounded-xl border border-zinc-200 bg-white/80 backdrop-blur-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900/80 p-2">
          <div className="flex justify-center gap-1">
            {NAV_SECTIONS.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`
                    flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all
                    ${activeSection === s.id
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }
                  `}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </motion.nav>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-zinc-400"
        >
          <span className="text-xs mb-1">Scroll to explore</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>

      <div id="documents"><DocumentPipelineSection /></div>
      <div id="scenarios"><ScenarioGallerySection /></div>
      <div id="meetings"><ClientMeetingSection /></div>
      <div id="savings"><TimeSavingsSection /></div>

      <FinalCTASection />
    </div>
  )
}
