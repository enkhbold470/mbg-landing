import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logCreate, logUpdate, logDelete } from '@/lib/audit'
import { AdminRole } from '@prisma/client'

// Get all admins (Super Admin only)
export async function GET() {
  try {
    await requireSuperAdmin()

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        lastLoginIp: true,
        lastLoginDevice: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            auditLogs: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ admins })
  } catch (error) {
    console.error('Get admins error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch admins' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 403 }
    )
  }
}

// Create new admin (Super Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await requireSuperAdmin()

    const { username, email, password, role } = await request.json()

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Username, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!Object.values(AdminRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if username or email already exists
    const existing = await prisma.admin.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Log the creation
    await logCreate(session, 'Admin', admin.id, admin.username, admin)

    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create admin' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 403 }
    )
  }
}

// Update admin (Super Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSuperAdmin()

    const { id, username, email, password, role, isActive } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    // Get old data for audit log
    const oldAdmin = await prisma.admin.findUnique({ where: { id } })
    if (!oldAdmin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    if (username !== undefined) updateData.username = username
    if (email !== undefined) updateData.email = email
    if (password) updateData.password = await hashPassword(password)
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    // Update admin
    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Log the update
    await logUpdate(session, 'Admin', admin.id, admin.username, oldAdmin, admin)

    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Update admin error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update admin' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 403 }
    )
  }
}

// Delete admin (Super Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireSuperAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    // Prevent deleting yourself
    if (id === session.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Get admin for audit log
    const admin = await prisma.admin.findUnique({ where: { id } })
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Delete admin
    await prisma.admin.delete({ where: { id } })

    // Log the deletion
    await logDelete(session, 'Admin', id, admin.username, admin)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete admin error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete admin' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 403 }
    )
  }
}

