// app/admin/page.tsx
// admin page to configure the site, /config/siteConfig.ts
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
// Import modular components
import { SiteConfigForm } from '@/components/admin/site-config-form'
import { CourseForm } from '@/components/admin/course-form'
import { CourseList } from '@/components/admin/course-list'
import { ContentSection } from '@/components/admin/content-section'
import Link from 'next/link'
 
// Import actions
import { 
  getSiteConfig,
  updateSiteConfig,
  getCourses,
  createCourse,
  updateCourse,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature
} from '@/app/actions/config'
import { useToast } from '@/hooks/use-toast'

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

// Error boundary component
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <Alert variant="destructive" className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="flex items-center justify-between">
      <span>{error}</span>
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry | 重试
      </Button>
    </AlertDescription>
  </Alert>
)

export default function AdminPage() {
  console.log("🚀 [AdminPage] Component mounted");

  // State management
  const [activeTab, setActiveTab] = useState('courses')
  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [features, setFeatures] = useState<any[]>([])
  
  // Loading states for different tabs
  const [loadingStates, setLoadingStates] = useState({
    site: false,
    courses: true, // Start with courses loading since it's the default tab
    testimonials: false,
    partners: false,
    faq: false,
    features: false
  })
  
  // Error states for different tabs
  const [errorStates, setErrorStates] = useState<Record<string, string | null>>({
    site: null,
    courses: null,
    testimonials: null,
    partners: null,
    faq: null,
    features: null
  })
  
  // Track which tabs have been successfully loaded
  const [loadedTabs, setLoadedTabs] = useState(new Set<string>())
  
  // Form submission states
  const [submittingStates, setSubmittingStates] = useState({
    siteConfig: false,
    course: false,
    testimonial: false,
    partner: false,
    faq: false,
    feature: false
  })
  
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const { toast } = useToast()

  // Enhanced data loading with better error handling
  const loadTabData = useCallback(async (tabName: string, force = false) => {
    // Skip if already loaded and not forcing reload
    if (loadedTabs.has(tabName) && !force) return
    
    setLoadingStates(prev => ({ ...prev, [tabName]: true }))
    setErrorStates(prev => ({ ...prev, [tabName]: null }))
    
    try {
      console.log(`🔄 [AdminPage] Loading data for tab: ${tabName}`)
      
      let data
      switch (tabName) {
        case 'site':
          data = await getSiteConfig()
          setSiteConfig(data)
          break
        case 'courses':
          data = await getCourses()
          setCourses(Array.isArray(data) ? data : [])
          break
        case 'testimonials':
          data = await getTestimonials()
          setTestimonials(Array.isArray(data) ? data : [])
          break
        case 'partners':
          data = await getPartners()
          setPartners(Array.isArray(data) ? data : [])
          break
        case 'faq':
          data = await getFAQs()
          setFaqs(Array.isArray(data) ? data : [])
          break
        case 'features':
          data = await getFeatures()
          setFeatures(Array.isArray(data) ? data : [])
          break
      }
      
      setLoadedTabs(prev => new Set([...prev, tabName]))
      console.log(`✅ [AdminPage] Data loaded for tab: ${tabName}`, data)
      
      // Show success toast only on manual refresh
      if (force) {
        toast({
          title: "Success | 成功",
          description: `${getTabDisplayName(tabName)} refreshed | 已刷新`,
          duration: 2000
        })
      }
      
    } catch (error) {
      console.error(`❌ [AdminPage] Error loading ${tabName} data:`, error)
      const errorMessage = getErrorMessage(error)
      setErrorStates(prev => ({ ...prev, [tabName]: errorMessage }))
      
      toast({
        title: "Error | 错误",
        description: `Failed to load ${getTabDisplayName(tabName)}: ${errorMessage} | 加载失败：${errorMessage}`,
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setLoadingStates(prev => ({ ...prev, [tabName]: false }))
    }
  }, [loadedTabs, toast])

  // Helper functions
  const getTabDisplayName = (tabName: string) => {
    const names: Record<string, string> = {
      site: 'Site Settings | 站点设置',
      courses: 'Courses | 课程',
      testimonials: 'Testimonials | 客户评价',
      partners: 'Partners | 合作伙伴',
      faq: 'FAQ | 常见问题',
      features: 'Features | 功能亮点'
    }
    return names[tabName] || tabName
  }

  const getErrorMessage = (error: any) => {
    if (error?.message) return error.message
    if (typeof error === 'string') return error
    return 'Unknown error | 未知错误'
  }

  // Load initial data for the default tab on component mount
  useEffect(() => {
    console.log("📊 [AdminPage] Loading initial data for courses tab...");
    loadTabData('courses')
  }, [loadTabData]) // Remove loadTabData from dependencies to avoid infinite loop

  // Handle tab changes with lazy loading
  const handleTabChange = useCallback((value: string) => {
    console.log("🔄 [AdminPage] Changing tab to:", value);
    setActiveTab(value);
    loadTabData(value);
  }, [loadTabData])

  // Enhanced form submission handlers with better feedback
  const handleSiteConfigSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (submittingStates.siteConfig) return
    
    setSubmittingStates(prev => ({ ...prev, siteConfig: true }))
    console.log("💾 [AdminPage] Updating site configuration...");
    
    // Show loading toast
    const loadingToast = toast({
      title: "Saving... | 保存中...",
      description: "Saving site settings | 正在保存站点设置",
      duration: 0, // Don't auto-dismiss
    })
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      tagline: formData.get('tagline') as string,
      slogan: formData.get('slogan') as string,
      url: formData.get('url') as string,
      ogImage: formData.get('ogImage') as string,
    }
    
    try {
      await updateSiteConfig(data)
      setSiteConfig(data)
      console.log("✅ [AdminPage] Site configuration updated successfully");
      
      // Dismiss loading toast and show success
      loadingToast.dismiss?.()
      toast({
        title: "Saved successfully | 保存成功",
        description: "Site settings have been saved | 站点设置已保存",
        duration: 3000
      })  
    } catch (error) {
      console.error("❌ [AdminPage] Error updating site configuration:", error);
      loadingToast.dismiss?.()
      toast({
        title: "Error | 错误",
        description: `Error saving site settings: ${getErrorMessage(error)} | 保存站点设置出错：${getErrorMessage(error)}`,
        variant: "destructive",
        duration: 5000
      })  
    } finally {
      setSubmittingStates(prev => ({ ...prev, siteConfig: false }))
    }
  }

  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault()
    
    if (submittingStates.course) return
    
    setSubmittingStates(prev => ({ ...prev, course: true }))
    console.log(`💾 [AdminPage] ${isEdit ? 'Updating' : 'Creating'} course...`);
    
    // Show loading toast
    const loadingToast = toast({
      title: isEdit ? "Updating... | 更新中..." : "Creating... | 创建中...",
      description: isEdit ? "Updating course | 正在更新课程" : "Creating course | 正在创建课程",
      duration: 0,
    })
    
    const formData = new FormData(e.currentTarget)
    const features = (formData.get('features') as string).split('\n').filter(f => f.trim())
    
    const data = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      duration: formData.get('duration') as string,
      highlighted: formData.get('highlighted') === 'on',
      slug: formData.get('slug') as string,
      image: formData.get('image') as string,
      video: formData.get('video') as string,
      signupForm: formData.get('signupForm') as string,
      fullTitle: formData.get('fullTitle') as string,
      startDate: formData.get('startDate') as string,
      schedule: formData.get('schedule') as string,
      frequency: formData.get('frequency') as string,
      classSize: formData.get('classSize') as string,
      teacher: formData.get('teacher') as string,
      features
    }
    
    try {
      if (isEdit && editingCourse) {
        const updatedCourse = await updateCourse(editingCourse.id, data)
        setCourses(prev => prev.map(course => 
          course.id === editingCourse.id ? updatedCourse : course
        ))
        setEditingCourse(null)
        console.log("✅ [AdminPage] Course updated successfully");
        
        loadingToast.dismiss?.()
        toast({
          title: "Updated successfully | 更新成功",
          description: "Course updated successfully | 课程已成功更新",
          duration: 3000
        })  
      } else {
        const newCourse = await createCourse(data)
        setCourses(prev => [newCourse, ...prev])
        
        // Reset form
        if (e.currentTarget) {
          e.currentTarget.reset()
        }
        console.log("✅ [AdminPage] Course created successfully");
        
        loadingToast.dismiss?.()
        toast({
          title: "Created successfully | 创建成功",
          description: "New course created successfully | 新课程已成功创建",
          duration: 3000
        })  
      }
    } catch (error) {
      console.error("❌ [AdminPage] Error saving course:", error);
      loadingToast.dismiss?.()
      toast({
        title: "Error | 错误",
        description: `Error saving course: ${getErrorMessage(error)} | 保存课程出错：${getErrorMessage(error)}`,
        variant: "destructive",
        duration: 5000
      })  
    } finally {
      setSubmittingStates(prev => ({ ...prev, course: false }))
    }
  }

  // Enhanced generic content handlers with better error handling
  const createContentHandler = (createFn: any, updateFn: any, contentType: string, setData: any) => {
    return async (data: any, isEdit: boolean, editingItem?: any) => {
      const stateKey = contentType as keyof typeof submittingStates
      
      if (submittingStates[stateKey]) return
      
      setSubmittingStates(prev => ({ ...prev, [stateKey]: true }))
      console.log(`💾 [AdminPage] ${isEdit ? 'Updating' : 'Creating'} ${contentType}...`);
      
      // Show loading toast
      const loadingToast = toast({
        title: isEdit ? "Updating... | 更新中..." : "Creating... | 创建中...",
        description: `${getTabDisplayName(contentType)} ${isEdit ? 'updating | 正在更新' : 'creating | 正在创建'}`,
        duration: 0,
      })
      
      try {
        if (isEdit && editingItem) {
          const updated = await updateFn(editingItem.id, data)
          setData((prev: any[]) => prev.map(item => 
            item.id === editingItem.id ? updated : item
          ))
          console.log(`✅ [AdminPage] ${contentType} updated successfully`);
        } else {
          const created = await createFn(data)
          setData((prev: any[]) => [created, ...prev])
          console.log(`✅ [AdminPage] ${contentType} created successfully`);
        }
        
        loadingToast.dismiss?.()
        toast({
          title: "Success | 成功",
          description: `${isEdit ? 'Updated | 已更新' : 'Created | 已创建'}`,
          duration: 3000
        })  
      } catch (error) {
        console.error(`❌ [AdminPage] Error saving ${contentType}:`, error);
        loadingToast.dismiss?.()
        toast({
          title: "Error | 错误",
        description: `An error occurred while saving: ${getErrorMessage(error)} | 保存时发生错误：${getErrorMessage(error)}`,
          variant: "destructive",
          duration: 5000
        })  
      } finally {
        setSubmittingStates(prev => ({ ...prev, [stateKey]: false }))
      }
    }
  }

  // Enhanced refresh function
  const refreshCurrentTab = useCallback(async () => {
    console.log(`🔄 [AdminPage] Manually refreshing tab: ${activeTab}`);
    await loadTabData(activeTab, true) // Force reload
  }, [activeTab, loadTabData])

  // Retry function for error recovery
  const retryTabLoad = useCallback((tabName: string) => {
    console.log(`🔄 [AdminPage] Retrying to load tab: ${tabName}`);
    loadTabData(tabName, true)
  }, [loadTabData])

  // Field configurations (moved outside to avoid recreating on each render)
  const testimonialFields = useMemo(() => [
    { name: 'name', label: 'Name', type: 'input' as const, required: true, placeholder: 'Example: John Doe | 例如：John Doe' },
    { name: 'role', label: 'Role', type: 'input' as const, required: true, placeholder: 'Example: CEO | 例如：CEO' },
    { name: 'content', label: 'Testimonial Content', type: 'textarea' as const, required: true, placeholder: 'Example: This course helped me a lot | 例如：这门课程对我帮助很大' },
    { name: 'rating', label: 'Rating (1-5)', type: 'number' as const, required: true, placeholder: 'Example: 5 | 例如：5' },
    { name: 'image', label: 'Image URL', type: 'url' as const, placeholder: 'Example: https://placekeanu.com/500/500 | 例如：https://placekeanu.com/500/500' }
  ], [])

  const partnerFields = useMemo(() => [
    { name: 'name', label: 'Partner Name', type: 'input' as const, required: true, placeholder: 'Example: ACME Corp | 例如：ACME 公司' },
    { name: 'logo', label: 'Logo URL', type: 'url' as const, required: true, placeholder: 'Example: https://placekeanu.com/500/500 | 例如：https://placekeanu.com/500/500' },
    { name: 'url', label: 'Website URL', type: 'url' as const, required: true, placeholder: 'Example: https://www.google.com | 例如：https://www.google.com' }
  ], [])

  const faqFields = useMemo(() => [
    { name: 'question', label: 'Question', type: 'input' as const, required: true, placeholder: 'Example: What levels are available? | 例如：提供哪些等级？' },
    { name: 'answer', label: 'Answer', type: 'textarea' as const, required: true, placeholder: 'Example: Up to HSK 6 | 例如：最高到 HSK 6' },
    { name: 'order', label: 'Order', type: 'number' as const, placeholder: 'Example: 1 | 例如：1' }
  ], [])

  const featureFields = useMemo(() => [
    { name: 'title', label: 'Title', type: 'input' as const, required: true, placeholder: 'Example: What levels are available? | 例如：提供哪些等级？' },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Example: Course details | 例如：课程详情' },
    { name: 'icon', label: 'Icon (emoji or text)', type: 'input' as const, required: true, placeholder: 'Example: 🌐 | 例如：🌐' },
    { name: 'order', label: 'Order', type: 'number' as const, placeholder: 'Example: 1 | 例如：1' }
  ], [])

  // Render functions for different content types (memoized)
  const renderTestimonial = useCallback((testimonial: any) => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-semibold">{testimonial.name}</h3>
        <Badge variant="secondary">{testimonial.role}</Badge>
        <div className="flex">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
          ))}
        </div>
      </div>
      <p className="text-gray-600">{testimonial.content}</p>
    </div>
  ), [])

  const renderPartner = useCallback((partner: any) => (
    <div className="flex flex-col items-center text-center">
      <Image 
        src={partner.logo} 
        alt={partner.name} 
        className="w-24 h-24 object-contain mb-2"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://placekeanu.com/64/64'
        }}
        width={100}
        height={100}
      />
      <h3 className="font-semibold mb-2">{partner.name}</h3>
      <a 
        href={partner.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline text-sm"
      >
        Visit Website | 访问网站
      </a>
    </div>
  ), [])

  const renderFAQ = useCallback((faq: any) => (
    <div>
      <h3 className="font-semibold mb-2">{faq.question}</h3>
      <p className="text-gray-600">{faq.answer}</p>
      <Badge variant="outline" className="mt-2">Order | 顺序: {faq.order}</Badge>
    </div>
  ), [])

  const renderFeature = useCallback((feature: any) => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{feature.icon}</span>
        <h3 className="font-semibold">{feature.title}</h3>
      </div>
      <p className="text-gray-600">{feature.description}</p>
      <Badge variant="outline" className="mt-2">Order | 顺序: {feature.order}</Badge>
    </div>
  ), [])

  console.log("🎨 [AdminPage] Rendering admin dashboard, active tab:", activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel | 管理面板
              </h1> 
              <p className="text-slate-600 mt-2">All site data | 站点所有数据</p>
              <p className="text-slate-500 text-sm mt-1">
                Need help? | 需要帮助？ <Link href="mailto:enkhbold470@gmail.com" className="text-blue-500 hover:underline font-medium">
                  enkhbold470@gmail.com
                </Link>
              </p>
            </div>
            <Button
              onClick={refreshCurrentTab}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loadingStates[activeTab as keyof typeof loadingStates]}
            >
              <RefreshCw className={`h-4 w-4 ${loadingStates[activeTab as keyof typeof loadingStates] ? 'animate-spin' : ''}`} />
              Refresh | 刷新
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
                <TabsTrigger value="courses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Courses | 课程
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Testimonials | 客户评价
                </TabsTrigger>
                <TabsTrigger value="partners" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Partners | 合作伙伴
                </TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  FAQ | 常见问题
                </TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Features | 功能亮点
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="courses" className="mt-0">
                {errorStates.courses && (
                  <ErrorDisplay 
                    error={errorStates.courses} 
                    onRetry={() => retryTabLoad('courses')} 
                  />
                )}
                {loadingStates.courses ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="space-y-8">
                    <Card className="border-slate-200 shadow-sm">
                  
                      <CardContent className="p-6">
                        <CourseForm 
                          onSubmit={handleCourseSubmit} 
                          isSubmitting={submittingStates.course}
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="bg-slate-50">
                        <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                          Existing Courses | 现有课程 
                          <Badge variant="secondary" className="ml-2">{courses.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <CourseList 
                          courses={courses}
                          onEditCourse={setEditingCourse}
                          editingCourse={editingCourse}
                          onCourseSubmit={handleCourseSubmit}
                          onRefresh={refreshCurrentTab}
                          isSubmitting={submittingStates.course}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="testimonials" className="mt-0">
                {errorStates.testimonials && (
                  <ErrorDisplay 
                    error={errorStates.testimonials} 
                    onRetry={() => retryTabLoad('testimonials')} 
                  />
                )}
                {loadingStates.testimonials ? (
                  <LoadingSkeleton />
                ) : (
                  <ContentSection
                    title="Testimonials | 客户评价"
                    items={testimonials}
                    fields={testimonialFields}
                    onSubmit={createContentHandler(createTestimonial, updateTestimonial, 'testimonial', setTestimonials)}
                    onDelete={async (id: string) => { 
                      await deleteTestimonial(id); 
                      setTestimonials(prev => prev.filter(item => item.id !== id))
                    }}
                    renderItem={renderTestimonial}
                    isSubmitting={submittingStates.testimonial}
                  />
                )}
              </TabsContent>

              <TabsContent value="partners" className="mt-0">
                {errorStates.partners && (
                  <ErrorDisplay 
                    error={errorStates.partners} 
                    onRetry={() => retryTabLoad('partners')} 
                  />
                )}
                {loadingStates.partners ? (
                  <LoadingSkeleton />
                ) : (
                  <ContentSection
                    title="Partners | 合作伙伴"
                    items={partners}
                    fields={partnerFields}
                    onSubmit={createContentHandler(createPartner, updatePartner, 'partner', setPartners)}
                    onDelete={async (id: string) => { 
                      await deletePartner(id); 
                      setPartners(prev => prev.filter(item => item.id !== id))
                    }}
                    renderItem={renderPartner}
                    isSubmitting={submittingStates.partner}
                  />
                )}
              </TabsContent>

              <TabsContent value="faq" className="mt-0">
                {errorStates.faq && (
                  <ErrorDisplay 
                    error={errorStates.faq} 
                    onRetry={() => retryTabLoad('faq')} 
                  />
                )}
                {loadingStates.faq ? (
                  <LoadingSkeleton />
                ) : (
                  <ContentSection
                    title="FAQ | 常见问题"
                    items={faqs}
                    fields={faqFields}
                    onSubmit={createContentHandler(createFAQ, updateFAQ, 'faq', setFaqs)}
                    onDelete={async (id: string) => { 
                      await deleteFAQ(id); 
                      setFaqs(prev => prev.filter(item => item.id !== id))
                    }}
                    renderItem={renderFAQ}
                    isSubmitting={submittingStates.faq}
                  />
                )}
              </TabsContent>

              <TabsContent value="features" className="mt-0">
                {errorStates.features && (
                  <ErrorDisplay 
                    error={errorStates.features} 
                    onRetry={() => retryTabLoad('features')} 
                  />
                )}
                {loadingStates.features ? (
                  <LoadingSkeleton />
                ) : (
                  <ContentSection
                    title="Features | 功能亮点"
                    items={features}
                    fields={featureFields}
                    onSubmit={createContentHandler(createFeature, updateFeature, 'feature', setFeatures)}
                    onDelete={async (id: string) => { 
                      await deleteFeature(id); 
                      setFeatures(prev => prev.filter(item => item.id !== id))
                    }}
                    renderItem={renderFeature}
                    isSubmitting={submittingStates.feature}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}