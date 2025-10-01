import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isSuperAdmin } from '@/lib/auth'
import { getAuditLogs } from '@/lib/audit'

// Get audit logs
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const filters: any = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0')
    }

    // Only super admins can see all logs
    // Regular admins can only see their own logs
    if (!isSuperAdmin(session)) {
      filters.adminId = session.id
    } else if (searchParams.get('adminId')) {
      filters.adminId = searchParams.get('adminId')!
    }

    if (searchParams.get('action')) {
      filters.action = searchParams.get('action')!
    }

    if (searchParams.get('entityType')) {
      filters.entityType = searchParams.get('entityType')!
    }

    if (searchParams.get('startDate')) {
      filters.startDate = new Date(searchParams.get('startDate')!)
    }

    if (searchParams.get('endDate')) {
      filters.endDate = new Date(searchParams.get('endDate')!)
    }

    const { logs, total } = await getAuditLogs(filters)

    return NextResponse.json({ 
      logs,
      total,
      limit: filters.limit,
      offset: filters.offset
    })
  } catch (error) {
    console.error('Get audit logs error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch audit logs' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

