import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { AdminSession } from './auth'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW'
export type EntityType = 'Course' | 'Testimonial' | 'Partner' | 'FAQ' | 'Feature' | 'SiteConfig' | 'Admin'

interface AuditLogData {
  action: AuditAction
  entityType: EntityType
  entityId?: string
  entityTitle?: string
  changes?: any
}

/**
 * Parse user agent to extract device, browser, and OS info
 */
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()
  
  // Detect device
  let device = 'Desktop'
  if (ua.includes('mobile')) device = 'Mobile'
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet'
  
  // Detect browser
  let browser = 'Unknown'
  if (ua.includes('edg/')) browser = 'Edge'
  else if (ua.includes('chrome/')) browser = 'Chrome'
  else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari'
  else if (ua.includes('firefox/')) browser = 'Firefox'
  
  // Detect OS
  let os = 'Unknown'
  if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac')) os = 'macOS'
  else if (ua.includes('linux')) os = 'Linux'
  else if (ua.includes('android')) os = 'Android'
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
  
  return { device, browser, os }
}

/**
 * Get client IP address from headers
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  
  // Try multiple headers that might contain the IP
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const cfConnectingIp = headersList.get('cf-connecting-ip')
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }
  
  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  
  return 'unknown'
}

/**
 * Get user agent from headers
 */
export async function getUserAgent(): Promise<string> {
  const headersList = await headers()
  return headersList.get('user-agent') || 'unknown'
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  admin: AdminSession,
  data: AuditLogData
): Promise<void> {
  try {
    const ipAddress = await getClientIp()
    const userAgent = await getUserAgent()
    const { device, browser, os } = parseUserAgent(userAgent)

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        entityTitle: data.entityTitle,
        changes: data.changes || null,
        ipAddress,
        userAgent,
        device,
        browser,
        os
      }
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - we don't want audit logging to break the main operation
  }
}

/**
 * Log a CREATE action
 */
export async function logCreate(
  admin: AdminSession,
  entityType: EntityType,
  entityId: string,
  entityTitle: string,
  data: any
): Promise<void> {
  await createAuditLog(admin, {
    action: 'CREATE',
    entityType,
    entityId,
    entityTitle,
    changes: { created: data }
  })
}

/**
 * Log an UPDATE action
 */
export async function logUpdate(
  admin: AdminSession,
  entityType: EntityType,
  entityId: string,
  entityTitle: string,
  oldData: any,
  newData: any
): Promise<void> {
  // Calculate what changed
  const changes: any = {}
  for (const key in newData) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = { from: oldData[key], to: newData[key] }
    }
  }

  await createAuditLog(admin, {
    action: 'UPDATE',
    entityType,
    entityId,
    entityTitle,
    changes
  })
}

/**
 * Log a DELETE action
 */
export async function logDelete(
  admin: AdminSession,
  entityType: EntityType,
  entityId: string,
  entityTitle: string,
  data: any
): Promise<void> {
  await createAuditLog(admin, {
    action: 'DELETE',
    entityType,
    entityId,
    entityTitle,
    changes: { deleted: data }
  })
}

/**
 * Log a LOGIN action
 */
export async function logLogin(admin: AdminSession): Promise<void> {
  await createAuditLog(admin, {
    action: 'LOGIN',
    entityType: 'Admin',
    entityId: admin.id,
    entityTitle: admin.username
  })
}

/**
 * Log a LOGOUT action
 */
export async function logLogout(admin: AdminSession): Promise<void> {
  await createAuditLog(admin, {
    action: 'LOGOUT',
    entityType: 'Admin',
    entityId: admin.id,
    entityTitle: admin.username
  })
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(filters?: {
  adminId?: string
  action?: AuditAction
  entityType?: EntityType
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const where: any = {}
  
  if (filters?.adminId) where.adminId = filters.adminId
  if (filters?.action) where.action = filters.action
  if (filters?.entityType) where.entityType = filters.entityType
  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {}
    if (filters.startDate) where.createdAt.gte = filters.startDate
    if (filters.endDate) where.createdAt.lte = filters.endDate
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0
    }),
    prisma.auditLog.count({ where })
  ])

  return { logs, total }
}

