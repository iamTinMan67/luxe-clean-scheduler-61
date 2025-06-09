
// Define the booking type with a specific status type
export interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  vehicleReg?: string;
  jobDetails?: string;
  secondVehicle?: string;
  secondVehicleReg?: string;
  packageType: string;
  date: Date | string;
  time?: string;
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
  vehicleType?: string; // Vehicle/job type field
}

// Helper function to validate booking status
export const validateBookingStatus = (status: string): "pending" | "confirmed" | "cancelled" | "inspecting" | "inspected" | "in-progress" | "finished" => {
  const validStatuses = ["pending", "confirmed", "cancelled", "inspecting", "inspected", "in-progress", "finished"];
  return validStatuses.includes(status) 
    ? (status as "pending" | "confirmed" | "cancelled" | "inspecting" | "inspected" | "in-progress" | "finished") 
    : "pending"; // Default to pending if invalid status
};
