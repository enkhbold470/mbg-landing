import { NextRequest, NextResponse } from 'next/server'
import { list, del } from '@vercel/blob'

export async function GET(request: NextRequest) {
  try {
    // List all blobs in the storage
    const { blobs } = await list()
    
    // Filter only image files and format the response
    const images = blobs
      .filter(blob => {
        const isImage = blob.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        return isImage
      })
      .map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      }))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()) // Sort by newest first

    return NextResponse.json({ 
      success: true, 
      images,
      count: images.length
    })
  } catch (error) {
    console.error('Error listing images:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to list images',
        images: [],
        count: 0
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Delete the blob
    await del(url)

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete image' 
      },
      { status: 500 }
    )
  }
}