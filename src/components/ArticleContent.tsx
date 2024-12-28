'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Paywall from './Paywall'
import React from 'react'

interface ArticleContentProps {
  children: React.ReactNode
  isPaid?: boolean
  price?: number
  slug?: string
  title?: string
  previewLength?: number
  previewElements?: number // Number of elements to show in preview
}

export default function ArticleContent({ 
  children, 
  isPaid, 
  price, 
  slug, 
  title,
  previewLength = 150,
  previewElements = 3
}: ArticleContentProps) {
  console.log('ArticleContent props:', { 
    isPaid, 
    price, 
    slug, 
    title, 
    previewLength,
    previewElements
  })
  const { data: session } = useSession()
  const [hasPurchased, setHasPurchased] = useState(false)

  const checkPurchaseStatus = useCallback(async () => {
    try {
      console.log('Checking purchase status for:', { slug })
      const response = await fetch(`/api/check-purchase?slug=${slug}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Purchase status response:', data)
      
      setHasPurchased(data.purchased)
    } catch (error) {
      console.error('Error checking purchase status:', error)
      setHasPurchased(false)
    }
  }, [slug])

  useEffect(() => {
    console.log('Session state:', { session, isPaid, slug })
    if (session?.user?.email && isPaid) {
      checkPurchaseStatus()
    }
  }, [session, slug, isPaid, checkPurchaseStatus])

  if (!isPaid || hasPurchased) {
    return <>{children}</>
  }

  // Create preview content by taking the first few elements
  const preview = React.Children.toArray(children).slice(0, previewElements).map((child) => {
    if (React.isValidElement(child)) {
      // If it's a paragraph, we might want to truncate its text content
      if (child.type === 'p') {
        const text = React.Children.toArray(child.props.children)
          .map(c => (typeof c === 'string' ? c : ''))
          .join('')
        
        if (text.length > previewLength) {
          return React.cloneElement(child, {
            children: text.slice(0, previewLength) + '...'
          })
        }
      }
      return child
    }
    return child
  })

  return (
    <>
      <div className="article-preview">
        {preview}
      </div>
      <Paywall 
        price={price!} 
        slug={slug!}
        title={title!}
      />
    </>
  )
} 