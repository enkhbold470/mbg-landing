import { NextResponse } from 'next/server'
import { getFAQs } from '@/app/actions/config'

export async function GET() {
  try {
    const faqs = await getFAQs()
    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
} 