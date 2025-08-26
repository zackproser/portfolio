'use client'

import { useRef, useEffect, useState } from 'react'
import { Users, BookOpen, Calendar, Wrench } from 'lucide-react'

interface StatItem {
  number: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

interface StatsBarProps {
  stats: StatItem[]
}

interface AnimatedNumberProps {
  value: string
  duration?: number
}

const AnimatedNumber = ({ value, duration = 2.5 }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Extract number from value (e.g., "35,000+" -> 35000)
    const numericValue = parseInt(value.replace(/[^\d]/g, ''), 10)
    if (isNaN(numericValue)) {
      setDisplayValue(value)
      return
    }

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      // Enhanced easing function for more dramatic effect
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(numericValue * easeOutCubic)
      
      // Format the number back to string with original formatting
      let formattedValue = currentValue.toLocaleString()
      
      // Add back any suffix (like + or K)
      if (value.includes('+')) formattedValue += '+'
      if (value.includes('K')) formattedValue = Math.floor(currentValue / 1000) + 'K+'
      
      setDisplayValue(formattedValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value) // Ensure final value is exact
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return <span ref={ref}>{displayValue}</span>
}

const defaultStats: StatItem[] = [
  { number: "50,000+", label: "Monthly Blog Readers", icon: Users },
  { number: "2,100+", label: "Newsletter Subscribers", icon: BookOpen },
  { number: "3+ Years", label: "AI Infrastructure Experience", icon: Calendar },
  { number: "13+ Years", label: "Total Engineering Experience", icon: Wrench }
]

export function StatsBar({ stats = defaultStats }: StatsBarProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Horizontal scrolling */}
        <div className="md:hidden">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="flex-shrink-0 min-w-[220px] text-center"
                >
                  <div className="relative bg-gradient-to-br from-white via-blue-50/80 to-indigo-100/60 dark:from-blue-900/30 dark:via-indigo-900/40 dark:to-purple-900/30 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 group backdrop-blur-sm">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {Icon && (
                      <div 
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
                      <AnimatedNumber value={stat.number} duration={2.5} />
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                      {stat.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="relative bg-gradient-to-br from-white via-blue-50/80 to-indigo-100/60 dark:from-blue-900/30 dark:via-indigo-900/40 dark:to-purple-900/30 rounded-2xl p-10 border border-blue-200/50 dark:border-blue-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {Icon && (
                    <div 
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300"
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                    <AnimatedNumber value={stat.number} duration={2.5} />
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 font-semibold text-lg group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
} 