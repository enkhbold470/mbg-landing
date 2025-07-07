'use client'

import { useState, useEffect, useRef } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface FAQ {
  question: string
  answer: string
}

export function FaqSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch('/api/faqs')
        if (response.ok) {
          const data = await response.json()
          setFaqs(data)
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  useEffect(() => {
    if (!loading && faqs.length > 0) {
      const ctx = gsap.context(() => {
        // Initial setup - hide elements
        gsap.set([titleRef.current, subtitleRef.current], { 
          opacity: 0, 
          y: 50 
        })
        gsap.set(accordionRef.current, { 
          opacity: 0, 
          y: 100,
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

        // Accordion animation
        tl.to(accordionRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.4)"
        }, 0.4)

      }, sectionRef)

      return () => ctx.revert()
    }
  }, [loading, faqs])

  if (loading) {
    return (
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="faq" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Түгээмэл асуултууд</h2>
          <p ref={subtitleRef} className="text-lg lg:text-xl text-gray-600">
            Та бүхэнд хамгийн их асуугддаг асуултууд болон хариултууд
          </p>
        </div>

        <div ref={accordionRef} className="bg-white rounded-3xl shadow-lg p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
} 