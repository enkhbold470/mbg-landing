'use client'

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ctaSection } from "@/config/site"
import { ArrowRight, Phone } from "lucide-react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([titleRef.current, subtitleRef.current], { 
        opacity: 0, 
        y: 50 
      })
      gsap.set(buttonsRef.current, { 
        opacity: 0, 
        y: 30,
        scale: 0.9
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

      // Title animation with bounce effect
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

      // Buttons animation with scale effect
      tl.to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)"
      }, 0.4)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 ref={titleRef} className="text-4xl lg:text-5xl font-bold text-white mb-6">{ctaSection.title}</h2>
        <p ref={subtitleRef} className="text-lg lg:text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
          {ctaSection.subtitle}
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={ctaSection.primaryCta.href}>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[250px] group"
            >
              <Phone className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              {ctaSection.primaryCta.text}
            </Button>
          </Link>

          <Link href={ctaSection.secondaryCta.href}>
            <Button
              size="lg"
              variant="outline"
              className="border-2  hover:bg-white hover:text-purple-600 px-8 py-4 text-lg rounded-2xl min-w-[250px] transition-all duration-300 group"
            >
              {ctaSection.secondaryCta.text}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href={ctaSection.thirdCta.href}>
            <Button
              size="lg"
              variant="outline"
              className="border-2  hover:bg-white hover:text-purple-600 px-8 py-4 text-lg rounded-2xl min-w-[250px] transition-all duration-300 group"
            >
              {ctaSection.thirdCta.text}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 