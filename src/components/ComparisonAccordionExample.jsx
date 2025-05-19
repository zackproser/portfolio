'use client'

import React from 'react'
import ComparisonTable from './ComparisonTable'
import { Database, Terminal, Globe, Code, ClipboardCheck, HelpCircle } from 'lucide-react'

const ComparisonAccordionExample = () => {
  // Generate sample comparison data
  const exampleSections = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      icon: Database,
      features: [
        {
          id: 'pricing',
          name: 'Pricing',
          value1: 'Free tier + $19/month Pro',
          value2: 'Free (Open Source)',
          type: 'default',
        },
        {
          id: 'release',
          name: 'Initial Release',
          value1: '2022',
          value2: '2023',
          type: 'default',
        },
        {
          id: 'open-source',
          name: 'Open Source',
          value1: false,
          value2: true,
          type: 'boolean',
        },
        {
          id: 'website',
          name: 'Website',
          value1: 'https://codeium.com',
          value2: 'https://aider.chat',
          type: 'link',
        },
      ],
    },
    {
      id: 'implementation',
      title: 'Implementation',
      icon: Code,
      features: [
        {
          id: 'architecture',
          name: 'Architecture',
          value1: 'Client-server with local IDE extension',
          value2: 'Command-line tool with Git integration',
          type: 'default',
        },
        {
          id: 'language-support',
          name: 'Language Support',
          value1: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'C++', 'PHP', 'Ruby', 'Rust', 'C#'],
          value2: ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java'],
          type: 'languages',
        },
        {
          id: 'videos',
          name: 'Demo Videos',
          value1: ['https://www.youtube.com/watch?v=P3pPHCFzLl0', 'https://www.youtube.com/watch?v=1kkU5UopYXE'],
          value2: 'https://www.youtube.com/watch?v=V3rVyuQmlTw',
          type: 'video',
        },
      ],
    },
    {
      id: 'features',
      title: 'Key Features',
      icon: ClipboardCheck,
      features: [
        {
          id: 'intellisense',
          name: 'IntelliSense / Autocomplete',
          value1: true,
          value2: false,
          type: 'boolean',
        },
        {
          id: 'chat',
          name: 'Chat Interface',
          value1: true,
          value2: true,
          type: 'boolean',
        },
        {
          id: 'file-edits',
          name: 'Multi-file Edits',
          value1: false,
          value2: true,
          type: 'boolean',
        },
        {
          id: 'git',
          name: 'Git Integration',
          value1: true,
          value2: true,
          type: 'boolean',
        },
      ],
    },
    {
      id: 'availability',
      title: 'Availability',
      icon: Globe,
      features: [
        {
          id: 'localization',
          name: 'Languages',
          value1: 'English only',
          value2: 'English only',
          type: 'localization',
        },
        {
          id: 'platform',
          name: 'Platforms',
          value1: ['VS Code', 'JetBrains', 'Vim', 'Emacs', 'Web'],
          value2: ['Command line (all platforms)'],
          type: 'languages',
        },
        {
          id: 'users',
          name: 'Estimated Users',
          value1: 500000,
          value2: 10000,
          type: 'count',
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <ComparisonTable 
        sections={exampleSections} 
        tool1={{ name: 'Codeium' }} 
        tool2={{ name: 'Aider' }}
      />
    </div>
  )
}

export default ComparisonAccordionExample 