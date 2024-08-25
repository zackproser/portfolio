'use client'

import Link from 'next/link'
import RandomImage from './RandomImage'

const ButtonLink = ({ href, children, external = false }) => {
  const className = "text-xs px-3 py-1.5 bg-white text-blue-700 font-semibold hover:bg-blue-100 transition-colors duration-200 shadow-sm"
  return external ? (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

const ToolComparisonIntro = ({ tool1, tool2 }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-3xl shadow-2xl mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="md:w-2/3 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold text-white mb-3">AI Developer Tooling Expert</h1>
          <p className="text-lg text-white mb-4">
            Hi, I&apos;m Zachary, a Staff Software Engineer and expert in AI developer tooling.
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="https://calendly.com/zackproser/60m" external>
              Book a call
            </ButtonLink>
            <ButtonLink href="/contact">
              Ask me a question
            </ButtonLink>
            <ButtonLink href={`/devtools/compare?tools=${encodeURIComponent(tool1)},${encodeURIComponent(tool2)}`}>
              Interactive comparison tool
            </ButtonLink>
          </div>
        </div>
        <div className="md:w-1/3">
          <RandomImage />
        </div>
      </div>
    </div>
  )
}

export default ToolComparisonIntro