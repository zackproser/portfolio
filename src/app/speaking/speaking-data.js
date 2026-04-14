// Import speaking images from the a16z blog post
const a16z1 = 'https://zackproser.b-cdn.net/images/a16z-1.webp'
// Import WorkOS internal training images
const aiFundamentals = 'https://zackproser.b-cdn.net/images/ai-fundamentals.webp'
const neuralNetworksLearn = 'https://zackproser.b-cdn.net/images/neural-networks-learn.webp'
// Import AI Engineering World Fair workshop image
const aieWorkshop = 'https://zackproser.b-cdn.net/images/aie-workshop-room.webp'
// Import additional speaking and conference images
const zackAndNick = 'https://zackproser.b-cdn.net/images/zack-and-nick.webp'
const claudeSkills = 'https://zackproser.b-cdn.net/images/claude-skills.webp'

export const speakingEngagements = [
  {
    id: 'aie-london-skills-at-scale',
    slug: 'aie-london-skills-at-scale',
    type: 'public',
    title: 'Skills at Scale: Leveraging Skills Across Workflows, Agents, and Teams',
    event: 'AI Engineering London',
    date: 'April 2026',
    location: 'London, UK',
    description: 'An 80-minute workshop with Nick Nisi on how to best use Claude Code skills, leverage them across workflows and agent types, and share them with your team. Covered skill design patterns, cross-agent portability, team skill libraries, and practical hands-on exercises building production-grade skills.',
    image: 'https://zackproser.b-cdn.net/images/aie-london-audience-wide.webp',
    audience: 'AI engineers and developers',
    topics: ['Claude Code', 'Skills', 'Agent Workflows', 'Team Productivity', 'Developer Tools'],
    links: []
  },
  {
    id: 'aie-london-untethered-productivity',
    slug: 'untethered-productivity',
    type: 'public',
    title: 'Untethered Productivity: Staying Healthy, Creative, and Shipping in the AI Coding Era',
    event: 'AI Engineering London',
    date: 'April 2026',
    isoDate: '2026-04-01',
    location: 'London, UK',
    description: 'A talk about the balance between leveraging AI coding agents for massive productivity gains while maintaining your health, creativity, and sanity. Covers signal management, context switching, developer balance, and building sustainable workflows with tools like Claude Code.',
    image: 'https://zackproser.b-cdn.net/images/aie-london-untethered-bottleneck.webp',
    audience: 'AI engineers and developers',
    topics: ['AI Coding Agents', 'Developer Wellness', 'Claude Code', 'Productivity', 'Signal Management'],
    slidevUrl: 'https://zackproser.b-cdn.net/talks/untethered-productivity/',
    links: []
  },
  {
    id: 'aie-london-scaling-devtools-podcast',
    slug: 'aie-london-scaling-devtools',
    type: 'public',
    title: 'Scaling Devtools Podcast with Jack Bridger',
    event: 'AI Engineering London',
    date: 'April 2026',
    location: 'London, UK',
    description: 'Live podcast recording with Jack Bridger of Scaling Devtools at the AI Engineering London conference floor. Discussed our workshop and talks, how we\'re leveraging AI coding agents at WorkOS, patterns we\'re seeing in agent adoption, and the future of developer tooling.',
    image: 'https://zackproser.b-cdn.net/images/aie-london-podcast-gesturing.webp',
    audience: 'Podcast listeners and conference attendees',
    topics: ['AI Agents', 'Developer Tools', 'Claude Code', 'Podcast', 'Agent Adoption'],
    links: []
  },
  {
    id: 'claude-cowork-workshop-2026-02',
    slug: 'claude-cowork-workshop',
    type: 'public',
    title: 'Claude Cowork Workshop with Anthropic',
    event: 'WorkOS x Anthropic',
    date: 'February 26, 2026',
    isoDate: '2026-02-26',
    location: 'San Francisco, CA',
    description: 'One-hour hands-on workshop I created and delivered at WorkOS, with Lydia from Anthropic\'s Claude Code team joining for Q&A. Demoed real-world Claude Code projects (Oura MCP, Handwave watchOS app, walking-and-talking development), then walked attendees through a complete GTM workflow: ICP identification, data scraping and enrichment, competitive analysis, battlecard creation, pain point messaging, cold email generation, blog content, and scheduled Cowork tasks for automated content production.',
    image: 'https://zackproser.b-cdn.net/images/workshop-zack-presenting-v2.webp',
    imagePosition: 'top',
    audience: 'Engineers and technical leaders',
    topics: ['Claude Code', 'Cowork', 'AI-Assisted Development', 'ICP Research', 'GTM Automation', 'Context Management'],
    links: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=8bjcx5Hkj5w',
        label: 'Watch the workshop'
      },
      {
        type: 'blog',
        url: '/blog/claude-cowork-workshop-anthropic',
        label: 'Read the write-up'
      },
      {
        type: 'blog',
        url: '/workshops/claude-cowork',
        label: 'Book this workshop'
      }
    ]
  },
  {
    id: 'devseccon-2025-keynote',
    slug: 'devseccon-2025-keynote',
    type: 'public',
    title: 'Keynote Speaker: DevSecCon 2025',
    event: 'DevSecCon 2025',
    date: '2025',
    isoDate: '2025-01-01',
    location: 'Conference Keynote',
    description: 'Delivered the keynote address at DevSecCon 2025 on modern AI and security.',
    image: 'https://img.youtube.com/vi/kwIzRkzO_Z4/0.jpg',
    audience: 'Conference attendees',
    topics: ['DevSecOps', 'Security', 'AI Engineering'],
    links: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=kwIzRkzO_Z4',
        label: 'Watch Keynote on YouTube'
      }
    ]
  },
  {
    id: 'aie-world-fair-june-2025',
    slug: 'aie-world-fair-mastra',
    type: 'public',
    title: 'AI Pipelines and Agents in Pure TypeScript with Mastra.ai',
    event: 'AI Engineering World Fair',
    date: 'June 3, 2025',
    isoDate: '2025-06-03',
    location: 'Workshop Session',
    description: 'We taught over 70 engineers over the course of a live 2 hour workshop how to build workflows to accomplish discrete tasks and how to grant access to those workflows to agents - which are the ideal human interface for accomplishing tasks with natural language.',
    image: aieWorkshop,
    audience: '70+ engineers',
    topics: ['AI Pipelines', 'Agents', 'TypeScript', 'Mastra.ai', 'Workflow Automation', 'Natural Language Interfaces']
  },
  {
    id: 'a16z-dec-2023',
    slug: 'a16z-pinecone-pulumi',
    type: 'public',
    title: 'Navigating from Jupyter Notebooks to Production',
    event: 'Pinecone & Cohere Meetup at a16z',
    date: 'December 6, 2023',
    isoDate: '2023-12-06',
    location: 'Andreesen Horowitz, San Francisco, CA',
    description: 'I introduced the new Pinecone AWS Reference Architecture with Pulumi and explained infrastructure as code, using a mountaineering metaphor to compare getting from prototype to production.',
    image: a16z1,
    audience: '~125 attendees',
    topics: ['Infrastructure as Code', 'Pinecone', 'AWS', 'Pulumi', 'Production Deployment'],
    links: [
      {
        type: 'blog',
        url: '/blog/a16z-sf-dec-2023-ai-apps-production',
        label: 'Read Full Blog Post'
      },
      {
        type: 'twitter',
        url: 'https://twitter.com/zackproser/status/1732228822626619637',
        label: 'Twitter Thread'
      }
    ]
  },
  {
    id: 'workos-gtm-cowork-2026-02-06',
    slug: 'workos-gtm-voice-dev',
    type: 'internal',
    title: 'Voice-First Development & Claude Code Cowork Enablement',
    event: 'WorkOS GTM Training',
    date: 'February 6, 2026',
    isoDate: '2026-02-06',
    location: 'WorkOS Office, San Francisco, CA',
    description: 'Demonstrated how to use WisprFlow to code with your voice and ran live demos of Claude Code and Cowork enablement for GTM teams. Co-presented with Nick Nisi.',
    image: 'https://zackproser.b-cdn.net/images/workos-gtm-training.webp',
    audience: 'WorkOS GTM team (internal)',
    topics: ['WisprFlow', 'Voice Development', 'Claude Code', 'Cowork', 'GTM Enablement'],
    links: [
      {
        type: 'blog',
        url: '/demos/voice-ai',
        label: 'Try the voice AI demo'
      }
    ]
  },
  {
    id: 'workos-claude-skills-2025-10-23',
    slug: 'workos-claude-skills',
    type: 'internal',
    title: 'Claude Skills as Self-Documenting Runbooks',
    event: 'WorkOS Internal Training',
    date: 'October 23, 2025',
    isoDate: '2025-10-23',
    location: 'WorkOS Office, San Francisco, CA',
    description: 'In-person training on operationalizing Claude Skills as executable, version-controlled runbooks and shareable team workflows.',
    image: claudeSkills,
    audience: 'WorkOS team (internal)',
    topics: ['Claude Skills', 'Runbooks', 'AI Workflows', 'Knowledge Sharing'],
    links: [
      {
        type: 'blog',
        url: '/blog/claude-skills-internal-training',
        label: 'Read write-up'
      }
    ]
  },
  {
    id: 'ai-fundamentals-internal',
    slug: 'ai-fundamentals-workos',
    type: 'internal',
    title: 'AI Fundamentals for Engineering Teams',
    event: 'WorkOS Internal Training',
    date: 'May 2025',
    isoDate: '2025-05-01',
    location: 'In-person',
    description: 'Comprehensive introduction to AI concepts, machine learning fundamentals, and practical applications for software engineering teams. Covered LLMs, vector databases, RAG, and hands-on implementation strategies.',
    image: aiFundamentals,
    audience: 'Engineering Team (40 developers)',
    topics: ['Machine Learning', 'Large Language Models', 'Vector Databases', 'RAG', 'AI Engineering']
  },
  {
    id: 'ai-content-creation-internal',
    slug: 'ai-content-creation-workos',
    type: 'internal',
    title: 'AI-Enabled Content Creation Workshop',
    event: 'WorkOS Internal Training',
    date: 'May 2025',
    isoDate: '2025-05-01',
    location: 'In-person',
    description: 'Interactive workshop teaching content teams how to leverage AI tools for writing, editing, ideation, and content optimization. Practical hands-on session with real-world use cases and workflow optimization.',
    image: neuralNetworksLearn,
    audience: 'Marketing & Content Team (25 members)',
    topics: ['AI Writing Tools', 'Content Strategy', 'Workflow Optimization', 'Prompt Engineering', 'Content Marketing']
  }
]

export const galleryImages = [
  {
    src: 'https://zackproser.b-cdn.net/images/aie-london-untethered-bottleneck.webp',
    alt: 'Zack presenting "The agents aren\'t the bottleneck. We are." at AI Engineering London'
  },
  {
    src: 'https://zackproser.b-cdn.net/images/aie-london-audience-wide.webp',
    alt: 'Audience at the AI Engineering London workshop'
  },
  {
    src: 'https://zackproser.b-cdn.net/images/aie-london-podcast-wide.webp',
    alt: 'Recording the Scaling Devtools podcast at AI Engineering London'
  },
  {
    src: 'https://zackproser.b-cdn.net/images/aie-london-untethered-balance.webp',
    alt: 'Zack presenting on Developer Balance at AI Engineering London'
  },
  {
    src: zackAndNick,
    alt: 'Zack and Nick at a speaking event'
  },
  {
    src: 'https://zackproser.b-cdn.net/images/workshop-audience-coding-v2.webp',
    alt: 'Workshop attendees building with Claude Cowork'
  }
]
