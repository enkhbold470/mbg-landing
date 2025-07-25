"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { showEmoji } from "@/lib/utils"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - everything blurred and invisible
      gsap.set([badgeRef.current, titleRef.current, descriptionRef.current, buttonsRef.current], {
        opacity: 0,
        filter: "blur(10px)",
        y: 30
      })

      // Create timeline for staggered animation
      const tl = gsap.timeline({
        defaults: { 
          duration: 0.8, 
          ease: "power3.out",
          filter: "blur(0px)",
          opacity: 1,
          y: 0
        }
      })

      // Staggered reveal animation
      tl.to(badgeRef.current, { delay: 0.3 })
        .to(titleRef.current, { delay: 0.2 }, "-=0.8")
        .to(descriptionRef.current, { delay: 0.2 }, "-=0.6")
        .to(buttonsRef.current, { delay: 0.3 }, "-=0.4")

      // Add floating animation to the badge
      gsap.to(badgeRef.current, {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2
      })

      // Add subtle scale animation to buttons on hover
      const buttons = buttonsRef.current?.querySelectorAll('button')
      buttons?.forEach(button => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          })
        })
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          })
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (  
    <section ref={sectionRef} className="pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <div 
          ref={badgeRef}
          className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {siteConfig.slogan || "Тэгээс тэтгэлэгт тэнцэх нь"}
        </div>

        <h1 
          ref={titleRef}
          className="text-4xl lg:text-7xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        >
          {siteConfig.name || "MBG Education"}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
            {siteConfig.tagline || "Хятадын хэлийг эзэмших мэргэжлийн сургалт"}
          </span>
        </h1>

        <p 
          ref={descriptionRef}
          className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {siteConfig.description || "Хятадын хэлийг эзэмших мэргэжлийн сургалт"}
        </p>

        <div 
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-6 lg:gap-4 justify-center items-center"
        >
          <Link href="/courses">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[300px] group"
            >
              {showEmoji('🇲🇳')} Танхим сургалт
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="https://apply.mbg.mn" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[300px] group"
            >
              {showEmoji('🇨🇳')} Суралцах зуучлал
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />

            </Button>
          </Link>

          <Link href="mailto:info@mbg.mn" target="_blank" rel="noopener noreferrer">
             <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[300px] group"
            >
             {showEmoji('🌐')} Бизнес, аялал хөтөч
                           <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />

            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}