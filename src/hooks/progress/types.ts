
export interface BookingStep {
  id: number;
  name: string;
  completed: boolean;
  time?: string;
  estimatedTime?: string;
}

export interface ProgressBooking {
  id: string;
  customerName: string;
  vehicleType: string;
  packageType: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "confirmed" | "in-progress" | "completed";
  progressPercentage: number;
  totalPrice: number;
  steps: BookingStep[];
}
