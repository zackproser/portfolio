'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Content } from '@/types'
import { getContentCheckoutUrl } from '@/lib/checkoutUtils'

interface MiniPaywallProps {
  content: Content
}

export default function MiniPaywall({ 
  content
}: MiniPaywallProps) {
  const { 
    commerce,
    title,
    image,
  } = content;
  const miniPaywallTitle = commerce?.miniPaywallTitle;
  const miniPaywallDescription = commerce?.miniPaywallDescription;
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
      router.push(checkoutUrl as any);
    } catch (error) {
      console.error('Error navigating to checkout:', error)
      alert('Failed to initiate checkout navigation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const imageSrc = typeof image === 'object' && 'src' in image ? image.src : image;

  return (
    <div className="my-6 p-4 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-lg shadow-md border border-zinc-300 dark:border-zinc-700">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {imageSrc && (
            <div className="relative hidden sm:block">
              <Image
                src={imageSrc}
                alt={imageAlt}
                className="rounded-md shadow-sm"
                width={100}
                height={50}
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div className="flex-1">
            {(miniPaywallTitle || title) && (
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {miniPaywallTitle || title}
              </p>
            )}
            {miniPaywallDescription && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {miniPaywallDescription}
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