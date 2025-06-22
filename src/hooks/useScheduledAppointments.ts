
import { useState, useEffect, useCallback } from 'react';
import { Booking } from '@/types/booking';
import { fetchBookingsFromSupabase } from '@/services/bookingDataService';
import { loadBookingsFromLocalStorage, clearMockDataFromStorage } from '@/utils/bookingStorageFallback';
import { useBookingSubscription } from '@/hooks/useBookingSubscription';
import { logAppointmentDebugInfo } from '@/utils/appointmentDebugger';
import { syncLocalStorageToSupabase } from '@/utils/dataSyncUtils';

export const useScheduledAppointments = (statusFilter?: string[]) => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const loadAppointments = useCallback(async () => {
    // Only show loading on initial load, not on subsequent updates
    if (!initialLoadComplete) {
      setLoading(true);
    }
    
    try {
      console.log("=== Loading Appointments Debug ===");
      console.log("Status filter:", statusFilter);
      console.log("Initial load complete:", initialLoadComplete);
      
      // Clear mock data from localStorage before proceeding
      clearMockDataFromStorage();
      
      // First, try to sync localStorage data to Supabase (with improved error handling)
      try {
        await syncLocalStorageToSupabase();
        console.log("Data sync completed");
      } catch (syncError) {
        console.warn("Data sync failed, continuing with local data:", syncError);
      }
      
      // Use the exact status filter without expansion to avoid confusion
      const exactStatusFilter = statusFilter;
      console.log("Using exact status filter:", exactStatusFilter);
      
      // Try to fetch from Supabase first
      let supabaseBookings: Booking[] = [];
      try {
        supabaseBookings = await fetchBookingsFromSupabase(exactStatusFilter);
        console.log("Supabase bookings loaded:", supabaseBookings.length);
      } catch (supabaseError) {
        console.warn("Supabase fetch failed, using localStorage only:", supabaseError);
      }
      
      // Always load from localStorage as fallback/supplement (this now includes mock data filtering)
      const localBookings = loadBookingsFromLocalStorage(exactStatusFilter);
      console.log("Local bookings loaded (after mock filtering):", localBookings.length);
      
      // Merge bookings, avoiding duplicates by ID
      const allBookings = [...supabaseBookings];
      const existingIds = new Set(supabaseBookings.map(b => b.id));
      
      // Add local bookings that aren't already in Supabase results
      localBookings.forEach(localBooking => {
        if (!existingIds.has(localBooking.id)) {
          console.log("Adding local booking not found in Supabase:", localBooking.id, localBooking.customer);
          allBookings.push(localBooking);
        }
      });
      
      console.log("=== Final Booking Results ===");
      console.log("Total merged bookings:", allBookings.length);
      console.log("Bookings details:", allBookings.map(b => ({ 
        id: b.id, 
        customer: b.customer, 
        status: b.status, 
        date: b.date,
        source: existingIds.has(b.id) ? 'supabase' : 'localStorage'
      })));
      
      setAppointments(allBookings);
    } catch (error) {
      console.error('Error loading appointments:', error);
      
      // Complete fallback to localStorage (this will also filter mock data)
      console.log("Using complete localStorage fallback");
      const fallbackBookings = loadBookingsFromLocalStorage(statusFilter);
      console.log("Fallback bookings loaded:", fallbackBookings.length);
      setAppointments(fallbackBookings);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [statusFilter, initialLoadComplete]);

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
