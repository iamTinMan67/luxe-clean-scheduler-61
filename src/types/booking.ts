
// Define the booking type with a specific status type
export interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  vehicleReg?: string;
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
  status: "pending" | "confirmed" | "cancelled" | "in-progress" | "inspected" | "completed" | "finished";
  condition?: number;
  staff?: string[];
  createdAt?: string;
  totalPrice?: number;
  travelMinutes?: number;
  additionalServices?: string[]; // Added to track selected additional services
}

// Helper function to validate booking status
export const validateBookingStatus = (status: string): "pending" | "confirmed" | "cancelled" | "in-progress" | "inspected" | "completed" | "finished" => {
  const validStatuses = ["pending", "confirmed", "cancelled", "in-progress", "inspected", "completed", "finished"];
  return validStatuses.includes(status) 
    ? (status as "pending" | "confirmed" | "cancelled" | "in-progress" | "inspected" | "completed" | "finished") 
    : "pending"; // Default to pending if invalid status
};
