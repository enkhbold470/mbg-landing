'use client'

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLandingData } from "@/hooks/use-landing-data"

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Feature {
  title: string
  description: string
  icon: string
}

export function FeaturesSection() {
  const { features, loading, error, isUsingFallback } = useLandingData()
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (loading || !sectionRef.current || features.length === 0) return

    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([titleRef.current, subtitleRef.current], { 
        opacity: 0, 
        y: 50 
      })
      gsap.set(cardsRef.current, { 
        opacity: 0, 
        y: 100,
        scale: 0.8,
        rotation: -5
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
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, 0)

      // Subtitle animation
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, 0.2)

      // Cards stagger animation
      tl.to(cardsRef.current, {
        opacity: 1,
          y: 0, 
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.4)"
      }, 0.4)

      // Continuous floating animation for cards (only after they're visible)
      tl.call(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.to(card, {
            y: -15,
              duration: 1.5 + index * 0.1,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
              delay: index * 0.1
          })
        }
        })
      })

      // Continuous rotation for icons (only after they're visible)
      tl.call(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const icon = card.querySelector('.feature-icon')
          if (icon) {
            gsap.to(icon, {
              rotation: 360,
                duration: 6 + index * 0.3,
              ease: "none",
              repeat: -1,
                delay: index * 0.2
            })
          }
        }
        })
      })

      // Hover animations
      cardsRef.current.forEach(card => {
        if (card) {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.08,
              duration: 0.3,
              ease: "power2.out"
            })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            })
          })
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [loading, features])

  if (loading) {
    return (
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="rounded-3xl border-0 shadow-lg bg-white">
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
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
    <section ref={sectionRef} id="features" className="py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Онцлог боломжууд
          </h2>
          <p ref={subtitleRef} className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Бид дараах онцлог боломжуудыг санал болгож байна
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              ref={el => {
                if (el) {
                  cardsRef.current[index] = el
                }
              }}
              className="group rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 cursor-pointer"
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4 feature-icon group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}