import React from 'react'

// Static building blocks for Blueprint Deep Dive posts. These are
// server-renderable; all interactivity lives in the layout and demos.

interface BpSectionProps {
  id: string // anchor id, e.g. "s1"
  num: string // rail + kicker number, e.g. "01" or "A"
  label: string // short rail label, e.g. "Attention"
  sheet?: string // kicker suffix, e.g. "SHEET 1 OF 8"
  title: string
}

/**
 * Section header ("sheet"). The data attributes drive the INDEX OF
 * SHEETS rail and scroll-spy in BlueprintArticleLayout.
 */
export function BpSection({ id, num, label, sheet, title }: BpSectionProps) {
  return (
    <div id={id} data-sec={id} data-num={num} data-label={label} className="bp-section">
      <div className="bp-section-kicker">
        § {num}
        {sheet ? ` · ${sheet}` : ''}
      </div>
      <h2>{title}</h2>
    </div>
  )
}

/** Invisible anchor for the abstract/lede so the rail can target it. */
export function BpAnchor({ id, num, label }: { id: string; num: string; label: string }) {
  return <div id={id} data-sec={id} data-num={num} data-label={label} style={{ gridColumn: 1, marginBottom: 8 }} />
}

/** Margin note — renders in the right-hand 288px column (hidden ≤1080px). */
export function BpNote({ children }: { children: React.ReactNode }) {
  return <div className="bp-note">{children}</div>
}

/** Full-width schematic figure with a FIG. caption. */
export function BpFigure({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="bp-figure" style={{ marginLeft: 0, marginRight: 0 }}>
      {children}
      <figcaption className="bp-figcaption">{caption}</figcaption>
    </figure>
  )
}

/** Equation panel with an EQ. tag, main-column width. */
export function BpEquation({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="bp-equation">
      <div className="bp-equation-tag">{tag}</div>
      <div className="bp-equation-body">{children}</div>
    </div>
  )
}

/** Fraction helper for equation panels. */
export function BpFrac({ top, bottom }: { top: React.ReactNode; bottom: React.ReactNode }) {
  return (
    <span className="bp-frac">
      <span className="bp-frac-top">{top}</span>
      <span className="bp-frac-bottom">{bottom}</span>
    </span>
  )
}

/**
 * Conversational aside styled as an inline RFI: a plain-language
 * question a reader starting from zero would ask, answered in place.
 * Main-column width, dashed frame so it reads as an annotation rather
 * than a figure.
 */
export function BpQA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="bp-qa">
      <div className="bp-qa-q">Q — {q}</div>
      <div className="bp-qa-a">{children}</div>
    </div>
  )
}

export interface BpReference {
  label: string // "Vaswani et al., 'Attention Is All You Need', NeurIPS 2017"
  href: string
}

/**
 * References appendix. Give it drawingCode like "TDD-001" for the
 * corner tag. Defaults to APPENDIX A; pass `letter` when another
 * appendix (e.g. the RFP desk) precedes it in the drawing. The RFI
 * desk always takes the next letter after all MDX appendices.
 */
export function BpReferences({
  drawingCode,
  items,
  letter = 'A',
}: {
  drawingCode: string
  items: BpReference[]
  letter?: 'A' | 'B'
}) {
  return (
    <div id="refs" data-sec="refs" data-num={letter} data-label="References" className="bp-references">
      <div className="bp-references-strip">
        <span>APPENDIX {letter} — REFERENCES · SOURCES CITED</span>
        <span className="bp-num">
          {drawingCode}-{letter}
        </span>
      </div>
      <ol className="bp-references-list">
        {items.map((ref, i) => (
          <li key={ref.href}>
            <span className="bp-ref-num">[{String(i + 1).padStart(2, '0')}]</span>
            <a href={ref.href} target="_blank" rel="noreferrer">
              {ref.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * Full-width interactive panel shell: mono accent header line, optional
 * right-side controls, children, and a FIG.-style footer caption.
 */
export function BpInteractive({
  label,
  controls,
  footer,
  children,
}: {
  label: React.ReactNode
  controls?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bp-figure">
      <div className="bp-interactive-head">
        <div className="bp-interactive-label">{label}</div>
        {controls}
      </div>
      {children}
      {footer ? <div className="bp-figcaption">{footer}</div> : null}
    </div>
  )
}
