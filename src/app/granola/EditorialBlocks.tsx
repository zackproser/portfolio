import React from 'react'

// ────────────────────────────────────────────────────────────────────────
// Editorial scaffolding blocks for the Granola pillar.
//
// Non-interactive presentation components used to push the page past
// "good blog post" into "top-tier review site." Each block does one job
// well and uses the editorial design vocabulary (Crimson Pro headings,
// Inter sans body, JetBrains Mono kickers, burnt-orange #e67e22 accent).
//
//   <VerdictCard />     — Wirecutter-style scorecard above the fold
//   <ComparisonTable /> — head-to-head grid: Granola vs Otter vs Zoom AI…
//   <ExampleOutput />   — mock Granola summary, styled like a terminal /
//                         export, used to make the product tangible
//   <WhoFor />          — compact "best for / skip if" call-out
//
// ────────────────────────────────────────────────────────────────────────

// ---------- shared inline styles ---------------------------------------

const mono = "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace"
const serif = "var(--font-serif, 'Crimson Pro'), Georgia, serif"
const sans = "var(--font-sans, 'Inter'), system-ui, sans-serif"

// ────────────────────────────────────────────────────────────────────────
// <VerdictCard /> — the scorecard
// ────────────────────────────────────────────────────────────────────────

export function VerdictCard() {
  return (
    <aside
      className="granola-verdict"
      style={{
        position: 'relative',
        margin: '0 auto',
        maxWidth: 900,
        border: '1px solid var(--rule)',
        borderRadius: 4,
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
      }}
    >
      {/* Header strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          padding: '14px 22px',
          borderBottom: '1px solid var(--rule)',
          background: 'var(--bg)',
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            fontWeight: 700,
          }}
        >
          § The verdict
        </span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 10,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-dim)',
          }}
        >
          12 months of daily use · Zachary Proser
        </span>
      </div>

      {/* The line — pull quote */}
      <div style={{ padding: '22px 26px 18px', borderBottom: '1px dashed var(--rule)' }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 10,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-dim)',
            marginBottom: 6,
          }}
        >
          The line
        </div>
        <blockquote
          style={{
            fontFamily: serif,
            fontSize: 'clamp(20px, 2.4vw, 24px)',
            fontWeight: 500,
            letterSpacing: '-.01em',
            lineHeight: 1.3,
            color: 'var(--ink)',
            margin: 0,
            fontStyle: 'italic',
          }}
        >
          &ldquo;The first AI tool whose absence would measurably raise my anxiety level.&rdquo;
        </blockquote>
      </div>

      {/* Rating + Standout / Weakest */}
      <div
        className="verdict-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <VerdictCell label="Overall" value="★ ★ ★ ★ ★" />
        <VerdictCell label="Category" value="AI meeting notes" right />
      </div>

      <div
        className="verdict-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <VerdictCell
          label="Best for"
          value="Knowledge workers in 4+ meetings/wk — engineers, PMs, founders, consultants"
        />
        <VerdictCell
          label="Skip if"
          value="Your work is mostly whiteboarding, screen-share-heavy reviews, or you need video clips of the call"
          right
        />
      </div>

      <div
        className="verdict-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <VerdictCell
          label="Standout"
          value="Local audio capture · no bot ever joins the meeting"
        />
        <VerdictCell
          label="Weakest at"
          value="Long technical whiteboarding · overlapping multi-speaker debates"
          right
        />
      </div>

      <div
        className="verdict-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <VerdictCell label="What I pay" value="~$14/mo · the cost of two coffees a week" />
        <VerdictCell
          label="What it saves"
          value="~2.5 hours/week of post-meeting cleanup · plus the harder-to-quantify cognitive load"
          right
        />
      </div>

      <style>{`
        @media (max-width: 720px) {
          .verdict-grid {
            grid-template-columns: 1fr !important;
          }
          .verdict-grid > div {
            border-right: 0 !important;
            border-bottom: 1px solid var(--rule) !important;
          }
          .verdict-grid:last-of-type > div:last-child {
            border-bottom: 0 !important;
          }
        }
      `}</style>
    </aside>
  )
}

function VerdictCell({
  label,
  value,
  right = false,
}: {
  label: string
  value: string
  right?: boolean
}) {
  return (
    <div
      style={{
        padding: '16px 22px',
        borderRight: right ? 'none' : '1px solid var(--rule)',
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 10,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: 'var(--ink-dim)',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: serif,
          fontSize: 'clamp(15px, 1.7vw, 17px)',
          fontWeight: 500,
          lineHeight: 1.4,
          color: 'var(--ink)',
        }}
      >
        {value}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// <ComparisonTable /> — head-to-head
// ────────────────────────────────────────────────────────────────────────

interface ComparisonRow {
  feature: string
  granola: 'yes' | 'no' | 'partial' | string
  otter: 'yes' | 'no' | 'partial' | string
  zoomai: 'yes' | 'no' | 'partial' | string
  fireflies: 'yes' | 'no' | 'partial' | string
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: 'No bot joins the call', granola: 'yes', otter: 'no', zoomai: 'no', fireflies: 'no' },
  { feature: 'Local audio capture', granola: 'yes', otter: 'no', zoomai: 'no', fireflies: 'no' },
  { feature: 'Live in-call query', granola: 'yes', otter: 'partial', zoomai: 'partial', fireflies: 'no' },
  { feature: 'Custom templates per meeting', granola: 'yes', otter: 'yes', zoomai: 'no', fireflies: 'partial' },
  { feature: 'Summary lands seconds after call', granola: 'yes', otter: 'partial', zoomai: 'partial', fireflies: 'no' },
  { feature: 'Native Mac / Windows / iOS', granola: 'yes', otter: 'partial', zoomai: 'partial', fireflies: 'no' },
  { feature: 'Works for non-Zoom calls', granola: 'yes', otter: 'partial', zoomai: 'no', fireflies: 'partial' },
]

function Cell({ value }: { value: ComparisonRow['granola'] }) {
  if (value === 'yes') {
    return (
      <span
        style={{
          color: 'var(--accent)',
          fontFamily: mono,
          fontSize: 18,
          fontWeight: 700,
        }}
        aria-label="yes"
      >
        ✓
      </span>
    )
  }
  if (value === 'no') {
    return (
      <span
        style={{
          color: '#a8a29e',
          fontFamily: mono,
          fontSize: 16,
        }}
        aria-label="no"
      >
        ─
      </span>
    )
  }
  if (value === 'partial') {
    return (
      <span
        style={{
          fontFamily: mono,
          fontSize: 10,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-dim)',
          fontWeight: 600,
        }}
      >
        partial
      </span>
    )
  }
  return (
    <span
      style={{
        fontFamily: serif,
        fontSize: 14,
        color: 'var(--ink-dim)',
      }}
    >
      {value}
    </span>
  )
}

export function ComparisonTable() {
  return (
    <aside
      className="granola-comparison"
      style={{
        margin: '0 auto',
        maxWidth: 900,
        border: '1px solid var(--rule)',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
      }}
    >
      {/* Header strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          padding: '14px 22px',
          borderBottom: '1px solid var(--rule)',
          background: 'var(--bg)',
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            fontWeight: 700,
          }}
        >
          § Head-to-head
        </span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 10,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-dim)',
          }}
        >
          As of 2026 · my testing
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: sans,
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: 'var(--bg)' }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: '12px 18px',
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-dim)',
                  fontWeight: 600,
                  borderBottom: '1px solid var(--rule)',
                }}
              >
                Feature
              </th>
              {(['Granola', 'Otter', 'Zoom AI', 'Fireflies'] as const).map((col, i) => (
                <th
                  key={col}
                  style={{
                    textAlign: 'center',
                    padding: '12px 14px',
                    fontFamily: mono,
                    fontSize: 10,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: i === 0 ? 'var(--accent)' : 'var(--ink-dim)',
                    fontWeight: 700,
                    borderBottom: '1px solid var(--rule)',
                    borderLeft: '1px solid var(--rule)',
                    minWidth: 80,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, idx) => (
              <tr
                key={row.feature}
                style={{
                  borderTop: idx === 0 ? 'none' : '1px solid var(--rule)',
                }}
              >
                <td
                  style={{
                    padding: '14px 18px',
                    fontFamily: serif,
                    fontSize: 15,
                    color: 'var(--ink)',
                    fontWeight: 500,
                  }}
                >
                  {row.feature}
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    padding: '14px 12px',
                    borderLeft: '1px solid var(--rule)',
                    background: 'rgba(230, 126, 34, 0.04)',
                  }}
                >
                  <Cell value={row.granola} />
                </td>
                <td style={{ textAlign: 'center', padding: '14px 12px', borderLeft: '1px solid var(--rule)' }}>
                  <Cell value={row.otter} />
                </td>
                <td style={{ textAlign: 'center', padding: '14px 12px', borderLeft: '1px solid var(--rule)' }}>
                  <Cell value={row.zoomai} />
                </td>
                <td style={{ textAlign: 'center', padding: '14px 12px', borderLeft: '1px solid var(--rule)' }}>
                  <Cell value={row.fireflies} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footnote */}
      <div
        style={{
          padding: '12px 22px',
          borderTop: '1px solid var(--rule)',
          background: 'var(--bg)',
          fontFamily: sans,
          fontSize: 12,
          lineHeight: 1.5,
          color: 'var(--ink-dim)',
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>How to read this.</strong> &ldquo;Partial&rdquo; means the feature exists but is meaningfully behind Granola&apos;s in either fidelity, speed, or workflow integration. Each row reflects my actual testing — I&apos;ve held a paid account on all four over the last twenty-four months.
      </div>
    </aside>
  )
}

// ────────────────────────────────────────────────────────────────────────
// <ExampleOutput /> — mock Granola summary in mono / terminal style
// ────────────────────────────────────────────────────────────────────────

interface ExampleOutputProps {
  caption: string
  meta: string
  blocks: { heading: string; lines: string[] }[]
}

export function ExampleOutput({ caption, meta, blocks }: ExampleOutputProps) {
  return (
    <figure
      style={{
        margin: '36px auto',
        maxWidth: 760,
        border: '1px solid var(--rule)',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
      }}
    >
      {/* Window-bar style header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px',
          background: 'var(--bg)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#d1c7b7', display: 'inline-block' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#d1c7b7', display: 'inline-block' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#e67e22', display: 'inline-block' }} />
        </div>
        <span
          style={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: 'var(--ink-dim)',
          }}
        >
          {meta}
        </span>
        <span style={{ width: 36 }} />
      </div>

      {/* Body */}
      <pre
        style={{
          margin: 0,
          padding: '20px 22px',
          fontFamily: mono,
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--ink)',
          background: 'transparent',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
{blocks.map((b, i) => (
  <React.Fragment key={i}>
    {i > 0 ? '\n\n' : ''}
    <span style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: '.08em' }}>{b.heading}</span>
    {'\n'}
    {b.lines.map((l, j) => `${j === 0 ? '' : '\n'}${l}`).join('')}
  </React.Fragment>
))}
      </pre>

      <figcaption
        style={{
          padding: '12px 22px',
          borderTop: '1px solid var(--rule)',
          background: 'var(--bg)',
          fontFamily: sans,
          fontSize: 12,
          lineHeight: 1.5,
          color: 'var(--ink-dim)',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        {caption}
      </figcaption>
    </figure>
  )
}
