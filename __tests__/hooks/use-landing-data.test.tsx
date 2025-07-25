import { renderHook, waitFor } from '@testing-library/react'
import { useLandingData } from '@/hooks/use-landing-data'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('useLandingData', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should fetch landing data successfully', async () => {
    // Arrange
    const mockData = {
      partners: [
        { name: 'Partner 1', logo: 'logo1.png', url: 'https://partner1.com' }
      ],
      testimonials: [
        { name: 'User 1', role: 'Student', content: 'Great!', rating: 5, image: 'user1.jpg' }
      ],
      features: [
        { title: 'Feature 1', description: 'Awesome feature', icon: '🚀' }
      ],
      lastUpdated: '2024-01-01T00:00:00.000Z'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: new Headers(),
    } as Response)

    // Act
    const { result } = renderHook(() => useLandingData())

    // Assert initial state
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.partners).toEqual([])
    expect(result.current.testimonials).toEqual([])
    expect(result.current.features).toEqual([])

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Assert final state
    expect(result.current.data).toEqual(mockData)
    expect(result.current.partners).toEqual(mockData.partners)
    expect(result.current.testimonials).toEqual(mockData.testimonials)
    expect(result.current.features).toEqual(mockData.features)
    expect(result.current.error).toBe(null)
    expect(result.current.isUsingFallback).toBe(false)

    // Verify fetch was called correctly
    expect(mockFetch).toHaveBeenCalledWith('/api/landing-data', {
      headers: {
        'Cache-Control': 'max-age=300'
      }
    })
  })

  it('should handle fetch error and load fallback data', async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    // Act
    const { result } = renderHook(() => useLandingData())

    // Wait for error handling and fallback loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Assert
    expect(result.current.error).toBe('Network error')
    expect(result.current.isUsingFallback).toBe(true)
    expect(result.current.data).toBeTruthy()
    expect(result.current.partners).toBeTruthy()
    expect(result.current.testimonials).toBeTruthy()
    expect(result.current.features).toBeTruthy()
  })

  it('should handle HTTP error responses', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' }),
      headers: new Headers(),
    } as Response)

    // Act
    const { result } = renderHook(() => useLandingData())

    // Wait for error handling
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Assert
    expect(result.current.error).toBe('HTTP error! status: 500')
    expect(result.current.isUsingFallback).toBe(true)
  })

  it('should handle fallback data when API returns fallback flag', async () => {
    // Arrange
    const mockData = {
      partners: [],
      testimonials: [],
      features: [],
      lastUpdated: '2024-01-01T00:00:00.000Z',
      fallback: true
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: new Headers(),
    } as Response)

    // Mock console.warn to verify it's called
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    // Act
    const { result } = renderHook(() => useLandingData())

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Assert
    expect(result.current.isUsingFallback).toBe(true)
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ Using fallback data for landing page')

    // Cleanup
    consoleSpy.mockRestore()
  })

  it('should handle JSON parsing error', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON')
      },
      headers: new Headers(),
    } as Response)

    // Act
    const { result } = renderHook(() => useLandingData())

    // Wait for error handling
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Assert
    expect(result.current.error).toBe('Invalid JSON')
    expect(result.current.isUsingFallback).toBe(true)
  })

  it('should provide default empty arrays when data is null', () => {
    // Act
    const { result } = renderHook(() => useLandingData())

    // Assert
    expect(result.current.partners).toEqual([])
    expect(result.current.testimonials).toEqual([])
    expect(result.current.features).toEqual([])
    expect(result.current.isUsingFallback).toBe(false)
  })

  it('should only fetch data once on mount', async () => {
    // Arrange
    const mockData = {
      partners: [],
      testimonials: [],
      features: [],
      lastUpdated: '2024-01-01T00:00:00.000Z'
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
      headers: new Headers(),
    } as Response)

    // Act
    const { result, rerender } = renderHook(() => useLandingData())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Rerender the hook
    rerender()

    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})