/* eslint-disable react/no-unescaped-entities */
'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { allTestimonials } from '@/data/testimonials'

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Get all testimonials instead of limiting to just a few
  const testimonials = allTestimonials // Use all testimonials from the testimonials.ts file

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Clients Say
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Testimonials from engineering leaders and teams I've worked with at top-tier companies.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial display */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 text-center relative"
              >
                {/* Quote icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center mb-8"
                >
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                    <Quote className="w-8 h-8 text-blue-400" />
                  </div>
                </motion.div>

                {/* Testimonial content */}
                                 <motion.blockquote
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: 0.3 }}
                   className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-medium"
                 >
                   {/* eslint-disable-next-line react/no-unescaped-entities */}
                   <span dangerouslySetInnerHTML={{ __html: `"${currentTestimonial.content}"` }} />
                 </motion.blockquote>

                {/* Author info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center justify-center gap-4"
                >
                  {currentTestimonial.author.imageUrl && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400/50">
                      <Image
                        src={currentTestimonial.author.imageUrl}
                        alt={currentTestimonial.author.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-lg font-semibold text-white">
                      {currentTestimonial.author.name}
                    </div>
                    <div className="text-blue-300 text-sm">
                      {currentTestimonial.author.role}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="border-blue-400 text-blue-100 hover:bg-blue-800/50 backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="border-blue-400 text-blue-100 hover:bg-blue-800/50 backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-blue-400 scale-125' 
                      : 'bg-blue-400/30 hover:bg-blue-400/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">4</div>
              <div className="text-white text-sm">AI-Forward Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">10+</div>
              <div className="text-white text-sm">Team Testimonials</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-white text-sm">Client Satisfaction</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 