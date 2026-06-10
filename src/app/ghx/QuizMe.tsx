'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { track } from '@vercel/analytics'

// ────────────────────────────────────────────────────────────────────────
// "Quiz me" — the finale's payoff. Five random terms, self-scored.
// Tables that finish a block early can run it together; nobody's answers
// are visible to anyone else.
// ────────────────────────────────────────────────────────────────────────

interface QuizTerm {
  term: string
  definition: string
}

function pickFive(all: QuizTerm[]): QuizTerm[] {
  const pool = [...all]
  const out: QuizTerm[] = []
  while (out.length < 5 && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  return out
}

export default function QuizMe({ terms }: { terms: QuizTerm[] }) {
  const [round, setRound] = useState<QuizTerm[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const start = () => {
    setRound(pickFive(terms))
    setIdx(0)
    setRevealed(false)
    setScore(0)
    track('ghx_quiz_start')
  }

  if (!round) {
    return (
      <button type="button" className="qz-start" onClick={start}>
        Quiz me — 5 random terms
      </button>
    )
  }

  if (idx >= round.length) {
    const verdict =
      score === 5
        ? 'Perfect. Go be insufferable about it.'
        : score >= 3
          ? 'Solid — the misses are one scroll away.'
          : 'Honest score. The page is right here; run it again.'
    return (
      <div className="qz-card">
        <p className="qz-term">{score}/5</p>
        <p className="qz-def">{verdict}</p>
        <div className="qz-actions">
          <button type="button" className="qz-btn on" onClick={start}>
            Again — fresh five
          </button>
        </div>
      </div>
    )
  }

  const t = round[idx]
  const grade = (knew: boolean) => {
    const final = score + (knew ? 1 : 0)
    if (knew) setScore((s) => s + 1)
    setRevealed(false)
    setIdx((i) => i + 1)
    if (idx + 1 >= round.length) track('ghx_quiz_complete', { score: final })
  }

  return (
    <div className="qz-card">
      <p className="qz-count">
        {idx + 1} of 5 · score {score}
      </p>
      <p className="qz-term">{t.term}</p>
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="qz-def">{t.definition}</p>
            <div className="qz-actions">
              <button type="button" className="qz-btn on" onClick={() => grade(true)}>
                I had it ✓
              </button>
              <button type="button" className="qz-btn" onClick={() => grade(false)}>
                Not yet
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="qz-def hint">Say it out loud — in your own words — then check.</p>
            <div className="qz-actions">
              <button type="button" className="qz-btn on" onClick={() => setRevealed(true)}>
                Show the answer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
