'use client'

import { useEffect, useRef } from 'react'
import type { AdvisorPhase, AdvisorSignal } from './advisor-types'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  homeX: number
  homeY: number
  seed: number
  lane: number
  layer: number
  size: number
}

const TAU = Math.PI * 2
const CELL_SIZE = 76

function hash(index: number, salt: number) {
  const value = Math.sin((index + 1) * 91.17 + salt * 317.31) * 43758.5453
  return value - Math.floor(value)
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '')
  if (!/^[\da-f]{6}$/i.test(value)) return '106, 225, 255'
  return `${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}`
}

export function ConvergenceField({ signal }: { signal: AdvisorSignal }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signalRef = useRef(signal)
  const redrawRef = useRef<((previous: AdvisorPhase) => void) | null>(null)

  useEffect(() => {
    const previous = signalRef.current.phase
    signalRef.current = signal
    redrawRef.current?.(previous)
  }, [signal])

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !host || !context) return

    const ctx = context
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointerQuery = window.matchMedia('(pointer: fine)')
    let reduced = motionQuery.matches
    let finePointer = finePointerQuery.matches
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let gridHeads = new Int32Array(0)
    let gridNext = new Int32Array(0)
    let gridColumns = 1
    let gridRows = 1
    let visible = true
    let disposed = false
    let running = false
    let frameId = 0
    let resizeFrameId = 0
    let previousTime = 0
    let phaseStarted = performance.now()
    let resolvedMix = signalRef.current.phase === 'resolved' ? 1 : 0
    let focusX = 0
    let focusY = 0
    let pointerTargetX = -1000
    let pointerTargetY = -1000
    let pointerX = -1000
    let pointerY = -1000
    let pointerInside = false
    let glow: CanvasGradient | null = null
    let glowDirty = true
    let accentRgb = hexToRgb(signalRef.current.accent ?? '#6ae1ff')

    const locateFocus = () => {
      const hostRect = host.getBoundingClientRect()
      const card = host.querySelector<HTMLElement>('[data-recommendation-card]')
      if (card) {
        const rect = card.getBoundingClientRect()
        focusX = rect.left - hostRect.left + rect.width * 0.55
        focusY = rect.top - hostRect.top + rect.height * 0.5
      } else {
        focusX = width * 0.69
        focusY = height * 0.57
      }
    }

    const buildParticles = () => {
      const count = width < 640 ? Math.min(112, Math.round(width / 3.25)) : Math.min(238, Math.round(width / 5.2))
      particles = new Array<Particle>(count)
      gridNext = new Int32Array(count)
      gridColumns = Math.max(1, Math.ceil(width / CELL_SIZE))
      gridRows = Math.max(1, Math.ceil(height / CELL_SIZE))
      gridHeads = new Int32Array(gridColumns * gridRows)
      for (let index = 0; index < count; index++) {
        const x = hash(index, 1) * width
        const y = hash(index, 2) * height
        const layer = index % 3
        particles[index] = {
          x,
          y,
          vx: (hash(index, 3) - 0.5) * 2,
          vy: (hash(index, 4) - 0.5) * 2,
          homeX: hash(index, 5),
          homeY: hash(index, 6),
          seed: hash(index, 7) * TAU,
          lane: index % 11,
          layer,
          size: 0.85 + hash(index, 8) * 1.35 + layer * 0.18,
        }
      }
    }

    const refreshGlow = () => {
      if (!glowDirty) return
      glowDirty = false
      glow = ctx.createRadialGradient(focusX, focusY, 0, focusX, focusY, Math.max(190, width * 0.4))
      glow.addColorStop(0, `rgba(${accentRgb}, 0.25)`)
      glow.addColorStop(0.18, `rgba(${accentRgb}, 0.105)`)
      glow.addColorStop(0.55, `rgba(${accentRgb}, 0.025)`)
      glow.addColorStop(1, `rgba(${accentRgb}, 0)`)
    }

    const rebuildGrid = () => {
      gridHeads.fill(-1)
      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        const cellX = Math.max(0, Math.min(gridColumns - 1, Math.floor(particle.x / CELL_SIZE)))
        const cellY = Math.max(0, Math.min(gridRows - 1, Math.floor(particle.y / CELL_SIZE)))
        const cell = cellY * gridColumns + cellX
        gridNext[index] = gridHeads[cell]
        gridHeads[cell] = index
      }
    }

    const drawLinks = (phase: AdvisorPhase, resolveBeat: number) => {
      rebuildGrid()
      const maxDistance = phase === 'thinking' ? 68 : phase === 'listening' ? 60 : 54
      const maxDistanceSquared = maxDistance * maxDistance
      ctx.lineWidth = phase === 'thinking' ? 0.75 : 0.6
      ctx.strokeStyle = phase === 'resolved'
        ? `rgba(${accentRgb}, ${0.09 + resolveBeat * 0.14})`
        : `rgba(119, 218, 245, ${phase === 'thinking' ? 0.105 : 0.075})`
      ctx.beginPath()
      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        const cellX = Math.max(0, Math.min(gridColumns - 1, Math.floor(particle.x / CELL_SIZE)))
        const cellY = Math.max(0, Math.min(gridRows - 1, Math.floor(particle.y / CELL_SIZE)))
        let links = 0
        for (let oy = -1; oy <= 1 && links < 2; oy++) {
          const row = cellY + oy
          if (row < 0 || row >= gridRows) continue
          for (let ox = -1; ox <= 1 && links < 2; ox++) {
            const column = cellX + ox
            if (column < 0 || column >= gridColumns) continue
            let otherIndex = gridHeads[row * gridColumns + column]
            while (otherIndex >= 0 && links < 2) {
              if (otherIndex > index) {
                const other = particles[otherIndex]
                const dx = other.x - particle.x
                const dy = other.y - particle.y
                const distanceSquared = dx * dx + dy * dy
                if (distanceSquared < maxDistanceSquared) {
                  ctx.moveTo(particle.x, particle.y)
                  ctx.lineTo(other.x, other.y)
                  links++
                }
              }
              otherIndex = gridNext[otherIndex]
            }
          }
        }
      }
      ctx.stroke()
    }

    const drawResolveEvent = (elapsed: number) => {
      if (elapsed >= 1.15) return
      const rush = Math.min(1, elapsed / 0.34)
      const release = Math.max(0, Math.min(1, (elapsed - 0.34) / 0.72))
      const pulse = 1 - Math.pow(1 - Math.min(1, elapsed / 0.78), 3)
      const alpha = Math.sin(Math.min(1, elapsed / 1.08) * Math.PI)

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.strokeStyle = `rgba(${accentRgb}, ${0.78 * alpha})`
      ctx.lineWidth = 1.4 + (1 - pulse) * 2.6
      ctx.beginPath()
      ctx.arc(focusX, focusY, 12 + pulse * Math.max(130, Math.min(width * 0.34, 300)), 0, TAU)
      ctx.stroke()
      ctx.strokeStyle = `rgba(238, 252, 255, ${0.38 * alpha})`
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.arc(focusX, focusY, 7 + pulse * Math.max(80, Math.min(width * 0.23, 190)), 0, TAU)
      ctx.stroke()
      ctx.restore()

      // The first third implodes, then an orbit becomes legible before settling.
      if (rush < 1 || release < 0.9) {
        ctx.strokeStyle = `rgba(${accentRgb}, ${0.5 * alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(focusX, focusY, 42 + release * 18, 15 + release * 6, -0.18, 0, TAU)
        ctx.stroke()
      }
    }

    const draw = (timeMs: number, advance: boolean) => {
      if (!width || !height) return
      const time = timeMs / 1000
      const rawDelta = previousTime ? time - previousTime : 1 / 60
      const dt = Math.min(0.034, Math.max(0.001, rawDelta))
      previousTime = time
      const phase = reduced ? 'resolved' : signalRef.current.phase
      const phaseElapsed = reduced ? 2 : Math.max(0, (timeMs - phaseStarted) / 1000)
      const resolveTarget = phase === 'resolved' ? 1 : 0
      resolvedMix += (resolveTarget - resolvedMix) * Math.min(1, dt * 4.2)
      const resolveBeat = phase === 'resolved' && phaseElapsed < 1.1
        ? Math.sin((phaseElapsed / 1.1) * Math.PI)
        : 0

      pointerX += (pointerTargetX - pointerX) * Math.min(1, dt * 8)
      pointerY += (pointerTargetY - pointerY) * Math.min(1, dt * 8)

      ctx.clearRect(0, 0, width, height)
      if (resolvedMix > 0.01) {
        refreshGlow()
        if (glow) {
          ctx.globalAlpha = resolvedMix
          ctx.fillStyle = glow
          ctx.fillRect(0, 0, width, height)
          ctx.globalAlpha = 1
        }
      }

      const pointerRadius = 112
      const pointerRadiusSquared = pointerRadius * pointerRadius
      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        const layerSpeed = 0.72 + particle.layer * 0.42
        const laneY = height * (0.12 + particle.lane * 0.076)
        let targetX = particle.x
        let targetY = particle.y
        let pull = 0
        let flow = 0

        if (phase === 'idle') {
          targetY = particle.homeY * height + Math.sin(time * 0.42 + particle.seed) * (20 + particle.layer * 6)
          pull = 0.055
          flow = (4.4 + particle.layer * 2.1) * layerSpeed
        } else if (phase === 'listening') {
          targetX = width * (0.2 + particle.homeX * 0.63)
          targetY = laneY + Math.sin(time * 0.85 + particle.seed) * (9 - particle.layer)
          pull = 0.2
          flow = (8 + particle.layer * 4) * layerSpeed
        } else if (phase === 'thinking') {
          const current = (time * (0.16 + particle.layer * 0.065) + particle.homeX) % 1
          targetX = width * (0.03 + current * 0.94)
          targetY = laneY + Math.sin(time * (1.35 + particle.layer * 0.3) + particle.seed) * 5
          pull = 0.38
          flow = (31 + particle.layer * 17) * layerSpeed
        } else {
          const rush = Math.min(1, phaseElapsed / 0.34)
          const settle = Math.max(0, Math.min(1, (phaseElapsed - 0.34) / 0.72))
          const angle = particle.seed + time * (0.5 + particle.layer * 0.12)
          const orbitRadius = 34 + (index % 17) * 3.2
          const settledX = width * (0.08 + particle.homeX * 0.82)
          const settledY = laneY + (focusY - laneY) * Math.pow(particle.homeX, 1.65)
          const orbitX = focusX + Math.cos(angle) * orbitRadius
          const orbitY = focusY + Math.sin(angle) * orbitRadius * 0.36
          targetX = orbitX + (settledX - orbitX) * settle
          targetY = orbitY + (settledY - orbitY) * settle
          pull = 0.34 + rush * 1.35
        }

        if (advance) {
          particle.vx += (targetX - particle.x) * pull * dt
          particle.vy += (targetY - particle.y) * pull * dt
          particle.vx += flow * dt

          if (pointerInside && phase !== 'resolved') {
            const dx = particle.x - pointerX
            const dy = particle.y - pointerY
            const distanceSquared = dx * dx + dy * dy
            if (distanceSquared > 1 && distanceSquared < pointerRadiusSquared) {
              const force = (1 - distanceSquared / pointerRadiusSquared) * 0.72
              const inverseDistance = 1 / Math.sqrt(distanceSquared)
              particle.vx += (dx * inverseDistance - dy * inverseDistance * 0.34) * force
              particle.vy += (dy * inverseDistance + dx * inverseDistance * 0.34) * force
            }
          }

          const damping = phase === 'thinking' ? 0.935 : phase === 'resolved' ? 0.89 : 0.92
          particle.vx *= Math.pow(damping, dt * 60)
          particle.vy *= Math.pow(damping - 0.025, dt * 60)
          particle.x += particle.vx * dt * 60
          particle.y += particle.vy * dt * 60

          if (phase !== 'resolved' && particle.x > width + 22) particle.x = -22
          if (particle.x < -30) particle.x = width + 20
          if (particle.y < -24) particle.y = height + 18
          if (particle.y > height + 24) particle.y = -18
        }
      }

      drawLinks(phase, resolveBeat)

      ctx.lineCap = 'round'
      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        const velocity = Math.min(18, Math.hypot(particle.vx, particle.vy))
        const trail = phase === 'thinking' ? 8 + velocity * 1.45 : phase === 'listening' ? 5 + velocity * 0.65 : 3 + velocity * 0.35
        const speedScale = velocity > 0.01 ? trail / velocity : 0
        const alpha = 0.26 + particle.layer * 0.1 + (phase === 'thinking' ? 0.16 : 0) + resolveBeat * 0.3
        ctx.strokeStyle = phase === 'resolved'
          ? `rgba(${accentRgb}, ${alpha})`
          : `rgba(132, 229, 255, ${alpha})`
        ctx.lineWidth = 0.7 + particle.size * 0.42
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(particle.x - particle.vx * speedScale, particle.y - particle.vy * speedScale)
        ctx.stroke()
      }

      ctx.fillStyle = phase === 'resolved' ? `rgba(${accentRgb}, 0.78)` : 'rgba(166, 238, 255, 0.7)'
      ctx.beginPath()
      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        const radius = particle.size * (phase === 'thinking' ? 1.08 : 1) + resolveBeat * 0.7
        ctx.moveTo(particle.x + radius, particle.y)
        ctx.arc(particle.x, particle.y, radius, 0, TAU)
      }
      ctx.fill()

      if (phase === 'resolved' && !reduced) drawResolveEvent(phaseElapsed)
    }

    const shouldRun = () => !reduced && visible && !document.hidden

    const frame = (time: number) => {
      if (!running || disposed) return
      draw(time, true)
      frameId = requestAnimationFrame(frame)
    }

    const syncLoop = () => {
      const nextRunning = shouldRun()
      if (nextRunning && !running) {
        running = true
        previousTime = 0
        frameId = requestAnimationFrame(frame)
      } else if (!nextRunning && running) {
        running = false
        cancelAnimationFrame(frameId)
      }
      if (reduced) draw(performance.now(), false)
    }

    const resize = () => {
      resizeFrameId = 0
      const rect = host.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      locateFocus()
      glowDirty = true
      buildParticles()
      if (reduced) {
        resolvedMix = 1
        for (let index = 0; index < particles.length; index++) {
          const particle = particles[index]
          particle.x = width * (0.08 + particle.homeX * 0.82)
          const laneY = height * (0.12 + particle.lane * 0.076)
          particle.y = laneY + (focusY - laneY) * Math.pow(particle.homeX, 1.65)
        }
      }
      draw(performance.now(), false)
    }

    const scheduleResize = () => {
      if (resizeFrameId) return
      resizeFrameId = requestAnimationFrame(resize)
    }

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduced = event.matches
      resize()
      syncLoop()
    }
    const onFinePointerChange = (event: MediaQueryListEvent) => { finePointer = event.matches }
    const onVisibilityChange = () => syncLoop()
    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer) return
      const rect = host.getBoundingClientRect()
      pointerTargetX = event.clientX - rect.left
      pointerTargetY = event.clientY - rect.top
      pointerInside = true
    }
    const onPointerLeave = () => {
      pointerInside = false
      pointerTargetX = -1000
      pointerTargetY = -1000
    }

    redrawRef.current = (previous) => {
      accentRgb = hexToRgb(signalRef.current.accent ?? '#6ae1ff')
      if (previous !== signalRef.current.phase) phaseStarted = performance.now()
      locateFocus()
      glowDirty = true
      if (reduced) draw(performance.now(), false)
    }

    resize()
    const activityTarget = host.querySelector<HTMLElement>('[data-advisor-chat]') ?? host
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncLoop()
    }, { threshold: 0.02 })
    observer.observe(activityTarget)
    const resizeObserver = new ResizeObserver(scheduleResize)
    resizeObserver.observe(host)
    document.addEventListener('visibilitychange', onVisibilityChange)
    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('pointerleave', onPointerLeave, { passive: true })
    motionQuery.addEventListener('change', onMotionChange)
    finePointerQuery.addEventListener('change', onFinePointerChange)
    syncLoop()

    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(frameId)
      cancelAnimationFrame(resizeFrameId)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      motionQuery.removeEventListener('change', onMotionChange)
      finePointerQuery.removeEventListener('change', onFinePointerChange)
      redrawRef.current = null
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
}
