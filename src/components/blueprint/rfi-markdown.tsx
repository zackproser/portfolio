import React from 'react'

// Tiny markdown renderer for RFI answers. Supports the subset the RFI
// system prompt asks the model to produce: **bold**, `code`, links,
// §N sheet chips (deep-link to #sN), -/numbered lists, fenced code,
// > quotes, --- rules, and #### mini-headers. Deliberately not a full
// markdown implementation — answers are short and the format is pinned
// by the server-side prompt.

const INLINE_RX = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:[^)\s]+\)|§\s?\d+|\*[^*\n]+\*)/

function renderInline(s: string, kb: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let rest = String(s)
  let k = 0
  while (rest.length) {
    const m = rest.match(INLINE_RX)
    if (!m || m.index == null) {
      out.push(rest)
      break
    }
    if (m.index > 0) out.push(rest.slice(0, m.index))
    const t = m[0]
    const key = `${kb}-${k++}`
    if (t.slice(0, 2) === '**') {
      out.push(<strong key={key}>{renderInline(t.slice(2, -2), key + 'i')}</strong>)
    } else if (t[0] === '`') {
      out.push(<code key={key}>{t.slice(1, -1)}</code>)
    } else if (t[0] === '[') {
      const mm = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (mm) {
        out.push(
          <a key={key} href={mm[2]} target="_blank" rel="noreferrer">
            {mm[1]}
          </a>,
        )
      } else {
        out.push(t)
      }
    } else if (t[0] === '§') {
      const n = parseInt(t.replace(/\D/g, ''), 10)
      out.push(
        <a key={key} className="bp-sec-chip" href={`#s${n}`}>
          § {String(n).padStart(2, '0')}
        </a>,
      )
    } else {
      out.push(<em key={key}>{t.slice(1, -1)}</em>)
    }
    rest = rest.slice(m.index + t.length)
  }
  return out
}

export function RfiMarkdown({ text, kb }: { text: string; kb: string }) {
  const els: React.ReactNode[] = []
  let k = 0
  let para: string[] = []
  const key = () => `${kb}-b${k++}`
  const flush = () => {
    if (para.length) {
      const kk = key()
      els.push(<p key={kk}>{renderInline(para.join(' '), kk)}</p>)
      para = []
    }
  }
  const lines = String(text).replace(/\r/g, '').split('\n')
  let i = 0
  while (i < lines.length) {
    const ln = lines[i]
    if (/^\s*```/.test(ln)) {
      flush()
      const buf: string[] = []
      i++
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      i++
      els.push(
        <pre key={key()}>
          <code>{buf.join('\n')}</code>
        </pre>,
      )
      continue
    }
    const li = ln.match(/^\s*([-*•]|\d+[.)])\s+(.*)$/)
    if (li) {
      flush()
      const items: string[] = []
      const num = /\d/.test(li[1][0])
      while (i < lines.length) {
        const m2 = lines[i].match(/^\s*([-*•]|\d+[.)])\s+(.*)$/)
        if (!m2) break
        items.push(m2[2])
        i++
      }
      const kk = key()
      els.push(
        <ul key={kk}>
          {items.map((it, ii) => (
            <li key={ii}>
              <span className="bp-md-bullet">{num ? String(ii + 1).padStart(2, '0') : '—'}</span>
              <span className="bp-md-li-body">{renderInline(it, `${kk}-${ii}`)}</span>
            </li>
          ))}
        </ul>,
      )
      continue
    }
    const h = ln.match(/^\s*(#{1,4})\s+(.*)$/)
    if (h) {
      flush()
      els.push(
        <div key={key()} className="bp-md-h">
          {h[2]}
        </div>,
      )
      i++
      continue
    }
    const q = ln.match(/^\s*>\s?(.*)$/)
    if (q) {
      flush()
      const buf = [q[1]]
      i++
      while (i < lines.length) {
        const m3 = lines[i].match(/^\s*>\s?(.*)$/)
        if (!m3) break
        buf.push(m3[1])
        i++
      }
      const kk = key()
      els.push(
        <div key={kk} className="bp-md-quote">
          {renderInline(buf.join(' '), kk)}
        </div>,
      )
      continue
    }
    if (/^\s*(---+|\*\*\*+)\s*$/.test(ln)) {
      flush()
      els.push(<div key={key()} className="bp-md-hr" />)
      i++
      continue
    }
    if (/^\s*$/.test(ln)) {
      flush()
      i++
      continue
    }
    para.push(ln.trim())
    i++
  }
  flush()
  return <div className="bp-md">{els}</div>
}
