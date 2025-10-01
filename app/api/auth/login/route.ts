import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/auth'
import { logLogin, getClientIp, getUserAgent } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get client info
    const ipAddress = await getClientIp()
    const userAgent = await getUserAgent()
    const device = userAgent.toLowerCase().includes('mobile') ? 'Mobile' : 'Desktop'

    // Authenticate admin
    const session = await authenticateAdmin(username, password, ipAddress, userAgent, device)
    
    // Log the login
    await logLogin(session)
    
    return NextResponse.json({ 
      success: true,
      admin: {
        username: session.username,
        email: session.email,
        role: session.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }
}