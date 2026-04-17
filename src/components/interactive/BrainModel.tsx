'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { ScrollDrivenScene } from './ScrollDrivenScene'

// ─── Brain region data (neuroscience-backed) ───
// Prefrontal cortex: executive function hub, consistently underactive in ADHD (Castellanos & Proal, 2012)
// Default Mode Network: self-referential processing, fails to deactivate in ADHD (Sonuga-Barke & Castellanos, 2007)
// Dopamine pathways: mesolimbic/mesocortical, lower tonic DA in ADHD (Volkow et al., 2009)
// Amygdala: emotional salience — hyperactive in ADHD, drives urgency misattribution
// Working memory: dorsolateral PFC circuit — reduced capacity and faster decay in ADHD

interface RegionDef {
  position: [number, number, number]
  scale: number
  ntColor: string
  adhdColor: string
  label: string
  ntDescription: string
  adhdDescription: string
}

const REGIONS: Record<string, RegionDef> = {
  prefrontal: {
    position: [0, 0.6, 0.8],
    scale: 0.35,
    ntColor: '#4ecdc4',
    adhdColor: '#1a3a38',
    label: 'Prefrontal Cortex',
    ntDescription: 'Active — manages planning, prioritization, impulse control',
    adhdDescription: 'Dimmed — underactivated, executive function compromised',
  },
  dmn: {
    position: [0, 0.2, -0.4],
    scale: 0.3,
    ntColor: '#2a5a52',
    adhdColor: '#ff6b6b',
    label: 'Default Mode Network',
    ntDescription: 'Quiet during focus — appropriately suppressed',
    adhdDescription: 'Hyperactive — internal chatter, mind-wandering, can\'t shut off',
  },
  dopamine: {
    position: [0, -0.2, 0.3],
    scale: 0.25,
    ntColor: '#ffe66d',
    adhdColor: '#665c2b',
    label: 'Dopamine Pathways',
    ntDescription: 'Steady flow — consistent motivation and reward signaling',
    adhdDescription: 'Low tonic levels — interest-based activation only',
  },
  amygdala: {
    position: [0.5, -0.3, 0.2],
    scale: 0.2,
    ntColor: '#3a5a7a',
    adhdColor: '#ff4444',
    label: 'Amygdala',
    ntDescription: 'Calibrated — appropriate urgency responses',
    adhdDescription: 'Hyperactive — everything feels equally urgent',
  },
  workingMemory: {
    position: [-0.5, 0.4, 0.4],
    scale: 0.22,
    ntColor: '#c44dff',
    adhdColor: '#3a1a55',
    label: 'Working Memory',
    ntDescription: 'Stable buffer — holds context across task switches',
    adhdDescription: 'Volatile — context evicts on any interruption',
  },
}

type RegionKey = keyof typeof REGIONS

// ─── Single brain region ───
function Region({
  region,
  mode,
  isSelected,
  onClick,
}: {
  region: RegionDef
  mode: 'neurotypical' | 'adhd'
  isSelected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const targetIntensity = useRef(0.5)
  const currentIntensity = useRef(0.5)

  const isNT = mode === 'neurotypical'
  const color = isNT ? region.ntColor : region.adhdColor

  // Bright when "active" in current mode
  const isActive = isNT
    ? ['prefrontal', 'dopamine', 'workingMemory'].some(
        (k) => REGIONS[k] === region
      )
    : ['dmn', 'amygdala'].some((k) => REGIONS[k] === region)

  useEffect(() => {
    targetIntensity.current = isActive ? 1 : 0.2
  }, [isActive])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30)
    currentIntensity.current +=
      (targetIntensity.current - currentIntensity.current) * dt * 3

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = currentIntensity.current * 0.8
      mat.opacity = 0.3 + currentIntensity.current * 0.7
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + currentIntensity.current * 0.5)
      const gmat = glowRef.current.material as THREE.MeshBasicMaterial
      gmat.opacity = currentIntensity.current * 0.15
    }
  })

  const c = new THREE.Color(color)

  return (
    <group position={region.position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[region.scale * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={c}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={meshRef} onClick={onClick} scale={region.scale}>
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

// ─── Particle field ───
function Particles({ mode }: { mode: 'neurotypical' | 'adhd' }) {
  const ref = useRef<THREE.Points>(null!)
  const count = 150

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
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
      .array as Float32Array
    const speed = mode === 'adhd' ? 2.5 : 0.8
    const dt = Math.min(delta, 1 / 30)

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] * speed * dt * 60
      pos[i * 3 + 1] += velocities[i * 3 + 1] * speed * dt * 60
      pos[i * 3 + 2] += velocities[i * 3 + 2] * speed * dt * 60

      const dist = Math.sqrt(
        pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2
      )
      if (dist > 1.8 || dist < 0.4) {
        velocities[i * 3] *= -1
        velocities[i * 3 + 1] *= -1
        velocities[i * 3 + 2] *= -1
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={mode === 'adhd' ? '#ff6b6b' : '#4ecdc4'}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── Brain shell wireframe ───
function Shell() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05
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

// ─── Inner scene (must be child of Canvas) ───
function BrainScene({ mode }: { mode: 'neurotypical' | 'adhd' }) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <Shell />
      {Object.entries(REGIONS).map(([key, region]) => (
        <Region
          key={key}
          region={region}
          mode={mode}
          isSelected={selectedRegion === key}
          onClick={() =>
            setSelectedRegion((prev) => (prev === key ? null : key))
          }
        />
      ))}
      <Particles mode={mode} />
    </Float>
  )
}

// ─── Exported component ───
export function BrainModel() {
  const [mode, setMode] = useState<'neurotypical' | 'adhd'>('neurotypical')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  // Scroll-driven mode transition: first half = neurotypical, second half = ADHD
  useEffect(() => {
    setMode(scrollProgress > 0.45 ? 'adhd' : 'neurotypical')
  }, [scrollProgress])

  const currentModeLabel =
    mode === 'neurotypical'
      ? 'Neurotypical — all systems balanced'
      : 'ADHD — prefrontal dim, DMN hyperactive'

  return (
    <div className="relative my-8">
      {/* Mode label + toggle */}
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-sm text-amber-400/80">
          {currentModeLabel}
        </p>
        <button
          onClick={() =>
            setMode((m) => (m === 'neurotypical' ? 'adhd' : 'neurotypical'))
          }
          className="rounded-md border border-white/10 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-700/60 hover:text-zinc-200"
        >
          Toggle: {mode === 'neurotypical' ? 'Show ADHD' : 'Show Neurotypical'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-red-500 transition-all duration-300"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* 3D Scene */}
      <ScrollDrivenScene
        height="500px"
        onScrollProgress={setScrollProgress}
        className="rounded-2xl"
      >
        <BrainScene mode={mode} />
      </ScrollDrivenScene>

      {/* Region legend */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Object.entries(REGIONS).map(([key, region]) => {
          const color = mode === 'neurotypical' ? region.ntColor : region.adhdColor
          const desc =
            mode === 'neurotypical'
              ? region.ntDescription
              : region.adhdDescription
          return (
            <button
              key={key}
              onClick={() =>
                setSelectedRegion((prev) => (prev === key ? null : key))
              }
              className="flex items-start gap-2 rounded-lg border border-white/5 bg-zinc-900/40 p-2 text-left transition-colors hover:border-white/10"
            >
              <div
                className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div>
                <p className="text-[11px] font-medium text-zinc-300">
                  {region.label}
                </p>
                {selectedRegion === key && (
                  <p className="mt-0.5 text-[10px] text-zinc-500">{desc}</p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
