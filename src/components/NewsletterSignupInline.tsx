'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'

interface NewsletterSignupInlineProps {
  variant?: 'light' | 'dark'
}

export function NewsletterSignupInline({ variant = 'light' }: NewsletterSignupInlineProps) {
  const [email, setEmail] = useState('')
  const [formSuccess, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const form = event.target as HTMLFormElement
      const data = {
        email: form.email.value,
        referrer: window.location.pathname,
      }

      await fetch('/api/form', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      setSuccess(true)
    } catch (error) {
      console.error('Newsletter signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (formSuccess) {
    return (
      <div className="flex items-center justify-center gap-3 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        <p className="text-green-800 dark:text-green-200 font-semibold">
          🤖 Neural Network Activated! Check your inbox for confirmation.
        </p>
      </div>
    )
  }

  const isDark = variant === 'dark'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className={`w-full pl-14 pr-6 py-5 rounded-xl text-xl transition-all ${
              isDark
                ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40'
                : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-5 rounded-xl font-bold text-xl transition-all ${
            isDark
              ? 'bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50'
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? 'Subscribing...' : 'Count me in'}
        </button>
      </div>
      <p className={`mt-4 text-sm text-center ${
        isDark ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'
      }`}>
        No spam. Unsubscribe anytime. Free forever.
      </p>
    </form>
  )
}
