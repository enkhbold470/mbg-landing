import { NextResponse } from 'next/server'
import { getAdminSession, clearAdminSession } from '@/lib/auth'
import { logLogout } from '@/lib/audit'

export async function POST() {
  try {
    // Get current session before clearing
    const session = await getAdminSession()
    
    if (session) {
      // Log the logout
      await logLogout(session)
    }
    
    // Clear the session
    await clearAdminSession()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to logout' 
      },
      { status: 500 }
    )
  }
}