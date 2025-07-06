'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface Partner {
  name: string
  logo: string
  url: string
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

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
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Бидний хамтрагчид</h2>
          <p className="text-lg lg:text-xl text-gray-600">
            Дэлхийн алдартай их сургуулиуд болон боловсролын байгууллагуудтай хамтран ажиллаж байна
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <Link
              key={index}
              href={partner.url}
              className="group transition-all duration-300 hover:scale-110 hover:shadow-lg rounded-2xl p-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white rounded-2xl p-6 shadow-md group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={150}
                  height={150}
                  className="grayscale group-hover:grayscale-0 transition-all duration-300"
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