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
const COMBAT_PHRASE = 'I only exist in combat'

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
  wire: THREE.Line
  dispose: () => void
} {
  const group = new THREE.Group()
  const disposables: Array<{ dispose: () => void }> = []

  // Body — dark matte sphere with subtle emissive hint
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

  // Head — slightly squashed sphere where the sensor lives
  const headGeom = new THREE.SphereGeometry(0.22, 24, 24)
  const headMat = new THREE.MeshStandardMaterial({
    color: 0x12121a,
    emissive: 0x080814,
    roughness: 0.35,
    metalness: 0.7,
  })
  const head = new THREE.Mesh(headGeom, headMat)
  head.position.y = 1.52
  head.scale.set(1.0, 0.88, 1.0)
  group.add(head)
  disposables.push(headGeom, headMat)

  // Sensor — the red eye. Slightly inset disc on the front of the head.
  // Bright emissive so it reads against any background.
  const sensorGeom = new THREE.CircleGeometry(0.085, 32)
  const sensorMat = new THREE.MeshBasicMaterial({
    color: 0xff2030,
    toneMapped: false,
    transparent: true,
    opacity: 1,
  })
  const sensor = new THREE.Mesh(sensorGeom, sensorMat)
  sensor.position.set(0, 1.52, 0.22)
  group.add(sensor)
  disposables.push(sensorGeom, sensorMat)

  // Sensor halo for the bloom-ish glow effect (additive blending sprite)
  const haloGeom = new THREE.CircleGeometry(0.18, 32)
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xff4050,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    depthWrite: false,
  })
  const halo = new THREE.Mesh(haloGeom, haloMat)
  halo.position.set(0, 1.52, 0.215)
  group.add(halo)
  disposables.push(haloGeom, haloMat)

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
    wire: wire as unknown as THREE.Line,
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

  // Speech-synthesis loop for the combat phrase. Only active when the
  // current variant is 'chewing' AND audio is enabled.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (variant !== 'chewing') return
    if (!audioEnabled) {
      window.speechSynthesis.cancel()
      return
    }
    let cancelled = false
    const speak = () => {
      if (cancelled || variantRef.current !== 'chewing' || !audioRef.current) return
      const u = new SpeechSynthesisUtterance(COMBAT_PHRASE)
      u.rate = 0.95
      u.pitch = 0.65
      u.volume = 0.85
      u.onend = () => {
        if (cancelled || variantRef.current !== 'chewing' || !audioRef.current) return
        setTimeout(speak, 600)
      }
      window.speechSynthesis.speak(u)
    }
    // Slight delay so the bot's animation lands before the phrase
    const t = setTimeout(speak, 400)
    return () => {
      cancelled = true
      clearTimeout(t)
      window.speechSynthesis.cancel()
    }
  }, [variant, audioEnabled])

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

    // Per-variant lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.18))

    if (variant === 'chewing') {
      // Warm/orange accent — the wire is hot here
      const warm = new THREE.PointLight(0xff7a1f, 1.4, 12)
      warm.position.set(0, 2, 2.5)
      scene.add(warm)
      const accent = new THREE.PointLight(0xff3050, 0.9, 10)
      accent.position.set(2, 1.2, 1)
      scene.add(accent)
    } else {
      // Cool dim magenta/teal palette for scan + hill
      const cool = new THREE.PointLight(0x60a8ff, 0.8, 14)
      cool.position.set(-3, 4, 3)
      scene.add(cool)
      const magenta = new THREE.PointLight(0xc04098, 0.7, 12)
      magenta.position.set(3, 1.5, -2)
      scene.add(magenta)
      if (variant === 'hill') {
        // Even dimmer on the hill — closer-to-black mood
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
        t.userData = { phase: Math.random() * Math.PI * 2, baseG: tg, baseM: tm }
        targetGroup.add(t)
      }
      scene.add(targetGroup)
      // Stash for animation
      ;(scene as unknown as { targetGroup: THREE.Group }).targetGroup = targetGroup
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

      // Sensor sweep — varies by variant
      const sweepSpeed = variant === 'hill' ? 0.5 : variant === 'chewing' ? 0 : 1.1
      const sweepAmplitude = variant === 'hill' ? 0.45 : variant === 'chewing' ? 0 : 0.7
      const sweep = Math.sin(elapsed * sweepSpeed) * sweepAmplitude
      bot.head.rotation.y = sweep

      // Sensor pulse — different rhythm per variant
      const sensorPulse =
        variant === 'chewing'
          ? 0.85 + Math.sin(elapsed * 8) * 0.15
          : 0.55 + Math.sin(elapsed * 2.5) * 0.25
      const sensorMat = bot.sensor.material as THREE.MeshBasicMaterial
      sensorMat.opacity = Math.min(1, sensorPulse)
      bot.sensor.scale.setScalar(0.8 + sensorPulse * 0.5)

      // Wire glow — hot during chewing, dim on hill
      const wireMat = bot.wire.material as THREE.MeshBasicMaterial
      if (variant === 'chewing') {
        wireMat.opacity = 0.85 + Math.sin(elapsed * 6) * 0.15
        wireMat.color.setRGB(1.0, 0.5 + Math.sin(elapsed * 8) * 0.1, 0.12)
      } else if (variant === 'hill') {
        wireMat.opacity = 0.3 + Math.sin(elapsed * 1.2) * 0.08
        wireMat.color.setRGB(0.65, 0.32, 0.1)
      } else {
        wireMat.opacity = 0.5 + Math.sin(elapsed * 2) * 0.1
        wireMat.color.setRGB(0.95, 0.45, 0.08)
      }

      // Bot rotation from drag
      bot.group.rotation.y = rotY

      // Subtle body bob in scan + chewing
      if (variant === 'scan') {
        bot.group.position.y = Math.sin(elapsed * 1.5) * 0.03
      } else if (variant === 'chewing') {
        bot.group.position.y = Math.sin(elapsed * 4) * 0.02
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

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nowVisible = entries.some((e) => e.isIntersecting)
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
              ? 'linear-gradient(180deg, #1a0808 0%, #2a0a18 50%, #0a0004 100%)'
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

      {/* Chewing-state phrase overlay (the glitching combat text the bot
          is consuming). Kept as HTML + CSS for typography flexibility. */}
      {variant === 'chewing' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-12 z-10 text-center">
          <div
            className="inline-block font-mono text-xs sm:text-sm tracking-widest text-orange-300"
            style={{
              textShadow:
                '0 0 8px rgba(255,120,40,0.7), 0 0 18px rgba(255,80,40,0.4)',
              animation: 'algo-glitch 1.8s infinite',
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
          {audioEnabled
            ? 'AUDIO: ON · plays in COMBAT below'
            : 'AUDIO: OFF'}
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
        @keyframes algo-glitch {
          0%, 100% { opacity: 1; transform: translateX(0); }
          14% { opacity: 0.85; transform: translateX(-1px); }
          28% { opacity: 1; transform: translateX(2px); }
          42% { opacity: 0.65; transform: translateX(0); }
          56% { opacity: 1; transform: translateX(-2px); }
          70% { opacity: 0.85; transform: translateX(1px); }
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
