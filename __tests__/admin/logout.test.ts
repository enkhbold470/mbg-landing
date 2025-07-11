import { logout } from '@/app/actions/config'

// Mock fetch globally
global.fetch = jest.fn()

describe('Logout Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully logout and return success response', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        message: 'Logged out successfully'
      })
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const result = await logout()

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    expect(result).toEqual({
      success: true,
      message: 'Logged out successfully'
    })
  })

  it('should throw error when logout API returns error', async () => {
    const mockResponse = {
      ok: false,
      status: 500
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    await expect(logout()).rejects.toThrow('Failed to logout')
  })

  it('should throw error when fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    await expect(logout()).rejects.toThrow('Network error')
  })

  it('should handle network errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))

    await expect(logout()).rejects.toThrow('Failed to fetch')
  })
})