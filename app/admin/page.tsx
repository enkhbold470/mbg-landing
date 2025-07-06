// app/admin/page.tsx
// admin page to configure the site, /config/siteConfig.ts
'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import Image from 'next/image'
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

export default function AdminPage() {
  console.log("🚀 [AdminPage] Component mounted");

  const [activeTab, setActiveTab] = useState('site')
  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [features, setFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const { toast } = useToast()
  useEffect(() => {
    console.log("📊 [AdminPage] Loading initial data...");
    toast({
      title: "Admin Page",
      description: "Анхны мэдээлэл олдож байна...",
    })  
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log("🔄 [AdminPage] Fetching all data...");
      const [siteData, coursesData, testimonialsData, partnersData, faqsData, featuresData] = await Promise.all([
        getSiteConfig(),
        getCourses(),
        getTestimonials(),
        getPartners(),
        getFAQs(),
        getFeatures()
      ])

      console.log("✅ [AdminPage] All data loaded successfully");
      toast({
        title: "Admin Page",
        description: "Бүх мэдээлэл амжилттай олдлоо",
      })  
      setSiteConfig(siteData)
      setCourses(coursesData as any)
      setTestimonials(testimonialsData)
      setPartners(partnersData)
      setFaqs(faqsData)
      setFeatures(featuresData)
    } catch (error) {
      console.error('❌ [AdminPage] Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Site Config Handler
  const handleSiteConfigSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
        title: "Admin Page",
        description: "Сайтын тохируулга амжилттай хадгалагдлаа",
      })  
    } catch (error) {
      console.error("❌ [AdminPage] Error updating site configuration:", error);
      toast({
        title: "Admin Page",
        description: "Сайтын тохируулга хадгалах үед алдаа гарлаа",
      })  
    }
  }

  // Course Handlers
  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault()
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
        setEditingCourse(null)
        console.log("✅ [AdminPage] Course updated successfully");
        toast({
          title: "Admin Page",
          description: "Сургалт амжилттай хадгалагдлаа",
        })  
      } else {
        await createCourse(data)
        // Safely reset the form if currentTarget is available
        if (e.currentTarget) {
          e.currentTarget.reset()
        }
        console.log("✅ [AdminPage] Course created successfully");
        toast({
          title: "Admin Page",
          description: "Сургалт амжилттай үүслээ",
        })  
      }
      loadData()
    } catch (error) {
      console.error("❌ [AdminPage] Error saving course:", error);
      toast({
        title: "Admin Page",
        description: "Сургалт хадгалах үед алдаа гарлаа",
      })  
    }
  }

  // Generic content handlers
  const createContentHandler = (createFn: any, updateFn: any) => {
    return async (data: any, isEdit: boolean, editingItem?: any) => {
      console.log(`💾 [AdminPage] ${isEdit ? 'Updating' : 'Creating'} content item...`);
      
      try {
        if (isEdit && editingItem) {
          await updateFn(editingItem.id, data)
          console.log("✅ [AdminPage] Content updated successfully");
        } else {
          await createFn(data)
          console.log("✅ [AdminPage] Content created successfully");
        }
        await loadData()
        toast({
          title: "Admin Page",
          description: `${isEdit ? 'Шинэчлэгдлээ' : 'Үүслээ'} амжилттай`,
        })  
      } catch (error) {
        console.error("❌ [AdminPage] Error saving content:", error);
        toast({
          title: "Admin Page",
          description: "Мэдээлэл хадгалах үед алдаа гарлаа",
        })  
      }
    }
  }

  // Field configurations for different content types
  const testimonialFields = [
    { name: 'name', label: 'Name', type: 'input' as const, required: true, placeholder: 'Жишээ нь: John Doe' },
    { name: 'role', label: 'Role', type: 'input' as const, required: true, placeholder: 'Жишээ нь: CEO' },
      { name: 'content', label: 'Testimonial Content', type: 'textarea' as const, required: true, placeholder: 'Жишээ нь: Хятадтай худалдаа хийхэд хэлний мэдлэг маш их тустай болж байна' },
    { name: 'rating', label: 'Rating (1-5)', type: 'number' as const, required: true, placeholder: 'Жишээ нь: 5' },
    { name: 'image', label: 'Image URL', type: 'url' as const, placeholder: 'Жишээ нь: https://placekeanu.com/500/500' }
  ]

  const partnerFields = [
    { name: 'name', label: 'Partner Name', type: 'input' as const, required: true, placeholder: 'Жишээ нь: John Doe' },
    { name: 'logo', label: 'Logo URL', type: 'url' as const, required: true, placeholder: 'Жишээ нь: https://placekeanu.com/500/500' },
    { name: 'url', label: 'Website URL', type: 'url' as const, required: true, placeholder: 'Жишээ нь: https://www.google.com' }
  ]

  const faqFields = [
    { name: 'question', label: 'Question', type: 'input' as const, required: true, placeholder: 'Жишээ нь: Хятад хэл ямар түвшинд хичээллэх вэ?' },
    { name: 'answer', label: 'Answer', type: 'textarea' as const, required: true, placeholder: 'Жишээ нь: HSK 6-ын түвшинд' },
    { name: 'order', label: 'Order', type: 'number' as const, placeholder: 'Жишээ нь: 1' }
  ]

  const featureFields = [
    { name: 'title', label: 'Title', type: 'input' as const, required: true, placeholder: 'Жишээ нь: Хятад хэл ямар түвшинд хичээллэх вэ?' },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Жишээ нь: Хятад хэл ямар түвшинд хичээллэх вэ?' },
    { name: 'icon', label: 'Icon (emoji or text)', type: 'input' as const, required: true, placeholder: 'Жишээ нь: 🌐' },
    { name: 'order', label: 'Order', type: 'number' as const, placeholder: 'Жишээ нь: 1' }
  ]

  // Render functions for different content types
  const renderTestimonial = (testimonial: any) => (
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
  )

  const renderPartner = (partner: any) => (
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
  )

  const renderFAQ = (faq: any) => (
    <div>
      <h3 className="font-semibold mb-2">{faq.question}</h3>
      <p className="text-gray-600">{faq.answer}</p>
      <Badge variant="outline" className="mt-2">Order: {faq.order}</Badge>
    </div>
  )

  const renderFeature = (feature: any) => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{feature.icon}</span>
        <h3 className="font-semibold">{feature.title}</h3>
      </div>
      <p className="text-gray-600">{feature.description}</p>
      <Badge variant="outline" className="mt-2">Order: {feature.order}</Badge>
    </div>
  )

  if (loading) {
    console.log("⏳ [AdminPage] Loading state active");
    return <div className="p-8">Админ панель ачааллаж байна...</div>
  }

  console.log("🎨 [AdminPage] Rendering admin dashboard, active tab:", activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Админ панель</h1>
        <p className="text-gray-600">Сайтын бүх мэдээлэл</p>
        <p className="text-gray-600">Тусламж? <Link href="mailto:enkhbold470@gmail.com" className="text-blue-500 hover:underline">enkhbold470@gmail.com</Link></p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        console.log("🔄 [AdminPage] Changing tab to:", value);
        setActiveTab(value);
      }}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="site">Нүүр хуудас</TabsTrigger>
          <TabsTrigger value="courses">Сургалтууд</TabsTrigger>
          <TabsTrigger value="testimonials">Сэтгэгдэлүүд</TabsTrigger>
          <TabsTrigger value="partners">Бидний хамтрагчид</TabsTrigger>
          <TabsTrigger value="faq">Түгээмэл асуултууд</TabsTrigger>
          <TabsTrigger value="features">Онцлог боломжууд</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <SiteConfigForm siteConfig={siteConfig} onSubmit={handleSiteConfigSubmit} />
        </TabsContent>

        <TabsContent value="courses">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Сургалт үүсгэх</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseForm onSubmit={handleCourseSubmit} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Одоо байгаа сургалтууд ({courses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseList 
                  courses={courses}
                  onEditCourse={setEditingCourse}
                  editingCourse={editingCourse}
                  onCourseSubmit={handleCourseSubmit}
                  onRefresh={loadData}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testimonials">
          <ContentSection
            title="Сэтгэгдэлүүд"
            items={testimonials}
            fields={testimonialFields}
            onSubmit={createContentHandler(createTestimonial, updateTestimonial)}
            onDelete={async (id: string) => { await deleteTestimonial(id); await loadData(); }}
            renderItem={renderTestimonial}
          />
        </TabsContent>

        <TabsContent value="partners">
          <ContentSection
            title="Бидний хамтрагчид"
            items={partners}
            fields={partnerFields}
            onSubmit={createContentHandler(createPartner, updatePartner)}
            onDelete={async (id: string) => { await deletePartner(id); await loadData(); }}
            renderItem={renderPartner}
          />
        </TabsContent>

        <TabsContent value="faq">
          <ContentSection
            title="Түгээмэл асуултууд"
            items={faqs}
            fields={faqFields}
            onSubmit={createContentHandler(createFAQ, updateFAQ)}
            onDelete={async (id: string) => { await deleteFAQ(id); await loadData(); }}
            renderItem={renderFAQ}
          />
        </TabsContent>

        <TabsContent value="features">
          <ContentSection
            title="Онцлог боломжууд"
            items={features}
            fields={featureFields}
            onSubmit={createContentHandler(createFeature, updateFeature)}
            onDelete={async (id: string) => { await deleteFeature(id); await loadData(); }}
            renderItem={renderFeature}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}