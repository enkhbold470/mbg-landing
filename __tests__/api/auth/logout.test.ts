import { POST } from '@/app/api/auth/logout/route'
import { cookies } from 'next/headers'

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn()
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: data,
      status: options?.status || 200
    }))
  }
}))

describe('/api/auth/logout', () => {
  const mockCookieStore = {
    delete: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(cookies as jest.Mock).mockReturnValue(mockCookieStore)
  })

  it('should successfully logout and delete auth cookie', async () => {
    const { NextResponse } = require('next/server')
    
    const response = await POST()

    expect(mockCookieStore.delete).toHaveBeenCalledWith('admin-auth')
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Logged out successfully'
    })
    expect(response.json).toEqual({
      success: true,
      message: 'Logged out successfully'
    })
  })

  it('should handle errors gracefully', async () => {
    const { NextResponse } = require('next/server')
    
    // Mock an error
    mockCookieStore.delete.mockImplementation(() => {
      throw new Error('Cookie deletion failed')
    })

    const response = await POST()

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Failed to logout'
      },
      { status: 500 }
    )
    expect(response.json).toEqual({
      success: false,
      message: 'Failed to logout'
    })
  })
})