'use client'
import ShareButton from './ShareButton'
import { track } from '@vercel/analytics'

export default function ShareButtonTracked(props) {
  return (
    <ShareButton
      {...props}
      onCopy={() => {
        track('share-guide', { location: 'top' })
      }}
    />
  )
} 