'use client'
import ShareButton from './ShareButton'
import { track } from '@vercel/analytics'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function ShareButtonTracked({ location = 'top', ...props }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const url = typeof window !== 'undefined' ? window.location.origin + pathname : pathname;
  return (
    <ShareButton
      {...props}
      onCopy={() => {
        track('share-guide', {
          location,
          url,
          email: session?.user?.email || undefined,
          authenticated: !!session?.user,
        })
      }}
    />
  )
} 