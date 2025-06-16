
import { Booking } from '@/types/booking';
import { syncBookingToSupabase } from '@/services/bookingSyncService';

export const useBookingStatus = (
  updateBooking: (booking: Booking) => Promise<void>,
  moveBookingToConfirmed: (booking: Booking) => Promise<void>
) => {
  const updateBookingStatus = async (booking: Booking, newStatus: Booking['status']) => {
    const updatedBooking: Booking = {
      ...booking,
      status: newStatus
    };
    
    // Handle status change from pending to confirmed
    if (booking.status === 'pending' && newStatus === 'confirmed') {
      await moveBookingToConfirmed(updatedBooking);
    } else {
      await updateBooking(updatedBooking);
    }
    
    // Sync to Supabase
    try {
      await syncBookingToSupabase(updatedBooking);
      console.log('Status change synced to database');
    } catch (error) {
      console.error('Failed to sync status change to database:', error);
    }
  };

  return { updateBookingStatus };
};
