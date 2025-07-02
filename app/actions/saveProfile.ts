"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

if (process.env.NODE_ENV === "development") {
  console.log("👤 Loading user profile actions");
}

export type UserProfile = {
  fullName?: string;
  phone?: string;
  email?: string;
  age?: number;
  nationality?: string;
};

export async function saveUserProfile(profileData: UserProfile) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (process.env.NODE_ENV === "development") {
      console.log("💾 Saving user profile:", { userId, profileData });
    }

    const user = await prisma.user.upsert({
      where: { userId },
      update: {
        fullName: profileData.fullName,
        phone: profileData.phone,
        email: profileData.email,
        age: profileData.age,
        nationality: profileData.nationality,
        updatedAt: new Date(),
      },
      create: {
        userId,
        fullName: profileData.fullName,
        phone: profileData.phone,
        email: profileData.email,
        age: profileData.age,
        nationality: profileData.nationality,
      },
    });

    revalidatePath("/profile");
    
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Profile saved successfully:", user.userId);
    }
    
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    return {
      success: false,
      error: "Failed to save profile",
    };
  }
}

export async function getProfile() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Fetching profile for user:", userId);
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("👤 Profile fetched:", user ? "found" : "not found");
    }

    return user;
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return null;
  }
}

export async function getUserApplicationsCount() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return 0;
    }

    const count = await prisma.scholarshipApplication.count({
      where: { userId },
    });

    return count;
  } catch (error) {
    console.error("❌ Error fetching applications count:", error);
    return 0;
  }
}

export async function getUserDocumentsCount() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return 0;
    }

    const count = await prisma.document.count({
        where: { userId },
    });

    return count;
  } catch (error) {
    console.error("❌ Error fetching documents count:", error);
    return 0;
  }
}