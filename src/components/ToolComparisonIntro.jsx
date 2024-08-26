'use client'

import { Button } from '@/components/Button'
import RandomImage from './RandomImage'

const ToolComparisonIntro = ({ tool1, tool2 }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-800 p-6 rounded-3xl shadow-2xl mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-2">
        <div className="md:w-2/3 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold text-white mb-3">👋 Hi, I&apos;m Zachary</h1>
          <p className="text-lg text-white mb-6">
            I&apos;m a Staff Software Engineer and I use AI dev tools every day.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              href="https://calendly.com/zackproser"
              variant="blue"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow sm:flex-grow-0"
            >
              Book a call
            </Button>
            <Button href="/contact" variant="blue" className="flex-grow sm:flex-grow-0">
              Questions? 
            </Button>
            <Button
              href={`/devtools/compare?tools=${encodeURIComponent(tool1)},${encodeURIComponent(tool2)}`}
              variant="blue"
              className="flex-grow sm:flex-grow-0"
            >
              Compare more tools
            </Button>
          </div>
        </div>
        <div className="md:w-1/3">
          <RandomImage width={240} height={240} />
        </div>
      </div>
    </div>
  )
}

export default ToolComparisonIntro