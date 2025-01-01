'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function NavigationEventsInner({ onRouteChange }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    onRouteChange()
  }, [pathname, searchParams, onRouteChange])

  return null
}

export function NavigationEvents(props) {
  return (
    <Suspense fallback={null}>
      <NavigationEventsInner {...props} />
    </Suspense>
  )
}