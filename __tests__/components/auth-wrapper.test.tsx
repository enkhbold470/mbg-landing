import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import AuthWrapper from '@/components/admin/auth-wrapper'
import { logout } from '@/app/actions/config'

// Mock the actions
jest.mock('@/app/actions/config', () => ({
  logout: jest.fn(),
  authenticateAdmin: jest.fn()
}))

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock window.location
const mockLocation = {
  href: '',
  host: 'localhost:3000'
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

describe('AuthWrapper - Logout Functionality', () => {
  const mockLogout = logout as jest.MockedFunction<typeof logout>

  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.href = ''
  })

  it('should render logout button when authenticated', () => {
    render(
      <AuthWrapper isAuthenticated={true}>
        <div>Admin Content</div>
      </AuthWrapper>
    )

    expect(screen.getByText('Гарах')).toBeInTheDocument()
    expect(screen.getByText('MBG Админ Панель')).toBeInTheDocument()
  })

  it('should handle logout button click successfully', async () => {
    mockLogout.mockResolvedValue({
      success: true,
      message: 'Logged out successfully'
    })

    render(
      <AuthWrapper isAuthenticated={true}>
        <div>Admin Content</div>
      </AuthWrapper>
    )

    const logoutButton = screen.getByText('Гарах')
    
    await act(async () => {
      fireEvent.click(logoutButton)
    })

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled()
    })

    // Check if redirect happened
    expect(mockLocation.href).toBe('/admin')
  })

  it('should handle logout error gracefully', async () => {
    mockLogout.mockRejectedValue(new Error('Logout failed'))

    render(
      <AuthWrapper isAuthenticated={true}>
        <div>Admin Content</div>
      </AuthWrapper>
    )

    const logoutButton = screen.getByText('Гарах')
    
    await act(async () => {
      fireEvent.click(logoutButton)
    })

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled()
    })

    // Should not redirect on error
    expect(mockLocation.href).toBe('')
  })

  it('should show loading state during logout', async () => {
    let resolveLogout: (value: any) => void
    const logoutPromise = new Promise((resolve) => {
      resolveLogout = resolve
    })
    mockLogout.mockReturnValue(logoutPromise as any)

    render(
      <AuthWrapper isAuthenticated={true}>
        <div>Admin Content</div>
      </AuthWrapper>
    )

    const logoutButton = screen.getByText('Гарах')
    
    await act(async () => {
      fireEvent.click(logoutButton)
    })

    // Should show loading state
    expect(screen.getByText('Гарах...')).toBeInTheDocument()

    // Resolve the logout promise
    resolveLogout!({ success: true, message: 'Logged out successfully' })

    await waitFor(() => {
      expect(screen.queryByText('Гарах...')).not.toBeInTheDocument()
    })
  })

  it('should not render logout button when not authenticated', () => {
    render(
      <AuthWrapper isAuthenticated={false}>
        <div>Admin Content</div>
      </AuthWrapper>
    )

    expect(screen.queryByText('Гарах')).not.toBeInTheDocument()
    expect(screen.getByText('MBG Админ нэвтрэх')).toBeInTheDocument()
  })
})