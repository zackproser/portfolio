'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'
import Link from 'next/link'
import { EditorialNewsletter } from '@/components/EditorialNewsletter'
import corpus from '@/data/corpus.json'

/* ------------------------------------------------------------------
 * Mind on Fire hero — the logo alive over the essay corpus.
 *
 * Every star is a real post (from src/data/corpus.json, generated at
 * build time from src/content/blog). Hover previews, click reads.
 * Fire and "post embers" rise off the mark's crown; attract mode
 * surfaces essays on its own until the visitor takes over.
 *
 * The mark renders as sampled pixel particles on an always-dark sky.
 * Canvas is decorative: copy + newsletter capture are SSR'd DOM.
 * ------------------------------------------------------------------ */

type Post = { t: string; s: string; d: string; e: string; img: string; c: number }
type Star = {
  x: number; y: number; r: number; tint: number; phase: number
  delay: number; flare: number; post: number; c: number
}
type Hit =
  | { kind: 0; i: number; post: number }
  | { kind: 1; emberId: number; post: number }

const POSTS: Post[] = (corpus as { posts: Post[] }).posts
const POST_COUNT = (corpus as { count: number }).count

const CLUSTERS = [
  { label: 'RAG & RETRIEVAL', fx: 0.565, fy: 0.16, tint: 0 },
  { label: 'VOICE & TOOLS', fx: 0.9, fy: 0.12, tint: 2 },
  { label: 'AI-ASSISTED DEV', fx: 0.925, fy: 0.45, tint: 1 },
  { label: 'EVALS & FINE-TUNING', fx: 0.885, fy: 0.72, tint: 0 },
  { label: 'INFRASTRUCTURE', fx: 0.705, fy: 0.87, tint: 2 },
  { label: 'CAREER & ENABLEMENT', fx: 0.575, fy: 0.84, tint: 1 },
]
const QUERIES = [
  { q: 'ship a RAG pipeline to prod', c: 0 },
  { q: 'which AI coding tool is worth paying for', c: 2 },
  { q: 'fine-tune a model on my own data', c: 3 },
  { q: 'do my prompts actually work', c: 3 },
  { q: 'code by voice, faster than typing', c: 1 },
  { q: 'my team ignores the AI tools we bought', c: 5 },
]
/* cluster assignment happens at build time in generate-corpus.mjs —
   overrides + tag map + audited keyword rules — so every dot under a
   label genuinely belongs to that category */
function clusterOf(post: Post): number {
  return post.c >= 0 && post.c < CLUSTERS.length ? post.c : 5
}

/* fresh ink: posts from roughly the last 60 days glint brighter */
const FRESH_CUT = (() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() - 2, 1)
})()
const IS_FRESH = POSTS.map((p) => {
  const [y, m] = p.d.split('-').map(Number)
  return Boolean(y && m) && new Date(y, m - 1, 1) >= FRESH_CUT
})

const PP_GRADS = [
  'linear-gradient(160deg,#e67e22,#7c3a03)',
  'linear-gradient(160deg,#d35400,#431407)',
  'linear-gradient(160deg,#475569,#1a1a2e)',
  'linear-gradient(160deg,#b08968,#2c3e50)',
]

export function MindOnFireHero() {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLAnchorElement>(null)
  const router = useRouter()
  const onSuccessRef = useRef<(() => void) | null>(null)

  const handleNewsletterSuccess = () => {
    onSuccessRef.current?.()
  }

  useEffect(() => {
    const heroN = heroRef.current
    const canvasN = canvasRef.current
    const previewN = previewRef.current
    if (!heroN || !canvasN || !previewN) return
    const ctxN = canvasN.getContext('2d')
    if (!ctxN) return
    /* non-null aliases so narrowing survives into the nested engine fns */
    const hero: HTMLElement = heroN
    const canvas: HTMLCanvasElement = canvasN
    const preview: HTMLAnchorElement = previewN
    const ctx: CanvasRenderingContext2D = ctxN

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const COARSE = window.matchMedia('(pointer: coarse)').matches
    let disposed = false
    const SNAP = typeof location !== 'undefined' && location.search.includes('snap')

    /* ?snap: a settled, chrome-free render for the OG screenshot pipeline */
    if (SNAP) hero.classList.add('mof-snap')

    /* entrance plays once per session */
    let seen = false
    try {
      seen = sessionStorage.getItem('mofHeroSeen') === '1'
      sessionStorage.setItem('mofHeroSeen', '1')
    } catch { /* private mode */ }
    if (!reduced && !seen) hero.classList.add('mof-play')

    const ppEl = (sel: string) => preview.querySelector(sel) as HTMLElement

    /* essays you've read — your trail through the corpus */
    let readSet: Set<string>
    try {
      readSet = new Set(JSON.parse(localStorage.getItem('mofRead') || '[]') as string[])
    } catch {
      readSet = new Set()
    }
    const markRead = (slug: string) => {
      readSet.add(slug)
      try {
        localStorage.setItem('mofRead', JSON.stringify([...readSet].slice(-500)))
      } catch { /* private mode */ }
    }

    const capture = hero.querySelector<HTMLElement>('.mof-capture')
    let inboxTarget: { x: number; y: number } | null = null

    /* ---------- night-sky palette ---------- */
    type Palette = {
      tints: string[]; nebula: string; label: string
      edge: string; queryRing: string; halo: string
    }
    const P: Palette = {
      tints: ['243,156,18', '230,126,34', '148,163,184', '251,247,240'],
      nebula: 'rgba(243,156,18,0.05)',
      label: 'rgba(148,163,184,',
      edge: '243,156,18',
      queryRing: '251,247,240',
      halo: 'rgba(15,15,31,',
    }

    /* Soft, reusable light sprites avoid the hard rims and banding produced
       by large low-alpha disks. They are baked once and only scaled at draw. */
    function makeGlowSprite(core: string, middle: string) {
      const sprite = document.createElement('canvas')
      sprite.width = 96
      sprite.height = 96
      const spriteCtx = sprite.getContext('2d')
      if (!spriteCtx) return sprite
      const glow = spriteCtx.createRadialGradient(48, 48, 0, 48, 48, 48)
      glow.addColorStop(0, core)
      glow.addColorStop(0.12, middle)
      glow.addColorStop(0.42, 'rgba(230,126,34,0.13)')
      glow.addColorStop(0.72, 'rgba(211,84,0,0.035)')
      glow.addColorStop(1, 'rgba(211,84,0,0)')
      spriteCtx.fillStyle = glow
      spriteCtx.fillRect(0, 0, 96, 96)
      return sprite
    }
    const warmGlow = makeGlowSprite('rgba(255,250,240,0.96)', 'rgba(243,156,18,0.58)')
    const emberGlow = makeGlowSprite('rgba(255,244,214,0.9)', 'rgba(230,126,34,0.48)')
    const drawGlow = (sprite: HTMLCanvasElement, x: number, y: number, radius: number, alpha: number) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
      ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2)
    }

    /* ---------- canvas / layout ---------- */
    let W = 0
    let H = 0
    let logoCX = 0
    let logoCY = 0
    let born = 0
    let lastT = 0
    let running = false
    let rafId = 0
    let framePending = false
    let resizeRafId = 0

    const stars: Star[] = []
    const links: Array<[number, number]> = []
    const clusterGeo: Array<{ cx: number; cy: number; R: number }> = []
    let chronoOrder: number[] = [] /* star indices, oldest essay first */
    let chronoDistances: number[] = []
    let chronoLength = 0
    let youStar: { fx: number; fy: number; since?: string } | null = null
    try {
      const savedYou = JSON.parse(localStorage.getItem('mofYou') || 'null') as
        | { fx: number; fy: number; since?: string }
        | null
      if (savedYou && typeof savedYou.fx === 'number' && typeof savedYou.fy === 'number') {
        youStar = savedYou
      }
    } catch { /* ignore */ }

    /* One scheduler serves both the continuous loop and reduced-motion
       invalidations, so one-shot redraws cannot stack. */
    let frame: (ms: number) => void
    const requestFrame = () => {
      if (disposed || framePending) return
      framePending = true
      rafId = requestAnimationFrame((ms) => {
        framePending = false
        frame(ms)
      })
    }

    const rnd = (i: number, salt: number) => {
      const x = Math.sin((i + 1) * 127.1 + salt * 311.7) * 43758.5453
      return x - Math.floor(x)
    }

    function layout() {
      layoutGen++
      query = null
      autoHit = null
      tapHit = null
      kbCursor = -1 /* keyboard selection can't survive a reshuffled sky */
      comet = null
      lastFocus = null
      stars.length = 0
      links.length = 0
      clusterGeo.length = 0
      chronoDistances = []
      chronoLength = 0
      /* narrow screens: the mark burns in a band above the copy — no
         constellation overlay (the corpus lives in the rails below) */
      if (W < 1024) {
        logoCX = W * 0.5
        logoCY = 215
        if (youStar) {
          stars.push({
            x: youStar.fx * W, y: youStar.fy * H, r: 5.5, tint: 3,
            phase: 1.7, delay: 0, flare: 0.5, post: -1, c: 5,
          })
        }
        chronoOrder = []
        return
      }
      logoCX = W * 0.735
      logoCY = H * 0.46
      const members: number[][] = CLUSTERS.map(() => [])
      POSTS.forEach((p, i) => members[clusterOf(p)].push(i))

      let spacing = Math.max(19, Math.min(27, W / 62))
      if (W < 1000) spacing = Math.max(10, spacing * 0.55)
      let worst = 0
      members.forEach((m) => { if (m.length > worst) worst = m.length })
      const maxR = Math.min(W, H) * 0.21
      if (spacing * Math.sqrt(worst) * 1.02 > maxR) {
        spacing = Math.max(11, maxR / (Math.sqrt(worst) * 1.02))
      }
      const sizeK = Math.max(0.62, Math.min(1, spacing / 26))
      const GA = 2.399963229728653

      CLUSTERS.forEach((c, ci) => {
        const ids = members[ci]
        const n = Math.max(ids.length, 1)
        const R = spacing * Math.sqrt(n) * 1.02
        const cx = Math.min(Math.max(c.fx * W, R + 14), W - R - 14)
        const cy = Math.min(Math.max(c.fy * H, R + 56), H - R - 16)
        clusterGeo[ci] = { cx, cy, R }
        const rot = ci * 1.7
        for (let k = 0; k < ids.length; k++) {
          const rr = spacing * Math.sqrt(k + 0.4)
          const th = k * GA + rot
          stars.push({
            x: cx + rr * Math.cos(th) + (rnd(ids[k], 1) * 6 - 3),
            y: cy + rr * Math.sin(th) * 0.92 + (rnd(ids[k], 2) * 6 - 3),
            r: (4.4 + rnd(ids[k], 3) * rnd(ids[k], 4) * 3.2) * sizeK,
            tint: rnd(ids[k], 5) < 0.72 ? c.tint : 3,
            phase: rnd(ids[k], 6) * 6.2832,
            delay: rnd(ids[k], 7) * 1.6,
            flare: 0,
            post: ids[k],
            c: ci,
          })
        }
      })

      /* keep the mark's silhouette clear */
      const LH2 = Math.min(H * 0.56, W * 0.31)
      const ex = LH2 * 0.48
      const ey = LH2 * 0.62
      for (const st of stars) {
        const ddx = (st.x - logoCX) / ex
        const ddy = (st.y - logoCY) / ey
        const dd = Math.sqrt(ddx * ddx + ddy * ddy)
        if (dd < 1.12 && dd > 0.0001) {
          const push = 1.16 / dd
          st.x = Math.min(Math.max(logoCX + (st.x - logoCX) * push, 14), W - 14)
          st.y = Math.min(Math.max(logoCY + (st.y - logoCY) * push, 60), H - 14)
        }
      }

      if (youStar) {
        stars.push({
          x: youStar.fx * W, y: youStar.fy * H, r: 5.5, tint: 3,
          phase: 1.7, delay: 0, flare: 0.5, post: -1, c: 5,
        })
      }

      chronoOrder = stars
        .map((sst, i) => ({ i, post: sst.post }))
        .filter((x) => x.post >= 0)
        .sort((a, b) => b.post - a.post)
        .map((x) => x.i)
      chronoDistances = [0]
      chronoLength = 0
      for (let i = 1; i < chronoOrder.length; i++) {
        const a = stars[chronoOrder[i - 1]]
        const b = stars[chronoOrder[i]]
        chronoLength += Math.hypot(b.x - a.x, b.y - a.y)
        chronoDistances.push(chronoLength)
      }

      /* one faint line per star to its nearest in-cluster neighbor */
      const seenL: Record<string, 1> = {}
      for (let i = 0; i < stars.length; i++) {
        let bj = -1
        let bd = 1e9
        for (let j = 0; j < stars.length; j++) {
          if (i === j || stars[j].c !== stars[i].c) continue
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < bd) { bd = d2; bj = j }
        }
        if (bj < 0) continue
        const key = Math.min(i, bj) + '_' + Math.max(i, bj)
        if (!seenL[key]) { seenL[key] = 1; links.push([Math.min(i, bj), Math.max(i, bj)]) }
      }
    }

    function measureInboxTarget(heroRect?: DOMRect) {
      if (!capture) { inboxTarget = null; return }
      const hr = heroRect ?? hero.getBoundingClientRect()
      const cr = capture.getBoundingClientRect()
      inboxTarget = { x: cr.right - hr.left - 24, y: cr.top - hr.top + 8 }
    }

    function resize() {
      const rect = hero.getBoundingClientRect()
      const nextW = rect.width
      const nextH = rect.height
      if (nextW <= 0 || nextH <= 0) return
      const requestedDpr = window.devicePixelRatio || 1
      const backingW = Math.max(1, Math.round(nextW * requestedDpr))
      const backingH = Math.max(1, Math.round(nextH * requestedDpr))
      const cssChanged = nextW !== W || nextH !== H
      const backingChanged = canvas.width !== backingW || canvas.height !== backingH

      measureInboxTarget(rect)
      if (!cssChanged && !backingChanged) return

      W = nextW
      H = nextH
      if (backingChanged) {
        canvas.width = backingW
        canvas.height = backingH
      }
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(backingW / W, 0, 0, backingH / H, 0, 0)
      layout()
      preview.classList.remove('mof-show')
      lastKey = null
      if (reduced) {
        let pick: Star | undefined
        for (const si of chronoOrder) {
          if (!readSet.has(POSTS[stars[si].post].s)) {
            pick = stars[si]
            break
          }
        }
        if (!pick && chronoOrder.length) pick = stars[chronoOrder[0]]
        if (pick) {
          const pi = stars.indexOf(pick)
          stars[pi].flare = 0.7
          autoHit = { kind: 0, i: pi, post: stars[pi].post, until: Number.MAX_SAFE_INTEGER }
        }
        if (!running) requestFrame()
      }
    }

    /* ---------- the mark ---------- */
    type LogoP = {
      bx: number; by: number; colD: string; flame: boolean; animated: boolean
      ghost: boolean; ph: number; sx: number; sy: number; colorGroup: number
    }
    const logoP: LogoP[] = []
    const animatedLogoP: LogoP[] = []
    const crownSrc: LogoP[] = []
    let logoReady = false
    let staticLogoBake: HTMLCanvasElement | null = null
    const animatedColors: string[] = []
    let logoMap = { cx2: 0, cy2: 0, hh: 1 }
    let LOGO_H = 0

    function initLogo() {
      const im = new Image()
      im.onload = () => {
        if (disposed) return
        const LW = 560
        const LH = Math.round(im.height * (LW / im.width))
        const oc = document.createElement('canvas')
        oc.width = LW
        oc.height = LH
        const o = oc.getContext('2d')
        if (!o) return
        o.drawImage(im, 0, 0, LW, LH)
        const cropH = Math.round(LH * 0.82) /* drop the wordmark row */
        const d = o.getImageData(0, 0, LW, cropH).data

        /* colored mask + dilation to seal the rim */
        const cm = new Uint8Array(LW * cropH)
        for (let i = 0; i < LW * cropH; i++) {
          cm[i] = Math.max(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]) > 64 ? 1 : 0
        }
        const dilate = (src: Uint8Array) => {
          const out = new Uint8Array(src.length)
          for (let yy = 0; yy < cropH; yy++) {
            for (let xx = 0; xx < LW; xx++) {
              const ii = yy * LW + xx
              out[ii] =
                src[ii] ||
                (xx > 0 && src[ii - 1]) || (xx < LW - 1 && src[ii + 1]) ||
                (yy > 0 && src[ii - LW]) || (yy < cropH - 1 && src[ii + LW])
                  ? 1 : 0
            }
          }
          return out
        }
        let dm = cm
        for (let di = 0; di < 5; di++) dm = dilate(dm)
        /* sky floods from top + sides only (the crop severs the neck) */
        const sky = new Uint8Array(LW * cropH)
        const st2: number[] = []
        for (let x = 0; x < LW; x++) st2.push(x)
        for (let y = 0; y < cropH; y++) st2.push(y * LW, y * LW + LW - 1)
        while (st2.length) {
          const i = st2.pop() as number
          if (i < 0 || i >= LW * cropH || sky[i] || dm[i]) continue
          sky[i] = 1
          const ix = i % LW
          if (ix > 0) st2.push(i - 1)
          if (ix < LW - 1) st2.push(i + 1)
          st2.push(i - LW, i + LW)
        }
        /* grow sky back to the true color edge so the ground carries no
           outline ring from the dilation */
        let skyD = sky
        for (let di = 0; di < 5; di++) skyD = dilate(skyD)

        let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9
        const raw: Array<{ x: number; y: number; r: number; g: number; b: number; c: number }> = []
        for (let y = 0; y < cropH; y++) {
          for (let x = 0; x < LW; x++) {
            const i = y * LW + x
            const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2]
            const colored = cm[i] === 1
            if (!colored && skyD[i]) continue
            if (colored) { if (x % 2 !== 0 || y % 2 !== 0) continue }
            else if (x % 3 !== 0 || y % 3 !== 0) continue
            raw.push({ x, y, r, g, b, c: colored ? 1 : 0 })
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
          }
        }
        const cx2 = (minX + maxX) / 2
        const cy2 = (minY + maxY) / 2
        const hh = Math.max(1, maxY - minY)
        logoMap = { cx2, cy2, hh }
        raw.forEach((q) => {
          const by = (q.y - cy2) / hh
          const bx = (q.x - cx2) / hh
          const warm = q.c === 1 && q.r > 130 && q.r > q.b
          const flame = warm && (by < -0.12 || (bx < -0.08 && by < 0.2))
          const animated = q.c === 1 && (flame || bx > 0.02)
          const luminance = (q.r * 0.299 + q.g * 0.587 + q.b * 0.114) | 0
          const p: LogoP = {
            bx,
            by,
            colD: q.r + ',' + q.g + ',' + q.b,
            /* crown fire, plus the tongues running down the front forehead */
            flame,
            animated,
            ghost: q.c === 0,
            ph: Math.random() * 6.2832,
            sx: 0,
            sy: 0,
            /* Eight warm brightness groups plus four cool groups preserve
               the source palette while bounding per-frame state changes. */
            colorGroup: warm
              ? Math.max(0, Math.min(7, Math.floor(luminance / 32)))
              : 8 + Math.max(0, Math.min(3, Math.floor(luminance / 64))),
          }
          logoP.push(p)
          if (p.animated) animatedLogoP.push(p)
          if (p.flame && q.y - minY < hh * 0.22) crownSrc.push(p)
        })

        /* Bake the silhouette and every non-animated colored pixel once.
           Per-frame work is reserved for the flame/circuit subset. */
        const gb = document.createElement('canvas')
        gb.width = LW
        gb.height = cropH
        const gctx = gb.getContext('2d')
        if (gctx) {
          for (const gp of logoP) {
            if (gp.ghost) {
              const grain = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(gp.ph * 37.7))
              gctx.fillStyle = 'rgba(34,38,64,' + (0.36 * grain).toFixed(3) + ')'
              gctx.fillRect(gp.bx * hh + cx2 - 1.1, gp.by * hh + cy2 - 1.1, 2.2, 2.2)
            } else if (!gp.animated) {
              const sourcePx = Math.max(1.05, 330 / 330) * (hh / 330)
              gctx.fillStyle = 'rgba(' + gp.colD + ',0.94)'
              gctx.fillRect(
                gp.bx * hh + cx2 - sourcePx * 0.62,
                gp.by * hh + cy2 - sourcePx * 0.62,
                sourcePx * 1.24,
                sourcePx * 1.24,
              )
            }
          }
          staticLogoBake = gb
        }

        const sums = Array.from({ length: 12 }, () => ({ r: 0, g: 0, b: 0, n: 0 }))
        for (const p of animatedLogoP) {
          const [r, g, b] = p.colD.split(',').map(Number)
          const sum = sums[p.colorGroup]
          sum.r += r; sum.g += g; sum.b += b; sum.n++
        }
        for (let i = 0; i < sums.length; i++) {
          const s = sums[i]
          animatedColors[i] = s.n
            ? `${Math.round(s.r / s.n)},${Math.round(s.g / s.n)},${Math.round(s.b / s.n)}`
            : '243,156,18'
        }
        logoReady = true
        if (reduced) requestFrame()
      }
      im.onerror = () => { logoReady = false }
      im.src = '/images/mind-on-fire.png'
    }

    function drawLogo(t: number, headA: number) {
      if (!ctx || !logoReady || headA <= 0) return
      LOGO_H = W < 1024 ? Math.min(W * 0.72, 330) : Math.min(H * 0.56, W * 0.31)
      const SC = LOGO_H
      const px = Math.max(1.05, SC / 330)
      const sway = 0.05 * Math.sin(t * 0.3)
      const cs = Math.cos(sway)

      ctx.globalCompositeOperation = 'lighter'
      if (staticLogoBake) {
        ctx.save()
        ctx.globalAlpha = headA
        ctx.translate(logoCX, logoCY)
        ctx.scale((SC / logoMap.hh) * cs, SC / logoMap.hh)
        ctx.drawImage(staticLogoBake, -logoMap.cx2, -logoMap.cy2)
        ctx.restore()
      }

      const paths = Array.from({ length: 12 }, () =>
        Array.from({ length: 8 }, () => new Path2D()),
      )
      const normalizedPx = px / SC
      for (const p of animatedLogoP) {
        p.sx = logoCX + p.bx * cs * SC
        p.sy = logoCY + p.by * SC
        const pulse = p.flame
          ? 0.74 + 0.26 * Math.sin(t * (6 + surge * 5) + p.ph)
          : 0.7 + 0.3 * Math.sin(t * (2.2 + surge * 1.5) + (p.bx + p.by) * 9)
        const alphaBin = Math.max(0, Math.min(7, Math.round(pulse * 7)))
        paths[p.colorGroup][alphaBin].rect(
          p.bx - normalizedPx * 0.62,
          p.by - normalizedPx * 0.62,
          normalizedPx * 1.24,
          normalizedPx * 1.24,
        )
      }
      ctx.save()
      ctx.translate(logoCX, logoCY)
      ctx.scale(SC * cs, SC)
      for (let color = 0; color < paths.length; color++) {
        for (let alpha = 0; alpha < paths[color].length; alpha++) {
          ctx.fillStyle = `rgba(${animatedColors[color]},${0.94 * headA * (alpha / 7)})`
          ctx.fill(paths[color][alpha])
        }
      }
      ctx.restore()
    }

    /* ---------- fire + post embers ---------- */
    type Flame = { x: number; y: number; vx: number; vy: number; wob: number; life: number; age: number; r: number }
    const flames: Flame[] = []
    let flameSpawnBudget = 0
    /* radial spark pop, reusing the flame renderer */
    function sparkBurst(x: number, y: number, n: number, life: number) {
      for (let b = 0; b < n; b++) {
        const ang = (b / n) * 6.2832 + Math.random() * 0.6
        const sp = 40 + Math.random() * 80
        flames.push({
          x, y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 24,
          wob: Math.random() * 6.2832,
          life: life + Math.random() * 0.25,
          age: 0,
          r: 1.5 + Math.random() * 1.5,
        })
      }
    }
    function stepFlames(dt: number, headA: number) {
      if (!ctx) return
      if (headA > 0.3 && logoReady && crownSrc.length) {
        flameSpawnBudget += dt * (180 + surge * 180)
        const available = Math.max(0, 150 + Math.round(surge * 40) - flames.length)
        const want = Math.min(
          Math.floor(flameSpawnBudget),
          available,
        )
        flameSpawnBudget -= want
        for (let s = 0; s < want; s++) {
          const src = crownSrc[(Math.random() * crownSrc.length) | 0]
          const spark = Math.random() < 0.12 + surge * 0.1
          flames.push({
            x: src.sx + (Math.random() * 14 - 7),
            y: src.sy + 2,
            vy: -(40 + Math.random() * 60) * (spark ? 1.6 : 1) * (1 + surge * 0.45),
            vx: Math.random() * 10 - 5,
            wob: Math.random() * 6.2832,
            life: spark ? 1.6 : 0.85 + Math.random() * 0.7,
            age: 0,
            r: spark ? 1.3 : 2.6 + Math.random() * 3,
          })
        }
      }
      ctx.globalCompositeOperation = 'lighter'
      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i]
        f.age += dt
        if (f.age >= f.life) { flames.splice(i, 1); continue }
        const p = f.age / f.life
        let wind = 0
        if (mouseIn) {
          const wdx = f.x - mouseX
          const wdy = f.y - mouseY
          const wd2 = wdx * wdx + wdy * wdy
          if (wd2 < 19600) wind = mouseVX * 0.35 * (1 - wd2 / 19600) /* 140px reach */
        }
        f.x += (f.vx + wind + Math.sin(f.wob + f.age * 9) * 14) * dt
        f.y += f.vy * dt
        const hue = 46 - 40 * p
        const lig = 68 - 20 * p
        const alpha = Math.sin(Math.PI * Math.min(p * 1.15, 1)) * 0.85 * headA
        const rr = f.r * (1 - p * 0.65)
        if (f.r > 2) {
          drawGlow(emberGlow, f.x, f.y, rr * 4.2, alpha * 0.42)
          ctx.globalAlpha = 1
        }
        ctx.fillStyle = 'hsla(' + hue + ',92%,' + lig + '%,' + alpha.toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(f.x, f.y, Math.max(rr, 0.4), 0, 6.2832)
        ctx.fill()
      }
    }

    type Ember = {
      id: number; x: number; y: number; vx: number; vy: number; wob: number
      r: number; life: number; age: number; post: number; held: boolean
      turn: number
      trail: Array<{ x: number; y: number }>
      trailAt: number
      toInbox?: boolean; userCaught: boolean; wasUserCaught: boolean
    }
    const postEmbers: Ember[] = []
    let emberSeq = 1
    function stepEmbers(dt: number, headA: number, t: number, ignite: number) {
      if (!ctx) return
      if (logoReady && crownSrc.length && ignite > 2 && postEmbers.length < 7 && Math.random() < dt * 1.2) {
        const src = crownSrc[(Math.random() * crownSrc.length) | 0]
        /* thoughts scatter in a fan off the crown — up, sideways, curling */
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.4
        const sp = 32 + Math.random() * 46
        postEmbers.push({
          id: emberSeq++,
          x: src.sx + (Math.random() * 20 - 10),
          y: src.sy - 6,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 6,
          turn: (Math.random() - 0.5) * 0.5,
          trail: [],
          trailAt: 0,
          wob: Math.random() * 6.2832,
          r: 5.2 + Math.random() * 1.6,
          life: 8,
          age: 0,
          post: (Math.random() * POSTS.length) | 0,
          held: false,
          userCaught: false,
          wasUserCaught: false,
        })
      }
      ctx.globalCompositeOperation = 'lighter'
      for (let i = postEmbers.length - 1; i >= 0; i--) {
        const em = postEmbers[i]
        if (em.userCaught && !em.wasUserCaught) sparkBurst(em.x, em.y, 6, 0.35) /* caught! */
        em.wasUserCaught = em.userCaught
        if (!em.held) {
          em.age += dt
          if (em.toInbox) {
            /* a thought finds its way to the inbox */
            if (inboxTarget) {
              const { x: tx2, y: ty2 } = inboxTarget
              em.x += (tx2 - em.x) * dt * 1.4
              em.y += (ty2 - em.y) * dt * 1.4
              if (Math.abs(tx2 - em.x) < 12 && Math.abs(ty2 - em.y) < 12) {
                sparkBurst(em.x, em.y, 5, 0.3)
                postEmbers.splice(i, 1)
                continue
              }
            }
          } else {
            /* slow curl: each thought wanders its own arc */
            const ca = Math.cos(em.turn * dt)
            const sa = Math.sin(em.turn * dt)
            const nvx = em.vx * ca - em.vy * sa
            em.vy = em.vx * sa + em.vy * ca
            em.vx = nvx
            /* drift away from the copy column rather than over it */
            if (W >= 1024 && em.x < W * 0.52) em.vx += 20 * dt
            em.x += (em.vx + Math.sin(em.wob + em.age * 2.2) * 9) * dt
            em.y += em.vy * dt
            /* occasionally an uncaught thought peels off toward the capture card */
            if (W >= 1024 && em.age > 3 && Math.random() < dt * 0.05) {
              em.toInbox = true
            }
          }
        }
        if (em.age >= em.life || em.y < 54 || em.y > H - 16 || em.x < 16 || em.x > W - 10) { postEmbers.splice(i, 1); continue }
        const a = Math.min(1, em.age / 0.6, (em.life - em.age) / 1.2) * headA
        /* a short fading tail — a meteor, not a bubble */
        if (!em.held && t >= em.trailAt) {
          em.trail.push({ x: em.x, y: em.y })
          if (em.trail.length > 9) em.trail.shift()
          em.trailAt = t + 1 / 60
        }
        for (let ti = 1; ti < em.trail.length; ti++) {
          const ta = (ti / em.trail.length) * 0.4 * a
          ctx.strokeStyle = 'hsla(' + (40 - 18 * (em.age / em.life)) + ',94%,62%,' + ta.toFixed(3) + ')'
          ctx.lineWidth = (ti / em.trail.length) * 2
          ctx.beginPath()
          ctx.moveTo(em.trail[ti - 1].x, em.trail[ti - 1].y)
          ctx.lineTo(em.trail[ti].x, em.trail[ti].y)
          ctx.stroke()
        }
        const flick = 0.82 + 0.18 * Math.sin(t * 5 + em.wob)
        drawGlow(warmGlow, em.x, em.y, em.r * 4.2, a * 0.62)
        ctx.globalAlpha = 1
        ctx.fillStyle = 'hsla(' + (40 - 18 * (em.age / em.life)) + ',94%,64%,' + (a * flick).toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(em.x, em.y, em.r, 0, 6.2832)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,250,240,' + (a * 0.85).toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(em.x, em.y, em.r * 0.38, 0, 6.2832)
        ctx.fill()
      }
    }

    /* ---------- hover / click / attract ---------- */
    let mouseX = -9999
    let mouseY = -9999
    let mouseIn = false
    let mouseVX = 0 /* smoothed cursor x-velocity, px/s — the wind */
    let lastMoveX = -1
    let lastMoveT = 0
    let surge = 0 /* eased 0..1 while the pointer is on the mark */
    const clusterGlow = CLUSTERS.map(() => 0)
    let hover: Hit | null = null
    let cardHover = false
    let hideTimer: ReturnType<typeof setTimeout> | null = null
    let autoHit: (Hit & { until: number }) | null = null
    let autoNextAt = 0
    let tapHit: (Hit & { until: number }) | null = null
    let lastKey: string | null = null
    let shownPost: number | null = null
    let shownEmberId: number | null = null
    let lastFocus: Hit | null = null
    let navTimer: ReturnType<typeof setTimeout> | null = null
    const prefetched = new Set<string>()
    const prefetchRoute = (route: Route) => {
      const key = String(route)
      if (prefetched.has(key)) return
      prefetched.add(key)
      router.prefetch(route)
    }

    function hitTest(x: number, y: number): Hit | null {
      let bestD = 676
      let bi = -1
      let kind: 0 | 1 = 0
      for (let i = 0; i < stars.length; i++) {
        const dx = stars[i].x - x
        const dy = stars[i].y - y
        const d2 = dx * dx + dy * dy
        if (d2 < bestD) { bestD = d2; bi = i; kind = 0 }
      }
      for (let i = 0; i < postEmbers.length; i++) {
        const dx = postEmbers[i].x - x
        const dy = postEmbers[i].y - y
        const d2 = dx * dx + dy * dy
        if (d2 < bestD) { bestD = d2; bi = i; kind = 1 }
      }
      if (bi < 0) return null
      return kind === 1
        ? { kind: 1, emberId: postEmbers[bi].id, post: postEmbers[bi].post }
        : { kind: 0, i: bi, post: stars[bi].post }
    }
    const emberFor = (hit: Extract<Hit, { kind: 1 }>) =>
      postEmbers.find((ember) => ember.id === hit.emberId)
    const hitPos = (hit: Hit) => hit.kind === 1 ? emberFor(hit) : stars[hit.i]
    const validHit = (hit: Hit | null): hit is Hit =>
      Boolean(hit && (hit.kind === 0 ? stars[hit.i] : emberFor(hit)))

    function updatePreview(hit: Hit | null, isUser: boolean) {
      if (!hit) {
        if (lastKey !== null && !hideTimer) {
          hideTimer = setTimeout(() => {
            hideTimer = null
            if (!hover && !cardHover) {
              preview.classList.remove('mof-show')
              if (hero) hero.style.cursor = ''
              lastKey = null
              lastFocus = null
            }
          }, 280)
        }
        return
      }
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
      const pos = hitPos(hit)
      if (!pos) return
      const key = hit.kind + ':' + (hit.kind === 1 ? hit.emberId : hit.i) + ':' + hit.post
      const post = POSTS[hit.post]
      if (isUser) {
        if (post) prefetchRoute(('/blog/' + post.s) as Route)
        else if (hit.post < 0) prefetchRoute('/newsletter' as Route)
      }
      if (key !== lastKey && hit.post < 0) {
        /* the visitor's own star */
        ppEl('.mof-pp-title').textContent = 'You — reading since ' + (youStar?.since || 'today')
        ppEl('.mof-pp-date').textContent = ''
        ppEl('.mof-pp-cat').textContent = 'YOUR STAR'
        ppEl('.mof-pp-initial').textContent = '✦'
        ppEl('.mof-pp-art').style.background = PP_GRADS[3]
        ppEl('.mof-pp-excerpt').textContent =
          'Your marker in the corpus. The next dispatch lands in your inbox first.'
        const youImg = ppEl('.mof-pp-img') as HTMLImageElement
        youImg.removeAttribute('src')
        youImg.style.display = 'none'
        preview.href = '/newsletter'
        preview.classList.add('mof-show')
        hero.style.cursor = isUser ? 'pointer' : ''
        lastKey = key
        shownPost = hit.post
        shownEmberId = null
        const cw = preview.offsetWidth || 304
        const chh = preview.offsetHeight || 280
        let px = pos.x + 20
        let py = pos.y + 16
        if (px + cw > W - 8) px = pos.x - cw - 20
        if (py + chh > H - 8) py = pos.y - chh - 16
        preview.style.left = Math.min(Math.max(8, px), Math.max(8, W - cw - 8)) + 'px'
        preview.style.top = Math.min(Math.max(8, py), Math.max(8, H - chh - 8)) + 'px'
        return
      }
      if (key !== lastKey && post) {
        const star = hit.kind === 0 ? stars[hit.i] : stars.find((item) => item.post === hit.post)
        const cluster = star?.c ?? clusterOf(post)
        ppEl('.mof-pp-title').textContent = post.t
        ppEl('.mof-pp-date').textContent = (post.d || '') + (hit.post === 0 ? ' · LATEST' : IS_FRESH[hit.post] ? ' · NEW' : readSet.has(post.s) ? ' · READ' : '')
        ppEl('.mof-pp-cat').textContent = hit.kind === 1 ? 'RISING THOUGHT' : CLUSTERS[cluster].label
        ppEl('.mof-pp-initial').textContent = (post.t.charAt(0) || 'Z').toUpperCase()
        ppEl('.mof-pp-art').style.background = PP_GRADS[hit.kind === 1 ? 1 : CLUSTERS[cluster].tint]
        ppEl('.mof-pp-excerpt').textContent = post.e || ''
        const img = ppEl('.mof-pp-img') as HTMLImageElement
        if (post.img) { img.src = post.img; img.style.display = 'block' }
        else { img.removeAttribute('src'); img.style.display = 'none' }
        preview.href = '/blog/' + post.s
        preview.classList.add('mof-show')
        hero.style.cursor = isUser ? 'pointer' : ''
        lastKey = key
        shownPost = hit.post
        shownEmberId = hit.kind === 1 ? hit.emberId : null
        const cw = preview.offsetWidth || 304
        const chh = preview.offsetHeight || 280
        let px = pos.x + 20
        let py = pos.y + 16
        if (px + cw > W - 8) px = pos.x - cw - 20
        if (py + chh > H - 8) py = pos.y - chh - 16
        preview.style.left = Math.min(Math.max(8, px), Math.max(8, W - cw - 8)) + 'px'
        preview.style.top = Math.min(Math.max(8, py), Math.max(8, H - chh - 8)) + 'px'
      }
    }

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect()
      const nx = e.clientX - r.left
      const now = performance.now()
      if (lastMoveX >= 0 && now > lastMoveT) {
        const v = ((nx - lastMoveX) / Math.max(8, now - lastMoveT)) * 1000
        mouseVX = mouseVX * 0.8 + Math.max(-900, Math.min(900, v)) * 0.2
      }
      lastMoveX = nx
      lastMoveT = now
      mouseX = nx
      mouseY = e.clientY - r.top
      const target = e.target as HTMLElement | null
      mouseIn = !(target && target.closest && target.closest('.mof-copy'))
    }
    const onLeave = () => { mouseIn = false; mouseVX = 0; lastMoveX = -1 }
    const onCardEnter = () => { cardHover = true }
    const onCardLeave = () => { cardHover = false }
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target && target.closest && target.closest('a, form, input, button, .mof-copy')) return
      const r = hero.getBoundingClientRect()
      const hit = hitTest(e.clientX - r.left, e.clientY - r.top)
      if (!hit) return
      if (COARSE && !(preview.classList.contains('mof-show') && shownPost === hit.post)) {
        if (hit.kind === 0) stars[hit.i].flare = 1
        tapHit = { ...hit, until: lastT + 6 }
        autoHit = null
        updatePreview(hit, true)
        return
      }
      const post = POSTS[hit.post]
      if (!post && hit.post >= 0) return
      /* the star bursts, then you travel */
      const pos = hitPos(hit)
      if (pos) {
        sparkBurst(pos.x, pos.y, 14, 0.4)
        if (hit.kind === 0) stars[hit.i].flare = 1
      }
      if (navTimer) clearTimeout(navTimer)
      if (hit.post < 0) {
        if (reduced) router.push('/newsletter' as Route)
        else navTimer = setTimeout(() => { if (!disposed) router.push('/newsletter' as Route) }, 140)
        return
      }
      markRead(post.s)
      if (reduced) router.push(('/blog/' + post.s) as Route)
      else navTimer = setTimeout(() => { if (!disposed) router.push(('/blog/' + post.s) as Route) }, 140)
    }
    /* "t" threads the corpus chronologically; arrows walk the stars */
    let threadAt = -999
    let kbCursor = -1
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null
      if (
        e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey ||
        document.activeElement !== hero || tgt?.isContentEditable ||
        Boolean(tgt?.closest('input, textarea, select, [contenteditable="true"]'))
      ) return
      if (e.key === 't' && !reduced) {
        e.preventDefault()
        threadAt = lastT
        return
      }
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Enter' && e.key !== 'Escape') return
      if (e.key === 'Escape') {
        kbCursor = -1
        tapHit = null
        return
      }
      if (!chronoOrder.length) return
      e.preventDefault()
      if (e.key === 'Enter') {
        if (kbCursor >= 0) {
          const st = stars[chronoOrder[kbCursor]]
          const post = POSTS[st.post]
          if (post) {
            markRead(post.s)
            router.push(('/blog/' + post.s) as Route)
          }
        }
        return
      }
      kbCursor =
        e.key === 'ArrowRight'
          ? (kbCursor + 1) % chronoOrder.length
          : kbCursor === -1
            ? chronoOrder.length - 1
            : (kbCursor - 1 + chronoOrder.length) % chronoOrder.length
      const i = chronoOrder[kbCursor]
      stars[i].flare = 1
      tapHit = { kind: 0, i, post: stars[i].post, until: lastT + 30 }
      prefetchRoute(('/blog/' + POSTS[stars[i].post].s) as Route)
      autoHit = null
    }
    hero.addEventListener('keydown', onKey)

    hero.addEventListener('mousemove', onMove, { passive: true })
    hero.addEventListener('mouseleave', onLeave)
    hero.addEventListener('click', onClick)
    preview.addEventListener('mouseenter', onCardEnter)
    preview.addEventListener('mouseleave', onCardLeave)
    const onPreviewClick = () => {
      if (shownPost != null && shownPost >= 0) markRead(POSTS[shownPost].s)
    }
    preview.addEventListener('click', onPreviewClick)

    /* ---------- live queries ---------- */
    let query: {
      p: { x: number; y: number }; nn: number[]; t0: number; gen: number
      label: string; labelX: number; labelY: number; labelW: number
    } | null = null
    let qIndex = 0
    let layoutGen = 0
    let lastQueryAt = -999

    function fireQuery(now: number) {
      lastQueryAt = now
      const item = QUERIES[qIndex % QUERIES.length]
      qIndex++
      const members: number[] = []
      for (let i = 0; i < stars.length; i++) if (stars[i].c === item.c && stars[i].post >= 0) members.push(i)
      if (!members.length) return
      const seed = stars[members[(Math.random() * members.length) | 0]]
      const qp = { x: seed.x + (Math.random() * 30 - 15), y: seed.y + (Math.random() * 30 - 15) }
      const best = members
        .map((i) => {
          const dx = stars[i].x - qp.x
          const dy = stars[i].y - qp.y
          return { i, d: dx * dx + dy * dy }
        })
        .sort((a, b) => a.d - b.d)
      const gen = layoutGen
      const labelW = Math.min(285, item.q.length * 6.2 + 44)
      const labelX = Math.min(Math.max(10, qp.x - labelW / 2), W - labelW - 10)
      const labelY = qp.y < 96 ? qp.y + 18 : qp.y - 34
      query = {
        p: qp,
        nn: best.slice(0, 6).map((b) => b.i),
        t0: now,
        gen,
        label: `SEARCH  “${item.q}”`,
        labelX,
        labelY,
        labelW,
      }
      query.nn.forEach((idx, k) => {
        setTimeout(() => {
          if (!disposed && gen === layoutGen && stars[idx]) stars[idx].flare = 1
        }, 350 + k * 120)
      })
    }

    /* ---------- subscriber comet ---------- */
    let comet: {
      sx: number; sy: number; tx: number; ty: number; t0: number
      trail: Array<{ x: number; y: number }>; done: boolean; labelUntil: number
    } | null = null
    onSuccessRef.current = () => {
      if (reduced || disposed) return
      const members = stars.filter((s) => s.c === 5 && s.post >= 0)
      const target = members.length
        ? members[(Math.random() * members.length) | 0]
        : { x: W * 0.6, y: H * 0.8 }
      comet = {
        sx: -60, sy: H * 0.12,
        tx: target.x + 18, ty: target.y - 14,
        t0: performance.now() / 1000,
        trail: [], done: false, labelUntil: 0,
      }
    }

    /* ---------- render ---------- */
    frame = (ms: number) => {
      if (disposed || !ctx) return
      const t = ms / 1000
      const dt = Math.min(0.05, t - lastT || 0.016)
      lastT = t
      ctx.clearRect(0, 0, W, H)
      const ignite = t - born
      const headA = Math.min(1, Math.max(0, (ignite - 0.3) / 1.4))

      /* hover / tap / attract */
      hover = mouseIn ? hitTest(mouseX, mouseY) : null
      for (const em of postEmbers) { em.held = false; em.userCaught = false }
      if (hover) {
        if (hover.kind === 0) stars[hover.i].flare = Math.max(stars[hover.i].flare, 0.5)
        else {
          const ember = emberFor(hover)
          if (ember) { ember.held = true; ember.userCaught = true }
        }
      }
      if (cardHover && shownEmberId != null) {
        for (const em of postEmbers) if (em.id === shownEmberId) em.held = true
      }
      if (hover && kbCursor < 0) tapHit = null
      else if (tapHit && (t > tapHit.until || !validHit(tapHit))) {
        tapHit = null
        kbCursor = -1
      }
      if (tapHit?.kind === 1) {
        const ember = emberFor(tapHit)
        if (ember) { ember.held = true; ember.userCaught = true }
      }

      if (hover || cardHover || tapHit) {
        autoHit = null
        autoNextAt = t + 4
      } else if (autoHit) {
        if (t > autoHit.until || !validHit(autoHit)) {
          autoHit = null
          autoNextAt = t + 1.4 + Math.random() * 1.8
        } else if (autoHit.kind === 1) {
          const ember = emberFor(autoHit)
          if (ember) ember.held = true
        }
      } else if (!SNAP && t > autoNextAt && ignite > 3 && stars.length) {
        const pickEmber = postEmbers.length > 0 && Math.random() < 0.25
        if (pickEmber) {
          const ai = (Math.random() * postEmbers.length) | 0
          autoHit = {
            kind: 1,
            emberId: postEmbers[ai].id,
            post: postEmbers[ai].post,
            until: t + 3.4,
          }
        } else {
          const validStars = stars.filter((s) => s.post >= 0)
          if (validStars.length > 0) {
            /* introduce what the visitor hasn't read yet */
            const unread = validStars.filter((s) => !readSet.has(POSTS[s.post].s))
            const pool = unread.length > 0 ? unread : validStars
            const ai = (Math.random() * pool.length) | 0
            const starIdx = stars.indexOf(pool[ai])
            autoHit = {
              kind: 0,
              i: starIdx,
              post: stars[starIdx].post,
              until: t + 3.4,
            }
            stars[starIdx].flare = 1
          }
        }
      }
      updatePreview(hover || tapHit || autoHit, !!(hover || tapHit))

      /* the whole constellation warms when one of its stars has focus */
      const activeFocus = hover || tapHit || autoHit
      if (activeFocus) lastFocus = activeFocus
      const focus = activeFocus || (cardHover && lastFocus ? lastFocus : null)
      let focusCluster = -1
      if (focus) {
        if (focus.kind === 0 && stars[focus.i]) {
          focusCluster = stars[focus.i].c
        } else if (focus.kind === 1) {
          const matchStar = stars.find((s) => s.post === focus.post)
          if (matchStar) focusCluster = matchStar.c
        }
      }
      for (let ci = 0; ci < clusterGlow.length; ci++) {
        const target = ci === focusCluster ? 1 : 0
        clusterGlow[ci] = target + (clusterGlow[ci] - target) * Math.exp(-5 * dt)
      }

      /* nebulae */
      ctx.globalCompositeOperation = 'source-over'
      ctx.font = '600 11px ui-monospace, SF Mono, Menlo, monospace'
      try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '2px' } catch { /* older browsers */ }
      ctx.textAlign = 'center'
      const labelA = Math.min(1, ignite / 2)
      for (const cg of clusterGeo) {
        const nr = cg.R * 1.25
        const g = ctx.createRadialGradient(cg.cx, cg.cy, 0, cg.cx, cg.cy, nr)
        g.addColorStop(0, P.nebula)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(cg.cx - nr, cg.cy - nr, nr * 2, nr * 2)
      }

      /* links */
      ctx.lineWidth = 0.9
      for (const [a, b] of links) {
        const la = Math.min(0.6, 0.2 * labelA * (1 + clusterGlow[stars[a].c] * 0.9))
        ctx.strokeStyle = 'rgba(' + P.edge + ',' + la.toFixed(3) + ')'
        ctx.beginPath()
        ctx.moveTo(stars[a].x, stars[a].y)
        ctx.lineTo(stars[b].x, stars[b].y)
        ctx.stroke()
      }

      /* stars */
      ctx.globalCompositeOperation = 'lighter'
      for (const st of stars) {
        const a = Math.min(1, Math.max(0, (ignite - st.delay) / 0.5))
        if (a <= 0) continue
        const read = st.post >= 0 && readSet.has(POSTS[st.post].s)
        /* fresh ink outranks the read patina — recency is true for every
           visitor, the patina only for this one */
        const fresh = st.post >= 0 && IS_FRESH[st.post]
        const tw = fresh
          ? 0.68 + 0.32 * Math.sin(t * 2.3 + st.phase)
          : 0.78 + 0.22 * Math.sin(t * 1.3 + st.phase)
        let alpha = Math.min(1, a * tw * 0.95 * (1 + clusterGlow[st.c] * 0.22) * (fresh ? 1.18 : 1) * (read && !fresh ? 0.78 : 1))
        let size = st.r + (fresh ? 1 : 0)
        if (st.post === 0) {
          /* the newest thought wears a slow-breathing halo */
          const br = 0.5 + 0.5 * Math.sin(t * 1.6)
          const hr = size + 8 + 3 * br
          drawGlow(emberGlow, st.x, st.y, hr * 2.4, a * (0.18 + 0.14 * br))
          ctx.globalAlpha = 1
          ctx.strokeStyle = 'rgba(' + P.edge + ',' + (a * (0.5 + 0.35 * br)).toFixed(3) + ')'
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.arc(st.x, st.y, hr, 0, 6.2832)
          ctx.stroke()
        }
        if (st.flare > 0) {
          st.flare = Math.max(0, st.flare - 0.48 * dt)
          alpha = Math.min(1, alpha + st.flare * 0.9)
          size += st.flare * 3
          drawGlow(warmGlow, st.x, st.y, size * 5, st.flare * 0.5)
          ctx.globalAlpha = 1
        }
        ctx.fillStyle = 'rgba(' + P.tints[st.tint] + ',' + alpha.toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(st.x, st.y, size, 0, 6.2832)
        ctx.fill()
        if (fresh) {
          /* fresh ink glints: diffraction spikes that pulse with the twinkle */
          const g = a * (0.25 + 0.55 * Math.max(0, Math.sin(t * 2.3 + st.phase)))
          const L = size * 2.8
          ctx.strokeStyle = 'rgba(251,247,240,' + g.toFixed(3) + ')'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(st.x - L, st.y)
          ctx.lineTo(st.x + L, st.y)
          ctx.moveTo(st.x, st.y - L)
          ctx.lineTo(st.x, st.y + L)
          ctx.stroke()
        }
        if (read && !fresh) {
          /* a thin ember ring — the trail you've burned */
          ctx.globalCompositeOperation = 'source-over'
          ctx.strokeStyle = 'rgba(' + P.edge + ',' + (a * 0.4).toFixed(3) + ')'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(st.x, st.y, size + 3, 0, 6.2832)
          ctx.stroke()
          ctx.globalCompositeOperation = 'lighter'
        }
      }

      /* focus ring */
      const focusHit = hover || tapHit || autoHit
      if (validHit(focusHit)) {
        const hs = hitPos(focusHit)
        if (hs) {
          ctx.globalCompositeOperation = 'source-over'
          ctx.strokeStyle = 'rgba(' + P.edge + ',0.9)'
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.arc(hs.x, hs.y, hs.r + 5, 0, 6.2832)
          ctx.stroke()
        }
      }

      /* the fire answers the cursor: surge while the pointer rides the mark */
      const exS = (LOGO_H || 400) * 0.48
      const eyS = (LOGO_H || 400) * 0.62
      const sdx = (mouseX - logoCX) / exS
      const sdy = (mouseY - logoCY) / eyS
      const surgeTarget = mouseIn && sdx * sdx + sdy * sdy < 1.3 ? 1 : 0
      surge = surgeTarget + (surge - surgeTarget) * Math.exp(-3.7 * dt)
      mouseVX *= Math.exp(-3.7 * dt) /* wind dies down between gestures */

      /* halo + the mark + its fire */
      ctx.globalCompositeOperation = 'source-over'
      const haloR = (LOGO_H || 400) * 0.72
      const hg = ctx.createRadialGradient(logoCX, logoCY, haloR * 0.25, logoCX, logoCY, haloR)
      hg.addColorStop(0, P.halo + '0.55)')
      hg.addColorStop(1, P.halo + '0)')
      ctx.fillStyle = hg
      ctx.fillRect(logoCX - haloR, logoCY - haloR, haloR * 2, haloR * 2)
      drawLogo(t, headA)
      stepFlames(dt, headA)
      stepEmbers(dt, headA, t, ignite)

      /* labels above everything */
      ctx.globalCompositeOperation = 'source-over'
      ctx.textAlign = 'center'
      if (labelA > 0.02) {
        for (let ci = 0; ci < clusterGeo.length; ci++) {
          const cg = clusterGeo[ci]
          ctx.fillStyle = P.label + Math.min(1, 0.9 * labelA * (1 + clusterGlow[ci] * 0.6)).toFixed(2) + ')'
          ctx.fillText(CLUSTERS[ci].label, cg.cx, cg.cy - cg.R - 14)
        }
      }

      /* live query */
      if (query && query.gen !== layoutGen) query = null
      if (query) {
        const qt = t - query.t0
        const qp = query.p
        if (qt < 1.1) {
          ctx.strokeStyle = 'rgba(' + P.queryRing + ',' + (0.7 * (1 - qt / 1.1)).toFixed(3) + ')'
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.arc(qp.x, qp.y, qt * 80, 0, 6.2832)
          ctx.stroke()
        }
        const ea = qt < 3.8 ? 1 : Math.max(0, 1 - (qt - 3.8) / 1.2)
        if (ea > 0 && qt > 0.35) {
          const prog = Math.min(1, (qt - 0.35) / 0.8)
          ctx.lineWidth = 1
          for (const ni of query.nn) {
            ctx.strokeStyle = 'rgba(' + P.edge + ',' + (0.55 * ea).toFixed(3) + ')'
            ctx.beginPath()
            ctx.moveTo(qp.x, qp.y)
            ctx.lineTo(qp.x + (stars[ni].x - qp.x) * prog, qp.y + (stars[ni].y - qp.y) * prog)
            ctx.stroke()
          }
          ctx.fillStyle = 'rgba(' + P.queryRing + ',' + (0.95 * ea).toFixed(3) + ')'
          ctx.beginPath()
          ctx.arc(qp.x, qp.y, 3.4, 0, 6.2832)
          ctx.fill()

          /* Give the retrieval vignette its missing semantic payload. The
             dark pill keeps the query legible over links without hiding sky. */
          const labelW = query.labelW
          const labelH = 24
          const lx = query.labelX
          const ly = query.labelY
          const rr = 6
          ctx.globalCompositeOperation = 'source-over'
          ctx.fillStyle = `rgba(9,10,22,${(0.82 * ea).toFixed(3)})`
          ctx.strokeStyle = `rgba(${P.edge},${(0.38 * ea).toFixed(3)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(lx + rr, ly)
          ctx.lineTo(lx + labelW - rr, ly)
          ctx.quadraticCurveTo(lx + labelW, ly, lx + labelW, ly + rr)
          ctx.lineTo(lx + labelW, ly + labelH - rr)
          ctx.quadraticCurveTo(lx + labelW, ly + labelH, lx + labelW - rr, ly + labelH)
          ctx.lineTo(lx + rr, ly + labelH)
          ctx.quadraticCurveTo(lx, ly + labelH, lx, ly + labelH - rr)
          ctx.lineTo(lx, ly + rr)
          ctx.quadraticCurveTo(lx, ly, lx + rr, ly)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          ctx.font = '600 9px ui-monospace, SF Mono, Menlo, monospace'
          ctx.textAlign = 'left'
          ctx.fillStyle = `rgba(251,247,240,${(0.92 * labelA).toFixed(3)})`
          ctx.fillText(query.label, lx + 9, ly + 15, labelW - 18)
          ctx.textAlign = 'center'
        }
        if (qt > 5.4) query = null
      }
      if (!SNAP && W >= 1024 && t - lastQueryAt > 7 && ignite > 2.4) fireQuery(t)

      /* subscriber comet */
      if (comet) {
        const ctm = t - comet.t0
        const ease = 1 - Math.pow(1 - Math.min(ctm / 2.2, 1), 3)
        const cxp = comet.sx + (comet.tx - comet.sx) * ease
        const cyp = comet.sy + (comet.ty - comet.sy) * ease
        comet.trail.push({ x: cxp, y: cyp })
        if (comet.trail.length > 26) comet.trail.shift()
        for (let ti = 1; ti < comet.trail.length; ti++) {
          ctx.strokeStyle = 'rgba(' + P.edge + ',' + ((ti / comet.trail.length) * 0.55).toFixed(3) + ')'
          ctx.lineWidth = (ti / comet.trail.length) * 2.2
          ctx.beginPath()
          ctx.moveTo(comet.trail[ti - 1].x, comet.trail[ti - 1].y)
          ctx.lineTo(comet.trail[ti].x, comet.trail[ti].y)
          ctx.stroke()
        }
        ctx.fillStyle = 'rgba(' + P.queryRing + ',0.95)'
        ctx.beginPath()
        ctx.arc(cxp, cyp, 2.6, 0, 6.2832)
        ctx.fill()
        if (ctm >= 2.2 && !comet.done) {
          comet.done = true
          comet.labelUntil = t + 3
          /* applause: the constellation welcomes its newest reader */
          const gen = layoutGen
          const tx = comet.tx
          const ty = comet.ty
          stars
            .map((sst, i) => ({ i, d: (sst.x - tx) * (sst.x - tx) + (sst.y - ty) * (sst.y - ty), c: sst.c, post: sst.post }))
            .filter((x) => x.c === 5 && x.post >= 0)
            .sort((x, y) => x.d - y.d)
            .slice(0, 14)
            .forEach((x, k) => {
              setTimeout(() => {
                if (!disposed && gen === layoutGen && stars[x.i]) stars[x.i].flare = 1
              }, 120 + k * 70)
            })
        }
        if (comet.done) {
          if (t < comet.labelUntil) {
            ctx.fillStyle = P.label + '0.9)'
            ctx.textAlign = 'left'
            ctx.fillText('← YOU', comet.tx + 10, comet.ty + 3)
            ctx.textAlign = 'center'
          } else {
            for (let yi = stars.length - 1; yi >= 0; yi--) {
              if (stars[yi].post < 0) stars.splice(yi, 1)
            }
            youStar = {
              fx: comet.tx / W,
              fy: comet.ty / H,
              since: new Date().toISOString().slice(0, 10),
            }
            try { localStorage.setItem('mofYou', JSON.stringify(youStar)) } catch { /* ignore */ }
            stars.push({
              x: comet.tx, y: comet.ty, r: 5.5, tint: 3,
              phase: 1.7, delay: 0, flare: 1, post: -1, c: 5,
            })
            comet = null
          }
        }
      }

      /* chronology thread: press "t" — five years of writing, one stroke */
      const th = t - threadAt
      if (th >= 0 && th < 5.5 && chronoOrder.length > 1 && chronoLength > 0) {
        const fade = th < 4 ? 1 : Math.max(0, 1 - (th - 4) / 1.5)
        const timeProgress = Math.min(1, th / 4)
        const eased = timeProgress < 0.5
          ? 2 * timeProgress * timeProgress
          : 1 - Math.pow(-2 * timeProgress + 2, 2) / 2
        const distance = eased * chronoLength
        let whole = 0
        while (whole < chronoDistances.length - 1 && chronoDistances[whole + 1] <= distance) whole++
        const next = Math.min(whole + 1, chronoOrder.length - 1)
        const segmentLength = Math.max(1, chronoDistances[next] - chronoDistances[whole])
        const segmentProgress = next === whole ? 0 : (distance - chronoDistances[whole]) / segmentLength
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = 'rgba(' + P.edge + ',' + (0.45 * fade).toFixed(3) + ')'
        ctx.lineWidth = 1.3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(stars[chronoOrder[0]].x, stars[chronoOrder[0]].y)
        for (let ci2 = 1; ci2 <= whole; ci2++) {
          ctx.lineTo(stars[chronoOrder[ci2]].x, stars[chronoOrder[ci2]].y)
        }
        if (whole < chronoOrder.length - 1) {
          const fA = stars[chronoOrder[whole]]
          const fB = stars[chronoOrder[whole + 1]]
          ctx.lineTo(
            fA.x + (fB.x - fA.x) * segmentProgress,
            fA.y + (fB.y - fA.y) * segmentProgress,
          )
        }
        ctx.stroke()
        const runnerA = stars[chronoOrder[whole]]
        const runnerB = stars[chronoOrder[next]]
        const runnerX = runnerA.x + (runnerB.x - runnerA.x) * segmentProgress
        const runnerY = runnerA.y + (runnerB.y - runnerA.y) * segmentProgress
        ctx.globalCompositeOperation = 'lighter'
        drawGlow(warmGlow, runnerX, runnerY, 16, 0.75 * fade)
        ctx.globalAlpha = 1
        ctx.fillStyle = `rgba(${P.queryRing},${(0.95 * fade).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(runnerX, runnerY, 2.2, 0, 6.2832)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
        ctx.font = '600 10px ui-monospace, SF Mono, Menlo, monospace'
        ctx.textAlign = 'left'
        let lastYear = ''
        for (let ci2 = 0; ci2 <= whole; ci2++) {
          const yr = (POSTS[stars[chronoOrder[ci2]].post]?.d || '').slice(0, 4)
          if (yr && yr !== lastYear) {
            lastYear = yr
            ctx.fillStyle = P.label + (0.8 * fade).toFixed(2) + ')'
            ctx.fillText(yr, stars[chronoOrder[ci2]].x + 8, stars[chronoOrder[ci2]].y - 8)
          }
        }
        ctx.textAlign = 'center'
      }

      if (running) requestFrame()
    }

    /* ---------- boot ---------- */
    resize()
    initLogo()
    if (!reduced && !seen && !SNAP) {
      born = performance.now() / 1000
    } else {
      born = performance.now() / 1000 - 10 /* settled: no stagger for repeat visits */
    }
    if (!reduced) {
      running = true
      requestFrame()
    } else {
      /* a composed poster, not a paused video: settled sky, one recent
         unread essay pre-focused with its card open */
      born = -10
      let pick: Star | undefined
      for (const si of chronoOrder) {
        if (!readSet.has(POSTS[stars[si].post].s)) {
          pick = stars[si]
          break
        }
      }
      if (!pick && chronoOrder.length) pick = stars[chronoOrder[0]]
      if (pick) {
        const pi = stars.indexOf(pick)
        stars[pi].flare = 0.7
        autoHit = { kind: 0, i: pi, post: stars[pi].post, until: Number.MAX_SAFE_INTEGER }
      }
      requestFrame()
    }
    const scheduleResize = () => {
      if (resizeRafId || disposed) return
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = 0
        resize()
      })
    }

    let ro: ResizeObserver | null = null
    const supportsResizeObserver = typeof window.ResizeObserver === 'function'
    if (supportsResizeObserver) {
      ro = new ResizeObserver(scheduleResize)
      ro.observe(hero)
      if (capture) ro.observe(capture)
    } else {
      window.addEventListener('resize', scheduleResize)
    }

    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window && !reduced) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting && !running) {
              running = true
              lastT = performance.now() / 1000
              requestFrame()
            } else if (!en.isIntersecting) {
              running = false
            }
          })
        },
        { threshold: 0.05 },
      )
      io.observe(hero)
    }

    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(rafId)
      cancelAnimationFrame(resizeRafId)
      framePending = false
      if (hideTimer) clearTimeout(hideTimer)
      if (navTimer) clearTimeout(navTimer)
      ro?.disconnect()
      io?.disconnect()
      window.removeEventListener('resize', scheduleResize)
      hero.removeEventListener('keydown', onKey)
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
      hero.removeEventListener('click', onClick)
      preview.removeEventListener('mouseenter', onCardEnter)
      preview.removeEventListener('mouseleave', onCardLeave)
      preview.removeEventListener('click', onPreviewClick)
      onSuccessRef.current = null
    }
  }, [router])

  return (
    <section
      ref={heroRef}
      className="mof-hero dark"
      tabIndex={0}
      aria-label={`The corpus: ${POST_COUNT} essays as constellations. Focus and use arrow keys to browse, Enter to read.`}
    >
      <canvas ref={canvasRef} className="mof-sky" aria-hidden="true" />
      <nav className="mof-sr" aria-label="Recent essays">
        <ul>
          {POSTS.slice(0, 10).map((p) => (
            <li key={p.s}>
              <Link href={`/blog/${p.s}` as Route}>{p.t}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mof-content">
        <div className="mof-copy">
          <div className="editorial-eyebrow editorial-eyebrow--ruled text-parchment-600 dark:text-slate-400 mof-eyebrow">
            <span className="editorial-eyebrow-rule" aria-hidden />
            <span>
              <span className="editorial-eyebrow-section text-burnt-400 dark:text-amber-400">§ 00</span>
              {' · Mind on Fire LLC — Software & AI consultancy'}
            </span>
          </div>

          <h1 className="mof-h1 text-charcoal-50 dark:text-parchment-100">
            The mind is a fire
            <em className="mof-h1-em text-burnt-400 dark:text-amber-400">to be ignited.</em>
          </h1>

          <p className="mof-lede text-parchment-600 dark:text-slate-300">
            I&rsquo;m <strong>Zack</strong> &mdash; a builder, writer, and teacher.
            Applied AI at <strong>WorkOS</strong>, formerly Pinecone, Cloudflare,
            and Gruntwork. Fifteen years across the whole stack: frontend to
            backend, distributed cloud systems, DevOps, and open source.{' '}
            <strong>Mind on Fire</strong> is my consultancy: software and applied
            AI that ships.
          </p>
          <p className="mof-lede mof-lede-follow text-parchment-600 dark:text-slate-300">
            <span className="hidden lg:inline">
              Every star above is one of my <strong>{POST_COUNT} essays</strong>;
              my entire body of work burning in semantic space. Hover to preview,
              click to read. Catch an ember as it rises.
            </span>
            <span className="lg:hidden">
              The fire above draws from my <strong>{POST_COUNT} essays</strong>.
              Explore the full constellation on a larger screen, or browse every
              essay below.
            </span>
          </p>
          <p className="mof-kicker text-charcoal-50 dark:text-parchment-100">
            I do this work because I love it &mdash; and everything I learn,
            I give away.
          </p>

          <div className="mof-capture">
            <EditorialNewsletter
              location="hero"
              variant="card"
              label="The Modern Coding letter"
              meta="5,000+ engineers"
              title="Dispatches from the edge of applied AI."
              promise={
                <>
                  <b>What lands in your inbox:</b> what I&rsquo;m building, what
                  I&rsquo;m learning, the tools I&rsquo;d actually pay for.
                  Names named, vendors graded, evals included.
                </>
              }
              fine="Unsubscribe in one click · No spam, ever"
              ctaLabel="Subscribe →"
              onSuccess={handleNewsletterSuccess}
            />
          </div>

          <div className="editorial-secondary text-parchment-600 dark:text-slate-400 mof-secondary">
            <Link href="/blog">Read all my writing →</Link>
            <span>·</span>
            <Link href="/services">Workshops &amp; AI enablement →</Link>
          </div>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element -- imperative preview card driven by the canvas engine */}
      <a ref={previewRef} className="mof-preview" target="_self">
        <span className="mof-pp-art">
          <span className="mof-pp-initial">Z</span>
          {/* eslint-disable-next-line @next/next/no-img-element -- src swaps per hovered star; CDN-hosted */}
          <img className="mof-pp-img" alt="" />
        </span>
        <span className="mof-pp-body">
          <span className="mof-pp-meta">
            <span className="mof-pp-cat" />
            <span className="mof-pp-date" />
          </span>
          <span className="mof-pp-title" />
          <span className="mof-pp-excerpt" />
          <span className="mof-pp-read">Read essay →</span>
        </span>
      </a>

    </section>
  )
}
