"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DeliveryOrderFormData, DeliveryQuote } from "@/lib/types";

if (process.env.NODE_ENV === "development") {
  console.log("📦 Loading package delivery actions");
}

// Calculate delivery quote with optional insurance
export async function calculateDeliveryQuote(data: DeliveryOrderFormData): Promise<DeliveryQuote> {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🧮 Calculating delivery quote:", data);
    }

    // Base cargo handling cost (flat rate)
    const baseCargoSost = 50; // 50 yuan base cargo handling cost

    // Insurance cost (10% of item value if selected)
    const insuranceCost = data.wants_insurance ? data.item_value * 0.1 : 0;

    const estimatedDays = 14; // 14-day delivery estimate

    const quote: DeliveryQuote = {
      base_cargo_cost: baseCargoSost,
      insurance_cost: insuranceCost,
      estimated_days: estimatedDays,
    };

    if (process.env.NODE_ENV === "development") {
      console.log("💰 Quote calculated:", quote);
    }

    return quote;
  } catch (error) {
    console.error("❌ Error calculating quote:", error);
    throw error;
  }
}

// Create new delivery order (claim package)
export async function createDeliveryOrder(data: DeliveryOrderFormData): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("📦 Creating delivery order:", { userId, data });
    }

    // Ensure user exists in database first
    const user = await prisma.user.upsert({
      where: { user_id: userId },
      update: {
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        // Will be null initially, user can update profile later
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("👤 User ensured in database:", user.user_id);
    }

    // Check if tracking ID already exists
    const existingOrder = await prisma.deliveryOrder.findUnique({
      where: { tracking_id: data.tracking_id },
    });

    if (existingOrder) {
      if (process.env.NODE_ENV === "development") {
        console.log("⚠️ Tracking ID already claimed:", data.tracking_id);
      }
      return {
        success: false,
        error: "This tracking ID has already been claimed"
      };
    }

    const quote = await calculateDeliveryQuote(data);

    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        user_id: userId,
        tracking_id: data.tracking_id,
        package_title: data.package_title,
        package_description: data.package_description,
        delivery_address: data.delivery_address,
        item_value: data.item_value,
        base_cargo_cost: quote.base_cargo_cost,
        wants_insurance: data.wants_insurance,
        insurance_cost: quote.insurance_cost,
        estimated_delivery: new Date(Date.now() + quote.estimated_days * 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/orders");
    
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Delivery order created:", deliveryOrder.tracking_id);
    }
    
    return {
      success: true,
      data: deliveryOrder
    };
  } catch (error) {
    console.error("❌ Error creating delivery order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

// Get user's delivery orders
export async function getUserDeliveryOrders() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return [];
    }

    if (process.env.NODE_ENV === "development") {
      console.log("📋 Fetching delivery orders for user:", userId);
    }

    const orders = await prisma.deliveryOrder.findMany({
      where: { user_id: userId },
      include: { user: true },
      orderBy: { created_at: "desc" },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`📦 Found ${orders.length} delivery orders`);
    }

    return orders;
  } catch (error) {
    console.error("❌ Error fetching delivery orders:", error);
    throw error;
  }
}

// Track delivery order by tracking ID
export async function trackDeliveryOrder(trackingId: string): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Tracking delivery order:", trackingId);
    }

    const order = await prisma.deliveryOrder.findUnique({
      where: { tracking_id: trackingId },
      include: { user: true },
    });

    if (!order) {
      if (process.env.NODE_ENV === "development") {
        console.log("⚠️ Package not found:", trackingId);
      }
      return {
        success: false,
        error: "Package not found or not yet claimed"
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("📍 Delivery order found:", order.status);
    }

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error("❌ Error tracking delivery order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

// Update delivery order status (admin function)
export async function updateDeliveryStatus(trackingId: string, status: string) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Updating delivery status:", { trackingId, status });
    }

    const order = await prisma.deliveryOrder.update({
      where: { tracking_id: trackingId },
      data: { 
        status,
        updated_at: new Date(),
        ...(status === "delivered" && { actual_delivery: new Date() }),
      },
      include: { user: true },
    });

    revalidatePath("/orders");
    revalidatePath("/admin");

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Status updated:", order.status);
    }

    return order;
  } catch (error) {
    console.error("❌ Error updating status:", error);
    throw error;
  }
}
