
import { useState, useEffect } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';
import { loadBookingsFromLocalStorage } from '@/utils/bookingStorageFallback';

export const useBookingsStorage = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  
  // Load saved bookings from localStorage on component mount
  useEffect(() => {
    console.log("=== Planner useBookingsStorage Loading ===");
    
    // Use the standardized localStorage loading function
    const allStoredBookings = loadBookingsFromLocalStorage();
    
    // Separate into pending and confirmed bookings
    const pending = allStoredBookings.filter(booking => booking.status === 'pending');
    const confirmed = allStoredBookings.filter(booking => booking.status !== 'pending');
    
    console.log("Separated bookings:", {
      pending: pending.length,
      confirmed: confirmed.length
    });
    
    // Process pending bookings
    const processedPending = pending.map((booking: any) => ({
      ...booking,
      date: new Date(booking.date),
      // Add default time slots based on the booking time
      startTime: booking.time || "09:00",
      endTime: booking.time ? 
        `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}` : 
        "11:00",
      status: validateBookingStatus(booking.status)
    }));
    
    // Process confirmed bookings  
    const processedConfirmed = confirmed.map((booking: any) => ({
      ...booking,
      // Ensure date is a Date object
      date: new Date(booking.date),
      status: validateBookingStatus(booking.status)
    }));
    
    setPendingBookings(processedPending);
    setConfirmedBookings(processedConfirmed);
    
    console.log("Final processed bookings:", {
      pending: processedPending.length,
      confirmed: processedConfirmed.length
    });
  }, []);
  
  return {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings
  };
};
