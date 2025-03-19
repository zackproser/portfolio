"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { allTestimonials } from "@/data/testimonials"
import Image from "next/image"

interface Testimonial {
  content: string;
  author: {
    name: string;
    role: string;
    imageUrl?: any;
  };
  category?: string[];
}

// Get the first 4 testimonials with technical expertise
const testimonials = allTestimonials
  .filter(testimonial => 
    testimonial.category && 
    testimonial.category.some(category => 
      ['technical', 'engineering', 'expertise'].includes(category)
    )
  )
  .slice(0, 4);

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const handlePrevious = () => {
    setAutoplay(false)
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setAutoplay(false)
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <Card className="backdrop-blur-sm h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 bg-primary/10">
                        {testimonial.author.imageUrl ? (
                          <Image
                            src={testimonial.author.imageUrl}
                            alt={testimonial.author.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {testimonial.author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg md:text-xl italic text-foreground mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                      <div className="mt-4">
                        <p className="font-semibold text-foreground">{testimonial.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.author.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="icon"
          className="rounded-full border-primary/30 text-primary hover:bg-primary/10"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
        <div className="flex gap-2 items-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === activeIndex ? "bg-primary" : "bg-primary/30"
              }`}
              onClick={() => {
                setAutoplay(false)
                setActiveIndex(index)
              }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <Button
          onClick={handleNext}
          variant="outline"
          size="icon"
          className="rounded-full border-primary/30 text-primary hover:bg-primary/10"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
} 