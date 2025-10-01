import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if user is accessing /admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the host from the request
    const host = request.headers.get('host') || ''
    
    // Allow access if on localhost or vercel deployment
    const isAllowedHost = host.startsWith('localhost') || host === 'mbg-landing.vercel.app' || host.startsWith('127.0.0.1:')
    
    if (!isAllowedHost) {
      // Block access to admin routes for non-allowed hosts
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Check authentication for protected admin routes
    // Skip auth check only for the login page itself
    const isLoginPage = request.nextUrl.pathname === '/admin'
    
    if (!isLoginPage) {
      // Check if admin-session cookie exists
      const sessionCookie = request.cookies.get('admin-session')
      
      if (!sessionCookie) {
        // No session cookie, redirect to login
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      try {
        // Validate that the cookie contains valid JSON
        JSON.parse(sessionCookie.value)
      } catch {
        // Invalid session cookie, redirect to login
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
