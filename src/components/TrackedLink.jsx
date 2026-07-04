'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'

/**
 * Link that fires a Vercel Analytics event on click.
 * Internal hrefs use next/link; external hrefs open in a new tab.
 */
export function TrackedLink({ event, eventData, href, className, children, ...rest }) {
  const isExternal = href.startsWith('http')
  const handleClick = () => {
    if (event) track(event, eventData)
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
