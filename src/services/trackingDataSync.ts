
import { Booking } from '@/types/booking';
import { ServiceTaskItem } from '@/types/task';

interface TrackingProgress {
  bookingId: string;
  progressPercentage: number;
  lastUpdated: string;
  currentStep: string;
}

interface ServiceProgress {
  bookingId: string;
  tasks: ServiceTaskItem[];
  lastUpdated: string;
  progressPercentage: number;
}

export class TrackingDataSyncService {
  private static instance: TrackingDataSyncService;
  
  static getInstance(): TrackingDataSyncService {
    if (!TrackingDataSyncService.instance) {
      TrackingDataSyncService.instance = new TrackingDataSyncService();
    }
    return TrackingDataSyncService.instance;
  }

  // Unified method to sync all booking data across localStorage sources
  syncBookingData(updatedBooking: Booking): boolean {
    console.log('=== TrackingDataSyncService: Syncing Booking Data ===');
    console.log('Booking:', updatedBooking.id, updatedBooking.customer, updatedBooking.status);
    
    try {
      let syncedCount = 0;
      
      // Update in confirmedBookings
      const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
      if (confirmedBookingsStr) {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        const updatedConfirmed = confirmedBookings.map((booking: Booking) => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
        localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
        syncedCount++;
        console.log('Updated confirmedBookings');
      }
      
      // Update in plannerCalendarBookings
      const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
      if (plannerBookingsStr) {
        const plannerBookings = JSON.parse(plannerBookingsStr);
        const updatedPlanner = plannerBookings.map((booking: Booking) => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
        localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedPlanner));
        syncedCount++;
        console.log('Updated plannerCalendarBookings');
      }
      
      // Dispatch sync event for real-time updates
      this.dispatchSyncEvent('booking-updated', { 
        bookingId: updatedBooking.id, 
        booking: updatedBooking 
      });
      
      console.log(`Booking data synced across ${syncedCount} storage locations`);
      return syncedCount > 0;
    } catch (error) {
      console.error('Error syncing booking data:', error);
      return false;
    }
  }

  // Enhanced service progress synchronization
  syncServiceProgress(bookingId: string, tasks: ServiceTaskItem[]): boolean {
    console.log('=== TrackingDataSyncService: Syncing Service Progress ===');
    console.log('Booking ID:', bookingId);
    console.log('Tasks count:', tasks.length);
    
    try {
      const completedTasks = tasks.filter(task => task.completed).length;
      const totalTasks = tasks.length;
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      // Update serviceProgress with enhanced metadata
      const serviceProgress: ServiceProgress = {
        bookingId: bookingId,
        tasks: tasks.map(task => ({
          ...task,
          completedAt: task.completed && !task.completedAt ? new Date().toISOString() : task.completedAt,
          updatedAt: new Date().toISOString()
        })),
        lastUpdated: new Date().toISOString(),
        progressPercentage
      };
      
      const savedProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
      const existingProgressIndex = savedProgress.findIndex((p: ServiceProgress) => p.bookingId === bookingId);
      
      if (existingProgressIndex >= 0) {
        savedProgress[existingProgressIndex] = serviceProgress;
      } else {
        savedProgress.push(serviceProgress);
      }
      
      localStorage.setItem('serviceProgress', JSON.stringify(savedProgress));
      console.log('Updated serviceProgress:', progressPercentage + '%');
      
      // Update trackingProgress for Track My Valet
      const trackingData: TrackingProgress = {
        bookingId,
        progressPercentage,
        lastUpdated: new Date().toISOString(),
        currentStep: this.determineCurrentStep(completedTasks, totalTasks)
      };
      
      const existingTracking = JSON.parse(localStorage.getItem('trackingProgress') || '[]');
      const existingIndex = existingTracking.findIndex((t: TrackingProgress) => t.bookingId === bookingId);
      
      if (existingIndex >= 0) {
        existingTracking[existingIndex] = trackingData;
      } else {
        existingTracking.push(trackingData);
      }
      
      localStorage.setItem('trackingProgress', JSON.stringify(existingTracking));
      console.log('Updated trackingProgress');
      
      // Dispatch real-time update events
      this.dispatchSyncEvent('service-progress-updated', {
        bookingId,
        progress: progressPercentage,
        status: completedTasks === totalTasks ? 'completed' : 'in-progress',
        tasks: tasks
      });
      
      // Auto-update booking status if all tasks completed
      if (completedTasks === totalTasks) {
        this.handleServiceCompletion(bookingId);
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing service progress:', error);
      return false;
    }
  }

  // Determine current step based on progress
  private determineCurrentStep(completedTasks: number, totalTasks: number): string {
    if (completedTasks === 0) return 'Service Starting';
    if (completedTasks === totalTasks) return 'Service Complete';
    return `In Progress (${completedTasks}/${totalTasks} tasks)`;
  }

  // Handle service completion
  private handleServiceCompletion(bookingId: string): void {
    console.log('=== Service Completion Handler ===');
    console.log('Booking ID:', bookingId);
    
    // Find and update booking status to finished
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
    
    let foundBooking: Booking | null = null;
    
    if (confirmedBookingsStr) {
      const confirmedBookings = JSON.parse(confirmedBookingsStr);
      foundBooking = confirmedBookings.find((b: Booking) => b.id === bookingId);
    }
    
    if (!foundBooking && plannerBookingsStr) {
      const plannerBookings = JSON.parse(plannerBookingsStr);
      foundBooking = plannerBookings.find((b: Booking) => b.id === bookingId);
    }
    
    if (foundBooking && foundBooking.status !== "finished") {
      const updatedBooking = { ...foundBooking, status: "finished" as const };
      this.syncBookingData(updatedBooking);
      console.log('Auto-updated booking status to finished');
    }
  }

  // Dispatch custom events for real-time updates
  private dispatchSyncEvent(eventType: string, detail: any): void {
    const event = new CustomEvent(eventType, { detail });
    window.dispatchEvent(event);
    
    // Also dispatch the legacy event for backward compatibility
    if (eventType === 'service-progress-updated') {
      const legacyEvent = new CustomEvent('serviceProgressUpdate', { detail });
      window.dispatchEvent(legacyEvent);
    }
  }

  // Get comprehensive tracking data for debugging
  getTrackingData(bookingId: string) {
    const serviceProgress = JSON.parse(localStorage.getItem('serviceProgress') || '[]');
    const trackingProgress = JSON.parse(localStorage.getItem('trackingProgress') || '[]');
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const plannerBookings = JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]');
    
    return {
      serviceProgress: serviceProgress.find((p: ServiceProgress) => p.bookingId === bookingId),
      trackingProgress: trackingProgress.find((t: TrackingProgress) => t.bookingId === bookingId),
      confirmedBooking: confirmedBookings.find((b: Booking) => b.id === bookingId),
      plannerBooking: plannerBookings.find((b: Booking) => b.id === bookingId)
    };
  }

  // Validate data consistency
  validateDataConsistency(bookingId: string): boolean {
    const data = this.getTrackingData(bookingId);
    const issues: string[] = [];
    
    if (!data.serviceProgress && !data.trackingProgress) {
      issues.push('No progress data found');
    }
    
    if (!data.confirmedBooking && !data.plannerBooking) {
      issues.push('No booking data found');
    }
    
    if (data.serviceProgress && data.trackingProgress) {
      if (data.serviceProgress.progressPercentage !== data.trackingProgress.progressPercentage) {
        issues.push('Progress percentage mismatch');
      }
    }
    
    if (issues.length > 0) {
      console.warn('Data consistency issues for booking', bookingId, ':', issues);
      return false;
    }
    
    return true;
  }
}

export const trackingDataSync = TrackingDataSyncService.getInstance();
