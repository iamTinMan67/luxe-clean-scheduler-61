
import { useState } from 'react';
import { navigatePrevious, navigateNext } from '@/utils/dateUtils';
import { useBookingsStorage } from './planner/useBookingsStorage';
import { useBookingManagement } from './planner/useBookingManagement';
import { useScheduleFiltering } from './planner/useScheduleFiltering';

export const usePlannerCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
  
  // Get bookings from localStorage
  const { 
    pendingBookings, 
    setPendingBookings, 
    confirmedBookings, 
    setConfirmedBookings 
  } = useBookingsStorage();
  
  // Get booking management functions
  const { 
    handleConfirmBooking, 
    handleCancelBooking, 
    getBookingBackground 
  } = useBookingManagement(pendingBookings, setPendingBookings, confirmedBookings, setConfirmedBookings);
  
  // Get filtered schedule data
  const { filteredBookings, schedule } = useScheduleFiltering(date, view, confirmedBookings, pendingBookings);
  
  // Navigation functions
  const handleNavigatePrevious = () => {
    setDate(prev => navigatePrevious(prev, view));
  };
  
  const handleNavigateNext = () => {
    setDate(prev => navigateNext(prev, view));
  };
  
  const navigateToday = () => {
    setDate(new Date());
  };

  // Check if a date has bookings
  const hasBookingsOnDate = (checkDate: Date) => {
    return [...confirmedBookings, ...pendingBookings].some(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return bookingDate.getDate() === checkDate.getDate() &&
             bookingDate.getMonth() === checkDate.getMonth() &&
             bookingDate.getFullYear() === checkDate.getFullYear();
    });
  };
  
  // Check for booking time conflicts
  const checkTimeConflict = (checkDate: Date, time: string) => {
    return confirmedBookings.some(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      
      // Check if it's the same date
      if (bookingDate.getDate() !== checkDate.getDate() ||
          bookingDate.getMonth() !== checkDate.getMonth() ||
          bookingDate.getFullYear() !== checkDate.getFullYear()) {
        return false;
      }
      
      // Compare times
      const bookingStart = booking.startTime || booking.time || "00:00";
      const bookingEnd = booking.endTime || addHoursToTimeString(bookingStart, 2); // Default 2hr duration
      const newBookingEnd = addHoursToTimeString(time, 2); // Default 2hr duration
      
      // Check for overlap
      return (time < bookingEnd && newBookingEnd > bookingStart);
    });
  };
  
  // Helper to add hours to time string
  const addHoursToTimeString = (timeString: string, hoursToAdd: number): string => {
    const [hours, minutes] = timeString.split(':').map(Number);
    let newHours = hours + hoursToAdd;
    
    // Handle overflow
    if (newHours >= 24) {
      newHours = newHours % 24;
    }
    
    return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return {
    date,
    setDate,
    view,
    setView,
    pendingBookings,
    confirmedBookings,
    filteredBookings,
    schedule,
    navigatePrevious: handleNavigatePrevious,
    navigateNext: handleNavigateNext,
    navigateToday,
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground,
    hasBookingsOnDate,
    checkTimeConflict
  };
};
