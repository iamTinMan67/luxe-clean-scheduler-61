export type PackageType = "basic" | "medium" | "elite";

export type VehicleType = "car" | "suv" | "van";

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  description: string;
  selected?: boolean;
}

export interface PackageOption {
  id: string;
  name: string;
  type: PackageType;
  description: string;
  features: string[];
  basePrice: {
    car: { small: number; medium: number; large: number };
    suv: { small: number; medium: number; large: number };
    van: { small: number; medium: number; large: number };
  };
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  size: VehicleSize;
  condition: number;
  package: PackageType;
  additionalServices: AdditionalService[];
}

// Keep the VehicleSize type since it's still used in other places
export type VehicleSize = "small" | "medium" | "large";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  vehicles: Vehicle[];
  date: Date;
  time: string;
  location: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  totalPrice: number;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: "valeter" | "manager" | "admin";
  availability: {
    [key: string]: { start: string; end: string }[];
  };
}

export interface Assignment {
  id: string;
  bookingId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  status: "assigned" | "in-progress" | "completed";
}

export interface InspectionReport {
  id: string;
  bookingId: string;
  vehicleId: string;
  staffId: string;
  images: string[];
  notes: string;
  date: Date;
  type: "pre" | "post";
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold: number;
  location: "van" | "warehouse";
  vanId?: string;
}

export interface TodoItem {
  id: string;
  bookingId: string;
  vehicleId: string;
  task: string;
  estimatedTime: number; // in minutes
  actualTime?: number; // in minutes
  status: "pending" | "in-progress" | "completed";
  staffId: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  customerId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  paid: boolean;
  date: Date;
}

export interface GalleryItem {
  id: string;
  bookingId: string;
  vehicleId: string;
  beforeImages: string[];
  afterImages: string[];
  description: string;
  customerReview?: {
    rating: number;
    comment: string;
    date: Date;
  };
}
