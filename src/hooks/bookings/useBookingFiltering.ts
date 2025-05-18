
import { useState } from 'react';
import { Booking } from '@/types/booking';
import { isSameDayDate } from '@/utils/dateUtils';

export const useBookingFiltering = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    packageType: 'all'
  });

  // Filter bookings by date
  const getBookingsForDate = (
    date: Date | undefined, 
    bookings: Booking[]
  ): Booking[] => {
    if (!date) return [];
    
    return bookings.filter(booking => {
      const bookingDate = booking.date instanceof Date ? 
        booking.date : new Date(booking.date);
      
      return isSameDayDate(bookingDate, date);
    });
  };

  // Filter bookings by status and package type
  const filterBookings = (bookings: Booking[]): Booking[] => {
    return bookings.filter(booking => {
      const statusMatch = filters.status === 'all' || booking.status === filters.status;
      const packageMatch = filters.packageType === 'all' || booking.packageType === filters.packageType;
      return statusMatch && packageMatch;
    });
  };

  return {
    filters,
    setFilters,
    getBookingsForDate,
    filterBookings
  };
};
