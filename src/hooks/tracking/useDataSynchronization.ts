
import { useCallback } from 'react';
import { Booking } from '@/types/booking';
import { ServiceTaskItem } from '@/types/task';
import { trackingDataSync } from '@/services/trackingDataSync';

export const useDataSynchronization = () => {
  
  // Synchronize booking data using the enhanced service
  const syncBookingData = useCallback((updatedBooking: Booking) => {
    console.log('=== useDataSynchronization: syncBookingData ===');
    console.log('Delegating to TrackingDataSyncService');
    
    return trackingDataSync.syncBookingData(updatedBooking);
  }, []);

  // Synchronize service progress using the enhanced service
  const syncServiceProgress = useCallback((bookingId: string, tasks: ServiceTaskItem[]) => {
    console.log('=== useDataSynchronization: syncServiceProgress ===');
    console.log('Delegating to TrackingDataSyncService');
    
    return trackingDataSync.syncServiceProgress(bookingId, tasks);
  }, []);

  // Get all booking data for debugging
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

  // Get specific tracking data for a booking
  const getTrackingData = useCallback((bookingId: string) => {
    return trackingDataSync.getTrackingData(bookingId);
  }, []);

  // Validate data consistency
  const validateConsistency = useCallback((bookingId: string) => {
    return trackingDataSync.validateDataConsistency(bookingId);
  }, []);

  return {
    syncBookingData,
    syncServiceProgress,
    getAllBookingData,
    getTrackingData,
    validateConsistency
  };
};
