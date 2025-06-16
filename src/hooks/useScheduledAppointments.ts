
import { useState, useEffect, useCallback } from 'react';
import { Booking } from '@/types/booking';
import { fetchBookingsFromSupabase } from '@/services/bookingDataService';
import { loadBookingsFromLocalStorage } from '@/utils/bookingStorageFallback';
import { useBookingSubscription } from '@/hooks/useBookingSubscription';
import { logAppointmentDebugInfo } from '@/utils/appointmentDebugger';

export const useScheduledAppointments = (statusFilter?: string[]) => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    
    try {
      const bookings = await fetchBookingsFromSupabase(statusFilter);
      setAppointments(bookings);
    } catch (error) {
      console.error('Error loading appointments from database:', error);
      
      // Fallback to localStorage for backward compatibility
      const fallbackBookings = loadBookingsFromLocalStorage(statusFilter);
      setAppointments(fallbackBookings);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Set up real-time subscription
  useBookingSubscription(loadAppointments);

  // Debug logging
  useEffect(() => {
    logAppointmentDebugInfo(appointments, loading, statusFilter);
  }, [appointments, loading, statusFilter]);

  return { appointments, loading };
};
