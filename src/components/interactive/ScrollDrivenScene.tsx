'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

interface ScrollDrivenSceneProps {
  children: React.ReactNode
  height?: string
  className?: string
  enableOrbit?: boolean
  autoRotate?: boolean
  background?: string
  onScrollProgress?: (progress: number) => void
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export function ScrollDrivenScene({
  children,
  height = '500px',
  className = '',
  enableOrbit = true,
  autoRotate = true,
  background = '#0a0118',
  onScrollProgress,
}: ScrollDrivenSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const isMobile = useIsMobile()

  // IntersectionObserver: only render Canvas when visible
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Scroll progress tracking
  const handleScroll = useCallback(() => {
    if (!onScrollProgress || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    // progress = 0 when element enters viewport from below,
    // progress = 1 when element exits viewport above
    const totalTravel = viewportHeight + rect.height
    const traveled = viewportHeight - rect.top
    const progress = Math.min(1, Math.max(0, traveled / totalTravel))

    onScrollProgress(progress)
  }, [onScrollProgress])

  useEffect(() => {
    if (!onScrollProgress) return
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, onScrollProgress])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ height }}
    >
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${background}dd 0%, ${background} 70%)`,
        }}
      />

      {isInView && (
        <Canvas
          camera={{ position: [0, 1, 3.5], fov: 45 }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{ alpha: true, antialias: true }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <ambientLight intensity={0.2} />
          {/* Warm light from upper-right */}
          <pointLight position={[4, 5, 3]} intensity={0.8} color="#ffd4a0" />
          {/* Cool light from lower-left */}
          <pointLight position={[-3, -2, 2]} intensity={0.5} color="#a0c4ff" />

          {enableOrbit && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
            />
          )}

          {children}
        </Canvas>
      )}

      {/* Drag-to-rotate hint */}
      {enableOrbit && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-10 select-none rounded-md bg-black/30 px-2.5 py-1 text-[11px] text-white/40 backdrop-blur-sm">
          drag to rotate
        </div>
      )}
    </div>
  )
}
