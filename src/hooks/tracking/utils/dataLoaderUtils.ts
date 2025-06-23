
import { trackingDataSync } from "@/services/trackingDataSync";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { calculateProgress, generatePlaceholderTasks } from "./progressUtils";

export interface LoadDataResult {
  booking: Booking | null;
  tasks: ServiceTaskItem[];
  isInspected: boolean;
  progress: number;
  error: string | null;
}

export const loadTrackingData = (bookingId: string): LoadDataResult => {
  console.log('=== Enhanced Loading Tracking Data ===');
  console.log('Booking ID:', bookingId);
  
  try {
    // Get comprehensive tracking data
    const trackingData = trackingDataSync.getTrackingData(bookingId);
    console.log('Tracking data:', trackingData);
    
    // Find booking from either source
    const foundBooking = trackingData.confirmedBooking || trackingData.plannerBooking;
    
    if (!foundBooking) {
      console.log('Booking not found in any localStorage source');
      return {
        booking: null,
        tasks: [],
        isInspected: false,
        progress: 0,
        error: 'Booking not found'
      };
    }

    // Validate booking status for tracking
    const validStatuses = ["inspecting", "inspected", "in-progress", "finished"];
    if (!validStatuses.includes(foundBooking.status)) {
      console.log('Invalid booking status for tracking:', foundBooking.status);
      return {
        booking: null,
        tasks: [],
        isInspected: false,
        progress: 0,
        error: `Booking status "${foundBooking.status}" is not trackable`
      };
    }

    console.log('Found booking:', foundBooking.customer, foundBooking.status);
    const isInspected = foundBooking.status === "inspected" || foundBooking.status === "in-progress" || foundBooking.status === "finished";
    
    let tasks: ServiceTaskItem[] = [];
    let progress = 0;

    // Load service tasks based on booking status
    if (foundBooking.status === "inspecting") {
      // Show placeholder tasks for inspecting status
      tasks = generatePlaceholderTasks(foundBooking);
      progress = 0;
      console.log('Using placeholder tasks for inspecting status');
    } else {
      // Load real service tasks from serviceProgress
      if (trackingData.serviceProgress && trackingData.serviceProgress.tasks) {
        console.log('Found service progress:', trackingData.serviceProgress.tasks.length, 'tasks');
        tasks = trackingData.serviceProgress.tasks;
        
        // Use the stored progress percentage or calculate it
        progress = trackingData.serviceProgress.progressPercentage || calculateProgress(trackingData.serviceProgress.tasks);
        console.log('Progress:', progress + '%');
      } else {
        console.log('No service progress found for booking');
        tasks = [];
        progress = 0;
      }
    }
    
    // Validate data consistency
    const isConsistent = trackingDataSync.validateDataConsistency(bookingId);
    if (!isConsistent) {
      console.warn('Data consistency issues detected');
    }
    
    console.log('=== Enhanced Data Loading Complete ===');
    
    return {
      booking: foundBooking,
      tasks,
      isInspected,
      progress,
      error: null
    };
    
  } catch (error) {
    console.error('Error in enhanced loadAllData:', error);
    return {
      booking: null,
      tasks: [],
      isInspected: false,
      progress: 0,
      error: 'Failed to load tracking data'
    };
  }
};
