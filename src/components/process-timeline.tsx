"use client"

import { useState } from "react"

interface Step {
  id: number
  title: string
  description: string
}

const steps: Step[] = [
  {
    id: 1,
    title: "Discovery & Strategy Call",
    description:
      "We start with a free consultation to understand your goals, challenges, and technical needs. I'll help clarify what's possible and outline potential approaches.",
  },
  {
    id: 2,
    title: "Project Details & Scoping",
    description:
      "We solidify the project details over email, finalizing requirements, timelines, and specifications to ensure alignment on project goals and deliverables.",
  },
  {
    id: 3,
    title: "Initial 50% Payment",
    description:
      "You pay half of the project cost upfront to secure your spot in my schedule and initiate the development process.",
  },
  {
    id: 4,
    title: "Development & Updates",
    description:
      "I start working on your project with regular updates to keep you informed of progress and any technical decisions that need your input.",
  },
  {
    id: 5,
    title: "Project Delivery",
    description:
      "Your solution is delivered with comprehensive documentation and knowledge transfer to ensure your team can maintain and extend the system.",
  },
  {
    id: 6,
    title: "Final 50% Payment",
    description:
      "Upon successful delivery and your satisfaction with the project, the remaining 50% of the payment is due.",
  },
]

export default function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <div className="space-y-8">
      <div className="flex justify-between mb-4">
        {steps.map((step) => (
          <button
            key={step.id}
            className={`relative flex flex-col items-center text-sm font-medium transition-colors ${
              step.id <= activeStep ? "text-blue-700 dark:text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveStep(step.id)}
          >
            <div className="relative">
              {step.id === activeStep && (
                <div className="absolute -inset-1 rounded-full bg-blue-600/60 dark:bg-[#7cc2ff]/40 animate-pulse" />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors relative z-10 ${
                  step.id === activeStep 
                    ? "bg-blue-600 text-white dark:bg-primary dark:text-white" 
                    : step.id < activeStep 
                      ? "bg-blue-200 text-blue-800 dark:bg-primary/70 dark:text-white" 
                      : "bg-secondary border border-primary/20 text-gray-500"
                }`}
              >
                {step.id}
              </div>
            </div>
            <span className="hidden md:inline-block">{step.title.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-primary transition-all duration-300"
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div
        className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-primary/20 transition-all duration-300"
      >
        <h4 className="text-lg font-semibold text-blue-700 dark:text-white mb-2">{steps[activeStep - 1].title}</h4>
        <p className="text-zinc-700 dark:text-white">{steps[activeStep - 1].description}</p>
      </div>
    </div>
  )
} 