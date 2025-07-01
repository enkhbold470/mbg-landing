import { User, DeliveryOrder } from "@prisma/client";

export type CargoUser = User;

export type CargoDeliveryOrder = DeliveryOrder;

export type DeliveryOrderWithUser = DeliveryOrder & {
  user: User;
};

export type DeliveryStatus = "requested" | "confirmed" | "in_delivery" | "delivered" | "cancelled";

export type DeliveryOrderFormData = {
  tracking_id: string;
  package_title: string;
  package_description?: string;
  delivery_address: string;
  item_value: number;
  wants_insurance: boolean;
};

export type DeliveryQuote = {
  base_cargo_cost: number;
  insurance_cost: number;
  estimated_days: number;
};

export type TrackingInfo = {
  tracking_id: string;
  status: DeliveryStatus;
  package_title: string;
  delivery_address: string;
  estimated_delivery?: Date;
  last_updated: Date;
};

export type UserProfile = {
  full_name?: string;
  phone?: string;
  home_address?: string;
  email?: string;
};
