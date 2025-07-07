'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Trash2, Star, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Field {
  name: string
  label: string
  type: 'input' | 'textarea' | 'number' | 'url'
  required?: boolean
  placeholder?: string
}

interface ContentSectionProps {
  title: string
  items: any[]
  fields: Field[]
  onSubmit: (data: any, isEdit: boolean, editingItem?: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
  renderItem: (item: any) => React.ReactNode
  isSubmitting?: boolean
}

export function ContentSection({ 
  title, 
  items, 
  fields, 
  onSubmit, 
  onDelete, 
  renderItem,
  isSubmitting = false
}: ContentSectionProps) {
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formKey, setFormKey] = useState(0) // For force re-rendering form
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast();
  console.log(`📝 [ContentSection-${title}] Rendering with ${items.length} items, isSubmitting: ${isSubmitting}`);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault()
    
    if (isSubmitting) return // Prevent double submission
    
    console.log(`💾 [ContentSection-${title}] ${isEdit ? 'Updating' : 'Creating'} item`);
    
    const form = e.currentTarget
    if (!form) {
      console.error(`❌ [ContentSection-${title}] Form element not found`);
      return;
    }

    const formData = new FormData(form)
    const data: any = {}
    
    fields.forEach(field => {
      const value = formData.get(field.name) as string
      data[field.name] = field.type === 'number' ? parseInt(value) || 0 : value
    })
    
    try {
      await onSubmit(data, isEdit, editingItem)
      if (isEdit) {
        setEditingItem(null)
      } else {
        // Reset form by changing key to force re-render
        setFormKey(prev => prev + 1)
        console.log(`✅ [ContentSection-${title}] Form reset via key update`);
      }
    } catch (error) {
      console.error(`❌ [ContentSection-${title}] Error:`, error);
      toast({
        title: "Алдаа",
        description: `"${title.slice(0, -1)}"-ийг хадгалах үед алдаа гарлаа`,
        variant: "destructive"
      })  
    }
  }

  const handleDelete = async (id: string, itemName: string) => {
    console.log(`🗑️ [ContentSection-${title}] Deleting item:`, { id, itemName });
    
    if (confirm(`Уучлаарай уу, "${itemName}"-ийг устгах уу?`)) {
      setDeletingId(id)
      try {
        await onDelete(id)
        console.log(`✅ [ContentSection-${title}] Item deleted successfully:`, id);
      } catch (error) {
        console.error(`❌ [ContentSection-${title}] Delete error:`, error);
        toast({
          title: "Алдаа",
          description: `"${itemName}"-ийг устгах үед алдаа гарлаа`,
          variant: "destructive"
        })      
      } finally {
        setDeletingId(null)
      }
    }
  }

  const renderForm = (item?: any, isEdit = false) => (
    <form 
      key={isEdit ? 'edit-form' : `create-form-${formKey}`} 
      onSubmit={(e) => handleSubmit(e, isEdit)} 
      className="space-y-4"
    >
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={`${isEdit ? 'edit-' : 'create-'}${field.name}`}>
            {field.label}
          </Label>
          {field.type === 'textarea' ? (
            <Textarea
              id={`${isEdit ? 'edit-' : 'create-'}${field.name}`}
              name={field.name}
              defaultValue={item?.[field.name]}
              required={field.required}
              placeholder={field.placeholder}
              disabled={isSubmitting}
            />
          ) : (
            <Input
              id={`${isEdit ? 'edit-' : 'create-'}${field.name}`}
              name={field.name}
              type={field.type}
              defaultValue={item?.[field.name]}
              required={field.required}
              placeholder={field.placeholder}
              min={field.type === 'number' ? 0 : undefined}
              max={field.type === 'number' && field.name === 'rating' ? 5 : undefined}
              disabled={isSubmitting}
            />
          )}
        </div>
      ))}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isEdit ? 'Хадгалж байна...' : 'Үүсгэж байна...'}
          </>
        ) : (
          isEdit ? `Хадгалах ${title.slice(0, -1)}` : `Үүсгэх `
        )}
      </Button>
    </form>
  )

  return (
    <div className="space-y-8">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="text-xl text-slate-800">Шинэ {title.slice(0, -1)} үүсгэх</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderForm()}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
            Одоо байгаа {title} 
            <Badge variant="secondary" className="ml-2">{items.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-slate-200 p-4 rounded-lg bg-white hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {renderItem(item)}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            console.log(`✏️ [ContentSection-${title}] Opening edit dialog:`, item.id);
                            setEditingItem(item);
                          }}
                          disabled={isSubmitting}
                          className="hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
                        </DialogHeader>
                        {renderForm(editingItem, true)}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.name || item.question || item.title)}
                      disabled={deletingId === item.id || isSubmitting}
                      className="hover:bg-red-600"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {items.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <div className="bg-slate-50 rounded-lg p-8">
                  <p className="text-lg font-medium mb-2">Мэдээлэл олдсонгүй</p>
                  <p>Эхний {title.toLowerCase().slice(0, -1)}-ийг үүсгэж эхлээрэй!</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 