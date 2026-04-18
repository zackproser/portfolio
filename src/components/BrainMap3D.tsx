'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Radial glow texture — used for "overdrive" burst halos that appear only
// when a region is driven past its NT baseline (intensity > 1.0). This is
// the visual signature that separates ADHD hyperfocus from NT task focus:
// same regions active, but hyperfocus has phasic dopamine-burst halos that
// NT simply doesn't have.
function createGlowTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grd.addColorStop(0.0, 'rgba(255,255,255,1.0)')
  grd.addColorStop(0.15, 'rgba(255,255,255,0.9)')
  grd.addColorStop(0.45, 'rgba(255,255,255,0.3)')
  grd.addColorStop(1.0, 'rgba(255,255,255,0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// Create a canvas texture with rendered text. Shared by buildTextSprite and
// updateTextSprite to avoid duplicating the canvas rendering logic.
function createTextTexture(
  text: string,
  color: string,
  subColor?: string,
  subText?: string,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  // Wider canvas so long subtitle strings (e.g. "With AI Scaffolding · PFC
  // restored") don't get clipped by the sprite's billboard frame.
  const w = 1536
  const h = 272
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.font = '700 96px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, subText ? h * 0.36 : h * 0.5)
  if (subText && subColor) {
    // Smaller sub so long mode names/tags fit inside the sprite width
    // across all the mode toggles ("With AI Scaffolding · PFC restored"
    // is the longest one we render).
    ctx.font = '500 40px ui-monospace, SFMono-Regular, Menlo, monospace'
    ctx.fillStyle = subColor
    ctx.fillText(subText, w / 2, h * 0.76)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  tex.anisotropy = 4
  return tex
}

// Build a 3D text sprite that hangs above its parent group. Sprites are
// billboards (always face camera), so the label stays readable no matter how
// the user rotates the brain — it effectively "travels with" the brain
// rather than sitting at a fixed screen position.
function buildTextSprite(
  text: string,
  color: string,
  subColor?: string,
  subText?: string,
): THREE.Sprite {
  const tex = createTextTexture(text, color, subColor, subText)
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
  })
  const sprite = new THREE.Sprite(mat)
  // Wider+taller sprite so the label + subtitle always fit regardless of
  // which ADHD mode is selected. Aspect ratio matches the 1536×272 canvas.
  sprite.scale.set(2.4, 0.425, 1)
  return sprite
}

// Update a sprite's texture with new text content. Disposes the old texture
// and replaces it with a freshly rendered one.
function updateTextSprite(
  sprite: THREE.Sprite,
  text: string,
  color: string,
  subColor?: string,
  subText?: string,
): void {
  const mat = sprite.material as THREE.SpriteMaterial
  mat.map?.dispose()
  const tex = createTextTexture(text, color, subColor, subText)
  mat.map = tex
  mat.needsUpdate = true
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
  active: NetworkKey[]
  dimmed: NetworkKey[]
  title: string
  boost?: number
}
// Neuroscientific model used by the visual:
//   Task networks    : prefrontal, workingMemory, dopamine
//   Task-NEGATIVE    : dmn, amygdala (loud at rest / in ADHD at rest)
// A focused neurotypical brain has task networks ON and task-negative
// networks SUPPRESSED. Hyperfocus is that same pattern but ~2.7× stronger
// with DMN/amygdala crushed. ADHD at rest inverts it. Crash turns
// everything off. This gives each state a distinct visual signature —
// NT ≠ Hyperfocus because hyperfocus is DRAMATICALLY brighter on the same
// 3 task networks.
const SCROLL_STATES: ScrollState[] = [
  {
    active: ['prefrontal', 'workingMemory', 'dopamine'],
    dimmed: ['dmn', 'amygdala'],
    title: 'Neurotypical baseline — task networks sustained, DMN quiet',
  },
  {
    active: ['dmn', 'amygdala'],
    dimmed: ['prefrontal', 'workingMemory', 'dopamine'],
    title: 'ADHD at rest — PFC offline, DMN and amygdala take over',
  },
  {
    active: ['prefrontal', 'workingMemory', 'dopamine'],
    dimmed: ['dmn', 'amygdala'],
    title: 'Hyperfocus — task networks overdriven past 270%, DMN crushed',
    boost: 2.7,
  },
  {
    // Post-hyperfocus: task networks fatigued/depleted, DMN and amygdala
    // rebound (mind-wandering + emotional dysregulation are the lived-
    // experience hallmarks of the crash). Dim boost so it reads as
    // sub-baseline, not normal.
    active: ['dmn', 'amygdala'],
    dimmed: ['prefrontal', 'dopamine', 'workingMemory'],
    title: 'The crash — task networks depleted; DMN rebounds, emotional dysregulation',
    boost: 0.55,
  },
  {
    active: ['prefrontal', 'workingMemory', 'dopamine'],
    dimmed: ['dmn', 'amygdala'],
    title: 'With AI scaffolding — task networks externally restored',
  },
]

type FiberBundle = {
  key: NetworkKey
  color: THREE.Color
  nodeMesh: THREE.Mesh
  targetIntensity: number
  currentIntensity: number
}

// ─── Region classifier ────────────────────────────────────────────────────
// The brain's wireframe edges are split into buckets — one per network and
// one default "unclassified" bucket. Each bucket becomes its own
// THREE.LineSegments, colored by the network. At any given state the
// non-active region buckets fade out (opacity → 0) and the active ones pop
// to full saturation, so the brain's *own lines* light up the regions.
//
// Classification uses priority-ordered slabs in the normalized (post-scale)
// frame where the brain fits roughly in ±0.8 along its longest axis. Axis
// convention (matches most Blender-exported brain GLBs):
//   +z = anterior (front, toward nose)
//   +y = superior (up)
//   ±x = lateral (left / right)
// If the brain arrives mirrored or flipped, invert the `SIGN_` constants.
const SIGN_Z_FRONT = 1  // +Z is anterior
const SIGN_Y_UP = 1     // +Y is superior

function classifyRegion(mx: number, my: number, mz: number): NetworkKey | null {
  const front = mz * SIGN_Z_FRONT
  const up = my * SIGN_Y_UP
  const lat = Math.abs(mx)
  // Priority-ordered so overlapping zones resolve cleanly. Return on first
  // match so smaller/deeper regions win over broader cortical ones.

  // Amygdala — ventral temporal, bilateral (low, moderately forward, lateral)
  if (up < -0.05 && lat > 0.15 && lat < 0.5 && front > -0.15 && front < 0.5) {
    return 'amygdala'
  }
  // Dopamine / striatum — central deep, a small zone near the origin
  if (Math.abs(up) < 0.18 && lat < 0.22 && Math.abs(front) < 0.25) {
    return 'dopamine'
  }
  // Prefrontal cortex — very anterior, upper
  if (front > 0.45 && up > -0.1) {
    return 'prefrontal'
  }
  // Working memory / DLPFC — lateral, upper, frontal-to-middle, bilateral
  if (lat > 0.3 && up > 0.1 && front > -0.2) {
    return 'workingMemory'
  }
  // DMN — medial strip (mPFC + posterior cingulate + precuneus)
  if (lat < 0.18 && front > -0.75 && front < 0.55 && up > -0.05) {
    return 'dmn'
  }
  return null
}

type RegionWire = {
  key: NetworkKey
  lines: THREE.LineSegments[]
  materials: THREE.LineBasicMaterial[]
}

// The user-selectable ADHD states. The left (NT) side is always fixed at
// baseline so you can see the delta instantly as you toggle.
type AdhdMode = 'rest' | 'hyperfocus' | 'crash' | 'scaffolding'

const ADHD_STATE_BY_MODE: Record<AdhdMode, ScrollState> = {
  rest: SCROLL_STATES[1],         // "ADHD at rest — prefrontal dims, DMN won't shut off"
  hyperfocus: SCROLL_STATES[2],   // "Hyperfocus — three networks fire at 270%"
  crash: SCROLL_STATES[3],        // "The crash — brain is dark for a day"
  scaffolding: SCROLL_STATES[4],  // "With AI scaffolding — external systems compensate"
}

const MODE_BUTTONS: { mode: AdhdMode; short: string; tag: string }[] = [
  { mode: 'rest',        short: 'At Rest',        tag: 'low PFC · DMN loud' },
  { mode: 'hyperfocus',  short: 'Hyperfocus',     tag: '270% · DMN crushed' },
  { mode: 'crash',       short: 'The Crash',      tag: 'DMN rebound · fatigue' },
  { mode: 'scaffolding', short: 'With AI Scaffolding', tag: 'PFC restored' },
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
  const adhdModeRef = useRef<AdhdMode>(defaultMode)

  const currentState = ADHD_STATE_BY_MODE[adhdMode]

  useEffect(() => {
    stateRef.current = currentState
    adhdModeRef.current = adhdMode
  }, [currentState, adhdMode])

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
    type BurstItem = {
      key: NetworkKey
      sprite: THREE.Sprite
      material: THREE.SpriteMaterial
    }
    type Side = {
      key: SideKey
      root: THREE.Group
      bundles: FiberBundle[]
      // Uniform faint-pink brain silhouette (one entry per mesh in the GLB).
      wireframes: THREE.LineSegments[]
      // One region-wire entry per network. Each contains the set of
      // classified edges colored in that network's color.
      regionWires: RegionWire[]
      // Overdrive burst halos — invisible at baseline; blaze only when a
      // region is pushed past intensity 1.0 (i.e., hyperfocus). These are
      // the "phasic dopamine / BOLD burst" signature that makes the ND
      // brain read visually distinct from the NT brain at equal coverage.
      bursts: BurstItem[]
      // 3D text label hanging above the brain; rotates with the brain root
      // so the label always travels with its brain.
      label: THREE.Sprite
      getState: () => typeof SCROLL_STATES[number]
    }

    const sides: Side[] = []
    let disposedDuringLoad = false

    // Shared glow texture for all burst sprites — created once and reused
    // across all networks on both sides. Color is applied via SpriteMaterial.color.
    const sharedGlowTexture = createGlowTexture()

    function buildSide(
      key: SideKey,
      offsetX: number,
      labelText: string,
      labelColor: string,
      labelSub: string,
      labelSubColor: string,
      getState: Side['getState'],
    ): Side {
      const sideGroup = new THREE.Group()
      sideGroup.position.x = offsetX
      root.add(sideGroup)

      // Node orbs — small but visible, serve as the raycast hit targets for
      // legend clicks. Initial intensity derives from the side's initial
      // state so no flash of wrong-state lighting on first render.
      const initialState = getState()
      const initialBoost = initialState.boost ?? 1
      const bundles: FiberBundle[] = (Object.keys(NETWORKS) as NetworkKey[]).map((nkey) => {
        const net = NETWORKS[nkey]
        const color = new THREE.Color(net.color)
        const nodeGeom = new THREE.SphereGeometry(0.05, 16, 16)
        const nodeMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.9,
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

      // Anchored 3D label that hangs above the brain.
      const label = buildTextSprite(labelText, labelColor, labelSubColor, labelSub)
      label.position.set(0, 1.25, 0)
      sideGroup.add(label)

      // Overdrive burst halos — one bright additive sprite per network,
      // anchored at the network's centroid. Invisible until intensity > 1.0,
      // then bloom outward with a rapid pulse. This is the hyperfocus-
      // specific visual effect absent from NT baseline at equivalent coverage.
      const bursts: BurstItem[] = (Object.keys(NETWORKS) as NetworkKey[]).map((nkey) => {
        const net = NETWORKS[nkey]
        const mat = new THREE.SpriteMaterial({
          map: sharedGlowTexture,
          color: new THREE.Color(net.color),
          transparent: true,
          opacity: 0,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        })
        const sprite = new THREE.Sprite(mat)
        sprite.position.fromArray(net.anchor)
        sprite.scale.setScalar(0)
        sprite.visible = false
        sideGroup.add(sprite)
        return { key: nkey, sprite, material: mat }
      })

      const side: Side = {
        key,
        root: sideGroup,
        bundles,
        wireframes: [],
        regionWires: [],
        bursts,
        label,
        getState,
      }
      sides.push(side)
      return side
    }

    const NT_STATE = SCROLL_STATES[0]
    buildSide(
      'nt',
      -SIDE_OFFSET_X,
      'NEUROTYPICAL',
      '#5eead4', // teal-300
      'baseline · 5/5 networks',
      '#99f6e4', // teal-200
      () => NT_STATE,
    )
    buildSide(
      'adhd',
      +SIDE_OFFSET_X,
      'NEURODIVERGENT',
      '#fbbf24', // amber-400
      '',        // sub-label updated per-frame from mode
      '#fde68a', // amber-200
      () => stateRef.current,
    )

    // Load brain GLB once. For each mesh in the GLB, classify its wireframe
    // edges into per-region buckets, then build one THREE.LineSegments per
    // bucket per side. Region coloring uses the brain's OWN edges — so an
    // active region literally lights up its own piece of the wireframe.
    //
    // Line rendering uses LineBasicMaterial (1px default, non-additive),
    // which means:
    //   - The lines stay thin and crisp (no white saturation).
    //   - Overlapping activations don't add; each region stays its own color.
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
          const posAttr = wireGeom.attributes.position as THREE.BufferAttribute
          const posArr = posAttr.array as Float32Array
          const segCount = posArr.length / 6  // 2 verts × 3 coords per segment

          // Bucket edges by region. Default bucket holds everything
          // unclassified, kept as a faint pink silhouette.
          const buckets: Record<string, number[]> = {
            default: [],
            prefrontal: [],
            dmn: [],
            dopamine: [],
            amygdala: [],
            workingMemory: [],
          }
          const worldVec = new THREE.Vector3()
          for (let i = 0; i < segCount; i++) {
            worldVec.set(posArr[i * 6 + 0], posArr[i * 6 + 1], posArr[i * 6 + 2])
            worldVec.applyMatrix4(m.matrixWorld)
            const ax = worldVec.x
            const ay = worldVec.y
            const az = worldVec.z
            worldVec.set(posArr[i * 6 + 3], posArr[i * 6 + 4], posArr[i * 6 + 5])
            worldVec.applyMatrix4(m.matrixWorld)
            const bx = worldVec.x
            const by = worldVec.y
            const bz = worldVec.z
            // Normalize midpoint into the centered-and-scaled frame so the
            // classifier sees coords in [-0.8, 0.8].
            const mx = ((ax + bx) / 2 - center.x) * scale
            const my = ((ay + by) / 2 - center.y) * scale
            const mz = ((az + bz) / 2 - center.z) * scale
            const bucket = classifyRegion(mx, my, mz) ?? 'default'
            buckets[bucket].push(ax, ay, az, bx, by, bz)
          }

          for (const s of sides) {
            // Very subtle flesh layer — just a hint of mass under the wires.
            // Clone geometry and transform to world space to match wireframe.
            const fleshGeom = g.clone()
            fleshGeom.applyMatrix4(m.matrixWorld)
            const flesh = new THREE.Mesh(
              fleshGeom,
              new THREE.MeshStandardMaterial({
                color: new THREE.Color('#b88080'),
                emissive: new THREE.Color('#2a0818'),
                emissiveIntensity: 0.25,
                roughness: 0.9,
                metalness: 0.0,
                transparent: true,
                opacity: 0.06,
                side: THREE.DoubleSide,
                depthWrite: false,
              }),
            )
            flesh.position.copy(center).multiplyScalar(-scale)
            flesh.scale.setScalar(scale)
            s.root.add(flesh)

            // Helper: build a THREE.LineSegments from a flat positions array.
            const buildLines = (positions: number[], color: number, opacity: number) => {
              const geom = new THREE.BufferGeometry()
              geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
              const mat = new THREE.LineBasicMaterial({
                color,
                transparent: true,
                opacity,
                depthWrite: false,
                toneMapped: false,
              })
              const line = new THREE.LineSegments(geom, mat)
              line.position.copy(center).multiplyScalar(-scale)
              line.scale.setScalar(scale)
              s.root.add(line)
              return { line, mat }
            }

            // Default (unclassified) wireframe — uniform faint pink.
            if (buckets.default.length) {
              const { line } = buildLines(buckets.default, 0xffb5c8, 0.28)
              s.wireframes.push(line)
            }

            // One LineSegments per region bucket. Opacity is driven per-
            // frame from activation; starts at 0 and is pushed to full
            // saturation when the region is active.
            for (const nkey of Object.keys(NETWORKS) as NetworkKey[]) {
              const seg = buckets[nkey]
              if (!seg || seg.length === 0) continue
              const colorHex = new THREE.Color(NETWORKS[nkey].color).getHex()
              const { line, mat } = buildLines(seg, colorHex, 0.0)
              // Accumulate lines + materials; multi-mesh GLBs contribute
              // multiple entries per region.
              let entry = s.regionWires.find((rw) => rw.key === nkey)
              if (!entry) {
                entry = { key: nkey, lines: [], materials: [] }
                s.regionWires.push(entry)
              }
              entry.lines.push(line)
              entry.materials.push(mat)
            }
          }
          // Don't dispose wireGeom — we used it to read positions only.
          wireGeom.dispose()
        })
      },
      undefined,
      (err) => {
        console.error('Brain GLB failed to load', err)
      },
    )

    // ── Pointer rotate ──
    let autoRotating = false  // brains stay still by default — user drags to rotate
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
      // Let auto-rotation resume after a long idle (8s) so the scene
      // doesn't feel permanently frozen if the user hovers away.
      autoRotateTimeout = setTimeout(() => { autoRotating = true }, 8000)
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    // ── Click → raycast against node orbs on either side ──
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const onClick = (e: MouseEvent) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const dragDistance = Math.sqrt(dx * dx + dy * dy)
      if (dragDistance > 5) return
      const rect = renderer.domElement.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      const targets = sides.flatMap((s) => s.bundles.map((b) => b.nodeMesh))
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
    let raf = 0
    let isVisible = false
    let lastAdhdMode: AdhdMode | null = null
    let lastFrameTime = performance.now()
    let accumulatedTime = 0

    const animate = () => {
      if (!isVisible) return

      const now = performance.now()
      const delta = Math.min((now - lastFrameTime) / 1000, 1 / 30)
      lastFrameTime = now
      accumulatedTime += delta

      const elapsed = accumulatedTime

      // Update ADHD brain label when mode changes
      const currentAdhdMode = adhdModeRef.current
      if (currentAdhdMode !== lastAdhdMode) {
        lastAdhdMode = currentAdhdMode
        const adhdSide = sides.find((s) => s.key === 'adhd')
        if (adhdSide) {
          const modeButton = MODE_BUTTONS.find((b) => b.mode === currentAdhdMode)
          const subLabel = modeButton ? `${modeButton.short} · ${modeButton.tag}` : ''
          updateTextSprite(
            adhdSide.label,
            'NEURODIVERGENT',
            '#fbbf24',
            '#fde68a',
            subLabel,
          )
        }
      }

      // Per-side update: glow sprites carry the region-of-activation story.
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

          // Node orb: small "you are here" marker. Color stays bright and
          // constant; opacity dims with activation so dimmed regions read
          // as absent rather than misleading bright dots.
          const i = b.currentIntensity
          const nodeMat = b.nodeMesh.material as THREE.MeshBasicMaterial
          nodeMat.opacity = Math.min(1, 0.3 + i * 0.7)
          nodeMat.color.copy(b.color).multiplyScalar(Math.min(2.0, 0.9 + i * 0.6))
          b.nodeMesh.scale.setScalar(0.6 + i * 0.5)
          b.nodeMesh.visible = i > 0.02
        }

        // The region wireframes are the primary visual: each region's
        // classified edges glow in the network's color when active. Thin
        // 1px LineBasicMaterial + non-additive blending keeps everything
        // crisp — no white saturation even when all 5 fire at hyperfocus.
        for (const rw of side.regionWires) {
          const i = intensity[rw.key] ?? 0
          const iC = Math.min(2.2, i)
          // Soft pulse at overdrive — a subtle "blazing" rhythm.
          const pulse = iC > 1.3 ? 0.92 + Math.sin(elapsed * 3.5) * 0.08 : 1
          const opacity = Math.min(1, iC * 0.9) * pulse
          // Brighten color multiplicatively — dimmed regions fade via
          // opacity, active ones saturate via color scaling.
          const tint = Math.min(2.2, 0.85 + iC * 0.6)
          for (const mat of rw.materials) {
            mat.opacity = opacity
            mat.color.set(NETWORKS[rw.key].color).multiplyScalar(tint)
          }
          for (const line of rw.lines) {
            line.visible = iC > 0.015
          }
        }

        // Overdrive bursts — only visible when a region is pushed past
        // baseline. Fast 7Hz pulse mimics fMRI BOLD-burst / phasic dopamine
        // firing visible in ADHD hyperfocus. Absent at NT baseline, where
        // regions run at intensity≈1.0 and overdrive=0. This is what makes
        // NT ≠ hyperfocus at a glance.
        for (const bu of side.bursts) {
          const i = intensity[bu.key] ?? 0
          const overdrive = Math.max(0, (i - 1.0) / 1.7)  // 0 at i≤1, 1 at i≥2.7
          if (overdrive < 0.01) {
            bu.sprite.visible = false
            continue
          }
          bu.sprite.visible = true
          const fastPulse = 0.75 + Math.sin(elapsed * 7 + bu.sprite.position.x * 4) * 0.25
          const slowPulse = 0.85 + Math.sin(elapsed * 2.3) * 0.15
          const scale = overdrive * 1.0 * fastPulse
          bu.sprite.scale.setScalar(scale)
          bu.material.opacity = Math.min(1, overdrive * 1.3 * slowPulse)
          bu.material.color
            .set(NETWORKS[bu.key].color)
            .multiplyScalar(2.2 + overdrive * 0.8)
        }

        // Default wireframe breathes lightly with total activity so all-off
        // crash reads darker than a fully-lit hyperfocus brain — but the
        // silhouette is always visible.
        const totalActivity = Object.values(intensity).reduce<number>(
          (acc, v) => acc + (v ?? 0),
          0,
        )
        const wireOpacity = 0.12 + Math.min(0.2, totalActivity * 0.04)
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
          lastFrameTime = performance.now()
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
      sharedGlowTexture.dispose()
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
            const mat = (mesh as THREE.Sprite).material as THREE.SpriteMaterial | undefined
            if (mat) {
              // Don't dispose mat.map here — it's the shared texture
              mat.dispose()
            }
          }
        })
      }
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [webglFailed, handleNetworkClick])


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

      {/* Interaction hint — sits below the canvas, right side, so it never
          collides with the "With AI Scaffolding" mode pill. */}
      <div className="pointer-events-none absolute bottom-6 right-4 z-10 hidden md:block">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-mono text-white/70 backdrop-blur-sm">
          <span aria-hidden>↻</span>
          drag the brains to rotate
        </span>
      </div>
    </div>
  )
}
