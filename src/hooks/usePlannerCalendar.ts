
import { useState } from 'react';
import { navigatePrevious, navigateNext } from '@/utils/dateUtils';
import { useBookingsStorage } from './planner/useBookingsStorage';
import { useBookingManagement } from './planner/useBookingManagement';
import { useScheduleFiltering } from './planner/useScheduleFiltering';

export const usePlannerCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"daily" | "weekly">("daily");
  
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
    getBookingBackground
  };
};
