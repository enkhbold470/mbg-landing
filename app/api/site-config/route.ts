import { NextResponse } from 'next/server'
import { getSiteConfig } from '@/app/actions/config'

export async function GET() {
  try {
    const siteConfig = await getSiteConfig()
    return NextResponse.json(siteConfig)
  } catch (error) {
    console.error('Error fetching site config:', error)
    return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 })
  }
} 