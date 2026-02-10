'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Home,
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
  Building2,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { track } from '@vercel/analytics'

import {
  LISTING_PIPELINE,
  REALTOR_SCENARIOS,
  BUYER_CONSULTATION,
  TIME_SAVINGS,
  SPEED_COMPARISON,
  type RealtorScenario
} from './data'

import {
  getLink,
  trackClick,
  AffiliateButton,
  useInView,
  Typewriter
} from '../voice-ai-lawyers/shared-demo-utils'

const CAMPAIGN = 'voice-ai-realtor-demo'

function trackSection(section: string) {
  track('realtor_demo_section_view', { section, campaign: CAMPAIGN })
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
        className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-4 py-1.5 text-sm font-medium text-amber-800 dark:text-amber-200"
      >
        <Building2 className="h-4 w-4" />
        Built for Real Estate Agents
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
      >
        Stop Typing. Start Closing.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
      >
        See how top-producing agents use{' '}
        <a
          href={getLink('wisprflow', 'hero-text', CAMPAIGN)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('wisprflow', 'hero-text', CAMPAIGN)}
          className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          WisprFlow
        </a>
        {' '}and{' '}
        <a
          href={getLink('granola', 'hero-text', CAMPAIGN)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('granola', 'hero-text', CAMPAIGN)}
          className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Granola
        </a>
        {' '}to save 11+ hours per week on documentation.
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
        <div className="flex items-center"><span className="text-xl">→</span></div>
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
// SECTION 2: Listing Description Pipeline
// ═══════════════════════════════════════════════════════════════════════════════
function ListingPipelineSection() {
  const [step, setStep] = useState<'idle' | 'dictating' | 'enhancing' | 'done'>('idle')
  const [sectionRef, visible] = useInView(0.3)

  useEffect(() => {
    if (visible) trackSection('listing-pipeline')
  }, [visible])

  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const startDemo = () => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    setStep('dictating')
    track('realtor_demo_listing_start', { campaign: CAMPAIGN })
    timeoutsRef.current.push(setTimeout(() => setStep('enhancing'), 4000))
    timeoutsRef.current.push(setTimeout(() => setStep('done'), 7000))
  }

  const reset = () => {
    // Clear all timeouts before resetting
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setStep('idle')
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  const data = LISTING_PIPELINE.walkThrough

  return (
    <section ref={sectionRef} className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
          <Home className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Listing Description Pipeline
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Walk the property. Dictate what you see. Get polished MLS copy.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Room label */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            📍 Walking through: <span className="font-semibold">{data.room}</span>
          </span>
          <div className="flex items-center gap-2">
            {step === 'idle' && (
              <button
                onClick={startDemo}
                className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500 transition-colors"
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
                You speak ({data.stats.dictationTime})
              </span>
            </div>
            <div className="min-h-[120px] text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-mono">
              {(step === 'dictating' || step === 'enhancing' || step === 'done') ? (
                <Typewriter text={data.rawDictation} active={step === 'dictating'} speed={25} />
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500 italic">Click &quot;Start Demo&quot; to see voice dictation in action...</span>
              )}
            </div>
          </div>

          {/* Enhanced output */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className={`h-4 w-4 ${step === 'enhancing' ? 'text-purple-500 animate-pulse' : step === 'done' ? 'text-purple-500' : 'text-zinc-400'}`} />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                MLS-ready output
              </span>
            </div>
            <div className="min-h-[120px] text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed">
              {step === 'enhancing' || step === 'done' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  {data.enhanced}
                </motion.div>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500 italic">AI-polished copy appears here...</span>
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
                  80%+ time saved
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AffiliateButton product="wisprflow" context="listing-pipeline" campaign={CAMPAIGN} />
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

  const scenario = REALTOR_SCENARIOS[active]

  return (
    <section ref={sectionRef} className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
          <ClipboardList className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            One Voice, Every App
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">WisprFlow formats your dictation for each context automatically.</p>
        </div>
      </div>

      {/* Scenario tabs */}
      <div className="flex flex-wrap gap-2">
        {REALTOR_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              setActive(i)
              track('realtor_demo_scenario_click', { scenario: s.id, campaign: CAMPAIGN })
            }}
            className={`
              flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all
              ${i === active
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 shadow-sm'
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

      <AffiliateButton product="wisprflow" context="scenarios" campaign={CAMPAIGN} />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: Client Call Capture (Granola)
// ═══════════════════════════════════════════════════════════════════════════════
function ClientCallSection() {
  const [showAfter, setShowAfter] = useState(false)
  const [sectionRef, visible] = useInView(0.3)

  useEffect(() => {
    if (visible) trackSection('client-calls')
  }, [visible])

  const data = BUYER_CONSULTATION

  return (
    <section ref={sectionRef} className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600">
          <Phone className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Capture Every Client Conversation
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Granola records calls invisibly — no bot, no notification to clients.</p>
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
            During the Call
          </button>
          <button
            onClick={() => {
              setShowAfter(true)
              track('realtor_demo_meeting_after', { campaign: CAMPAIGN })
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              showAfter
                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-b-2 border-teal-500'
                : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 inline mr-1.5" />
            After the Call
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
                <p className="italic">&ldquo;So our budget is $475K max, but we&apos;d prefer to stay under $450K if possible...&rdquo;</p>
                <p className="italic">&ldquo;Maria works from home so we definitely need a dedicated office space, not just a nook...&rdquo;</p>
                <p className="italic">&ldquo;The kids are starting elementary next fall so school district is really important to us...&rdquo;</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                <p className="text-sm text-teal-800 dark:text-teal-200">
                  <span className="font-semibold">You&apos;re fully present.</span> No scribbling notes. No &ldquo;Can you repeat that?&rdquo;
                  Granola captures everything while you focus on building the relationship.
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
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Meeting Summary</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{data.after.summary}</p>
              </div>

              {/* Client Preferences */}
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Client Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {data.after.clientPreferences.map((pref, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs text-blue-700 dark:text-blue-300">
                      {pref}
                    </span>
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

              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                <p className="text-sm text-teal-800 dark:text-teal-200">
                  <span className="font-semibold">35 minutes of conversation → structured notes in seconds.</span> Copy
                  directly into your CRM. Never miss a client preference again.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AffiliateButton product="granola" context="client-calls" campaign={CAMPAIGN} />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: Time Savings Calculator
// ═══════════════════════════════════════════════════════════════════════════════
function TimeSavingsSection() {
  const [listingsPerWeek, setListingsPerWeek] = useState(3)
  const [sectionRef, visible] = useInView(0.3)

  useEffect(() => {
    if (visible) trackSection('time-savings')
  }, [visible])

  const totalTyping = TIME_SAVINGS.reduce((sum, t) => sum + t.typing, 0)
  const totalVoice = TIME_SAVINGS.reduce((sum, t) => sum + t.voice, 0)
  const totalSaved = totalTyping - totalVoice
  const scaledSaved = totalSaved * (listingsPerWeek / 3) // baseline is 3 listings/week

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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">See exactly how much time you get back.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Slider */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Listings per week: <span className="font-bold text-purple-600 dark:text-purple-400">{listingsPerWeek}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={listingsPerWeek}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              setListingsPerWeek(val)
              track('realtor_demo_calculator', { listings_per_week: val, campaign: CAMPAIGN })
            }}
            className="w-full mt-2 accent-purple-600"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
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
                Weekly time saved ({listingsPerWeek} listings/week)
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {scaledSaved.toFixed(1)} hours/week
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-500">That&apos;s</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-400">
                {(scaledSaved * 4).toFixed(0)} hrs/month
              </div>
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
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-rose-900/20 border border-amber-200 dark:border-amber-800 p-8">
        <div className="text-center mb-8 space-y-3">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Ready to Save 11+ Hours Every Week?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Top-producing agents don&apos;t type faster — they don&apos;t type at all.
            Both tools have free trials. No credit card required.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* WisprFlow card */}
          <a
            href={getLink('wisprflow', 'final-cta', CAMPAIGN)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('wisprflow', 'final-cta', CAMPAIGN)}
            className="group relative overflow-hidden rounded-2xl border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20 blur-3xl" />
            <div className="relative space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <Mic className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">WisprFlow</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Dictate listings, emails, CRM notes, and offer docs at 160+ WPM. Works in every app on your Mac.
              </p>
              <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> MLS listings in 2 minutes</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Works with every CRM</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> AI-formatted output</li>
              </ul>
              <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                Try WisprFlow Free <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </a>

          {/* Granola card */}
          <a
            href={getLink('granola', 'final-cta', CAMPAIGN)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('granola', 'final-cta', CAMPAIGN)}
            className="group relative overflow-hidden rounded-2xl border-2 border-transparent hover:border-teal-300 dark:hover:border-teal-600 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-zinc-800 dark:to-zinc-900 p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 opacity-20 blur-3xl" />
            <div className="relative space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Granola</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Capture every client call and meeting invisibly. No bot joins. Structured notes with action items.
              </p>
              <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Invisible — no bot</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Auto-extracts action items</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Mac, Windows, and iOS</li>
              </ul>
              <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                Try Granola Free <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </a>
        </div>

        {/* Related content */}
        <div className="mt-8 pt-6 border-t border-amber-200 dark:border-amber-800">
          <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-4">
            Learn more about voice AI for real estate
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/blog/best-voice-tools-for-realtors-2026', label: 'Best Voice Tools for Realtors 2026' },
              { href: '/blog/ai-listing-description-generator', label: 'AI Listing Description Generator' },
              { href: '/blog/voice-crm-for-real-estate', label: 'Voice CRM for Real Estate' },
              { href: '/blog/ai-voice-tools-for-real-estate', label: 'AI Voice Tools for Real Estate' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-sm transition-all"
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

type SectionId = 'listings' | 'scenarios' | 'calls' | 'savings'

const NAV_SECTIONS = [
  { id: 'listings' as SectionId, title: 'Listing Pipeline', icon: Home },
  { id: 'scenarios' as SectionId, title: 'Every App', icon: ClipboardList },
  { id: 'calls' as SectionId, title: 'Client Calls', icon: Phone },
  { id: 'savings' as SectionId, title: 'Time Savings', icon: Calculator },
]

export default function RealtorDemoClient() {
  const [activeSection, setActiveSection] = useState<SectionId>('listings')

  useEffect(() => {
    track('realtor_demo_view', { campaign: CAMPAIGN })
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
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
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

      <div id="listings"><ListingPipelineSection /></div>
      <div id="scenarios"><ScenarioGallerySection /></div>
      <div id="calls"><ClientCallSection /></div>
      <div id="savings"><TimeSavingsSection /></div>

      <FinalCTASection />
    </div>
  )
}
