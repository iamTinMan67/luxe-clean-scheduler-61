
import { useState } from 'react';
import { navigatePrevious, navigateNext, hasTimeConflict as checkTimeConflict } from '@/utils/dateUtils';
import { useBookingsStorage } from './planner/useBookingsStorage';
import { useBookingManagement } from './planner/useBookingManagement';
import { useScheduleFiltering } from './planner/useScheduleFiltering';

// Update the view type to include "monthly"
export type PlannerViewType = "daily" | "weekly" | "monthly";

export const usePlannerCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<PlannerViewType>("daily");
  
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
    checkTimeConflict: (checkDate: Date, time: string) => checkTimeConflict(checkDate, time, confirmedBookings)
  };
};
