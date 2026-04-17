'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'

const REGIONS = {
  prefrontal: {
    position: [0, 0.6, 0.8] as [number, number, number],
    scale: 0.35,
    color: '#ff6b35',
    label: 'Prefrontal Cortex',
    description: 'Executive function, planning, prioritization',
  },
  dmn: {
    position: [0, 0.2, -0.4] as [number, number, number],
    scale: 0.3,
    color: '#4ecdc4',
    label: 'Default Mode Network',
    description: 'Mind-wandering, internal chatter, "brain radio"',
  },
  dopamine: {
    position: [0, -0.2, 0.3] as [number, number, number],
    scale: 0.25,
    color: '#ffe66d',
    label: 'Dopamine Pathways',
    description: 'Reward, motivation, interest-based activation',
  },
  amygdala: {
    position: [0.5, -0.3, 0.2] as [number, number, number],
    scale: 0.2,
    color: '#ff6b6b',
    label: 'Amygdala',
    description: 'Emotional urgency, everything-feels-urgent signal',
  },
  workingMemory: {
    position: [-0.5, 0.4, 0.4] as [number, number, number],
    scale: 0.22,
    color: '#c44dff',
    label: 'Working Memory',
    description: 'Volatile cache — context that leaks on interruption',
  },
}

type RegionKey = keyof typeof REGIONS

const SCROLL_STATES: { threshold: number; active: RegionKey[]; dimmed: RegionKey[]; title: string }[] = [
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
    title: 'Hyperfocus — dopamine floods, everything else quiets',
  },
  {
    threshold: 0.6,
    active: ['dmn'],
    dimmed: ['prefrontal', 'dopamine', 'workingMemory', 'amygdala'],
    title: 'The void after the win — dopamine pipeline shuts off',
  },
  {
    threshold: 0.75,
    active: ['prefrontal', 'dopamine', 'workingMemory'],
    dimmed: ['dmn', 'amygdala'],
    title: 'With AI scaffolding — external systems compensate',
  },
]

type RegionMesh = {
  key: RegionKey
  group: THREE.Group
  core: THREE.Mesh
  glow: THREE.Mesh
  targetIntensity: number
  currentIntensity: number
}

export default function BrainMap3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | null>(null)
  const [currentState, setCurrentState] = useState(SCROLL_STATES[0])
  const [webglFailed, setWebglFailed] = useState(false)
  const stateRef = useRef(SCROLL_STATES[0])

  useEffect(() => {
    stateRef.current = currentState
  }, [currentState])

  const handleRegionClick = useCallback((key: RegionKey) => {
    setSelectedRegion(prev => (prev === key ? null : key))
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

  // Vanilla three.js canvas setup
  useEffect(() => {
    if (webglFailed) return
    const host = canvasHostRef.current
    if (!host) return

    let width = host.clientWidth || 600
    let height = host.clientHeight || 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1, 3.5)
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
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const warmLight = new THREE.PointLight(0xffe66d, 0.8, 20)
    warmLight.position.set(5, 5, 5)
    scene.add(warmLight)
    const coolLight = new THREE.PointLight(0x4ecdc4, 0.5, 20)
    coolLight.position.set(-5, -5, 5)
    scene.add(coolLight)

    // Outer brain shell (wireframe)
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x4ecdc4,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      })
    )
    scene.add(shell)

    // Root group we rotate together (the "float" + auto-rotate behavior)
    const root = new THREE.Group()
    scene.add(root)

    // Regions
    const regionMeshes: RegionMesh[] = (Object.keys(REGIONS) as RegionKey[]).map((key) => {
      const { position, scale, color } = REGIONS[key]
      const group = new THREE.Group()
      group.position.set(position[0], position[1], position[2])

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(scale, 32, 32),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          emissive: new THREE.Color(color),
          emissiveIntensity: 0.5,
          roughness: 0.3,
          metalness: 0.1,
          transparent: true,
          opacity: 0.8,
        })
      )
      core.userData.regionKey = key

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(scale * 1.5, 20, 20),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        })
      )

      group.add(glow)
      group.add(core)
      root.add(group)

      return { key, group, core, glow, targetIntensity: 1, currentIntensity: 1 }
    })

    // Particle cloud
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.8 + Math.random() * 0.6
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }
    const particleGeom = new THREE.BufferGeometry()
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x4ecdc4,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeom, particleMat)
    root.add(particles)

    // Pointer drag / auto-rotate
    let autoRotating = true
    let dragging = false
    let lastX = 0
    let lastY = 0
    let rotY = 0
    let rotX = 0
    const clampX = (v: number) => Math.max(-0.6, Math.min(0.6, v))

    const onDown = (e: PointerEvent) => {
      dragging = true
      autoRotating = false
      lastX = e.clientX
      lastY = e.clientY
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
      // Resume auto-rotate after a short delay
      setTimeout(() => { autoRotating = true }, 2000)
    }

    renderer.domElement.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    // Click → raycast against region cores
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(regionMeshes.map((r) => r.core), false)
      if (hits.length > 0) {
        const key = hits[0].object.userData.regionKey as RegionKey
        if (key) handleRegionClick(key)
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

    // Animation loop
    const clock = new THREE.Clock()
    let raf = 0

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 1 / 30)
      const state = stateRef.current

      // Update region intensities
      for (const rm of regionMeshes) {
        const target = state.active.includes(rm.key) ? 1 : state.dimmed.includes(rm.key) ? 0.15 : 0.5
        rm.targetIntensity = target
        rm.currentIntensity += (rm.targetIntensity - rm.currentIntensity) * delta * 3
        const mat = rm.core.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = rm.currentIntensity * 0.9
        mat.opacity = 0.3 + rm.currentIntensity * 0.7
        const gmat = rm.glow.material as THREE.MeshBasicMaterial
        gmat.opacity = rm.currentIntensity * 0.18
        const s = 1 + rm.currentIntensity * 0.4
        rm.glow.scale.setScalar(s)
      }

      // Particle drift
      const speed = state.active.length > 3 ? 2 : state.active.length > 1 ? 1 : 0.3
      const posAttr = particleGeom.getAttribute('position') as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3] += velocities[i * 3] * speed * delta * 60
        arr[i * 3 + 1] += velocities[i * 3 + 1] * speed * delta * 60
        arr[i * 3 + 2] += velocities[i * 3 + 2] * speed * delta * 60
        const dx = arr[i * 3]
        const dy = arr[i * 3 + 1]
        const dz = arr[i * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist > 1.8 || dist < 0.4) {
          velocities[i * 3] *= -1
          velocities[i * 3 + 1] *= -1
          velocities[i * 3 + 2] *= -1
        }
      }
      posAttr.needsUpdate = true

      // Rotation
      if (autoRotating) rotY += delta * 0.25
      root.rotation.y = rotY
      root.rotation.x = rotX
      shell.rotation.y = rotY * 0.5

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('click', onClick)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      // Dispose GPU resources
      for (const rm of regionMeshes) {
        ;(rm.core.geometry as THREE.BufferGeometry).dispose()
        ;(rm.core.material as THREE.Material).dispose()
        ;(rm.glow.geometry as THREE.BufferGeometry).dispose()
        ;(rm.glow.material as THREE.Material).dispose()
      }
      particleGeom.dispose()
      particleMat.dispose()
      shell.geometry.dispose()
      ;(shell.material as THREE.Material).dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [webglFailed, handleRegionClick])

  return (
    <div
      ref={containerRef}
      className="relative w-full my-8 rounded-2xl overflow-hidden"
      style={{ minHeight: '500px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118]" />

      <div className="absolute top-4 left-4 right-4 z-10 text-center pointer-events-none">
        <p className="text-sm font-mono text-amber-400/80 tracking-wide">
          {currentState.title}
        </p>
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-300"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {selectedRegion && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <p className="text-sm font-bold" style={{ color: REGIONS[selectedRegion].color }}>
            {REGIONS[selectedRegion].label}
          </p>
          <p className="text-xs text-white/70 mt-1">
            {REGIONS[selectedRegion].description}
          </p>
        </div>
      )}

      <div className="absolute top-16 right-4 z-10 space-y-1">
        {(Object.entries(REGIONS) as [RegionKey, typeof REGIONS[RegionKey]][]).map(([key, region]) => (
          <button
            key={key}
            type="button"
            className="flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity bg-transparent border-0 p-0"
            onClick={() => handleRegionClick(key)}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{
                backgroundColor: region.color,
                opacity: currentState.active.includes(key) ? 1 : 0.3,
              }}
            />
            <span className="text-[10px] text-white/60 font-mono">{region.label}</span>
          </button>
        ))}
      </div>

      <div className="relative w-full" style={{ height: '500px' }}>
        <div ref={canvasHostRef} className="absolute inset-0" />
        {webglFailed && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-xs font-mono text-amber-400/80">
              3D rendering unavailable. {currentState.title}
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <p className="text-[10px] text-white/30 font-mono">drag to rotate · click regions · scroll to explore</p>
      </div>
    </div>
  )
}
