'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Trash2, Star } from 'lucide-react'

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
}

export function ContentSection({ 
  title, 
  items, 
  fields, 
  onSubmit, 
  onDelete, 
  renderItem 
}: ContentSectionProps) {
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formKey, setFormKey] = useState(0) // For force re-rendering form
  
  console.log(`📝 [ContentSection-${title}] Rendering with ${items.length} items`);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault()
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
    }
  }

  const handleDelete = async (id: string, itemName: string) => {
    console.log(`🗑️ [ContentSection-${title}] Deleting item:`, { id, itemName });
    
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        await onDelete(id)
        console.log(`✅ [ContentSection-${title}] Item deleted successfully:`, id);
      } catch (error) {
        console.error(`❌ [ContentSection-${title}] Delete error:`, error);
        alert(`Error deleting ${title.toLowerCase()}`)
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
            />
          )}
        </div>
      ))}
      <Button type="submit">
        {isEdit ? `Update ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
      </Button>
    </form>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New {title.slice(0, -1)}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderForm()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing {title} ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg">
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
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
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
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No {title.toLowerCase()} found. Create your first {title.toLowerCase().slice(0, -1)} above!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 