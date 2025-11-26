'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  Keyboard, 
  Play, 
  RotateCcw,
  Bot,
  CheckCircle,
  Clock,
  Zap,
  Trophy
} from 'lucide-react'
import { ORCHESTRATION_TASKS, TYPING_TASK } from './data'
import { getTypewriterText, calculateTypingProgress } from './utils'

type AgentStatus = 'idle' | 'speaking' | 'working' | 'complete'

interface AgentPanel {
  id: number
  instruction: string
  status: AgentStatus
  progress: number
  output: string
  speechProgress: number // 0-100 for typewriter effect during speaking
}

interface MultiAgentOrchestrationProps {
  autoPlay?: boolean
}

export default function MultiAgentOrchestration({ autoPlay = false }: MultiAgentOrchestrationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const [currentVoicePanel, setCurrentVoicePanel] = useState(-1)
  const [voicePanels, setVoicePanels] = useState<AgentPanel[]>(
    ORCHESTRATION_TASKS.map(t => ({ ...t, status: 'idle' as AgentStatus, progress: 0, speechProgress: 0 }))
  )
  const [typingProgress, setTypingProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [demoComplete, setDemoComplete] = useState(false)
  const [voiceWinTime, setVoiceWinTime] = useState<number | null>(null) // Time when all voice tasks completed

  // Main animation loop
  useEffect(() => {
    if (!isPlaying) return

    const startTime = Date.now()
    let frame: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      setElapsedTime(elapsed)

      // Update typing progress (slow - 90 WPM)
      const newTypingProgress = calculateTypingProgress(90, TYPING_TASK.totalChars, elapsed)
      setTypingProgress(newTypingProgress)

      // Voice panel orchestration timeline (slowed for visibility):
      // 0-3s: Speaking to panel 1
      // 3s: Panel 1 starts working
      // 3-6s: Speaking to panel 2
      // 6s: Panel 2 starts working
      // 6-9s: Speaking to panel 3
      // 9s: Panel 3 starts working
      // Then all 3 voice panels work in parallel while typing is still going

      const speakDuration = 3000 // 3 seconds per voice instruction
      const workDuration = 6000 // 6 seconds for each agent to complete

      // Determine which panel we're speaking to
      if (elapsed < speakDuration) {
        setCurrentVoicePanel(0)
      } else if (elapsed < speakDuration * 2) {
        setCurrentVoicePanel(1)
      } else if (elapsed < speakDuration * 3) {
        setCurrentVoicePanel(2)
      } else {
        setCurrentVoicePanel(-1) // Done speaking
      }

      // Update voice panels
      setVoicePanels(prev => prev.map((panel, idx) => {
        const speakStart = idx * speakDuration
        const speakEnd = speakStart + speakDuration
        const workStart = speakEnd

        if (elapsed < speakStart) {
          return { ...panel, status: 'idle', progress: 0, speechProgress: 0 }
        } else if (elapsed < speakEnd) {
          // Speaking phase - calculate speech progress for typewriter effect
          const speechProgress = ((elapsed - speakStart) / (speakEnd - speakStart)) * 100
          return { ...panel, status: 'speaking', progress: 0, speechProgress: Math.min(100, speechProgress) }
        } else if (elapsed < workStart + workDuration) {
          // Working phase
          const workProgress = ((elapsed - workStart) / workDuration) * 100
          return { ...panel, status: 'working', progress: Math.min(100, workProgress), speechProgress: 100 }
        } else {
          // Complete
          return { ...panel, status: 'complete', progress: 100, speechProgress: 100 }
        }
      }))

      // Check if all voice tasks complete (15s mark)
      // All 3 panels complete after: speakEnd (9s) + workDuration (6s) = 15s
      const allVoiceDone = elapsed >= 15000
      if (allVoiceDone && voiceWinTime === null) {
        setVoiceWinTime(elapsed)
        setDemoComplete(true)
      }

      // Stop after 30 seconds or when typing completes
      if (elapsed < 30000 && newTypingProgress < 100) {
        frame = requestAnimationFrame(animate)
      } else {
        setIsPlaying(false)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isPlaying, voiceWinTime]) // Track voiceWinTime instead of demoComplete to avoid re-render loop

  // Auto-play when triggered by scroll
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed && !isPlaying && elapsedTime === 0) {
      setHasAutoPlayed(true)
      setIsPlaying(true)
    }
  }, [autoPlay, hasAutoPlayed, isPlaying, elapsedTime])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    setDemoComplete(false)
    setVoiceWinTime(null)
    setElapsedTime(0)
    setTypingProgress(0)
    setCurrentVoicePanel(-1)
    setVoicePanels(ORCHESTRATION_TASKS.map(t => ({ ...t, status: 'idle' as AgentStatus, progress: 0, speechProgress: 0 })))
  }, [])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setDemoComplete(false)
    setVoiceWinTime(null)
    setElapsedTime(0)
    setTypingProgress(0)
    setCurrentVoicePanel(-1)
    setVoicePanels(ORCHESTRATION_TASKS.map(t => ({ ...t, status: 'idle' as AgentStatus, progress: 0, speechProgress: 0 })))
  }, [])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const tenths = Math.floor((ms % 1000) / 100)
    return `${seconds}.${tenths}s`
  }

  const voiceTasksComplete = voicePanels.filter(p => p.status === 'complete').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Voice Speed Enables Parallel Orchestration
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Watch how speaking at 170 WPM lets you dispatch instructions to multiple Cursor agents 
          before a keyboard user even finishes typing one task
        </p>
      </div>

      {/* Main visualization */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        {/* Timer and stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Clock className="h-4 w-4" />
              {formatTime(elapsedTime)}
            </div>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs"
              >
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-zinc-500 dark:text-zinc-400">Live Demo</span>
              </motion.div>
            )}
          </div>
          {voiceTasksComplete > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400"
            >
              <Zap className="h-4 w-4" />
              {voiceTasksComplete}/3 voice tasks complete
            </motion.div>
          )}
        </div>

        {/* Voice Panels - top row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {voicePanels.map((panel, idx) => (
            <motion.div
              key={panel.id}
              className={`
                relative rounded-xl border-2 p-4 transition-colors
                ${panel.status === 'speaking' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : panel.status === 'working'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : panel.status === 'complete'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                }
              `}
              animate={currentVoicePanel === idx ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`
                    flex h-6 w-6 items-center justify-center rounded-md
                    ${panel.status === 'complete' 
                      ? 'bg-green-500' 
                      : panel.status === 'working'
                        ? 'bg-blue-500'
                        : panel.status === 'speaking'
                          ? 'bg-purple-500'
                          : 'bg-zinc-300 dark:bg-zinc-600'
                    }
                  `}>
                    {panel.status === 'speaking' ? (
                      <Mic className="h-3 w-3 text-white" />
                    ) : panel.status === 'complete' ? (
                      <CheckCircle className="h-3 w-3 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    Cursor Agent {idx + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Mic className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-600 dark:text-purple-400">Voice</span>
                </div>
              </div>

              {/* Instruction */}
              <div className="text-xs text-zinc-700 dark:text-zinc-300 mb-3 min-h-[40px] font-mono">
                {panel.status === 'idle' ? (
                  <span className="text-zinc-400 italic">Waiting...</span>
                ) : (
                  <>
                    {getTypewriterText(panel.instruction, panel.speechProgress)}
                    {panel.status === 'speaking' && (
                      <span className="inline-block w-0.5 h-3 bg-purple-500 animate-pulse ml-0.5" />
                    )}
                  </>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    panel.status === 'complete' 
                      ? 'bg-green-500' 
                      : panel.status === 'working'
                        ? 'bg-blue-500'
                        : 'bg-purple-500'
                  }`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${panel.progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Status label */}
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {panel.status === 'idle' && 'Idle'}
                {panel.status === 'speaking' && (
                  <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                    Receiving voice instruction...
                  </span>
                )}
                {panel.status === 'working' && (
                  <span className="text-blue-600 dark:text-blue-400">
                    Working... {Math.round(panel.progress)}%
                  </span>
                )}
                {panel.status === 'complete' && (
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Complete!
                  </span>
                )}
              </div>

              {/* Output preview for complete panels */}
              <AnimatePresence>
                {panel.status === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-green-200 dark:border-green-800"
                  >
                    <pre className="text-[10px] text-green-700 dark:text-green-300 whitespace-pre-wrap">
                      {panel.output}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* vs divider */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">vs</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        </div>

        {/* Keyboard Panel - bottom row (full width) */}
        <div className="mb-6">
          <motion.div
            className={`
              relative rounded-xl border-2 p-4
              ${typingProgress >= 100 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50'
              }
            `}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`
                  flex h-6 w-6 items-center justify-center rounded-md
                  ${typingProgress >= 100 ? 'bg-green-500' : 'bg-zinc-400 dark:bg-zinc-500'}
                `}>
                  <Keyboard className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Keyboard User
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Keyboard className="h-3 w-3 text-zinc-400" />
                <span className="text-xs text-zinc-500">90 WPM</span>
              </div>
            </div>

            {/* Typing animation */}
            <div className="text-xs text-zinc-700 dark:text-zinc-300 mb-3 min-h-[40px] font-mono">
              {getTypewriterText(TYPING_TASK.instruction, typingProgress)}
              {typingProgress < 100 && (
                <span className="inline-block w-0.5 h-3 bg-zinc-500 animate-pulse ml-0.5" />
              )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${typingProgress >= 100 ? 'bg-green-500' : 'bg-zinc-400'}`}
                style={{ width: `${typingProgress}%` }}
              />
            </div>

            {/* Status */}
            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {typingProgress >= 100 ? (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Finally done!
                </span>
              ) : (
                <span>Still typing... {Math.round(typingProgress)}%</span>
              )}
            </div>

            {/* Snail indicator */}
            {typingProgress < 100 && voiceTasksComplete >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-2 -right-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs px-2 py-1 rounded-full"
              >
                🐌
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Victory Banner */}
        <AnimatePresence>
          {demoComplete && voiceWinTime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="mb-6 p-5 rounded-xl bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-teal-900/40 border-2 border-green-400 dark:border-green-600 shadow-lg"
            >
              {/* Trophy and main message */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <motion.div
                  initial={{ rotate: -20 }}
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </motion.div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-800 dark:text-green-200">
                    🎉 Voice Wins!
                  </p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                    3 tasks dispatched & completed in {formatTime(voiceWinTime)}
                  </p>
                </div>
                <motion.div
                  initial={{ rotate: 20 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </motion.div>
              </div>
              
              {/* Stats comparison */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-green-200/50 dark:bg-green-800/30">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Mic className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Voice User</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">3 tasks</p>
                  <p className="text-xs text-green-600 dark:text-green-400">All complete ✓</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-zinc-200/50 dark:bg-zinc-700/30">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Keyboard className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Keyboard User</span>
                  </div>
                  <p className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">1 task</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Still typing... {Math.round(typingProgress)}%</p>
                </div>
              </div>
              
              <p className="text-center text-xs text-green-600 dark:text-green-400 mt-3 font-medium">
                9 seconds of speech → 3 parallel workstreams complete while keyboard user types 1 instruction
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`
              inline-flex items-center gap-2 rounded-lg px-5 py-2.5
              text-sm font-semibold text-white shadow-md transition-all
              ${isPlaying
                ? 'bg-zinc-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:scale-105'
              }
            `}
          >
            <Play className="h-4 w-4" />
            {isPlaying ? 'Running...' : 'Start Race'}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800/50 p-4">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Why This Matters
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          When you can dispatch instructions at the speed of speech (170+ WPM vs 90 WPM typing), 
          you can orchestrate multiple AI agents in parallel. While the keyboard user is still 
          composing their first task, voice users have already dispatched three tasks and agents 
          are working simultaneously. This is the multiplexing advantage that makes voice-first 
          development transformative.
        </p>
      </div>
    </div>
  )
}

