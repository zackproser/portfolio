// Sample transcriptions and scenarios for the Voice AI demo

export interface VoiceScenario {
  id: string
  title: string
  icon: string
  context: string
  rawDictation: string
  polishedOutput: string
  outputType: 'code' | 'email' | 'chat' | 'prompt' | 'ticket'
}

export interface AgentTask {
  id: number
  instruction: string
  status: 'idle' | 'speaking' | 'working' | 'complete'
  progress: number
  output: string
}

export interface ThoughtFragment {
  id: number
  text: string
  category: 'frustration' | 'idea' | 'task' | 'question' | 'blocker' | 'internal'
}

export interface OrganizedOutput {
  type: 'ticket' | 'slack' | 'calendar' | 'note'
  title: string
  content: string
}

// Voice Pipeline Steps - slower for better comprehension
export const VOICE_PIPELINE_STEPS = [
  {
    id: 'capture',
    title: 'Voice Capture',
    description: 'Microphone captures your speech',
    duration: 4000 // 4s to capture voice
  },
  {
    id: 'process',
    title: 'Speech Recognition',
    description: 'AI converts audio to raw text',
    duration: 3500 // 3.5s to show raw transcription
  },
  {
    id: 'enhance',
    title: 'AI Enhancement',
    description: 'Filler words removed, formatting applied',
    duration: 3500 // 3.5s for AI enhancement comparison
  },
  {
    id: 'output',
    title: 'Polished Output',
    description: 'Clean text inserted at cursor',
    duration: 3000 // 3s to show final result
  }
] as const

// Sample dictation for the pipeline visualization
export const SAMPLE_DICTATION = {
  raw: "um so basically I need to like refactor the auth module because um the current implementation is using deprecated methods and uh we should probably add better error handling too I think",
  enhanced: "Refactor the auth module: the current implementation uses deprecated methods. Add improved error handling."
}

// Context-aware formatting scenarios
export const VOICE_SCENARIOS: VoiceScenario[] = [
  {
    id: 'cursor',
    title: 'Cursor Composer',
    icon: '💻',
    context: 'IDE / Code Editor',
    rawDictation: "create a react hook called use debounce that takes a value and delay and returns the debounced value use use effect and use state",
    polishedOutput: `// Create a custom React hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}`,
    outputType: 'code'
  },
  {
    id: 'email',
    title: 'Email Composition',
    icon: '📧',
    context: 'Gmail / Email Client',
    rawDictation: "hey Sarah thanks for the feedback on the proposal I've incorporated your suggestions about the timeline and budget and updated the document let me know if you need anything else",
    polishedOutput: `Hi Sarah,

Thanks for the feedback on the proposal. I've incorporated your suggestions about the timeline and budget and updated the document.

Let me know if you need anything else.

Best,
Zack`,
    outputType: 'email'
  },
  {
    id: 'slack',
    title: 'Slack Message',
    icon: '💬',
    context: 'Slack / Team Chat',
    rawDictation: "hey team quick update the deploy is done and everything looks good on staging gonna monitor for the next hour then we can push to prod",
    polishedOutput: `Hey team! 👋 Quick update: the deploy is done and everything looks good on staging. Gonna monitor for the next hour, then we can push to prod 🚀`,
    outputType: 'chat'
  },
  {
    id: 'claude',
    title: 'Claude / ChatGPT',
    icon: '🤖',
    context: 'AI Assistant',
    rawDictation: "I need help understanding how vector databases work specifically how they do similarity search and what cosine similarity means in that context",
    polishedOutput: `I need help understanding how vector databases work, specifically:

1. How do they perform similarity search?
2. What does cosine similarity mean in this context?
3. How does this compare to traditional database queries?

Please explain with examples if possible.`,
    outputType: 'prompt'
  }
]

// Multi-agent orchestration tasks
export const ORCHESTRATION_TASKS: AgentTask[] = [
  {
    id: 1,
    instruction: "Add dark mode toggle to the settings panel with system preference detection",
    status: 'idle',
    progress: 0,
    output: "✓ Added ThemeToggle component\n✓ Implemented useSystemTheme hook\n✓ Updated Settings.tsx"
  },
  {
    id: 2,
    instruction: "Write unit tests for the auth service covering login, logout, and token refresh flows",
    status: 'idle',
    progress: 0,
    output: "✓ Created auth.test.ts\n✓ Added 12 test cases\n✓ 100% coverage on auth module"
  },
  {
    id: 3,
    instruction: "Refactor the API client to use fetch instead of axios and add retry logic",
    status: 'idle',
    progress: 0,
    output: "✓ Replaced axios with fetch\n✓ Added exponential backoff\n✓ Updated error handling"
  }
]

// Typing comparison task (what the keyboard user is still working on)
// Made longer so typing finishes AFTER voice agents complete (voice finishes at ~15s, we want typing to finish at ~25s)
// At 90 WPM = 7.5 chars/second, 25s needs ~188 chars
export const TYPING_TASK = {
  instruction: "Add dark mode toggle to the settings panel with system preference detection and persist the user selection to localStorage so it remembers their choice across browser sessions and page refreshes",
  typedSoFar: "Add dark mode toggle to the sett",
  totalChars: 200, // ~27 seconds at 90 WPM
  wpm: 90
}

// Verbal ventilation - chaotic thoughts (including internal/emotional states)
export const CHAOTIC_THOUGHTS: ThoughtFragment[] = [
  { id: 1, text: "the API is broken again", category: 'frustration' },
  { id: 2, text: "I'm so hungry", category: 'internal' },
  { id: 3, text: "need to update the docs", category: 'task' },
  { id: 4, text: "what if we used webhooks instead", category: 'idea' },
  { id: 5, text: "haven't slept well in days", category: 'internal' },
  { id: 6, text: "blocked on design review", category: 'blocker' },
  { id: 7, text: "feeling overwhelmed", category: 'internal' },
  { id: 8, text: "should we migrate to TypeScript", category: 'question' },
  { id: 9, text: "need to call mom back", category: 'internal' },
  { id: 10, text: "customer reported login bug", category: 'frustration' },
  { id: 11, text: "my back hurts from sitting", category: 'internal' },
  { id: 12, text: "sprint planning tomorrow", category: 'task' },
  { id: 13, text: "maybe add caching layer", category: 'idea' },
  { id: 14, text: "when did I last drink water", category: 'internal' },
  { id: 15, text: "waiting on API keys", category: 'blocker' },
  { id: 16, text: "why is CI so slow", category: 'frustration' }
]

// Organized outputs from verbal ventilation
export const ORGANIZED_OUTPUTS: OrganizedOutput[] = [
  {
    type: 'ticket',
    title: 'BUG: Login flow failing intermittently',
    content: 'Customer reported login issues. Investigate API endpoint stability and add retry logic.'
  },
  {
    type: 'note',
    title: '🧘 Self-Care Reminder',
    content: 'Take a break: eat lunch, drink water, stretch your back. Call mom tonight.'
  },
  {
    type: 'slack',
    title: '#engineering',
    content: 'Heads up: blocked on design review for the settings refactor. @design can we sync today?'
  },
  {
    type: 'calendar',
    title: 'Sprint Planning Prep',
    content: 'Review backlog, prioritize API fixes, prepare migration proposal'
  },
  {
    type: 'ticket',
    title: 'TECH: Evaluate TypeScript migration',
    content: 'Spike: assess effort for TypeScript migration. Consider gradual adoption strategy.'
  }
]

// Meeting intelligence sample
export const MEETING_SAMPLE = {
  during: {
    title: "Q4 Planning Review",
    participants: ["You", "Sarah", "Mike", "Lisa"],
    duration: "45 min",
    status: "Recording..."
  },
  after: {
    summary: "Discussed Q4 priorities: launch new dashboard by Oct 15, hire 2 engineers, reduce churn by 10%.",
    actionItems: [
      { owner: "You", task: "Draft dashboard requirements doc", due: "Friday" },
      { owner: "Sarah", task: "Post engineering job descriptions", due: "Monday" },
      { owner: "Mike", task: "Analyze churn data from Q3", due: "Wednesday" }
    ],
    keyDecisions: [
      "Approved $50k budget for new tooling",
      "Postponed mobile app to Q1",
      "Weekly syncs moving to Tuesday"
    ]
  }
}

// Affiliate links
export const AFFILIATE_LINKS = {
  wisprflow: 'https://ref.wisprflow.ai/zack-proser',
  granola: 'https://go.granola.ai/zack-proser'
} as const

// Section value propositions and related posts
export interface RelatedPost {
  slug: string
  title: string
  description: string
  image: string
}

export interface SectionContent {
  valueProp: string
  relatedPosts: RelatedPost[]
}

export const SECTION_CONTENT: Record<string, SectionContent> = {
  pipeline: {
    valueProp: "Speaking at 179 WPM versus typing at 90 WPM isn't just a 2x speed boost—it's a fundamentally different relationship with your tools. When output matches thought speed, you stop self-editing mid-sentence. Ideas flow unfiltered into the machine.",
    relatedPosts: [
      {
        slug: 'wisprflow-review',
        title: 'WisprFlow Review - 179WPM Voice-Driven Development',
        description: 'Transform voice into text at 4x typing speed, the ultimate tool for developers who think faster than they type.',
        image: 'https://zackproser.b-cdn.net/images/wisprflow.webp'
      }
    ]
  },
  orchestration: {
    valueProp: "The real unlock isn't just speed—it's parallelism. At 179 WPM, I can dispatch instructions to three Cursor agent windows before a keyboard user finishes typing one prompt. The bottleneck shifts from my output speed to my mind's capacity to track multiple threads.",
    relatedPosts: [
      {
        slug: 'cursor-agents-review',
        title: 'Cursor Agents Hands-on Review',
        description: "I got hands-on with Cursor's new Agents feature. Here's what I thought...",
        image: 'https://zackproser.b-cdn.net/images/cursor-agents-hero.webp'
      },
      {
        slug: 'wisprflow-high-leverage-workflow',
        title: 'WisprFlow: Highest-Leverage Dev Upgrade',
        description: 'How voice-first development transformed my agentic workflow and unlocked new velocity.',
        image: 'https://zackproser.b-cdn.net/images/wisprflow-interface.webp'
      }
    ]
  },
  ventilation: {
    valueProp: "For neurodivergent minds, the value isn't just speed—it's cognitive relief. Externalizing the chaos in your head to an AI that patiently organizes it removes the executive function tax of self-sorting. Speak the mess, receive the structure.",
    relatedPosts: [
      {
        slug: 'claude-external-brain-adhd-autistic',
        title: 'Claude as My External Brain: Autistic, ADHD, and Finally Supported',
        description: 'How I use Claude as an external brain and assistant—combining voice, agents, and a hardened CI/CD lane—to support an autistic mind with severe ADHD.',
        image: 'https://zackproser.b-cdn.net/images/claude.webp'
      },
      {
        slug: 'training-claude-neurological-patterns',
        title: 'Training Claude to Compensate for My Neurological Patterns',
        description: "How I'm systematically teaching an AI system to compensate for specific ADHD/autism processing patterns.",
        image: 'https://zackproser.b-cdn.net/images/claude-support.webp'
      }
    ]
  },
  scenarios: {
    valueProp: "Context-aware formatting eliminates the cognitive overhead of switching modes. Speak naturally to Cursor, get code. Speak to Gmail, get professional prose. Your voice adapts automatically—no mental gear-shifting required.",
    relatedPosts: [
      {
        slug: 'wisprflow-review',
        title: 'WisprFlow Review - 179WPM Voice-Driven Development',
        description: 'Deep dive into how WisprFlow detects context and formats output accordingly.',
        image: 'https://zackproser.b-cdn.net/images/wisprflow.webp'
      }
    ]
  },
  meetings: {
    valueProp: "The best meeting notes are the ones you don't have to take. Granola captures everything locally—no awkward bot joining your call—so you can be fully present. Make eye contact, ask follow-up questions, build relationships. The notes handle themselves.",
    relatedPosts: [
      {
        slug: 'granola-ai-review',
        title: 'Granola AI Review: No More Note-Taking Anxiety',
        description: 'Honest review after months of daily use across meetings and calls. Why it\'s become indispensable.',
        image: 'https://zackproser.b-cdn.net/images/granola-hero.webp'
      },
      {
        slug: 'best-ai-voice-tools-2025',
        title: 'Top 4 AI Voice Tools for 2025',
        description: 'WisprFlow, Granola, ElevenLabs, and Bland AI—the best voice tools for productivity.',
        image: 'https://zackproser.b-cdn.net/images/top-voice-tools-2025.webp'
      }
    ]
  }
}

