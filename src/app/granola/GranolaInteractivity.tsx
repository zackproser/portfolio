'use client'

import { useEffect, useRef, useState } from 'react'

// ────────────────────────────────────────────────────────────────────────
// Reading progress bar + jump-bar scroll-spy.
//
// Sits at the top of the page. The progress fill widens as the document
// scrolls. The jump-bar links underneath get an `.active` class as the
// user passes each section anchor.
//
// IDs the scroll-spy watches: see SECTIONS. Add new IDs here when new
// sections land in the page.
// ────────────────────────────────────────────────────────────────────────

const SECTIONS = [
  's01',
  's02',
  's03',
  's04',
  's05',
  's06',
  's07',
  's08',
  's09',
  's10',
  's11',
  's12',
  's13',
  's14',
  's15',
] as const

export function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
      if (fillRef.current) {
        fillRef.current.style.width = `${Math.max(0, Math.min(100, pct))}%`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="reading-progress">
      <div ref={fillRef} className="reading-progress-fill" />
    </div>
  )
}

export function JumpBarScrollSpy() {
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.g-jumpbar a[href^="#s"]'),
    )
    const onScroll = () => {
      const y = window.scrollY + 200
      let cur: string | null = null
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top + window.scrollY <= y) cur = id
      }
      for (const a of links) {
        a.classList.toggle('active', a.getAttribute('href') === `#${cur}`)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}

// ────────────────────────────────────────────────────────────────────────
// Time-saved interactive bar.
// Drag meetings/wk and avg-length to see the before/after split shift.
// ────────────────────────────────────────────────────────────────────────

export function TimeSavedBar() {
  const [meetings, setMeetings] = useState(12)
  const [duration, setDuration] = useState(35)

  const totalHrs = (meetings * duration) / 60
  const before = totalHrs * 1.0
  const after = Math.min(before, totalHrs * 0.4 + 1.5)
  const sum = before + after
  const beforePct = (before / sum) * 100
  const afterPct = (after / sum) * 100
  const saved = Math.max(0, before - after)

  return (
    <div className="g-bar">
      <div className="g-bar-head">
        <span>Estimated hours per week — before vs after</span>
        <span className="val">
          {saved.toFixed(1)} hrs saved · {meetings} meetings/wk
        </span>
      </div>
      <div className="g-bar-track">
        <div className="seg before" style={{ width: `${beforePct}%` }}>
          Before · {before.toFixed(1)}h
        </div>
        <div className="seg after" style={{ width: `${afterPct}%` }}>
          After · {after.toFixed(1)}h
        </div>
      </div>
      <div className="g-bar-legend">
        <span className="before">Writing-while-listening</span>
        <span className="after">Editing structured output</span>
      </div>
      <div className="g-bar-controls">
        <label>
          Meetings / week
          <input
            type="range"
            min={3}
            max={40}
            value={meetings}
            step={1}
            onChange={(e) => setMeetings(Number(e.target.value))}
          />
        </label>
        <label>
          Avg length
          <input
            type="range"
            min={15}
            max={90}
            value={duration}
            step={5}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}
