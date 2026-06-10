'use client'

import { useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { ContextWindowViz, AgentLoopViz, OrchestratorViz } from './Diagrams'

// ────────────────────────────────────────────────────────────────────────
// "Try it right here" panels for the GHX glossary. These embed the REAL
// interactive demos that live elsewhere on the site (same repo, same
// domain) — the tokenizer explorer, the embeddings playground, the RAG
// pipeline walkthrough — lazy-loaded so the page stays fast and the
// heavyweight demos only download when someone opens the panel.
// ────────────────────────────────────────────────────────────────────────

const TokenExplorer = dynamic(
  () => import('../demos/tokenize/components').then((m) => m.TokenExplorer),
  { ssr: false, loading: () => <DemoLoading /> },
)
const EmbeddingsDemo = dynamic(() => import('../demos/embeddings/EmbeddingsDemoClient'), {
  ssr: false,
  loading: () => <DemoLoading />,
})
const RagDemo = dynamic(() => import('../demos/rag-visualized/RagDemoClient'), {
  ssr: false,
  loading: () => <DemoLoading />,
})

function DemoLoading() {
  return (
    <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.6 }}>
      loading the live demo…
    </div>
  )
}

function TryPanel({
  label,
  hint = 'tap to open',
  fullHref,
  fullLabel,
  defaultOpen = false,
  scroll = false,
  children,
}: {
  label: string
  hint?: string
  fullHref?: string
  fullLabel?: string
  defaultOpen?: boolean
  scroll?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="gg-try">
      <button type="button" className="gg-try-head" onClick={() => setOpen((o) => !o)}>
        <span className="dot" />
        {label}
        <span className="hint">{open ? 'close' : hint}</span>
      </button>
      {open && (
        <>
          <div className={`gg-try-body${scroll ? ' scroll' : ''}`}>{children}</div>
          {fullHref && (
            <div className="gg-try-foot">
              Cramped? <a href={fullHref}>{fullLabel ?? 'Open the full demo'} →</a>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function InlineDemo({ kind }: { kind: string }) {
  switch (kind) {
    case 'tokenizer':
      return (
        <TryPanel
          label="Try it — watch your own words get sliced"
          defaultOpen
          fullHref="/demos/tokenize"
          fullLabel="Open the full tokenization demo"
        >
          <TokenExplorer
            text="The quick brown fox jumped over the supply chain."
            showExample={true}
            tokenizationMethod="tiktoken"
          />
        </TryPanel>
      )
    case 'context-window':
      return <ContextWindowViz />
    case 'agent-loop':
      return <AgentLoopViz />
    case 'orchestrator':
      return <OrchestratorViz />
    case 'embeddings':
      return (
        <TryPanel
          label="Try it — turn sentences into meaning-numbers"
          fullHref="/demos/embeddings"
          fullLabel="Open the full embeddings demo"
          scroll
        >
          <EmbeddingsDemo />
        </TryPanel>
      )
    case 'rag':
      return (
        <TryPanel
          label="Step through it — a real RAG pipeline, stage by stage"
          fullHref="/demos/rag-visualized"
          fullLabel="Open the full RAG walkthrough"
          scroll
        >
          <RagDemo />
        </TryPanel>
      )
    default:
      return null
  }
}
