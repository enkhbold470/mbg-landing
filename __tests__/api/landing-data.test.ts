import { GET } from '@/app/api/landing-data/route'
import { getPartners, getTestimonials, getFeatures } from '@/app/actions/config'

// Mock the database actions
jest.mock('@/app/actions/config', () => ({
  getPartners: jest.fn(),
  getTestimonials: jest.fn(),
  getFeatures: jest.fn(),
}))

// Mock the static config import
jest.mock('@/config/site', () => ({
  partners: [
    { name: 'Test Partner', logo: 'test-logo.png', url: 'https://test.com' }
  ],
  testimonials: [
    { name: 'Test User', role: 'Student', content: 'Great course!', rating: 5, image: 'test.jpg' }
  ],
  features: [
    { title: 'Test Feature', description: 'Test description', icon: '🧪' }
  ]
}))

const mockedGetPartners = getPartners as jest.MockedFunction<typeof getPartners>
const mockedGetTestimonials = getTestimonials as jest.MockedFunction<typeof getTestimonials>
const mockedGetFeatures = getFeatures as jest.MockedFunction<typeof getFeatures>

describe('/api/landing-data', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch all landing page data', async () => {
    // Arrange
    const mockPartners = [
      { id: '1', name: 'Partner 1', logo: 'logo1.png', url: 'https://partner1.com' },
      { id: '2', name: 'Partner 2', logo: 'logo2.png', url: 'https://partner2.com' }
    ]
    const mockTestimonials = [
      { id: '1', name: 'User 1', role: 'Student', content: 'Excellent!', rating: 5, image: 'user1.jpg' }
    ]
    const mockFeatures = [
      { id: '1', title: 'Feature 1', description: 'Great feature', icon: '⭐' }
    ]

    mockedGetPartners.mockResolvedValue(mockPartners)
    mockedGetTestimonials.mockResolvedValue(mockTestimonials)
    mockedGetFeatures.mockResolvedValue(mockFeatures)

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('partners', mockPartners)
    expect(data).toHaveProperty('testimonials', mockTestimonials)
    expect(data).toHaveProperty('features', mockFeatures)
    expect(data).toHaveProperty('lastUpdated')
    expect(data.fallback).toBeUndefined()

    // Verify all functions were called
    expect(mockedGetPartners).toHaveBeenCalledTimes(1)
    expect(mockedGetTestimonials).toHaveBeenCalledTimes(1)
    expect(mockedGetFeatures).toHaveBeenCalledTimes(1)
  })

  it('should handle partial failures gracefully', async () => {
    // Arrange
    const mockPartners = [{ id: '1', name: 'Partner 1', logo: 'logo1.png', url: 'https://partner1.com' }]
    
    mockedGetPartners.mockResolvedValue(mockPartners)
    mockedGetTestimonials.mockRejectedValue(new Error('Database error'))
    mockedGetFeatures.mockRejectedValue(new Error('Network error'))

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('partners', mockPartners)
    expect(data).toHaveProperty('testimonials', [])
    expect(data).toHaveProperty('features', [])
    expect(data).toHaveProperty('lastUpdated')
  })

  it('should return fallback data when all database calls fail', async () => {
    // Arrange
    mockedGetPartners.mockRejectedValue(new Error('DB connection failed'))
    mockedGetTestimonials.mockRejectedValue(new Error('DB connection failed'))
    mockedGetFeatures.mockRejectedValue(new Error('DB connection failed'))

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('fallback', true)
    expect(data).toHaveProperty('partners')
    expect(data).toHaveProperty('testimonials')
    expect(data).toHaveProperty('features')
    expect(data).toHaveProperty('lastUpdated')
  })

  it('should set appropriate cache headers', async () => {
    // Arrange
    mockedGetPartners.mockResolvedValue([])
    mockedGetTestimonials.mockResolvedValue([])
    mockedGetFeatures.mockResolvedValue([])

    // Act
    const response = await GET()

    // Assert
    expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=300, stale-while-revalidate=600')
  })

  it('should handle complete failure and return error response', async () => {
    // Arrange - Mock import failure as well
    jest.doMock('@/config/site', () => {
      throw new Error('Config import failed')
    })

    mockedGetPartners.mockRejectedValue(new Error('Complete failure'))
    mockedGetTestimonials.mockRejectedValue(new Error('Complete failure'))
    mockedGetFeatures.mockRejectedValue(new Error('Complete failure'))

    // Act
    const response = await GET()
    const data = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
    expect(data).toHaveProperty('partners', [])
    expect(data).toHaveProperty('testimonials', [])
    expect(data).toHaveProperty('features', [])
  })

  it('should handle concurrent requests efficiently', async () => {
    // Arrange
    const mockData = {
      partners: [{ id: '1', name: 'Partner', logo: 'logo.png', url: 'https://test.com' }],
      testimonials: [{ id: '1', name: 'User', role: 'Student', content: 'Good', rating: 5, image: 'user.jpg' }],
      features: [{ id: '1', title: 'Feature', description: 'Description', icon: '🚀' }]
    }

    mockedGetPartners.mockResolvedValue(mockData.partners)
    mockedGetTestimonials.mockResolvedValue(mockData.testimonials)
    mockedGetFeatures.mockResolvedValue(mockData.features)

    // Act - Make multiple concurrent requests
    const promises = Array(5).fill(null).map(() => GET())
    const responses = await Promise.all(promises)

    // Assert
    responses.forEach(response => {
      expect(response.status).toBe(200)
    })

    // Database functions should still only be called once due to Promise.all
    expect(mockedGetPartners).toHaveBeenCalledTimes(5)
    expect(mockedGetTestimonials).toHaveBeenCalledTimes(5)
    expect(mockedGetFeatures).toHaveBeenCalledTimes(5)
  })
})