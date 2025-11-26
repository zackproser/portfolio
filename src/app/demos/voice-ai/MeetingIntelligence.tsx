'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Users, 
  CheckCircle, 
  Clock,
  FileText,
  ListTodo,
  Lightbulb,
  MessageSquare,
  Mic,
  Brain
} from 'lucide-react'
import { MEETING_SAMPLE } from './data'

type ViewState = 'during' | 'after'

export default function MeetingIntelligence() {
  const [viewState, setViewState] = useState<ViewState>('during')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Meeting Intelligence
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Be fully present in conversations. Granola captures everything without an awkward bot 
          joining your calls—just comprehensive notes and action items after.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
          <button
            onClick={() => setViewState('during')}
            className={`
              flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all
              ${viewState === 'during'
                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }
            `}
          >
            <Video className="h-4 w-4" />
            During Meeting
          </button>
          <button
            onClick={() => setViewState('after')}
            className={`
              flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all
              ${viewState === 'after'
                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }
            `}
          >
            <FileText className="h-4 w-4" />
            After Meeting
          </button>
        </div>
      </div>

      {/* Main visualization */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewState === 'during' ? (
            <motion.div
              key="during"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6"
            >
              {/* Hero video - Granola in action */}
              <div className="mb-6 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-lg">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto block bg-zinc-900"
                  style={{ minHeight: '300px' }}
                >
                  <source src="https://zackproser.b-cdn.net/images/granola-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-center">
                  <p className="text-sm font-medium text-white">
                    Granola silently captures everything while you stay present
                  </p>
                </div>
              </div>

              {/* Meeting header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {MEETING_SAMPLE.during.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {MEETING_SAMPLE.during.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {MEETING_SAMPLE.during.participants.length} participants
                    </span>
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1.5"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                    {MEETING_SAMPLE.during.status}
                  </span>
                </motion.div>
              </div>

              {/* Split view: Engaged person vs Granola */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Person engaged in meeting */}
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">You</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Fully engaged</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <span>Making eye contact</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <span>Asking follow-up questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <span>Building relationships</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <span>Not frantically typing</span>
                    </div>
                  </div>
                </div>

                {/* Granola working silently */}
                <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Brain className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200">Granola</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">Working silently</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <Mic className="h-4 w-4" />
                      <span>Capturing audio locally</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <FileText className="h-4 w-4" />
                      <span>Building live transcript</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <ListTodo className="h-4 w-4" />
                      <span>Identifying action items</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <Lightbulb className="h-4 w-4" />
                      <span>Noting key decisions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key differentiator */}
              <div className="mt-6 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">No bot joining your call.</span>
                  {' '}Granola captures audio directly from your device—others never know it&apos;s running.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              {/* Summary */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  <FileText className="h-4 w-4" />
                  Meeting Summary
                </div>
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {MEETING_SAMPLE.after.summary}
                  </p>
                </div>
              </div>

              {/* Action items */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  <ListTodo className="h-4 w-4" />
                  Action Items
                </div>
                <div className="space-y-2">
                  {MEETING_SAMPLE.after.actionItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3"
                    >
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {item.task}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-blue-600 dark:text-blue-400">
                          <span>Owner: {item.owner}</span>
                          <span>•</span>
                          <span>Due: {item.due}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key decisions */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  <Lightbulb className="h-4 w-4" />
                  Key Decisions
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  {MEETING_SAMPLE.after.keyDecisions.map((decision, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800 dark:text-green-200">
                          {decision}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA hint */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 text-center">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-semibold">All of this generated automatically</span>
                  {' '}—no manual note-taking required. Just be present and let Granola handle the rest.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


