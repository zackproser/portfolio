import React from 'react'

// Bidirectional citations for Blueprint Deep Dive posts.
//
// One source list, defined once per post, drives both the inline markers
// and the references appendix — so a citation number can never drift from
// its source and can never point at a paper the post doesn't list.
//
//   // top of page.mdx, after the component imports:
//   export const { Cite, References } = makeCitations([
//     { id: 'vaswani-2017', label: 'Vaswani et al., "Attention…", 2017', href: 'https://arxiv.org/abs/1706.03762' },
//     …
//   ])
//
//   // in the body, where the source informs the text:
//   …the scaled dot-product attention of the original transformer<Cite id="vaswani-2017" />.
//
//   // at the bottom, in place of <BpReferences>:
//   <References drawingCode="TDD-001" letter="A" />
//
// Each <Cite> renders a superscript [n] linking down to #ref-{id}; each
// reference links back up to #cite-{id} (the first inline use). Numbers
// come from the list order, so reordering sources renumbers everything
// automatically and nothing in the body needs editing.

export interface CiteItem {
  id: string // stable key, e.g. "vaswani-2017"
  label: string // "Vaswani et al., 'Attention Is All You Need', NeurIPS 2017"
  href: string
}

export function makeCitations(items: CiteItem[]) {
  // Fail loudly at module load on a duplicate id — an ambiguous key would
  // silently mis-number one of the two.
  const seen = new Set<string>()
  for (const it of items) {
    if (seen.has(it.id)) throw new Error(`makeCitations: duplicate citation id "${it.id}"`)
    seen.add(it.id)
  }
  const numberOf = new Map(items.map((it, i) => [it.id, i + 1]))

  /**
   * Inline citation marker. Stateless so it is safe to reuse across
   * requests (the returned object is a module-level singleton in Next).
   * Citing the same id twice emits the same `cite-{id}` anchor twice;
   * hash navigation resolves to the first, which is the intended target.
   */
  function Cite({ id }: { id: string }) {
    const n = numberOf.get(id)
    if (!n) throw new Error(`Cite: unknown citation id "${id}" — not in this post's source list`)
    return (
      <sup className="bp-cite" id={`cite-${id}`}>
        <a href={`#ref-${id}`} aria-label={`Jump to reference ${n}`}>
          [{n}]
        </a>
      </sup>
    )
  }

  /** References appendix with per-item anchors and back-to-text links. */
  function References({
    drawingCode,
    letter = 'A',
  }: {
    drawingCode: string
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
            <li key={ref.id} id={`ref-${ref.id}`}>
              <span className="bp-ref-num">[{String(i + 1).padStart(2, '0')}]</span>
              <a href={ref.href} target="_blank" rel="noreferrer">
                {ref.label}
              </a>
              <a className="bp-ref-back" href={`#cite-${ref.id}`} aria-label="Back to where this is cited in the text">
                ↩
              </a>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return { Cite, References }
}
