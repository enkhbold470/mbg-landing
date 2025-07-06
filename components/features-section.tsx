'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Feature {
  title: string
  description: string
  icon: string
}

export function FeaturesSection() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const response = await fetch('/api/features')
        if (response.ok) {
          const data = await response.json()
          setFeatures(data)
        }
      } catch (error) {
        console.error('Error fetching features:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

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
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Онцлог боломжууд</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Бид дараах онцлог боломжуудыг санал болгож байна
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50"
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
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