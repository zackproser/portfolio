'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import RandomPortrait from '@/components/RandomPortrait'
import {
  LinkedInIcon,
  GitHubIcon,
  TwitterIcon
} from '@/components/SocialIcons'
import { Mail } from 'lucide-react'

export function ContactContent() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
        : 'bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-200'
    }`}>
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`font-serif text-4xl md:text-5xl font-extrabold mb-4 ${
              isDark ? 'text-amber-400' : 'text-burnt-400'
            }`}>
              Get in Touch
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-parchment-600'
            }`}>
              Have a project in mind? Let&apos;s discuss how I can help.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left column - Portrait */}
            <div className="lg:w-1/3">
              <div className={`relative mx-auto w-full max-w-xs rounded-2xl overflow-hidden shadow-xl ${
                isDark ? 'ring-2 ring-amber-500/30' : 'ring-1 ring-burnt-400/20'
              }`}>
                <RandomPortrait width={300} height={300} />
              </div>
            </div>

            {/* Right column - Contact options */}
            <div className="lg:w-2/3 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <a
                  href="mailto:zackproser@gmail.com"
                  className={`flex items-center gap-4 p-5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg ${
                    isDark
                      ? 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50'
                      : 'bg-white border border-parchment-200 hover:border-burnt-400/50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-burnt-400/10'}`}>
                    <Mail className={`h-6 w-6 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-charcoal-50'}`}>Email</span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>zackproser@gmail.com</span>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/zackproser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg ${
                    isDark
                      ? 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50'
                      : 'bg-white border border-parchment-200 hover:border-burnt-400/50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-burnt-400/10'}`}>
                    <LinkedInIcon className={`h-6 w-6 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-charcoal-50'}`}>LinkedIn</span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>Connect with me</span>
                  </div>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/zackproser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg ${
                    isDark
                      ? 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50'
                      : 'bg-white border border-parchment-200 hover:border-burnt-400/50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-burnt-400/10'}`}>
                    <GitHubIcon className={`h-6 w-6 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-charcoal-50'}`}>GitHub</span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>See my code</span>
                  </div>
                </a>

                {/* Twitter */}
                <a
                  href="https://twitter.com/zackproser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg ${
                    isDark
                      ? 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50'
                      : 'bg-white border border-parchment-200 hover:border-burnt-400/50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-burnt-400/10'}`}>
                    <TwitterIcon className={`h-6 w-6 ${isDark ? 'text-amber-400' : 'text-burnt-400'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-charcoal-50'}`}>Twitter</span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>Follow me</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
