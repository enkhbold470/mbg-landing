'use client'

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { aboutUs } from "@/config/site"
import Image from "next/image"
import { youtubeVideo } from "@/lib/utils"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const imageCardRef = useRef<HTMLDivElement>(null)
  const videoCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([titleRef.current, subtitleRef.current], { 
        opacity: 0, 
        y: 50 
      })
      gsap.set([ videoCardRef.current], { 
        opacity: 0, 
        y: 100,
        scale: 0.8
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

      // Cards animation with stagger
      tl.to([ videoCardRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.4)"
      }, 0.4)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-20 px-6 bg-gradient-to-r from-gray-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{aboutUs.title}</h2>
          <p ref={subtitleRef} className="text-lg  lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {aboutUs.description}
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          


          {/* Video Card */}
          <Card ref={videoCardRef} className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
            <CardContent className="flex p-4 sm:p-6 lg:pt-14 lg:pb-14">
              <div className="aspect-video w-full rounded-2xl overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={youtubeVideo(aboutUs.video)} 
                  title="MBG Education танилцуулга видео" 
                  frameBorder="0" 
                  allow="encrypted-media" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen

                />
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </section>
  )
} 