"use client"

import { useState } from "react"
import { motion } from "framer-motion"

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
    title: "Project Scoping Document",
    description:
      "I'll create a detailed project plan with timelines, deliverables, and cost estimates. You'll know exactly what to expect before any commitment.",
  },
  {
    id: 3,
    title: "Development & Implementation",
    description:
      "Using a phased approach, I'll build your solution with regular updates and check-ins. You'll have full visibility into progress and technical decisions.",
  },
  {
    id: 4,
    title: "Testing & Quality Assurance",
    description:
      "Rigorous testing ensures your solution works reliably at scale. I implement comprehensive test suites and performance validation.",
  },
  {
    id: 5,
    title: "Deployment & Knowledge Transfer",
    description:
      "Your solution goes live with documentation, training, and ongoing support options to ensure your team can maintain and extend the system.",
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
              step.id <= activeStep ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveStep(step.id)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
                step.id <= activeStep ? "bg-primary text-white" : "bg-secondary border border-primary/20"
              }`}
            >
              {step.id}
            </div>
            <span className="hidden md:inline-block">{step.title.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            animate={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-primary/20"
      >
        <h4 className="text-lg font-semibold text-primary mb-2">{steps[activeStep - 1].title}</h4>
        <p className="text-muted-foreground">{steps[activeStep - 1].description}</p>
      </motion.div>
    </div>
  )
} 