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
  return await prisma.siteConfig.findFirst()
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
  return await prisma.course.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function createCourse(data: any) {
  return await prisma.course.create({ data })
}

export async function updateCourse(id: string, data: any) {
  return await prisma.course.update({
    where: { id },
    data
  })
}

export async function deleteCourse(id: string) {
  return await prisma.course.delete({ where: { id } })
}

// Testimonial Actions
export async function getTestimonials() {
  return await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
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
  return await prisma.partner.findMany({ orderBy: { createdAt: 'desc' } })
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
  return await prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
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
  return await prisma.feature.findMany({ orderBy: { order: 'asc' } })
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

  