'use client'

// SensorBotScene
// --------------
// Interactive 3D scene used in the My Algorithm post. One component renders
// three different scene variants: a wasteland scan loop ('scan'), a
// "chewing" state where the bot consumes the phrase "I only exist in
// combat" ('chewing'), and the closing hungry-ghost solitude scene
// ('hill'). Shared bot mesh, per-variant camera/lighting/environment.
//
// Audio is coordinated across instances via a window-scoped custom event
// ('my-algorithm-audio') + localStorage. Audio autoplays by default; each
// instance renders its own mute/unmute button.
//
// Visual stack is raw three.js (matches the pattern in BrainMap3D — fiber
// not installed). Animation loop pauses via IntersectionObserver when the
// canvas leaves the viewport.

import { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'

export type SceneVariant = 'scan' | 'chewing' | 'hill'

export type SensorBotSceneProps = {
  variant: SceneVariant
  showAudioToggle?: boolean
}

const AUDIO_EVENT = 'my-algorithm-audio'
const AUDIO_STORAGE_KEY = 'my-algorithm-audio-enabled'

type AudioToggleEvent = CustomEvent<{ enabled: boolean }>

function readAudioPref(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const val = window.localStorage.getItem(AUDIO_STORAGE_KEY)
    // Default to enabled (autoplay) if user has never toggled
    if (val === null) return true
    return val === '1'
  } catch {
    return true
  }
}

function writeAudioPref(enabled: boolean) {
  try {
    window.localStorage.setItem(AUDIO_STORAGE_KEY, enabled ? '1' : '0')
  } catch {
    // localStorage may throw in private mode — non-fatal
  }
}

// ─── Shared audio engine ──────────────────────────────────────────────────
// All three scenes share one AudioContext so that resuming on the toggle
// click (the user gesture) unlocks playback for every instance, not just
// the one that owns the button. Each scene's audio is gated by its own
// IntersectionObserver — only the visible scene makes sound.

type Engine = { ctx: AudioContext; masterGain: GainNode }
let engine: Engine | null = null
let autoplayListenerAttached = false

function ensureEngine(): Engine | null {
  if (engine) return engine
  if (typeof window === 'undefined') return null
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) return null
  const ctx = new Ctor()
  const masterGain = ctx.createGain()
  masterGain.gain.value = 0.7
  masterGain.connect(ctx.destination)
  engine = { ctx, masterGain }
  return engine
}

// Eagerly resume the AudioContext on the very first user interaction so
// audio starts playing as soon as the user scrolls or clicks anywhere on
// the page — no need to find and press the audio button.
function attachAutoplayResume() {
  if (autoplayListenerAttached) return
  if (typeof window === 'undefined') return
  autoplayListenerAttached = true
  const resume = () => {
    const e = ensureEngine()
    if (e && e.ctx.state === 'suspended') {
      e.ctx.resume().catch(() => undefined)
    }
    // Remove all listeners after first successful resume
    for (const evt of ['scroll', 'click', 'touchstart', 'keydown']) {
      window.removeEventListener(evt, resume, true)
    }
  }
  for (const evt of ['scroll', 'click', 'touchstart', 'keydown']) {
    window.addEventListener(evt, resume, { capture: true, passive: true, once: true })
  }
}

type Note = {
  freq: number
  type: OscillatorType
  durMs: number
  gapMs: number
  gain: number
  // Optional target frequency at end of note — slides from `freq` to
  // `pitchBend` over `durMs`. Used on long notes for the "reaching and
  // falling back" hungry-yearning quality.
  pitchBend?: number
}

type BeepProfile = {
  notes: Note[]
  vibratoHz?: number
  vibratoCents?: number
  pauseMs: number
}

// Per-variant beep sequences.
//   scan / hill : "boop-a-doo-doot, beep-beep-beep, doot" — IDENTICAL
//     profile shared between the bookend scenes so the audio enacts the
//     post's structure (hungry → happy → hungry). Triangle wave for a
//     sharper hungry edge; pitch-bent long notes for the reaching-and-
//     falling-back quality.
//   chewing : "bideet boop, bideet boop" — happy chirping with vibrato.
// Scanner-sweep pattern: a row of even short "do" ticks like a radar,
// followed by a longer, longing descending tone before the loop. Reads
// as endless searching with a yearning final note — the hungry-ghost
// audio signature shared between the scan and hill scenes. Pitches
// nudged up roughly a third over the prior tuning for a brighter,
// hungrier scan-line feel.
const HUNGRY_PROFILE: BeepProfile = {
  notes: [
    { freq: 560, type: 'sine', durMs: 85, gapMs: 110, gain: 0.075 },
    { freq: 560, type: 'sine', durMs: 85, gapMs: 110, gain: 0.075 },
    { freq: 560, type: 'sine', durMs: 85, gapMs: 110, gain: 0.075 },
    { freq: 560, type: 'sine', durMs: 85, gapMs: 110, gain: 0.075 },
    { freq: 560, type: 'sine', durMs: 85, gapMs: 280, gain: 0.075 },
    // The longing tail: a long descending tone that decays from the
    // tick frequency down past the floor before the cycle repeats.
    { freq: 480, type: 'sine', durMs: 720, gapMs: 0, gain: 0.095, pitchBend: 280 },
  ],
  pauseMs: 850,
}

const BEEP_PROFILES: Record<SceneVariant, BeepProfile> = {
  scan: HUNGRY_PROFILE,
  chewing: {
    notes: [
      { freq: 720, type: 'triangle', durMs: 50, gapMs: 25, gain: 0.06 },
      { freq: 540, type: 'triangle', durMs: 55, gapMs: 80, gain: 0.06 },
      { freq: 620, type: 'sine', durMs: 200, gapMs: 140, gain: 0.07 },
      { freq: 720, type: 'triangle', durMs: 50, gapMs: 25, gain: 0.06 },
      { freq: 540, type: 'triangle', durMs: 55, gapMs: 80, gain: 0.06 },
      { freq: 620, type: 'sine', durMs: 220, gapMs: 0, gain: 0.07 },
    ],
    vibratoHz: 5,
    vibratoCents: 12,
    pauseMs: 240,
  },
  hill: HUNGRY_PROFILE,
}

function getSequenceDurationMs(profile: BeepProfile): number {
  let total = 0
  for (const n of profile.notes) total += n.durMs + n.gapMs
  return total + profile.pauseMs
}

function playSequence(
  ctx: AudioContext,
  dest: AudioNode,
  profile: BeepProfile,
  startSec: number,
) {
  let t = startSec
  for (const note of profile.notes) {
    const osc = ctx.createOscillator()
    osc.type = note.type
    osc.frequency.setValueAtTime(note.freq, t)
    const dur = note.durMs / 1000
    // Pitch bend: slide from note.freq to note.pitchBend over the note's
    // duration. Used on long notes for hungry "reaching and falling back."
    if (note.pitchBend !== undefined) {
      osc.frequency.linearRampToValueAtTime(note.pitchBend, t + dur)
    }
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(note.gain, t + 0.012)
    gain.gain.setValueAtTime(note.gain, t + dur - 0.02)
    gain.gain.linearRampToValueAtTime(0, t + dur)

    if (profile.vibratoHz && profile.vibratoCents) {
      const lfo = ctx.createOscillator()
      lfo.frequency.value = profile.vibratoHz
      const lfoGain = ctx.createGain()
      const depthHz =
        note.freq * (Math.pow(2, profile.vibratoCents / 1200) - 1)
      lfoGain.gain.value = depthHz
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start(t)
      lfo.stop(t + dur)
    }

    osc.connect(gain)
    gain.connect(dest)
    osc.start(t)
    osc.stop(t + dur + 0.02)
    t += (note.durMs + note.gapMs) / 1000
  }
}

// Smoothstep easing — used on the scroll-derived proximity so the
// crossfade between scenes is perceptually smooth instead of linear.
function smoothstep(x: number): number {
  const t = Math.max(0, Math.min(1, x))
  return t * t * (3 - 2 * t)
}

// Build the sensor bot mesh used in every variant. The bot is a small dark
// sphere body with a short stalk and a "head" capped by a glowing red
// sensor disc. A thin emissive orange wire is visible through the body,
// representing the algorithm running inside.
function buildBot(): {
  group: THREE.Group
  body: THREE.Mesh
  head: THREE.Mesh
  eye: THREE.Mesh
  halo: THREE.Mesh
  sensor: THREE.Mesh
  wire: THREE.Mesh
  dispose: () => void
} {
  const group = new THREE.Group()
  const disposables: Array<{ dispose: () => void }> = []

  // Body — dark gunmetal sphere
  const bodyGeom = new THREE.SphereGeometry(0.55, 32, 32)
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    emissive: 0x0a0a18,
    roughness: 0.7,
    metalness: 0.4,
  })
  const body = new THREE.Mesh(bodyGeom, bodyMat)
  body.position.y = 0.55
  group.add(body)
  disposables.push(bodyGeom, bodyMat)

  // Stalk — thin neck cylinder
  const stalkGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.35, 12)
  const stalkMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a35,
    roughness: 0.4,
    metalness: 0.6,
  })
  const stalk = new THREE.Mesh(stalkGeom, stalkMat)
  stalk.position.y = 1.28
  group.add(stalk)
  disposables.push(stalkGeom, stalkMat)

  // Head — WHITE polished sphere. Perfectly spherical (no y-squash) so
  // the eye assembly reads cleanly from any rotation angle.
  const headGeom = new THREE.SphereGeometry(0.22, 56, 56)
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xf4f2ec,
    emissive: 0x0c0c0c,
    emissiveIntensity: 0.05,
    roughness: 0.28,
    metalness: 0.42,
  })
  const head = new THREE.Mesh(headGeom, headMat)
  head.position.y = 1.52
  head.scale.set(1, 1, 1)
  group.add(head)
  disposables.push(headGeom, headMat)

  // ── GLaDOS-style optical aperture ───────────────────────────────────
  // Conceptual fix after five failed attempts: the eye is an APERTURE
  // ASSEMBLY mounted ON the head's front face — not a hole drilled into
  // it. White dominates; black is thin SEAMS between concentric panels;
  // the red optic is small, intense, at the focal center.
  //
  //   • Outer panel  → large white disc (the assembly face)
  //   • Border seam  → thin black ring at the outer rim
  //   • Middle panel → smaller white disc, stacked forward in z
  //   • Middle seam  → thin black ring at its outer edge
  //   • Inner panel  → smallest white disc
  //   • Inner seam   → thin black ring at its outer edge
  //   • Halo         → small additive red glow behind the eye
  //   • Eye          → small bright red optic at dead center
  //
  // The eye fades in/out via the animation loop ("endless longing and
  // scanning"). The halo tracks with it.
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0xf6f4ee,
    emissive: 0x0a0a0a,
    emissiveIntensity: 0.04,
    roughness: 0.25,
    metalness: 0.5,
  })
  const seamMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    toneMapped: false,
  })

  const outerPanelGeom = new THREE.CircleGeometry(0.128, 64)
  const outerPanel = new THREE.Mesh(outerPanelGeom, panelMat)
  outerPanel.position.set(0, 0, 0.211)
  head.add(outerPanel)
  disposables.push(outerPanelGeom)

  const borderSeamGeom = new THREE.RingGeometry(0.124, 0.132, 64)
  const borderSeam = new THREE.Mesh(borderSeamGeom, seamMat)
  borderSeam.position.set(0, 0, 0.2115)
  head.add(borderSeam)
  disposables.push(borderSeamGeom)

  const midPanelGeom = new THREE.CircleGeometry(0.088, 64)
  const midPanel = new THREE.Mesh(midPanelGeom, panelMat)
  midPanel.position.set(0, 0, 0.213)
  head.add(midPanel)
  disposables.push(midPanelGeom)

  const midSeamGeom = new THREE.RingGeometry(0.084, 0.091, 64)
  const midSeam = new THREE.Mesh(midSeamGeom, seamMat)
  midSeam.position.set(0, 0, 0.2135)
  head.add(midSeam)
  disposables.push(midSeamGeom)

  const innerPanelGeom = new THREE.CircleGeometry(0.052, 56)
  const innerPanel = new THREE.Mesh(innerPanelGeom, panelMat)
  innerPanel.position.set(0, 0, 0.215)
  head.add(innerPanel)
  disposables.push(innerPanelGeom)

  const innerSeamGeom = new THREE.RingGeometry(0.049, 0.055, 56)
  const innerSeam = new THREE.Mesh(innerSeamGeom, seamMat)
  innerSeam.position.set(0, 0, 0.2155)
  head.add(innerSeam)
  disposables.push(innerSeamGeom)

  const haloGeom = new THREE.CircleGeometry(0.036, 40)
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xff3848,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    depthWrite: false,
  })
  const halo = new THREE.Mesh(haloGeom, haloMat)
  halo.position.set(0, 0, 0.217)
  head.add(halo)
  disposables.push(haloGeom, haloMat)

  const eyeGeom = new THREE.CircleGeometry(0.019, 40)
  const eyeMat = new THREE.MeshBasicMaterial({
    color: 0xff1024,
    toneMapped: false,
    transparent: true,
    opacity: 1,
  })
  const eye = new THREE.Mesh(eyeGeom, eyeMat)
  eye.position.set(0, 0, 0.218)
  head.add(eye)
  disposables.push(eyeGeom, eyeMat)

  // Alias `sensor` to `halo` for backward-compat with code paths that
  // still reference bot.sensor (the previous return shape).
  const sensor = halo

  // Orange wire — a curved line that goes through the body. Drawn as a
  // TubeGeometry on a curved path for visibility from any angle.
  const wireCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.15, 0),
    new THREE.Vector3(-0.15, 0.55, 0.1),
    new THREE.Vector3(0.1, 0.85, -0.1),
    new THREE.Vector3(0.3, 1.15, 0.05),
    new THREE.Vector3(0.05, 1.45, 0),
  ])
  const wireGeom = new THREE.TubeGeometry(wireCurve, 64, 0.025, 8, false)
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xff7a1f,
    transparent: true,
    opacity: 0.95,
    toneMapped: false,
  })
  const wire = new THREE.Mesh(wireGeom, wireMat)
  group.add(wire)
  disposables.push(wireGeom, wireMat)

  return {
    group,
    body,
    head,
    eye,         // the small bright red optic
    halo,       // the additive red glow behind the eye
    sensor,    // alias of halo for backward-compat with older animation code
    wire,
    dispose: () => {
      for (const d of disposables) d.dispose()
    },
  }
}

export default function SensorBotScene({
  variant,
  showAudioToggle = false,
}: SensorBotSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)
  const audioRef = useRef(false)
  const variantRef = useRef<SceneVariant>(variant)

  // Hydrate audio pref from localStorage + cross-instance events.
  // Also eagerly attach the autoplay-resume listener so the AudioContext
  // unlocks on the very first user interaction (scroll, click, etc.).
  useEffect(() => {
    audioRef.current = readAudioPref()
    setAudioEnabled(audioRef.current)
    // Eagerly create the engine + attach interaction listeners so audio
    // starts as soon as the user scrolls or interacts with the page.
    if (audioRef.current) {
      ensureEngine()
      attachAutoplayResume()
    }
    const onEvt = (e: Event) => {
      const detail = (e as AudioToggleEvent).detail
      if (!detail) return
      audioRef.current = detail.enabled
      setAudioEnabled(detail.enabled)
    }
    window.addEventListener(AUDIO_EVENT, onEvt)
    return () => window.removeEventListener(AUDIO_EVENT, onEvt)
  }, [])

  useEffect(() => {
    audioRef.current = audioEnabled
    variantRef.current = variant
  }, [audioEnabled, variant])

  // Per-scene audio: one GainNode per scene, continuous beep loop while
  // audio is enabled. Scroll-driven proximity (smoothstep on distance to
  // viewport center) drives sceneGain.gain so scenes crossfade smoothly
  // as the user scrolls instead of cutting at viewport boundaries.
  // All three scenes share one AudioContext via the module-level engine.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!audioEnabled) return

    const e = ensureEngine()
    if (!e) return
    if (e.ctx.state === 'suspended') {
      e.ctx.resume().catch(() => undefined)
    }

    // Per-scene gain — starts at 0, ramped up/down by scroll listener.
    const sceneGain = e.ctx.createGain()
    sceneGain.gain.value = 0
    sceneGain.connect(e.masterGain)

    // Scroll-driven crossfade. Proximity is computed from this scene's
    // distance to viewport center, normalized by a "fade window" of
    // ~75% of viewport height. smoothstep eases the curve. setTargetAtTime
    // produces a perceptually smooth exponential ramp instead of jumps.
    const TIME_CONSTANT = 0.08
    const updateProximity = () => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const sceneCenter = rect.top + rect.height / 2
      const viewportCenter = window.innerHeight / 2
      const distance = Math.abs(sceneCenter - viewportCenter)
      const fadeWindow = window.innerHeight * 0.75
      const raw = 1 - distance / fadeWindow
      const target = smoothstep(raw)
      sceneGain.gain.setTargetAtTime(target, e.ctx.currentTime, TIME_CONSTANT)
    }
    updateProximity()
    window.addEventListener('scroll', updateProximity, { passive: true })
    window.addEventListener('resize', updateProximity, { passive: true })

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    const tick = () => {
      if (cancelled || !audioRef.current) return
      if (e.ctx.state === 'suspended') {
        timer = setTimeout(tick, getSequenceDurationMs(BEEP_PROFILES[variantRef.current]))
        return
      }
      const profile = BEEP_PROFILES[variantRef.current]
      const now = e.ctx.currentTime
      playSequence(e.ctx, sceneGain, profile, now + 0.02)
      timer = setTimeout(tick, getSequenceDurationMs(profile))
    }
    tick()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      window.removeEventListener('scroll', updateProximity)
      window.removeEventListener('resize', updateProximity)
      // Quick fade-out so the disconnect doesn't click
      sceneGain.gain.setTargetAtTime(0, e.ctx.currentTime, 0.02)
      setTimeout(() => {
        try {
          sceneGain.disconnect()
        } catch {
          // already disconnected
        }
      }, 120)
    }
  }, [audioEnabled, variant])

  const handleToggleAudio = useCallback(() => {
    const next = !audioRef.current
    audioRef.current = next
    setAudioEnabled(next)
    writeAudioPref(next)
    // Initialize + resume the shared engine inside the click handler so
    // the user-gesture autoplay policy is satisfied for every scene.
    if (next) {
      const e = ensureEngine()
      if (e && e.ctx.state === 'suspended') {
        e.ctx.resume().catch(() => undefined)
      }
    }
    window.dispatchEvent(
      new CustomEvent(AUDIO_EVENT, { detail: { enabled: next } }),
    )
  }, [])

  // Three.js scene lifecycle. Re-runs only if WebGL initialization fails.
  useEffect(() => {
    if (webglFailed) return
    const host = canvasHostRef.current
    const container = containerRef.current
    if (!host || !container) return

    let width = host.clientWidth || 600
    let height = host.clientHeight || 400

    const scene = new THREE.Scene()
    const cameraConfig = getCameraConfig(variant)
    const camera = new THREE.PerspectiveCamera(
      cameraConfig.fov,
      width / height,
      0.1,
      100,
    )
    camera.position.set(...cameraConfig.position)
    camera.lookAt(...cameraConfig.lookAt)

    // Scene-scoped disposables (textures + anything else not caught by
    // scene.traverse cleanup at unmount).
    const sceneDisposables: Array<{ dispose: () => void }> = []

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      setWebglFailed(true)
      return
    }

    // Higher DPR + NoToneMapping + sRGB output for crisper, more saturated
    // rendering. (Default LinearToneMapping was softening the colors and
    // making the bot read as "cartoony and soft" per review.)
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.NoToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    // Per-variant lighting. The bot is only content during chewing — give
    // that variant a noticeably brighter, warmer key light. Scan + hill
    // share a cooler, dimmer palette; hill is dimmer still.
    if (variant === 'chewing') {
      scene.add(new THREE.AmbientLight(0xfff5e0, 0.45))
      const key = new THREE.PointLight(0xffd680, 1.7, 14)
      key.position.set(1, 3, 3)
      scene.add(key)
      const warm = new THREE.PointLight(0xff9540, 1.2, 11)
      warm.position.set(-2, 1.5, 2)
      scene.add(warm)
      const accent = new THREE.PointLight(0x60ffd0, 0.5, 8)
      accent.position.set(0, 0.5, 1.2)
      scene.add(accent)
    } else if (variant === 'hill') {
      // Twilight/dusk palette for the desolate hill — cooler but
      // significantly brighter than the prior near-black render.
      scene.add(new THREE.AmbientLight(0xffd0a0, 0.35))
      const sky = new THREE.PointLight(0x8a8aff, 1.0, 18)
      sky.position.set(-3, 6, 4)
      scene.add(sky)
      const horizon = new THREE.PointLight(0xff8060, 0.7, 14)
      horizon.position.set(4, 1.2, -3)
      scene.add(horizon)
    } else {
      // Scan: dusk wasteland — bright enough to see the landscape, with
      // a warm horizon glow + cool zenith.
      scene.add(new THREE.AmbientLight(0xffd8b0, 0.42))
      const sun = new THREE.PointLight(0xffb070, 1.4, 16)
      sun.position.set(5, 4, 2)
      scene.add(sun)
      const sky = new THREE.PointLight(0x70a0ff, 0.9, 14)
      sky.position.set(-4, 6, 3)
      scene.add(sky)
    }

    // Neon grid floor — cyberpunk-Netrunner sweep signature underneath
    // the landscape. Per-variant tinting reads as the scene's mood.
    const grid = new THREE.GridHelper(
      40,
      40,
      variant === 'chewing' ? 0xff8050 : variant === 'hill' ? 0x8a8aff : 0x80c8ff,
      variant === 'chewing' ? 0x803020 : variant === 'hill' ? 0x3a3a78 : 0x4a3a78,
    )
    const gridMat = grid.material as THREE.LineBasicMaterial
    gridMat.transparent = true
    gridMat.opacity = variant === 'hill' ? 0.28 : 0.4
    grid.position.y = 0
    scene.add(grid)

    // Volumetric haze billboard — brighter per-variant tones so the
    // background no longer reads as near-black.
    const hazeGeom = new THREE.PlaneGeometry(60, 30)
    const hazeMat = new THREE.MeshBasicMaterial({
      color:
        variant === 'chewing' ? 0x4a2010 : variant === 'hill' ? 0x2a2a50 : 0x4a3030,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    })
    const haze = new THREE.Mesh(hazeGeom, hazeMat)
    haze.position.set(0, 3, -8)
    scene.add(haze)

    // ── Distant landscape — silhouette mountains across the horizon ──
    // Adds depth and visual interest to scan + hill scenes. Built as a
    // single low-poly Mesh of triangular peaks at varying heights.
    if (variant !== 'chewing') {
      const peakVerts: number[] = []
      const horizonY = 0.05
      const peakZ = -7
      const rangeWidth = 22
      let x = -rangeWidth / 2
      while (x < rangeWidth / 2) {
        const peakWidth = 0.5 + Math.random() * 0.9
        const peakHeight = 0.45 + Math.random() * 1.35
        peakVerts.push(
          x - peakWidth, horizonY, peakZ,
          x + peakWidth, horizonY, peakZ,
          x, horizonY + peakHeight, peakZ,
        )
        x += peakWidth * 1.4
      }
      const mountainGeom = new THREE.BufferGeometry()
      mountainGeom.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(peakVerts, 3),
      )
      mountainGeom.computeVertexNormals()
      const mountainMat = new THREE.MeshBasicMaterial({
        color: variant === 'hill' ? 0x1c1c38 : 0x281a30,
        side: THREE.DoubleSide,
      })
      const mountains = new THREE.Mesh(mountainGeom, mountainMat)
      scene.add(mountains)

      // Mid-distance terrain — a second darker mountain line in front
      // of the far range, creating depth layers.
      const midVerts: number[] = []
      let mx = -10
      while (mx < 10) {
        const w = 0.4 + Math.random() * 0.7
        const h = 0.25 + Math.random() * 0.65
        midVerts.push(
          mx - w, horizonY, peakZ + 2,
          mx + w, horizonY, peakZ + 2,
          mx, horizonY + h, peakZ + 2,
        )
        mx += w * 1.4
      }
      const midGeom = new THREE.BufferGeometry()
      midGeom.setAttribute('position', new THREE.Float32BufferAttribute(midVerts, 3))
      midGeom.computeVertexNormals()
      const midMat = new THREE.MeshBasicMaterial({
        color: variant === 'hill' ? 0x0e0e20 : 0x18101c,
        side: THREE.DoubleSide,
      })
      const midMountains = new THREE.Mesh(midGeom, midMat)
      scene.add(midMountains)

      // Hill variant gets a few dead-tree silhouettes scattered around
      // for forlorn texture.
      if (variant === 'hill') {
        for (let i = 0; i < 5; i++) {
          const tx = -3.5 + Math.random() * 7
          const tz = -2 - Math.random() * 2.5
          const th = 0.35 + Math.random() * 0.35
          const trunkGeom = new THREE.ConeGeometry(0.06, th, 6)
          const trunkMat = new THREE.MeshBasicMaterial({
            color: 0x0a0a16,
          })
          const trunk = new THREE.Mesh(trunkGeom, trunkMat)
          trunk.position.set(tx, -0.18 + th / 2, tz)
          scene.add(trunk)
        }
      }
    }

    // Build the bot
    const bot = buildBot()
    scene.add(bot.group)

    // Variant-specific bot placement
    if (variant === 'hill') {
      // The bot is post-flow: doped-up racehorse after a race. Sits on a
      // small hill, body tilted forward, head drooping, wire dim. The
      // wasteland around is scattered with the remains of everything it
      // has already consumed.
      const hillGeom = new THREE.SphereGeometry(2.4, 28, 28, 0, Math.PI * 2, 0, Math.PI / 2)
      const hillMat = new THREE.MeshStandardMaterial({
        color: 0x080610,
        roughness: 0.95,
        metalness: 0.15,
      })
      const hill = new THREE.Mesh(hillGeom, hillMat)
      hill.position.y = -0.5
      hill.scale.y = 0.42
      scene.add(hill)

      // Bot listed forward (exhausted posture)
      bot.group.position.y = 0.32
      bot.group.position.z = -0.4
      bot.group.rotation.x = 0.18 // slight forward lean
      // Head droops downward slightly — sets a "post-race" posture even
      // before the per-frame sweep kicks in.
      bot.head.rotation.x = 0.35

      // Scattered debris around the hill — small dim cubes / shards of
      // everything the algorithm has already chewed through.
      const debrisGroup = new THREE.Group()
      const DEBRIS_COUNT = 18
      for (let i = 0; i < DEBRIS_COUNT; i++) {
        const dg = new THREE.BoxGeometry(0.05 + Math.random() * 0.08, 0.04, 0.05 + Math.random() * 0.06)
        const dm = new THREE.MeshStandardMaterial({
          color: 0x1a1014,
          emissive: 0x080406,
          roughness: 0.9,
          metalness: 0.3,
        })
        const d = new THREE.Mesh(dg, dm)
        const angle = Math.random() * Math.PI * 2
        const radius = 1.7 + Math.random() * 2.6
        d.position.set(
          Math.cos(angle) * radius,
          -0.18,
          Math.sin(angle) * radius - 0.4,
        )
        d.rotation.set(0, Math.random() * Math.PI, 0)
        debrisGroup.add(d)
      }
      scene.add(debrisGroup)
    }

    if (variant === 'chewing') {
      // Green vertical data bars — equalizer-style readout of the bot
      // processing the target. Sits between the bot and the target cluster.
      const dataBarGroup = new THREE.Group()
      const BAR_COUNT = 10
      for (let i = 0; i < BAR_COUNT; i++) {
        const barGeom = new THREE.PlaneGeometry(0.035, 0.5)
        const barMat = new THREE.MeshBasicMaterial({
          color: 0x4dffb0,
          transparent: true,
          opacity: 0.75,
          toneMapped: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const bar = new THREE.Mesh(barGeom, barMat)
        bar.position.set(-0.45 + i * 0.1, 0.62, 0.6)
        bar.userData = { phase: i * 0.55, freq: 4 + i * 0.35 }
        dataBarGroup.add(bar)
      }
      scene.add(dataBarGroup)
      ;(scene as unknown as { dataBarGroup: THREE.Group }).dataBarGroup = dataBarGroup

      // Bidirectional bitwise streams — small 0/1 sprite swarms flowing
      // left and right across the scene. Two helper canvases for the bit
      // textures.
      const makeBitTexture = (char: string, color: string): THREE.CanvasTexture => {
        const c = document.createElement('canvas')
        c.width = 64
        c.height = 64
        const ctx = c.getContext('2d')!
        ctx.clearRect(0, 0, 64, 64)
        ctx.fillStyle = color
        ctx.font = 'bold 48px ui-monospace, monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(char, 32, 36)
        const tex = new THREE.CanvasTexture(c)
        tex.needsUpdate = true
        return tex
      }
      const tex0 = makeBitTexture('0', '#4dffb0')
      const tex1 = makeBitTexture('1', '#5af0ff')
      sceneDisposables.push(tex0, tex1)
      const bitStreamGroup = new THREE.Group()
      const BIT_COUNT = 28
      for (let i = 0; i < BIT_COUNT; i++) {
        const isOne = Math.random() > 0.5
        const mat = new THREE.SpriteMaterial({
          map: isOne ? tex1 : tex0,
          transparent: true,
          opacity: 0.75,
          toneMapped: false,
          depthWrite: false,
        })
        const sprite = new THREE.Sprite(mat)
        sprite.position.set(
          (Math.random() - 0.5) * 2.4,
          0.4 + Math.random() * 0.9,
          0.3 + Math.random() * 0.5,
        )
        sprite.scale.setScalar(0.09)
        sprite.userData = {
          dir: Math.random() > 0.5 ? 1 : -1,
          speed: 0.4 + Math.random() * 0.9,
        }
        bitStreamGroup.add(sprite)
      }
      scene.add(bitStreamGroup)
      ;(scene as unknown as { bitStreamGroup: THREE.Group }).bitStreamGroup = bitStreamGroup
    }

    // Resize
    const resize = () => {
      if (!host) return
      width = host.clientWidth || 600
      height = host.clientHeight || 400
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // Pointer drag rotation (lightweight — rotates the bot group, not the camera)
    let dragging = false
    let lastX = 0
    let rotY = 0
    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      renderer.domElement.style.cursor = 'grabbing'
      try { renderer.domElement.setPointerCapture(e.pointerId) } catch {}
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      rotY += dx * 0.006
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      renderer.domElement.style.cursor = 'grab'
      try { renderer.domElement.releasePointerCapture(e.pointerId) } catch {}
    }
    renderer.domElement.style.cursor = 'grab'
    renderer.domElement.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    // Animation loop
    let raf = 0
    let animActive = false
    let lastFrameTime = performance.now()
    // Start partway into the sweep cycle so the head is visibly mid-motion
    // when the user first sees the scene (instead of stationary at angle 0).
    let elapsed = variant === 'chewing' ? 0 : Math.PI / 3

    const animate = () => {
      if (!animActive) return
      const now = performance.now()
      const delta = Math.min((now - lastFrameTime) / 1000, 1 / 30)
      lastFrameTime = now
      elapsed += delta

      // Sensor sweep — scan and hill share the SAME canonical motion (Zack:
      // "the same scan from the same position in most of the animations").
      // Only the chewing variant locks the head in place.
      const sweepSpeed = variant === 'chewing' ? 0 : 1.0
      // Wider amplitude (~75°) so the eye visibly sweeps "all the way left
      // to right." Hill matches scan exactly so the same canonical motion
      // reads across the post.
      const sweepAmplitude = variant === 'chewing' ? 0 : 1.3
      const sweep = Math.sin(elapsed * sweepSpeed) * sweepAmplitude
      bot.head.rotation.y = sweep

      // While chewing, jitter the head subtly so it reads as "engaged."
      if (variant === 'chewing') {
        bot.head.position.y = 1.52 + Math.sin(elapsed * 14) * 0.008
        bot.head.rotation.z = Math.sin(elapsed * 9) * 0.02
      } else {
        bot.head.position.y = 1.52
        bot.head.rotation.z = 0
      }

      // GLaDOS optic pulse — the eye fades intensity in/out conveying
      // "endless longing and scanning." The halo behind it tracks with
      // the eye so the glow swells and recedes together. Different
      // rhythms per variant; on hill, the failing-eye flicker stays.
      let eyePulse: number
      if (variant === 'chewing') {
        // Bright, fast, intent — the bot is content / locked on
        eyePulse = 0.85 + Math.sin(elapsed * 8) * 0.15
      } else if (variant === 'hill') {
        // Erratic flicker — slow base + fast jitter, occasional dip.
        // The eye is failing but won't shut off.
        eyePulse = Math.max(
          0.15,
          0.45 + Math.sin(elapsed * 1.5) * 0.25 + Math.sin(elapsed * 14) * 0.08,
        )
      } else {
        // Slow longing scan — long fade in/out, ~2.6s period
        eyePulse = 0.45 + Math.sin(elapsed * 1.2) * 0.5
      }
      eyePulse = Math.min(1, Math.max(0.1, eyePulse))

      // Eye itself: opacity tracks intensity. The red color stays
      // saturated; what changes is how brightly it shows.
      const eyeMat = bot.eye.material as THREE.MeshBasicMaterial
      eyeMat.opacity = 0.65 + eyePulse * 0.35

      // Halo: opacity AND scale track intensity, so the glow swells.
      const haloMat = bot.halo.material as THREE.MeshBasicMaterial
      haloMat.opacity = 0.3 + eyePulse * 0.45
      bot.halo.scale.setScalar(0.8 + eyePulse * 0.45)

      // Wire glow — hot during chewing, faint on hill
      const wireMat = bot.wire.material as THREE.MeshBasicMaterial
      if (variant === 'chewing') {
        wireMat.opacity = 0.9 + Math.sin(elapsed * 6) * 0.1
        wireMat.color.setRGB(1.0, 0.55 + Math.sin(elapsed * 8) * 0.08, 0.14)
      } else if (variant === 'hill') {
        wireMat.opacity = 0.22 + Math.sin(elapsed * 1.0) * 0.06
        wireMat.color.setRGB(0.5, 0.24, 0.07)
      } else {
        wireMat.opacity = 0.55 + Math.sin(elapsed * 2) * 0.1
        wireMat.color.setRGB(0.95, 0.45, 0.08)
      }

      // Bot rotation from drag
      bot.group.rotation.y = rotY

      // Subtle body bob — alive in scan, agitated in chewing, near-still on hill
      if (variant === 'scan') {
        bot.group.position.y = Math.sin(elapsed * 1.5) * 0.03
      } else if (variant === 'chewing') {
        bot.group.position.y = Math.sin(elapsed * 4) * 0.022
      } else {
        bot.group.position.y = 0.3 + Math.sin(elapsed * 0.7) * 0.012
      }

      // Animate the green vertical data bars (chewing only)
      const dataBarGroup = (scene as unknown as { dataBarGroup?: THREE.Group }).dataBarGroup
      if (dataBarGroup) {
        for (const bar of dataBarGroup.children) {
          const phase = (bar.userData.phase as number) ?? 0
          const freq = (bar.userData.freq as number) ?? 4
          const k = Math.abs(Math.sin(elapsed * freq + phase))
          bar.scale.y = 0.2 + k * 1.6
          const mat = (bar as THREE.Mesh).material as THREE.MeshBasicMaterial
          mat.opacity = 0.5 + k * 0.45
        }
      }

      // Animate the bidirectional bit streams (chewing only)
      const bitStreamGroup = (scene as unknown as { bitStreamGroup?: THREE.Group }).bitStreamGroup
      if (bitStreamGroup) {
        for (const sprite of bitStreamGroup.children) {
          const dir = (sprite.userData.dir as number) ?? 1
          const speed = (sprite.userData.speed as number) ?? 1
          sprite.position.x += dir * speed * delta
          if (Math.abs(sprite.position.x) > 1.4) {
            sprite.position.x = -dir * 1.4
            sprite.position.y = 0.4 + Math.random() * 0.9
          }
          const mat = (sprite as THREE.Sprite).material as THREE.SpriteMaterial
          mat.opacity = 0.45 + Math.abs(Math.sin(elapsed * 4 + sprite.position.x * 2)) * 0.45
        }
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nowVisible = entries.some((e) => e.isIntersecting)
        if (nowVisible && !animActive) {
          animActive = true
          lastFrameTime = performance.now()
          animate()
        } else if (!nowVisible && animActive) {
          animActive = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    observer.observe(container)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      ro.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      bot.dispose()
      for (const d of sceneDisposables) d.dispose()
      scene.traverse((n) => {
        const obj = n as THREE.Mesh | THREE.Line | THREE.LineSegments
        const geom = (obj as THREE.Mesh).geometry
        const mat = (obj as THREE.Mesh).material
        if (geom && 'dispose' in geom) geom.dispose()
        if (mat) {
          if (Array.isArray(mat)) {
            for (const m of mat) m.dispose()
          } else if ('dispose' in mat) {
            mat.dispose()
          }
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [variant, webglFailed])

  return (
    <div
      ref={containerRef}
      className="relative w-full my-8 rounded-2xl overflow-hidden border border-cyan-400/15"
      style={{ height: 380 }}
    >
      {/* Background gradient — cyberpunk dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === 'chewing'
              ? 'radial-gradient(ellipse 70% 60% at 50% 55%, #8a4820 0%, #4a2410 45%, #20100a 90%, #0e0808 100%)'
              : variant === 'hill'
                ? 'linear-gradient(180deg, #3a4880 0%, #5a4a90 30%, #6a3c70 60%, #2a1d3a 100%)'
                : 'linear-gradient(180deg, #243870 0%, #604858 40%, #9a6038 70%, #4a2828 100%)',
        }}
      />

      {/* Canvas host */}
      <div ref={canvasHostRef} className="absolute inset-0" />

      {/* CRT scanlines overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,255,200,0.06) 0px, rgba(0,255,200,0.06) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* HUD label */}
      <div className="pointer-events-none absolute top-3 left-4 z-10 font-mono text-[10px] tracking-widest uppercase text-cyan-300/70">
        {variant === 'scan' && 'STATE · SCANNING'}
        {variant === 'chewing' && 'STATE · CHEWING'}
        {variant === 'hill' && 'STATE · IDLE · NO TARGETS'}
      </div>

      {/* No visible-text overlay — per review, the combat phrase belongs in
          the prose only, not in the animation itself. */}

      {/* Drag hint */}
      <div className="pointer-events-none absolute bottom-3 right-4 z-10 font-mono text-[10px] tracking-widest uppercase text-white/40 hidden md:block">
        drag to rotate
      </div>

      {/* Audio mute/unmute button — shown on every instance */}
      <button
        type="button"
        onClick={handleToggleAudio}
        className="absolute top-3 right-4 z-20 rounded-full border border-cyan-300/30 bg-black/50 px-3 py-1 font-mono text-[10px] tracking-widest uppercase text-cyan-100 hover:border-cyan-200 hover:bg-cyan-400/10 transition-colors backdrop-blur-sm"
        aria-pressed={audioEnabled}
      >
        {audioEnabled ? '🔊 MUTE' : '🔇 UNMUTE'}
      </button>

      {webglFailed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <p className="font-mono text-xs text-cyan-200/70">
            3D rendering unavailable.
          </p>
        </div>
      )}

    </div>
  )
}

// Per-variant camera configuration. Tuple types for THREE's setter spread.
function getCameraConfig(variant: SceneVariant): {
  fov: number
  position: [number, number, number]
  lookAt: [number, number, number]
} {
  switch (variant) {
    case 'scan':
      return { fov: 45, position: [2.2, 1.8, 3.5], lookAt: [0, 0.9, 0] }
    case 'chewing':
      return { fov: 38, position: [1.6, 1.4, 2.4], lookAt: [0, 0.9, 0.5] }
    case 'hill':
      return { fov: 52, position: [3.5, 2.2, 4.8], lookAt: [0, 0.6, 0] }
  }
}
