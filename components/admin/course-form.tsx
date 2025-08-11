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
  isSubmitting?: boolean
}

export function CourseForm({ course, onSubmit, isEdit = false, isSubmitting = false }: CourseFormProps) {
  console.log("🎨 [CourseForm] Rendering form:", { isEdit, courseId: course?.id, isSubmitting });
  
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false)
  const [courseTitle, setCourseTitle] = useState('')

  const handleAIGenerate = async () => {
    if (!courseTitle.trim()) {
      toast({
        title: "Error | 错误",
        description: "Please enter the course name | 请输入课程名称",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    let response;
    
    try {
      response = await fetch('/api/auto-fill', {
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
        (form.querySelector('#image') as HTMLInputElement).value = `https://placekeanu.com/${Math.floor(Math.random() * 1000)}/${Math.floor(Math.random() * 1000)}`;
        (form.querySelector('#video') as HTMLInputElement).value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        (form.querySelector('#signupForm') as HTMLInputElement).value = 'https://www.google.com';
      }

      toast({
        title: "Success | 成功",
        description: "AI generated course details! | AI 已生成课程信息！",
      });

    } catch (error) {
      console.error('AI generation error:', error);
      
      // Try to get more specific error info from the response
      let errorMessage = "An error occurred during AI generation | AI 生成时发生错误";
      if (response && !response.ok) {
        try {
          const errorResponse = await response.json();
          if (errorResponse.details) {
            errorMessage = `AI error: ${errorResponse.details} | AI 错误：${errorResponse.details}`;
          }
        } catch (parseError) {
          // Fallback to generic message if we can't parse the error
        }
      }
      
      toast({
        title: "Error | 错误",
        description: errorMessage,
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
            <h3 className="text-lg font-semibold text-purple-800">Generate Course with AI | 使用 AI 生成课程</h3>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="aiCourseTitle">Course Title | 课程标题</Label>
              <Input
                id="aiCourseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g., HSK 4 Intensive Course | 例如：HSK 4 强化课程"
                disabled={isGenerating || isSubmitting}
              />
            </div>
            <Button
              type="button"
              onClick={handleAIGenerate}
              disabled={isGenerating || !courseTitle.trim() || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating... | 正在生成...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI | 使用 AI 生成
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-purple-600 mt-2">
            AI will automatically generate all course information | AI 将自动生成所有课程信息
          </p>
        </div>
      )}

      {/* Course Form */}
      <form onSubmit={(e) => onSubmit(e, isEdit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title | 标题</Label>
            <Input 
              id="title" 
              name="title" 
              defaultValue={course?.title} 
              placeholder="e.g., Chinese in 40 Hours | 例如：40 小时学中文" 
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle | 副标题</Label>
            <Input 
              id="subtitle" 
              name="subtitle" 
              defaultValue={course?.subtitle} 
              placeholder="e.g., HSK 6 | 例如：HSK 6" 
              required 
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Detailed Description | 详细描述</Label>
          <Textarea 
            id="description" 
            name="description" 
            defaultValue={course?.description} 
            placeholder="e.g., Learn the fundamentals of Chinese | 例如：学习中文基础" 
            required 
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price | 价格</Label>
            <Input 
              id="price" 
              name="price" 
              defaultValue={course?.price} 
              placeholder="e.g., 100,000₮ | 例如：100,000₮" 
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration | 时长</Label>
            <Input 
              id="duration" 
              name="duration" 
              defaultValue={course?.duration} 
              placeholder="e.g., 40 hours | 例如：40 小时" 
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (no spaces) | URL 标识（不含空格）</Label>
            <Input 
              id="slug" 
              name="slug" 
              defaultValue={course?.slug} 
              placeholder="e.g., hsk-4-course | 例如：hsk-4-course" 
              required 
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="highlighted" 
            name="highlighted" 
            defaultChecked={course?.highlighted}
            disabled={isSubmitting}
          />
          <Label htmlFor="highlighted">Featured Course (like Instagram Pin) | 特色课程（类似 Instagram 置顶）</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="features">Key Features (one per line) | 特色亮点（每行一个）</Label>
          <Textarea 
            id="features" 
            name="features" 
            defaultValue={course?.features?.join('\n')} 
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3 | 特点 1&#10;特点 2&#10;特点 3" 
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image URL (Google or pexels.com) | 图片链接（Google 或 pexels.com）</Label>
            <Input 
              id="image" 
              name="image" 
              defaultValue={course?.image} 
              placeholder="e.g., https://placekeanu.com/500/500" 
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video">YouTube Video URL | YouTube 视频链接</Label>
            <Input 
              id="video" 
              name="video" 
              defaultValue={course?.video} 
              placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signupForm">Signup Google Form URL | 报名 Google 表单链接</Label>
          <Input 
            id="signupForm" 
            name="signupForm" 
            defaultValue={course?.signupForm} 
            placeholder="e.g., https://www.form.google.com/..." 
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullTitle">Full Title | 完整标题</Label>
          <Input 
            id="fullTitle" 
            name="fullTitle" 
            defaultValue={course?.fullTitle} 
            placeholder="e.g., HSK 4 Intensive Class | 例如：HSK 4 强化班" 
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date | 开始日期</Label>
            <Input 
              id="startDate" 
              name="startDate" 
              defaultValue={course?.startDate} 
              placeholder="e.g., 2025-01-01" 
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule | 上课时间</Label>
            <Input 
              id="schedule" 
              name="schedule" 
              defaultValue={course?.schedule} 
              placeholder="e.g., Mon–Fri 10:00–12:00 | 例如：周一至周五 10:00–12:00" 
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency | 频率</Label>
            <Input 
              id="frequency" 
              name="frequency" 
              defaultValue={course?.frequency} 
              placeholder="e.g., 5 times/week, 2 hours each | 例如：每周 5 次，每次 2 小时" 
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="classSize">Class Size | 班级人数</Label>
            <Input 
              id="classSize" 
              name="classSize" 
              defaultValue={course?.classSize} 
              placeholder="e.g., 10 students | 例如：10 名学生" 
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="teacher">Teacher | 教师</Label>
          <Input 
            id="teacher" 
            name="teacher" 
            defaultValue={course?.teacher} 
            placeholder="e.g., Native Chinese Teacher | 例如：中文母语教师" 
            disabled={isSubmitting}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting || isGenerating}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEdit ? 'Saving... | 保存中...' : 'Creating... | 创建中...'}
            </>
          ) : (
            isEdit ? 'Save | 保存' : 'Create Course | 创建课程'
          )}
        </Button>
      </form>
    </div>
  )
} 