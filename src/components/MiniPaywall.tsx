'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'
import Image, { StaticImageData } from 'next/image'
import { Content } from '@/lib/shared-types'

interface MiniPaywallProps {
  price: number
  slug: string
  title: string
  type: Content['type']
  image?: StaticImageData | string
  imageAlt?: string
  miniTitle: string | null | undefined
  miniDescription: string | null | undefined
}

export default function MiniPaywall({ 
  price, 
  slug, 
  title,
  type,
  image,
  imageAlt = "Article preview image",
  miniTitle,
  miniDescription
}: MiniPaywallProps) {
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
      router.push(`/checkout?product=${slug}&type=${type}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to initiate checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-6 p-4 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-lg shadow-md border border-zinc-300 dark:border-zinc-700">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {image && (
            <div className="relative hidden sm:block">
              <Image
                src={image}
                alt={imageAlt}
                className="rounded-md shadow-sm"
                width={100}
                height={50}
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div className="flex-1">
            {(miniTitle || title) && (
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {miniTitle || title}
              </p>
            )}
            {miniDescription && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {miniDescription}
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handlePurchase}
          disabled={loading}
          className="shrink-0 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
        >
          {loading ? 'Processing...' : `Get full access ($${price})`}
        </Button>
      </div>
    </div>
  )
} 