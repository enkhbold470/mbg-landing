// app/actions/config.ts
"use server"

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Simple authentication
export async function authenticateAdmin(formData: FormData) {
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
    throw new Error('Invalid credentials')
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-auth')
  redirect('/admin')
}

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin-auth')
  return authCookie?.value === 'authenticated'
}

// Site Config Actions
export async function getSiteConfig() {
  try {
    console.log("🔍 [getSiteConfig] Fetching site configuration...");
    const config = await prisma.siteConfig.findFirst()
    console.log("✅ [getSiteConfig] Site config fetched successfully:", config ? "Found" : "Not found");
    return config;
  } catch (error) {
    console.error("❌ [getSiteConfig] Error fetching site config:", error);
    // Fallback to static site config
    const { siteConfig } = await import('@/config/site')
    console.log("📦 [getSiteConfig] Using fallback site config data");
    return siteConfig;
  }
}

export async function updateSiteConfig(data: any) {
  const existing = await prisma.siteConfig.findFirst()
  
  if (existing) {
    return await prisma.siteConfig.update({
      where: { id: existing.id },
      data
    })
  } else {
    return await prisma.siteConfig.create({ data })
  }
}

// Course Actions
export async function getCourses() {
  try {
    console.log("🔍 [getCourses] Fetching courses...");
    const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } })
    console.log(`✅ [getCourses] Courses fetched successfully: ${courses.length} courses found`);
    console.log("📊 [getCourses] Course details:", courses.map(c => ({ id: c.id, title: c.title, highlighted: c.highlighted })));
    
    // Parse features from JSON string back to array for frontend compatibility
    const coursesWithParsedFeatures = courses.map(course => ({
      ...course,
      features: course.features ? (typeof course.features === 'string' ? JSON.parse(course.features) : course.features) : []
    }));
    
    return coursesWithParsedFeatures;
  } catch (error) {
    console.error("❌ [getCourses] Error fetching courses:", error);
    // Fallback to static course data from site config
    const { siteConfig } = await import('@/config/site')
    console.log("📦 [getCourses] Using fallback course data from site config");
    return siteConfig.courses || [];
  }
}

export async function createCourse(data: any) {
  // Convert features array to JSON string for SQLite storage
  const courseData = {
    ...data,
    features: Array.isArray(data.features) ? JSON.stringify(data.features) : data.features
  }
  return await prisma.course.create({ data: courseData })
}

export async function updateCourse(id: string, data: any) {
  // Convert features array to JSON string for SQLite storage
  const courseData = {
    ...data,
    features: Array.isArray(data.features) ? JSON.stringify(data.features) : data.features
  }
  return await prisma.course.update({
    where: { id },
    data: courseData
  })
}

export async function deleteCourse(id: string) {
  return await prisma.course.delete({ where: { id } })
}

// Testimonial Actions
export async function getTestimonials() {
  try {
    console.log("🔍 [getTestimonials] Fetching testimonials...");
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
    console.log(`✅ [getTestimonials] Testimonials fetched successfully: ${testimonials.length} testimonials found`);
    console.log("📊 [getTestimonials] Testimonial details:", testimonials.map(t => ({ id: t.id, name: t.name, rating: t.rating })));
    return testimonials;
  } catch (error) {
    console.error("❌ [getTestimonials] Error fetching testimonials:", error);
    // Fallback to static testimonial data from site config
    const { testimonials } = await import('@/config/site')
    console.log("📦 [getTestimonials] Using fallback testimonial data from site config");
    return testimonials || [];
  }
}

export async function createTestimonial(data: any) {
  return await prisma.testimonial.create({ data })
}

export async function updateTestimonial(id: string, data: any) {
  return await prisma.testimonial.update({
    where: { id },
    data
  })
}

export async function deleteTestimonial(id: string) {
  return await prisma.testimonial.delete({ where: { id } })
}

// Partner Actions
export async function getPartners() {
  try {
    console.log("🔍 [getPartners] Fetching partners...");
    const partners = await prisma.partner.findMany({ orderBy: { createdAt: 'desc' } })
    console.log(`✅ [getPartners] Partners fetched successfully: ${partners.length} partners found`);
    console.log("📊 [getPartners] Partner details:", partners.map(p => ({ id: p.id, name: p.name, url: p.url })));
    return partners;
  } catch (error) {
    console.error("❌ [getPartners] Error fetching partners:", error);
    // Fallback to static partner data from site config
    const { partners } = await import('@/config/site')
    console.log("📦 [getPartners] Using fallback partner data from site config");
    return partners || [];
  }
}

export async function createPartner(data: any) {
  return await prisma.partner.create({ data })
}

export async function updatePartner(id: string, data: any) {
  return await prisma.partner.update({
    where: { id },
    data
  })
}

export async function deletePartner(id: string) {
  return await prisma.partner.delete({ where: { id } })
}

// FAQ Actions
export async function getFAQs() {
  try {
    console.log("🔍 [getFAQs] Fetching FAQs...");
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
    console.log(`✅ [getFAQs] FAQs fetched successfully: ${faqs.length} FAQs found`);
    console.log("📊 [getFAQs] FAQ details:", faqs.map(f => ({ id: f.id, question: f.question.substring(0, 50) + "...", order: f.order })));
    return faqs;
  } catch (error) {
    console.error("❌ [getFAQs] Error fetching FAQs:", error);
    // Fallback to static FAQ data from site config
    const { faq } = await import('@/config/site')
    console.log("📦 [getFAQs] Using fallback FAQ data from site config");
    return faq || [];
  }
}

export async function createFAQ(data: any) {
  return await prisma.fAQ.create({ data })
}

export async function updateFAQ(id: string, data: any) {
  return await prisma.fAQ.update({
    where: { id },
    data
  })
}

export async function deleteFAQ(id: string) {
  return await prisma.fAQ.delete({ where: { id } })
}

// Feature Actions
export async function getFeatures() {
  try {
    console.log("🔍 [getFeatures] Fetching features...");
    const features = await prisma.feature.findMany({ orderBy: { order: 'asc' } })
    console.log(`✅ [getFeatures] Features fetched successfully: ${features.length} features found`);
    console.log("📊 [getFeatures] Feature details:", features.map(f => ({ id: f.id, title: f.title, icon: f.icon, order: f.order })));
    return features;
  } catch (error) {
    console.error("❌ [getFeatures] Error fetching features:", error);
    // Fallback to static feature data from site config
    const { features } = await import('@/config/site')
    console.log("📦 [getFeatures] Using fallback feature data from site config");
    return features || [];
  }
}

export async function createFeature(data: any) {
  return await prisma.feature.create({ data })
}

export async function updateFeature(id: string, data: any) {
  return await prisma.feature.update({
    where: { id },
    data
  })
}

export async function deleteFeature(id: string) {
  return await prisma.feature.delete({ where: { id } })
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

  