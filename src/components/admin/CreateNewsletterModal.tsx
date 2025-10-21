'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Mic, MicOff, Plus, Trash2, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreateNewsletterModalProps {
  onClose: () => void
  onCreated: () => void
}

export function CreateNewsletterModal({ onClose, onCreated }: CreateNewsletterModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [bulletPoints, setBulletPoints] = useState<string[]>(['', '', ''])
  const [isListening, setIsListening] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [recognition, setRecognition] = useState<any>(null)

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'en-US'

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        if (isListening !== null) {
          if (isListening === -1) {
            // Recording title
            setTitle(transcript)
          } else if (isListening === -2) {
            // Recording description
            setDescription(transcript)
          } else {
            // Recording bullet point
            const newPoints = [...bulletPoints]
            newPoints[isListening] = transcript
            setBulletPoints(newPoints)
          }
        }
        setIsListening(null)
      }

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(null)
      }

      rec.onend = () => {
        setIsListening(null)
      }

      recognitionRef.current = rec
      setRecognition(rec)
    }
  }, [isListening, bulletPoints])

  const startListening = (index: number) => {
    if (recognition) {
      setIsListening(index)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition && isListening !== null) {
      recognition.stop()
      setIsListening(null)
    }
  }

  const addBulletPoint = () => {
    setBulletPoints([...bulletPoints, ''])
  }

  const removeBulletPoint = (index: number) => {
    setBulletPoints(bulletPoints.filter((_, i) => i !== index))
  }

  const updateBulletPoint = (index: number, value: string) => {
    const newPoints = [...bulletPoints]
    newPoints[index] = value
    setBulletPoints(newPoints)
  }

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    const filledPoints = bulletPoints.filter(p => p.trim())
    if (filledPoints.length === 0) {
      alert('Please add at least one bullet point')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/newsletter/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          bulletPoints: filledPoints
        })
      })

      if (!response.ok) throw new Error('Failed to create newsletter')

      onCreated()
    } catch (error) {
      console.error('Error creating newsletter:', error)
      alert('Failed to create newsletter')
    } finally {
      setIsCreating(false)
    }
  }

  const hasWebSpeech = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[95vh] overflow-y-auto flex flex-col">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Create Newsletter
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              {hasWebSpeech && (
                <button
                  onClick={() => isListening === -1 ? stopListening() : startListening(-1)}
                  className={`p-2 rounded-full transition-colors ${
                    isListening === -1
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  aria-label="Voice input"
                >
                  {isListening === -1 ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The AI Coding Tools That Actually Matter in 2025"
              className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              autoFocus
            />
          </div>

          {/* Description (optional) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (optional)
              </label>
              {hasWebSpeech && (
                <button
                  onClick={() => isListening === -2 ? stopListening() : startListening(-2)}
                  className={`p-2 rounded-full transition-colors ${
                    isListening === -2
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  aria-label="Voice input"
                >
                  {isListening === -2 ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief overview of the latest developments..."
              rows={2}
              className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Bullet Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Key Points * {hasWebSpeech && <span className="text-xs text-gray-500">(tap mic to use voice)</span>}
            </label>
            <div className="space-y-3">
              {bulletPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={point}
                      onChange={(e) => updateBulletPoint(index, e.target.value)}
                      placeholder={`Point ${index + 1}: Cursor is now the default for most engineers...`}
                      rows={2}
                      className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white resize-none pr-12"
                    />
                    {hasWebSpeech && (
                      <button
                        onClick={() => isListening === index ? stopListening() : startListening(index)}
                        className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${
                          isListening === index
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                        aria-label="Voice input"
                      >
                        {isListening === index ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  {bulletPoints.length > 1 && (
                    <button
                      onClick={() => removeBulletPoint(index)}
                      className="p-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label="Remove point"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addBulletPoint}
              className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add another point
            </button>
          </div>

          {/* Info banner */}
          {!hasWebSpeech && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 Voice input not available in this browser. Use Chrome for voice dictation support.
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Claude will expand your bullet points into a full newsletter article (800-1500 words)
            </p>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <Button
            onClick={handleCreate}
            disabled={isCreating || !title.trim() || bulletPoints.filter(p => p.trim()).length === 0}
            className="w-full p-4 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400"
            size="lg"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Draft...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Create Draft
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
