
import { useState } from 'react';
import { Booking } from '@/types/booking';
import { useBookingsStorage } from '@/hooks/planner/useBookingsStorage';
import { isSameDayDate } from '@/utils/dateUtils';

export const useBookingFiltering = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { pendingBookings, confirmedBookings } = useBookingsStorage();
  
  // Get all bookings for a specific date
  const getBookingsForDate = (date: Date | undefined = selectedDate) => {
    if (!date) return [];
    
    const allBookings = [...confirmedBookings, ...pendingBookings];
    
    return allBookings.filter(booking => {
      const bookingDate = booking.date instanceof Date 
        ? booking.date 
        : new Date(booking.date);
      
      return isSameDayDate(bookingDate, date);
    });
  };
  
  // Filter bookings by status
  const getBookingsByStatus = (status: string) => {
    const allBookings = [...confirmedBookings, ...pendingBookings];
    return allBookings.filter(booking => booking.status === status);
  };
  
  // Filter bookings by date range
  const getBookingsInDateRange = (startDate: Date, endDate: Date) => {
    const allBookings = [...confirmedBookings, ...pendingBookings];
    
    return allBookings.filter(booking => {
      const bookingDate = booking.date instanceof Date 
        ? booking.date 
        : new Date(booking.date);
      
      return bookingDate >= startDate && bookingDate <= endDate;
    });
  };

  return {
    selectedDate,
    setSelectedDate,
    pendingBookings,
    confirmedBookings,
    getBookingsForDate,
    getBookingsByStatus,
    getBookingsInDateRange
  };
};

export default useBookingFiltering;
