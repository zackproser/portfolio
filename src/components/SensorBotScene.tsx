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
  // head.rotation.y physically sweeps the eye. (Previously the sensor was a
  // sibling on the group and the head spun invisibly.)
  const headGeom = new THREE.SphereGeometry(0.22, 32, 32)
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xe8e6e0,
    emissive: 0x101010,
    emissiveIntensity: 0.08,
    roughness: 0.5,
    metalness: 0.18,
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
  const audioRef = useRef(false)
  const variantRef = useRef<SceneVariant>(variant)
  const isVisibleRef = useRef(false)

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
    variantRef.current = variant
  }, [audioEnabled, variant])

  // Procedural Web Audio API beep loop. Three distinct profiles:
  //   - scan : low hungry pulse (the empty-scan sound)
  //   - chewing: brighter chord with vibrato (the happy-while-working sound)
  //   - hill : same hungry pulse as scan, slightly quieter (the ghost echo)
  // Only the active scene's audio plays — multiple instances each spin up
  // their own AudioContext gated by viewport intersection + the global
  // audio-enabled toggle. AudioContext requires a user gesture, which the
  // toggle click satisfies.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!audioEnabled) return

    type AudioCtxCtor = typeof AudioContext
    const Ctor: AudioCtxCtor | undefined =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: AudioCtxCtor }).webkitAudioContext
    if (!Ctor) return
    const audioCtx = new Ctor()
    // Resume in case it spawned suspended (Safari)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => undefined)
    }

    const masterGain = audioCtx.createGain()
    masterGain.gain.value = 0.7
    masterGain.connect(audioCtx.destination)

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    type BeepProfile = {
      tones: Array<{ freq: number; type: OscillatorType; gain: number }>
      vibratoHz?: number
      vibratoCents?: number
      onMs: number
      offMs: number
    }
    const profiles: Record<SceneVariant, BeepProfile> = {
      // Hungry low pulse — the empty scanner sound
      scan: {
        tones: [{ freq: 360, type: 'sine', gain: 0.09 }],
        onMs: 95,
        offMs: 240,
      },
      // Happy chirping chord — major-third-ish with vibrato
      chewing: {
        tones: [
          { freq: 560, type: 'triangle', gain: 0.06 },
          { freq: 700, type: 'sine', gain: 0.045 },
        ],
        vibratoHz: 7,
        vibratoCents: 22,
        onMs: 75,
        offMs: 95,
      },
      // Same as scan but a hair quieter and slightly slower — the ghost echo
      hill: {
        tones: [{ freq: 360, type: 'sine', gain: 0.07 }],
        onMs: 95,
        offMs: 280,
      },
    }

    const playOne = (profile: BeepProfile, startSec: number) => {
      const dur = profile.onMs / 1000
      for (const tone of profile.tones) {
        const osc = audioCtx.createOscillator()
        osc.type = tone.type
        osc.frequency.setValueAtTime(tone.freq, startSec)
        const gain = audioCtx.createGain()
        gain.gain.setValueAtTime(0, startSec)
        gain.gain.linearRampToValueAtTime(tone.gain, startSec + 0.012)
        gain.gain.setValueAtTime(tone.gain, startSec + dur - 0.03)
        gain.gain.linearRampToValueAtTime(0, startSec + dur)

        if (profile.vibratoHz && profile.vibratoCents) {
          const lfo = audioCtx.createOscillator()
          lfo.frequency.value = profile.vibratoHz
          const lfoGain = audioCtx.createGain()
          // Convert cents to Hz at this frequency
          const depthHz = tone.freq * (Math.pow(2, profile.vibratoCents / 1200) - 1)
          lfoGain.gain.value = depthHz
          lfo.connect(lfoGain)
          lfoGain.connect(osc.frequency)
          lfo.start(startSec)
          lfo.stop(startSec + dur)
        }

        osc.connect(gain)
        gain.connect(masterGain)
        osc.start(startSec)
        osc.stop(startSec + dur + 0.02)
      }
    }

    const tick = () => {
      if (cancelled || !audioRef.current || !isVisibleRef.current) return
      const profile = profiles[variantRef.current]
      const now = audioCtx.currentTime
      playOne(profile, now + 0.02)
      const periodMs = profile.onMs + profile.offMs
      timer = setTimeout(tick, periodMs)
    }
    tick()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime)
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.04)
      setTimeout(() => {
        audioCtx.close().catch(() => undefined)
      }, 80)
    }
  }, [audioEnabled, variant])

  const handleToggleAudio = useCallback(() => {
    const next = !audioRef.current
    audioRef.current = next
    setAudioEnabled(next)
    writeAudioPref(next)
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    renderer.setClearColor(0x000000, 0)
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
      // Lift the bot onto a hill — a small dark dome under it
      const hillGeom = new THREE.SphereGeometry(2, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2)
      const hillMat = new THREE.MeshStandardMaterial({
        color: 0x0a0810,
        roughness: 0.9,
        metalness: 0.2,
      })
      const hill = new THREE.Mesh(hillGeom, hillMat)
      hill.position.y = -0.5
      hill.scale.y = 0.4
      scene.add(hill)
      bot.group.position.y = 0.3
      // Push bot slightly away from camera
      bot.group.position.z = -0.5
    }

    if (variant === 'chewing') {
      // Spawn a "target" object the bot is consuming — a glitching cluster
      // of orange torus fragments, the abstract shape of "a thing being
      // ripped through."
      const targetGroup = new THREE.Group()
      for (let i = 0; i < 6; i++) {
        const tg = new THREE.TorusGeometry(0.12, 0.025, 8, 24)
        const tm = new THREE.MeshBasicMaterial({
          color: 0xff7a30,
          transparent: true,
          opacity: 0.85,
          toneMapped: false,
        })
        const t = new THREE.Mesh(tg, tm)
        t.position.set(
          (Math.random() - 0.5) * 0.5,
          0.55 + (Math.random() - 0.5) * 0.4,
          0.9 + Math.random() * 0.2,
        )
        t.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        )
        t.userData = { phase: Math.random() * Math.PI * 2 }
        targetGroup.add(t)
      }
      scene.add(targetGroup)
      ;(scene as unknown as { targetGroup: THREE.Group }).targetGroup = targetGroup

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
    let isVisible = false
    let lastFrameTime = performance.now()
    let elapsed = 0

    const animate = () => {
      if (!isVisible) return
      const now = performance.now()
      const delta = Math.min((now - lastFrameTime) / 1000, 1 / 30)
      lastFrameTime = now
      elapsed += delta

      // Sensor sweep — scan and hill share the SAME canonical motion (Zack:
      // "the same scan from the same position in most of the animations").
      // Only the chewing variant locks the head in place.
      const sweepSpeed = variant === 'chewing' ? 0 : 1.0
      const sweepAmplitude = variant === 'chewing' ? 0 : 0.85
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
      const haloPulse =
        variant === 'chewing'
          ? 0.85 + Math.sin(elapsed * 8) * 0.15
          : 0.45 + Math.sin(elapsed * 2.5) * 0.25
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

      // Animate the chewing target — disintegrating loop
      const targetGroup = (scene as unknown as { targetGroup?: THREE.Group }).targetGroup
      if (targetGroup) {
        for (const child of targetGroup.children) {
          const phase = (child.userData.phase as number) ?? 0
          const cycle = (elapsed * 1.5 + phase) % (Math.PI * 2)
          const k = (Math.sin(cycle) + 1) / 2 // 0..1
          child.scale.setScalar(0.4 + k * 1.0)
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
          mat.opacity = 0.2 + k * 0.7
          child.rotation.x += delta * 0.5
          child.rotation.y += delta * 0.7
        }
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
        isVisibleRef.current = nowVisible
        if (nowVisible && !isVisible) {
          isVisible = true
          lastFrameTime = performance.now()
          animate()
        } else if (!nowVisible && isVisible) {
          isVisible = false
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
              ? 'linear-gradient(180deg, #3a2410 0%, #2a1808 55%, #100804 100%)'
              : variant === 'hill'
                ? 'linear-gradient(180deg, #04060c 0%, #0a0820 60%, #04040a 100%)'
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

      {/* Chewing-state phrase overlay — the phrase emerges occasionally as
          a feeling rather than repeating like a mantra. CSS animation with
          long pauses + fade-in / hold / glitch / fade-out / pause cycle. */}
      {variant === 'chewing' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 text-center">
          <div
            className="inline-block font-mono text-xs sm:text-sm tracking-widest text-amber-200"
            style={{
              textShadow:
                '0 0 8px rgba(255,180,80,0.85), 0 0 22px rgba(255,140,60,0.5)',
              animation: 'algo-emerge 11s ease-in-out infinite',
            }}
          >
            &gt; I&nbsp;ONLY&nbsp;EXIST&nbsp;IN&nbsp;COMBAT
          </div>
        </div>
      )}

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

      <style jsx global>{`
        @keyframes algo-emerge {
          0%, 6%, 75%, 100% {
            opacity: 0;
            filter: blur(2px);
            transform: translateY(6px);
          }
          14% {
            opacity: 0.4;
            filter: blur(1px);
            transform: translateY(2px);
          }
          24%, 50% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
          32% {
            opacity: 0.7;
            transform: translateY(0) translateX(-2px);
          }
          36% {
            opacity: 1;
            transform: translateY(0) translateX(2px);
          }
          60% {
            opacity: 0.55;
            filter: blur(1px);
          }
          68% {
            opacity: 0;
            filter: blur(3px);
          }
        }
      `}</style>
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
