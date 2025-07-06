// app/admin/page.tsx
// admin page to configure the site, /config/siteConfig.ts
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  getSiteConfig, 
  updateSiteConfig,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('site')
  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [features, setFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [siteData, coursesData, testimonialsData, partnersData, faqsData, featuresData] = await Promise.all([
        getSiteConfig(),
        getCourses(),
        getTestimonials(),
        getPartners(),
        getFAQs(),
        getFeatures()
      ])

      setSiteConfig(siteData || {
        name: 'MBG Education',
        description: 'Хятадын хэлийг эзэмших мэргэжлийн сургалт',
        tagline: 'Тэгээс тэтгэлэгт тэнцэх нь',
        slogan: 'Тэгээс тэтгэлэгт тэнцэх нь',
        url: 'https://mbg-landing.vercel.app',
        ogImage: 'https://raw.githubusercontent.com/enkhbold470/mbg-landing/refs/heads/main/public/og.jpg'
      })
      setCourses(coursesData)
      setTestimonials(testimonialsData)
      setPartners(partnersData)
      setFaqs(faqsData)
      setFeatures(featuresData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSiteConfigSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
      alert('Site configuration updated successfully!')
    } catch (error) {
      alert('Error updating site configuration')
    }
  }

  const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
      await createCourse(data)
      loadData()
      e.currentTarget.reset()
      alert('Course created successfully!')
    } catch (error) {
      alert('Error creating course')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your site content and configuration</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="site">Site Config</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
              <CardDescription>Update basic site information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSiteConfigSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Site Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={siteConfig?.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      name="tagline"
                      defaultValue={siteConfig?.tagline}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={siteConfig?.description}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan</Label>
                  <Input
                    id="slogan"
                    name="slogan"
                    defaultValue={siteConfig?.slogan}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Site URL</Label>
                  <Input
                    id="url"
                    name="url"
                    defaultValue={siteConfig?.url}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    name="ogImage"
                    defaultValue={siteConfig?.ogImage}
                    required
                  />
                </div>
                <Button type="submit">Update Site Configuration</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Course</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input id="subtitle" name="subtitle" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" name="price" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input id="duration" name="duration" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input id="slug" name="slug" required />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="highlighted" name="highlighted" />
                    <Label htmlFor="highlighted">Highlighted</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="features">Features (one per line)</Label>
                    <Textarea id="features" name="features" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video">Video URL</Label>
                      <Input id="video" name="video" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupForm">Signup Form URL</Label>
                    <Input id="signupForm" name="signupForm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullTitle">Full Title</Label>
                    <Input id="fullTitle" name="fullTitle" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" name="startDate" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Schedule</Label>
                      <Input id="schedule" name="schedule" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Input id="frequency" name="frequency" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classSize">Class Size</Label>
                      <Input id="classSize" name="classSize" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Teacher</Label>
                    <Input id="teacher" name="teacher" />
                  </div>
                  <Button type="submit">Add Course</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-gray-600">{course.subtitle}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{course.price}</Badge>
                            <Badge variant="outline">{course.duration}</Badge>
                            {course.highlighted && <Badge>Highlighted</Badge>}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this course?')) {
                              deleteCourse(course.id).then(() => loadData())
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription>Manage customer testimonials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Testimonials management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle>Partners</CardTitle>
              <CardDescription>Manage partner organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Partners management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Manage frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">FAQ management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Manage site features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Features management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}