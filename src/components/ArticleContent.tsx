'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Paywall from './Paywall'
import React from 'react'
import { Article } from '@/lib/shared-types'

interface ArticleContentProps {
  children: React.ReactNode
  isPaid?: boolean
  price?: number
  slug?: string
  title?: string
  previewLength?: number
  previewElements?: number // Number of elements to show in preview
  metadata?: Article & { slug: string }
}

export default function ArticleContent({ 
  children, 
  isPaid, 
  price, 
  slug, 
  title,
  previewLength = 150,
  previewElements = 3,
  metadata
}: ArticleContentProps) {
  const { data: session } = useSession()
  const [hasPurchased, setHasPurchased] = useState(false)

  const checkPurchaseStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/check-purchase?slug=${slug}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setHasPurchased(data.purchased)
    } catch (error) {
      console.error('Error checking purchase status:', error)
      setHasPurchased(false)
    }
  }, [slug])

  useEffect(() => {
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
          return React.cloneElement(child as React.ReactElement<{ children: React.ReactNode }>, {
            children: text.slice(0, previewLength) + '...'
          })
        }
      }
      return child
    }
    return child
  })

  // Get preview text for description
  const previewText = React.Children.toArray(children)
    .find(child => React.isValidElement(child) && child.type === 'p')
  const previewDescription = React.isValidElement(previewText) && previewText.props?.children
    ? React.Children.toArray(previewText.props.children)
      .map(c => (typeof c === 'string' ? c : ''))
      .join('')
      .slice(0, 150) + '...'
    : ''

  // Construct article metadata if not provided
  const articleData: Article & { slug: string } = metadata || {
    slug: slug!,
    title: title!,
    type: 'blog',
    date: new Date().toISOString().split('T')[0],
    description: previewDescription,
    author: 'Zachary Proser', // Required by Article type
    image: undefined // Optional in Article type
  }

  return (
    <>
      <div className="article-preview">
        {preview}
      </div>
      <Paywall 
        price={price!} 
        slug={slug!}
        title={title!}
        article={articleData}
      />
    </>
  )
} 