
export interface ServiceTaskItem {
  id: string;
  name: string;
  completed: boolean;
  allocatedTime: number; // in minutes
  actualTime?: number; // in minutes
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
