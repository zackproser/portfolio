// Animation utilities and helpers for the Voice AI demo

/**
 * Simulates typewriter effect by returning characters up to a certain index
 */
export function getTypewriterText(fullText: string, progress: number): string {
  const charIndex = Math.floor((progress / 100) * fullText.length)
  return fullText.slice(0, charIndex)
}

/**
 * Calculate WPM progress over time
 * @param wpm Words per minute
 * @param totalChars Total characters to type
 * @param elapsedMs Time elapsed in milliseconds
 * @returns Progress percentage (0-100)
 */
export function calculateTypingProgress(
  wpm: number,
  totalChars: number,
  elapsedMs: number
): number {
  // Average word length is ~5 characters
  const charsPerMinute = wpm * 5
  const charsPerMs = charsPerMinute / 60000
  const charsTyped = elapsedMs * charsPerMs
  return Math.min(100, (charsTyped / totalChars) * 100)
}

/**
 * Calculate voice dictation progress (much faster than typing)
 * @param wpm Words per minute for voice (typically 150-180)
 * @param totalChars Total characters to speak
 * @param elapsedMs Time elapsed in milliseconds
 * @returns Progress percentage (0-100)
 */
export function calculateVoiceProgress(
  wpm: number,
  totalChars: number,
  elapsedMs: number
): number {
  const charsPerMinute = wpm * 5
  const charsPerMs = charsPerMinute / 60000
  const charsSpoken = elapsedMs * charsPerMs
  return Math.min(100, (charsSpoken / totalChars) * 100)
}

/**
 * Generate waveform data points for visualization
 * @param numPoints Number of data points
 * @param intensity Animation intensity (0-1)
 * @param time Current time for animation
 * @returns Array of amplitude values (0-1)
 */
export function generateWaveformData(
  numPoints: number,
  intensity: number,
  time: number
): number[] {
  const points: number[] = []
  for (let i = 0; i < numPoints; i++) {
    // Combine multiple sine waves for organic look
    const baseWave = Math.sin((i / numPoints) * Math.PI * 4 + time * 3)
    const secondaryWave = Math.sin((i / numPoints) * Math.PI * 7 + time * 5) * 0.5
    const tertiaryWave = Math.sin((i / numPoints) * Math.PI * 11 + time * 2) * 0.3
    
    // Add some randomness for natural variation
    const noise = (Math.random() - 0.5) * 0.2
    
    // Combine and normalize
    const combined = (baseWave + secondaryWave + tertiaryWave + noise) * intensity
    points.push(Math.max(0.1, Math.min(1, (combined + 1) / 2)))
  }
  return points
}

/**
 * Easing function for smooth animations
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Easing function for bouncy animations
 */
export function easeOutBack(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

/**
 * Format milliseconds to readable duration
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${seconds}s`
}

/**
 * Calculate time savings between typing and voice
 */
export function calculateTimeSavings(
  charCount: number,
  typingWpm: number = 90,
  voiceWpm: number = 170
): { typingTime: number; voiceTime: number; savings: number; savingsPercent: number } {
  const wordCount = charCount / 5 // Average word is 5 chars
  const typingTime = (wordCount / typingWpm) * 60 * 1000 // ms
  const voiceTime = (wordCount / voiceWpm) * 60 * 1000 // ms
  const savings = typingTime - voiceTime
  const savingsPercent = Math.round((savings / typingTime) * 100)
  
  return { typingTime, voiceTime, savings, savingsPercent }
}

/**
 * Interpolate between two colors
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  // Parse hex colors
  const c1 = parseInt(color1.slice(1), 16)
  const c2 = parseInt(color2.slice(1), 16)
  
  const r1 = (c1 >> 16) & 255
  const g1 = (c1 >> 8) & 255
  const b1 = c1 & 255
  
  const r2 = (c2 >> 16) & 255
  const g2 = (c2 >> 8) & 255
  const b2 = c2 & 255
  
  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * Stagger delay for list animations
 */
export function getStaggerDelay(index: number, baseDelay: number = 100): number {
  return index * baseDelay
}

/**
 * Generate random position within bounds for floating elements
 */
export function getRandomPosition(
  containerWidth: number,
  containerHeight: number,
  elementSize: number
): { x: number; y: number } {
  return {
    x: Math.random() * (containerWidth - elementSize),
    y: Math.random() * (containerHeight - elementSize)
  }
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}


