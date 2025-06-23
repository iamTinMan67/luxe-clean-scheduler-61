
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";

export interface UseTrackingDataReturn {
  booking: Booking | null;
  tasks: ServiceTaskItem[];
  isInspected: boolean;
  progress: number;
  sessionExpired: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TrackingDataState {
  booking: Booking | null;
  tasks: ServiceTaskItem[];
  isInspected: boolean;
  progress: number;
  sessionExpired: boolean;
  isLoading: boolean;
  error: string | null;
}
