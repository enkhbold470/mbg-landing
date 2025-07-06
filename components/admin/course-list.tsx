'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Trash2, Star } from 'lucide-react'
import { CourseForm } from './course-form'
import { deleteCourse } from '@/app/actions/config'

interface CourseListProps {
  courses: any[]
  onEditCourse: (course: any) => void
  editingCourse: any
  onCourseSubmit: (e: React.FormEvent<HTMLFormElement>, isEdit: boolean) => Promise<void>
  onRefresh: () => void
}

export function CourseList({ 
  courses, 
  onEditCourse, 
  editingCourse, 
  onCourseSubmit, 
  onRefresh 
}: CourseListProps) {
  console.log("📋 [CourseList] Rendering list with", courses.length, "courses");

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    console.log("🗑️ [CourseList] Attempting to delete course:", { courseId, courseTitle });
    
    if (confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      try {
        await deleteCourse(courseId);
        console.log("✅ [CourseList] Course deleted successfully:", courseId);
        onRefresh();
      } catch (error) {
        console.error("❌ [CourseList] Error deleting course:", error);
        alert('Error deleting course');
      }
    }
  };

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.id} className="border p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                {course.highlighted && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
              </div>
              <p className="text-gray-600 mb-2">{course.subtitle}</p>
              <p className="text-sm text-gray-500 mb-3">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <span className="text-xs font-medium text-gray-500">Price</span>
                  <p className="text-sm">{course.price}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Duration</span>
                  <p className="text-sm">{course.duration}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Start Date</span>
                  <p className="text-sm">{course.startDate}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Class Size</span>
                  <p className="text-sm">{course.classSize}</p>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500">Schedule</span>
                <p className="text-sm">{course.schedule}</p>
              </div>

              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500">Features</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {course.features?.map((feature: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      console.log("✏️ [CourseList] Opening edit dialog for course:", course.id);
                      onEditCourse(course);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Course: {course.title}</DialogTitle>
                    <DialogDescription>
                      Update the course information below.
                    </DialogDescription>
                  </DialogHeader>
                  <CourseForm course={editingCourse} onSubmit={onCourseSubmit} isEdit={true} />
                </DialogContent>
              </Dialog>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteCourse(course.id, course.title)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {courses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No courses found. Create your first course above!</p>
        </div>
      )}
    </div>
  )
} 