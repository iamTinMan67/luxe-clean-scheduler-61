
import { Booking } from '@/types/booking';
import { useBookingsStorage } from './useBookingsStorage';

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
  const updateBooking = (booking: Booking): Booking[] => {
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
      return updatedBookings;
    } else {
      const updatedBookings = pendingBookings.map(b => 
        b.id === booking.id ? booking : b
      );
      setPendingBookings(updatedBookings);
      saveBookingsToStorage('pending', updatedBookings);
      return updatedBookings;
    }
  };

  // Move booking from pending to confirmed
  const moveBookingToConfirmed = (booking: Booking): void => {
    const updatedPending = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPending);
    saveBookingsToStorage('pending', updatedPending);
    
    const updatedConfirmed = [...confirmedBookings, booking];
    setConfirmedBookings(updatedConfirmed);
    saveBookingsToStorage('confirmed', updatedConfirmed);
  };

  // Delete booking
  const deleteBooking = (booking: Booking): void => {
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
  };

  return {
    pendingBookings,
    confirmedBookings,
    updateBooking,
    moveBookingToConfirmed,
    deleteBooking
  };
};
