
// Define the booking type with a specific status type
export interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  vehicleReg?: string;
  packageType: string;
  date: Date | string;
  time?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  contact?: string;
  email?: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "in-progress" | "completed";
  condition?: number;
  staff?: string[];
  createdAt?: string;
  totalPrice?: number;
  travelMinutes?: number;
  additionalServices?: string[]; // Added to track selected additional services
}

// Helper function to validate booking status
export const validateBookingStatus = (status: string): "pending" | "confirmed" | "cancelled" | "in-progress" | "completed" => {
  const validStatuses = ["pending", "confirmed", "cancelled", "in-progress", "completed"];
  return validStatuses.includes(status) 
    ? (status as "pending" | "confirmed" | "cancelled" | "in-progress" | "completed") 
    : "pending"; // Default to pending if invalid status
};
