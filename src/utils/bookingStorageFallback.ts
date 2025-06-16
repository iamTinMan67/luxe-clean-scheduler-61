
import { Booking } from '@/types/booking';

export const loadBookingsFromLocalStorage = (statusFilter?: string[]): Booking[] => {
  try {
    console.log("Falling back to localStorage");
    const confirmedBookings = localStorage.getItem('confirmedBookings');
    const pendingBookings = localStorage.getItem('pendingBookings');
    
    let allBookings: Booking[] = [];
    
    if (confirmedBookings) {
      const confirmed = JSON.parse(confirmedBookings);
      allBookings = [...allBookings, ...confirmed];
    }
    
    if (pendingBookings) {
      const pending = JSON.parse(pendingBookings);
      allBookings = [...allBookings, ...pending];
    }
    
    // Convert date strings to Date objects
    const processedBookings = allBookings.map(booking => ({
      ...booking,
      date: booking.date instanceof Date ? booking.date : new Date(booking.date)
    }));
    
    // Apply status filter if provided
    const filteredBookings = statusFilter && statusFilter.length > 0 
      ? processedBookings.filter(booking => statusFilter.includes(booking.status))
      : processedBookings;
    
    console.log("Loaded from localStorage:", filteredBookings.length, "bookings");
    return filteredBookings;
  } catch (localError) {
    console.error('Error loading from localStorage:', localError);
    return [];
  }
};
