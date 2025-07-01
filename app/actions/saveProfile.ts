"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserProfile } from "@/lib/types";

if (process.env.NODE_ENV === "development") {
  console.log("👤 Loading user profile actions");
}

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
      where: { user_id: userId },
      update: {
        full_name: profileData.full_name,
        phone: profileData.phone,
        home_address: profileData.home_address,
        email: profileData.email,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        full_name: profileData.full_name,
        phone: profileData.phone,
        home_address: profileData.home_address,
        email: profileData.email,
      },
    });

    revalidatePath("/profile");
    
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Profile saved successfully:", user);
    }
    
    return user;
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    throw error;
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
      where: { user_id: userId },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("👤 Profile fetched:", user ? "found" : "not found");
    }

    return user;
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    throw error;
  }
}