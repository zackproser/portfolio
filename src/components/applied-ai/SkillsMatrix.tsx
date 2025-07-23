'use client'

import { useRef } from 'react'
import { appliedAiSkills, SkillData } from '@/data/applied-ai-skills'

const SkillCard = ({ skill, index }: { skill: SkillData, index: number }) => {
  const ref = useRef(null)

  // Convert proficiency to numeric for signal bars
  const proficiencyLevels = { 'Intermediate': 3, 'Advanced': 4, 'Expert': 5 }
  const level = proficiencyLevels[skill.proficiency]

  return (
    <div
      ref={ref}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      {/* Skill Level Indicator - Signal Bars */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 rounded-sm ${i < level ? 'h-3 bg-blue-500' : 'h-1 bg-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Proficiency and Experience */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
          {skill.proficiency}
        </span>
        {skill.yearsExperience && (
          <span className="text-sm text-blue-200">
            {skill.yearsExperience} years
          </span>
        )}
      </div>

      {/* Hover Effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
        }}
      />
    </div>
  )
}

const TechStack = () => {
  const ref = useRef(null)

  const stackLayers = [
    {
      name: 'Frontend & UI',
      tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      color: 'from-cyan-400 to-blue-500'
    },
    {
      name: 'AI/ML Pipeline',
      tech: ['LangChain', 'OpenAI', 'Pinecone', 'RAG', 'Vector Embeddings'],
      color: 'from-purple-400 to-pink-500'
    },
    {
      name: 'Backend & APIs',
      tech: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'RESTful APIs'],
      color: 'from-green-400 to-emerald-500'
    },
    {
      name: 'DevOps & Cloud',
      tech: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      color: 'from-orange-400 to-red-500'
    },
    {
      name: 'Data Science',
      tech: ['Jupyter', 'Pandas', 'NumPy', 'Matplotlib', 'TensorFlow'],
      color: 'from-indigo-400 to-purple-500'
    }
  ]

  return (
    <div ref={ref} className="relative">
      <h3 className="text-2xl font-bold text-white mb-8 text-center">Full-Stack AI Engineering</h3>
      <div className="space-y-4">
        {stackLayers.map((layer, index) => (
          <div
            key={layer.name}
            className="relative"
          >
            <div className={`bg-gradient-to-r ${layer.color} p-4 rounded-lg bg-opacity-20 border border-white/10`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">{layer.name}</h4>
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.tech.map((tech, techIndex) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-sm bg-white/10 text-white rounded border border-white/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Connection lines */}
            {index < stackLayers.length - 1 && (
              <div className="w-px bg-gradient-to-b from-blue-400 to-transparent mx-auto h-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SkillsMatrix() {
  // Flatten all skills from all categories for the right side
  const allSkills = appliedAiSkills.flatMap(category => category.skills)

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Technical Expertise
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            From frontend interfaces to backend systems, AI pipelines to cloud infrastructure - 
            delivering end-to-end solutions that scale.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Tech Stack Visualization */}
          <TechStack />

          {/* Right side - Skill Categories */}
          <div className="space-y-8">
            {appliedAiSkills.map((category, categoryIndex) => (
              <div
                key={category.category}
              >
                <h3 className="text-xl font-bold text-white mb-4">{category.category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <SkillCard 
                      key={skill.name} 
                      skill={skill} 
                      index={categoryIndex * 10 + skillIndex} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats/certifications */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">13+</div>
              <div className="text-white">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{allSkills.length}</div>
              <div className="text-white">Core Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">6</div>
              <div className="text-white">Tech Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">1,800+</div>
              <div className="text-white">Newsletter Readers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 