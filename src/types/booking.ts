
// Define the booking type with a specific status type
export interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  vehicleReg?: string;
  jobDetails?: string;
  secondVehicle?: string;
  secondVehicleReg?: string;
  packageType: string; // Now supports "other" for non-standard services
  package?: string; // Added for backward compatibility
  date: Date | string;
  time: string;
  startTime?: string;
  endTime?: string;
  location: string;
  contact?: string;
  email?: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "inspecting" | "inspected" | "in-progress" | "finished";
  condition?: number;
  staff?: string[];
  createdAt?: string;
  totalPrice?: number;
  travelMinutes?: number;
  additionalServices?: string[]; // Added to track selected additional services
  clientType?: "private" | "corporate"; // Client type field
  jobType?: string; // Supports "car", "van", "other"
}

// Export the BookingStatus type
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "inspecting" | "inspected" | "in-progress" | "finished";

// Helper function to validate booking status
export const validateBookingStatus = (status: string): BookingStatus => {
  const validStatuses: BookingStatus[] = ["pending", "confirmed", "cancelled", "inspecting", "inspected", "in-progress", "finished"];
  return validStatuses.includes(status as BookingStatus) 
    ? (status as BookingStatus) 
    : "pending"; // Default to pending if invalid status
};
