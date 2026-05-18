'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

const PHRASE = 'I ONLY EXIST IN COMBAT'

export default function SensorBotChewing() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const animIdRef = useRef<number>(0)

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      if (!prev) {
        // Start audio
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

          // Layered synth pad (State B - happy/chewing)
          const osc1 = ctx.createOscillator()
          const osc2 = ctx.createOscillator()
          const osc3 = ctx.createOscillator()
          const gain = ctx.createGain()

          osc1.type = 'sawtooth'
          osc1.frequency.value = 110
          osc2.type = 'sine'
          osc2.frequency.value = 220
          osc3.type = 'triangle'
          osc3.frequency.value = 330

          gain.gain.setValueAtTime(0, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5)

          osc1.connect(gain)
          osc2.connect(gain)
          osc3.connect(gain)
          gain.connect(ctx.destination)

          osc1.start()
          osc2.start()
          osc3.start()

          oscillatorRef.current = null // we use osc1/2/3 directly
          gainRef.current = gain

          // SpeechSynthesis - loop the phrase
          const speak = () => {
            if (!window.speechSynthesis) return
            const u = new SpeechSynthesisUtterance(PHRASE)
            u.rate = 0.85
            u.pitch = 0.7
            u.volume = 0.9
            // Try to find a robotic voice
            const voices = window.speechSynthesis.getVoices()
            const robot = voices.find(
              (v) =>
                v.name.toLowerCase().includes('robot') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('david') ||
                v.name.toLowerCase().includes('google')
            )
            if (robot) u.voice = robot
            u.onend = () => {
              // Loop after short delay
              setTimeout(speak, 2000)
            }
            window.speechSynthesis.speak(u)
            speechRef.current = u
          }

          // Give voices time to load
          setTimeout(speak, 300)
        } catch (e) {
          console.warn('Audio init failed:', e)
        }
      } else {
        // Stop audio
        try {
          window.speechSynthesis?.cancel()
          if (gainRef.current) {
            gainRef.current.gain.linearRampToValueAtTime(0, (gainRef.current.context as AudioContext).currentTime + 0.3)
            setTimeout(() => {
              ;(gainRef.current?.context as AudioContext).close()
            }, 500)
          }
        } catch (e) {}
      }
      return !prev
    })
  }, [])

  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel()
        ;(gainRef.current?.context as AudioContext).close()
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    const w = container.clientWidth || 800
    const h = container.clientHeight || 500

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0115, 0.012)

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200)
    camera.position.set(0, 1.5, 7)
    camera.lookAt(0, 0.5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x060010)
    container.appendChild(renderer.domElement)

    // Grid floor
    const gridHelper = new THREE.GridHelper(60, 40, 0xff4400, 0x330011)
    ;(gridHelper.material as THREE.LineBasicMaterial).opacity = 0.35
    ;(gridHelper.material as THREE.LineBasicMaterial).transparent = true
    gridHelper.position.y = -1.5
    scene.add(gridHelper)

    // Ground
    const groundGeo = new THREE.PlaneGeometry(60, 60)
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1a0800, roughness: 0.95 })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.5
    scene.add(ground)

    // Ambient
    const ambient = new THREE.AmbientLight(0x220011, 0.5)
    scene.add(ambient)

    // Hot orange point light from below (wire heating)
    const bottomLight = new THREE.PointLight(0xff6600, 2.5, 10)
    bottomLight.position.set(0, -1, 2)
    scene.add(bottomLight)

    // Backlight (teal rim)
    const rimLight = new THREE.PointLight(0x00ffcc, 1.5, 12)
    rimLight.position.set(-3, 3, -4)
    scene.add(rimLight)

    // Bot
    const bot = new THREE.Group()

    // Body sphere
    const bodyGeo = new THREE.SphereGeometry(0.65, 20, 20)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xaabbcc,
      roughness: 0.25,
      metalness: 0.85,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    bot.add(body)

    // Wireframe overlay on body
    const wireGeo = new THREE.SphereGeometry(0.68, 12, 12)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
    const wireframe = new THREE.Mesh(wireGeo, wireMat)
    bot.add(wireframe)

    // Panel rings
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.66, 0.01, 8, 32)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.4 })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      ring.rotation.y = (i * Math.PI) / 3
      ring.position.y = (i - 1) * 0.2
      bot.add(ring)
    }

    // Stalk
    const stalkGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.55, 8)
    const stalkMat = new THREE.MeshStandardMaterial({ color: 0x6677aa, roughness: 0.4, metalness: 0.7 })
    const stalk = new THREE.Mesh(stalkGeo, stalkMat)
    stalk.position.set(0, 0.85, 0)
    bot.add(stalk)

    // RED sensor dot (locked forward)
    const sensorGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0xff2200,
      emissive: 0xff2200,
      emissiveIntensity: 3.0,
      roughness: 0.1,
      metalness: 0.9,
    })
    const sensorDot = new THREE.Mesh(sensorGeo, sensorMat)
    sensorDot.position.set(0, 1.18, 0)
    sensorDot.rotation.x = 0.3 // locked forward
    bot.add(sensorDot)

    // Sensor glow
    const sensorLight = new THREE.PointLight(0xff3300, 3, 6)
    sensorLight.position.copy(sensorDot.position)
    bot.add(sensorLight)

    // Interior orange wire torus
    const wireIntGeo = new THREE.TorusGeometry(0.3, 0.025, 8, 32)
    const wireIntMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff4400,
      emissiveIntensity: 1.5,
    })
    const wireInt = new THREE.Mesh(wireIntGeo, wireIntMat)
    wireInt.rotation.x = Math.PI / 2
    wireInt.position.y = -0.1
    bot.add(wireInt)

    // Internal wire glow light
    const wireGlow = new THREE.PointLight(0xff5500, 1.5, 3)
    wireGlow.position.set(0, -0.1, 0)
    bot.add(wireGlow)

    // Bot leaning forward
    bot.rotation.x = -0.2
    bot.position.set(0, -0.3, 1)
    scene.add(bot)

    // Particle system (hot orange sparks)
    const particleCount = 80
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = Math.random() * 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xff6600,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // CRT overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:10;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px
      );
    `
    container.style.position = 'relative'
    container.appendChild(overlay)

    // HUD
    const hudTop = document.createElement('div')
    hudTop.style.cssText = `
      position:absolute;top:12px;left:16px;z-index:20;pointer-events:none;
      font-family:monospace;font-size:11px;color:#ff4400;opacity:0.85;
      text-shadow: 0 0 10px #ff4400;
    `
    hudTop.innerHTML = 'LOCK ACQUIRED<br/>CHEWING: ACTIVE<br/>WIRE: HOT'
    container.appendChild(hudTop)

    // Glitch text overlay
    const glitchDiv = document.createElement('div')
    glitchDiv.style.cssText = `
      position:absolute;bottom:60px;left:50%;transform:translateX(-50%);
      z-index:20;pointer-events:none;
      font-family:monospace;font-size:clamp(14px, 2.5vw, 22px);
      font-weight:900;letter-spacing:0.15em;
      color:#ff4400;
      text-shadow: 0 0 15px #ff4400, 0 0 30px #ff6600, 2px 0 #00ffcc, -2px 0 #ff0066;
      white-space:nowrap;
    `
    glitchDiv.textContent = PHRASE
    container.appendChild(glitchDiv)

    // Audio toggle button
    const audioBtn = document.createElement('button')
    audioBtn.style.cssText = `
      position:absolute;top:12px;right:16px;z-index:30;cursor:pointer;
      font-family:monospace;font-size:11px;padding:6px 12px;
      background:rgba(255,68,0,0.15);color:#ff4400;border:1px solid #ff4400;
      border-radius:4px;letter-spacing:0.1em;
      text-shadow: 0 0 8px #ff4400;
      transition: all 0.2s;
    `
    audioBtn.textContent = 'AUDIO: OFF'
    audioBtn.onclick = () => {
      toggleAudio()
      audioBtn.textContent = audioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'
      audioBtn.style.background = audioEnabled
        ? 'rgba(0,255,204,0.15)'
        : 'rgba(255,68,0,0.15)'
      audioBtn.style.color = audioEnabled ? '#00ffcc' : '#ff4400'
      audioBtn.style.borderColor = audioEnabled ? '#00ffcc' : '#ff4400'
    }
    container.appendChild(audioBtn)

    const clock = new THREE.Clock()

    let glitchTimer = 0
    function animate() {
      const animId = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.getElapsedTime()

      // Sensor pulse (faster = chewing)
      const pulse = 3 + Math.sin(elapsed * 8) * 1.2
      sensorLight.intensity = pulse
      ;(sensorMat as THREE.MeshStandardMaterial).emissiveIntensity = pulse
      wireIntMat.emissiveIntensity = 1.0 + Math.sin(elapsed * 6) * 0.8

      // Wire glow pulse
      wireGlow.intensity = 1.2 + Math.sin(elapsed * 6) * 0.8
      bottomLight.intensity = 2 + Math.sin(elapsed * 5) * 1.0

      // Bot micro-tremor (chewing)
      bot.position.y = -0.3 + Math.sin(elapsed * 12) * 0.015

      // Wireframe spin
      wireframe.rotation.y += delta * 0.5
      wireframe.rotation.x += delta * 0.3

      // Particles (hot sparks rising)
      const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        posAttr.array[i * 3 + 1] += delta * (0.5 + Math.random() * 0.5)
        posAttr.array[i * 3] += (Math.random() - 0.5) * delta * 0.5
        if (posAttr.array[i * 3 + 1] > 5) {
          posAttr.array[i * 3 + 1] = 0
          posAttr.array[i * 3] = (Math.random() - 0.5) * 8
        }
      }
      posAttr.needsUpdate = true

      // Glitch text
      glitchTimer += delta
      if (glitchTimer > 0.08) {
        glitchTimer = 0
        const chars = '!@#$%^&*<>?/|\\'
        const base = PHRASE
        let glitched = ''
        for (const c of base) {
          if (c !== ' ' && Math.random() < 0.08) {
            glitched += chars[Math.floor(Math.random() * chars.length)]
          } else {
            glitched += c
          }
        }
        glitchDiv.textContent = glitched
        glitchDiv.style.transform = `translateX(-50%) translateX(${(Math.random() - 0.5) * 4}px)`
      }

      renderer.render(scene, camera)
      animIdRef.current = animId
    }
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
      container.removeChild(glitchDiv)
      container.removeChild(audioBtn)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [toggleAudio])

  return (
    <div
      ref={mountRef}
      className="w-full rounded-2xl overflow-hidden"
      style={{ height: 520 }}
    />
  )
}