'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  Waves, 
  Brain, 
  FileText, 
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react'
import { VOICE_PIPELINE_STEPS, SAMPLE_DICTATION } from './data'
import { generateWaveformData, getTypewriterText } from './utils'

interface VoicePipelineVisualizationProps {
  onComplete?: () => void
  autoPlay?: boolean
}

export default function VoicePipelineVisualization({ 
  onComplete,
  autoPlay = false
}: VoicePipelineVisualizationProps) {
  const [currentStep, setCurrentStep] = useState(-1) // -1 = not started
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [rawTextProgress, setRawTextProgress] = useState(0)
  const [enhancedTextProgress, setEnhancedTextProgress] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
    return () => {
      // Cancel any ongoing speech when unmounting
      synthRef.current?.cancel()
    }
  }, [])

  // Speak the sample text when entering capture step
  useEffect(() => {
    if (currentStep !== 0 || !audioEnabled || !synthRef.current) return
    
    // Cancel any previous speech
    synthRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(SAMPLE_DICTATION.raw)
    utterance.rate = 1.1 // Slightly faster for natural feel
    utterance.pitch = 1.0
    utterance.volume = 0.8
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    synthRef.current.speak(utterance)
    
    return () => {
      synthRef.current?.cancel()
      setIsSpeaking(false)
    }
  }, [currentStep, audioEnabled])

  // Animate waveform when in capture step
  useEffect(() => {
    if (currentStep !== 0) return
    
    let frame: number
    let time = 0
    
    const animate = () => {
      time += 0.05
      setWaveformData(generateWaveformData(40, 0.8, time))
      frame = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(frame)
  }, [currentStep])

  // Animate raw text appearing
  useEffect(() => {
    if (currentStep !== 1) return
    
    const duration = VOICE_PIPELINE_STEPS[1].duration
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / duration) * 100)
      setRawTextProgress(progress)
      
      if (progress < 100) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [currentStep])

  // Animate enhanced text appearing
  useEffect(() => {
    if (currentStep !== 2) return
    
    const duration = VOICE_PIPELINE_STEPS[2].duration
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / duration) * 100)
      setEnhancedTextProgress(progress)
      
      if (progress < 100) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [currentStep])

  // Auto-advance through steps
  useEffect(() => {
    if (!isPlaying || currentStep >= VOICE_PIPELINE_STEPS.length - 1) {
      if (currentStep >= VOICE_PIPELINE_STEPS.length - 1) {
        setIsPlaying(false)
        onComplete?.()
      }
      return
    }

    const step = VOICE_PIPELINE_STEPS[currentStep] || VOICE_PIPELINE_STEPS[0]
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, step.duration)

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, onComplete])

  // Auto-play when triggered by scroll
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed && currentStep === -1) {
      setHasAutoPlayed(true)
      setCurrentStep(0)
      setIsPlaying(true)
    }
  }, [autoPlay, hasAutoPlayed, currentStep])

  const handlePlay = useCallback(() => {
    if (currentStep >= VOICE_PIPELINE_STEPS.length - 1) {
      // Reset if at end
      setCurrentStep(-1)
      setRawTextProgress(0)
      setEnhancedTextProgress(0)
    }
    setCurrentStep(0)
    setIsPlaying(true)
  }, [currentStep])

  const handleReset = useCallback(() => {
    setCurrentStep(-1)
    setIsPlaying(false)
    setRawTextProgress(0)
    setEnhancedTextProgress(0)
    setWaveformData([])
    // Cancel any ongoing speech
    synthRef.current?.cancel()
    setIsSpeaking(false)
  }, [])

  const stepIcons = [Mic, Waves, Brain, FileText]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          How Voice-to-Text Actually Works
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Watch your messy speech transform into polished, professional text
        </p>
      </div>

      {/* Hero video - Voice driving Cursor */}
      <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block bg-zinc-900"
          style={{ minHeight: '280px' }}
        >
          <source src="https://zackproser.b-cdn.net/images/drive-cursor.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-center">
          <p className="text-sm font-medium text-white">
            Speak naturally → WisprFlow transcribes → Polished text appears in Cursor
          </p>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="relative rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8">
          {VOICE_PIPELINE_STEPS.map((step, index) => {
            const Icon = stepIcons[index]
            const isActive = currentStep === index
            const isComplete = currentStep > index
            const isPending = currentStep < index
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <motion.div
                  className={`
                    relative flex flex-col items-center
                    ${isPending ? 'opacity-40' : ''}
                  `}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                >
                  <div className={`
                    flex h-12 w-12 items-center justify-center rounded-xl
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30' 
                      : isComplete 
                        ? 'bg-green-500 shadow-md shadow-green-500/20'
                        : 'bg-zinc-200 dark:bg-zinc-700'
                    }
                  `}>
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white font-bold"
                      >
                        ✓
                      </motion.div>
                    ) : (
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'}`} />
                    )}
                  </div>
                  <span className={`
                    mt-2 text-xs font-medium text-center
                    ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-500 dark:text-zinc-400'}
                  `}>
                    {step.title}
                  </span>
                </motion.div>
                
                {index < VOICE_PIPELINE_STEPS.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div className="h-0.5 bg-zinc-200 dark:bg-zinc-700 relative overflow-hidden rounded-full">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-600"
                        initial={{ width: '0%' }}
                        animate={{ width: currentStep > index ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Main visualization area */}
        <div className="min-h-[200px] relative">
          <AnimatePresence mode="wait">
            {/* Step 0: Voice Capture with Waveform */}
            {currentStep === 0 && (
              <motion.div
                key="capture"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center justify-center gap-1 h-20">
                  {waveformData.map((amplitude, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-full"
                      style={{ height: `${amplitude * 60}px` }}
                      animate={{ height: `${amplitude * 60}px` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 italic">
                  &ldquo;{SAMPLE_DICTATION.raw.slice(0, 50)}...&rdquo;
                </p>
                <p className="mt-2 text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Recording...
                </p>
              </motion.div>
            )}

            {/* Step 1: Raw Transcription */}
            {currentStep === 1 && (
              <motion.div
                key="transcribe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Raw Transcription
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4 font-mono text-sm">
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {getTypewriterText(SAMPLE_DICTATION.raw, rawTextProgress)}
                  </span>
                  {rawTextProgress < 100 && (
                    <span className="inline-block w-0.5 h-4 bg-purple-500 animate-pulse ml-0.5" />
                  )}
                </div>
                <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
                  Notice the &ldquo;um&rdquo;, &ldquo;like&rdquo;, &ldquo;uh&rdquo; filler words...
                </p>
              </motion.div>
            )}

            {/* Step 2: AI Enhancement */}
            {currentStep === 2 && (
              <motion.div
                key="enhance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div>
                    <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Before (Raw)
                    </p>
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-xs text-red-700 dark:text-red-300 line-through opacity-60">
                      {SAMPLE_DICTATION.raw}
                    </div>
                  </div>
                  {/* After */}
                  <div>
                    <p className="text-xs font-medium text-green-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      After (Enhanced)
                    </p>
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-xs text-green-700 dark:text-green-300">
                      {getTypewriterText(SAMPLE_DICTATION.enhanced, enhancedTextProgress)}
                      {enhancedTextProgress < 100 && (
                        <span className="inline-block w-0.5 h-3 bg-green-500 animate-pulse ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <motion.div
                    className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Brain className="h-4 w-4" />
                    AI processing...
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Final Output */}
            {currentStep === 3 && (
              <motion.div
                key="output"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-300"
                  >
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Text inserted at cursor!
                  </motion.div>
                </div>
                <motion.div
                  className="rounded-xl border-2 border-green-500 bg-white dark:bg-zinc-900 p-4 shadow-lg shadow-green-500/10"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                >
                  <p className="text-zinc-800 dark:text-zinc-200">
                    {SAMPLE_DICTATION.enhanced}
                  </p>
                </motion.div>
                <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
                  Clean, professional text ready to use—no editing needed
                </p>
              </motion.div>
            )}

            {/* Initial state */}
            {currentStep === -1 && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full blur-xl opacity-30 animate-pulse" />
                      <Mic className="relative h-16 w-16 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Click play to see the transformation
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`
              inline-flex items-center gap-2 rounded-lg px-3 py-2.5
              text-sm font-medium transition-all border
              ${audioEnabled 
                ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300' 
                : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400'
              }
            `}
            title={audioEnabled ? 'Disable audio' : 'Enable audio'}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="h-4 w-4" />
                <span className="hidden sm:inline">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" />
                <span className="hidden sm:inline">Audio Off</span>
              </>
            )}
            {isSpeaking && (
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>
          
          <button
            onClick={handlePlay}
            disabled={isPlaying && currentStep < VOICE_PIPELINE_STEPS.length - 1}
            className={`
              inline-flex items-center gap-2 rounded-lg px-5 py-2.5
              text-sm font-semibold text-white shadow-md transition-all
              ${isPlaying && currentStep < VOICE_PIPELINE_STEPS.length - 1
                ? 'bg-zinc-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:scale-105'
              }
            `}
          >
            <Play className="h-4 w-4" />
            {currentStep === -1 ? 'Play Demo' : 'Replay'}
          </button>
          {currentStep > -1 && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


