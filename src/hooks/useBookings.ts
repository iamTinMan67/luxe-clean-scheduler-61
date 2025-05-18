
import { useState } from 'react';
import { Booking } from '@/types/booking';
import { useBookingsStorage } from './planner/useBookingsStorage';
import { PlannerViewType } from './usePlannerCalendar';
import { useBookingManagement } from './bookings/useBookingManagement';
import { useBookingOperations } from './bookings/useBookingOperations';
import { useBookingManagement as usePlannerBookingManagement } from './planner/useBookingManagement';

export const useBookings = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<PlannerViewType>('daily');
  
  const { 
    pendingBookings, 
    setPendingBookings, 
    confirmedBookings, 
    setConfirmedBookings 
  } = useBookingsStorage();
  
  const { 
    handleConfirmBooking,
    handleCompleteBooking,
    handleUpdateStatus
  } = useBookingManagement(
    pendingBookings, 
    setPendingBookings, 
    confirmedBookings, 
    setConfirmedBookings
  );
  
  const {
    getBookingsForDate,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule
  } = useBookingOperations(
    date,
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings
  );
  
  const { getBookingBackground } = usePlannerBookingManagement(
    pendingBookings, 
    setPendingBookings, 
    confirmedBookings, 
    setConfirmedBookings
  );
  
  return {
    pendingBookings,
    confirmedBookings,
    date,
    setDate,
    view,
    setView,
    getBookingsForDate,
    handleConfirmBooking,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule,
    handleCompleteBooking,
    handleUpdateStatus,
    getBookingBackground
  };
};
