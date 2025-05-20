'use client'

import { Button } from '@/components/Button'
import NewsletterWrapper from './NewsletterWrapper'

const ToolComparisonIntro = ({ tool1, tool2 }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-900 p-8 rounded-3xl shadow-2xl mb-12">
      <div className="flex flex-col items-center justify-center text-center mb-4">
        <h2 className="text-3xl font-bold text-white mb-4">Get Exclusive AI Tool Insights</h2>
        <p className="text-lg text-white/90 mb-6 max-w-2xl">
          Subscribe to receive in-depth comparisons, early access to new tool reviews, and insider analysis that helps you choose the right AI tools for your workflow.
        </p>
        
        <div className="w-full max-w-xl">
          <NewsletterWrapper 
            className="w-full"
            theme="dark"
            title="Join our AI tools insider community"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <Button
            href={`/devtools/compare?tools=${encodeURIComponent(tool1)},${encodeURIComponent(tool2)}`}
            variant="blue"
            className="bg-white text-blue-800 hover:bg-blue-50"
          >
            Compare more tools
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ToolComparisonIntro