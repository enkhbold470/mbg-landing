"use server"
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { UserWithDetails } from '@/lib/types'

export async function getCurrentUser() {
  try {
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return null;
    }

    // Get or create user in our database
    const user = await prisma.user.upsert({
      where: { userId: clerkUser.id },
      update: {
        email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
        fullName: clerkUser.fullName || null,
        updatedAt: new Date(),
      },
      create: {
        userId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
        fullName: clerkUser.fullName || null,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("👤 Current user fetched:", user.userId);
    }

    return user;
  } catch (error) {
    console.error("❌ Error fetching current user:", error);
    return null;
  }
}

export async function getCurrentUserBasic() {
  try {
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return null;
    }

    return {
      id: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
      fullName: clerkUser.fullName || null,
      firstName: clerkUser.firstName || null,
      lastName: clerkUser.lastName || null,
      imageUrl: clerkUser.imageUrl || null,
      createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : null,
      updatedAt: clerkUser.updatedAt ? new Date(clerkUser.updatedAt).toISOString() : null,
    };
  } catch (error) {
    console.error("❌ Error fetching basic user:", error);
    return null;
  }
}
