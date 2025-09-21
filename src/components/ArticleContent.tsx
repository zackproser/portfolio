'use client'

import React from 'react'
import Paywall from './Paywall'
import NewsletterWrapper from './NewsletterWrapper'
import EmailSignupGate from './EmailSignupGate'
import { Content } from '@/types'

interface ArticleContentProps {
  children: React.ReactNode
  showFullContent: boolean
  previewLength?: number
  previewElements?: number
  paywallHeader?: string
  paywallBody?: string
  buttonText?: string
  content: Content
  requiresEmail?: boolean
  isSubscribed?: boolean
}

export default function ArticleContent({ 
  children,
  showFullContent,
  previewLength = 150,
  previewElements = 3,
  paywallHeader,
  paywallBody,
  buttonText,
  content,
  requiresEmail = false,
  isSubscribed = false
}: ArticleContentProps) {
  if (!content.slug) {
    console.warn('ArticleContent: content.slug is missing, rendering full content')
    return <>{children}</>
  }

  if (showFullContent || (requiresEmail && isSubscribed)) {
    return <>{children}</>
  }

  const preview = React.Children.toArray(children).slice(0, previewElements).map((child) => {
    if (React.isValidElement(child)) {
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
      {requiresEmail ? (
        <EmailSignupGate
          header={paywallHeader}
          body={paywallBody}
        />
      ) : (
        <Paywall
          content={content}
          paywallHeader={paywallHeader}
          paywallBody={paywallBody}
          buttonText={buttonText}
        />
      )}
    </>
  )
}
