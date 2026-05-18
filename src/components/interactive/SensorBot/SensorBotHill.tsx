'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function SensorBotHill() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    const w = container.clientWidth || 800
    const h = container.clientHeight || 500

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050008, 0.02)

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200)
    camera.position.set(0, 3, 10)
    camera.lookAt(0, 0.5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x030006)
    container.appendChild(renderer.domElement)

    // Grid floor — faded, nearly gone
    const gridHelper = new THREE.GridHelper(60, 30, 0x220033, 0x110022)
    ;(gridHelper.material as THREE.LineBasicMaterial).opacity = 0.15
    ;(gridHelper.material as THREE.LineBasicMaterial).transparent = true
    gridHelper.position.y = -1.5
    scene.add(gridHelper)

    // Hill ground plane
    const groundGeo = new THREE.PlaneGeometry(60, 60, 32, 32)
    // Add subtle hill bump
    const posAttr = groundGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const z = posAttr.getZ(i)
      // Gentle hill under the bot
      const dist = Math.sqrt(x * x + z * z)
      if (dist < 4) {
        const bump = 0.8 * Math.exp(-dist * dist / 8)
        posAttr.setY(i, posAttr.getY(i) + bump)
      }
    }
    groundGeo.computeVertexNormals()
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f0400,
      roughness: 0.98,
      metalness: 0.02,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.5
    scene.add(ground)

    // Very dim ambient
    const ambient = new THREE.AmbientLight(0x110008, 0.3)
    scene.add(ambient)

    // Single dim moonlight
    const moonLight = new THREE.DirectionalLight(0x4433aa, 0.4)
    moonLight.position.set(5, 10, -8)
    scene.add(moonLight)

    // Horizon glow — barely visible
    const horizonGeo = new THREE.PlaneGeometry(80, 8)
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x110005,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })
    const horizon = new THREE.Mesh(horizonGeo, horizonMat)
    horizon.position.set(0, 1, -28)
    scene.add(horizon)

    // Bot (solitary, sensor sweeping very slowly)
    const bot = new THREE.Group()

    // Body
    const bodyGeo = new THREE.SphereGeometry(0.65, 20, 20)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x6677aa,
      roughness: 0.4,
      metalness: 0.75,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    bot.add(body)

    // Panel rings (dim, cold)
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.66, 0.01, 8, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x1a1a2a,
        transparent: true,
        opacity: 0.3,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      ring.rotation.y = (i * Math.PI) / 3
      ring.position.y = (i - 1) * 0.2
      bot.add(ring)
    }

    // Stalk
    const stalkGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.55, 8)
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0x4455aa,
      roughness: 0.4,
      metalness: 0.7,
    })
    const stalk = new THREE.Mesh(stalkGeo, stalkMat)
    stalk.position.set(0, 0.85, 0)
    bot.add(stalk)

    // RED sensor dot — dim, faint pulse
    const sensorGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0xaa1100,
      emissive: 0xaa1100,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
    })
    const sensorDot = new THREE.Mesh(sensorGeo, sensorMat)
    sensorDot.position.set(0, 1.18, 0)
    bot.add(sensorDot)

    // Sensor light — very dim
    const sensorLight = new THREE.PointLight(0xaa1100, 0.5, 4)
    sensorLight.position.copy(sensorDot.position)
    bot.add(sensorLight)

    // Interior orange wire — dim, nearly cold
    const wireGeo = new THREE.TorusGeometry(0.3, 0.02, 8, 32)
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x441100,
      emissive: 0x331100,
      emissiveIntensity: 0.15,
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    wire.rotation.x = Math.PI / 2
    wire.position.y = -0.1
    bot.add(wire)

    // Bot on hill
    bot.position.set(0, 0.5, 0)
    scene.add(bot)

    // Sparse particles — empty wasteland dust
    const particleCount = 60
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = Math.random() * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x330022,
      size: 0.03,
      transparent: true,
      opacity: 0.25,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // CRT overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:10;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 3px,
        rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px
      );
    `
    container.style.position = 'relative'
    container.appendChild(overlay)

    // HUD — dying battery feel
    const hudTop = document.createElement('div')
    hudTop.style.cssText = `
      position:absolute;top:12px;left:16px;z-index:20;pointer-events:none;
      font-family:monospace;font-size:11px;color:#440011;opacity:0.5;
      text-shadow: 0 0 4px #440011;
    `
    hudTop.innerHTML = 'SCANNING...<br/>BATTERY: 3%<br/>WIRE: COLD'
    container.appendChild(hudTop)

    const hudBot = document.createElement('div')
    hudBot.style.cssText = `
      position:absolute;bottom:12px;right:16px;z-index:20;pointer-events:none;
      font-family:monospace;font-size:10px;color:#220011;opacity:0.4;
    `
    hudBot.innerHTML = 'DO-DO-DO-DO'
    container.appendChild(hudBot)

    const clock = new THREE.Clock()

    let scanAngle = 0
    function animate() {
      const animId = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.getElapsedTime()

      // Very slow scan
      scanAngle = Math.sin(elapsed * 0.4) * 0.7
      sensorDot.position.x = Math.sin(scanAngle) * 0.4
      sensorLight.position.x = sensorDot.position.x

      // Very slow, faint sensor pulse
      const pulse = 0.4 + Math.sin(elapsed * 1.2) * 0.2
      sensorLight.intensity = pulse
      ;(sensorMat as THREE.MeshStandardMaterial).emissiveIntensity = pulse
      wireMat.emissiveIntensity = 0.1 + Math.sin(elapsed * 0.5) * 0.05

      // Bot barely hovering
      bot.position.y = 0.5 + Math.sin(elapsed * 0.4) * 0.03

      // Slow particles
      const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        posAttr.array[i * 3 + 1] -= delta * 0.02
        if (posAttr.array[i * 3 + 1] < -1) {
          posAttr.array[i * 3 + 1] = 8
        }
      }
      posAttr.needsUpdate = true

      renderer.render(scene, camera)
      animIdRef.current = animId
    }
    const animIdRef = { current: 0 }
    animate()

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