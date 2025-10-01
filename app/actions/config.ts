// app/actions/config.ts
"use server"


import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import { logCreate, logUpdate, logDelete } from '@/lib/audit'

// Custom error class for better error handling
class AdminActionError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'AdminActionError'
  }
}

// Error handler wrapper
async function withErrorHandling<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    // Handle Next.js redirect - this is expected behavior, not an error
    if (error && typeof error === 'object' && 'message' in error && 
        (error as any).message?.includes('NEXT_REDIRECT')) {
      throw error // Re-throw redirect errors as they are expected
    }
    
    console.error(`❌ [${operationName}] Error:`, error)
    
    // Handle different types of errors
    if (error instanceof AdminActionError) {
      throw error
    }
    
    // Prisma specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      switch (prismaError.code) {
        case 'P2002':
          throw new AdminActionError('Duplicate value is not allowed | 不允许重复值', 'DUPLICATE_ERROR')
        case 'P2025':
          throw new AdminActionError('Data not found | 未找到数据', 'NOT_FOUND')
        case 'P1001':
          throw new AdminActionError('Unable to connect to the database | 无法连接到数据库', 'CONNECTION_ERROR')
        default:
          throw new AdminActionError(`Database error: ${prismaError.message || 'Unknown error'} | 数据库错误：${prismaError.message || '未知错误'}`, 'DATABASE_ERROR')
      }
    }
    
    // Network or other errors
    if (error instanceof Error) {
      throw new AdminActionError(`System error: ${error.message} | 系统错误：${error.message}`, 'SYSTEM_ERROR')
    }
    
    // Unknown errors
    throw new AdminActionError('Unknown error occurred | 发生未知错误', 'UNKNOWN_ERROR')
  }
}

// Simple authentication
export async function authenticateAdmin(formData: FormData) {
  return withErrorHandling(async () => {
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    if (username === 'admin' && password === 'admin123') {
      const cookieStore = await cookies()
      cookieStore.set('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      redirect('/admin')
    } else {
      throw new AdminActionError('Invalid credentials | 凭据无效', 'INVALID_CREDENTIALS')
    }
  }, 'authenticateAdmin')
}

export async function logout() {
  return withErrorHandling(async () => {
    const cookieStore = await cookies()
    cookieStore.delete('admin-auth')
    redirect('/admin')
  }, 'logout')
}

export async function isAuthenticated() {
  return withErrorHandling(async () => {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin-auth')
    return authCookie?.value === 'authenticated'
  }, 'isAuthenticated')
}

// Site Config Actions
export async function getSiteConfig() {
  return withErrorHandling(async () => {
    console.log("🔍 [getSiteConfig] Fetching site configuration...");
    const config = await prisma.siteConfig.findFirst()
    console.log("✅ [getSiteConfig] Site config fetched successfully:", config ? "Found" : "Not found");
    
    if (!config) {
      // Fallback to static site config
      const { siteConfig } = await import('@/config/site')
      console.log("📦 [getSiteConfig] Using fallback site config data");
      return siteConfig;
    }
    
    return config;
  }, 'getSiteConfig')
}

export async function updateSiteConfig(data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [updateSiteConfig] Updating site configuration...", data);
    
    // Validate required fields
    if (!data.name || !data.description) {
      throw new AdminActionError('Name and description are required | 名称和描述为必填项', 'VALIDATION_ERROR')
    }
    
    const existing = await prisma.siteConfig.findFirst()
    
    let result
    if (existing) {
      result = await prisma.siteConfig.update({
        where: { id: existing.id },
        data
      })
      await logUpdate(session, 'SiteConfig', result.id, 'Site Configuration', existing, result)
      console.log("✅ [updateSiteConfig] Site config updated successfully");
    } else {
      result = await prisma.siteConfig.create({ data })
      await logCreate(session, 'SiteConfig', result.id, 'Site Configuration', result)
      console.log("✅ [updateSiteConfig] Site config created successfully");
    }
    
    return result
  }, 'updateSiteConfig')
}

// Course Actions
export async function getCourses() {
  return withErrorHandling(async () => {
    console.log("🔍 [getCourses] Fetching courses...");
    const courses = await prisma.course.findMany({ 
      orderBy: { createdAt: 'desc' } 
    })
    console.log(`✅ [getCourses] Courses fetched successfully: ${courses.length} courses found`);
    console.log("📊 [getCourses] Course details:", courses.map(c => ({ id: c.id, title: c.title, highlighted: c.highlighted })));
    return courses;
  }, 'getCourses')
}

export async function createCourse(data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [createCourse] Creating new course...", { title: data.title });
    
    // Validate required fields
    if (!data.title || !data.subtitle || !data.description) {
      throw new AdminActionError('Title, subtitle, and description are required | 标题、副标题和描述为必填项', 'VALIDATION_ERROR')
    }
    
    // Validate slug uniqueness
    if (data.slug) {
      const existingCourse = await prisma.course.findFirst({
        where: { slug: data.slug }
      })
      if (existingCourse) {
        throw new AdminActionError('This slug is already in use | 该 slug 已被使用', 'DUPLICATE_SLUG')
      }
    }
    
    const result = await prisma.course.create({ data })
    await logCreate(session, 'Course', result.id, result.title, result)
    console.log("✅ [createCourse] Course created successfully:", result.id);
    return result
  }, 'createCourse')
}

export async function updateCourse(id: string, data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [updateCourse] Updating course...", { id, title: data.title });
    
    // Validate required fields
    if (!data.title || !data.subtitle || !data.description) {
      throw new AdminActionError('Гарчиг, дэд гарчиг болон тайлбар заавал шаардлагатай', 'VALIDATION_ERROR')
    }
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({ where: { id } })
    if (!existingCourse) {
      throw new AdminActionError('Course not found | 未找到课程', 'COURSE_NOT_FOUND')
    }
    
    // Validate slug uniqueness (if changed)
    if (data.slug && data.slug !== existingCourse.slug) {
      const duplicateSlug = await prisma.course.findFirst({
        where: { 
          slug: data.slug,
          id: { not: id }
        }
      })
      if (duplicateSlug) {
        throw new AdminActionError('This slug is already in use | 该 slug 已被使用', 'DUPLICATE_SLUG')
      }
    }
    
    const result = await prisma.course.update({
      where: { id },
      data
    })
    await logUpdate(session, 'Course', result.id, result.title, existingCourse, result)
    console.log("✅ [updateCourse] Course updated successfully:", result.id);
    return result
  }, 'updateCourse')
}

export async function deleteCourse(id: string) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("🗑️ [deleteCourse] Deleting course...", { id });
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({ where: { id } })
    if (!existingCourse) {
      throw new AdminActionError('Course not found | 未找到课程', 'COURSE_NOT_FOUND')
    }
    
    await logDelete(session, 'Course', id, existingCourse.title, existingCourse)
    const result = await prisma.course.delete({ where: { id } })
    console.log("✅ [deleteCourse] Course deleted successfully:", id);
    return result
  }, 'deleteCourse')
}

// Testimonial Actions
export async function getTestimonials() {
  return withErrorHandling(async () => {
    console.log("🔍 [getTestimonials] Fetching testimonials...");
    const testimonials = await prisma.testimonial.findMany({ 
      orderBy: { createdAt: 'desc' } 
    })
    console.log(`✅ [getTestimonials] Testimonials fetched successfully: ${testimonials.length} testimonials found`);
    return testimonials;
  }, 'getTestimonials')
}

export async function createTestimonial(data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [createTestimonial] Creating testimonial...", { name: data.name });
    
    // Validate required fields
    if (!data.name || !data.content || !data.rating) {
      throw new AdminActionError('Name, content, and rating are required | 姓名、评价内容和评分为必填项', 'VALIDATION_ERROR')
    }
    
    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      throw new AdminActionError('Rating must be between 1 and 5 | 评分必须在 1 到 5 之间', 'INVALID_RATING')
    }
    
    const result = await prisma.testimonial.create({ data })
    await logCreate(session, 'Testimonial', result.id, result.name, result)
    console.log("✅ [createTestimonial] Testimonial created successfully:", result.id);
    return result
  }, 'createTestimonial')
}

export async function updateTestimonial(id: string, data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [updateTestimonial] Updating testimonial...", { id, name: data.name });
    
    // Validate required fields
    if (!data.name || !data.content || !data.rating) {
      throw new AdminActionError('Нэр, сэтгэгдэл болон үнэлгээ заавал шаардлагатай', 'VALIDATION_ERROR')
    }
    
    // Check if testimonial exists
    const existing = await prisma.testimonial.findUnique({ where: { id } })
    if (!existing) {
      throw new AdminActionError('Testimonial not found | 未找到评价', 'TESTIMONIAL_NOT_FOUND')
    }
    
    const result = await prisma.testimonial.update({
      where: { id },
      data
    })
    await logUpdate(session, 'Testimonial', result.id, result.name, existing, result)
    console.log("✅ [updateTestimonial] Testimonial updated successfully:", result.id);
    return result
  }, 'updateTestimonial')
}

export async function deleteTestimonial(id: string) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("🗑️ [deleteTestimonial] Deleting testimonial...", { id });
    
    const existing = await prisma.testimonial.findUnique({ where: { id } })
    if (!existing) {
      throw new AdminActionError('Testimonial not found | 未找到评价', 'TESTIMONIAL_NOT_FOUND')
    }
    
    await logDelete(session, 'Testimonial', id, existing.name, existing)
    const result = await prisma.testimonial.delete({ where: { id } })
    console.log("✅ [deleteTestimonial] Testimonial deleted successfully:", id);
    return result
  }, 'deleteTestimonial')
}

// Partner Actions
export async function getPartners() {
  return withErrorHandling(async () => {
    console.log("🔍 [getPartners] Fetching partners...");
    const partners = await prisma.partner.findMany({ 
      orderBy: { createdAt: 'desc' } 
    })
    console.log(`✅ [getPartners] Partners fetched successfully: ${partners.length} partners found`);
    return partners;
  }, 'getPartners')
}

export async function createPartner(data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [createPartner] Creating partner...", { name: data.name });
    
    // Validate required fields
    if (!data.name || !data.logo || !data.url) {
      throw new AdminActionError('Name, logo, and URL are required | 名称、Logo 和链接为必填项', 'VALIDATION_ERROR')
    }
    
    const result = await prisma.partner.create({ data })
    await logCreate(session, 'Partner', result.id, result.name, result)
    console.log("✅ [createPartner] Partner created successfully:", result.id);
    return result
  }, 'createPartner')
}

export async function updatePartner(id: string, data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [updatePartner] Updating partner...", { id, name: data.name });
    
    // Check if partner exists
    const existing = await prisma.partner.findUnique({ where: { id } })
    if (!existing) {
      throw new AdminActionError('Partner not found | 未找到合作伙伴', 'PARTNER_NOT_FOUND')
    }
    
    const result = await prisma.partner.update({
      where: { id },
      data
    })
    await logUpdate(session, 'Partner', result.id, result.name, existing, result)
    console.log("✅ [updatePartner] Partner updated successfully:", result.id);
    return result
  }, 'updatePartner')
}

export async function deletePartner(id: string) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("🗑️ [deletePartner] Deleting partner...", { id });
    
    const existing = await prisma.partner.findUnique({ where: { id } })
    if (!existing) {
      throw new AdminActionError('Partner not found | 未找到合作伙伴', 'PARTNER_NOT_FOUND')
    }
    
    await logDelete(session, 'Partner', id, existing.name, existing)
    const result = await prisma.partner.delete({ where: { id } })
    console.log("✅ [deletePartner] Partner deleted successfully:", id);
    return result
  }, 'deletePartner')
}

// FAQ Actions
export async function getFAQs() {
  return withErrorHandling(async () => {
    console.log("🔍 [getFAQs] Fetching FAQs...");
    const faqs = await prisma.fAQ.findMany({ 
      orderBy: { order: 'asc' } 
    })
    console.log(`✅ [getFAQs] FAQs fetched successfully: ${faqs.length} FAQs found`);
    return faqs;
  }, 'getFAQs')
}

export async function createFAQ(data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [createFAQ] Creating FAQ...", { question: data.question?.substring(0, 50) });
    
    // Validate required fields
    if (!data.question || !data.answer) {
      throw new AdminActionError('Question and answer are required | 问题和答案为必填项', 'VALIDATION_ERROR')
    }
    
    const result = await prisma.fAQ.create({ data })
    await logCreate(session, 'FAQ', result.id, result.question.substring(0, 50), result)
    console.log("✅ [createFAQ] FAQ created successfully:", result.id);
    return result
  }, 'createFAQ')
}

export async function updateFAQ(id: string, data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [updateFAQ] Updating FAQ...", { id, question: data.question?.substring(0, 50) });
    
    // Check if FAQ exists
    const existing = await prisma.fAQ.findUnique({ where: { id } })
    if (!existing) {
      throw new AdminActionError('FAQ not found | 未找到常见问题', 'FAQ_NOT_FOUND')
    }
    
    const result = await prisma.fAQ.update({
      where: { id },
      data
    })
    await logUpdate(session, 'FAQ', result.id, result.question.substring(0, 50), existing, result)
    console.log("✅ [updateFAQ] FAQ updated successfully:", result.id);
    return result
  }, 'updateFAQ')
}

export async function deleteFAQ(id: string) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("🗑️ [deleteFAQ] Deleting FAQ...", { id });
    
    const existing = await prisma.fAQ.findUnique({ where: { id } })
    if (!existing) {
      throw new AdminActionError('FAQ not found | 未找到常见问题', 'FAQ_NOT_FOUND')
    }
    
    await logDelete(session, 'FAQ', id, existing.question.substring(0, 50), existing)
    const result = await prisma.fAQ.delete({ where: { id } })
    console.log("✅ [deleteFAQ] FAQ deleted successfully:", id);
    return result
  }, 'deleteFAQ')
}

// Feature Actions
export async function getFeatures() {
  return withErrorHandling(async () => {
    console.log("🔍 [getFeatures] Fetching features...");
    const features = await prisma.feature.findMany({ 
      orderBy: { order: 'asc' } 
    })
    console.log(`✅ [getFeatures] Features fetched successfully: ${features.length} features found`);
    return features;
  }, 'getFeatures')
}

export async function createFeature(data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [createFeature] Creating feature...", { title: data.title });
    
    // Validate required fields
    if (!data.title || !data.description || !data.icon) {
      throw new AdminActionError('Title, description, and icon are required | 标题、描述和图标为必填项', 'VALIDATION_ERROR')
    }
    
    const result = await prisma.feature.create({ data })
    await logCreate(session, 'Feature', result.id, result.title, result)
    console.log("✅ [createFeature] Feature created successfully:", result.id);
    return result
  }, 'createFeature')
}

export async function updateFeature(id: string, data: any) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("💾 [updateFeature] Updating feature...", { id, title: data.title });
    
    // Check if feature exists
    const existing = await prisma.feature.findUnique({ where: { id } })
    if (!existing) {
      throw new AdminActionError('Feature not found | 未找到功能亮点', 'FEATURE_NOT_FOUND')
    }
    
    const result = await prisma.feature.update({
      where: { id },
      data
    })
    await logUpdate(session, 'Feature', result.id, result.title, existing, result)
    console.log("✅ [updateFeature] Feature updated successfully:", result.id);
    return result
  }, 'updateFeature')
}

export async function deleteFeature(id: string) {
  return withErrorHandling(async () => {
    const session = await getAdminSession()
    if (!session) throw new AdminActionError('Unauthorized | 未授权', 'UNAUTHORIZED')
    
    console.log("🗑️ [deleteFeature] Deleting feature...", { id });
    
    const existing = await prisma.feature.findUnique({ where: { id } })
    if (!existing) {
      throw new AdminActionError('Feature not found | 未找到功能亮点', 'FEATURE_NOT_FOUND')
    }
    
    await logDelete(session, 'Feature', id, existing.title, existing)
    const result = await prisma.feature.delete({ where: { id } })
    console.log("✅ [deleteFeature] Feature deleted successfully:", id);
    return result
  }, 'deleteFeature')
}

// index.ts
// export { 
//   aboutUs, 
//   valueProposition, 
//   features, 
//   testimonials, 
//   partners, 
//   faq, 
//   ctaSection, 
//   siteConfig, 
//   metaConfig 
// } from './config.ts';

  