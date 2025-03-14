'use client'

import { useState, useRef, useEffect } from 'react'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { ProductContent } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import RandomPortrait from '@/components/RandomPortrait'
import RenderNumYearsExperience from '@/components/NumYearsExperience'

// Company logos
import logoWorkOS from '@/images/logos/workos.svg'
import logoPinecone from '@/images/logos/pinecone-logo.png'
import logoGrunty from '@/images/logos/grunty.png'
import logoCloudflare from '@/images/logos/cloudflare.svg'
import logoCloudmark from '@/images/logos/cloudmark.png'
import logoBrightcontext from '@/images/logos/brightcontext.png'

export default function ProductsPageClient({ products }: { products: ProductContent[] }) {
  // No filters needed, directly use all products
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Terminal-style hacker animation effect with value prop
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas.parentElement) return
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = 300 // Height for the animation
    }
    setCanvasDimensions()
    window.addEventListener('resize', setCanvasDimensions)
    
    // Terminal-style settings
    const terminalConfig = {
      charSize: 20, // Increased font size
      padding: 24,
      fontFamily: 'monospace',
      backgroundColor: 'rgba(20, 20, 30, 0.95)',
      textColor: '#38a169', // Darker green for better readability
      cursorColor: '#38a169',
      glowColor: 'rgba(56, 161, 105, 0.4)',
      borderRadius: 8
    }
    
    // Value proposition statements that will be typed into the terminal
    const valuePropStrings = [
      'git checkout a new skill',
      'git push yourself',
      'git paid'
    ]
    
    // Terminal class
    class Terminal {
      x: number
      y: number
      width: number
      height: number
      text: string[] = []
      currentLine: string = ''
      cursorPos: number = 0
      showCursor: boolean = true
      cursorBlinkInterval: number
      currentCommand: number = 0
      typing: boolean = false
      flashEffects: Array<{
        lineIndex: number, 
        scale: number, 
        framesLeft: number,
        direction: number
      }> = []
      
      constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        
        // Start cursor blinking
        this.cursorBlinkInterval = window.setInterval(() => {
          this.showCursor = !this.showCursor
        }, 500)
        
        // Start typing value props
        this.startNewCommand()
      }
      
      startNewCommand() {
        this.currentLine = '$ '
        this.cursorPos = 2
        this.typing = false
        
        setTimeout(() => {
          // Start typing after a delay
          this.typing = true
          this.typeCommand(valuePropStrings[this.currentCommand % valuePropStrings.length])
          this.currentCommand++
        }, Math.random() * 800 + 300)
      }
      
      typeCommand(command: string) {
        if (!this.typing) return
        
        if (this.cursorPos < command.length + 2) {
          this.currentLine = '$ ' + command.substring(0, this.cursorPos - 2)
          this.cursorPos++
          
          // Schedule next character with slight randomization for typing effect
          setTimeout(() => this.typeCommand(command), Math.random() * 40 + 20)
        } else {
          // Fix for truncated characters: ensure the full command is displayed before pushing
          this.currentLine = '$ ' + command
          
          // Clear existing content to avoid duplication
          if (this.currentCommand % valuePropStrings.length === 0 && this.currentCommand > 0) {
            this.text = []
            this.flashEffects = []
          }
          
          // Command completed, execute it (use currentCommand to track the correct command)
          this.text.push(this.currentLine)
          
          // Add flash effect data for the newly added line
          this.flashEffects = this.flashEffects || []
          this.flashEffects.push({
            lineIndex: this.text.length - 1,
            scale: 1.6, // Start with even larger text
            framesLeft: 20, // Animation frames
            direction: -1 // Shrinking back to normal
          })
          
          // Simply continue to the next command after a delay
          setTimeout(() => this.startNewCommand(), 1500)
          
          // Limit number of lines to fit terminal
          const maxLines = Math.floor((this.height - terminalConfig.padding * 2) / terminalConfig.charSize) - 1
          while (this.text.length > maxLines) {
            this.text.shift()
            
            // Also shift the flash effects
            if (this.flashEffects && this.flashEffects.length > 0) {
              this.flashEffects = this.flashEffects
                .filter(effect => effect.lineIndex >= 0)
                .map(effect => ({
                  ...effect,
                  lineIndex: effect.lineIndex - 1
                }))
            }
          }
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        // Draw terminal background - no shadow for cleaner look
        ctx.fillStyle = terminalConfig.backgroundColor
        ctx.beginPath()
        ctx.roundRect(this.x, this.y, this.width, this.height, terminalConfig.borderRadius)
        ctx.fill()
        
        // Draw terminal header
        ctx.fillStyle = 'rgba(60, 60, 70, 0.9)'
        ctx.beginPath()
        ctx.roundRect(this.x, this.y, this.width, 30, [terminalConfig.borderRadius, terminalConfig.borderRadius, 0, 0])
        ctx.fill()
        
        // Draw header controls
        const controlColors = ['#ff5f57', '#ffbd2e', '#28c841']
        controlColors.forEach((color, i) => {
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(this.x + 18 + i * 24, this.y + 15, 7, 0, Math.PI * 2)
          ctx.fill()
        })
        
        // Draw title
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = `${terminalConfig.charSize}px ${terminalConfig.fontFamily}`
        ctx.textAlign = 'center'
        ctx.fillText('premium-dev-tools ~ zsh', this.x + this.width / 2, this.y + 20)
        
        // Draw text content
        ctx.fillStyle = terminalConfig.textColor
        ctx.textAlign = 'left'
        
        // Calculate maximum width to avoid text cutoff
        const maxWidth = this.width - (terminalConfig.padding * 2) - 20 // Add extra margin
        
        // Process flash effects
        if (this.flashEffects && this.flashEffects.length > 0) {
          this.flashEffects = this.flashEffects
            .map(effect => {
              if (effect.framesLeft > 0) {
                // Update the effect with faster animation
                const speedFactor = 0.04
                effect.scale += effect.direction * speedFactor
                effect.framesLeft--
                return effect
              }
              return null
            })
            .filter((effect): effect is {
              lineIndex: number;
              scale: number;
              framesLeft: number;
              direction: number;
            } => effect !== null)
        }
        
        // Draw previous lines with flash effects
        this.text.forEach((line, i) => {
          // Check if this line has a flash effect
          const flashEffect = this.flashEffects?.find(e => e.lineIndex === i)
          
          if (flashEffect) {
            // Apply scaling effect
            const fontSize = terminalConfig.charSize * flashEffect.scale
            ctx.font = `bold ${fontSize}px ${terminalConfig.fontFamily}`
            
            // Add a more pronounced glow for flash effect
            ctx.shadowColor = terminalConfig.textColor
            ctx.shadowBlur = 10
            // Make text brighter during the effect
            ctx.fillStyle = '#4ade80'
          } else {
            ctx.font = `bold ${terminalConfig.charSize}px ${terminalConfig.fontFamily}`
            ctx.shadowBlur = 0
          }
          
          ctx.fillText(
            line, 
            this.x + terminalConfig.padding, 
            this.y + terminalConfig.padding + 40 + i * terminalConfig.charSize,
            maxWidth
          )
        })
        
        // Reset shadow
        ctx.shadowBlur = 0
        ctx.font = `bold ${terminalConfig.charSize}px ${terminalConfig.fontFamily}`
        
        // Draw current line with cursor
        const currentLineY = this.y + terminalConfig.padding + 40 + this.text.length * terminalConfig.charSize
        ctx.fillText(this.currentLine, this.x + terminalConfig.padding, currentLineY, maxWidth)
        
        // Draw cursor
        if (this.showCursor) {
          const cursorX = this.x + terminalConfig.padding + this.cursorPos * (terminalConfig.charSize * 0.6)
          ctx.fillStyle = terminalConfig.cursorColor
          ctx.fillRect(cursorX, currentLineY - terminalConfig.charSize + 2, terminalConfig.charSize * 0.6, terminalConfig.charSize)
        }
      }
      
      cleanup() {
        clearInterval(this.cursorBlinkInterval)
      }
    }
    
    // Create a single large terminal - full width with no border margins
    const terminal = new Terminal(
      0,
      40,
      canvas.width,
      220
    )
    
    // Animation loop
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // No background gradient or border - just the terminal
      
      // Draw terminal
      terminal.draw(ctx)
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions)
      terminal.cleanup()
    }
  }, [])
  
  // No filtering logic needed

  const productVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  return (
    <Container className="mt-8 sm:mt-16">
      <div className="relative">
        {/* Hero section with terminal animation */}
        <div className="mb-4 relative">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl mb-4 max-w-3xl mx-auto text-center">
            Supercharge your career
          </h1>
          
          <div className="h-[240px] relative bg-transparent">
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 bg-transparent"
              aria-hidden="true" 
            />
          </div>
        </div>
        
        {/* Category Filter completely removed */}

        {/* Products Grid - Wider layout for 2 products - added vertical padding */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto mt-16">
          {products.map((product, i) => (
            <Link 
              href={`/products/${product.slug.split('/').pop()}`}
              className="block" 
              key={product.slug}
            >
              <motion.div
                custom={i}
                initial="hidden"
                animate="visible"
                variants={productVariants}
                className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-lg"
              >
              {/* Product Image */}
              <div className="relative h-64 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {product.heroImage ? (
                  <Image 
                    src={product.heroImage}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-400">
                    <span className="text-sm">No image available</span>
                  </div>
                )}
                {/* Product type badge removed */}
              </div>
              
              {/* Product Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.title}
                </h3>
                
                <p className="mt-2 flex-1 text-zinc-600 dark:text-zinc-400 text-sm line-clamp-4">
                  {product.description}
                </p>
                
                {/* Features */}
                <div className="mt-4 space-y-2">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg 
                        className="h-5 w-5 flex-shrink-0 text-emerald-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">{feature.title}</span>
                    </div>
                  ))}
                </div>
                
                {/* Price & CTA */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {product.pricing.currency}{product.pricing.price}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent link
                      e.preventDefault();
                      window.location.href = `/products/${product.slug.split('/').pop()}`;
                    }}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>

        {/* No "products not found" message needed */}
        
        {/* Author Section */}
        <section
          id="author"
          aria-labelledby="author-title"
          className="mt-16 py-8 border-t border-zinc-100 dark:border-zinc-800"
        >
          <div className="mx-auto max-w-6xl">
            <h3 className="font-medium text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-8">
              About the Author
            </h3>
            <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2">
              <div className="lg:order-2">
                <RandomPortrait width={400} height={400} />
              </div>
              <div className="relative z-10 lg:order-1">
                <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Hi, I&apos;m Zachary Proser
                </h2>
                <div className="mt-6 space-y-6 text-base text-slate-700 dark:text-slate-300">
                  <p>I&apos;m a software engineer with over {RenderNumYearsExperience()} years of experience building production systems. I create high-quality resources that help developers learn practical skills without the fluff.</p>
                  <div className="mt-8 flex flex-col space-y-5">
                    {[
                      {
                        company: 'WorkOS',
                        title: 'Developer Education',
                        logo: logoWorkOS,
                        start: '2024',
                        end: 'Present'
                      },
                      {
                        company: 'Pinecone.io',
                        title: 'Staff Developer Advocate',
                        logo: logoPinecone,
                        start: '2023',
                        end: '2024'
                      },
                      {
                        company: 'Gruntwork.io',
                        title: 'Tech Lead',
                        logo: logoGrunty,
                        start: '2020',
                        end: '2023'
                      },
                      {
                        company: 'Cloudflare',
                        title: 'Senior Software Engineer',
                        logo: logoCloudflare,
                        start: '2017',
                        end: '2020'
                      },
                      {
                        company: 'Cloudmark',
                        title: 'Software Engineer',
                        logo: logoCloudmark,
                        start: '2015',
                        end: '2017'
                      },
                      {
                        company: 'BrightContext',
                        title: 'Software Engineer',
                        logo: logoBrightcontext,
                        start: '2012',
                        end: '2014'
                      }
                    ].map((role, roleIndex) => (
                      <div key={roleIndex} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative flex h-9 w-9 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                            <Image src={role.logo} alt="" className="h-6 w-6" unoptimized />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {role.company}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {role.title}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 min-w-[5rem] text-right">
                          {role.start} — {role.end}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <a 
                      href="/about" 
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Learn more about me
                    </a>
                    <a 
                      href="/blog" 
                      className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      Read my articles
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Container>
  )
}