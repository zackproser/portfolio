"use client"

import { useEffect, useRef, useState } from "react"

// Color theme definitions
type ColorTheme = "blue" | "orange" | "green" | "yellow" | "red"

interface ThemeColors {
  primary: string
  hueBase: number
  hueRange: number
}

const themeColors: Record<ColorTheme, ThemeColors> = {
  blue: {
    primary: "rgba(0, 120, 255, %opacity%)",
    hueBase: 210,
    hueRange: 30
  },
  orange: {
    primary: "rgba(255, 120, 0, %opacity%)",
    hueBase: 30,
    hueRange: 20
  },
  green: {
    primary: "rgba(0, 200, 100, %opacity%)",
    hueBase: 140,
    hueRange: 30
  },
  yellow: {
    primary: "rgba(255, 220, 0, %opacity%)",
    hueBase: 50,
    hueRange: 15
  },
  red: {
    primary: "rgba(255, 50, 50, %opacity%)",
    hueBase: 0,
    hueRange: 20
  }
}

export default function EngineeringAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue")
  const [pulseEffect, setPulseEffect] = useState(false)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const dataValuesRef = useRef<number[]>([])
  const targetValuesRef = useRef<number[]>([])
  const hexagonsRef = useRef<Hexagon[]>([])
  const pulseTimeRef = useRef(0)

  // Theme rotation effect
  useEffect(() => {
    const themeInterval = setInterval(() => {
      setColorTheme(current => {
        if (current === "blue") return "orange"
        if (current === "orange") return "green"
        if (current === "green") return "yellow"
        if (current === "yellow") return "red"
        return "blue"
      })
      setPulseEffect(true)
      pulseTimeRef.current = 0
    }, 5000) // Change color every 5 seconds

    return () => clearInterval(themeInterval)
  }, [])

  // Reset pulse effect after animation
  useEffect(() => {
    if (pulseEffect) {
      const timer = setTimeout(() => {
        setPulseEffect(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [pulseEffect])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()

      // Ensure the canvas is square
      const size = Math.min(rect.width, rect.height)
      canvas.width = size * dpr
      canvas.height = size * dpr
      ctx.scale(dpr, dpr)

      return { width: size, height: size }
    }

    const { width, height } = updateCanvasSize()

    // Animation parameters
    const centerX = width / 2
    const centerY = height / 2
    const outerRadius = Math.min(centerX, centerY) - 10
    const innerRadius = outerRadius * 0.6

    // Initialize particles if not already created
    if (particlesRef.current.length === 0) {
      const particleCount = 100
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: centerX + (Math.random() * 2 - 1) * outerRadius,
          y: centerY + (Math.random() * 2 - 1) * outerRadius,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() * 2 - 1) * 0.5,
          speedY: (Math.random() * 2 - 1) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * themeColors[colorTheme].hueRange + themeColors[colorTheme].hueBase,
        })
      }
    } else {
      // Update particles' hue when color theme changes
      particlesRef.current.forEach(particle => {
        particle.hue = Math.random() * themeColors[colorTheme].hueRange + themeColors[colorTheme].hueBase
      })
    }

    // Data points for the circular data visualization
    if (dataValuesRef.current.length === 0) {
      const dataPoints = 36
      for (let i = 0; i < dataPoints; i++) {
        const baseValue = 0.6 + Math.random() * 0.4
        dataValuesRef.current.push(baseValue)
        targetValuesRef.current.push(baseValue)
      }
    }

    // Hexagon grid
    if (hexagonsRef.current.length === 0) {
      const hexSize = outerRadius / 8
      for (let row = -4; row <= 4; row++) {
        for (let col = -4; col <= 4; col++) {
          // Offset every other row
          const x = centerX + col * hexSize * 1.5
          const y = centerY + row * hexSize * Math.sqrt(3) + (col % 2 ? (hexSize * Math.sqrt(3)) / 2 : 0)

          // Only add hexagons within the circle
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
          if (distance < outerRadius * 0.9) {
            hexagonsRef.current.push({
              x,
              y,
              size: hexSize,
              opacity: 0.1 + Math.random() * 0.2,
              pulse: Math.random() * 2 * Math.PI, // Random starting phase
            })
          }
        }
      }
    }

    // Animation loop
    let lastTime = 0

    const animate = (timestamp: number) => {
      if (!ctx) return

      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      // Update pulse time
      if (pulseEffect) {
        pulseTimeRef.current += deltaTime
      }

      // Calculate pulse factor (0 to 1, peaks at 0.3, fades out by 1.0)
      const pulseFactor = pulseEffect ? 
        Math.max(0, 0.6 * Math.sin(Math.min(pulseTimeRef.current / 600, 1) * Math.PI)) : 0

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Get current theme colors
      const theme = themeColors[colorTheme]
      
      // Draw outer circle with pulse effect
      const outerRadiusWithPulse = outerRadius * (1 + pulseFactor * 0.05)
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadiusWithPulse, 0, Math.PI * 2)
      ctx.strokeStyle = theme.primary.replace("%opacity%", (0.3 + pulseFactor * 0.3).toString())
      ctx.lineWidth = 2 + pulseFactor * 1
      ctx.stroke()

      // Draw inner circle
      const innerRadiusWithPulse = innerRadius * (1 + pulseFactor * 0.05)
      ctx.beginPath()
      ctx.arc(centerX, centerY, innerRadiusWithPulse, 0, Math.PI * 2)
      ctx.strokeStyle = theme.primary.replace("%opacity%", (0.2 + pulseFactor * 0.2).toString())
      ctx.lineWidth = 1 + pulseFactor * 0.5
      ctx.stroke()

      // Draw hexagon grid
      hexagonsRef.current.forEach((hexagon) => {
        // Add extra pulse to hexagons when color changes
        const hexPulseEffect = hexagon.opacity * (0.7 + 0.3 * Math.sin(timestamp * 0.001 + hexagon.pulse)) + pulseFactor * 0.3
        
        drawHexagon(
          ctx,
          hexagon.x,
          hexagon.y,
          hexagon.size * (1 + pulseFactor * 0.1),
          hexPulseEffect,
          theme
        )

        // Slowly pulse the hexagons
        hexagon.pulse += 0.001 * deltaTime
      })

      // Update data visualization
      for (let i = 0; i < dataValuesRef.current.length; i++) {
        // Occasionally change target values
        if (Math.random() < 0.01) {
          targetValuesRef.current[i] = 0.6 + Math.random() * 0.4
        }

        // Smoothly interpolate current values toward target values
        dataValuesRef.current[i] += (targetValuesRef.current[i] - dataValuesRef.current[i]) * 0.05
        
        // Add pulse effect to data values
        if (pulseEffect) {
          dataValuesRef.current[i] += pulseFactor * 0.2
        }
      }

      // Draw data visualization
      drawDataVisualization(ctx, centerX, centerY, innerRadiusWithPulse, outerRadiusWithPulse, dataValuesRef.current, theme, pulseFactor)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check - keep particles within the outer circle
        const dx = particle.x - centerX
        const dy = particle.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > outerRadiusWithPulse) {
          // Redirect particle toward center
          const angle = Math.atan2(dy, dx)
          particle.x = centerX + Math.cos(angle) * outerRadiusWithPulse
          particle.y = centerY + Math.sin(angle) * outerRadiusWithPulse

          // Bounce effect
          particle.speedX = -particle.speedX * 0.5
          particle.speedY = -particle.speedY * 0.5
        }

        // Draw particle with pulse effect
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * (1 + pulseFactor * 0.3), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue}, ${100 + pulseFactor * 20}%, ${50 + pulseFactor * 20}%, ${particle.opacity + pulseFactor * 0.2})`
        ctx.fill()
      })

      // Draw connecting lines between nearby particles
      drawConnections(ctx, particlesRef.current, 50 + pulseFactor * 30, theme, pulseFactor)

      // Draw center icon
      drawCenterIcon(ctx, centerX, centerY, innerRadius * 0.4 * (1 + pulseFactor * 0.1), timestamp, theme, pulseFactor)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [colorTheme, pulseEffect])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-full"
      style={{
        boxShadow: `0 0 ${pulseEffect ? '40px' : '30px'} ${
          colorTheme === "blue" 
            ? "rgba(0, 120, 255, " + (pulseEffect ? "0.5" : "0.3") + ")"
            : colorTheme === "orange"
            ? "rgba(255, 120, 0, " + (pulseEffect ? "0.5" : "0.3") + ")"
            : colorTheme === "green"
            ? "rgba(0, 200, 100, " + (pulseEffect ? "0.5" : "0.3") + ")"
            : colorTheme === "yellow"
            ? "rgba(255, 220, 0, " + (pulseEffect ? "0.5" : "0.3") + ")"
            : "rgba(255, 50, 50, " + (pulseEffect ? "0.5" : "0.3") + ")"
        }`,
        border: `${pulseEffect ? '2px' : '1px'} solid ${
          colorTheme === "blue"
            ? "rgba(0, 120, 255, " + (pulseEffect ? "0.6" : "0.3") + ")"
            : colorTheme === "orange"
            ? "rgba(255, 120, 0, " + (pulseEffect ? "0.6" : "0.3") + ")"
            : colorTheme === "green"
            ? "rgba(0, 200, 100, " + (pulseEffect ? "0.6" : "0.3") + ")"
            : colorTheme === "yellow"
            ? "rgba(255, 220, 0, " + (pulseEffect ? "0.6" : "0.3") + ")"
            : "rgba(255, 50, 50, " + (pulseEffect ? "0.6" : "0.3") + ")"
        }`,
        display: "block", // Ensure the canvas is displayed as a block element
        transition: "box-shadow 0.3s, border 0.3s"
      }}
    />
  )
}

// Helper functions
function drawHexagon(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  size: number, 
  opacity: number,
  theme: ThemeColors
) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const hx = x + size * Math.cos(angle)
    const hy = y + size * Math.sin(angle)

    if (i === 0) {
      ctx.moveTo(hx, hy)
    } else {
      ctx.lineTo(hx, hy)
    }
  }
  ctx.closePath()
  ctx.strokeStyle = theme.primary.replace("%opacity%", opacity.toString())
  ctx.stroke()
}

function drawDataVisualization(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  dataValues: number[],
  theme: ThemeColors,
  pulseFactor: number = 0
) {
  const dataRadius = innerRadius + (outerRadius - innerRadius) * 0.5
  const dataPoints = dataValues.length

  // Draw data line
  ctx.beginPath()
  for (let i = 0; i < dataPoints; i++) {
    const angle = (Math.PI * 2 * i) / dataPoints
    const value = dataValues[i]
    const radius = dataRadius * value

    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.closePath()
  ctx.strokeStyle = theme.primary.replace("%opacity%", (0.6 + pulseFactor * 0.2).toString())
  ctx.lineWidth = 2 + pulseFactor * 1
  ctx.stroke()

  // Fill with gradient
  const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius * 0.5, centerX, centerY, dataRadius)
  gradient.addColorStop(0, theme.primary.replace("%opacity%", (0.2 + pulseFactor * 0.2).toString()))
  gradient.addColorStop(1, theme.primary.replace("%opacity%", "0"))

  ctx.fillStyle = gradient
  ctx.fill()

  // Draw data points
  for (let i = 0; i < dataPoints; i++) {
    const angle = (Math.PI * 2 * i) / dataPoints
    const value = dataValues[i]
    const radius = dataRadius * value

    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    ctx.beginPath()
    ctx.arc(x, y, 2 + pulseFactor * 2, 0, Math.PI * 2)
    ctx.fillStyle = theme.primary.replace("%opacity%", (0.8 + pulseFactor * 0.2).toString())
    ctx.fill()
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D, 
  particles: Particle[], 
  maxDistance: number,
  theme: ThemeColors,
  pulseFactor: number = 0
) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * (0.2 + pulseFactor * 0.1)
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = theme.primary.replace("%opacity%", opacity.toString())
        ctx.lineWidth = 0.5 + pulseFactor * 0.5
        ctx.stroke()
      }
    }
  }
}

function drawCenterIcon(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  timestamp: number,
  theme: ThemeColors,
  pulseFactor: number = 0
) {
  // Rotating inner elements
  const rotation = timestamp * 0.0005

  // Draw circular base
  ctx.beginPath()
  ctx.arc(centerX, centerY, size, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
  ctx.fill()
  ctx.strokeStyle = theme.primary.replace("%opacity%", (0.8 + pulseFactor * 0.2).toString())
  ctx.lineWidth = 2 + pulseFactor * 1
  ctx.stroke()

  // Draw rotating elements
  for (let i = 0; i < 3; i++) {
    const angle = rotation + (Math.PI * 2 * i) / 3

    // Draw line
    const x1 = centerX + Math.cos(angle) * size * 0.5
    const y1 = centerY + Math.sin(angle) * size * 0.5
    const x2 = centerX + Math.cos(angle) * size * (0.9 + pulseFactor * 0.1)
    const y2 = centerY + Math.sin(angle) * size * (0.9 + pulseFactor * 0.1)

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = theme.primary.replace("%opacity%", (0.9 + pulseFactor * 0.1).toString())
    ctx.lineWidth = 3 + pulseFactor * 1.5
    ctx.stroke()

    // Draw circle at the end
    ctx.beginPath()
    ctx.arc(x2, y2, 4 + pulseFactor * 2, 0, Math.PI * 2)
    ctx.fillStyle = theme.primary.replace("%opacity%", "1")
    ctx.fill()
  }

  // Draw inner circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, size * (0.3 + pulseFactor * 0.1), 0, Math.PI * 2)
  ctx.fillStyle = theme.primary.replace("%opacity%", (0.9 + pulseFactor * 0.1).toString())
  ctx.fill()
}

// Type definitions
interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

interface Hexagon {
  x: number
  y: number
  size: number
  opacity: number
  pulse: number
} 