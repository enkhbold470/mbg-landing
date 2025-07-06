'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Sparkles, Loader2 } from 'lucide-react'

interface CourseFormProps {
  course?: any
  onSubmit: (e: React.FormEvent<HTMLFormElement>, isEdit: boolean) => Promise<void>
  isEdit?: boolean
}

export function CourseForm({ course, onSubmit, isEdit = false }: CourseFormProps) {
  console.log("🎨 [CourseForm] Rendering form:", { isEdit, courseId: course?.id });
  
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false)
  const [courseTitle, setCourseTitle] = useState('')

  const handleAIGenerate = async () => {
    if (!courseTitle.trim()) {
      toast({
        title: "Алдаа",
        description: "Сургалтын нэрийг оруулна уу",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/auto-fill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseTitle: courseTitle.trim() }),
      });

      if (!response.ok) {
        throw new Error('AI generation failed');
      }

      const data = await response.json();
      
      // Auto-fill form fields with AI-generated data
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        // Fill basic fields
        (form.querySelector('#title') as HTMLInputElement).value = courseTitle;
        (form.querySelector('#subtitle') as HTMLInputElement).value = data.subtitle || '';
        (form.querySelector('#description') as HTMLTextAreaElement).value = data.description || '';
        (form.querySelector('#price') as HTMLInputElement).value = data.price || '';
        (form.querySelector('#duration') as HTMLInputElement).value = data.duration || '';
        (form.querySelector('#slug') as HTMLInputElement).value = data.slug || '';
        (form.querySelector('#fullTitle') as HTMLInputElement).value = data.fullTitle || '';
        (form.querySelector('#startDate') as HTMLInputElement).value = data.startDate || '';
        (form.querySelector('#schedule') as HTMLInputElement).value = data.schedule || '';
        (form.querySelector('#frequency') as HTMLInputElement).value = data.frequency || '';
        (form.querySelector('#classSize') as HTMLInputElement).value = data.classSize || '';
        (form.querySelector('#teacher') as HTMLInputElement).value = data.teacher || '';
        
        // Fill features (array joined with newlines)
        if (data.features && Array.isArray(data.features)) {
          (form.querySelector('#features') as HTMLTextAreaElement).value = data.features.join('\n');
        }

        // Set default values for other fields
        (form.querySelector('#image') as HTMLInputElement).value = 'https://placekeanu.com/500/500';
        (form.querySelector('#video') as HTMLInputElement).value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        (form.querySelector('#signupForm') as HTMLInputElement).value = 'https://www.google.com';
      }

      toast({
        title: "Амжилттай",
        description: "AI-аар сургалтын мэдээлэл үүсгэгдлээ!",
      });

    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "Алдаа",
        description: "AI үүсгэх явцад алдаа гарлаа",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Generation Section */}
      {!isEdit && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-800">AI-аар сургалт үүсгэх</h3>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="aiCourseTitle">Сургалтын нэр</Label>
              <Input
                id="aiCourseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Жишээ нь: HSK 4 түвшинд бэлтгэх сургалт"
                disabled={isGenerating}
              />
            </div>
            <Button
              type="button"
              onClick={handleAIGenerate}
              disabled={isGenerating || !courseTitle.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Үүсгэж байна...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI үүсгэх
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-purple-600 mt-2">
            AI-аар сургалтын бүх мэдээлэл автоматаар үүснэ
          </p>
        </div>
      )}

      {/* Course Form */}
      <form onSubmit={(e) => onSubmit(e, isEdit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Гарчиг</Label>
            <Input id="title" name="title" defaultValue={course?.title} placeholder="Жишээ нь: 40 цагт Хятад хэл" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Дэлгэрэнгүй гарчиг</Label>
            <Input id="subtitle" name="subtitle" defaultValue={course?.subtitle} placeholder="Жишээ нь:HSK 6" required />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Дэлгэрэнгүй тайлбар</Label>
          <Textarea id="description" name="description" defaultValue={course?.description} placeholder="Жишээ нь: Хятад хэлний үндсийг эзэмшихэд туслах" required />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Үнэ</Label>
            <Input id="price" name="price" defaultValue={course?.price} placeholder="Жишээ нь: 100,000₮" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Үргэлжлэх хугацаа</Label>
            <Input id="duration" name="duration" defaultValue={course?.duration} placeholder="Жишээ нь: 40 цаг" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) зай авахгүй (slug)</Label>
            <Input id="slug" name="slug" defaultValue={course?.slug} placeholder="Жишээ нь: hsk-4-course" required />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="highlighted" name="highlighted" defaultChecked={course?.highlighted}/>
          <Label htmlFor="highlighted">Highlighted</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="features">Онцлог боломжууд (мөр бүрдээ нэг гарчиг)</Label>
          <Textarea 
            id="features" 
            name="features" 
            defaultValue={course?.features?.join('\n')} 
            placeholder="Онцлог 1&#10;Онцлог 2&#10;Онцлог 3" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" defaultValue={course?.image} placeholder="Жишээ нь: https://placekeanu.com/500/500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video">Video URL</Label>
            <Input id="video" name="video" defaultValue={course?.video} placeholder="Жишээ нь: https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signupForm">Бүртгэлийн Google форм URL</Label>
          <Input id="signupForm" name="signupForm" defaultValue={course?.signupForm} placeholder="Жишээ нь: https://www.form.google.com/forms/d/e/1FAIpQLSf9d18_ob0n3CdQapjGkivOApSrDqU13yqmO65a1N9xkq0kUQ/viewform?usp=header" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullTitle">Дэлгэрэнгүй гарчиг</Label>
          <Input id="fullTitle" name="fullTitle" defaultValue={course?.fullTitle} placeholder="Жишээ нь: HSK 4-ын ТҮРГЭВЧИЛСЭН АНГИ" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Эхлэх огноо</Label>
            <Input id="startDate" name="startDate" defaultValue={course?.startDate} placeholder="Жишээ нь: 2025-01-01" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Ямар цаг</Label>
            <Input id="schedule" name="schedule" defaultValue={course?.schedule} placeholder="Жишээ нь: Даваа – Баасан 10:00 – 12:00" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Давтамж</Label>
            <Input id="frequency" name="frequency" defaultValue={course?.frequency} placeholder="Жишээ нь: Долоо хоногт 5 удаа 2 цагаар хичээллэх болно" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="classSize">Сурагчидын тоо</Label>
            <Input id="classSize" name="classSize" defaultValue={course?.classSize} placeholder="Жишээ нь: 10 сурагч" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="teacher">Багш</Label>
          <Input id="teacher" name="teacher" defaultValue={course?.teacher} placeholder="Жишээ нь: Хятад багш, Монгол багш, Отгоо багш" />
        </div>
        
        <Button type="submit" className="w-full">
          {isEdit ? 'Хадгалах' : 'Сургалт үүсгэх'}
        </Button>
      </form>
    </div>
  )
} 