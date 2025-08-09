'use client'

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLandingData } from "@/hooks/use-landing-data"

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
  image: string
}

export function TestimonialsSection() {
  const { testimonials, loading, error, isUsingFallback } = useLandingData()
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = testimonials.length > 0 
    ? [...testimonials, ...testimonials] 
    : []

  useEffect(() => {
    if (!testimonials.length || !containerRef.current) return

    const ctx = gsap.context(() => {
      const container = containerRef.current
      if (!container) return

      const cardWidth = 400 // Fixed width matching the style
      const gap = 32 // gap-8 = 32px
      const totalWidth = (cardWidth + gap) * testimonials.length

      // Initial setup - hide elements
      gsap.set('.testimonials-title', { 
        opacity: 0, 
        y: 50 
      })
      gsap.set('.testimonials-subtitle', { 
        opacity: 0, 
        y: 30 
      })
      gsap.set(container, { 
        opacity: 0, 
        x: 100 
      })

      // Timeline for smooth sequential animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Title animation
      tl.to('.testimonials-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, 0)

      // Subtitle animation
      tl.to('.testimonials-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, 0.2)

      // Container animation
      tl.to(container, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.4)

      // After initial animation, start the scrolling effect
      tl.call(() => {
        // Continuous horizontal movement using the duplicated testimonials
        gsap.to(container, {
          x: -totalWidth,
          duration: 30,
          ease: "none",
          repeat: -1
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [testimonials])

  if (loading) {
    return (
      <section id="testimonials" className="py-20 px-6 bg-gradient-to-r from-gray-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="rounded-3xl border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-15 h-15 bg-gray-200 rounded-full"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 bg-gray-200 rounded mr-1"></div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="testimonials" className="py-20 px-6 bg-gradient-to-r from-gray-50 to-purple-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="testimonials-title text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Сэтгэгдэлүүд</h2>
          {/* <p className="testimonials-subtitle text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Бидний оюутнуудын болон үйлчигдэгчдэд амжилттай түүхүүд
          </p> */}
        </div>

        <div 
          ref={containerRef}
          className="flex gap-8"
          style={{ width: 'fit-content' }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <Card
              key={`${index}-${testimonial.name}`}
              className="group rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/70 backdrop-blur-sm flex-shrink-0"
              style={{ width: '400px' }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-gray-700 italic leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}