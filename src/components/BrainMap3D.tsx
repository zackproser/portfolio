'use client'

import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── Brain region definitions ───
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

// ─── Scroll-driven activation states ───
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
    title: 'ADHD at rest — prefrontal dims, DMN won\'t shut off',
  },
  {
    threshold: 0.3,
    active: ['amygdala', 'dmn'],
    dimmed: ['prefrontal', 'dopamine', 'workingMemory'],
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

// ─── Single brain region sphere ───
function BrainRegion({
  position,
  scale,
  color,
  isActive,
  isDimmed,
  onClick,
}: {
  position: [number, number, number]
  scale: number
  color: string
  isActive: boolean
  isDimmed: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const targetIntensity = useRef(isActive ? 1 : isDimmed ? 0.15 : 0.5)
  const currentIntensity = useRef(0.5)

  useEffect(() => {
    targetIntensity.current = isActive ? 1 : isDimmed ? 0.15 : 0.5
  }, [isActive, isDimmed])

  useFrame((_, delta) => {
    currentIntensity.current += (targetIntensity.current - currentIntensity.current) * delta * 3

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = currentIntensity.current * 0.8
      mat.opacity = 0.3 + currentIntensity.current * 0.7
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(scale * (1 + currentIntensity.current * 0.5))
      const gmat = glowRef.current.material as THREE.MeshBasicMaterial
      gmat.opacity = currentIntensity.current * 0.15
    }
  })

  const c = new THREE.Color(color)

  return (
    <group position={position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[scale * 1.5, 16, 16]} />
        <meshBasicMaterial color={c} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      {/* Main region */}
      <mesh ref={meshRef} onClick={onClick} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={c}
          emissive={c}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.8}
          distort={isActive ? 0.3 : 0.1}
          speed={isActive ? 4 : 1}
        />
      </mesh>
    </group>
  )
}

// ─── Neural connection particles ───
function NeuralParticles({ activeRegions }: { activeRegions: RegionKey[] }) {
  const particlesRef = useRef<THREE.Points>(null!)
  const count = 200

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.8 + Math.random() * 0.6
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      vel[i * 3] = (Math.random() - 0.5) * 0.02
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }
    return [pos, vel]
  }, [])

  useFrame((_, delta) => {
    if (!particlesRef.current) return
    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array
    const speed = activeRegions.length > 3 ? 2 : activeRegions.length > 1 ? 1 : 0.3

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] * speed * delta * 60
      pos[i * 3 + 1] += velocities[i * 3 + 1] * speed * delta * 60
      pos[i * 3 + 2] += velocities[i * 3 + 2] * speed * delta * 60

      const dist = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2)
      if (dist > 1.8 || dist < 0.4) {
        velocities[i * 3] *= -1
        velocities[i * 3 + 1] *= -1
        velocities[i * 3 + 2] *= -1
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#4ecdc4"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── Brain shell ───
function BrainShell() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial
        color="#1a0a2e"
        transparent
        opacity={0.08}
        wireframe
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Auto-rotate camera ───
function CameraController() {
  const { camera } = useThree()

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.1
    camera.position.x = Math.sin(t) * 3.5
    camera.position.z = Math.cos(t) * 3.5
    camera.position.y = 1 + Math.sin(t * 0.5) * 0.5
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Main component ───
export default function BrainMap3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | null>(null)
  const [currentState, setCurrentState] = useState(SCROLL_STATES[0])
  const [isInView, setIsInView] = useState(false)

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const elementHeight = rect.height

      // Calculate how far through the element we've scrolled
      const start = rect.top
      const progress = Math.max(0, Math.min(1, (-start + viewportHeight * 0.3) / (elementHeight + viewportHeight * 0.3)))
      setScrollProgress(progress)
      setIsInView(rect.top < viewportHeight && rect.bottom > 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update state based on scroll
  useEffect(() => {
    let matched = SCROLL_STATES[0]
    for (const state of SCROLL_STATES) {
      if (scrollProgress >= state.threshold) matched = state
    }
    setCurrentState(matched)
  }, [scrollProgress])

  const handleRegionClick = useCallback((key: RegionKey) => {
    setSelectedRegion(prev => prev === key ? null : key)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full my-8 rounded-2xl overflow-hidden" style={{ minHeight: '500px' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0118] via-[#1a0a2e] to-[#0a0118]" />

      {/* State label */}
      <div className="absolute top-4 left-4 right-4 z-10 text-center">
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

      {/* Region info tooltip */}
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

      {/* Legend */}
      <div className="absolute top-16 right-4 z-10 space-y-1">
        {Object.entries(REGIONS).map(([key, region]) => (
          <div
            key={key}
            className="flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => handleRegionClick(key as RegionKey)}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: region.color,
                opacity: currentState.active.includes(key as RegionKey) ? 1 : 0.3,
              }}
            />
            <span className="text-[10px] text-white/60 font-mono">{region.label}</span>
          </div>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full" style={{ height: '500px' }}>
        {isInView && (
          <Canvas
            camera={{ position: [0, 1, 3.5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffe66d" />
            <pointLight position={[-5, -5, 5]} intensity={0.3} color="#4ecdc4" />

            <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
              <BrainShell />

              {(Object.entries(REGIONS) as [RegionKey, typeof REGIONS[RegionKey]][]).map(([key, region]) => (
                <BrainRegion
                  key={key}
                  position={region.position}
                  scale={region.scale}
                  color={region.color}
                  isActive={currentState.active.includes(key)}
                  isDimmed={currentState.dimmed.includes(key)}
                  onClick={() => handleRegionClick(key)}
                />
              ))}

              <NeuralParticles activeRegions={currentState.active} />
            </Float>

            <CameraController />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        )}
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 right-4 z-10">
        <p className="text-[10px] text-white/30 font-mono">drag to rotate · click regions · scroll to explore</p>
      </div>
    </div>
  )
}
