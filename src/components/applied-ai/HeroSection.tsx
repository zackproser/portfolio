'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import RandomPortrait from '@/components/RandomPortrait'

// Dynamically import the NeuralNetworkPulse with no SSR
const NeuralNetworkPulse = dynamic(
  () => import('@/components/NeuralNetworkPulse').then(mod => mod.NeuralNetworkPulse),
  { 
    ssr: false,
    loading: () => (
      <div className="w-[500px] h-[500px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading visualization...</div>
      </div>
    )
  }
)

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6))]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20">
          
          {/* Left side - Content */}
          <div className="space-y-8">
            {/* Main content */}
            <div className="space-y-6">
              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Full-Stack AI Engineer &
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Technical Trainer
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-4xl"
              >
                From building production AI systems to leading corporate workshops at Fortune 500 companies.
                I architect, code, speak, and train teams on everything from neural networks to infrastructure as code.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              {/* Stats */}
              <div className="flex flex-wrap gap-8 text-blue-100">
                <div>
                  <div className="text-2xl font-bold text-white">1,700+</div>
                  <div className="text-sm">Newsletter Subscribers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1,500+</div>
                  <div className="text-sm">Developers Trained</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-sm">AI-Forward Companies</div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                <Link href="/contact">Hire Me</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </Link>
              </Button>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex items-center gap-4 mt-8"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden">
                  <RandomPortrait width={128} height={128} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Zachary Proser</h3>
                <p className="text-blue-200">Staff AI Engineer</p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Neural Network Visualization */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.5,
                type: "spring",
                stiffness: 100 
              }}
              className="relative"
            >
              <Suspense fallback={
                <div className="w-[500px] h-[500px] flex items-center justify-center">
                  <div className="animate-pulse text-blue-300">Loading neural network...</div>
                </div>
              }>
                <NeuralNetworkPulse />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 