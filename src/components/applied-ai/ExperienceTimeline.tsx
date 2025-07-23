'use client'

import { useRef } from 'react'
import { appliedAiExperience } from '@/data/applied-ai-experience'
import Image from 'next/image'

const ExperienceCard = ({ experience, index }: { experience: any; index: number }) => {
  const ref = useRef(null)

  return (
    <div
      ref={ref}
      className="relative"
    >
      {/* Timeline connector - only show connecting lines to card edges */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-blue-200 dark:bg-blue-800 h-8 -top-8" />
      <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-blue-200 dark:bg-blue-800 h-8 -bottom-8" />
      
      {/* Timeline dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0 z-20">
        <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
      </div>
      
      {/* Experience card - fully opaque background */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10 mx-4 md:mx-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Company logo */}
          {experience.logo && (
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex items-center justify-center">
                <Image
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {experience.role}
                </h3>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {experience.company}
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 md:text-right">
                <p className="font-medium">{experience.duration}</p>
                <p>{experience.location}</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {experience.description}
            </p>
            
            {/* Key achievements */}
            {experience.achievements && experience.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                  Key Achievements
                </h4>
                <ul className="space-y-1">
                  {experience.achievements.map((achievement: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Technologies */}
            {experience.technologies && experience.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExperienceTimeline() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Experience
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A track record of delivering scalable AI infrastructure and developer tools at top-tier companies
          </p>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Main timeline line - only visible between cards */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bottom-16 w-px bg-blue-200 dark:bg-blue-800" />
          
          {/* Experience cards */}
          <div className="space-y-16">
            {appliedAiExperience.map((experience, index) => (
              <ExperienceCard key={index} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 