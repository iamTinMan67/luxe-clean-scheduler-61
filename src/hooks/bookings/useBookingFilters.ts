
import { Booking } from '@/types/booking';

export const useBookingFilters = (
  date: Date | undefined,
  confirmedBookings: Booking[],
  pendingBookings: Booking[]
) => {
  // Get all bookings for the selected date
  const getBookingsForDate = () => {
    const allBookings = [...confirmedBookings, ...pendingBookings];
    
    return allBookings.filter(booking => {
      const bookingDate = booking.date instanceof Date 
        ? booking.date 
        : new Date(booking.date);
      
      return date && 
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear();
    });
  };

  return {
    getBookingsForDate
  };
};
