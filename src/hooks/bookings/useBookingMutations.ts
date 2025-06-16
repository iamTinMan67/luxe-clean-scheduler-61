
import { Booking } from '@/types/booking';
import { useBookingsStorage } from './useBookingsStorage';
import { syncBookingToSupabase, deleteBookingFromSupabase } from '@/services/bookingSyncService';

/**
 * Hook for booking mutation operations (update, move, delete)
 */
export const useBookingMutations = () => {
  const {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings,
    saveBookingsToStorage
  } = useBookingsStorage();

  // Update booking in the appropriate list
  const updateBooking = async (booking: Booking): Promise<void> => {
    const isConfirmed = booking.status === 'confirmed' || 
                        booking.status === 'in-progress' || 
                        booking.status === 'finished' ||
                        booking.status === 'inspecting' ||
                        booking.status === 'inspected';
                        
    if (isConfirmed) {
      const updatedBookings = confirmedBookings.map(b => 
        b.id === booking.id ? booking : b
      );
      setConfirmedBookings(updatedBookings);
      saveBookingsToStorage('confirmed', updatedBookings);
      
      // Sync to Supabase
      try {
        await syncBookingToSupabase(booking);
        console.log('Booking update synced to database');
      } catch (error) {
        console.error('Failed to sync booking update to database:', error);
      }
    } else {
      const updatedBookings = pendingBookings.map(b => 
        b.id === booking.id ? booking : b
      );
      setPendingBookings(updatedBookings);
      saveBookingsToStorage('pending', updatedBookings);
    }
  };

  // Move booking from pending to confirmed
  const moveBookingToConfirmed = async (booking: Booking): Promise<void> => {
    const updatedPending = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPending);
    saveBookingsToStorage('pending', updatedPending);
    
    const updatedConfirmed = [...confirmedBookings, booking];
    setConfirmedBookings(updatedConfirmed);
    saveBookingsToStorage('confirmed', updatedConfirmed);
    
    // Sync to Supabase
    try {
      await syncBookingToSupabase(booking);
      console.log('Booking move synced to database');
    } catch (error) {
      console.error('Failed to sync booking move to database:', error);
    }
  };

  // Delete booking
  const deleteBooking = async (booking: Booking): Promise<void> => {
    const isConfirmed = booking.status === 'confirmed' || 
                       booking.status === 'in-progress' || 
                       booking.status === 'finished' ||
                       booking.status === 'inspecting' ||
                       booking.status === 'inspected';
                       
    if (isConfirmed) {
      const updatedBookings = confirmedBookings.filter(b => b.id !== booking.id);
      setConfirmedBookings(updatedBookings);
      saveBookingsToStorage('confirmed', updatedBookings);
    } else {
      const updatedBookings = pendingBookings.filter(b => b.id !== booking.id);
      setPendingBookings(updatedBookings);
      saveBookingsToStorage('pending', updatedBookings);
    }
    
    // Delete from Supabase
    try {
      await deleteBookingFromSupabase(booking.id);
      console.log('Booking deletion synced to database');
    } catch (error) {
      console.error('Failed to sync booking deletion to database:', error);
    }
  };

  return {
    pendingBookings,
    confirmedBookings,
    updateBooking,
    moveBookingToConfirmed,
    deleteBooking
  };
};
