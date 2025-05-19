
import { useState, useEffect } from 'react';
import { navigatePrevious, navigateNext, hasTimeConflict as checkTimeConflict } from '@/utils/dateUtils';
import { useBookingsStorage } from './planner/useBookingsStorage';
import { useBookingManagement } from './planner/useBookingManagement';
import { useScheduleFiltering } from './planner/useScheduleFiltering';
import { toast } from 'sonner';
import { Booking } from '@/types/booking';

// Update the view type to remove "monthly"
export type PlannerViewType = "daily" | "weekly";

export const usePlannerCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<PlannerViewType>("daily");
  
  // Get bookings from localStorage
  const { 
    pendingBookings, 
    setPendingBookings, 
    confirmedBookings, 
    setConfirmedBookings,
    syncBookings // New function to sync bookings with localStorage
  } = useBookingsStorage();
  
  // Get booking management functions
  const { 
    handleConfirmBooking, 
    handleCancelBooking, 
    getBookingBackground 
  } = useBookingManagement(pendingBookings, setPendingBookings, confirmedBookings, setConfirmedBookings);
  
  // Get filtered schedule data
  const { filteredBookings, schedule } = useScheduleFiltering(date, view, confirmedBookings, pendingBookings);

  // Ensure we sync bookings with localStorage on any changes
  useEffect(() => {
    syncBookings(pendingBookings, confirmedBookings);
  }, [pendingBookings, confirmedBookings, syncBookings]);
  
  // Enhanced handle confirm function to include start/end times
  const enhancedHandleConfirmBooking = (bookingId: string, selectedStaff: string[], travelMinutes: number) => {
    const booking = pendingBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Calculate start and end time based on booking time
    const startTime = booking.time || "09:00";
    const [startHour, startMin] = startTime.split(':').map(num => parseInt(num, 10));
    
    // Calculate duration - default to 2 hours if no specific duration info
    const duration = booking.duration ? parseInt(booking.duration, 10) : 120;
    
    // Calculate end time
    const endHour = startHour + Math.floor(duration / 60);
    const endMin = startMin + (duration % 60);
    
    // Format end time
    const formattedEndHour = (endHour < 10 ? '0' : '') + endHour.toString();
    const formattedEndMin = (endMin < 10 ? '0' : '') + endMin.toString();
    const endTime = `${formattedEndHour}:${formattedEndMin}`;
    
    // Create enriched booking with time slots
    const enrichedBooking = {
      ...booking,
      startTime: startTime,
      endTime: endTime
    };
    
    // Call original confirm handler with enriched booking
    handleConfirmBooking(bookingId, selectedStaff, travelMinutes, enrichedBooking);
    
    // Show success toast
    toast.success(`Booking for ${booking.customer} has been scheduled.`, {
      description: `${startTime} - ${endTime} with ${selectedStaff.join(' & ')}`
    });
  };
  
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
    handleConfirmBooking: enhancedHandleConfirmBooking,
    handleCancelBooking,
    getBookingBackground,
    hasBookingsOnDate,
    checkTimeConflict: (checkDate: Date, time: string) => checkTimeConflict(checkDate, time, confirmedBookings)
  };
};
