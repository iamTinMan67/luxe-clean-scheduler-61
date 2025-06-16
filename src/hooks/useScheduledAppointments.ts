
import { useState, useEffect, useCallback } from 'react';
import { Booking } from '@/types/booking';
import { fetchBookingsFromSupabase } from '@/services/bookingDataService';
import { loadBookingsFromLocalStorage } from '@/utils/bookingStorageFallback';
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
      
      // First, try to sync localStorage data to Supabase (with improved error handling)
      try {
        await syncLocalStorageToSupabase();
        console.log("Data sync completed");
      } catch (syncError) {
        console.warn("Data sync failed, continuing with local data:", syncError);
      }
      
      // Expand status filter to include progression statuses
      let expandedStatusFilter = statusFilter;
      if (statusFilter && statusFilter.includes('confirmed')) {
        expandedStatusFilter = [...statusFilter, 'inspecting', 'inspected', 'in-progress'];
        console.log("Expanded status filter to include progression statuses:", expandedStatusFilter);
      }
      
      // Also expand 'inspected' filter to ensure we catch all relevant bookings
      if (statusFilter && statusFilter.includes('inspected')) {
        expandedStatusFilter = [...(expandedStatusFilter || statusFilter), 'confirmed', 'inspecting', 'in-progress'];
        console.log("Expanded 'inspected' filter to include related statuses:", expandedStatusFilter);
      }
      
      // Try to fetch from Supabase first
      let supabaseBookings: Booking[] = [];
      try {
        supabaseBookings = await fetchBookingsFromSupabase(expandedStatusFilter);
        console.log("Supabase bookings loaded:", supabaseBookings.length);
      } catch (supabaseError) {
        console.warn("Supabase fetch failed, using localStorage only:", supabaseError);
      }
      
      // Always load from localStorage as fallback/supplement
      const localBookings = loadBookingsFromLocalStorage(expandedStatusFilter);
      console.log("Local bookings loaded:", localBookings.length);
      
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
      
      // Complete fallback to localStorage with expanded filter
      console.log("Using complete localStorage fallback");
      let expandedStatusFilter = statusFilter;
      if (statusFilter && statusFilter.includes('confirmed')) {
        expandedStatusFilter = [...statusFilter, 'inspecting', 'inspected', 'in-progress'];
      }
      if (statusFilter && statusFilter.includes('inspected')) {
        expandedStatusFilter = [...(expandedStatusFilter || statusFilter), 'confirmed', 'inspecting', 'in-progress'];
      }
      const fallbackBookings = loadBookingsFromLocalStorage(expandedStatusFilter);
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
