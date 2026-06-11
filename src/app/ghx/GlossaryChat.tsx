'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import { track } from '@vercel/analytics'

// ────────────────────────────────────────────────────────────────────────
// "Ask the glossary" — a floating chat over the whole page. Answers come
// from /api/ghx-chat (the glossary is its entire context). The search
// empty-state can open it pre-seeded via a window CustomEvent('ghx-ask').
// Every question doubles as signal about what the room is struggling with.
// ────────────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Which Claude should I actually use?',
  'Is it safe to put our contracts into this?',
  'What should I try first on Monday?',
]

// Inline "ask me anything" bar — used at the top of the page and near the
// finale. Typing + Enter (or tapping) hands off to the floating chat via
// the same ghx-ask event the search empty-state uses.
export function AskInline({ placement }: { placement: string }) {
  const [q, setQ] = useState('')
  const go = () => {
    window.dispatchEvent(
      new CustomEvent('ghx-ask', { detail: { q: q.trim(), via: placement } }),
    )
    setQ('')
  }
  return (
    <div className="gg-ask">
      <span className="gg-ask-label">ask me anything</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && go()}
        placeholder="“which Claude do I use?” · “is our data safe?” · anything at all"
        aria-label="Ask the glossary anything"
        maxLength={500}
      />
      <button type="button" onClick={go} aria-label="Ask">
        →
      </button>
    </div>
  )
}

export default function GlossaryChat() {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const { messages, input, setInput, handleInputChange, isLoading, append, error } =
    useChat({ api: '/api/ghx-chat' })

  // search empty-state (or anything else) can open + seed the chat
  useEffect(() => {
    const onAsk = (e: Event) => {
      const { q, via } = (e as CustomEvent<{ q: string; via: string }>).detail
      setOpen(true)
      track('ghx_chat_question', { q: q ? q.slice(0, 100) : '(opened)', via })
      if (q) void append({ role: 'user', content: q }, { body: { via } })
    }
    window.addEventListener('ghx-ask', onAsk)
    return () => window.removeEventListener('ghx-ask', onAsk)
  }, [append])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, open])

  const ask = (q: string) => {
    track('ghx_chat_question', { q: q.slice(0, 100), via: 'chip' })
    void append({ role: 'user', content: q }, { body: { via: 'chip' } })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    track('ghx_chat_question', { q: input.slice(0, 100), via: 'typed' })
    void append({ role: 'user', content: input }, { body: { via: 'typed' } })
    setInput('')
  }

  return (
    <>
      <button
        type="button"
        className={`gg-chat-fab ${open ? 'hidden-fab' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Ask the glossary a question"
      >
        ✦ ask anything
      </button>

      {open && (
        <div className="gg-chat" role="dialog" aria-label="Ask the glossary">
          <div className="gg-chat-head">
            <span className="gg-chat-title">Ask the glossary</span>
            <span className="gg-chat-sub">no dumb questions — really</span>
            <button type="button" className="gg-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          <div className="gg-chat-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div className="gg-chat-empty">
                <p>
                  Anything on this page — or anything you&apos;ve been too polite to ask out
                  loud. Answers come from the glossary itself.
                </p>
                <div className="gg-chat-chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => ask(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`gg-chat-msg ${m.role}`}>
                {m.role === 'assistant' ? (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="gg-chat-msg assistant thinking">…</div>
            )}
            {error && (
              <div className="gg-chat-msg assistant error">
                That one didn&apos;t go through — give it a few seconds and try again. If it
                keeps happening, a facilitator is never far away.
              </div>
            )}
          </div>

          <form
            className="gg-chat-input"
            onSubmit={handleFormSubmit}
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a question…"
              aria-label="Your question"
              maxLength={500}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              →
            </button>
          </form>
        </div>
      )}
    </>
  )
}
