# Image Upload Feature Guide

## Overview
A drag-and-drop image upload component has been added to the admin panel that uploads images directly to Vercel Blob Storage.

## Features
- **Drag & Drop Interface**: Simply drag images into the upload area
- **Click to Select**: Click the upload area to open file browser
- **Multiple File Support**: Upload up to 10 images at once
- **File Type Validation**: Supports JPG, PNG, GIF, WebP formats
- **File Size Limit**: Maximum 5MB per image
- **Real-time Preview**: See uploaded images immediately
- **URL Copy**: Easy copy-to-clipboard for image URLs
- **Bilingual Interface**: English and Chinese support

## How to Use

1. **Access the Upload Tab**:
   - Go to `/admin` page
   - Click on the "Images | 图片上传" tab

2. **Upload Images**:
   - Drag and drop images into the upload area, OR
   - Click the upload area to select files from your computer
   - Wait for upload completion (you'll see a loading spinner)

3. **Copy Image URLs**:
   - After upload, scroll down to see the "Copy URLs" section
   - Click "Copy | 复制" next to any image URL
   - Use these URLs in your content (courses, testimonials, etc.)

4. **Remove Images**:
   - Hover over any uploaded image
   - Click the red "X" button to remove it

## Technical Details

### Files Created:
- `/components/admin/image-upload.tsx` - Main upload component
- `/app/api/upload/route.ts` - API endpoint for Vercel Blob uploads

### Dependencies Added:
- `react-dropzone` - For drag & drop functionality
- `@vercel/blob` - For Vercel Blob Storage integration

### Integration:
- Added new "Images" tab to admin panel
- Connected to existing state management
- Integrated with toast notifications

## Environment Setup
Make sure you have Vercel Blob Storage configured in your project. The upload will use your Vercel project's blob storage automatically.

## Usage Examples

### For Course Images:
1. Upload your course image using the Images tab
2. Copy the generated URL
3. Go to Courses tab and paste the URL in the "Image URL" field

### For Partner Logos:
1. Upload logo using the Images tab
2. Copy the URL
3. Go to Partners tab and use the URL in "Logo URL" field

### For Testimonial Photos:
1. Upload profile photo using Images tab
2. Copy the URL
3. Go to Testimonials tab and use in "Image URL" field

## Notes
- Images are stored permanently in Vercel Blob Storage
- URLs are publicly accessible
- No database storage needed for the images themselves
- Images persist across deployments