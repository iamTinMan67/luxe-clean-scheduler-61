
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { fetchBookingsFromSupabase } from '@/services/bookingDataService';
import { syncMultipleBookingsToSupabase } from '@/services/bookingSyncService';
import { loadBookingsFromLocalStorage, clearMockDataFromStorage } from '@/utils/bookingStorageFallback';

export const useBookingsStorage = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookings from localStorage and Supabase
  const loadBookings = async () => {
    console.log("Loading bookings from storage and database...");
    setIsLoading(true);
    
    try {
      // Clear mock data first
      clearMockDataFromStorage();
      
      // Load from standardized localStorage function
      const allLocalBookings = loadBookingsFromLocalStorage();
      
      // Separate into pending and confirmed
      const localPending = allLocalBookings.filter(b => b.status === 'pending');
      const localConfirmed = allLocalBookings.filter(b => b.status !== 'pending');
      
      console.log("Loaded from localStorage (after mock cleanup):", {
        pending: localPending.length,
        confirmed: localConfirmed.length
      });

      // Set initial state from localStorage
      setPendingBookings(localPending);
      setConfirmedBookings(localConfirmed);

      // Try to load from Supabase
      try {
        const supabasePendingBookings = await fetchBookingsFromSupabase(['pending']);
        const supabaseConfirmedBookings = await fetchBookingsFromSupabase(['confirmed', 'in-progress', 'finished']);
        
        console.log("Loaded from Supabase:", {
          pending: supabasePendingBookings.length,
          confirmed: supabaseConfirmedBookings.length
        });

        // Merge with localStorage data (Supabase takes precedence for existing IDs)
        const mergedPending = mergBookings(localPending, supabasePendingBookings);
        const mergedConfirmed = mergBookings(localConfirmed, supabaseConfirmedBookings);

        setPendingBookings(mergedPending);
        setConfirmedBookings(mergedConfirmed);

        // Update localStorage with merged data
        localStorage.setItem('pendingBookings', JSON.stringify(mergedPending));
        localStorage.setItem('confirmedBookings', JSON.stringify(mergedConfirmed));

      } catch (supabaseError) {
        console.warn("Failed to load from Supabase, using localStorage data:", supabaseError);
      }

    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to merge bookings, avoiding duplicates
  const mergBookings = (localBookings: Booking[], supabaseBookings: Booking[]): Booking[] => {
    const merged = [...supabaseBookings];
    
    localBookings.forEach(localBooking => {
      const existsInSupabase = supabaseBookings.some(sb => sb.id === localBooking.id);
      if (!existsInSupabase) {
        merged.push(localBooking);
      }
    });

    return merged;
  };

  // Save bookings to localStorage
  const saveBookingsToStorage = () => {
    localStorage.setItem('pendingBookings', JSON.stringify(pendingBookings));
    localStorage.setItem('confirmedBookings', JSON.stringify(confirmedBookings));
  };

  // Sync localStorage bookings to Supabase
  const syncToSupabase = async () => {
    try {
      const allBookings = [...pendingBookings, ...confirmedBookings];
      if (allBookings.length > 0) {
        console.log(`Syncing ${allBookings.length} bookings to Supabase...`);
        await syncMultipleBookingsToSupabase(allBookings);
      }
    } catch (error) {
      console.error("Error syncing to Supabase:", error);
    }
  };

  // Initial load
  useEffect(() => {
    loadBookings();
  }, []);

  // Save to localStorage when bookings change
  useEffect(() => {
    if (!isLoading) {
      saveBookingsToStorage();
    }
  }, [pendingBookings, confirmedBookings, isLoading]);

  return {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings,
    isLoading,
    loadBookings,
    syncToSupabase
  };
};
