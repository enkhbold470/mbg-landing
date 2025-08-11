'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { CourseForm } from './course-form'
import { useToast } from '@/hooks/use-toast'
import { deleteCourse } from '@/app/actions/config'

interface CourseListProps {
  courses: any[]
  onEditCourse: (course: any) => void
  editingCourse: any
  onCourseSubmit: (e: React.FormEvent<HTMLFormElement>, isEdit: boolean) => Promise<void>
  onRefresh: () => Promise<void>
  isSubmitting?: boolean
}

export function CourseList({ 
  courses, 
  onEditCourse, 
  editingCourse, 
  onCourseSubmit, 
  onRefresh,
  isSubmitting = false
}: CourseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the course "${title}"? | 确认删除课程 “${title}” 吗？`)) {
      setDeletingId(id)
      try {
        await deleteCourse(id)
        await onRefresh()
        toast({
          title: "Success | 成功",
          description: "Course deleted successfully | 课程已成功删除",
        })
      } catch (error) {
        console.error('Error deleting course:', error)
        toast({
          title: "Error | 错误",
          description: "An error occurred while deleting the course | 删除课程时发生错误",
          variant: "destructive"
        })
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.id} className="border border-slate-200 p-6 rounded-lg bg-white hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-slate-800">{course.title}</h3>
                {course.highlighted && <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured | 精选</Badge>}
              </div>
              <p className="text-slate-600 mb-2">{course.subtitle}</p>
              <p className="text-sm text-slate-500 mb-3">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Price: | 价格：</span>
                  <p className="text-slate-600">{course.price}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Duration: | 时长：</span>
                  <p className="text-slate-600">{course.duration}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Teacher: | 教师：</span>
                  <p className="text-slate-600">{course.teacher}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Students: | 学生：</span>
                  <p className="text-slate-600">{course.classSize}</p>
                </div>
              </div>

              {course.features && course.features.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-slate-700 text-sm">Features: | 特色：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {course.features.slice(0, 3).map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {course.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.features.length - 3} more | 更多
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 ml-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditCourse(course)}
                    disabled={isSubmitting}
                    className="hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Course | 编辑课程</DialogTitle>
                  </DialogHeader>
                  <CourseForm 
                    course={editingCourse} 
                    onSubmit={onCourseSubmit} 
                    isEdit={true} 
                    isSubmitting={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(course.id, course.title)}
                disabled={deletingId === course.id || isSubmitting}
                className="hover:bg-red-600"
              >
                {deletingId === course.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {courses.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <div className="bg-slate-50 rounded-lg p-8">
            <p className="text-lg font-medium mb-2">No courses found | 未找到课程</p>
            <p>Start by creating the first course! | 先创建第一个课程吧！</p>
          </div>
        </div>
      )}
    </div>
  )
} 