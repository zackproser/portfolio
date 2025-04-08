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
          <h2 className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            Let&apos;s Connect
          </h2>
          <p className="text-lg leading-7 dark:text-zinc-400 text-zinc-600">
            Have a project in mind? Need expert advice? Or just want to chat about the latest in tech?
            I&apos;d love to hear from you.
          </p>
          
          <div className="relative w-full max-w-sm mx-auto lg:mx-0 aspect-square">
            <RandomPortrait />
          </div>
        </div>

        {/* Right column - Contact info */}
        <div className="lg:w-2/3 flex flex-col justify-center mt-8 lg:mt-0">
          <div className="space-y-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">Email</span>
              </div>
              <a href="mailto:zackproser@gmail.com" className="text-blue-600 dark:text-blue-300 font-medium hover:underline">
                zackproser@gmail.com
              </a>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <LinkedInIcon className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">LinkedIn</span>
              </div>
              <a href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 font-medium hover:underline">
                linkedin.com/in/zackproser
              </a>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <GitHubIcon className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">GitHub</span>
              </div>
              <a href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 font-medium hover:underline">
                github.com/zackproser
              </a>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <TwitterIcon className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">Twitter</span>
              </div>
              <a href="https://twitter.com/zackproser" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 font-medium hover:underline">
                twitter.com/zackproser
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 