'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  Layers,
  Lightbulb,
  AlertTriangle,
  Info,
  X,
  Keyboard
} from 'lucide-react'

import Link from 'next/link'
import type { RagDataset } from './data'
import { generateEmbedding, buildChunkIndex, simulateRetrieval, generateGroundedAnswer, type RagRetrievalResult } from './utils'
import RagArchitectureDiagram from './RagArchitectureDiagram'

type RagPipelineVisualizationProps = {
  dataset: RagDataset
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

const EMBEDDING_MODEL = {
  name: 'text-embedding-3-small',
  provider: 'OpenAI',
  dimensions: 1536,
  maxTokens: 8191
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

// Educational section component - always expanded and scrollable
function EducationalSection({ 
  stepId, 
  color 
}: { 
  stepId: string
  color: string 
}) {
  const content = STEP_EDUCATION[stepId]
  
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

  // Get scrollbar color based on step color
  const scrollbarColors: Record<string, string> = {
    blue: '#3b82f640',
    emerald: '#10b98140',
    purple: '#a855f740',
    amber: '#f59e0b40',
    indigo: '#6366f140',
    green: '#22c55e40'
  }
  const scrollbarColor = scrollbarColors[color] || scrollbarColors.blue

  return (
    <div className={`w-full space-y-4 ${colors.text} text-sm leading-relaxed`}>
      <div className={`rounded-lg ${colors.bg} ${colors.border} border p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className={`h-4 w-4 ${colors.icon}`} />
          <span className={`font-semibold ${colors.text} text-sm`}>Overview</span>
        </div>
        <p className={`${colors.textMuted} text-sm leading-relaxed`}>{content.overview}</p>
      </div>

      <div className={`rounded-lg ${colors.bg} ${colors.border} border p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className={`h-4 w-4 ${colors.icon}`} />
          <span className={`font-semibold ${colors.text} text-sm`}>Why this matters</span>
        </div>
        <p className={`${colors.textMuted} text-sm leading-relaxed`}>{content.whyItMatters}</p>
      </div>

      <div className={`rounded-lg ${colors.bg} ${colors.border} border p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <Cpu className={`h-4 w-4 ${colors.icon}`} />
          <span className={`font-semibold ${colors.text} text-sm`}>How it works</span>
        </div>
        <p className={`${colors.textMuted} text-sm leading-relaxed`}>{renderTextWithLinks(content.howItWorks, colors.textMuted)}</p>
      </div>

      {content.considerations && (
        <div className={`rounded-lg ${colors.bg} ${colors.border} border p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`h-4 w-4 ${colors.icon}`} />
            <span className={`font-semibold ${colors.text} text-sm`}>Production considerations</span>
          </div>
          <p className={`${colors.textMuted} text-sm leading-relaxed`}>{content.considerations}</p>
        </div>
      )}

      {content.nextStep && (
        <div className={`pt-3 border-t-2 ${colors.border} mt-4`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className={`h-5 w-5 ${colors.icon}`} />
            <span className={`font-semibold ${colors.text}`}>Next step</span>
          </div>
          <p className={`${colors.textMuted} text-sm leading-relaxed`}>{content.nextStep}</p>
        </div>
      )}
    </div>
  )
}

export default function RagPipelineVisualization({ dataset }: RagPipelineVisualizationProps) {
  const [query] = useState<string>(dataset.sampleQueries[0] ?? 'How should we troubleshoot SSO provisioning failures?')
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queryEmbedding, setQueryEmbedding] = useState<number[] | null>(null)
  const [retrievalResults, setRetrievalResults] = useState<RagRetrievalResult[]>([])
  const [composedPrompt, setComposedPrompt] = useState<string>('')
  const [promptParts, setPromptParts] = useState<{ systemPrompt: string; contextSections: Array<{ text: string; docTitle: string; index: number }>; userQuery: string } | null>(null)
  const [generatedAnswer, setGeneratedAnswer] = useState<string>('')
  const [citations, setCitations] = useState<Array<{ title: string; chunkId: string }>>([])
  const [showKeyboardHints, setShowKeyboardHints] = useState<boolean>(false)
  const timeoutsRef = useRef<number[]>([])

  // Pre-compute chunks for the dataset
  const chunks = useMemo(() => buildChunkIndex(dataset, 50), [dataset])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id))
    }
  }, [])

  const handleNext = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < STEPS.length - 1) {
        return prev + 1
      }
      return prev
    })
  }, [])

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



  // Compute data for each step
  useEffect(() => {
    if (currentStepIndex >= 1) {
      // Generate embedding
      const embedding = generateEmbedding(query)
      setQueryEmbedding(embedding)
    }

    if (currentStepIndex >= 2) {
      // Perform retrieval (for Vector Search step and beyond)
      const results = simulateRetrieval({
        query,
        chunks,
        topK: 3,
        mode: 'hybrid'
      })
      setRetrievalResults(results)
    }

    if (currentStepIndex >= 4) {
      // Compose prompt
      const results = simulateRetrieval({
        query,
        chunks,
        topK: 3,
        mode: 'hybrid'
      })
      const answer = generateGroundedAnswer({
        query,
        selectedChunks: results,
        dataset
      })
      setComposedPrompt(answer.prompt)
      setPromptParts(answer.promptParts || null)
      setCitations(answer.citations)
    }

    if (currentStepIndex >= 5) {
      // Generate answer
      const results = simulateRetrieval({
        query,
        chunks,
        topK: 3,
        mode: 'hybrid'
      })
      const answer = generateGroundedAnswer({
        query,
        selectedChunks: results,
        dataset
      })
      setGeneratedAnswer(answer.answer)
    }
  }, [currentStepIndex, query, chunks, dataset])

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      setIsPlaying(false)
    }
  }, [currentStepIndex])

  const handlePlayAll = useCallback(() => {
    if (currentStepIndex === STEPS.length - 1) {
      // Reset to beginning
      setCurrentStepIndex(0)
      setQueryEmbedding(null)
      setRetrievalResults([])
      setComposedPrompt('')
      setPromptParts(null)
      setGeneratedAnswer('')
      setCitations([])
    }
    setIsPlaying(true)
  }, [currentStepIndex])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setQueryEmbedding(null)
    setRetrievalResults([])
    setComposedPrompt('')
    setPromptParts(null)
    setGeneratedAnswer('')
    setCitations([])
    timeoutsRef.current.forEach((id) => clearTimeout(id))
    timeoutsRef.current = []
  }, [])

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
    <div className="space-y-8 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 shadow-lg relative">
      {/* Keyboard Hints */}
      <AnimatePresence>
        {showKeyboardHints && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 right-6 z-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-4 max-w-xs"
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
      {/* Top Navigation Bar - Compact horizontal layout */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900/50">
        {/* Left: Navigation + Step buttons */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="inline-flex items-center gap-0.5 rounded border border-blue-300 bg-white px-2 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-200"
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <div className="flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200 shrink-0">
              <span>{currentStepIndex + 1}/{STEPS.length}</span>
            </div>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="inline-flex items-center gap-0.5 rounded border border-blue-300 bg-white px-2 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-200"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="h-4 w-px bg-blue-200 dark:bg-blue-800 shrink-0" />
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStepIndex
              const isComplete = index < currentStepIndex
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(index)}
                  title={`${index + 1}. ${step.title}: ${step.description}`}
                  className={`group flex items-center gap-1 rounded px-1.5 py-1 text-[10px] transition shrink-0 ${
                    isActive
                      ? 'bg-blue-100 text-blue-900 shadow-sm dark:bg-blue-900/40 dark:text-blue-100'
                      : isComplete
                          ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                          : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="font-semibold">{index + 1}</span>
                  {/* Step name - hidden on mobile, shown on larger screens */}
                  <span className="hidden xl:inline-block ml-0.5 text-[9px] opacity-70 max-w-[60px] truncate">
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

      {/* Step Title and Subheader - Thin header section */}
      <div className="border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3">
        <motion.div
          key={`step-header-${currentStepIndex}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-auto max-w-6xl"
        >
          <h2 className={`text-lg font-semibold ${getStepColorClass(currentStepIndex)} mb-1`}>
            {STEP_HEADERS[STEPS[currentStepIndex].id]?.title || STEPS[currentStepIndex].title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {STEP_HEADERS[STEPS[currentStepIndex].id]?.subheader || STEPS[currentStepIndex].description}
          </p>
        </motion.div>
      </div>

      {/* Unified Single-Flow Layout */}
      <div className="relative w-full">
        <div className="mx-auto px-4 py-4">
          {/* Orientation headline above diagram */}
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Interact with the RAG pipeline step by step
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              See inputs, outputs, and understand the entire flow as data moves through each stage
            </p>
          </div>
          
          {/* Architecture Diagram - Large and prominent, clear spacing */}
          <div className="mb-4">
            <RagArchitectureDiagram 
              currentStepIndex={currentStepIndex}
              query={query}
              queryEmbedding={queryEmbedding}
              retrievalResults={retrievalResults}
              composedPrompt={composedPrompt}
              generatedAnswer={generatedAnswer}
            />
          </div>

          {/* Data Inputs/Outputs - TOPMOST UNDER CANVAS */}
          <AnimatePresence mode="wait">
              {currentStepIndex === 0 && (
                <motion.div
                  key="step-0-data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  <div className="rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-blue-50/80 dark:bg-blue-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                        Input: User Query
                      </div>
                    </div>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">{query}</div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-blue-600 dark:text-blue-400">
                      <span>{query.split(/\s+/).length} words</span>
                      <span>•</span>
                      <span>{query.length} chars</span>
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStepIndex === 1 && queryEmbedding && (
                <motion.div
                  key="step-1-data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  <div className="rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Input: Query Text
                      </div>
                    </div>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium line-clamp-2">{query}</div>
                  </div>
                  <div className="rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Model: {EMBEDDING_MODEL.name}
                      </div>
                    </div>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                      {EMBEDDING_MODEL.dimensions} dimensions • {EMBEDDING_MODEL.provider}
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Output: Embedding Vector
                      </div>
                    </div>
                    <div className="text-sm font-mono text-zinc-900 dark:text-zinc-100 font-medium">
                      [{EMBEDDING_MODEL.dimensions} dimensions]
                    </div>
                    <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      Sample: [{queryEmbedding.slice(0, 3).map(v => v.toFixed(3)).join(', ')}, ...]
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStepIndex === 2 && queryEmbedding && retrievalResults.length > 0 && (
                <motion.div
                  key="step-2-data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="rounded-lg border-2 border-purple-300 dark:border-purple-700 bg-purple-50/80 dark:bg-purple-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                        Vector DB Search Results: Top {retrievalResults.length} Retrieved Documents
                      </div>
                    </div>
                    <div className="space-y-3">
                      {retrievalResults.map((r, i) => {
                        const jsonPayload = {
                          id: r.chunk.id,
                          rank: i + 1,
                          score: parseFloat((r.score * 100).toFixed(2)),
                          similarity: parseFloat((r.similarity * 100).toFixed(2)),
                          semanticScore: parseFloat((r.semanticScore * 100).toFixed(2)),
                          keywordScore: parseFloat((r.keywordScore * 100).toFixed(2)),
                          hybridScore: parseFloat((r.hybridScore * 100).toFixed(2)),
                          document: {
                            docId: r.chunk.docId,
                            docTitle: r.chunk.docTitle,
                            chunkId: r.chunk.id,
                            content: r.chunk.text,
                            metadata: {
                              tags: r.chunk.tags,
                              lastUpdated: r.chunk.lastUpdated,
                              wordCount: r.chunk.wordCount,
                              keywords: r.chunk.keywords.slice(0, 5)
                            }
                          },
                          retrieval: {
                            estimatedTokens: r.estimatedTokens,
                            matchReasons: r.reasons,
                            retrievedAt: new Date().toISOString()
                          }
                        }
                        return (
                          <div key={i} className="rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-zinc-900 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                Result #{i + 1} • Score: {(r.score * 100).toFixed(1)}%
                              </span>
                              <span className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                                {r.chunk.docTitle}
                              </span>
                            </div>
                            <pre className="text-[10px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-purple-100 dark:border-purple-900">
                              {JSON.stringify(jsonPayload, null, 2)}
                            </pre>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStepIndex === 3 && retrievalResults.length > 0 && (
                <motion.div
                  key="step-3-data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  <div className="rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                        Retrieved: Top {retrievalResults.length} Chunks
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      {retrievalResults.map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-zinc-800/60">
                          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">#{i + 1}</span>
                          <span className="text-amber-600 dark:text-amber-400 font-mono">{(r.score * 100).toFixed(1)}%</span>
                          <span className="text-zinc-700 dark:text-zinc-300 text-[10px] truncate flex-1 ml-2">{r.chunk.docTitle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {retrievalResults[0] && (
                    <div className="md:col-span-2 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-900/30 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <div className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                          Top Match Preview
                        </div>
                      </div>
                      <div className="text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed line-clamp-4">
                        {retrievalResults[0].chunk.text}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              {currentStepIndex === 4 && composedPrompt && retrievalResults.length > 0 && (
                <motion.div
                  key="step-4-data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="rounded-lg border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50/80 dark:bg-indigo-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                        App Server: Prompt Composition & Data Enrichment
                      </div>
                    </div>
                    <div className="space-y-3">
                      {/* Input: Raw Retrieved Data */}
                      <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 p-3">
                        <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                          Input: Raw Retrieved Chunks ({retrievalResults.length} documents)
                        </div>
                        <pre className="text-[10px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-indigo-100 dark:border-indigo-900 max-h-32 overflow-y-auto">
                          {JSON.stringify({
                            retrievedChunks: retrievalResults.map((r, i) => ({
                              rank: i + 1,
                              chunkId: r.chunk.id,
                              docTitle: r.chunk.docTitle,
                              content: r.chunk.text.substring(0, 80) + '...',
                              metadata: {
                                tags: r.chunk.tags,
                                lastUpdated: r.chunk.lastUpdated
                              },
                              score: parseFloat((r.score * 100).toFixed(2))
                            }))
                          }, null, 2)}
                        </pre>
                      </div>

                      {/* Application Enrichment */}
                      <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 p-3">
                        <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                          Application Processing: Context Enrichment
                        </div>
                        <div className="text-[10px] text-zinc-600 dark:text-zinc-400 space-y-1 mb-2">
                          <div>✓ Adding source numbers and metadata</div>
                          <div>✓ Formatting context sections with headers</div>
                          <div>✓ Adding system instructions for citation format</div>
                          <div>✓ Token estimation and validation</div>
                          <div>✓ Preparing structured prompt template</div>
                        </div>
                        <pre className="text-[10px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-indigo-100 dark:border-indigo-900 max-h-40 overflow-y-auto">
                          {JSON.stringify({
                            enrichedContext: {
                              totalChunks: retrievalResults.length,
                              totalTokens: retrievalResults.reduce((sum, r) => sum + r.estimatedTokens, 0),
                              sources: retrievalResults.map((r, i) => ({
                                sourceNumber: i + 1,
                                title: r.chunk.docTitle,
                                lastUpdated: r.chunk.lastUpdated,
                                wordCount: r.chunk.wordCount,
                                tags: r.chunk.tags
                              })),
                              systemInstructions: 'Cite source numbers in brackets when referencing information',
                              citationFormat: '[1], [2], [3]'
                            }
                          }, null, 2)}
                        </pre>
                      </div>

                      {/* Output: Composed Prompt with Highlighted Context */}
                      <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-900 p-3">
                        <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                          Output: Grounded Prompt ({composedPrompt.split(/\s+/).length} tokens)
                        </div>
                        <div className="text-[9px] text-zinc-600 dark:text-zinc-400 mb-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded bg-indigo-200 dark:bg-indigo-800"></span>
                            <span>System prompt (existing, always present)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded bg-amber-200 dark:bg-amber-800"></span>
                            <span>Retrieved context (sandwiched from previous step)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-800"></span>
                            <span>User query</span>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto bg-zinc-50 dark:bg-zinc-950 p-3 rounded border border-indigo-100 dark:border-indigo-900 max-h-64 overflow-y-auto leading-relaxed">
                          {promptParts ? (
                            <div className="space-y-2 whitespace-pre-wrap">
                              {/* System Prompt */}
                              <div>
                                <span className="bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded border border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100 font-semibold">
                                  {promptParts.systemPrompt}
                                </span>
                              </div>
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Context:</span>
                              </div>
                              {/* Context Sections - Highlighted */}
                              {promptParts.contextSections.map((section, idx) => (
                                <div key={idx} className="pl-2 border-l-2 border-amber-300 dark:border-amber-700">
                                  <span className="bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100">
                                    {section.text}
                                  </span>
                                </div>
                              ))}
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Question: </span>
                                <span className="bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 font-semibold">
                                  {promptParts.userQuery}
                                </span>
                              </div>
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Answer:</span>
                              </div>
                            </div>
                          ) : (
                            <pre className="whitespace-pre-wrap">{composedPrompt}</pre>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {currentStepIndex === 5 && generatedAnswer && (
                <motion.div
                  key="step-5-data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  <div className="rounded-lg border-2 border-green-300 dark:border-green-700 bg-green-50/80 dark:bg-green-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
                        Input: Grounded Prompt
                      </div>
                    </div>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                      {composedPrompt.split(/\s+/).length} tokens sent to LLM
                    </div>
                  </div>
                  <div className="md:col-span-2 rounded-lg border-2 border-green-300 dark:border-green-700 bg-green-50/80 dark:bg-green-900/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <div className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
                        Output: Generated Answer
                      </div>
                    </div>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed line-clamp-4">
                      {generatedAnswer}
                    </div>
                    {citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t-2 border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                          <FileText className="h-3 w-3" />
                          <span className="font-semibold">{citations.length} citation{citations.length > 1 ? 's' : ''}:</span>
                          <span className="text-green-600 dark:text-green-400">{citations.map(c => c.title).join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          {/* Progress Indicator */}
          <div className="mt-6 mb-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span>Pipeline Progress</span>
              <span>{Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getStepColorClass(currentStepIndex).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Title and Description */}
          <div className="mt-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getStepColorClass(currentStepIndex).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} bg-opacity-10 dark:bg-opacity-20`}>
                {(() => {
                  const Icon = currentStep.icon
                  return <Icon className={`h-5 w-5 ${getStepColorClass(currentStepIndex)}`} />
                })()}
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${getStepColorClass(currentStepIndex)}`}>
                  Step {currentStepIndex + 1}: {currentStep.title}
                </h3>
                <p className={`text-sm text-zinc-600 dark:text-zinc-400`}>
                  {currentStep.description}
                </p>
              </div>
            </div>
            
            {/* Educational Content - Inline */}
            <div className="mt-6">
              <EducationalSection 
                stepId={STEPS[currentStepIndex].id} 
                color={getStepColorName(currentStepIndex)} 
              />
            </div>
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
