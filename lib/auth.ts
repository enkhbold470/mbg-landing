import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { AdminRole } from '@prisma/client'

export interface AdminSession {
  id: string
  username: string
  email: string
  role: AdminRole
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Authenticate admin and create session
 */
export async function authenticateAdmin(
  username: string,
  password: string,
  ipAddress: string,
  userAgent: string,
  device?: string
): Promise<AdminSession> {
  // Find admin by username
  const admin = await prisma.admin.findUnique({
    where: { username }
  })

  if (!admin || !admin.isActive) {
    throw new Error('Invalid credentials')
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, admin.password)
  if (!isValidPassword) {
    throw new Error('Invalid credentials')
  }

  // Update last login info
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
      lastLoginDevice: device
    }
  })

  // Create session
  const session: AdminSession = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set('admin-session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    sameSite: 'lax'
  })

  return session
}

/**
 * Get current admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')
    
    if (!sessionCookie?.value) {
      return null
    }

    const session = JSON.parse(sessionCookie.value) as AdminSession
    
    // Verify admin still exists and is active
    const admin = await prisma.admin.findUnique({
      where: { id: session.id }
    })

    if (!admin || !admin.isActive) {
      await clearAdminSession()
      return null
    }

    return session
  } catch (error) {
    console.error('Error getting admin session:', error)
    return null
  }
}

/**
 * Clear admin session (logout)
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

/**
 * Check if admin has required role
 */
export function hasRole(session: AdminSession | null, requiredRole: AdminRole): boolean {
  if (!session) return false
  
  // Super admin has access to everything
  if (session.role === AdminRole.SUPER_ADMIN) return true
  
  // Regular admin only has admin access
  return session.role === requiredRole
}

/**
 * Check if admin is super admin
 */
export function isSuperAdmin(session: AdminSession | null): boolean {
  return session?.role === AdminRole.SUPER_ADMIN
}

/**
 * Require authentication middleware
 */
export async function requireAuth(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

/**
 * Require super admin role
 */
export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAuth()
  if (!isSuperAdmin(session)) {
    throw new Error('Forbidden: Super admin access required')
  }
  return session
}

