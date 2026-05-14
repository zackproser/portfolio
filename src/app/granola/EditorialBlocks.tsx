import * as React from 'react'

// ────────────────────────────────────────────────────────────────────────
// Editorial scaffolding blocks for the Granola pillar.
//
// Non-interactive presentation components used to push the page past
// "good blog post" into "top-tier review site." Each block does one job
// well and uses the editorial design vocabulary (Crimson Pro headings,
// Inter sans body, JetBrains Mono kickers, burnt-orange #e67e22 accent).
//
//   <Byline />          — magazine-style byline strip with author, date,
//                         read time, framed by hairline rules
//   <VerdictCard />     — Wirecutter-style scorecard above the fold
//   <ComparisonTable /> — head-to-head grid: Granola vs Otter vs Zoom AI…
//   <ExampleOutput />   — mock Granola summary, styled like a terminal /
//                         export, used to make the product tangible
//   <PipelineDiagram /> — three-stage flow diagram (meeting → Granola →
//                         downstream surfaces) rendered in CSS for the
//                         input-layer section
//   <MathPanel />       — paired-stat call-out (what I pay / what I get
//                         back) for the cost-benefit section
//   <Ornament />        — small magazine-style divider, three dots
//
// ────────────────────────────────────────────────────────────────────────

// ---------- shared inline styles ---------------------------------------

const mono = "var(--font-mono, 'JetBrains Mono'), ui-monospace, monospace"
const serif = "var(--font-serif, 'Crimson Pro'), Georgia, serif"
const sans = "var(--font-sans, 'Inter'), system-ui, sans-serif"

// ────────────────────────────────────────────────────────────────────────
// <Byline /> — magazine-style author / date / read-time strip
// ────────────────────────────────────────────────────────────────────────

interface BylineProps {
  author?: string
  date?: string
  readTime?: string
}

export function Byline({
  author = 'Zachary Proser',
  date = 'May 2026',
  readTime = '~18 min read',
}: BylineProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        margin: '0 auto 56px',
        maxWidth: 560,
      }}
    >
      <span
        aria-hidden
        style={{
          flex: 1,
          height: 1,
          background: 'var(--rule)',
        }}
      />
      <span
        style={{
          fontFamily: mono,
          fontSize: 10.5,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: 'var(--ink-dim)',
          whiteSpace: 'nowrap',
          fontWeight: 500,
        }}
      >
        <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>{author}</strong>
        {' '}·{' '}{date}{' '}·{' '}{readTime}
      </span>
      <span
        aria-hidden
        style={{
          flex: 1,
          height: 1,
          background: 'var(--rule)',
        }}
      />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// <Ornament /> — section divider, three burnt-orange dots
// ────────────────────────────────────────────────────────────────────────

export function Ornament() {
  return (
    <div
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        margin: '64px auto',
        color: 'var(--accent)',
        opacity: 0.6,
      }}
    >
      <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
      <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
      <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// <PipelineDiagram /> — three-stage flow (meeting → Granola → downstream)
// ────────────────────────────────────────────────────────────────────────

export function PipelineDiagram() {
  const stage = (n: string, label: string, examples: string, highlight = false) => ({
    n,
    label,
    examples,
    highlight,
  })

  const stages = [
    stage('01', 'The conversation', 'exec sync · customer call · design review · 1:1'),
    stage('02', 'Granola', 'silent capture · structured summary · transcript', true),
    stage('03', 'Downstream', 'Slack thread · CRM row · ADR · blog-bot draft'),
  ]

  return (
    <figure
      className="granola-pipeline"
      style={{
        margin: '40px auto',
        maxWidth: 900,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto 1fr',
          alignItems: 'stretch',
          gap: 0,
        }}
      >
        {stages.map((s, idx) => (
          <React.Fragment key={s.n}>
            <div
              className={s.highlight ? 'pipeline-stage pipeline-stage-active' : 'pipeline-stage'}
              style={{
                padding: '22px 20px',
                border: s.highlight
                  ? '1.5px solid var(--accent)'
                  : '1px solid var(--rule)',
                borderRadius: 6,
                background: s.highlight ? 'rgba(230, 126, 34, 0.04)' : 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: s.highlight ? 'var(--accent)' : 'var(--ink-dim)',
                  fontWeight: 700,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  letterSpacing: '-.01em',
                  lineHeight: 1.2,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: 'var(--ink-dim)',
                }}
              >
                {s.examples}
              </div>
            </div>
            {idx < stages.length - 1 && (
              <div
                aria-hidden
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 8px',
                  color: 'var(--accent)',
                  fontFamily: mono,
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <figcaption
        style={{
          fontFamily: sans,
          fontSize: 13,
          lineHeight: 1.5,
          color: 'var(--ink-dim)',
          marginTop: 14,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        The meeting becomes the start of the pipeline, not the end of a session.
      </figcaption>

      <style>{`
        @media (max-width: 720px) {
          .granola-pipeline > div {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .granola-pipeline > div > div:nth-child(even) {
            transform: rotate(90deg);
            margin: 6px 0;
          }
        }
      `}</style>
    </figure>
  )
}

// ────────────────────────────────────────────────────────────────────────
// <MathPanel /> — paired stat call-out for the cost-benefit section
// ────────────────────────────────────────────────────────────────────────

export function MathPanel() {
  return (
    <aside
      className="granola-math"
      style={{
        margin: '40px auto',
        maxWidth: 760,
        border: '1px solid var(--rule)',
        borderRadius: 4,
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 22px',
          borderBottom: '1px solid var(--rule)',
          background: 'var(--bg)',
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          fontWeight: 700,
        }}
      >
        § The math, in two numbers
      </div>
      <div
        className="math-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ padding: '28px 26px', borderRight: '1px solid var(--rule)' }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-dim)',
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            What I pay
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 'clamp(34px, 4.5vw, 44px)',
              fontWeight: 500,
              letterSpacing: '-.02em',
              color: 'var(--ink)',
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            ~$14<span style={{ fontSize: '.55em', color: 'var(--ink-dim)' }}>/mo</span>
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--ink-dim)',
            }}
          >
            The cost of two coffees a week. I pay personally so I can use it in personal contexts without overlapping work data.
          </div>
        </div>
        <div style={{ padding: '28px 26px' }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-dim)',
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            What it gives back
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 'clamp(34px, 4.5vw, 44px)',
              fontWeight: 500,
              letterSpacing: '-.02em',
              color: 'var(--ink)',
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            ~2.5<span style={{ fontSize: '.55em', color: 'var(--ink-dim)' }}> hrs / wk</span>
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--ink-dim)',
            }}
          >
            Post-meeting cleanup that used to cost ten minutes per meeting now costs two, across ~20 captured meetings a week.
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .granola-math .math-grid {
            grid-template-columns: 1fr !important;
          }
          .granola-math .math-grid > div {
            border-right: 0 !important;
            border-bottom: 1px solid var(--rule);
          }
          .granola-math .math-grid > div:last-child {
            border-bottom: 0;
          }
        }
      `}</style>
    </aside>
  )
}

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
