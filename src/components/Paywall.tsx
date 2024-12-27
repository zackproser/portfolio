'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'

interface PaywallProps {
  price: number
  slug: string
  title: string
}

export default function Paywall({ price, slug, title }: PaywallProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    if (!session) {
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    setLoading(true)
    try {
      // Add 'blog-' prefix to distinguish from course products
      router.push(`/checkout?product=blog-${slug}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to initiate checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Continue Reading</h3>
      <p className="mb-4">
        This article is available for ${(price / 100).toFixed(2)}. Purchase to read the full content.
      </p>
      <Button
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? 'Processing...' : `Purchase for $${(price / 100).toFixed(2)}`}
      </Button>
    </div>
  )
} 