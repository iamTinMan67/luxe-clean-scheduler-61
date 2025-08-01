import { useState, useEffect, useCallback } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';
import { fetchBookingsFromSupabase } from '@/services/bookingDataService';
import { loadBookingsFromLocalStorage, clearMockDataFromStorage } from '@/utils/bookingStorageFallback';
import { useBookingSubscription } from '@/hooks/useBookingSubscription';
import { logAppointmentDebugInfo } from '@/utils/appointmentDebugger';
import { syncLocalStorageToSupabase } from '@/utils/dataSyncUtils';

interface UnifiedBookingsReturn {
  pendingBookings: Booking[];
  confirmedBookings: Booking[];
  allBookings: Booking[];
  loading: boolean;
  setPendingBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setConfirmedBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export const useUnifiedBookings = (statusFilter?: string[]): UnifiedBookingsReturn => {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const loadUnifiedBookings = useCallback(async () => {
    console.log("=== Unified Bookings Loading ===");
    
    // Only show loading on initial load
    if (!initialLoadComplete) {
      setLoading(true);
    }
    
    try {
      // Clear mock data first
      clearMockDataFromStorage();
      
      // Sync localStorage to Supabase
      try {
        await syncLocalStorageToSupabase();
        console.log("Data sync completed");
      } catch (syncError) {
        console.warn("Data sync failed, continuing with local data:", syncError);
      }
      
      // Load from both sources
      let supabaseBookings: Booking[] = [];
      try {
        // Get all bookings from Supabase (no status filter to get everything)
        supabaseBookings = await fetchBookingsFromSupabase();
        console.log("Unified: Supabase bookings loaded:", supabaseBookings.length);
      } catch (supabaseError) {
        console.warn("Unified: Supabase fetch failed:", supabaseError);
      }
      
      // Load from localStorage
      const localBookings = loadBookingsFromLocalStorage();
      console.log("Unified: Local bookings loaded:", localBookings.length);
      
      // Merge and deduplicate by ID
      const mergedBookings = [...supabaseBookings];
      const existingIds = new Set(supabaseBookings.map(b => b.id));
      
      localBookings.forEach(localBooking => {
        if (!existingIds.has(localBooking.id)) {
          console.log("Unified: Adding unique local booking:", localBooking.id, localBooking.customer);
          mergedBookings.push(localBooking);
        } else {
          console.log("Unified: Skipping duplicate booking:", localBooking.id, localBooking.customer);
        }
      });
      
      // Process all bookings to ensure consistent format
      const processedBookings = mergedBookings.map((booking: any) => ({
        ...booking,
        date: new Date(booking.date),
        status: validateBookingStatus(booking.status),
        // Add default time slots for pending bookings if missing
        startTime: booking.startTime || booking.time || "09:00",
        endTime: booking.endTime || (booking.time ? 
          `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}` : 
          "11:00"),
      }));
      
      // Apply status filter if provided
      const finalBookings = statusFilter ? 
        processedBookings.filter(booking => statusFilter.includes(booking.status)) :
        processedBookings;
      
      console.log("=== Unified Bookings Final Results ===");
      console.log("Total merged bookings:", mergedBookings.length);
      console.log("Final filtered bookings:", finalBookings.length);
      console.log("Status filter applied:", statusFilter);
      console.log("Bookings by status:", finalBookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
      
      setAllBookings(finalBookings);
    } catch (error) {
      console.error('Unified: Error loading bookings:', error);
      
      // Fallback to localStorage only
      const fallbackBookings = loadBookingsFromLocalStorage(statusFilter);
      console.log("Unified: Using complete localStorage fallback:", fallbackBookings.length);
      setAllBookings(fallbackBookings);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [statusFilter, initialLoadComplete]);

  useEffect(() => {
    loadUnifiedBookings();
  }, [loadUnifiedBookings]);

  // Set up real-time subscription
  useBookingSubscription(loadUnifiedBookings);

  // Debug logging
  useEffect(() => {
    logAppointmentDebugInfo(allBookings, loading, statusFilter);
  }, [allBookings, loading, statusFilter]);

  // Separate bookings by status
  const pendingBookings = allBookings.filter(booking => booking.status === 'pending');
  const confirmedBookings = allBookings.filter(booking => booking.status !== 'pending');

  // State setters for compatibility with existing code
  const setPendingBookings = useCallback((updateFn: React.SetStateAction<Booking[]>) => {
    setAllBookings(current => {
      const nonPending = current.filter(b => b.status !== 'pending');
      const newPending = typeof updateFn === 'function' ? 
        updateFn(current.filter(b => b.status === 'pending')) : 
        updateFn;
      return [...nonPending, ...newPending];
    });
  }, []);

  const setConfirmedBookings = useCallback((updateFn: React.SetStateAction<Booking[]>) => {
    setAllBookings(current => {
      const pending = current.filter(b => b.status === 'pending');
      const newConfirmed = typeof updateFn === 'function' ? 
        updateFn(current.filter(b => b.status !== 'pending')) : 
        updateFn;
      return [...pending, ...newConfirmed];
    });
  }, []);

  return {
    pendingBookings,
    confirmedBookings,
    allBookings,
    loading,
    setPendingBookings,
    setConfirmedBookings
  };
};