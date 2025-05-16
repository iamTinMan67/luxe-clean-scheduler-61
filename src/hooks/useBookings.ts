import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { useBookingsStorage } from './planner/useBookingsStorage';
import { PlannerViewType } from './usePlannerCalendar';
import { toast } from '@/components/ui/use-toast';
import { useBookingManagement } from './planner/useBookingManagement';
import { isSameDay } from 'date-fns';

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
    handleConfirmBooking: confirmBooking, 
    handleCancelBooking: deleteBooking,
    getBookingBackground
  } = useBookingManagement(pendingBookings, setPendingBookings, confirmedBookings, setConfirmedBookings);
  
  // Get bookings for the selected date
  const getBookingsForDate = () => {
    if (!date) return [];
    
    return [...confirmedBookings, ...pendingBookings].filter(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return isSameDay(bookingDate, date);
    }).sort((a, b) => {
      // Sort by time
      const timeA = a.startTime || a.time || '00:00';
      const timeB = b.startTime || b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  };
  
  // Handler for confirming a booking
  const handleConfirmBooking = (booking: Booking) => {
    // Update booking status to confirmed
    const updatedBooking = {
      ...booking,
      status: 'confirmed' as const
    };
    
    // Default staff assignment if not already assigned
    if (!updatedBooking.staff || updatedBooking.staff.length === 0) {
      updatedBooking.staff = ['Staff1', 'Staff2'];
    }
    
    // Default travel time if not set
    if (!updatedBooking.travelMinutes) {
      updatedBooking.travelMinutes = 15; // Default 15 min travel time
    }
    
    // Confirm booking
    confirmBooking(booking.id, updatedBooking.staff, updatedBooking.travelMinutes);
    
    toast({
      description: `${booking.customer}'s booking has been confirmed.`,
    });
  };
  
  // Handler for completing a booking
  const handleCompleteBooking = (booking: Booking) => {
    // Update booking status to completed
    const completedBooking = {
      ...booking,
      status: 'completed' as const
    };
    
    // Update the confirmed bookings list
    const updatedConfirmed = confirmedBookings.map(b => 
      b.id === booking.id ? completedBooking : b
    );
    
    setConfirmedBookings(updatedConfirmed);
    
    // Save to localStorage
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    
    toast({
      description: `${booking.customer}'s booking has been marked as completed.`,
    });
  };
  
  // Handler for deleting a booking
  const handleDeleteBooking = (booking: Booking) => {
    deleteBooking(booking.id);
    
    toast({
      description: `${booking.customer}'s booking has been deleted.`,
    });
  };
  
  // Handler for changing a package
  const handlePackageChange = (booking: Booking, newPackage: string) => {
    const isConfirmed = booking.status === 'confirmed';
    
    if (isConfirmed) {
      // Update in confirmed bookings
      const updatedConfirmed = confirmedBookings.map(b => 
        b.id === booking.id ? { ...b, packageType: newPackage } : b
      );
      
      setConfirmedBookings(updatedConfirmed);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    } else {
      // Update in pending bookings
      const updatedPending = pendingBookings.map(b => 
        b.id === booking.id ? { ...b, packageType: newPackage } : b
      );
      
      setPendingBookings(updatedPending);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    }
    
    toast({
      description: `${booking.customer}'s package has been updated to ${newPackage}.`,
    });
  };
  
  // Handler for rescheduling a booking
  const handleReschedule = (booking: Booking, newDate: Date) => {
    const isConfirmed = booking.status === 'confirmed';
    
    if (isConfirmed) {
      // Update in confirmed bookings
      const updatedConfirmed = confirmedBookings.map(b => 
        b.id === booking.id ? { ...b, date: newDate } : b
      );
      
      setConfirmedBookings(updatedConfirmed);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmed));
    } else {
      // Update in pending bookings
      const updatedPending = pendingBookings.map(b => 
        b.id === booking.id ? { ...b, date: newDate } : b
      );
      
      setPendingBookings(updatedPending);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPending));
    }
    
    // Update the selected date to the rescheduled date
    setDate(newDate);
    
    toast({
      description: `${booking.customer}'s booking has been rescheduled to ${newDate.toLocaleDateString()}.`,
    });
  };
  
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
    getBookingBackground
  };
};
