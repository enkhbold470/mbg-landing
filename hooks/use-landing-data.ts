import { useState, useEffect } from 'react'

interface Partner {
  name: string
  logo: string
  url: string
}

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
  image: string
}

interface Feature {
  title: string
  description: string
  icon: string
}

interface LandingData {
  partners: Partner[]
  testimonials: Testimonial[]
  features: Feature[]
  lastUpdated: string
  fallback?: boolean
}

export function useLandingData() {
  const [data, setData] = useState<LandingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLandingData() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/landing-data', {
          // Add cache headers for better performance
          headers: {
            'Cache-Control': 'max-age=300' // 5 minutes
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
        
        if (result.fallback) {
          console.warn('⚠️ Using fallback data for landing page')
        }
        
      } catch (err) {
        console.error('Error fetching landing data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        
        // Try to load fallback data directly
        try {
          const { partners, testimonials, features } = await import('@/config/site')
          setData({
            partners,
            testimonials,
            features,
            lastUpdated: new Date().toISOString(),
            fallback: true
          })
          console.log('✅ Loaded fallback data from config')
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLandingData()
  }, [])

  return {
    data,
    loading,
    error,
    partners: data?.partners || [],
    testimonials: data?.testimonials || [],
    features: data?.features || [],
    isUsingFallback: data?.fallback || false
  }
}