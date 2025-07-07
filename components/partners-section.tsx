'use client'
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Partner {
  name: string
  logo: string
  url: string
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const partnersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch('/api/partners')
        if (response.ok) {
          const data = await response.json()
          setPartners(data)
        }
      } catch (error) {
        console.error('Error fetching partners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  useEffect(() => {
    if (!loading && partners.length > 0) {
      const ctx = gsap.context(() => {
        // Initial setup - hide elements
        gsap.set([titleRef.current, subtitleRef.current], { 
          opacity: 0, 
          y: 50 
        })
        gsap.set('.partner-item', { 
          opacity: 0, 
          scale: 0.8,
          rotationY: -15
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

        // Title animation with Apple-like spring effect
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

        // Partners stagger animation with 3D effect
        tl.to('.partner-item', {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.6,
          stagger: {
            each: 0.1,
            ease: "power2.out"
          },
          ease: "back.out(1.4)"
        }, 0.4)

        // Hover animations for each partner
        partners.forEach((_, index) => {
          const partnerElement = document.querySelector(`.partner-item-${index}`)
          if (partnerElement) {
            // Hover in
            partnerElement.addEventListener('mouseenter', () => {
              gsap.to(partnerElement, {
                scale: 1.05,
                rotationY: 5,
                duration: 0.3,
                ease: "power2.out"
              })
            })

            // Hover out
            partnerElement.addEventListener('mouseleave', () => {
              gsap.to(partnerElement, {
                scale: 1,
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out"
              })
            })
          }
        })
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [loading, partners])

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl p-6 w-32 h-32"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto mt-3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent"
          >
            Бидний хамтрагчид
          </h2>
          <p 
            ref={subtitleRef}
            className="text-lg lg:text-xl text-gray-600"
          >
            Дэлхийн алдартай их сургуулиуд болон боловсролын байгууллагуудтай хамтран ажиллаж байна
          </p>
        </div>

        <div ref={partnersRef} className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <Link
              key={index}
              href={partner.url}
              className={`partner-item partner-item-${index} group perspective-1000`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-white/20 transform-gpu">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={150}
                  height={150}
                  className="grayscale group-hover:grayscale-0 transition-all duration-300 filter drop-shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placekeanu.com/150/150'
                  }}
                />
              </div>
              <p className="text-center text-gray-600 mt-3 text-sm font-medium group-hover:text-purple-600 transition-colors">
                {partner.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}