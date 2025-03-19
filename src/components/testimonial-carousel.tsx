"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  image: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "David Chen",
    role: "CTO",
    company: "LegalTech Inc",
    content:
      "Working with Zachary transformed our legal document search system. His expertise in AI and vector databases helped us create a solution that reduced our team's research time by 70%. The system is fast, accurate, and has become essential to our operations.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "VP of Engineering",
    company: "AI Solutions",
    content:
      "Zachary brought rare expertise to our project. His deep knowledge of Next.js, Vercel, and AI integration was exactly what we needed. He delivered a production-ready solution on time and exceeded our expectations. I would not hesitate to work with him again.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Michael Johnson",
    role: "Director of Innovation",
    company: "TechGlobal",
    content:
      "His end-to-end knowledge of both AI models and infrastructure as code is uncommon and incredibly valuable. Zachary helped us build a complex AI-powered content moderation system that handles millions of requests daily without breaking a sweat.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Jennifer Park",
    role: "Lead Developer",
    company: "Vector Search Labs",
    content:
      "I've worked with many consultants, but Zachary stands out. His approach to vector database implementation was methodical and production-focused. He doesn't just make things work; he makes them work at scale with enterprise reliability.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

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
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="bg-secondary backdrop-blur-sm border-primary/20 h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 bg-primary/10">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg md:text-xl italic text-foreground mb-4">"{testimonial.content}"</p>
                      <div className="mt-4">
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
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