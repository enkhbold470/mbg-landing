import { NextResponse } from 'next/server'
import { getFeatures } from '@/app/actions/config'

export async function GET() {
  try {
    const features = await getFeatures()
    return NextResponse.json(features)
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
  }
} 