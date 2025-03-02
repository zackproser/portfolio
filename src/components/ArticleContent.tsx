'use client'

import React from 'react'
import Paywall from './Paywall'
import { StaticImageData } from 'next/image'

interface ArticleContentProps {
  children: React.ReactNode
  showFullContent: boolean
  price?: number
  slug: string
  title?: string
  previewLength?: number
  previewElements?: number
  paywallHeader?: string
  paywallBody?: string
  buttonText?: string
  paywallImage?: string | StaticImageData
  paywallImageAlt?: string
}

export default function ArticleContent({ 
  children, 
  showFullContent,
  price, 
  slug,
  title,
  previewLength = 150,
  previewElements = 3,
  paywallHeader,
  paywallBody,
  buttonText,
  paywallImage,
  paywallImageAlt
}: ArticleContentProps) {
  // If slug is missing, log a warning and show full content
  if (!slug) {
    console.warn('ArticleContent: slug is missing, rendering full content')
    return <>{children}</>
  }

  // Show full content if showFullContent is true
  if (showFullContent) {
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

  return (
    <>
      <div className="article-preview">
        {preview}
      </div>
      <Paywall 
        price={price!} 
        slug={slug!}
        title={title!}
        paywallHeader={paywallHeader}
        paywallBody={paywallBody}
        buttonText={buttonText}
        image={paywallImage}
        imageAlt={paywallImageAlt}
      />
    </>
  )
} 