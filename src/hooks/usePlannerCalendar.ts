
import { useState } from 'react';
import { navigatePrevious, navigateNext, hasTimeConflict as checkTimeConflict } from '@/utils/dateUtils';
import { useUnifiedBookings } from './useUnifiedBookings';
import { useBookingManagement } from './planner/useBookingManagement';
import { useScheduleFiltering } from './planner/useScheduleFiltering';
import { Booking } from '@/types/booking';

// Update the view type to remove "monthly"
export type PlannerViewType = "daily" | "weekly";

export const usePlannerCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<PlannerViewType>("daily");
  
  // Get unified bookings (deduplicated from all sources)
  const { 
    pendingBookings, 
    setPendingBookings, 
    confirmedBookings, 
    setConfirmedBookings 
  } = useUnifiedBookings();
  
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

  // Check if a date has bookings - only check confirmed bookings for calendar highlighting
  const hasBookingsOnDate = (checkDate: Date) => {
    return confirmedBookings.filter(booking => booking.status !== 'pending').some(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return bookingDate.getDate() === checkDate.getDate() &&
             bookingDate.getMonth() === checkDate.getMonth() &&
             bookingDate.getFullYear() === checkDate.getFullYear();
    });
  };

  // Calculate conflicts between pending bookings and existing bookings
  const calculateConflictCount = (): number => {
    if (pendingBookings.length === 0) return 0;
    
    let conflicts = 0;
    
    // Get all active bookings (confirmed, in-progress, finished)
    const activeBookings = confirmedBookings.filter(booking => 
      booking.status === 'confirmed' || 
      booking.status === 'in-progress' || 
      booking.status === 'finished' ||
      booking.status === 'inspecting' ||
      booking.status === 'inspected'
    );
    
    // Check each pending booking against active bookings for time conflicts
    pendingBookings.forEach(pendingBooking => {
      const pendingDate = pendingBooking.date instanceof Date ? 
        pendingBooking.date : new Date(pendingBooking.date);
      
      const pendingTime = pendingBooking.time || '';
      
      // If this pending booking conflicts with any active booking, increment conflicts
      if (checkTimeConflict(pendingDate, pendingTime, activeBookings)) {
        conflicts++;
      }
    });
    
    return conflicts;
  };

  const conflictCount = calculateConflictCount();

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
    checkTimeConflict: (checkDate: Date, time: string) => checkTimeConflict(checkDate, time, confirmedBookings),
    conflictCount
  };
};
