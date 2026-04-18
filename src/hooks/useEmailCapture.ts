'use client'

import { useState } from 'react'

type EmailCaptureStatus = 'idle' | 'loading' | 'success'

export function useEmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<EmailCaptureStatus>('idle')

  const submitEmail = async (emailValue: string) => {
    if (!emailValue.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue,
          referrer: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      setStatus('success')
    } catch (err) {
      console.error('Email submission failed:', err)
      setStatus('idle')
    }
  }

  const resetForm = () => {
    setEmail('')
    setStatus('idle')
  }

  return {
    email,
    setEmail,
    status,
    submitEmail,
    resetForm,
  }
}
