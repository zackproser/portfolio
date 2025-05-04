'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/Button'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline' // Using Heroicons for feedback
import clsx from 'clsx'

export default function ShareButton({ buttonText = 'Share this guide', copiedText = 'Link Copied!', onCopy, ...props }) {
  const [isCopied, setIsCopied] = useState(false)
  const pathname = usePathname()
  const [fullUrl, setFullUrl] = useState('')

  // Ensure window object is available before constructing URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(window.location.origin + pathname)
    }
  }, [pathname])

  const copyToClipboard = async () => {
    if (!fullUrl) return // Don't copy if URL isn't ready

    try {
      await navigator.clipboard.writeText(fullUrl)
      setIsCopied(true)
      if (typeof onCopy === 'function') {
        onCopy()
      }
      setTimeout(() => {
        setIsCopied(false)
      }, 2000) // Reset icon/text after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Optionally show an error state
    }
  }

  return (
    <Button
      variant="solid" // Changed from outline
      color="green" // Added green color
      onClick={copyToClipboard}
      disabled={!fullUrl} 
      className={clsx(
        "inline-flex items-center gap-x-2",
        "px-6 py-3 font-bold text-base", // Added padding, bold font, and text size for chunkiness
        props.className // Allow passing additional classes
      )}
      {...props}
    >
      {isCopied ? (
        <>
          <CheckIcon className="h-5 w-5 text-green-500" />
          {copiedText}
        </>
      ) : (
        <>
          <ClipboardIcon className="h-5 w-5" />
          {buttonText}
        </>
      )}
    </Button>
  )
} 