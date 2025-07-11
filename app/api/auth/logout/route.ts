import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Delete the admin auth cookie
    cookieStore.delete('admin-auth')
    
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