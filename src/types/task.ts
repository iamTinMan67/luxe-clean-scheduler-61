export interface ServiceTaskItem {
  id: string;
  name: string;
  completed: boolean;
  allocatedTime: number; // in minutes
  actualTime?: number; // in minutes
  completedAt?: string; // ISO timestamp when task was completed
  updatedAt?: string; // ISO timestamp when task was last updated
}

export interface ServiceProgress {
  bookingId: string;
  tasks: ServiceTaskItem[];
  lastUpdated: string;
}

export interface BookingStep {
  id: number;
  name: string;
  completed: boolean;
  time?: string;
  estimatedTime: string;
}

export interface ProgressData {
  bookingId: string;
  steps: BookingStep[];
  updatedAt: string;
}

// New types for checklist items
export interface InspectionChecklistItem {
  id: number;
  label: string;
  completed: boolean;
  required: boolean;
  vehicleType?: 'car' | 'van' | 'all'; // The vehicle type this checklist item applies to
}

export interface CustomChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}
