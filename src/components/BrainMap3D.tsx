'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
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
  // Line tubes (one per curve) — we use thin tubes so they can be seen
  tubeMeshes: THREE.Mesh[]
  // Signal particles that travel along curves
  signals: {
    curveIndex: number
    t: number
    mesh: THREE.Mesh
    speed: number
  }[]
  // Anchor orb (the "node" at the region centroid)
  nodeMesh: THREE.Mesh
  targetIntensity: number
  currentIntensity: number
}

export default function BrainMap3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey | null>(null)
  const [currentState, setCurrentState] = useState(SCROLL_STATES[0])
  const [webglFailed, setWebglFailed] = useState(false)
  const stateRef = useRef(SCROLL_STATES[0])

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
    let matched = SCROLL_STATES[0]
    for (const state of SCROLL_STATES) {
      if (scrollProgress >= state.threshold) matched = state
    }
    setCurrentState(matched)
  }, [scrollProgress])

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
      // What state drives this side's activation.
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

        const tubeMeshes: THREE.Mesh[] = curves.map((curve) => {
          // Thicker tubes + additive blending → electric "bioluminescent" look
          // that stands out dramatically against the pink brain tissue.
          const tubeGeom = new THREE.TubeGeometry(curve, 48, 0.012, 8, false)
          const mat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            toneMapped: false,
          })
          const mesh = new THREE.Mesh(tubeGeom, mat)
          sideGroup.add(mesh)
          return mesh
        })

        const signals: FiberBundle['signals'] = []
        const signalsPerFiber = 4
        for (let ci = 0; ci < curves.length; ci++) {
          for (let si = 0; si < signalsPerFiber; si++) {
            // Larger sparkles with additive blending — visible as bright
            // flares moving along each fiber, reading as "electrical activity".
            const sphereGeom = new THREE.SphereGeometry(0.028, 10, 10)
            const sMat = new THREE.MeshBasicMaterial({
              color: new THREE.Color('#ffffff').lerp(color, 0.3),
              transparent: true,
              opacity: 1.0,
              depthWrite: false,
              toneMapped: false,
              blending: THREE.AdditiveBlending,
            })
            const m = new THREE.Mesh(sphereGeom, sMat)
            sideGroup.add(m)
            signals.push({
              curveIndex: ci,
              t: (si / signalsPerFiber + Math.random() * 0.15) % 1,
              mesh: m,
              speed: 0.25 + Math.random() * 0.25,
            })
          }
        }

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
          tubeMeshes,
          signals,
          nodeMesh,
          targetIntensity: 1,
          currentIntensity: 1,
        }
      })

      const side: Side = { key, root: sideGroup, bundles, getState }
      sides.push(side)
      return side
    }

    const NT_STATE = SCROLL_STATES[0]
    buildSide('nt', -SIDE_OFFSET_X, () => NT_STATE)
    buildSide('adhd', +SIDE_OFFSET_X, () => stateRef.current)

    // Load brain GLB once, clone geometry into each side.
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

          for (const s of sides) {
            const flesh = new THREE.Mesh(
              g,
              new THREE.MeshStandardMaterial({
                color: new THREE.Color('#d5a5a5'),
                emissive: new THREE.Color('#2a1018'),
                emissiveIntensity: 0.4,
                roughness: 0.85,
                metalness: 0.0,
                transparent: true,
                opacity: 0.15,
                side: THREE.DoubleSide,
                depthWrite: false,
              })
            )
            flesh.position.copy(center).multiplyScalar(-scale)
            flesh.scale.setScalar(scale)
            s.root.add(flesh)

            const wireGeomLocal = new THREE.WireframeGeometry(g)
            const wireLine = new THREE.LineSegments(
              wireGeomLocal,
              new THREE.LineBasicMaterial({
                color: new THREE.Color('#ffb5c8'),
                transparent: true,
                opacity: 0.55,
                depthWrite: false,
                toneMapped: false,
              })
            )
            wireLine.position.copy(center).multiplyScalar(-scale)
            wireLine.scale.setScalar(scale)
            s.root.add(wireLine)
          }
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
    const tmp = new THREE.Vector3()

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 1 / 30)
      const state = stateRef.current

      // Update each side's bundles with its own driving state.
      // IMPORTANT: dimmed networks fade to fully invisible so the NT and ADHD
      // brains actually look different (not just different brightness).
      for (const side of sides) {
        const sideState = side.getState()
        const boost = sideState.boost ?? 1
        for (const b of side.bundles) {
          b.targetIntensity = sideState.active.includes(b.key)
            ? 1 * boost
            : sideState.dimmed.includes(b.key)
              ? 0
              : 0.15
          b.currentIntensity += (b.targetIntensity - b.currentIntensity) * delta * 4

          const i = b.currentIntensity
          // Clamped opacity (so overdriven tubes still render solid) vs raw
          // intensity for emissive/scale where overbright is the point.
          const iOpacity = Math.min(1, i)
          const visible = i > 0.02
          for (const tm of b.tubeMeshes) {
            tm.visible = visible
            const mat = tm.material as THREE.MeshBasicMaterial
            // Additive blending + overbright color when i > 1 = bloom-like glow
            mat.opacity = iOpacity * iOpacity
            mat.color.copy(b.color).multiplyScalar(Math.min(2.2, 0.9 + i * 0.8))
          }
          const nodeMat = b.nodeMesh.material as THREE.MeshBasicMaterial
          b.nodeMesh.visible = visible
          nodeMat.opacity = iOpacity * iOpacity
          nodeMat.color.copy(b.color).multiplyScalar(Math.min(2.2, 0.9 + i * 0.9))
          b.nodeMesh.scale.setScalar(0.6 + i * 0.8) // pulses bigger in hyperfocus

          for (const s of b.signals) {
            s.t = (s.t + delta * s.speed * (0.3 + i * 0.7)) % 1
            b.curves[s.curveIndex].getPointAt(s.t, tmp)
            s.mesh.position.copy(tmp)
            const sMat = s.mesh.material as THREE.MeshBasicMaterial
            s.mesh.visible = i > 0.25
            sMat.opacity = i > 0.25 ? Math.min(1, 0.6 + i * 0.4) : 0
            s.mesh.scale.setScalar(0.7 + Math.min(1.5, i) * 0.8)
          }
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
          for (const tm of b.tubeMeshes) {
            ;(tm.geometry as THREE.BufferGeometry).dispose()
            ;(tm.material as THREE.Material).dispose()
          }
          for (const s of b.signals) {
            ;(s.mesh.geometry as THREE.BufferGeometry).dispose()
            ;(s.mesh.material as THREE.Material).dispose()
          }
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
