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
// ('my-algorithm-audio') + localStorage. The audio toggle only renders on
// the instance that passes `showAudioToggle`; other instances follow.
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
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(AUDIO_STORAGE_KEY) === '1'
  } catch {
    return false
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

type Note = {
  freq: number
  type: OscillatorType
  durMs: number
  gapMs: number
  gain: number
}

type BeepProfile = {
  notes: Note[]
  vibratoHz?: number
  vibratoCents?: number
  pauseMs: number
}

// Per-variant beep sequences. Verbatim from the brief:
//   scan : "boop-a-doo-doot, beep-beep-beep, doot" — short cluster + 3
//          quick beeps + 1 long doot. Hungry empty scan.
//   chewing : "bideet boop, bideet boop" — happy chirping while working.
//   hill : a slowed, sparser, forlorn echo of the scan pattern.
const BEEP_PROFILES: Record<SceneVariant, BeepProfile> = {
  scan: {
    notes: [
      { freq: 280, type: 'sine', durMs: 100, gapMs: 30, gain: 0.075 },
      { freq: 360, type: 'sine', durMs: 70, gapMs: 30, gain: 0.065 },
      { freq: 310, type: 'sine', durMs: 90, gapMs: 30, gain: 0.075 },
      { freq: 240, type: 'sine', durMs: 200, gapMs: 230, gain: 0.09 },
      { freq: 380, type: 'sine', durMs: 60, gapMs: 70, gain: 0.06 },
      { freq: 380, type: 'sine', durMs: 60, gapMs: 70, gain: 0.06 },
      { freq: 380, type: 'sine', durMs: 60, gapMs: 220, gain: 0.06 },
      { freq: 220, type: 'sine', durMs: 340, gapMs: 0, gain: 0.09 },
    ],
    pauseMs: 700,
  },
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
  hill: {
    notes: [
      { freq: 220, type: 'sine', durMs: 200, gapMs: 260, gain: 0.055 },
      { freq: 198, type: 'sine', durMs: 380, gapMs: 0, gain: 0.07 },
    ],
    pauseMs: 1700,
  },
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
    const gain = ctx.createGain()
    const dur = note.durMs / 1000
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

// Build the sensor bot mesh used in every variant. The bot is a small dark
// sphere body with a short stalk and a "head" capped by a glowing red
// sensor disc. A thin emissive orange wire is visible through the body,
// representing the algorithm running inside.
function buildBot(): {
  group: THREE.Group
  body: THREE.Mesh
  head: THREE.Mesh
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

  // Head — WHITE sphere; sensor + halo + trim are parented to the head so
  // head.rotation.y physically sweeps the eye. Higher mesh resolution +
  // lower roughness + higher metalness for crisper highlights — the
  // previous matte finish read as "cartoony soft."
  const headGeom = new THREE.SphereGeometry(0.22, 48, 48)
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xf2f0ea,
    emissive: 0x080808,
    emissiveIntensity: 0.04,
    roughness: 0.32,
    metalness: 0.35,
  })
  const head = new THREE.Mesh(headGeom, headMat)
  head.position.y = 1.52
  head.scale.set(1.0, 0.9, 1.0)
  group.add(head)
  disposables.push(headGeom, headMat)

  // Sensor halo — soft red glow behind the disc (additive). Parented to
  // head so it sweeps with the eye.
  const haloGeom = new THREE.CircleGeometry(0.16, 32)
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xff4050,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    depthWrite: false,
  })
  const halo = new THREE.Mesh(haloGeom, haloMat)
  halo.position.set(0, 0, 0.207)
  head.add(halo)
  disposables.push(haloGeom, haloMat)

  // Sensor — red emissive disc, the eye. Parented to head.
  const sensorGeom = new THREE.CircleGeometry(0.085, 32)
  const sensorMat = new THREE.MeshBasicMaterial({
    color: 0xff2030,
    toneMapped: false,
    transparent: true,
    opacity: 1,
  })
  const sensor = new THREE.Mesh(sensorGeom, sensorMat)
  sensor.position.set(0, 0, 0.218)
  head.add(sensor)
  disposables.push(sensorGeom, sensorMat)

  // Black trim ring around the sensor — the "iris" outline from the hero
  // pixel-art reference. Parented to head; in front of the sensor disc.
  const trimGeom = new THREE.RingGeometry(0.083, 0.105, 48)
  const trimMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    toneMapped: false,
  })
  const trim = new THREE.Mesh(trimGeom, trimMat)
  trim.position.set(0, 0, 0.219)
  head.add(trim)
  disposables.push(trimGeom, trimMat)

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
    sensor: halo, // expose halo as the "sensor" for animation pulsing
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
  const [isVisible, setIsVisible] = useState(false)
  const audioRef = useRef(false)
  const isVisibleRef = useRef(false)
  const variantRef = useRef<SceneVariant>(variant)

  // Hydrate audio pref from localStorage + cross-instance events
  useEffect(() => {
    audioRef.current = readAudioPref()
    setAudioEnabled(audioRef.current)
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
    isVisibleRef.current = isVisible
    variantRef.current = variant
  }, [audioEnabled, isVisible, variant])

  // Beep loop for THIS scene's variant. Runs only when audio is enabled
  // AND the scene is in the viewport. Uses the shared module-level engine
  // so all three instances share one AudioContext (the toggle gesture
  // resumes it once and all three become audible).
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!audioEnabled) return

    const e = ensureEngine()
    if (!e) return
    if (e.ctx.state === 'suspended') {
      e.ctx.resume().catch(() => undefined)
    }

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const tick = () => {
      if (cancelled || !audioRef.current) return
      const profile = BEEP_PROFILES[variantRef.current]
      if (isVisibleRef.current) {
        const now = e.ctx.currentTime
        playSequence(e.ctx, e.masterGain, profile, now + 0.02)
      }
      timer = setTimeout(tick, getSequenceDurationMs(profile))
    }
    tick()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
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
    } else {
      scene.add(new THREE.AmbientLight(0xffffff, 0.18))
      const cool = new THREE.PointLight(0x60a8ff, 0.8, 14)
      cool.position.set(-3, 4, 3)
      scene.add(cool)
      const magenta = new THREE.PointLight(0xc04098, 0.7, 12)
      magenta.position.set(3, 1.5, -2)
      scene.add(magenta)
      if (variant === 'hill') {
        cool.intensity = 0.4
        magenta.intensity = 0.3
      }
    }

    // Neon grid floor — cyberpunk Netrunner signature
    const grid = new THREE.GridHelper(
      40,
      40,
      variant === 'chewing' ? 0xff5040 : 0x40e0d0,
      variant === 'chewing' ? 0x803020 : 0x4a2a8a,
    )
    const gridMat = grid.material as THREE.LineBasicMaterial
    gridMat.transparent = true
    gridMat.opacity = variant === 'hill' ? 0.18 : 0.35
    grid.position.y = 0
    scene.add(grid)

    // Subtle volumetric haze plane (large fog billboard)
    const hazeGeom = new THREE.PlaneGeometry(60, 30)
    const hazeMat = new THREE.MeshBasicMaterial({
      color: variant === 'chewing' ? 0x301010 : 0x100820,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })
    const haze = new THREE.Mesh(hazeGeom, hazeMat)
    haze.position.set(0, 3, -8)
    scene.add(haze)

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

      // Halo pulse — different rhythm per variant. (The red sensor disc
      // itself stays a stable saturated red so the eye reads cleanly; the
      // halo is what pulses.)
      let haloPulse: number
      if (variant === 'chewing') {
        haloPulse = 0.85 + Math.sin(elapsed * 8) * 0.15
      } else if (variant === 'hill') {
        // Erratic flicker — slow base pulse + fast jitter, sometimes dips
        // near zero. Reads as "the eye is failing but won't shut off."
        haloPulse = Math.max(
          0.1,
          0.35 + Math.sin(elapsed * 1.8) * 0.18 + Math.sin(elapsed * 17) * 0.08,
        )
      } else {
        haloPulse = 0.5 + Math.sin(elapsed * 2.5) * 0.25
      }
      const haloMat = bot.sensor.material as THREE.MeshBasicMaterial
      haloMat.opacity = Math.min(1, haloPulse)
      bot.sensor.scale.setScalar(0.85 + haloPulse * 0.4)

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
        // Mirror to React state so the audio useEffect can gate playback
        // per-instance (only the on-screen scene makes sound).
        setIsVisible(nowVisible)
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
              ? 'radial-gradient(ellipse 70% 60% at 50% 55%, #6a3818 0%, #3a1c0a 45%, #1a0a04 90%, #08040a 100%)'
              : variant === 'hill'
                ? 'linear-gradient(180deg, #02040a 0%, #060616 55%, #030308 100%)'
                : 'linear-gradient(180deg, #0a0418 0%, #1a0a35 55%, #08081a 100%)',
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

      {/* Audio toggle — only on first instance */}
      {showAudioToggle && (
        <button
          type="button"
          onClick={handleToggleAudio}
          className="absolute top-3 right-4 z-20 rounded-full border border-cyan-300/30 bg-black/50 px-3 py-1 font-mono text-[10px] tracking-widest uppercase text-cyan-100 hover:border-cyan-200 hover:bg-cyan-400/10 transition-colors backdrop-blur-sm"
          aria-pressed={audioEnabled}
        >
          {audioEnabled ? 'AUDIO · ON' : 'AUDIO · OFF'}
        </button>
      )}

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
