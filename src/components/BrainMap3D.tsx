'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Radial-gradient texture used as the glow sprite map. A soft white→transparent
// falloff tinted by each region's network color gives us clean, legible
// colored "regions of activation" that read at a glance.
let cachedGlowTexture: THREE.CanvasTexture | null = null
function getGlowTexture(): THREE.CanvasTexture {
  if (cachedGlowTexture) return cachedGlowTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grd.addColorStop(0.0, 'rgba(255,255,255,1.0)')
  grd.addColorStop(0.15, 'rgba(255,255,255,0.9)')
  grd.addColorStop(0.45, 'rgba(255,255,255,0.35)')
  grd.addColorStop(1.0, 'rgba(255,255,255,0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  cachedGlowTexture = tex
  return tex
}

// ─── Networks ───────────────────────────────────────────────────────────────
// Each network is a bundle of curved fiber tracts anchored in an anatomical
// region. When the network is "active" the fibers emit light and signal
// particles pulse along them. When "dimmed" they fade to a faint outline.
//
// Positions are in the brain-envelope frame: +z is forward (towards nose),
// +y is up, +x is the right hemisphere. The envelope is scaled
// x:1.1 / y:0.85 / z:1.35 after displacement.

type Vec3 = [number, number, number]

type NetworkDef = {
  color: string
  label: string
  description: string
  // Anchor: the region's "centroid" — used for the raycast target and label.
  anchor: Vec3
}

const NETWORKS = {
  prefrontal: {
    color: '#ff6b35',
    label: 'Prefrontal Cortex',
    description: 'Executive function, planning, prioritization',
    anchor: [0, 0.2, 0.85] as Vec3,
  },
  dmn: {
    color: '#4ecdc4',
    label: 'Default Mode Network',
    description: 'Mind-wandering, internal chatter, "brain radio"',
    anchor: [0, 0.1, -0.15] as Vec3,
  },
  dopamine: {
    color: '#ffe66d',
    label: 'Dopamine Pathways',
    description: 'Reward, motivation, interest-based activation',
    anchor: [0, -0.1, 0.05] as Vec3,
  },
  amygdala: {
    color: '#ff6b6b',
    label: 'Amygdala',
    description: 'Emotional urgency, everything-feels-urgent signal',
    anchor: [0.3, -0.15, 0.1] as Vec3,
  },
  workingMemory: {
    color: '#c44dff',
    label: 'Working Memory',
    description: 'Volatile cache — context that leaks on interruption',
    anchor: [-0.4, 0.3, 0.5] as Vec3,
  },
} satisfies Record<string, NetworkDef>

type NetworkKey = keyof typeof NETWORKS

// `boost` is a multiplier on active-network intensity. >1 = overdrive
// (hyperfocus; networks glow past 1.0). The NT side is always boost 1 so
// the contrast during hyperfocus is instant: ADHD brain blazes while NT
// stays at steady state.
type ScrollState = {
  threshold: number
  active: NetworkKey[]
  dimmed: NetworkKey[]
  title: string
  boost?: number
}
const SCROLL_STATES: ScrollState[] = [
  {
    threshold: 0,
    active: ['prefrontal', 'dmn', 'dopamine', 'amygdala', 'workingMemory'],
    dimmed: [],
    title: 'Neurotypical baseline — all systems online',
  },
  {
    threshold: 0.15,
    active: ['dmn', 'amygdala'],
    dimmed: ['prefrontal', 'dopamine', 'workingMemory'],
    title: "ADHD at rest — prefrontal dims, DMN won't shut off",
  },
  {
    threshold: 0.3,
    active: ['amygdala'],
    dimmed: ['prefrontal', 'dopamine', 'workingMemory', 'dmn'],
    title: 'Priority blindness — amygdala fires on everything equally',
  },
  {
    // Hyperfocus: all five regions fire, but at 2.2× the sustained
    // neurotypical intensity. The user's mental model ("every region
    // blazes") is the visual we honor here — the ADHD brain in this
    // state is not a better NT brain, it's an overdriven one.
    threshold: 0.45,
    active: ['prefrontal', 'workingMemory', 'dopamine', 'dmn', 'amygdala'],
    dimmed: [],
    title: 'Hyperfocus — every region blazing past baseline; the ADHD brain overdrives',
    boost: 2.2,
  },
  {
    threshold: 0.6,
    active: [],
    dimmed: ['prefrontal', 'dopamine', 'workingMemory', 'amygdala', 'dmn'],
    title: 'The crash — hyperfocus is not free; the brain is dark for a day',
  },
  {
    threshold: 0.75,
    active: ['prefrontal', 'dopamine', 'workingMemory'],
    dimmed: ['dmn', 'amygdala'],
    title: 'With AI scaffolding — external systems compensate',
  },
]

type FiberBundle = {
  key: NetworkKey
  color: THREE.Color
  nodeMesh: THREE.Mesh
  targetIntensity: number
  currentIntensity: number
}

// Each region is rendered as a large glow sprite (billboard) at its anchor
// position. Sprites read cleanly as "regions of activation" on any brain
// orientation and never saturate the canvas because they use a pre-baked
// radial falloff texture — no fighting with wireframe-edge classifiers.
type GlowItem = {
  key: NetworkKey
  sprite: THREE.Sprite
  material: THREE.SpriteMaterial
  basePosition: [number, number, number]
}

// The user-selectable ADHD states. The left (NT) side is always fixed at
// baseline so you can see the delta instantly as you toggle.
type AdhdMode = 'rest' | 'hyperfocus' | 'crash' | 'scaffolding'

const ADHD_STATE_BY_MODE: Record<AdhdMode, ScrollState> = {
  rest: SCROLL_STATES[1],         // "ADHD at rest — prefrontal dims, DMN won't shut off"
  hyperfocus: SCROLL_STATES[3],   // "Hyperfocus — three networks fire at 180%"
  crash: SCROLL_STATES[4],        // "The crash — brain is dark for a day"
  scaffolding: SCROLL_STATES[5],  // "With AI scaffolding — external systems compensate"
}

const MODE_BUTTONS: { mode: AdhdMode; short: string; tag: string }[] = [
  { mode: 'rest',        short: 'At Rest',        tag: 'low PFC · DMN loud' },
  { mode: 'hyperfocus',  short: 'Hyperfocus',     tag: '180% on 3 networks' },
  { mode: 'crash',       short: 'The Crash',      tag: 'systems offline' },
  { mode: 'scaffolding', short: 'With AI Scaffolding', tag: 'PFC restored externally' },
]

export type BrainMap3DProps = {
  /** Initial ADHD mode shown on mount. Users can still switch via toggles. */
  defaultMode?: AdhdMode
}

export default function BrainMap3D({
  defaultMode = 'rest',
}: BrainMap3DProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const [adhdMode, setAdhdMode] = useState<AdhdMode>(defaultMode)
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey | null>(null)
  const [webglFailed, setWebglFailed] = useState(false)
  const stateRef = useRef<ScrollState>(ADHD_STATE_BY_MODE[defaultMode])

  const currentState = ADHD_STATE_BY_MODE[adhdMode]

  useEffect(() => {
    stateRef.current = currentState
  }, [currentState])

  const handleNetworkClick = useCallback((key: NetworkKey) => {
    setSelectedNetwork(prev => (prev === key ? null : key))
  }, [])

  useEffect(() => {
    if (webglFailed) return
    const host = canvasHostRef.current
    const container = containerRef.current
    if (!host || !container) return

    let width = host.clientWidth || 600
    let height = host.clientHeight || 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    // Pulled back + up so both side-by-side brains frame cleanly.
    camera.position.set(0, 0.5, 5.2)
    camera.lookAt(0, 0, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      setWebglFailed(true)
      return
    }

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.cursor = 'grab'

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.25))
    const warmLight = new THREE.PointLight(0xffd0a0, 1.2, 20)
    warmLight.position.set(4, 3, 4)
    scene.add(warmLight)
    const coolLight = new THREE.PointLight(0x9cb8ff, 0.6, 20)
    coolLight.position.set(-4, -2, 2)
    scene.add(coolLight)
    const rimLight = new THREE.PointLight(0xffb0c0, 0.35, 20)
    rimLight.position.set(0, 0, -5)
    scene.add(rimLight)

    // Root group for drag-rotation — rotates BOTH brains in sync.
    const root = new THREE.Group()
    scene.add(root)

    // Two "hemisphere side" groups: NT (left) and ADHD (right). Each holds
    // its own brain shell + fiber bundles. They share fiber geometry logic
    // but track activation independently so NT stays static while ADHD
    // responds to scroll.
    const SIDE_OFFSET_X = 1.25

    type SideKey = 'nt' | 'adhd'
    type Side = {
      key: SideKey
      root: THREE.Group
      bundles: FiberBundle[]
      // One soft-glow sprite per network — the primary region indicator.
      glows: GlowItem[]
      // Uniform faint-pink brain silhouette (one entry per mesh in the GLB).
      wireframes: THREE.LineSegments[]
      getState: () => typeof SCROLL_STATES[number]
    }

    const sides: Side[] = []
    let disposedDuringLoad = false

    function buildSide(key: SideKey, offsetX: number, getState: Side['getState']): Side {
      const sideGroup = new THREE.Group()
      sideGroup.position.x = offsetX
      root.add(sideGroup)

      // Node orbs — invisible, still used as semantic anchors. Initial
      // activation levels derive from the side's initial state so the first
      // rendered frame already matches the mode rather than flashing through
      // a uniform baseline as the lerp converges.
      const initialState = getState()
      const initialBoost = initialState.boost ?? 1
      const bundles: FiberBundle[] = (Object.keys(NETWORKS) as NetworkKey[]).map((nkey) => {
        const net = NETWORKS[nkey]
        const color = new THREE.Color(net.color)
        const nodeGeom = new THREE.SphereGeometry(0.04, 16, 16)
        const nodeMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,  // hidden by default; glow sprite carries the visual
          toneMapped: false,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat)
        nodeMesh.position.fromArray(net.anchor)
        nodeMesh.userData.networkKey = nkey
        sideGroup.add(nodeMesh)

        const initialIntensity = initialState.active.includes(nkey)
          ? 1 * initialBoost
          : initialState.dimmed.includes(nkey)
            ? 0
            : 0.15

        return {
          key: nkey,
          color,
          nodeMesh,
          targetIntensity: initialIntensity,
          currentIntensity: initialIntensity,
        }
      })

      // Large soft glow sprites — the main visual. Billboards so they're
      // always readable regardless of camera angle. Additive blending lets
      // them brighten against the dark brain wireframe without muddying.
      const glowTex = getGlowTexture()
      const glows: GlowItem[] = (Object.keys(NETWORKS) as NetworkKey[]).map((nkey) => {
        const net = NETWORKS[nkey]
        const mat = new THREE.SpriteMaterial({
          map: glowTex,
          color: new THREE.Color(net.color),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          depthTest: true,
          toneMapped: false,
        })
        const sprite = new THREE.Sprite(mat)
        sprite.position.fromArray(net.anchor)
        sprite.scale.setScalar(0.4)
        sideGroup.add(sprite)
        return {
          key: nkey,
          sprite,
          material: mat,
          basePosition: [...net.anchor] as [number, number, number],
        }
      })

      const side: Side = {
        key,
        root: sideGroup,
        bundles,
        glows,
        wireframes: [],
        getState,
      }
      sides.push(side)
      return side
    }

    const NT_STATE = SCROLL_STATES[0]
    buildSide('nt', -SIDE_OFFSET_X, () => NT_STATE)
    buildSide('adhd', +SIDE_OFFSET_X, () => stateRef.current)

    // Load brain GLB once. For each side we build:
    //   - A very faint translucent flesh layer (establishes anatomy subtly)
    //   - A single uniform pink wireframe (thin, low-opacity) that shows
    //     the brain silhouette without saturating or competing with the
    //     region glows.
    // Region-of-activation coloring comes entirely from the glow sprites
    // built in `buildSide` — no edge classification, no internal line
    // clusters. Much more legible at a glance.
    const brainLoader = new GLTFLoader()
    brainLoader.load(
      '/models/brain.glb',
      (gltf) => {
        if (disposedDuringLoad) return
        const loaded = gltf.scene
        const box = new THREE.Box3().setFromObject(loaded)
        const size = new THREE.Vector3()
        const center = new THREE.Vector3()
        box.getSize(size)
        box.getCenter(center)
        const longest = Math.max(size.x, size.y, size.z)
        const scale = 1.6 / longest

        loaded.traverse((node) => {
          if (!(node as THREE.Mesh).isMesh) return
          const m = node as THREE.Mesh
          const g = m.geometry as THREE.BufferGeometry
          const wireGeom = new THREE.WireframeGeometry(g)

          for (const s of sides) {
            // Very subtle flesh layer — just a hint of mass under the wires.
            const flesh = new THREE.Mesh(
              g,
              new THREE.MeshStandardMaterial({
                color: new THREE.Color('#b88080'),
                emissive: new THREE.Color('#2a0818'),
                emissiveIntensity: 0.25,
                roughness: 0.9,
                metalness: 0.0,
                transparent: true,
                opacity: 0.08,
                side: THREE.DoubleSide,
                depthWrite: false,
              }),
            )
            flesh.position.copy(center).multiplyScalar(-scale)
            flesh.scale.setScalar(scale)
            s.root.add(flesh)

            // Uniform pink wireframe (thin, low opacity). LineBasicMaterial
            // gives us the 1-pixel default linewidth, which is exactly what
            // we want — crisp, non-saturating, legible.
            const wireMat = new THREE.LineBasicMaterial({
              color: 0xffb5c8,
              transparent: true,
              opacity: 0.3,
              depthWrite: false,
              toneMapped: false,
            })
            const wireMesh = new THREE.LineSegments(wireGeom, wireMat)
            wireMesh.position.copy(center).multiplyScalar(-scale)
            wireMesh.scale.setScalar(scale)
            s.root.add(wireMesh)
            s.wireframes.push(wireMesh)
          }
          // Intentionally do NOT dispose wireGeom — it's shared across sides.
        })
      },
      undefined,
      (err) => {
        console.error('Brain GLB failed to load', err)
      },
    )

    // ── Pointer rotate ──
    let autoRotating = true
    let dragging = false
    let lastX = 0
    let lastY = 0
    let startX = 0
    let startY = 0
    let rotY = 0
    let rotX = 0
    let autoRotateTimeout: ReturnType<typeof setTimeout> | null = null
    const clampX = (v: number) => Math.max(-0.6, Math.min(0.6, v))

    const onDown = (e: PointerEvent) => {
      dragging = true
      autoRotating = false
      if (autoRotateTimeout !== null) {
        clearTimeout(autoRotateTimeout)
        autoRotateTimeout = null
      }
      lastX = e.clientX
      lastY = e.clientY
      startX = e.clientX
      startY = e.clientY
      renderer.domElement.style.cursor = 'grabbing'
      try { renderer.domElement.setPointerCapture(e.pointerId) } catch {}
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      rotY += dx * 0.006
      rotX = clampX(rotX + dy * 0.006)
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      renderer.domElement.style.cursor = 'grab'
      try { renderer.domElement.releasePointerCapture(e.pointerId) } catch {}
      autoRotateTimeout = setTimeout(() => { autoRotating = true }, 2500)
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    // ── Click → raycast against glow sprites (big, easy to hit) ──
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    // Track networkKey on each sprite so the hit can resolve to its region.
    for (const s of sides) {
      for (const g of s.glows) g.sprite.userData.networkKey = g.key
    }
    const onClick = (e: MouseEvent) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const dragDistance = Math.sqrt(dx * dx + dy * dy)
      if (dragDistance > 5) return
      const rect = renderer.domElement.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      const targets = sides.flatMap((s) => s.glows.map((g) => g.sprite))
      const hits = raycaster.intersectObjects(targets, false)
      if (hits.length > 0) {
        const key = hits[0].object.userData.networkKey as NetworkKey
        if (key) handleNetworkClick(key)
      }
    }
    renderer.domElement.addEventListener('click', onClick)

    // Resize
    const resize = () => {
      if (!host) return
      width = host.clientWidth || 600
      height = host.clientHeight || 500
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // ── Animation loop ──
    const clock = new THREE.Clock()
    let raf = 0
    let isVisible = false

    const animate = () => {
      if (!isVisible) return

      const delta = Math.min(clock.getDelta(), 1 / 30)

      const elapsed = clock.elapsedTime

      // Per-side update: glow sprites carry the region-of-activation story.
      // The wireframe is a constant silhouette; it lightly breathes with
      // total activity but never changes color so the brain shape is always
      // readable.
      for (const side of sides) {
        const sideState = side.getState()
        const boost = sideState.boost ?? 1

        const intensity: Partial<Record<NetworkKey, number>> = {}
        for (const b of side.bundles) {
          b.targetIntensity = sideState.active.includes(b.key)
            ? 1 * boost
            : sideState.dimmed.includes(b.key)
              ? 0
              : 0.15
          b.currentIntensity += (b.targetIntensity - b.currentIntensity) * delta * 5
          intensity[b.key] = b.currentIntensity
        }

        // Drive each region's glow sprite. Scale grows with activation and
        // the sprite pulses gently at peak intensity (hyperfocus) to convey
        // overdrive. Colors are never mixed or classified — each sprite is
        // its own region, always the region's color.
        for (const g of side.glows) {
          const i = intensity[g.key] ?? 0
          const iC = Math.min(2.5, i)
          const pulse = iC > 1.2 ? 0.97 + Math.sin(elapsed * 3 + g.basePosition[0]) * 0.04 : 1
          const scale = (0.32 + iC * 0.28) * pulse
          g.sprite.scale.setScalar(scale)
          g.material.opacity = Math.min(1, iC * 0.95)
          g.material.color
            .set(NETWORKS[g.key].color)
            .multiplyScalar(Math.min(2.5, 0.85 + iC * 0.7))
          g.sprite.visible = iC > 0.02
        }

        // Wireframe breathes very slightly with total activity so an
        // all-off crash reads darker than a fully-lit hyperfocus brain,
        // but the silhouette is always visible.
        const totalActivity = Object.values(intensity).reduce<number>(
          (acc, v) => acc + (v ?? 0),
          0,
        )
        const wireOpacity = 0.14 + Math.min(0.22, totalActivity * 0.04)
        for (const w of side.wireframes) {
          ;(w.material as THREE.LineBasicMaterial).opacity = wireOpacity
        }
      }

      // Rotate
      if (autoRotating) rotY += delta * 0.15
      root.rotation.y = rotY
      root.rotation.x = rotX

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        const nowVisible = entries.some((e) => e.isIntersecting)
        if (nowVisible && !isVisible) {
          isVisible = true
          clock.start()
          animate()
        } else if (!nowVisible && isVisible) {
          isVisible = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 }
    )
    observer.observe(container)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      ro.disconnect()
      if (autoRotateTimeout !== null) clearTimeout(autoRotateTimeout)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('click', onClick)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)

      disposedDuringLoad = true
      for (const side of sides) {
        for (const b of side.bundles) {
          ;(b.nodeMesh.geometry as THREE.BufferGeometry).dispose()
          ;(b.nodeMesh.material as THREE.Material).dispose()
        }
        side.root.traverse((n) => {
          const mesh = n as THREE.Mesh | THREE.LineSegments | THREE.Sprite
          if ((mesh as THREE.Mesh).isMesh || (mesh as THREE.LineSegments).isLineSegments) {
            const geom = mesh.geometry as THREE.BufferGeometry | undefined
            const mat = mesh.material as THREE.Material | undefined
            geom?.dispose()
            mat?.dispose()
          } else if ((mesh as THREE.Sprite).isSprite) {
            const mat = (mesh as THREE.Sprite).material as THREE.Material | undefined
            mat?.dispose()
          }
        })
      }
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [webglFailed, handleNetworkClick])

  const adhdActiveCount = currentState.active.length
  const adhdSubtitle = currentState.title.split(' — ')[1] ?? currentState.title

  const adhdModeLabel = MODE_BUTTONS.find((b) => b.mode === adhdMode)?.short ?? ''

  return (
    <div
      ref={containerRef}
      className="relative w-full my-8 rounded-2xl overflow-hidden border border-amber-500/20"
    >
      {/* Lightened background — still dark enough for glows to pop, but
          less pitch-black than before. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1c1033] via-[#2a1850] to-[#1c1033]" />

      {/* Mode toggle — primary interaction */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 px-4 pt-5">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-200/50 mr-1 hidden sm:inline">
          Neurodivergent mode →
        </span>
        {MODE_BUTTONS.map((b) => {
          const selected = adhdMode === b.mode
          return (
            <button
              key={b.mode}
              type="button"
              onClick={() => setAdhdMode(b.mode)}
              className={`rounded-full border px-3 py-1.5 text-xs font-mono transition-all ${
                selected
                  ? 'border-amber-300 bg-amber-400/15 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.45)]'
                  : 'border-white/15 bg-white/5 text-white/70 hover:border-white/35 hover:text-white/90'
              }`}
            >
              <span className="font-semibold">{b.short}</span>
              <span className="ml-1.5 text-[10px] text-white/50">· {b.tag}</span>
            </button>
          )
        })}
      </div>

      {/* Side-by-side panel frames with anchored brain titles. Each brain
          has its own gold-bordered panel so the NT vs Neurodivergent
          delineation is unambiguous. */}
      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 px-3">
        {/* NT panel */}
        <div className="rounded-xl border border-teal-400/40 bg-teal-500/[0.03] shadow-[0_0_24px_rgba(45,212,191,0.08)]">
          <div className="border-b border-teal-400/30 px-4 py-2.5 text-center">
            <p className="text-sm font-mono font-bold uppercase tracking-[0.3em] text-teal-200">
              Neurotypical
            </p>
            <p className="text-[10px] font-mono text-teal-300/70 mt-0.5">
              baseline · 5 / 5 networks · constant reference
            </p>
          </div>
        </div>
        {/* Neurodivergent panel */}
        <div className="rounded-xl border border-amber-400/45 bg-amber-400/[0.04] shadow-[0_0_24px_rgba(251,191,36,0.12)]">
          <div className="border-b border-amber-400/35 px-4 py-2.5 text-center">
            <p className="text-sm font-mono font-bold uppercase tracking-[0.3em] text-amber-200">
              Neurodivergent
            </p>
            <p className="text-[10px] font-mono text-amber-300/80 mt-0.5 truncate px-2">
              {adhdModeLabel.toLowerCase()} · {adhdActiveCount} / 5 · {adhdSubtitle}
            </p>
          </div>
        </div>
      </div>

      {selectedNetwork && (
        <div className="absolute bottom-14 left-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/15">
          <p className="text-sm font-bold" style={{ color: NETWORKS[selectedNetwork].color }}>
            {NETWORKS[selectedNetwork].label}
          </p>
          <p className="text-xs text-white/80 mt-1">
            {NETWORKS[selectedNetwork].description}
          </p>
        </div>
      )}

      {/* Canvas. The two side-panel frames above end with an open bottom;
          the canvas sits flush underneath so each brain appears to live
          inside its panel. */}
      <div className="relative w-full" style={{ height: '520px' }}>
        <div ref={canvasHostRef} className="absolute inset-0" />
        {webglFailed && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-xs font-mono text-amber-400/80">
              3D rendering unavailable. {currentState.title}
            </p>
          </div>
        )}
        {/* Subtle vertical gold divider between the two brains */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />
      </div>

      {/* Legend row — bottom, flat */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 pb-2 pt-2">
        {(Object.entries(NETWORKS) as [NetworkKey, NetworkDef][]).map(([key, net]) => (
          <button
            key={key}
            type="button"
            className="flex items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity bg-transparent border-0 p-0"
            onClick={() => handleNetworkClick(key)}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{
                backgroundColor: net.color,
                opacity: currentState.active.includes(key) ? 1 : 0.35,
                boxShadow: currentState.active.includes(key) ? `0 0 6px ${net.color}` : 'none',
              }}
            />
            <span className="text-[10px] text-white/75 font-mono">{net.label}</span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-1 right-3 z-10 pointer-events-none">
        <p className="text-[9px] text-white/30 font-mono hidden md:block">drag to rotate · click a mode above</p>
      </div>
    </div>
  )
}
