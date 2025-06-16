
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
      console.log("Loading appointments with statusFilter:", statusFilter);
      const bookings = await fetchBookingsFromSupabase(statusFilter);
      console.log("Loaded bookings from Supabase:", bookings.length);
      console.log("Bookings details:", bookings.map(b => ({ id: b.id, customer: b.customer, status: b.status, date: b.date })));
      setAppointments(bookings);
    } catch (error) {
      console.error('Error loading appointments from database:', error);
      
      // Fallback to localStorage for backward compatibility
      console.log("Falling back to localStorage");
      const fallbackBookings = loadBookingsFromLocalStorage(statusFilter);
      console.log("Loaded fallback bookings:", fallbackBookings.length);
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
