'use client'

import { useEffect, useRef } from 'react'
import type { AdvisorSignal } from './advisor-types'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  homeX: number
  homeY: number
  seed: number
  lane: number
  size: number
}

const TAU = Math.PI * 2
const SIGNAL = 'rgba(132, 229, 255, 0.42)'
const SIGNAL_SOFT = 'rgba(132, 229, 255, 0.17)'

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
  const redrawRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    signalRef.current = signal
    redrawRef.current?.()
  }, [signal])

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !host || !context) return

    const ctx = context
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = motionQuery.matches
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let visible = true
    let disposed = false
    let running = false
    let frameId = 0
    let resizeFrameId = 0
    let previousTime = 0
    let resolvedMix = signalRef.current.phase === 'resolved' ? 1 : 0
    let glow: CanvasGradient | null = null
    let glowDirty = true
    let accentRgb = hexToRgb(signalRef.current.accent ?? '#6ae1ff')
    let accentStroke = `rgba(${accentRgb}, 0.45)`

    const buildParticles = () => {
      const count = width < 640 ? 88 : Math.min(168, Math.round(width / 8.5))
      particles = new Array<Particle>(count)
      for (let index = 0; index < count; index++) {
        const x = hash(index, 1) * width
        const y = hash(index, 2) * height
        const lane = index % 9
        particles[index] = {
          x,
          y,
          vx: (hash(index, 3) - 0.5) * 5,
          vy: (hash(index, 4) - 0.5) * 4,
          homeX: hash(index, 5),
          homeY: hash(index, 6),
          seed: hash(index, 7) * TAU,
          lane,
          size: 0.65 + hash(index, 8) * 1.15,
        }
      }
    }

    const refreshGlow = () => {
      if (!glowDirty) return
      glowDirty = false
      const centerX = width * 0.72
      const centerY = height * 0.43
      glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(160, width * 0.34))
      glow.addColorStop(0, `rgba(${accentRgb}, 0.19)`)
      glow.addColorStop(0.24, `rgba(${accentRgb}, 0.075)`)
      glow.addColorStop(1, `rgba(${accentRgb}, 0)`)
    }

    const draw = (timeMs: number, advance: boolean) => {
      if (!width || !height) return
      const time = timeMs / 1000
      const rawDelta = previousTime ? time - previousTime : 1 / 60
      const dt = Math.min(0.034, Math.max(0.001, rawDelta))
      previousTime = time
      const phase = reduced ? 'resolved' : signalRef.current.phase
      const resolveTarget = phase === 'resolved' ? 1 : 0
      resolvedMix += (resolveTarget - resolvedMix) * Math.min(1, dt * 2.4)

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

      ctx.lineCap = 'round'
      ctx.lineWidth = 1
      ctx.strokeStyle = SIGNAL_SOFT
      ctx.beginPath()
      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        const laneY = height * (0.18 + particle.lane * 0.072)
        const focusX = width * 0.72
        const focusY = height * 0.43
        let targetX = particle.x
        let targetY = particle.y
        let pull = 0
        let flow = 0

        if (phase === 'idle') {
          targetY = particle.homeY * height + Math.sin(time * 0.18 + particle.seed) * 18
          pull = 0.035
          flow = 2.5
        } else if (phase === 'listening') {
          targetY = laneY + Math.sin(time * 0.32 + particle.seed) * 8
          pull = 0.12
          flow = 5
        } else if (phase === 'thinking') {
          targetY = laneY + Math.sin(time * 0.7 + particle.seed) * 4
          pull = 0.2
          flow = 24
        } else {
          const progress = 0.08 + particle.homeX * 0.9
          targetX = width * (0.06 + progress * 0.82)
          targetY = laneY + (focusY - laneY) * Math.pow(progress, 1.7)
          if (particle.lane === 4) targetY = focusY
          if (particle.homeX > 0.91) {
            targetX = focusX + (particle.homeX - 0.95) * width * 0.22
            targetY = focusY + (particle.lane - 4) * 1.7
          }
          pull = 0.28
        }

        if (advance) {
          particle.vx += (targetX - particle.x) * pull * dt
          particle.vy += (targetY - particle.y) * pull * dt
          particle.vx += flow * dt
          particle.vx *= Math.pow(0.91, dt * 60)
          particle.vy *= Math.pow(0.88, dt * 60)
          particle.x += particle.vx * dt * 60
          particle.y += particle.vy * dt * 60

          if (phase !== 'resolved' && particle.x > width + 16) particle.x = -16
          if (particle.x < -24) particle.x = width + 16
          if (particle.y < -20) particle.y = height + 12
          if (particle.y > height + 20) particle.y = -12
        }

        const stroke = phase === 'thinking' ? 5.5 : 2.5 + particle.size
        ctx.moveTo(particle.x - stroke, particle.y)
        ctx.lineTo(particle.x + stroke, particle.y)
      }
      ctx.stroke()

      ctx.fillStyle = SIGNAL
      ctx.beginPath()
      for (let index = 0; index < particles.length; index += 4) {
        const particle = particles[index]
        ctx.moveTo(particle.x + particle.size, particle.y)
        ctx.arc(particle.x, particle.y, particle.size, 0, TAU)
      }
      ctx.fill()

      if (resolvedMix > 0.02) {
        ctx.globalAlpha = resolvedMix
        ctx.strokeStyle = accentStroke
        ctx.lineWidth = 1.25
        ctx.beginPath()
        ctx.moveTo(width * 0.72 - 16, height * 0.43)
        ctx.lineTo(width * 0.72 + 16, height * 0.43)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
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
      glowDirty = true
      buildParticles()
      if (reduced) {
        resolvedMix = 1
        for (let index = 0; index < particles.length; index++) {
          const particle = particles[index]
          const progress = 0.08 + particle.homeX * 0.9
          const laneY = height * (0.18 + particle.lane * 0.072)
          particle.x = width * (0.06 + progress * 0.82)
          particle.y = laneY + (height * 0.43 - laneY) * Math.pow(progress, 1.7)
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
    const onVisibilityChange = () => syncLoop()

    redrawRef.current = () => {
      accentRgb = hexToRgb(signalRef.current.accent ?? '#6ae1ff')
      accentStroke = `rgba(${accentRgb}, 0.45)`
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
    motionQuery.addEventListener('change', onMotionChange)
    syncLoop()

    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(frameId)
      cancelAnimationFrame(resizeFrameId)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionChange)
      redrawRef.current = null
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
}
