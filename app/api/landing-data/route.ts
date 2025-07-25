import { getPartners, getTestimonials, getFeatures } from '@/app/actions/config'

export async function GET() {
  try {
    console.log("🔄 [landing-data] Fetching fresh data from database...")
    
    // Fetch all data in parallel for better performance
    const [partners, testimonials, features] = await Promise.all([
      getPartners().catch(error => {
        console.error('Error fetching partners:', error)
        return []
      }),
      getTestimonials().catch(error => {
        console.error('Error fetching testimonials:', error)
        return []
      }),
      getFeatures().catch(error => {
        console.error('Error fetching features:', error)
        return []
      })
    ])
    
    console.log(`✅ [landing-data] Data fetched: ${partners.length} partners, ${testimonials.length} testimonials, ${features.length} features`)
    
    const data = {
      partners,
      testimonials,
      features,
      lastUpdated: new Date().toISOString()
    }
    
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('❌ [landing-data] Error fetching landing page data:', error)
    
    // Return fallback data from static config
    try {
      const { partners, testimonials, features } = await import('@/config/site')
      return Response.json({
        partners,
        testimonials,
        features,
        lastUpdated: new Date().toISOString(),
        fallback: true
      })
    } catch (fallbackError) {
      console.error('❌ [landing-data] Error loading fallback data:', fallbackError)
      return Response.json({ 
        error: 'Failed to fetch landing page data',
        partners: [],
        testimonials: [],
        features: []
      }, { status: 500 })
    }
  }
}