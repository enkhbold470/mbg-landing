"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ApplicationStatus, ScholarshipSearchFilters, ApplicationFormData, AdmissionStatus } from "@/lib/types";

if (process.env.NODE_ENV === "development") {
  console.log("🎓 Loading scholarship and college actions");
}

// Get all available scholarships with optional filters
export async function getScholarships(filters?: ScholarshipSearchFilters) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("📚 Fetching scholarships with filters:", filters);
    }

    const where: any = {
      isActive: true,
    };

    if (filters) {
      if (filters.programType) where.programType = filters.programType;
      if (filters.major) where.major = { contains: filters.major, mode: 'insensitive' };
      if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
      if (filters.university) where.university = { contains: filters.university, mode: 'insensitive' };
      if (filters.languageProgram !== undefined) where.languageProgram = filters.languageProgram;
      if (filters.hskRequired) where.hskRequired = { lte: filters.hskRequired };
      if (filters.ieltsRequired) where.ieltsRequired = { lte: filters.ieltsRequired };
      if (filters.minAge) where.minAge = { lte: filters.minAge };
      if (filters.maxAge) where.maxAge = { gte: filters.maxAge };
      if (filters.minAmount) where.scholarshipAmount = { gte: filters.minAmount };
      if (filters.maxAmount) where.scholarshipAmount = { lte: filters.maxAmount };
    }

    const scholarships = await prisma.scholarship.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`🎓 Found ${scholarships.length} scholarships`);
    }

    return scholarships;
  } catch (error) {
    console.error("❌ Error fetching scholarships:", error);
    throw error;
  }
}

// Search scholarships by term
export async function searchScholarships(searchTerm: string, filters?: ScholarshipSearchFilters) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Searching scholarships:", searchTerm);
    }

    const where: any = {
      isActive: true,
    };

    // Add search conditions
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { major: { contains: searchTerm, mode: 'insensitive' } },
        { university: { contains: searchTerm, mode: 'insensitive' } },
        { city: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Apply filters
    if (filters) {
      if (filters.programType) where.programType = filters.programType;
      if (filters.major && !searchTerm) where.major = { contains: filters.major, mode: 'insensitive' };
      if (filters.city && !searchTerm) where.city = { contains: filters.city, mode: 'insensitive' };
      if (filters.university && !searchTerm) where.university = { contains: filters.university, mode: 'insensitive' };
      if (filters.languageProgram !== undefined) where.languageProgram = filters.languageProgram;
      if (filters.hskRequired) where.hskRequired = { lte: filters.hskRequired };
      if (filters.ieltsRequired) where.ieltsRequired = { lte: filters.ieltsRequired };
      if (filters.minAge) where.minAge = { lte: filters.minAge };
      if (filters.maxAge) where.maxAge = { gte: filters.maxAge };
      if (filters.minAmount) where.scholarshipAmount = { gte: filters.minAmount };
      if (filters.maxAmount) where.scholarshipAmount = { lte: filters.maxAmount };
    }

    const scholarships = await prisma.scholarship.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    return scholarships;
  } catch (error) {
    console.error("❌ Error searching scholarships:", error);
    throw error;
  }
}

// Get single scholarship by ID
export async function getScholarshipById(id: number) {
  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!scholarship) {
      throw new Error("Scholarship not found");
    }

    return scholarship;
  } catch (error) {
    console.error("❌ Error fetching scholarship:", error);
    throw error;
  }
}

// Get universities with scholarship counts
export async function getUniversities() {
  try {
    const universities = await prisma.scholarship.groupBy({
      by: ['university', 'city'],
      where: { isActive: true },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`🏫 Found ${universities.length} universities`);
    }

    return universities.map(uni => ({
      name: uni.university,
      city: uni.city,
      scholarshipCount: uni._count.id
    }));
  } catch (error) {
    console.error("❌ Error fetching universities:", error);
    return [];
  }
}

// Get university details with scholarships
export async function getUniversityDetails(universityName: string) {
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: {
        university: universityName,
        isActive: true
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (scholarships.length === 0) {
      return null;
    }

    const university = {
      name: universityName,
      city: scholarships[0].city,
      scholarships: scholarships,
      totalScholarships: scholarships.length,
      programs: [...new Set(scholarships.map(s => s.programType))],
      majors: [...new Set(scholarships.map(s => s.major))],
    };

    return university;
  } catch (error) {
    console.error("❌ Error fetching university details:", error);
    return null;
  }
}

// Create scholarship application
export async function createScholarshipApplication(data: ApplicationFormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("📝 Creating scholarship application:", { userId, data });
    }

    // Ensure user exists in database first
    await prisma.user.upsert({
      where: { userId },
      update: { updatedAt: new Date() },
      create: { userId },
    });

    // Check if user already has an application for this scholarship
    const existingApplication = await prisma.scholarshipApplication.findFirst({
      where: { 
        userId,
        scholarshipId: data.scholarshipId 
      },
    });

    if (existingApplication) {
      return {
        success: false,
        error: "You already have an application for this scholarship"
      };
    }

    // Generate unique application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const application = await prisma.scholarshipApplication.create({
      data: {
        userId,
        scholarshipId: data.scholarshipId,
        applicationId,
        status: ApplicationStatus.DRAFT,
        collegeAdmissionStatus: AdmissionStatus.PENDING,
        hskLevel: data.hskLevel,
        ieltsScore: data.ieltsScore,
        previousEducation: data.previousEducation,
        motivationLetter: data.motivationLetter,
      },
      include: {
        scholarship: true,
        user: true,
      },
    });

    revalidatePath("/applications");

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Application created:", application.applicationId);
    }

    return {
      success: true,
      data: application
    };
  } catch (error) {
    console.error("❌ Error creating application:", error);
    return {
      success: false,
      error: "Failed to create application"
    };
  }
}

// Get user applications
export async function getUserApplications() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return [];
    }

    const applications = await prisma.scholarshipApplication.findMany({
      where: { userId },
      include: {
        scholarship: true,
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`📄 Found ${applications.length} applications for user`);
    }

    return applications;
  } catch (error) {
    console.error("❌ Error fetching user applications:", error);
    return [];
  }
}

// Submit application (change status from DRAFT to SUBMITTED)
export async function submitApplication(applicationId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    const application = await prisma.scholarshipApplication.findFirst({
      where: { 
        applicationId,
        userId 
      },
    });

    if (!application) {
      return {
        success: false,
        error: "Application not found"
      };
    }

    if (application.status !== ApplicationStatus.DRAFT) {
      return {
        success: false,
        error: "Application has already been submitted"
      };
    }

    const updatedApplication = await prisma.scholarshipApplication.update({
      where: { id: application.id },
      data: { 
        status: ApplicationStatus.SUBMITTED,
        updatedAt: new Date(),
      },
      include: {
        scholarship: true,
        user: true,
      },
    });

    revalidatePath("/applications");

    return {
      success: true,
      data: updatedApplication
    };
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    return {
      success: false,
      error: "Failed to submit application"
    };
  }
}

// Get recommended scholarships based on user profile
export async function getRecommendedScholarships(limit: number = 5) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return [];
    }

    // For now, just return recent active scholarships
    // In the future, this could use user profile data for better matching
    const scholarships = await prisma.scholarship.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    return scholarships;
  } catch (error) {
    console.error("❌ Error fetching recommended scholarships:", error);
    return [];
  }
}

// Get scholarship statistics
export async function getScholarshipStats() {
  try {
    const [
      totalScholarships,
      activeScholarships,
      totalApplications,
      popularCities,
      popularMajors,
      popularUniversities
    ] = await Promise.all([
      prisma.scholarship.count(),
      prisma.scholarship.count({ where: { isActive: true } }),
      prisma.scholarshipApplication.count(),
      prisma.scholarship.groupBy({
        by: ['city'],
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
        take: 10,
      }),
      prisma.scholarship.groupBy({
        by: ['major'],
        _count: { major: true },
        orderBy: { _count: { major: 'desc' } },
        take: 10,
      }),
      prisma.scholarship.groupBy({
        by: ['university'],
        _count: { university: true },
        orderBy: { _count: { university: 'desc' } },
        take: 10,
      }),
    ]);

    const approvedApplications = await prisma.scholarshipApplication.count({
      where: { status: ApplicationStatus.APPROVED }
    });

    const successRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;

    return {
      totalScholarships,
      activeScholarships,
      totalApplications,
      successRate,
      popularCities: popularCities.map(item => ({ 
        city: item.city, 
        count: item._count.city 
      })),
      popularMajors: popularMajors.map(item => ({ 
        major: item.major, 
        count: item._count.major 
      })),
      popularUniversities: popularUniversities.map(item => ({ 
        university: item.university, 
        count: item._count.university 
      })),
    };
  } catch (error) {
    console.error("❌ Error fetching scholarship stats:", error);
    return {
      totalScholarships: 0,
      activeScholarships: 0,
      totalApplications: 0,
      successRate: 0,
      popularCities: [],
      popularMajors: [],
      popularUniversities: [],
    };
  }
}

// Get application by ID
export async function getApplicationById(applicationId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    const application = await prisma.scholarshipApplication.findFirst({
      where: { 
        applicationId,
        userId 
      },
      include: {
        scholarship: true,
        user: true,
        documents: true,
      },
    });

    return application;
  } catch (error) {
    console.error("❌ Error fetching application:", error);
    return null;
  }
}
