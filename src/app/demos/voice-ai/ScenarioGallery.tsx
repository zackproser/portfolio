'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, 
  Mail, 
  MessageSquare, 
  Bot,
  ArrowRight,
  Mic,
  Sparkles
} from 'lucide-react'
import { VOICE_SCENARIOS, type VoiceScenario } from './data'

// Simple syntax highlighter for TypeScript/React code
function highlightCode(code: string): React.ReactNode[] {
  const keywords = /\b(const|let|var|function|return|export|import|from|if|else|for|while|do|switch|case|break|continue|default|try|catch|finally|throw|new|typeof|instanceof|async|await|class|extends|implements|interface|type|enum|public|private|protected|static|readonly|abstract|as|is|in|of|null|undefined|true|false|void|never|any|unknown)\b/g
  const types = /\b(string|number|boolean|object|symbol|bigint|T|React|useState|useEffect|useCallback|useMemo|useRef)\b/g
  const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g
  const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
  const functions = /\b([a-zA-Z_]\w*)\s*(?=\()/g
  const brackets = /([{}[\]()])/g
  const operators = /([=+\-*/<>!&|:?]+)/g

  // Split into lines for processing
  const lines = code.split('\n')
  const result: React.ReactNode[] = []

  lines.forEach((line, lineIndex) => {
    // Create a map of positions to styles
    const segments: { start: number; end: number; type: string; text: string }[] = []
    
    // Find all matches
    let match
    
    // Comments (highest priority)
    const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
    while ((match = commentRegex.exec(line)) !== null) {
      segments.push({ start: match.index, end: match.index + match[0].length, type: 'comment', text: match[0] })
    }
    
    // Strings
    const stringRegex = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g
    while ((match = stringRegex.exec(line)) !== null) {
      segments.push({ start: match.index, end: match.index + match[0].length, type: 'string', text: match[0] })
    }
    
    // Keywords
    const keywordRegex = /\b(const|let|var|function|return|export|import|from|if|else|for|while|async|await|type)\b/g
    while ((match = keywordRegex.exec(line)) !== null) {
      if (!segments.some(s => match!.index >= s.start && match!.index < s.end)) {
        segments.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', text: match[0] })
      }
    }
    
    // Types
    const typeRegex = /\b(string|number|boolean|T|useState|useEffect|useCallback|setTimeout|clearTimeout)\b/g
    while ((match = typeRegex.exec(line)) !== null) {
      if (!segments.some(s => match!.index >= s.start && match!.index < s.end)) {
        segments.push({ start: match.index, end: match.index + match[0].length, type: 'type', text: match[0] })
      }
    }
    
    // Functions
    const funcRegex = /\b([a-zA-Z_]\w*)\s*(?=\()/g
    while ((match = funcRegex.exec(line)) !== null) {
      if (!segments.some(s => match!.index >= s.start && match!.index < s.end)) {
        segments.push({ start: match.index, end: match.index + match[1].length, type: 'function', text: match[1] })
      }
    }
    
    // Sort segments by start position
    segments.sort((a, b) => a.start - b.start)
    
    // Build the highlighted line
    const lineParts: React.ReactNode[] = []
    let lastEnd = 0
    
    segments.forEach((segment, segIndex) => {
      // Add unhighlighted text before this segment
      if (segment.start > lastEnd) {
        lineParts.push(line.slice(lastEnd, segment.start))
      }
      
      // Add highlighted segment
      const className = {
        keyword: 'text-purple-600 dark:text-purple-400 font-semibold',
        string: 'text-green-600 dark:text-green-400',
        comment: 'text-zinc-400 dark:text-zinc-500 italic',
        type: 'text-cyan-600 dark:text-cyan-400',
        function: 'text-blue-600 dark:text-blue-400'
      }[segment.type] || ''
      
      lineParts.push(
        <span key={`${lineIndex}-${segIndex}`} className={className}>
          {segment.text}
        </span>
      )
      
      lastEnd = segment.end
    })
    
    // Add remaining text
    if (lastEnd < line.length) {
      lineParts.push(line.slice(lastEnd))
    }
    
    result.push(
      <div key={lineIndex} className="leading-relaxed">
        {lineParts.length > 0 ? lineParts : ' '}
      </div>
    )
  })
  
  return result
}

const SCENARIO_ICONS: Record<string, typeof Code> = {
  cursor: Code,
  email: Mail,
  slack: MessageSquare,
  claude: Bot
}

const SCENARIO_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  cursor: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-500',
    text: 'text-blue-600 dark:text-blue-400'
  },
  email: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-500',
    text: 'text-amber-600 dark:text-amber-400'
  },
  slack: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-500',
    text: 'text-purple-600 dark:text-purple-400'
  },
  claude: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-500',
    text: 'text-green-600 dark:text-green-400'
  }
}

export default function ScenarioGallery() {
  const [activeScenario, setActiveScenario] = useState<VoiceScenario>(VOICE_SCENARIOS[0])
  const [isTransforming, setIsTransforming] = useState(false)
  const [showOutput, setShowOutput] = useState(true)

  const handleScenarioChange = (scenario: VoiceScenario) => {
    if (scenario.id === activeScenario.id) return
    
    setIsTransforming(true)
    setShowOutput(false)
    
    // Brief animation delay
    setTimeout(() => {
      setActiveScenario(scenario)
      setIsTransforming(false)
      setTimeout(() => setShowOutput(true), 100)
    }, 300)
  }

  const Icon = SCENARIO_ICONS[activeScenario.id]
  const colors = SCENARIO_COLORS[activeScenario.id]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Context-Aware Formatting
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          WisprFlow detects what app you&apos;re in and formats your speech accordingly—code for 
          editors, professional tone for email, casual for chat.
        </p>
      </div>

      {/* Scenario selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {VOICE_SCENARIOS.map((scenario) => {
          const ScenarioIcon = SCENARIO_ICONS[scenario.id]
          const isActive = activeScenario.id === scenario.id
          const scenarioColors = SCENARIO_COLORS[scenario.id]
          
          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario)}
              className={`
                flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                transition-all duration-200
                ${isActive 
                  ? `${scenarioColors.bg} ${scenarioColors.text} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ${scenarioColors.border.replace('border-', 'ring-')}`
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }
              `}
            >
              <span className="text-lg">{scenario.icon}</span>
              <ScenarioIcon className="h-4 w-4" />
              <span>{scenario.title}</span>
            </button>
          )
        })}
      </div>

      {/* Main visualization */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        {/* Context badge */}
        <div className="flex items-center justify-center mb-6">
          <motion.div
            key={activeScenario.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              inline-flex items-center gap-2 rounded-full px-4 py-2
              ${colors.bg} ${colors.text}
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">
              Detected context: {activeScenario.context}
            </span>
          </motion.div>
        </div>

        {/* Transformation visualization */}
        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-start">
          {/* Input: Raw dictation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <Mic className="h-4 w-4 text-purple-500" />
              What You Say
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`input-${activeScenario.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4"
              >
                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                  &ldquo;{activeScenario.rawDictation}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  Natural speech with no formatting
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrow / transformation indicator */}
          <div className="flex md:flex-col items-center justify-center gap-2 py-4 md:py-0">
            <motion.div
              animate={isTransforming ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`
                flex h-12 w-12 items-center justify-center rounded-full
                ${isTransforming 
                  ? 'bg-purple-500' 
                  : `bg-gradient-to-br ${colors.border.replace('border-', 'from-')} to-indigo-500`
                }
                shadow-lg
              `}
            >
              {isTransforming ? (
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              ) : (
                <ArrowRight className="h-5 w-5 text-white md:rotate-0 rotate-90" />
              )}
            </motion.div>
            <span className={`text-xs font-medium ${colors.text}`}>
              {isTransforming ? 'Processing...' : 'AI Formats'}
            </span>
          </div>

          {/* Output: Formatted result */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <Sparkles className="h-4 w-4 text-green-500" />
              What Gets Inserted
            </div>
            <AnimatePresence mode="wait">
              {showOutput && (
                <motion.div
                  key={`output-${activeScenario.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`
                    rounded-xl border-2 ${colors.border} ${colors.bg} p-4
                    shadow-sm
                  `}
                >
                  {activeScenario.outputType === 'code' ? (
                    <pre className="text-xs overflow-x-auto font-mono">
                      {highlightCode(activeScenario.polishedOutput)}
                    </pre>
                  ) : (
                    <div className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                      {activeScenario.polishedOutput}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Perfectly formatted for {activeScenario.context}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Auto-detects context
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Code vs email vs chat
            </p>
          </div>
          <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3 text-center">
            <div className="text-2xl mb-1">✨</div>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Removes filler words
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              &ldquo;um&rdquo;, &ldquo;like&rdquo;, &ldquo;uh&rdquo; gone
            </p>
          </div>
          <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3 text-center">
            <div className="text-2xl mb-1">📝</div>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Proper formatting
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Punctuation, line breaks, structure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


