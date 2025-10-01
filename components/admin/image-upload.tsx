'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Upload, Image as ImageIcon, Loader2, RefreshCw, Copy, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  maxFiles?: number
  existingImages?: string[]
  allowSelection?: boolean // Allow selecting from existing images
}

interface StoredImage {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export function ImageUpload({ onImagesUploaded, maxFiles = 5, existingImages = [], allowSelection = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages)
  const [allImages, setAllImages] = useState<StoredImage[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // Fetch all available images from storage
  const fetchAllImages = useCallback(async () => {
    setIsLoadingImages(true)
    try {
      const response = await fetch('/api/images')
      const data = await response.json()
      
      if (data.success) {
        setAllImages(data.images)
      } else {
        toast({
          title: "Failed to load images | 加载图片失败",
          description: "Could not fetch available images | 无法获取可用图片",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      toast({
        title: "Error loading images | 加载图片出错",
        description: "Failed to fetch available images | 获取可用图片失败",
        variant: "destructive",
      })
    } finally {
      setIsLoadingImages(false)
    }
  }, [toast])

  // Load images on component mount
  useEffect(() => {
    fetchAllImages()
  }, [fetchAllImages])

  // Copy URL to clipboard
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "URL copied | URL已复制",
        description: "Image URL copied to clipboard | 图片URL已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "Copy failed | 复制失败",
        description: "Failed to copy URL | URL复制失败",
        variant: "destructive",
      })
    }
  }

  // Select an image from available images
  const selectImage = (url: string) => {
    if (uploadedImages.length >= maxFiles) {
      toast({
        title: "Maximum reached | 已达上限",
        description: `Maximum ${maxFiles} file(s) allowed | 最多允许 ${maxFiles} 个文件`,
        variant: "destructive",
      })
      return
    }

    const newImages = [...uploadedImages, url]
    setUploadedImages(newImages)
    onImagesUploaded(newImages)
    
    toast({
      title: "Image selected | 图片已选择",
      description: "Image added to course | 图片已添加到课程",
    })
  }

  // Delete an image from storage
  const deleteImage = async (url: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Image deleted | 图片已删除",
          description: "Image removed from storage | 图片已从存储中移除",
        })
        
        // Remove from uploaded images if it was selected
        const newUploadedImages = uploadedImages.filter(img => img !== url)
        if (newUploadedImages.length !== uploadedImages.length) {
          setUploadedImages(newUploadedImages)
          onImagesUploaded(newUploadedImages)
        }
        
        // Refresh the images list
        fetchAllImages()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Delete failed | 删除失败",
        description: "Failed to delete image | 删除图片失败",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setImageToDelete(null)
    }
  }

  const uploadToVercelBlob = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedImages.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Too many files | 文件过多",
        description: `Maximum ${maxFiles} files allowed | 最多允许 ${maxFiles} 个文件`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    
    try {
      const uploadPromises = acceptedFiles.map(uploadToVercelBlob)
      const urls = await Promise.all(uploadPromises)
      
      const newImages = [...uploadedImages, ...urls]
      setUploadedImages(newImages)
      onImagesUploaded(newImages)
      
      toast({
        title: "Upload successful | 上传成功",
        description: `${acceptedFiles.length} image(s) uploaded | ${acceptedFiles.length} 张图片已上传`,
      })
      
      // Refresh the all images list
      fetchAllImages()
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed | 上传失败",
        description: "Failed to upload images | 图片上传失败",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }, [uploadedImages, maxFiles, onImagesUploaded, toast, fetchAllImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': []
    },
    multiple: true,
    disabled: uploading,
    noClick: false,
    noKeyboard: false
  })

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    onImagesUploaded(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors bg-white
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          <div className="text-lg font-medium">
            {uploading
              ? 'Uploading... | 上传中...'
              : isDragActive
              ? 'Drop images here | 拖放图片到这里'
              : 'Drag & drop images or click to select | 拖放图片或点击选择'}
          </div>
          <div className="text-sm text-gray-500">
            Supports: JPG, PNG, GIF, WebP (Max {maxFiles} files) | 支持：JPG, PNG, GIF, WebP（最多 {maxFiles} 个文件）
          </div>
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Uploaded Images | 已上传图片
              </h3>
              <Badge variant="secondary">
                {uploadedImages.length} / {maxFiles}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={200}
                      height={200}
                    />
                  </div>
                  <Button
                    onClick={() => removeImage(index)}
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    {url.split('/').pop()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Available Images Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              All Available Images | 所有可用图片
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {allImages.length} images | {allImages.length} 张图片
              </Badge>
              <Button
                onClick={fetchAllImages}
                variant="outline"
                size="sm"
                disabled={isLoadingImages}
              >
                {isLoadingImages ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh | 刷新
              </Button>
            </div>
          </div>
          
          {isLoadingImages ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading images... | 加载图片中...</span>
            </div>
          ) : allImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No images found | 未找到图片
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((image, index) => {
                const isSelected = uploadedImages.includes(image.url);
                return (
                  <div key={image.url} className="relative group">
                    <div 
                      className={`aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                        allowSelection ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all' : ''
                      } ${
                        isSelected ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => allowSelection && !isSelected && selectImage(image.url)}
                    >
                      <Image
                        src={image.url}
                        alt={`Available image ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={200}
                        height={200}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                          <Badge className="bg-green-600">Selected | 已选择</Badge>
                        </div>
                      )}
                    </div>
                    {!allowSelection && (
                      <>
                        <Button
                          onClick={() => copyToClipboard(image.url)}
                          variant="secondary"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            setImageToDelete(image.url)
                          }}
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -left-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-500 truncate">
                        {image.pathname.split('/').pop()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </div>
                      {allowSelection ? (
                        <Button
                          onClick={() => !isSelected && selectImage(image.url)}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="w-full h-6 text-xs"
                          disabled={isSelected || uploadedImages.length >= maxFiles}
                        >
                          {isSelected ? '✓ Selected | 已选择' : 'Select | 选择'}
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            onClick={() => copyToClipboard(image.url)}
                            variant="outline"
                            size="sm"
                            className="flex-1 h-6 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy | 复制
                          </Button>
                          <Button
                            onClick={() => setImageToDelete(image.url)}
                            variant="destructive"
                            size="sm"
                            className="h-6 text-xs px-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!imageToDelete} onOpenChange={() => !isDeleting && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image? | 删除图片？</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone and will permanently remove the image from storage.
              <br /><br />
              您确定要删除此图片吗？此操作无法撤销，将永久删除存储中的图片。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel | 取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => imageToDelete && deleteImage(imageToDelete)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting... | 删除中...
                </>
              ) : (
                'Delete | 删除'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}