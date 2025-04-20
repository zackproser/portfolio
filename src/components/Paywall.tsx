'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { Content } from '@/types'
import { getContentCheckoutUrl } from '@/lib/checkoutUtils'

interface PaywallProps {
  content: Content
  paywallHeader?: string
  paywallBody?: string
  buttonText?: string
}

export default function Paywall({ 
  content,
  paywallHeader, 
  paywallBody,
  buttonText,
}: PaywallProps) {
  const { commerce, title, image } = content;
  const price = commerce?.price || 0;
  const imageAlt = "Article preview image";

  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    const checkoutUrl = getContentCheckoutUrl(content);

    if (!checkoutUrl) {
      console.error('Error: Could not generate checkout URL for content:', content);
      alert('Failed to initiate checkout. Please try again.');
      setLoading(false);
      return;
    }

    try {
      router.push(checkoutUrl);
    } catch (error) {
      console.error('Error navigating to checkout:', error)
      alert('Failed to initiate checkout navigation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const imageSrc = typeof image === 'object' && image !== null && 'src' in image ? image.src : image;

  return (
    <div className="my-8 p-8 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-xl border border-zinc-300 dark:border-zinc-700">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {paywallHeader || content.commerce?.paywallHeader || "Hands-on knowledge is valuable"}
        </h3>

        {imageSrc && (
          <div className="w-full relative">
            <Image
              src={imageSrc}
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
            {paywallBody || content.commerce?.paywallBody || "Purchase to read the full content and support its independent creator."}
          </p>
          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            {loading ? 'Processing...' : buttonText || content.commerce?.buttonText || `Purchase for $${(price / 100).toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  )
} 