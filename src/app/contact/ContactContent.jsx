'use client'

import RandomPortrait from '@/components/RandomPortrait'
import {
  LinkedInIcon,
  GitHubIcon,
  TwitterIcon
} from '@/components/SocialIcons'

export function ContactContent() {
  return (
    <div className="dark:bg-zinc-900/50 bg-white/50 py-16 sm:py-24 rounded-2xl backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-16 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight dark:text-zinc-200 text-zinc-800">
                Let&apos;s Connect
              </h2>
              <p className="mt-4 text-lg leading-7 dark:text-zinc-400 text-zinc-600">
                Have a project in mind? Need expert advice? Or just want to chat about the latest in tech?
                I&apos;d love to hear from you.
              </p>
              
              <div className="relative h-80 w-64 md:h-96 md:w-80 mx-auto lg:mx-0">
                <RandomPortrait />
                <div className="absolute bottom-0 left-0 right-0 text-center p-2 bg-gradient-to-t from-zinc-900/80 to-transparent dark:text-blue-100 text-white rounded-b-2xl">
                  <p className="font-medium">Hover/click to change image</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              <div className="rounded-2xl bg-white dark:bg-zinc-800/80 p-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold leading-7 dark:text-white text-zinc-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </h3>
                <dl className="mt-4 space-y-1 text-md leading-6 dark:text-zinc-300 text-zinc-600">
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <a className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" href="mailto:zackproser@gmail.com">
                        zackproser@gmail.com
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="rounded-2xl bg-white dark:bg-zinc-800/80 p-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold leading-7 dark:text-white text-zinc-900 flex items-center gap-2">
                  <LinkedInIcon className="w-6 h-6 text-blue-600" />
                  LinkedIn
                </h3>
                <dl className="mt-4 space-y-1 text-md leading-6 dark:text-zinc-300 text-zinc-600">
                  <div>
                    <dt className="sr-only">LinkedIn Profile</dt>
                    <dd>
                      <a className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer">
                        linkedin.com/in/zackproser
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="rounded-2xl bg-white dark:bg-zinc-800/80 p-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold leading-7 dark:text-white text-zinc-900 flex items-center gap-2">
                  <GitHubIcon className="w-6 h-6 dark:text-white text-black" />
                  GitHub
                </h3>
                <dl className="mt-4 space-y-1 text-md leading-6 dark:text-zinc-300 text-zinc-600">
                  <div>
                    <dt className="sr-only">GitHub</dt>
                    <dd>
                      <a className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer">
                        github.com/zackproser
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="rounded-2xl bg-white dark:bg-zinc-800/80 p-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold leading-7 dark:text-white text-zinc-900 flex items-center gap-2">
                  <TwitterIcon className="w-6 h-6 text-blue-400" />
                  Twitter
                </h3>
                <dl className="mt-4 space-y-1 text-md leading-6 dark:text-zinc-300 text-zinc-600">
                  <div>
                    <dt className="sr-only">Twitter</dt>
                    <dd>
                      <a className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" href="https://twitter.com/zackproser" target="_blank" rel="noopener noreferrer">
                        twitter.com/zackproser
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-200 dark:border-zinc-700 pt-8">
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              Typically responds within 24-48 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 