
import { useCallback } from 'react';
import { Booking } from '@/types/booking';
import { ServiceTaskItem } from '@/types/task';

export const useDataSynchronization = () => {
  
  // Synchronize booking data across all localStorage sources
  const syncBookingData = useCallback((updatedBooking: Booking) => {
    console.log('=== Syncing Booking Data ===');
    console.log('Booking to sync:', updatedBooking.id, updatedBooking.customer, updatedBooking.status);
    
    try {
      // Update in confirmedBookings
      const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
      if (confirmedBookingsStr) {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        const updatedConfirmed = confirmedBookings.map((booking: Booking) => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
        localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
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
        console.log('Updated plannerCalendarBookings');
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing booking data:', error);
      return false;
    }
  }, []);

  // Synchronize service progress data
  const syncServiceProgress = useCallback((bookingId: string, tasks: ServiceTaskItem[]) => {
    console.log('=== Syncing Service Progress ===');
    console.log('Booking ID:', bookingId);
    console.log('Tasks count:', tasks.length);
    console.log('Completed tasks:', tasks.filter(t => t.completed).length);
    
    try {
      const completedTasks = tasks.filter(task => task.completed).length;
      const totalTasks = tasks.length;
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      // Update serviceProgress
      const serviceProgress = {
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
      const existingProgressIndex = savedProgress.findIndex((p: any) => p.bookingId === bookingId);
      
      if (existingProgressIndex >= 0) {
        savedProgress[existingProgressIndex] = serviceProgress;
      } else {
        savedProgress.push(serviceProgress);
      }
      
      localStorage.setItem('serviceProgress', JSON.stringify(savedProgress));
      console.log('Updated serviceProgress:', progressPercentage + '%');
      
      // Update trackingProgress for Track My Valet
      const trackingData = {
        bookingId,
        progressPercentage,
        lastUpdated: new Date().toISOString(),
        currentStep: completedTasks === totalTasks ? 'Service Complete' : 'In Progress'
      };
      
      const existingTracking = JSON.parse(localStorage.getItem('trackingProgress') || '[]');
      const existingIndex = existingTracking.findIndex((t: any) => t.bookingId === bookingId);
      
      if (existingIndex >= 0) {
        existingTracking[existingIndex] = trackingData;
      } else {
        existingTracking.push(trackingData);
      }
      
      localStorage.setItem('trackingProgress', JSON.stringify(existingTracking));
      console.log('Updated trackingProgress');
      
      // Trigger real-time update event
      window.dispatchEvent(new CustomEvent('serviceProgressUpdate', {
        detail: { bookingId, progress: progressPercentage, status: completedTasks === totalTasks ? 'completed' : 'in-progress' }
      }));
      
      return true;
    } catch (error) {
      console.error('Error syncing service progress:', error);
      return false;
    }
  }, []);

  // Get all booking data from localStorage for debugging
  const getAllBookingData = useCallback(() => {
    const data = {
      confirmedBookings: [],
      plannerCalendarBookings: [],
      serviceProgress: [],
      trackingProgress: []
    };
    
    try {
      const confirmedStr = localStorage.getItem('confirmedBookings');
      if (confirmedStr) data.confirmedBookings = JSON.parse(confirmedStr);
      
      const plannerStr = localStorage.getItem('plannerCalendarBookings');
      if (plannerStr) data.plannerCalendarBookings = JSON.parse(plannerStr);
      
      const serviceStr = localStorage.getItem('serviceProgress');
      if (serviceStr) data.serviceProgress = JSON.parse(serviceStr);
      
      const trackingStr = localStorage.getItem('trackingProgress');
      if (trackingStr) data.trackingProgress = JSON.parse(trackingStr);
    } catch (error) {
      console.error('Error getting all booking data:', error);
    }
    
    return data;
  }, []);

  return {
    syncBookingData,
    syncServiceProgress,
    getAllBookingData
  };
};
