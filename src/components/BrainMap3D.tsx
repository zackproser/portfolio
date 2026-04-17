'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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
  // Fiber endpoints: each pair [a, b] becomes a smooth curve from a to b.
  // The curve arcs outward from the midpoint to suggest a fiber tract.
  fibers: [Vec3, Vec3][]
}

const NETWORKS = {
  prefrontal: {
    color: '#ff6b35',
    label: 'Prefrontal Cortex',
    description: 'Executive function, planning, prioritization',
    anchor: [0, 0.2, 0.85] as Vec3,
    fibers: [
      [[-0.25, 0.25, 0.9], [0.25, 0.25, 0.9]],
      [[-0.35, 0.15, 0.8], [0.35, 0.15, 0.8]],
      [[-0.2, 0.35, 0.75], [0.2, 0.35, 0.75]],
      [[0, 0.3, 0.9], [0, 0, 0.2]],
      [[-0.3, 0.2, 0.85], [-0.4, 0.0, 0.3]],
      [[0.3, 0.2, 0.85], [0.4, 0.0, 0.3]],
      [[-0.15, 0.3, 0.85], [0.15, 0.1, 0.5]],
      [[0.15, 0.3, 0.85], [-0.15, 0.1, 0.5]],
    ] as [Vec3, Vec3][],
  },
  dmn: {
    color: '#4ecdc4',
    label: 'Default Mode Network',
    description: 'Mind-wandering, internal chatter, "brain radio"',
    anchor: [0, 0.1, -0.15] as Vec3,
    fibers: [
      [[0, 0.35, 0.5], [0, 0.1, -0.3]],
      [[0, 0.1, -0.3], [0, -0.1, -0.75]],
      [[-0.35, 0.25, 0.2], [0.35, 0.25, 0.2]],
      [[-0.4, 0.1, -0.3], [0.4, 0.1, -0.3]],
      [[0, 0.4, 0.2], [-0.35, 0.05, -0.5]],
      [[0, 0.4, 0.2], [0.35, 0.05, -0.5]],
      [[-0.3, 0.3, -0.1], [0.3, 0.3, -0.1]],
      [[0, 0.3, 0.6], [0, 0, -0.7]],
    ] as [Vec3, Vec3][],
  },
  dopamine: {
    color: '#ffe66d',
    label: 'Dopamine Pathways',
    description: 'Reward, motivation, interest-based activation',
    anchor: [0, -0.1, 0.05] as Vec3,
    fibers: [
      [[0, -0.2, -0.35], [0, 0.0, 0.15]],
      [[0, 0.0, 0.15], [0, 0.25, 0.8]],
      [[0, -0.15, -0.25], [-0.25, 0.1, 0.1]],
      [[0, -0.15, -0.25], [0.25, 0.1, 0.1]],
      [[-0.15, -0.05, 0.05], [-0.3, 0.15, 0.6]],
      [[0.15, -0.05, 0.05], [0.3, 0.15, 0.6]],
      [[0, -0.2, -0.3], [0, -0.15, 0.4]],
    ] as [Vec3, Vec3][],
  },
  amygdala: {
    color: '#ff6b6b',
    label: 'Amygdala',
    description: 'Emotional urgency, everything-feels-urgent signal',
    anchor: [0.3, -0.15, 0.1] as Vec3,
    fibers: [
      [[-0.3, -0.15, 0.1], [0.3, -0.15, 0.1]],
      [[0.3, -0.15, 0.1], [0.4, 0.15, 0.7]],
      [[-0.3, -0.15, 0.1], [-0.4, 0.15, 0.7]],
      [[0.3, -0.15, 0.1], [0.1, -0.1, -0.4]],
      [[-0.3, -0.15, 0.1], [-0.1, -0.1, -0.4]],
      [[0.3, -0.15, 0.1], [0.0, 0.35, 0.85]],
      [[-0.3, -0.15, 0.1], [0.0, 0.35, 0.85]],
    ] as [Vec3, Vec3][],
  },
  workingMemory: {
    color: '#c44dff',
    label: 'Working Memory',
    description: 'Volatile cache — context that leaks on interruption',
    anchor: [-0.4, 0.3, 0.5] as Vec3,
    fibers: [
      [[-0.4, 0.3, 0.5], [0.4, 0.3, 0.5]],
      [[-0.4, 0.3, 0.5], [-0.4, 0.3, -0.2]],
      [[0.4, 0.3, 0.5], [0.4, 0.3, -0.2]],
      [[-0.4, 0.3, 0.5], [0, 0.3, 0.85]],
      [[0.4, 0.3, 0.5], [0, 0.3, 0.85]],
      [[-0.4, 0.3, 0.5], [-0.3, 0, -0.2]],
      [[0.4, 0.3, 0.5], [0.3, 0, -0.2]],
    ] as [Vec3, Vec3][],
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
    threshold: 0.45,
    active: ['dopamine', 'prefrontal', 'workingMemory'],
    dimmed: ['dmn', 'amygdala'],
    title: 'Hyperfocus — three networks fire at 180%, nothing else exists',
    boost: 1.8,
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

// ─── Fiber curve builder ────────────────────────────────────────────────────
// Build a smooth curve between two anchor points that arcs outward through
// the brain. We use CatmullRomCurve3 with a midpoint pulled outward along
// the midpoint's normal.
function buildFiberCurve(a: Vec3, b: Vec3): THREE.CatmullRomCurve3 {
  const pa = new THREE.Vector3().fromArray(a)
  const pb = new THREE.Vector3().fromArray(b)
  const mid = pa.clone().add(pb).multiplyScalar(0.5)
  // Outward bulge: push mid along its radial
  const radial = mid.clone().normalize()
  const bulge = 0.15 + Math.random() * 0.1
  const midOut = mid.clone().addScaledVector(radial, bulge)
  // Slight lateral jitter for organic variance
  const jitter = new THREE.Vector3(
    (Math.random() - 0.5) * 0.06,
    (Math.random() - 0.5) * 0.06,
    (Math.random() - 0.5) * 0.06
  )
  midOut.add(jitter)
  return new THREE.CatmullRomCurve3([pa, midOut, pb], false, 'centripetal', 0.5)
}

type FiberBundle = {
  key: NetworkKey
  color: THREE.Color
  curves: THREE.CatmullRomCurve3[]
  nodeMesh: THREE.Mesh
  targetIntensity: number
  currentIntensity: number
}

// ─── Anatomical classifier ──────────────────────────────────────────────────
// Takes a normalized position (in the brain-centered, scaled frame where the
// whole brain fits in ±1) and returns which network "owns" that point, or null
// if it belongs to the default (uncolored) surface.
//
// NOTE on axes: the loaded brain GLB appears to have +X as the anterior-
// posterior axis (brain is longest along X). The empirical convention we use:
//   nx > 0  → front of brain (frontal lobes)
//   nx < 0  → back of brain (occipital / cerebellum)
//   ny > 0  → top (dorsal)
//   ny < 0  → bottom (ventral) — temporal lobes, cerebellum
//   nz      → lateral (hemispheres)
//
// If regions end up on the wrong side after render we flip the nx sign or
// swap nx/nz in this function.
function classifyRegion(nx: number, ny: number, nz: number): NetworkKey | null {
  // Prefrontal: very anterior top (frontal pole + dorsolateral PFC). Keep
  // this first so it wins over the wider working-memory band in the overlap.
  if (nx > 0.3 && ny > -0.05) return 'prefrontal'
  // Working memory / dlPFC: lateral frontal (sides of the frontal lobe).
  if (nx > 0.05 && ny > 0.05 && Math.abs(nz) > 0.22) return 'workingMemory'
  // DMN: medial strip running from frontal-medial through posterior-medial
  // (mPFC + posterior cingulate). Narrow z band, most of the x range.
  if (Math.abs(nz) < 0.1 && nx > -0.4 && nx < 0.5) return 'dmn'
  // Amygdala: deep temporal — low ventral lateral. Wireframe surface only
  // approximates this; the "real" amygdala is subcortical, so an internal
  // line cluster is added separately inside the brain.
  if (ny < -0.12 && Math.abs(nz) > 0.18 && nx > -0.15 && nx < 0.4) return 'amygdala'
  // Dopamine/striatum is subcortical; no surface mapping, handled as an
  // internal structure elsewhere.
  return null
}

type RegionWire = {
  key: NetworkKey
  lines: THREE.LineSegments
  material: THREE.LineBasicMaterial
}

export default function BrainMap3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey | null>(null)
  const [webglFailed, setWebglFailed] = useState(false)
  const stateRef = useRef(SCROLL_STATES[0])

  const currentState = useMemo(() => {
    let matched = SCROLL_STATES[0]
    for (const state of SCROLL_STATES) {
      if (scrollProgress >= state.threshold) matched = state
    }
    return matched
  }, [scrollProgress])

  useEffect(() => {
    stateRef.current = currentState
  }, [currentState])

  const handleNetworkClick = useCallback((key: NetworkKey) => {
    setSelectedNetwork(prev => (prev === key ? null : key))
  }, [])

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const elementHeight = rect.height
    const start = rect.top
    const progress = Math.max(
      0,
      Math.min(1, (-start + viewportHeight * 0.3) / (elementHeight + viewportHeight * 0.3))
    )
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (webglFailed) return
    const host = canvasHostRef.current
    if (!host) return

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
      // Region-colored wireframe overlays on the brain surface. One per
      // anatomical network; populated after GLB load.
      regionWires: RegionWire[]
      // Internal small structures (amygdala, dopamine/striatum, DMN hub).
      // Populated after GLB load; glow when their network is active.
      internals: { key: NetworkKey; mesh: THREE.LineSegments; material: THREE.LineBasicMaterial }[]
      // Default (unclassified) wireframe — stays the base pink color.
      defaultWire: THREE.LineSegments | null
      getState: () => typeof SCROLL_STATES[number]
    }

    const sides: Side[] = []
    let disposedDuringLoad = false

    function buildSide(key: SideKey, offsetX: number, getState: Side['getState']): Side {
      const sideGroup = new THREE.Group()
      sideGroup.position.x = offsetX
      root.add(sideGroup)

      // Fiber bundles for this side
      const bundles: FiberBundle[] = (Object.keys(NETWORKS) as NetworkKey[]).map((nkey) => {
        const net = NETWORKS[nkey]
        const color = new THREE.Color(net.color)
        const curves: THREE.CatmullRomCurve3[] = net.fibers.map((p) => buildFiberCurve(p[0], p[1]))

        const nodeGeom = new THREE.SphereGeometry(0.055, 20, 20)
        const nodeMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 1.0,
          toneMapped: false,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat)
        nodeMesh.position.fromArray(net.anchor)
        nodeMesh.userData.networkKey = nkey
        sideGroup.add(nodeMesh)

        return {
          key: nkey,
          color,
          curves,
          nodeMesh,
          targetIntensity: 1,
          currentIntensity: 1,
        }
      })

      const side: Side = {
        key,
        root: sideGroup,
        bundles,
        regionWires: [],
        internals: [],
        defaultWire: null,
        getState,
      }
      sides.push(side)
      return side
    }

    const NT_STATE = SCROLL_STATES[0]
    buildSide('nt', -SIDE_OFFSET_X, () => NT_STATE)
    buildSide('adhd', +SIDE_OFFSET_X, () => stateRef.current)

    // Load brain GLB once. For each side we build:
    //   - A translucent flesh layer (same pink base tissue both sides)
    //   - A default wireframe (pink) for unclassified edges
    //   - 5 per-region wireframes — same lines of the brain, but the ones
    //     classified as belonging to a network. When that network is active
    //     these segments glow in the network's color, painting the region
    //     onto the brain surface.
    //   - Internal tiny line clusters for deep/subcortical structures
    //     (amygdala, dopamine/striatum, DMN hub) — anatomically positioned
    //     inside the brain since surface wireframe can't represent them.
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

          // Build the wireframe once; split into per-region buckets.
          const wireGeom = new THREE.WireframeGeometry(g)
          const wirePosAttr = wireGeom.attributes.position as THREE.BufferAttribute
          const wirePosArr = wirePosAttr.array as Float32Array
          const segCount = wirePosArr.length / 6 // each segment = 2 verts * 3 coords

          // Buckets keyed by NetworkKey | 'default'
          const buckets: Record<string, number[]> = {
            default: [],
            prefrontal: [],
            dmn: [],
            dopamine: [],
            amygdala: [],
            workingMemory: [],
          }

          for (let si = 0; si < segCount; si++) {
            const ax = wirePosArr[si * 6 + 0]
            const ay = wirePosArr[si * 6 + 1]
            const az = wirePosArr[si * 6 + 2]
            const bx = wirePosArr[si * 6 + 3]
            const by = wirePosArr[si * 6 + 4]
            const bz = wirePosArr[si * 6 + 5]
            // Normalize midpoint to the centered+scaled frame
            const mx = ((ax + bx) / 2 - center.x) * scale
            const my = ((ay + by) / 2 - center.y) * scale
            const mz = ((az + bz) / 2 - center.z) * scale
            const region = classifyRegion(mx, my, mz) ?? 'default'
            const bucket = buckets[region]
            bucket.push(ax, ay, az, bx, by, bz)
          }

          for (const s of sides) {
            // Flesh layer (translucent)
            const flesh = new THREE.Mesh(
              g,
              new THREE.MeshStandardMaterial({
                color: new THREE.Color('#b88080'),
                emissive: new THREE.Color('#1a0612'),
                emissiveIntensity: 0.25,
                roughness: 0.9,
                metalness: 0.0,
                transparent: true,
                opacity: 0.12,
                side: THREE.DoubleSide,
                depthWrite: false,
              })
            )
            flesh.position.copy(center).multiplyScalar(-scale)
            flesh.scale.setScalar(scale)
            s.root.add(flesh)

            // Helper to build a LineSegments from a flat position bucket
            const buildLines = (positions: number[], color: number, opacity: number, additive = false) => {
              const geom = new THREE.BufferGeometry()
              geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
              const mat = new THREE.LineBasicMaterial({
                color: new THREE.Color(color),
                transparent: true,
                opacity,
                depthWrite: false,
                toneMapped: false,
                ...(additive ? { blending: THREE.AdditiveBlending } : {}),
              })
              const line = new THREE.LineSegments(geom, mat)
              line.position.copy(center).multiplyScalar(-scale)
              line.scale.setScalar(scale)
              s.root.add(line)
              return { line, mat }
            }

            // Default (unclassified) wireframe — faint pink
            if (buckets.default.length) {
              const { line } = buildLines(buckets.default, 0xffb5c8, 0.35)
              s.defaultWire = line
            }

            // Per-region wireframes — color is the network's color, opacity
            // starts low; boosted to full when active.
            for (const key of Object.keys(NETWORKS) as NetworkKey[]) {
              const seg = buckets[key]
              if (!seg || seg.length === 0) continue
              const colorHex = new THREE.Color(NETWORKS[key].color).getHex()
              const { line, mat } = buildLines(seg, colorHex, 0.25, true)
              s.regionWires.push({ key, lines: line, material: mat })
            }

            // Internal structures (subcortical / medial hubs) — small line
            // bundles at anatomical positions, rendered additive so they
            // read as bright glowing clusters when their network is active.
            const buildInternalCluster = (center3: Vec3, radius: number, count: number, colorHex: number) => {
              // Build a cluster of ~count short random segments centered at center3.
              const positions: number[] = []
              for (let k = 0; k < count; k++) {
                const theta1 = Math.random() * Math.PI * 2
                const phi1 = Math.acos(2 * Math.random() - 1)
                const r1 = radius * (0.4 + Math.random() * 0.6)
                const x1 = center3[0] + r1 * Math.sin(phi1) * Math.cos(theta1)
                const y1 = center3[1] + r1 * Math.sin(phi1) * Math.sin(theta1)
                const z1 = center3[2] + r1 * Math.cos(phi1)
                const theta2 = Math.random() * Math.PI * 2
                const phi2 = Math.acos(2 * Math.random() - 1)
                const r2 = radius * (0.4 + Math.random() * 0.6)
                const x2 = center3[0] + r2 * Math.sin(phi2) * Math.cos(theta2)
                const y2 = center3[1] + r2 * Math.sin(phi2) * Math.sin(theta2)
                const z2 = center3[2] + r2 * Math.cos(phi2)
                positions.push(x1, y1, z1, x2, y2, z2)
              }
              const geomI = new THREE.BufferGeometry()
              geomI.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
              const matI = new THREE.LineBasicMaterial({
                color: new THREE.Color(colorHex),
                transparent: true,
                opacity: 0.25,
                depthWrite: false,
                toneMapped: false,
                blending: THREE.AdditiveBlending,
              })
              const lineI = new THREE.LineSegments(geomI, matI)
              s.root.add(lineI)
              return { line: lineI, mat: matI }
            }

            // Amygdala — bilateral, deep temporal
            {
              const colorHex = new THREE.Color(NETWORKS.amygdala.color).getHex()
              for (const sign of [-1, 1]) {
                const { line, mat } = buildInternalCluster([0.1 * sign, -0.2, 0.3 * sign], 0.08, 12, colorHex)
                s.internals.push({ key: 'amygdala', mesh: line, material: mat })
              }
            }
            // Dopamine/striatum — central deep
            {
              const colorHex = new THREE.Color(NETWORKS.dopamine.color).getHex()
              const { line, mat } = buildInternalCluster([0.05, -0.05, 0], 0.1, 18, colorHex)
              s.internals.push({ key: 'dopamine', mesh: line, material: mat })
            }
            // DMN posterior-cingulate hub — medial
            {
              const colorHex = new THREE.Color(NETWORKS.dmn.color).getHex()
              const { line, mat } = buildInternalCluster([-0.1, 0.1, 0], 0.09, 14, colorHex)
              s.internals.push({ key: 'dmn', mesh: line, material: mat })
            }
          }

          wireGeom.dispose() // only used to extract positions
        })
      },
      undefined,
      (err) => {
        console.error('Brain GLB failed to load', err)
      }
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
      const allNodes = sides.flatMap((s) => s.bundles.map((b) => b.nodeMesh))
      const hits = raycaster.intersectObjects(allNodes, false)
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

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 1 / 30)

      // Per-side update: drive activation into the brain's own wireframe
      // (region-classified edges glow in network colors) + internal
      // subcortical line clusters. Fiber tubes/signals are hidden now — the
      // brain surface itself is the canvas.
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
          b.currentIntensity += (b.targetIntensity - b.currentIntensity) * delta * 4
          intensity[b.key] = b.currentIntensity

          // Node orb stays as the region's raycast target; small and subtle.
          const i = b.currentIntensity
          const iOpacity = Math.min(1, i)
          const visible = i > 0.02
          b.nodeMesh.visible = visible
          const nodeMat = b.nodeMesh.material as THREE.MeshBasicMaterial
          nodeMat.opacity = iOpacity * iOpacity
          nodeMat.color.copy(b.color).multiplyScalar(Math.min(2.0, 0.85 + i * 0.8))
          b.nodeMesh.scale.setScalar(0.55 + i * 0.55)
        }

        // Brain-surface wireframe: each region's classified edges glow in
        // that network's color when active. Dimmed regions fade to 0.
        for (const rw of side.regionWires) {
          const i = intensity[rw.key] ?? 0
          const iOpacity = Math.min(1, i)
          rw.material.opacity = 0.08 + iOpacity * 0.92
          rw.material.color.set(NETWORKS[rw.key].color).multiplyScalar(Math.min(2.2, 0.9 + i * 0.9))
          rw.lines.visible = i > 0.02
        }

        // Internal line clusters for subcortical regions.
        for (const intern of side.internals) {
          const i = intensity[intern.key] ?? 0
          const iOpacity = Math.min(1, i)
          intern.material.opacity = iOpacity * iOpacity
          intern.material.color.set(NETWORKS[intern.key].color).multiplyScalar(Math.min(2.2, 0.9 + i * 0.9))
          intern.mesh.visible = i > 0.05
        }

        // Default wireframe fades when many networks are active — let the
        // colored regions dominate during hyperfocus / baseline NT.
        if (side.defaultWire) {
          const totalActivity = Object.values(intensity).reduce<number>((acc, v) => acc + (v ?? 0), 0)
          const faded = Math.max(0.1, 0.45 - totalActivity * 0.06)
          ;(side.defaultWire.material as THREE.LineBasicMaterial).opacity = faded
        }
      }

      // Rotate
      if (autoRotating) rotY += delta * 0.15
      root.rotation.y = rotY
      root.rotation.x = rotX

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
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
          const mesh = n as THREE.Mesh | THREE.LineSegments
          if ((mesh as THREE.Mesh).isMesh || (mesh as THREE.LineSegments).isLineSegments) {
            const geom = mesh.geometry as THREE.BufferGeometry | undefined
            const mat = mesh.material as THREE.Material | undefined
            geom?.dispose()
            mat?.dispose()
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
      className="relative w-full my-8 rounded-2xl overflow-hidden"
      style={{ minHeight: '560px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118]" />

      {/* Split labels — NT (left) / ADHD (right) with live activation count */}
      <div className="absolute top-4 left-0 right-0 z-10 grid grid-cols-2 gap-2 px-6 pointer-events-none">
        <div className="text-center">
          <p className="text-[11px] font-mono uppercase tracking-widest text-teal-300">Neurotypical</p>
          <p className="text-[10px] font-mono text-teal-200/70 mt-0.5">
            <span className="font-bold text-teal-300">5 / 5</span> networks online
          </p>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-mono uppercase tracking-widest text-amber-400">ADHD</p>
          <p className="text-[10px] font-mono text-amber-300/80 mt-0.5 truncate px-2">
            <span className="font-bold text-amber-300">{currentState.active.length} / 5</span>
            {' · '}
            {currentState.title.split(' — ')[1] ?? currentState.title}
          </p>
        </div>
      </div>

      {/* Vertical divider between the two brains */}
      <div className="absolute top-20 bottom-14 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Center progress bar for the ADHD side's scroll state */}
      <div className="absolute top-14 left-1/4 right-1/4 z-10 pointer-events-none">
        <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-300"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {selectedNetwork && (
        <div className="absolute bottom-14 left-4 right-4 z-10 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <p className="text-sm font-bold" style={{ color: NETWORKS[selectedNetwork].color }}>
            {NETWORKS[selectedNetwork].label}
          </p>
          <p className="text-xs text-white/70 mt-1">
            {NETWORKS[selectedNetwork].description}
          </p>
        </div>
      )}

      {/* Canvas */}
      <div className="relative w-full" style={{ height: '520px' }}>
        <div ref={canvasHostRef} className="absolute inset-0" />
        {webglFailed && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-xs font-mono text-amber-400/80">
              3D rendering unavailable. {currentState.title}
            </p>
          </div>
        )}
      </div>

      {/* Legend row — bottom, flat */}
      <div className="absolute bottom-1 left-0 right-0 z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 pb-2">
        {(Object.entries(NETWORKS) as [NetworkKey, NetworkDef][]).map(([key, net]) => (
          <button
            key={key}
            type="button"
            className="flex items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity bg-transparent border-0 p-0"
            onClick={() => handleNetworkClick(key)}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{
                backgroundColor: net.color,
                opacity: currentState.active.includes(key) ? 1 : 0.3,
                boxShadow: currentState.active.includes(key) ? `0 0 6px ${net.color}` : 'none',
              }}
            />
            <span className="text-[10px] text-white/60 font-mono">{net.label}</span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-1 right-3 z-10 pointer-events-none">
        <p className="text-[9px] text-white/25 font-mono hidden md:block">drag · click nodes · scroll</p>
      </div>
    </div>
  )
}
