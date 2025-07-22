'use client'

import RandomPortrait from '@/components/RandomPortrait'
import {
  LinkedInIcon,
  GitHubIcon,
  TwitterIcon
} from '@/components/SocialIcons'

export function ContactContent() {
  return (
    <div className="py-16 sm:py-24">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left column - Portrait and intro text */}
        <div className="lg:w-1/3 space-y-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
            Get in touch
          </h2>
          {/* Enlarged portrait (no animated ring) */}
          <div className="relative mx-auto lg:mx-0 w-full max-w-md transition-transform duration-300 hover:scale-105">
            <RandomPortrait width={400} height={400} />
          </div>
        </div>

        {/* Right column - Contact info */}
        <div className="lg:w-2/3 flex flex-col justify-center mt-8 lg:mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <a href="mailto:zackproser@gmail.com" className="flex items-center gap-3 p-4 rounded-xl border border-zinc-700 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Email</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">zackproser@gmail.com</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-zinc-700 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
              <LinkedInIcon className="h-6 w-6 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">LinkedIn</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">linkedin.com/in/zackproser</span>
              </div>
            </a>

            {/* GitHub */}
            <a href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-zinc-700 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
              <GitHubIcon className="h-6 w-6 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">GitHub</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">github.com/zackproser</span>
              </div>
            </a>

            {/* Twitter */}
            <a href="https://twitter.com/zackproser" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-zinc-700 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
              <TwitterIcon className="h-6 w-6 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">Twitter</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">twitter.com/zackproser</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 