// app/admin/page.tsx
// admin page to configure the site, /config/siteConfig.ts
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Loader2, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
    courses: false,
    testimonials: false,
    partners: false,
    faq: false,
    features: false
  })
  
  // Track which tabs have been loaded
  const [loadedTabs, setLoadedTabs] = useState(new Set(['courses']))
  
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

  // Optimized data loading functions
  const loadTabData = useCallback(async (tabName: string) => {
    if (loadedTabs.has(tabName)) return
    
    setLoadingStates(prev => ({ ...prev, [tabName]: true }))
    
    try {
      console.log(`🔄 [AdminPage] Loading data for tab: ${tabName}`)
      
      switch (tabName) {
        case 'site':
          const siteData = await getSiteConfig()
          setSiteConfig(siteData)
          break
        case 'courses':
          const coursesData = await getCourses()
          setCourses(coursesData as any)
          break
        case 'testimonials':
          const testimonialsData = await getTestimonials()
          setTestimonials(testimonialsData)
          break
        case 'partners':
          const partnersData = await getPartners()
          setPartners(partnersData)
          break
        case 'faq':
          const faqsData = await getFAQs()
          setFaqs(faqsData)
          break
        case 'features':
          const featuresData = await getFeatures()
          setFeatures(featuresData)
          break
      }
      
      setLoadedTabs(prev => new Set([...prev, tabName]))
      console.log(`✅ [AdminPage] Data loaded for tab: ${tabName}`)
      
    } catch (error) {
      console.error(`❌ [AdminPage] Error loading ${tabName} data:`, error)
      toast({
        title: "Алдаа",
        description: `${tabName} мэдээлэл ачаалахад алдаа гарлаа`,
        variant: "destructive"
      })
    } finally {
      setLoadingStates(prev => ({ ...prev, [tabName]: false }))
    }
  }, [loadedTabs, toast])

  // Load initial data for the default tab
  useEffect(() => {
    console.log("📊 [AdminPage] Loading initial data for courses tab...");
    loadTabData('courses')
  }, [loadTabData])

  // Handle tab changes with lazy loading
  const handleTabChange = useCallback((value: string) => {
    console.log("🔄 [AdminPage] Changing tab to:", value);
    setActiveTab(value);
    loadTabData(value);
  }, [loadTabData])

  // Optimized form submission handlers with loading states
  const handleSiteConfigSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (submittingStates.siteConfig) return // Prevent double submission
    
    setSubmittingStates(prev => ({ ...prev, siteConfig: true }))
    console.log("💾 [AdminPage] Updating site configuration...");
    
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
      toast({
        title: "Амжилттай",
        description: "Сайтын тохируулга амжилттай хадгалагдлаа",
      })  
    } catch (error) {
      console.error("❌ [AdminPage] Error updating site configuration:", error);
      toast({
        title: "Алдаа",
        description: "Сайтын тохируулга хадгалах үед алдаа гарлаа",
        variant: "destructive"
      })  
    } finally {
      setSubmittingStates(prev => ({ ...prev, siteConfig: false }))
    }
  }

  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault()
    
    if (submittingStates.course) return // Prevent double submission
    
    setSubmittingStates(prev => ({ ...prev, course: true }))
    console.log(`💾 [AdminPage] ${isEdit ? 'Updating' : 'Creating'} course...`);
    
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
        await updateCourse(editingCourse.id, data)
        // Optimistic update
        setCourses(prev => prev.map(course => 
          course.id === editingCourse.id ? { ...course, ...data } : course
        ))
        setEditingCourse(null)
        console.log("✅ [AdminPage] Course updated successfully");
        toast({
          title: "Амжилттай",
          description: "Сургалт амжилттай шинэчлэгдлээ",
        })  
      } else {
        const newCourse = await createCourse(data)
        // Optimistic update
        setCourses(prev => [newCourse, ...prev])
        // Reset form
        if (e.currentTarget) {
          e.currentTarget.reset()
        }
        console.log("✅ [AdminPage] Course created successfully");
        toast({
          title: "Амжилттай",
          description: "Сургалт амжилттай үүслээ",
        })  
      }
    } catch (error) {
      console.error("❌ [AdminPage] Error saving course:", error);
      toast({
        title: "Алдаа",
        description: "Сургалт хадгалах үед алдаа гарлаа",
        variant: "destructive"
      })  
    } finally {
      setSubmittingStates(prev => ({ ...prev, course: false }))
    }
  }

  // Generic content handlers with loading states
  const createContentHandler = (createFn: any, updateFn: any, contentType: string, setData: any) => {
    return async (data: any, isEdit: boolean, editingItem?: any) => {
      const stateKey = contentType as keyof typeof submittingStates
      
      if (submittingStates[stateKey]) return // Prevent double submission
      
      setSubmittingStates(prev => ({ ...prev, [stateKey]: true }))
      console.log(`💾 [AdminPage] ${isEdit ? 'Updating' : 'Creating'} ${contentType}...`);
      
      try {
        if (isEdit && editingItem) {
          const updated = await updateFn(editingItem.id, data)
          // Optimistic update
          setData((prev: any[]) => prev.map(item => 
            item.id === editingItem.id ? { ...item, ...data } : item
          ))
          console.log(`✅ [AdminPage] ${contentType} updated successfully`);
        } else {
          const created = await createFn(data)
          // Optimistic update
          setData((prev: any[]) => [created, ...prev])
          console.log(`✅ [AdminPage] ${contentType} created successfully`);
        }
        
        toast({
          title: "Амжилттай",
          description: `${isEdit ? 'Шинэчлэгдлээ' : 'Үүслээ'} амжилттай`,
        })  
      } catch (error) {
        console.error(`❌ [AdminPage] Error saving ${contentType}:`, error);
        toast({
          title: "Алдаа",
          description: "Мэдээлэл хадгалах үед алдаа гарлаа",
          variant: "destructive"
        })  
      } finally {
        setSubmittingStates(prev => ({ ...prev, [stateKey]: false }))
      }
    }
  }

  // Refresh function for manual data reloading
  const refreshCurrentTab = useCallback(async () => {
    setLoadedTabs(prev => {
      const newSet = new Set(prev)
      newSet.delete(activeTab)
      return newSet
    })
    await loadTabData(activeTab)
  }, [activeTab, loadTabData])

  // Field configurations (moved outside to avoid recreating on each render)
  const testimonialFields = useMemo(() => [
    { name: 'name', label: 'Name', type: 'input' as const, required: true, placeholder: 'Жишээ нь: John Doe' },
    { name: 'role', label: 'Role', type: 'input' as const, required: true, placeholder: 'Жишээ нь: CEO' },
    { name: 'content', label: 'Testimonial Content', type: 'textarea' as const, required: true, placeholder: 'Жишээ нь: Хятадтай худалдаа хийхэд хэлний мэдлэг маш их тустай болж байна' },
    { name: 'rating', label: 'Rating (1-5)', type: 'number' as const, required: true, placeholder: 'Жишээ нь: 5' },
    { name: 'image', label: 'Image URL', type: 'url' as const, placeholder: 'Жишээ нь: https://placekeanu.com/500/500' }
  ], [])

  const partnerFields = useMemo(() => [
    { name: 'name', label: 'Partner Name', type: 'input' as const, required: true, placeholder: 'Жишээ нь: John Doe' },
    { name: 'logo', label: 'Logo URL', type: 'url' as const, required: true, placeholder: 'Жишээ нь: https://placekeanu.com/500/500' },
    { name: 'url', label: 'Website URL', type: 'url' as const, required: true, placeholder: 'Жишээ нь: https://www.google.com' }
  ], [])

  const faqFields = useMemo(() => [
    { name: 'question', label: 'Question', type: 'input' as const, required: true, placeholder: 'Жишээ нь: Хятад хэл ямар түвшинд хичээллэх вэ?' },
    { name: 'answer', label: 'Answer', type: 'textarea' as const, required: true, placeholder: 'Жишээ нь: HSK 6-ын түвшинд' },
    { name: 'order', label: 'Order', type: 'number' as const, placeholder: 'Жишээ нь: 1' }
  ], [])

  const featureFields = useMemo(() => [
    { name: 'title', label: 'Title', type: 'input' as const, required: true, placeholder: 'Жишээ нь: Хятад хэл ямар түвшинд хичээллэх вэ?' },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Жишээ нь: Хятад хэл ямар түвшинд хичээллэх вэ?' },
    { name: 'icon', label: 'Icon (emoji or text)', type: 'input' as const, required: true, placeholder: 'Жишээ нь: 🌐' },
    { name: 'order', label: 'Order', type: 'number' as const, placeholder: 'Жишээ нь: 1' }
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
        Visit Website
      </a>
    </div>
  ), [])

  const renderFAQ = useCallback((faq: any) => (
    <div>
      <h3 className="font-semibold mb-2">{faq.question}</h3>
      <p className="text-gray-600">{faq.answer}</p>
      <Badge variant="outline" className="mt-2">Order: {faq.order}</Badge>
    </div>
  ), [])

  const renderFeature = useCallback((feature: any) => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{feature.icon}</span>
        <h3 className="font-semibold">{feature.title}</h3>
      </div>
      <p className="text-gray-600">{feature.description}</p>
      <Badge variant="outline" className="mt-2">Order: {feature.order}</Badge>
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
                Админ панель
              </h1>
              <p className="text-slate-600 mt-2">Сайтын бүх мэдээлэл</p>
              <p className="text-slate-500 text-sm mt-1">
                Тусламж? <Link href="mailto:enkhbold470@gmail.com" className="text-blue-500 hover:underline font-medium">
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
              Шинэчлэх
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
                <TabsTrigger value="courses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Сургалтууд
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Сэтгэгдэлүүд
                </TabsTrigger>
                <TabsTrigger value="partners" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Хамтрагчид
                </TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Асуултууд
                </TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Онцлогууд
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="courses" className="mt-0">
                {loadingStates.courses ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="space-y-8">
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <CardTitle className="text-xl text-slate-800">Сургалт үүсгэх</CardTitle>
                      </CardHeader>
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
                          Одоо байгаа сургалтууд 
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
                {loadingStates.testimonials ? (
                  <LoadingSkeleton />
                ) : (
                  <ContentSection
                    title="Сэтгэгдэлүүд"
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
                {loadingStates.partners ? (
                  <LoadingSkeleton />
                ) : (
                  <ContentSection
                    title="Бидний хамтрагчид"
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
                {loadingStates.faq ? (
                  <LoadingSkeleton />
                ) : (
                  <ContentSection
                    title="Түгээмэл асуултууд"
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
                {loadingStates.features ? (
                  <LoadingSkeleton />
                ) : (
                  <ContentSection
                    title="Онцлог боломжууд"
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