'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'
import Image, { StaticImageData } from 'next/image'

interface PaywallProps {
  price: number
  slug: string
  title: string
  paywallHeader?: string
  paywallBody?: string
  buttonText?: string
  image?: StaticImageData | string
  imageAlt?: string
}

export default function Paywall({ 
  price, 
  slug, 
  title, 
  paywallHeader, 
  paywallBody,
  buttonText,
  image,
  imageAlt = "Article preview image"
}: PaywallProps) {
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
      router.push(`/checkout?product=blog-${slug}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to initiate checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-8 p-8 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-xl border border-zinc-300 dark:border-zinc-700">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {paywallHeader || "Hands-on knowledge is valuable"}
        </h3>

        {image && (
          <div className="w-full relative">
            <Image
              src={image}
              alt={imageAlt}
              className="rounded-lg shadow-md w-full"
              width={800}
              height={400}
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="text-center">
          <p className="mb-6 text-lg text-zinc-700 dark:text-zinc-300">
            {paywallBody || "Purchase to read the full content and support its independent creator."}
          </p>
          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            {loading ? 'Processing...' : buttonText || `Purchase for $${(price / 100).toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  )
} 