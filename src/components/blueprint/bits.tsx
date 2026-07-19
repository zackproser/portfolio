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
