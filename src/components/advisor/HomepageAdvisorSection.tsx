'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { SectionHead } from '@/components/SectionHead'
import styles from './HomepageAdvisorSection.module.css'

function ChatPlaceholder() {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <div className={styles.placeholderHeader}>
        <span />
        <i />
      </div>
      <div className={styles.placeholderBody}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.placeholderComposer} />
    </div>
  )
}

const LazyAdvisorChat = dynamic(() => import('./AdvisorChat'), {
  ssr: false,
  loading: () => <ChatPlaceholder />,
})

export default function HomepageAdvisorSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldMount, setShouldMount] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || shouldMount) return

    if (!('IntersectionObserver' in window)) {
      setShouldMount(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldMount(true)
        observer.disconnect()
      },
      { rootMargin: '400px 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [shouldMount])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHead
          num="00"
          title="Ask the advisor — a question or two, then a straight answer."
        />

        <figure className={styles.plate}>
          <figcaption className={styles.caption}>
            <span>Fig. 01 · AI tool decision desk</span>
            <span>Interactive</span>
          </figcaption>
          <div className={styles.chatFrame} aria-busy={!shouldMount}>
            {shouldMount ? (
              <LazyAdvisorChat surface="home" autoFocus={false} />
            ) : (
              <ChatPlaceholder />
            )}
          </div>
        </figure>

        <Link
          href="/advisor"
          className={styles.fullLink}
          onClick={() => track('advisor_entry_click', { from: 'homepage-embed' })}
        >
          Open the full advisor →
        </Link>
      </div>
    </section>
  )
}
