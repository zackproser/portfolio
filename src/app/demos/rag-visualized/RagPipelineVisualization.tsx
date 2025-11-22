'use client'

import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Database,
  Search,
  FileText,
  Bot,
  ArrowRight,
  Code,
  Lightbulb,
  AlertTriangle,
  X,
  Keyboard
} from 'lucide-react'

import Link from 'next/link'
import type { RagDataset } from './data'
import RagArchitectureDiagram from './RagArchitectureDiagram'
import {
  buildChunkIndex,
  generateEmbedding,
  simulateRetrieval,
  generateGroundedAnswer,
  type RagRetrievalResult,
  type GeneratedAnswer
} from './utils'

type RagPipelineVisualizationProps = {
  dataset: RagDataset
  currentStepIndex: number
  onStepChange: (index: number) => void
  simulationData: {
    query: string
    queryEmbedding: number[] | null
    retrievalResults: RagRetrievalResult[]
    groundedAnswer: GeneratedAnswer | null
  }
}

const STEPS = [
  {
    id: 'query',
    title: 'User Query',
    description: 'The user enters a question in plaintext',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'embed',
    title: 'Embed Query',
    description: 'Convert the query text into a dense vector representation',
    icon: Cpu,
    color: 'emerald'
  },
  {
    id: 'search',
    title: 'Vector Search',
    description: 'Find similar chunks using cosine similarity',
    icon: Search,
    color: 'purple'
  },
  {
    id: 'retrieve',
    title: 'Retrieve Top Chunks',
    description: 'Select the most relevant document chunks',
    icon: Database,
    color: 'amber'
  },
  {
    id: 'compose',
    title: 'Compose Prompt',
    description: 'Assemble context and query into a grounded prompt',
    icon: Code,
    color: 'indigo'
  },
  {
    id: 'generate',
    title: 'Generate Answer',
    description: 'LLM generates response with citations',
    icon: Bot,
    color: 'green'
  }
] as const

// Step-specific titles and subheaders for the header section
const STEP_HEADERS: Record<string, { title: string; subheader: string }> = {
  query: {
    title: 'Capture the user\'s question',
    subheader: 'The query text is received and prepared for semantic processing. This plaintext input will be transformed into a numerical representation that enables meaning-based search.'
  },
  embed: {
    title: 'Convert user\'s query to query embeddings',
    subheader: 'The embedding model transforms the query text into a dense numerical vector. This vector captures semantic meaning, enabling similarity search where queries match documents by concept rather than exact keywords.'
  },
  search: {
    title: 'Search the vector database for similar content',
    subheader: 'The query embedding is compared against all stored document chunks using cosine similarity. This mathematical measure finds content that matches the query\'s meaning, even when wording differs.'
  },
  retrieve: {
    title: 'Retrieve the most relevant document chunks',
    subheader: 'The top-K chunks with highest similarity scores are selected. These chunks will ground the LLM\'s response, ensuring answers are tethered to actual source material rather than generated from memory alone.'
  },
  compose: {
    title: 'Compose a grounded prompt with retrieved context',
    subheader: 'The retrieved chunks are inserted into a prompt template alongside system instructions and the user\'s query. This "sandwiching" approach ensures the LLM only sees verified context, making responses citable and verifiable.'
  },
  generate: {
    title: 'Generate an answer grounded in retrieved sources',
    subheader: 'The LLM synthesizes the provided context into a coherent answer, citing specific sources. By only seeing retrieved chunks, the model produces accurate responses without hallucinating information not in the knowledge base.'
  }
}

const AUTO_ADVANCE_DELAYS = {
  query: 0,
  embed: 10000, // 10 seconds to show embedding model, then vectors
  search: 11000, // 11 seconds to show search process
  retrieve: 12000, // 12 seconds to show retrieved chunks with full details
  compose: 11000, // 11 seconds to show prompt composition
  generate: 12000 // 12 seconds to show final answer
}

// Educational content for each step
const STEP_EDUCATION: Record<string, {
  overview: string
  whyItMatters: string
  howItWorks: string
  considerations?: string
  nextStep?: string
}> = {
  query: {
    overview: 'The user query is the starting point of every RAG pipeline. This plaintext question captures the user\'s intent and will be transformed through multiple stages to retrieve relevant information.',
    whyItMatters: 'Well-formed queries lead to better retrieval. The same query processed through RAG will yield consistent, grounded answers—unlike pure LLM responses that can vary or hallucinate.',
    howItWorks: 'The query text is normalized (trimmed, standardized) but otherwise kept as-is at this stage. It will be converted to a vector representation in the next step, enabling semantic search rather than keyword matching.',
    nextStep: 'In the next step, this query will be passed to an embedding model that converts it into a dense vector—a mathematical representation of its semantic meaning.'
  },
  embed: {
    overview: 'Embedding models convert text into dense numerical vectors that capture semantic meaning. These vectors enable similarity search: queries and documents with similar meanings will have similar vector representations.',
    whyItMatters: 'Semantic search allows the system to find relevant content even when exact keywords don\'t match. For example, a query about "authentication failures" can match documents discussing "login errors" or "SSO issues" because their vectors are close in the embedding space.',
    howItWorks: 'The embedding model (like OpenAI\'s text-embedding-3-small) uses a neural network trained on vast text corpora. It outputs a fixed-size vector (1536 dimensions here) where each dimension represents a learned semantic feature. Similar concepts cluster together in this high-dimensional space. To understand how text becomes tokens before embedding, see the <a href="/demos/tokenize" class="text-blue-600 dark:text-blue-400 underline decoration-dotted hover:decoration-solid">tokenization demo</a>. For an interactive deep dive into embeddings, explore the <a href="/demos/embeddings" class="text-blue-600 dark:text-blue-400 underline decoration-dotted hover:decoration-solid">embeddings demo</a>.',
    considerations: 'Choosing the right embedding model matters: larger models may be more accurate but slower and more expensive. The same model must be used for both indexing (storing documents) and querying to ensure compatibility.',
    nextStep: 'This query vector will now be compared against all stored document chunk vectors to find the most semantically similar content.'
  },
  search: {
    overview: 'Vector similarity search compares the query embedding against all stored chunk embeddings using cosine similarity. This mathematical measure quantifies how "close" two vectors are in the embedding space.',
    whyItMatters: 'Vector search enables finding relevant content by meaning, not just keywords. This is crucial for RAG because users often phrase questions differently than how information is stored in documents. Semantic similarity bridges this gap.',
    howItWorks: 'Cosine similarity calculates the angle between two vectors, normalized by their magnitudes. The formula is: similarity = (A · B) / (||A|| × ||B||). Values range from -1 (opposite meaning) to 1 (identical meaning). The system computes this for every chunk and ranks them by score.',
    considerations: 'Vector databases like Pinecone optimize this search for speed at scale using approximate nearest neighbor (ANN) algorithms. For production systems with millions of chunks, exact similarity would be too slow.',
    nextStep: 'The top-ranked chunks will be retrieved and used to build context for the LLM, ensuring the answer is grounded in actual documents.'
  },
  retrieve: {
    overview: 'Retrieval selects the top-K most similar chunks based on similarity scores. These chunks will become the "context" that grounds the LLM\'s response, preventing hallucinations and ensuring citations.',
    whyItMatters: 'Quality retrieval is the foundation of trustworthy RAG. Poor chunks lead to irrelevant or misleading answers. The retrieved chunks are the only information the LLM will see, so precision matters more than recall here.',
    howItWorks: 'After computing similarity scores, chunks are sorted by score (highest first). The top K chunks (typically 3-5) are selected. Hybrid retrieval can combine semantic similarity with keyword matching and metadata filters for better precision.',
    considerations: 'The optimal K value balances context richness with prompt length limits. Too few chunks may miss important information; too many can dilute signal and exceed token budgets. Metadata filters (tags, dates, sources) can further refine results.',
    nextStep: 'These retrieved chunks will be inserted (sandwiched) into an existing system prompt template. The system prompt defines the assistant\'s role, and the retrieved context is literally placed between the system instructions and the user query, creating a single grounded prompt.'
  },
  compose: {
    overview: 'Prompt composition sandwiches the retrieved context chunks into an existing system prompt template. The system prompt defines the assistant\'s role and citation requirements, while the retrieved context from the previous step is literally inserted between the system instructions and the user query. This "sandwiching" approach ensures the LLM only sees the specific context retrieved, making responses verifiable and grounded.',
    whyItMatters: 'Well-structured prompts dramatically improve answer quality. By explicitly providing context and asking for citations, we ensure the LLM stays grounded. The visual separation above shows how retrieved context (highlighted in amber) is inserted into the existing system prompt—this is the core mechanism that makes RAG more reliable than pure LLM responses.',
    howItWorks: 'The prompt follows a template pattern: First, the system prompt (shown in indigo) defines the assistant\'s role and citation format—this exists independently of any query. Next, the retrieved context chunks (shown in amber, identical to what was retrieved in the previous step) are inserted into the middle. Finally, the user\'s question (shown in green) is appended. The entire prompt must fit within the model\'s context window, which constrains how much context can be included.',
    considerations: 'Prompt engineering matters: clear instructions about citation format, handling uncertainty, and what to do when context is insufficient. Token limits require balancing chunk quantity, chunk size, and prompt overhead. The retrieved context must be identical to what was shown in the previous step—no modification occurs, just insertion into the template.',
    nextStep: 'This complete prompt will be sent to the LLM, which will generate a response that synthesizes the provided context into a coherent answer with citations. The LLM only sees this single prompt containing the retrieved context sandwiched between the system instructions and query.'
  },
  generate: {
    overview: 'The LLM generates a final answer based on the grounded prompt. By only seeing the retrieved context, it can produce accurate, citable responses without hallucinating information not in the knowledge base.',
    whyItMatters: 'This final step demonstrates RAG\'s core value: combining the reasoning power of LLMs with the factual grounding of retrieval. Users get AI-powered answers they can verify by checking cited sources.',
    howItWorks: 'The LLM processes the complete prompt (instructions + context + question) and generates a response token-by-token. The model is instructed to cite sources using markers like [1], [2] corresponding to the numbered context chunks. Streaming allows users to see answers appear in real-time.',
    considerations: 'Production RAG systems monitor answer quality, citation accuracy, and user feedback. Guardrails can flag low-confidence answers or responses that cite sources incorrectly. Token usage and latency are key cost/performance metrics.',
    nextStep: 'The complete answer with citations is returned to the user, completing the RAG pipeline. Each step worked together to transform a question into a grounded, verifiable response.'
  }
}

// Helper function to render text with links
function renderTextWithLinks(text: string, colorMuted: string) {
  // Simple regex to find <a> tags and convert them to React Link components
  const parts: (string | JSX.Element)[] = []
  const linkRegex = /<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    // Add the Link component
    parts.push(
      <Link
        key={match.index}
        href={match[1] as any}
        className="text-blue-600 dark:text-blue-400 underline decoration-dotted hover:decoration-solid"
      >
        {match[2]}
      </Link>
    )
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  // If no links found, return original text
  if (parts.length === 0) {
    return text
  }
  
  return <>{parts}</>
}

// Educational section component - cleaner, less boxy, collapsible
function EducationalSection({ 
  stepId, 
  color 
}: { 
  stepId: string
  color: string 
}) {
  const content = STEP_EDUCATION[stepId]
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!content) return null

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      textMuted: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-900 dark:text-emerald-100',
      textMuted: 'text-emerald-700 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-900 dark:text-purple-100',
      textMuted: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-900 dark:text-amber-100',
      textMuted: 'text-amber-700 dark:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800',
      text: 'text-indigo-900 dark:text-indigo-100',
      textMuted: 'text-indigo-700 dark:text-indigo-300',
      icon: 'text-indigo-600 dark:text-indigo-400'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-900 dark:text-green-100',
      textMuted: 'text-green-700 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400'
    }
  }

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue

  return (
    <div className={`w-full space-y-4 ${colors.text} text-sm leading-relaxed`}>
      {/* Top level concepts - always visible, clean typography */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className={`h-4 w-4 ${colors.icon}`} />
            <span className={`font-semibold ${colors.text} text-sm`}>Overview</span>
          </div>
          <p className={`${colors.textMuted} text-sm leading-relaxed`}>{content.overview}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className={`h-4 w-4 ${colors.icon}`} />
            <span className={`font-semibold ${colors.text} text-sm`}>Why this matters</span>
          </div>
          <p className={`${colors.textMuted} text-sm leading-relaxed`}>{content.whyItMatters}</p>
        </div>
      </div>

      {/* Collapsible deep dive */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 text-xs font-medium ${colors.text} hover:opacity-80 transition-opacity py-2`}
        >
          {isExpanded ? 'Show less' : 'Deep dive: How it works & considerations'}
          <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className={`h-4 w-4 ${colors.icon}`} />
                    <span className={`font-semibold ${colors.text} text-sm`}>How it works</span>
                  </div>
                  <p className={`${colors.textMuted} text-sm leading-relaxed`}>
                    {renderTextWithLinks(content.howItWorks, colors.textMuted)}
                  </p>
                </div>

                {content.considerations && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`h-4 w-4 ${colors.icon}`} />
                      <span className={`font-semibold ${colors.text} text-sm`}>Production considerations</span>
                    </div>
                    <p className={`${colors.textMuted} text-sm leading-relaxed`}>{content.considerations}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {content.nextStep && (
        <div className={`pt-4 border-t ${colors.border} mt-2 bg-white/50 dark:bg-zinc-900/50 p-3 rounded-lg`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold ${colors.text} text-xs uppercase tracking-wide`}>Next Step</span>
          </div>
          <p className={`${colors.textMuted} text-sm`}>{content.nextStep}</p>
        </div>
      )}
    </div>
  )
}

export default function RagPipelineVisualization({ 
  dataset,
  currentStepIndex,
  onStepChange,
  simulationData
}: {
  dataset: RagDataset
  currentStepIndex: number
  onStepChange: (index: number) => void
  simulationData: any
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showKeyboardHints, setShowKeyboardHints] = useState<boolean>(false)
  const timeoutsRef = useRef<number[]>([])

  // Use passed simulation data or fallbacks
  const { 
    query: sampleQuery,
    queryEmbedding,
    retrievalResults,
    groundedAnswer
  } = simulationData

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id))
    }
  }, [])

  const handleNext = useCallback(() => {
    if (currentStepIndex < STEPS.length - 1) {
      onStepChange(currentStepIndex + 1)
    }
  }, [currentStepIndex, onStepChange])

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying || currentStepIndex >= STEPS.length - 1) {
      setIsPlaying(false)
      return
    }

    const stepId = STEPS[currentStepIndex].id
    const delay = AUTO_ADVANCE_DELAYS[stepId as keyof typeof AUTO_ADVANCE_DELAYS] || 3000

    const timeout = window.setTimeout(() => {
      handleNext()
    }, delay)

    timeoutsRef.current.push(timeout)

    return () => {
      clearTimeout(timeout)
    }
  }, [isPlaying, currentStepIndex, handleNext])

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      onStepChange(currentStepIndex - 1)
      setIsPlaying(false)
    }
  }, [currentStepIndex, onStepChange])

  const handlePlayAll = useCallback(() => {
    if (currentStepIndex === STEPS.length - 1) {
      // Reset to beginning
      onStepChange(0)
    }
    setIsPlaying(true)
  }, [currentStepIndex, onStepChange])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    onStepChange(0)
    timeoutsRef.current.forEach((id) => clearTimeout(id))
    timeoutsRef.current = []
  }, [onStepChange])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const canGoNextLocal = currentStepIndex < STEPS.length - 1
      const canGoPreviousLocal = currentStepIndex > 0

      if (e.key === 'ArrowRight' && canGoNextLocal) {
        handleNext()
      } else if (e.key === 'ArrowLeft' && canGoPreviousLocal) {
        handlePrevious()
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handlePlayAll()
      } else if (e.key === 'Escape') {
        setShowKeyboardHints(false)
      } else if (e.key === '?') {
        setShowKeyboardHints((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStepIndex, handleNext, handlePrevious, handlePlayAll])

  const currentStep = STEPS[currentStepIndex]
  const canGoNext = currentStepIndex < STEPS.length - 1
  const canGoPrevious = currentStepIndex > 0

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm relative ring-1 ring-black/5">
      {/* Keyboard Hints */}
      <AnimatePresence>
        {showKeyboardHints && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-6 z-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-4 max-w-xs ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowKeyboardHints(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>← →</span>
                <span>Navigate steps</span>
              </div>
              <div className="flex justify-between">
                <span>Space/Enter</span>
                <span>Play/Pause</span>
              </div>
              <div className="flex justify-between">
                <span>?</span>
                <span>Toggle hints</span>
              </div>
              <div className="flex justify-between">
                <span>Esc</span>
                <span>Close overlays</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Top Navigation Bar - Clean & minimal */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 bg-white/80 backdrop-blur-sm px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/80 rounded-t-xl">
        {/* Left: Navigation + Step buttons */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <div className="flex items-center rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 shrink-0">
              <span>{currentStepIndex + 1} / {STEPS.length}</span>
            </div>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0 mx-2" />
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStepIndex
              const isComplete = index < currentStepIndex
              return (
                <button
                  key={step.id}
                  onClick={() => onStepChange(index)}
                  title={`${index + 1}. ${step.title}: ${step.description}`}
                  className={`group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition shrink-0 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800'
                      : isComplete
                          ? 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                          : 'text-zinc-400 hover:bg-zinc-50 dark:text-zinc-500 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  {/* Step name - hidden on mobile, shown on larger screens */}
                  <span className={`hidden xl:inline-block whitespace-nowrap ${isActive ? 'text-blue-900 dark:text-blue-100' : ''}`}>
                    {step.title.split(' ')[0]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        {/* Right: Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowKeyboardHints(!showKeyboardHints)}
            className="hidden sm:inline-flex items-center justify-center rounded border border-zinc-300 bg-white w-7 h-7 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
            title="Keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handlePlayAll}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded border border-blue-500 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 dark:border-blue-700 dark:bg-zinc-900 dark:text-blue-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Unified Single-Flow Layout */}
      <div className="relative w-full">
        <div className="mx-auto px-4 py-2">
          
          {/* Architecture Diagram - Large and prominent, clear spacing */}
          <div className="mb-4">
            <RagArchitectureDiagram 
              currentStepIndex={currentStepIndex}
              stepTitle={STEPS[currentStepIndex].title}
              query={sampleQuery}
              queryEmbedding={queryEmbedding}
              retrievalResults={retrievalResults}
              generatedAnswer={groundedAnswer?.answer}
            />
          </div>

          {/* Step Title and Subheader - Consolidated below diagram */}
          <div className="mt-2 mb-4">
            <motion.div
              key={`step-header-${currentStepIndex}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className={`text-lg font-semibold ${getStepColorClass(currentStepIndex)} mb-1`}>
                {STEP_HEADERS[STEPS[currentStepIndex].id]?.title || STEPS[currentStepIndex].title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {STEP_HEADERS[STEPS[currentStepIndex].id]?.subheader || STEPS[currentStepIndex].description}
              </p>
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getStepColorClass(currentStepIndex).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
            
          {/* Educational Content - Inline */}
          <div className="mt-4 max-w-4xl mx-auto">
            <EducationalSection 
              stepId={STEPS[currentStepIndex].id} 
              color={getStepColorName(currentStepIndex)} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function for step colors
function getStepColorClass(stepIndex: number, muted = false): string {
  const colors = [
    muted ? 'text-blue-700 dark:text-blue-300' : 'text-blue-600 dark:text-blue-400',
    muted ? 'text-emerald-700 dark:text-emerald-300' : 'text-emerald-600 dark:text-emerald-400',
    muted ? 'text-purple-700 dark:text-purple-300' : 'text-purple-600 dark:text-purple-400',
    muted ? 'text-amber-700 dark:text-amber-300' : 'text-amber-600 dark:text-amber-400',
    muted ? 'text-indigo-700 dark:text-indigo-300' : 'text-indigo-600 dark:text-indigo-400',
    muted ? 'text-green-700 dark:text-green-300' : 'text-green-600 dark:text-green-400'
  ]
  return colors[stepIndex] || colors[0]
}

// Helper function for step color names
function getStepColorName(stepIndex: number): string {
  const colors = ['blue', 'emerald', 'purple', 'amber', 'indigo', 'green']
  return colors[stepIndex] || colors[0]
}