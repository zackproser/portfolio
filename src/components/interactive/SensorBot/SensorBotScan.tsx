'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function SensorBotScan() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    const w = container.clientWidth || 800
    const h = container.clientHeight || 500

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0115, 0.015)

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200)
    camera.position.set(0, 2.5, 8)
    camera.lookAt(0, 0.5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x060010)
    container.appendChild(renderer.domElement)

    // Grid floor (cyberpunk neon grid)
    const gridHelper = new THREE.GridHelper(60, 40, 0x00ffcc, 0x003344)
    ;(gridHelper.material as THREE.LineBasicMaterial).opacity = 0.3
    ;(gridHelper.material as THREE.LineBasicMaterial).transparent = true
    gridHelper.position.y = -1.5
    scene.add(gridHelper)

    // Wasteland ground plane
    const groundGeo = new THREE.PlaneGeometry(60, 60, 1, 1)
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a0800,
      roughness: 0.95,
      metalness: 0.05,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.5
    scene.add(ground)

    // Horizon glow
    const horizonGeo = new THREE.PlaneGeometry(80, 10)
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x220011,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    })
    const horizon = new THREE.Mesh(horizonGeo, horizonMat)
    horizon.position.set(0, 2, -25)
    scene.add(horizon)

    // Ambient light (very dim)
    const ambient = new THREE.AmbientLight(0x110022, 0.4)
    scene.add(ambient)

    // Hemisphere (sky/ground)
    const hemi = new THREE.HemisphereLight(0x220033, 0x110500, 0.5)
    scene.add(hemi)

    // SensorBot
    const bot = new THREE.Group()

    // Spherical body
    const bodyGeo = new THREE.SphereGeometry(0.65, 20, 20)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x8899aa,
      roughness: 0.3,
      metalness: 0.8,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    bot.add(body)

    // Panel lines on body (thin dark rings)
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.66, 0.01, 8, 32)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x1a2030 })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      ring.rotation.y = (i * Math.PI) / 3
      ring.position.y = (i - 1) * 0.2
      bot.add(ring)
    }

    // Head stalk
    const stalkGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.55, 8)
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0x6677aa,
      roughness: 0.4,
      metalness: 0.7,
    })
    const stalk = new THREE.Mesh(stalkGeo, stalkMat)
    stalk.position.set(0, 0.85, 0)
    bot.add(stalk)

    // Sensor dot (RED emissive)
    const sensorGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0xff2200,
      emissive: 0xff2200,
      emissiveIntensity: 2.0,
      roughness: 0.1,
      metalness: 0.9,
    })
    const sensorDot = new THREE.Mesh(sensorGeo, sensorMat)
    sensorDot.position.set(0, 1.18, 0)
    bot.add(sensorDot)

    // Sensor glow light
    const sensorLight = new THREE.PointLight(0xff3300, 1.5, 5)
    sensorLight.position.copy(sensorDot.position)
    bot.add(sensorLight)

    // Orange wire inside body (subtle glow)
    const wireGeo = new THREE.TorusGeometry(0.3, 0.02, 8, 32)
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff4400,
      emissiveIntensity: 0.5,
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    wire.rotation.x = Math.PI / 2
    wire.position.y = -0.1
    bot.add(wire)

    bot.position.set(0, -0.5, 0)
    scene.add(bot)

    // Scan beam (cone of light from sensor)
    const beamGeo = new THREE.ConeGeometry(0.3, 8, 16, 1, true)
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    })
    const beam = new THREE.Mesh(beamGeo, beamMat)
    beam.rotation.x = Math.PI / 2
    beam.position.set(0, 1.18, -4)
    scene.add(beam)

    // Particles (dust/hunger ghosts)
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = Math.random() * 6 - 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x00ffcc,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // HUD elements (floating text labels via sprites is complex without sprites)
    // Use CSS overlay instead for HUD

    // CRT scanline overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:10;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px
      );
    `
    container.style.position = 'relative'
    container.appendChild(overlay)

    // HUD labels
    const hudTop = document.createElement('div')
    hudTop.style.cssText = `
      position:absolute;top:12px;left:16px;z-index:20;pointer-events:none;
      font-family:monospace;font-size:11px;color:#00ffcc;opacity:0.7;
      text-shadow: 0 0 8px #00ffcc;
    `
    hudTop.innerHTML = 'SCANNING...<br/>COORD: 0x4F2D<br/>SENSOR: ACTIVE'
    container.appendChild(hudTop)

    const hudBot = document.createElement('div')
    hudBot.style.cssText = `
      position:absolute;bottom:12px;right:16px;z-index:20;pointer-events:none;
      font-family:monospace;font-size:10px;color:#ff4400;opacity:0.6;
      text-shadow: 0 0 6px #ff4400;
    `
    hudBot.innerHTML = 'DO-DO-DO-DO'
    container.appendChild(hudBot)

    const clock = new THREE.Clock()

    // Animation
    let scanAngle = 0
    function animate() {
      const animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const elapsed = clock.getElapsedTime()

      // Clamp delta
      const dt = Math.min(delta, 0.05)

      // Scan oscillation
      scanAngle = Math.sin(elapsed * 1.5) * 0.8
      sensorDot.rotation.y = scanAngle
      sensorDot.position.x = Math.sin(scanAngle) * 0.5
      sensorLight.position.x = sensorDot.position.x

      // Sensor pulse
      const pulse = 1.5 + Math.sin(elapsed * 4) * 0.5
      sensorLight.intensity = pulse
      ;(sensorMat as THREE.MeshStandardMaterial).emissiveIntensity = 1.5 + Math.sin(elapsed * 4) * 0.5

      // Bot slow hover
      bot.position.y = -0.5 + Math.sin(elapsed * 0.7) * 0.08

      // Beam follows sensor
      beam.rotation.z = -scanAngle

      // Particles drift
      const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        posAttr.array[i * 3 + 1] -= dt * 0.05
        if (posAttr.array[i * 3 + 1] < -1) {
          posAttr.array[i * 3 + 1] = 5
        }
        posAttr.array[i * 3] += Math.sin(elapsed + i) * dt * 0.02
      }
      posAttr.needsUpdate = true

      // Bot scan flicker (glitch)
      if (Math.random() < 0.01) {
        const glitchMat = new THREE.MeshStandardMaterial({
          color: 0xaabbcc,
          roughness: 0.3,
          metalness: 0.8,
          emissive: 0x00ffcc,
          emissiveIntensity: 0.3,
        })
        body.material = glitchMat
        setTimeout(() => {
          body.material = bodyMat
          glitchMat.dispose()
        }, 80)
      }

      renderer.render(scene, camera)
      animIdRef.current = animId
    }
    const animIdRef = { current: 0 }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animIdRef.current)
      window.removeEventListener('resize', handleResize)
      container.removeChild(overlay)
      container.removeChild(hudTop)
      container.removeChild(hudBot)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full rounded-2xl overflow-hidden"
      style={{ height: 480 }}
    />
  )
}