'use client'

import Link from 'next/link'
import { Mic, Sparkles, Play, Waves } from 'lucide-react'

interface VoiceAIDemoCardProps {
  className?: string
}

export default function VoiceAIDemoCard({ className = '' }: VoiceAIDemoCardProps) {
  return (
    <div className={`my-8 ${className}`}>
      <Link href="/demos/voice-ai" className="block group">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700/50 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800/80 dark:to-zinc-900 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="voice-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="16" cy="16" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#voice-grid)" />
            </svg>
          </div>

          {/* Gradient accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

          {/* Animated sound wave decoration */}
          <div className="absolute -right-8 -top-8 w-32 h-32 opacity-10 dark:opacity-20">
            <Waves className="w-full h-full text-violet-500 animate-pulse" strokeWidth={1} />
          </div>

          {/* Video preview */}
          <div className="relative overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block bg-zinc-900 aspect-video object-cover"
            >
              <source src="https://zackproser.b-cdn.net/images/command-voice.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="relative p-6 md:p-8">
            <div className="flex items-start gap-4 md:gap-6">
              {/* Icon container with animated ring */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg">
                  <Mic className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2} />
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-xl border-2 border-violet-400/50 animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">
                    <Sparkles className="w-3 h-3" />
                    Interactive Demo
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  Experience Voice AI in Action
                </h3>

                <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  See how WisprFlow and Granola transform productivity with a live simulated meeting. 
                  Watch real-time transcription, AI-enhanced notes, and 179 WPM voice-to-text in action.
                </p>

                {/* CTA button */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold shadow-md group-hover:shadow-lg group-hover:scale-[1.02] transition-all duration-200">
                  <Play className="w-4 h-4" fill="currentColor" />
                  Try the Demo
                  <span className="ml-1 opacity-70">→</span>
                </div>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-zinc-200/80 dark:border-zinc-700/50">
              {['Real-time Transcription', 'AI Meeting Notes', 'Voice-First Coding'].map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

