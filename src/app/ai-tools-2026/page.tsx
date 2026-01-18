'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { track } from '@vercel/analytics'
import { sendGTMEvent } from '@next/third-parties/google'
import {
  Mic,
  Calendar,
  Brain,
  FileText,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  Shield
} from 'lucide-react'

export default function AITools2026Page() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)
  const [bottomEmail, setBottomEmail] = useState('')
  const [bottomFormSuccess, setBottomFormSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent, position: string) => {
    e.preventDefault()
    const emailValue = position === 'hero' ? email : bottomEmail
    try {
      await fetch('/api/form', {
        body: JSON.stringify({ email: emailValue, referrer: '/ai-tools-2026', tags: ['ai-tools-lead-magnet'] }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      sendGTMEvent({ event: 'newsletter-signup-conversion', method: 'newsletter', source: '/ai-tools-2026', position })
      track('newsletter-signup', { method: 'newsletter', source: '/ai-tools-2026', position })
      if (position === 'hero') {
        setFormSuccess(true)
        setEmail('')
      } else {
        setBottomFormSuccess(true)
        setBottomEmail('')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <main className={`min-h-screen transition-all duration-500 ${
      isDark ? 'bg-slate-950' : 'bg-parchment-50'
    }`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden py-16 md:py-24 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
          : 'bg-gradient-to-b from-white via-parchment-50 to-parchment-100'
      }`}>
        {/* Light mode texture */}
        {!isDark && (
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '300px 300px',
            }}
          />
        )}

        {/* Dark mode grid */}
        {isDark && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        )}

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ${
              isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-burnt-400/10 text-burnt-500'
            }`}>
              Updated January 2026
            </span>

            {/* Main Headline */}
            <h1
              className={`font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 ${
                isDark ? 'text-slate-100' : 'text-charcoal-50'
              }`}
              style={{
                textShadow: isDark
                  ? '2px 2px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(255,255,255,0.1)'
                  : '2px 2px 0 rgba(255,255,255,0.9), -1px -1px 0 rgba(0,0,0,0.08)',
              }}
            >
              Skip the AI Overwhelm.
              <span className={`block ${isDark ? '!text-amber-400' : '!text-burnt-400'}`}>
                Start Here.
              </span>
            </h1>

            {/* Subheadline */}
            <p className={`text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-parchment-600'
            }`}>
              If you&apos;re a small business owner wondering which AI tools actually matter right now,
              you&apos;re not behind. You&apos;re just starting in 2026 instead of 2023—and that means
              you get to skip the hype cycles and dead ends. These four tools are what I&apos;d install
              on day one.
            </p>

            {/* Author credibility */}
            <div className={`flex items-center justify-center gap-4 mb-8 ${
              isDark ? 'text-slate-400' : 'text-parchment-500'
            }`}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">4,000+ newsletter subscribers</span>
              </div>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">14 years shipping production systems</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className={`max-w-md mx-auto p-6 rounded-2xl ${
              isDark ? 'bg-slate-800/60 border border-slate-700' : 'bg-white border border-parchment-200 shadow-lg'
            }`}>
              <p className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-charcoal-100'}`}>
                Get the full breakdown + updates when new tools earn a spot
              </p>
              {formSuccess ? (
                <div className={`py-3 px-4 rounded-lg ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'}`}>
                  <p className="font-semibold">You&apos;re in! Check your inbox.</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleNewsletterSubmit(e, 'hero')} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                        : 'bg-white border-parchment-300 text-charcoal-50 placeholder:text-parchment-400'
                    }`}
                    required
                  />
                  <Button
                    type="submit"
                    className={`font-semibold ${
                      isDark
                        ? 'bg-amber-500 hover:bg-amber-400 text-white'
                        : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                    }`}
                  >
                    Send it
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className={`py-12 ${isDark ? 'bg-slate-900' : 'bg-parchment-100'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Brain, label: 'Claude', desc: 'Thinking partner' },
                { icon: Mic, label: 'WisprFlow', desc: '179 WPM voice' },
                { icon: Calendar, label: 'Granola', desc: 'Meeting memory' },
                { icon: FileText, label: 'Claude Max', desc: 'Document mastery' },
              ].map((tool) => (
                <div
                  key={tool.label}
                  className={`p-4 rounded-xl text-center ${
                    isDark
                      ? 'bg-slate-800/50 border border-slate-700'
                      : 'bg-white border border-parchment-200'
                  }`}
                >
                  <tool.icon className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-charcoal-50'}`}>{tool.label}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tool 1: Claude Code & Desktop */}
      <section className={`py-16 md:py-20 ${isDark ? 'bg-slate-950' : 'bg-parchment-50'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                }`}>
                  #1 Thinking Partner
                </span>
                <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-charcoal-50'
                }`}>
                  Claude Code & Claude Desktop
                </h2>
                <p className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  I run most of my thinking through Claude now. When I need to plan a project, draft a proposal,
                  or work through a problem at 3am, Claude is there with unlimited patience. I dictate messy
                  thoughts and get back structured plans. For coding, Claude Code works directly from my terminal
                  to ship real changes.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    'Turns voice dumps into structured tickets and PR descriptions',
                    'Integrates with Oura Ring for biometric-aware planning',
                    'Provides unlimited patience for anxious loops',
                    'Claude Code ships production code from the command line',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                      <span className={isDark ? 'text-slate-300' : 'text-parchment-600'}>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/blog/claude-external-brain-adhd-autistic"
                    className={`inline-flex items-center gap-2 font-semibold ${
                      isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'
                    }`}
                  >
                    Read: Claude as External Brain
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className={`relative rounded-2xl overflow-hidden ${
                isDark ? 'ring-2 ring-amber-500/30' : 'ring-1 ring-parchment-300 shadow-xl'
              }`}>
                <Image
                  src="https://zackproser.b-cdn.net/images/claude.webp"
                  alt="Claude Desktop interface showing conversation"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool 2: WisprFlow */}
      <section className={`py-16 md:py-20 ${isDark ? 'bg-slate-900' : 'bg-parchment-100'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className={`relative rounded-2xl overflow-hidden order-2 md:order-1 ${
                isDark ? 'ring-2 ring-amber-500/30' : 'ring-1 ring-parchment-300 shadow-xl'
              }`}>
                <a href="https://ref.wisprflow.ai/zack-proser" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="https://zackproser.b-cdn.net/images/wisprflow.webp"
                    alt="WisprFlow voice-to-text interface"
                    width={600}
                    height={400}
                    className="w-full hover:scale-105 transition-transform"
                  />
                </a>
              </div>

              <div className="order-1 md:order-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  #2 Voice Interface
                </span>
                <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-charcoal-50'
                }`}>
                  WisprFlow
                </h2>
                <p className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  I type at 90 words per minute. I speak at 179. WisprFlow runs in the background on macOS and
                  turns my voice into polished text wherever my cursor is—emails, Slack, code editors, anywhere.
                  It cleans up filler words and fixes grammar automatically. I pace around my office now instead
                  of hunching over a keyboard.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    'Works everywhere: Cursor, Chrome, Slack, Claude Desktop',
                    'AI auto-edits remove "um" and fix grammar in real-time',
                    'Personal dictionary learns your vocabulary',
                    'Better posture—pace around while coding',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                      <span className={isDark ? 'text-slate-300' : 'text-parchment-600'}>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://ref.wisprflow.ai/zack-proser"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('affiliate_click', { product: 'wisprflow', source: 'ai-tools-2026' })}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-amber-500 hover:bg-amber-400 text-white'
                        : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Try WisprFlow Free
                  </a>
                  <Link
                    href="/blog/wisprflow-review"
                    className={`inline-flex items-center gap-2 font-semibold ${
                      isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'
                    }`}
                  >
                    Read full review
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool 3: Granola */}
      <section className={`py-16 md:py-20 ${isDark ? 'bg-slate-950' : 'bg-parchment-50'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'
                }`}>
                  #3 Meeting Intelligence
                </span>
                <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-charcoal-50'
                }`}>
                  Granola
                </h2>
                <p className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  I used to split my attention between listening and typing notes. Now Granola captures every
                  meeting automatically—no bot joining the call, no awkward &quot;is it okay if I record this?&quot;
                  It pulls audio directly from my device and gives me searchable transcripts with action items
                  extracted. I show up to meetings fully present now.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    'No bot joins—captures audio directly, feels natural',
                    'Automatic meeting detection from your calendar',
                    'Templates for discovery calls, 1:1s, sales calls',
                    'iOS app captures coffee meetings and hallway chats',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                      <span className={isDark ? 'text-slate-300' : 'text-parchment-600'}>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://go.granola.ai/zack-proser"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('affiliate_click', { product: 'granola', source: 'ai-tools-2026' })}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-amber-500 hover:bg-amber-400 text-white'
                        : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Try Granola Free
                  </a>
                  <Link
                    href="/blog/granola-ai-review"
                    className={`inline-flex items-center gap-2 font-semibold ${
                      isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'
                    }`}
                  >
                    Read full review
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className={`relative rounded-2xl overflow-hidden ${
                isDark ? 'ring-2 ring-amber-500/30' : 'ring-1 ring-parchment-300 shadow-xl'
              }`}>
                <a href="https://go.granola.ai/zack-proser" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="https://zackproser.b-cdn.net/images/granola-hero.webp"
                    alt="Granola meeting notes interface"
                    width={600}
                    height={400}
                    className="w-full hover:scale-105 transition-transform"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool 4: Claude Max */}
      <section className={`py-16 md:py-20 ${isDark ? 'bg-slate-900' : 'bg-parchment-100'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className={`relative rounded-2xl overflow-hidden order-2 md:order-1 ${
                isDark ? 'ring-2 ring-amber-500/30' : 'ring-1 ring-parchment-300 shadow-xl'
              }`}>
                <Image
                  src="https://zackproser.b-cdn.net/images/claude-chat.webp"
                  alt="Claude Max interface with extended context"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>

              <div className="order-1 md:order-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                }`}>
                  #4 For Document-Heavy Work
                </span>
                <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-charcoal-50'
                }`}>
                  Claude Max Plan
                </h2>
                <p className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                  Most small business owners deal with long documents—contracts, proposals, financial reports.
                  The Max plan gives you enough context to drop in a 50-page contract and ask questions about it.
                  No more getting cut off mid-document. I use it to cross-reference multiple files at once and
                  get real analysis instead of summaries.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    'Extended context for full document analysis',
                    'Upload contracts, financial reports, legal docs',
                    'Cross-reference multiple documents at once',
                    'Priority access during peak usage',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                      <span className={isDark ? 'text-slate-300' : 'text-parchment-600'}>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl mb-6 ${
                  isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-parchment-200'
                }`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                    <strong className={isDark ? 'text-white' : 'text-charcoal-50'}>Best for:</strong> Small business
                    owners processing contracts, consultants analyzing client materials, anyone who regularly works
                    with 20+ page documents.
                  </p>
                </div>

                <Link
                  href="/blog/in-the-llm-i-saw-myself"
                  className={`inline-flex items-center gap-2 font-semibold ${
                    isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'
                  }`}
                >
                  Read: How Claude Changed How I Work
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Stack Summary */}
      <section className={`py-16 md:py-20 ${isDark ? 'bg-slate-950' : 'bg-parchment-50'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-charcoal-50'
              }`}>
                The Complete Stack
              </h2>
              <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                How these tools work together
              </p>
            </div>

            <div className={`p-8 rounded-2xl ${
              isDark ? 'bg-slate-800/60 border border-slate-700' : 'bg-white border border-parchment-200 shadow-xl'
            }`}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-amber-500/20' : 'bg-burnt-400/10'
                  }`}>
                    <Mic className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                      Morning: Voice-first capture
                    </h3>
                    <p className={isDark ? 'text-slate-300' : 'text-parchment-600'}>
                      WisprFlow captures brain dumps while walking. Claude Desktop turns rambles into
                      structured tickets and briefs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-amber-500/20' : 'bg-burnt-400/10'
                  }`}>
                    <Calendar className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                      Meetings: Full presence
                    </h3>
                    <p className={isDark ? 'text-slate-300' : 'text-parchment-600'}>
                      Granola runs silently in every call. I engage fully instead of frantically
                      typing. Action items and decisions get extracted automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-amber-500/20' : 'bg-burnt-400/10'
                  }`}>
                    <FileText className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                      Deep work: Document analysis
                    </h3>
                    <p className={isDark ? 'text-slate-300' : 'text-parchment-600'}>
                      Claude Max handles the contract reviews, report analysis, and cross-referencing
                      that used to eat entire afternoons.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-amber-500/20' : 'bg-burnt-400/10'
                  }`}>
                    <Brain className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                      Shipping: Claude Code
                    </h3>
                    <p className={isDark ? 'text-slate-300' : 'text-parchment-600'}>
                      When it&apos;s time to ship, Claude Code handles the implementation from the
                      command line while I review and steer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className={`py-16 ${isDark ? 'bg-slate-900' : 'bg-parchment-100'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className={`p-8 rounded-2xl ${
              isDark ? 'bg-slate-800/60 border border-amber-500/30' : 'bg-white border border-burnt-400/20 shadow-xl'
            }`}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src="https://zackproser.b-cdn.net/images/zack-proser-portrait.webp"
                    alt="Zack Proser"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className={`text-lg mb-4 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
                    &quot;I spent three years testing every AI tool that came out. Most were noise.
                    These four stuck because they solve real problems I have every day—thinking through
                    complex decisions, capturing ideas faster than I can type, remembering what happened
                    in meetings, and processing the mountain of documents that comes with running a business.&quot;
                  </p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-charcoal-50'}`}>
                    Zack Proser
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                    AI Engineer at WorkOS • Previously Staff DevRel at Pinecone
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 ${
        isDark
          ? 'bg-gradient-to-b from-slate-900 to-slate-950'
          : 'bg-gradient-to-b from-parchment-100 to-parchment-50'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-charcoal-50'
            }`}>
              Get Updates When This Changes
            </h2>
            <p className={`text-lg mb-8 ${isDark ? 'text-slate-300' : 'text-parchment-600'}`}>
              The AI landscape moves fast. I&apos;ll let you know when a tool earns or loses its spot,
              and share what&apos;s actually working for small business owners.
            </p>

            <div className={`p-6 rounded-2xl ${
              isDark ? 'bg-slate-800/60 border border-slate-700' : 'bg-white border border-parchment-200 shadow-xl'
            }`}>
              {bottomFormSuccess ? (
                <div className={`py-4 px-6 rounded-lg ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'}`}>
                  <p className="font-semibold text-lg">Neural Network Activated! You&apos;re in.</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleNewsletterSubmit(e, 'bottom')} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={bottomEmail}
                    onChange={(e) => setBottomEmail(e.target.value)}
                    className={`flex-1 h-12 ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                        : 'bg-white border-parchment-300 text-charcoal-50 placeholder:text-parchment-400'
                    }`}
                    required
                  />
                  <Button
                    type="submit"
                    className={`h-12 px-8 font-semibold ${
                      isDark
                        ? 'bg-amber-500 hover:bg-amber-400 text-white'
                        : 'bg-burnt-400 hover:bg-burnt-500 text-white'
                    }`}
                  >
                    Join 4,000+ subscribers
                  </Button>
                </form>
              )}
              <p className={`text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-parchment-400'}`}>
                <Shield className="w-3 h-3 inline mr-1" />
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Quick Links */}
            <div className={`mt-12 pt-8 border-t ${isDark ? 'border-slate-800' : 'border-parchment-200'}`}>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
                Explore more
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/blog/wisprflow-review"
                  className={`text-sm font-medium ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'}`}
                >
                  WisprFlow Deep Dive →
                </Link>
                <Link
                  href="/blog/granola-ai-review"
                  className={`text-sm font-medium ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'}`}
                >
                  Granola Review →
                </Link>
                <Link
                  href="/blog/claude-external-brain-adhd-autistic"
                  className={`text-sm font-medium ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'}`}
                >
                  Claude as External Brain →
                </Link>
                <Link
                  href="/blog/best-ai-voice-tools-2025"
                  className={`text-sm font-medium ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-burnt-400 hover:text-burnt-500'}`}
                >
                  Full Voice Stack →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
